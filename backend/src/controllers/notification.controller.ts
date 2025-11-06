import { Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { AuthRequest } from '../types';
import { ApiResponse } from '../types';

export class NotificationController {
  /**
   * Get all notifications for the authenticated user
   * GET /api/notifications
   */
  static async getNotifications(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const isRead = req.query.isRead === 'true' ? true : req.query.isRead === 'false' ? false : undefined;
    const type = req.query.type as string | undefined;

    const result = await NotificationService.getNotifications(userId, {
      limit,
      offset,
      isRead,
      type,
    });

    res.json({
      success: true,
      data: result,
    } as ApiResponse);
  }

  /**
   * Get unread notification count
   * GET /api/notifications/unread
   */
  static async getUnreadCount(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;

    const count = await NotificationService.getUnreadCount(userId);

    res.json({
      success: true,
      data: { count },
    } as ApiResponse);
  }

  /**
   * Mark notification as read
   * PUT /api/notifications/:id/read
   */
  static async markAsRead(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const notificationId = req.params.id;

    const result = await NotificationService.markAsRead(notificationId, userId);

    if (result.count === 0) {
      res.status(404).json({
        success: false,
        error: 'Notification not found',
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
    } as ApiResponse);
  }

  /**
   * Mark all notifications as read
   * PUT /api/notifications/read-all
   */
  static async markAllAsRead(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;

    await NotificationService.markAllAsRead(userId);

    res.json({
      success: true,
      message: 'All notifications marked as read',
    } as ApiResponse);
  }

  /**
   * Delete notification
   * DELETE /api/notifications/:id
   */
  static async deleteNotification(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const notificationId = req.params.id;

    const result = await NotificationService.deleteNotification(notificationId, userId);

    if (result.count === 0) {
      res.status(404).json({
        success: false,
        error: 'Notification not found',
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      message: 'Notification deleted',
    } as ApiResponse);
  }

  /**
   * Create a test notification (development only)
   * POST /api/notifications/test
   */
  static async createTestNotification(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;

    const notification = await NotificationService.createNotification({
      userId,
      title: 'Test Notification',
      message: 'This is a test notification to verify the notification system is working!',
      type: 'achievement',
      category: 'test',
      actionUrl: '/profile',
      metadata: { test: true },
    });

    res.status(201).json({
      success: true,
      data: notification,
      message: 'Test notification created successfully',
    } as ApiResponse);
  }
}

