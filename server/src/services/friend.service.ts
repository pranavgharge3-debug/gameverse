import { prisma } from '../prisma/client';

export class FriendService {
  static async sendRequest(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw { status: 400, message: 'Cannot send request to yourself' };
    }
    const existing = await prisma.friendRequest.findUnique({
      where: { senderId_receiverId: { senderId: userId, receiverId: targetUserId } },
    });
    if (existing) {
      throw { status: 409, message: 'Friend request already sent' };
    }
    return prisma.friendRequest.create({
      data: {
        senderId: userId,
        receiverId: targetUserId,
      },
    });
  }

  static async acceptRequest(userId: string, requestId: string) {
    const request = await prisma.friendRequest.findUnique({ where: { id: requestId } });
    if (!request || request.receiverId !== userId) {
      throw { status: 404, message: 'Friend request not found' };
    }
    if (request.status !== 'PENDING') {
      throw { status: 400, message: 'Friend request already handled' };
    }
    await prisma.friendRequest.update({ where: { id: requestId }, data: { status: 'ACCEPTED' } });
    await prisma.friend.createMany({
      data: [
        { ownerId: request.senderId, friendId: request.receiverId },
        { ownerId: request.receiverId, friendId: request.senderId },
      ],
      skipDuplicates: true,
    });
    return { status: 'success', message: 'Friend request accepted' };
  }

  static async rejectRequest(userId: string, requestId: string) {
    const request = await prisma.friendRequest.findUnique({ where: { id: requestId } });
    if (!request || request.receiverId !== userId) {
      throw { status: 404, message: 'Friend request not found' };
    }
    await prisma.friendRequest.update({ where: { id: requestId }, data: { status: 'REJECTED' } });
    return { status: 'success', message: 'Friend request rejected' };
  }

  static async listRequests(userId: string) {
    return prisma.friendRequest.findMany({
      where: { receiverId: userId, status: 'PENDING' },
      include: { sender: { select: { id: true, username: true, avatarUrl: true } } },
    });
  }

  static async getFriends(userId: string) {
    return prisma.friend.findMany({
      where: { ownerId: userId },
      include: { friend: { select: { id: true, username: true, avatarUrl: true, rank: true, level: true } } },
    });
  }
}
