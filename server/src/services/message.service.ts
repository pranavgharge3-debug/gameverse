import { prisma } from '../prisma/client';

export class MessageService {
  static async sendMessage(
    senderId: string,
    data: {
      recipientId?: string;
      clanId?: string;
      content: string;
      mediaUrls?: string[];
    }
  ) {
    if (!data.recipientId && !data.clanId) {
      throw { status: 400, message: 'Either recipientId or clanId is required' };
    }

    if (data.recipientId && data.clanId) {
      throw { status: 400, message: 'Cannot send to both recipient and clan' };
    }

    // Verify recipient exists if provided
    if (data.recipientId) {
      const recipient = await prisma.user.findUnique({ where: { id: data.recipientId } });
      if (!recipient) {
        throw { status: 404, message: 'Recipient not found' };
      }
    }

    // Verify clan exists and user is member if provided
    if (data.clanId) {
      const clan = await prisma.clan.findUnique({ where: { id: data.clanId } });
      if (!clan) {
        throw { status: 404, message: 'Clan not found' };
      }

      const membership = await prisma.clanMember.findUnique({
        where: {
          clanId_userId: {
            clanId: data.clanId,
            userId: senderId,
          },
        },
      });

      if (!membership) {
        throw { status: 403, message: 'You must be a clan member to send messages' };
      }
    }

    return prisma.message.create({
      data: {
        senderId,
        recipientId: data.recipientId,
        clanId: data.clanId,
        content: data.content,
        mediaUrls: data.mediaUrls || [],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        recipient: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        clan: {
          select: {
            id: true,
            name: true,
            tag: true,
          },
        },
      },
    });
  }

  static async getMessages(
    userId: string,
    filters: {
      recipientId?: string;
      clanId?: string;
      limit?: number;
      offset?: number;
    }
  ) {
    if (!filters.recipientId && !filters.clanId) {
      throw { status: 400, message: 'Either recipientId or clanId is required' };
    }

    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    // For direct messages, get conversation between users
    if (filters.recipientId) {
      return prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: userId,
              recipientId: filters.recipientId,
            },
            {
              senderId: filters.recipientId,
              recipientId: userId,
            },
          ],
          clanId: null,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
          recipient: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
        take: limit,
        skip: offset,
      });
    }

    // For clan messages, get all messages in clan
    if (filters.clanId) {
      // Verify user is clan member
      const membership = await prisma.clanMember.findUnique({
        where: {
          clanId_userId: {
            clanId: filters.clanId,
            userId,
          },
        },
      });

      if (!membership) {
        throw { status: 403, message: 'You must be a clan member to view messages' };
      }

      return prisma.message.findMany({
        where: {
          clanId: filters.clanId,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
          clan: {
            select: {
              id: true,
              name: true,
              tag: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
        take: limit,
        skip: offset,
      });
    }

    return [];
  }

  static async markAsRead(messageId: string, userId: string) {
    const message = await prisma.message.findUnique({ where: { id: messageId } });

    if (!message) {
      throw { status: 404, message: 'Message not found' };
    }

    // Only recipient can mark as read
    if (message.recipientId !== userId) {
      throw { status: 403, message: 'Only recipient can mark message as read' };
    }

    return prisma.message.update({
      where: { id: messageId },
      data: { readAt: new Date() },
    });
  }

  static async getConversations(userId: string) {
    // Get all direct message conversations
    const directMessages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { recipientId: userId },
        ],
        clanId: null,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        recipient: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Group by conversation partner
    const conversations = new Map<string, any>();
    directMessages.forEach((msg) => {
      const partnerId = msg.senderId === userId ? msg.recipientId : msg.senderId;
      if (partnerId && !conversations.has(partnerId)) {
        conversations.set(partnerId, {
          partner: msg.senderId === userId ? msg.recipient : msg.sender,
          lastMessage: msg,
          unreadCount: 0, // Will be calculated separately
        });
      }
    });

    return Array.from(conversations.values());
  }

  static async getClanConversations(userId: string) {
    // Get all clans user is member of
    const clanMemberships = await prisma.clanMember.findMany({
      where: { userId },
      include: {
        clan: {
          select: {
            id: true,
            name: true,
            tag: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Get last message for each clan
    const clanConversations = await Promise.all(
      clanMemberships.map(async (membership) => {
        const lastMessage = await prisma.message.findFirst({
          where: { clanId: membership.clanId },
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        });

        return {
          clan: membership.clan,
          lastMessage,
          memberCount: await prisma.clanMember.count({
            where: { clanId: membership.clanId },
          }),
        };
      })
    );

    return clanConversations;
  }
}
