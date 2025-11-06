import prisma from '../config/database';

export interface CreateNotificationDto {
  userId: string;
  title: string;
  message: string;
  type: 'schedule' | 'volunteering' | 'social' | 'mental_health' | 'achievement';
  category?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export class NotificationService {
  /**
   * Create a new notification
   */
  static async createNotification(data: CreateNotificationDto) {
    return await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        category: data.category,
        actionUrl: data.actionUrl,
        metadata: data.metadata || {},
      },
    });
  }

  /**
   * Get all notifications for a user
   */
  static async getNotifications(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      isRead?: boolean;
      type?: string;
    } = {}
  ) {
    const { limit = 50, offset = 0, isRead, type } = options;

    const where: any = { userId };
    if (isRead !== undefined) {
      where.isRead = isRead;
    }
    if (type) {
      where.type = type;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      total,
      limit,
      offset,
    };
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(userId: string) {
    return await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
    return await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId, // Ensure user owns the notification
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string, userId: string) {
    return await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId, // Ensure user owns the notification
      },
    });
  }

  // Notification creation helpers by feature

  /**
   * Schedule notifications
   */
  static async createEventReminder(
    userId: string,
    eventId: string,
    eventTitle: string,
    reminderTime: string
  ) {
    return this.createNotification({
      userId,
      title: 'Event Reminder',
      message: `${eventTitle} is starting ${reminderTime}`,
      type: 'schedule',
      category: 'event_reminder',
      actionUrl: `/schedule/event/${eventId}`,
      metadata: { eventId, reminderTime },
    });
  }

  static async createTaskDueNotification(
    userId: string,
    taskId: string,
    taskTitle: string
  ) {
    return this.createNotification({
      userId,
      title: 'Task Due Today',
      message: `Don't forget: ${taskTitle} is due today`,
      type: 'schedule',
      category: 'task_due',
      actionUrl: `/schedule/task/${taskId}`,
      metadata: { taskId },
    });
  }

  /**
   * Volunteering notifications
   */
  static async createHoursApprovedNotification(
    userId: string,
    hoursId: string,
    organization: string,
    hours: number
  ) {
    return this.createNotification({
      userId,
      title: 'Hours Approved! 🎉',
      message: `Your ${hours} hours at ${organization} have been approved`,
      type: 'volunteering',
      category: 'hours_approved',
      actionUrl: `/volunteering/hours/${hoursId}`,
      metadata: { hoursId, organization, hours },
    });
  }

  static async createHoursRejectedNotification(
    userId: string,
    hoursId: string,
    organization: string
  ) {
    return this.createNotification({
      userId,
      title: 'Hours Rejected',
      message: `Your hours at ${organization} need verification. Please update.`,
      type: 'volunteering',
      category: 'hours_rejected',
      actionUrl: `/volunteering/hours/${hoursId}`,
      metadata: { hoursId, organization },
    });
  }

  static async createVolunteerMilestoneNotification(
    userId: string,
    milestone: number
  ) {
    return this.createNotification({
      userId,
      title: 'Milestone Reached! 🏆',
      message: `Congratulations! You've reached ${milestone} volunteer hours!`,
      type: 'volunteering',
      category: 'milestone',
      actionUrl: '/volunteering',
      metadata: { milestone },
    });
  }

  /**
   * Social notifications
   */
  static async createFriendRequestNotification(
    userId: string,
    friendId: string,
    friendName: string
  ) {
    return this.createNotification({
      userId,
      title: 'New Friend Request',
      message: `${friendName} wants to be your friend`,
      type: 'social',
      category: 'friend_request',
      actionUrl: `/social/friends`,
      metadata: { friendId, friendName },
    });
  }

  static async createFriendAcceptedNotification(
    userId: string,
    friendId: string,
    friendName: string
  ) {
    return this.createNotification({
      userId,
      title: 'Friend Request Accepted',
      message: `${friendName} accepted your friend request`,
      type: 'social',
      category: 'friend_accepted',
      actionUrl: `/social/friends`,
      metadata: { friendId, friendName },
    });
  }

  static async createSocialActivityNotification(
    userId: string,
    activityId: string,
    activityTitle: string,
    activityType: string
  ) {
    return this.createNotification({
      userId,
      title: 'New Activity',
      message: `${activityTitle} - Check it out!`,
      type: 'social',
      category: 'activity',
      actionUrl: `/social/activity/${activityId}`,
      metadata: { activityId, activityType },
    });
  }

  /**
   * Mental Health notifications
   */
  static async createMoodReminderNotification(userId: string) {
    return this.createNotification({
      userId,
      title: 'Daily Check-in',
      message: "How are you feeling today? Don't forget to log your mood",
      type: 'mental_health',
      category: 'mood_reminder',
      actionUrl: '/mental-health/mood',
      metadata: {},
    });
  }

  static async createMoodStreakNotification(
    userId: string,
    streakDays: number
  ) {
    return this.createNotification({
      userId,
      title: 'Mood Streak! 🔥',
      message: `You've logged your mood for ${streakDays} days in a row!`,
      type: 'mental_health',
      category: 'mood_streak',
      actionUrl: '/mental-health',
      metadata: { streakDays },
    });
  }

  /**
   * Achievement notifications
   */
  static async createAchievementNotification(
    userId: string,
    achievementId: string,
    achievementName: string,
    achievementDescription: string
  ) {
    return this.createNotification({
      userId,
      title: 'Achievement Unlocked! 🏅',
      message: `${achievementName}: ${achievementDescription}`,
      type: 'achievement',
      category: 'achievement_unlocked',
      actionUrl: '/profile/achievements',
      metadata: { achievementId, achievementName },
    });
  }
}

