import { prisma } from '../prisma/client';

export class NotificationService {
  static async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  static async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.update({
      where: { id: notificationId, userId },
      data: { read: true },
    });
  }

  static async createNotification(userId: string, data: { type: string; title: string; body: string; data?: Record<string, unknown> }) {
    return prisma.notification.create({
      data: {
        userId,
        type: data.type as any,
        title: data.title,
        body: data.body,
        data: data.data,
      },
    });
  }
}
