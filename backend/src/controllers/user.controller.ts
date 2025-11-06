import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';
import { ApiResponse } from '../types';

export class UserController {
  /**
   * Get current user profile
   * GET /api/users/me
   */
  static async getMe(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        nickname: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      data: user,
    } as ApiResponse);
  }

  /**
   * Update current user profile
   * PUT /api/users/me
   */
  static async updateMe(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { displayName, nickname, avatar, age, grade } = req.body;

    const updateData: any = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (nickname !== undefined) updateData.nickname = nickname;
    if (avatar !== undefined) updateData.avatar = avatar;
    // Note: age and grade are not in the User schema yet
    // These can be stored in a user preferences/metadata table later
    // For now, we'll accept them but not store them in the User model

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        displayName: true,
        nickname: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Return user data with age and grade if provided (stored client-side for now)
    const responseData = {
      ...user,
      ...(age !== undefined && { age }),
      ...(grade !== undefined && { grade }),
    };

    res.json({
      success: true,
      data: responseData,
      message: 'Profile updated successfully',
    } as ApiResponse);
  }

  /**
   * Get user statistics
   * GET /api/users/me/stats
   */
  static async getStats(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;

    const [eventsCount, volunteerHours, moodEntriesCount, journalEntriesCount] =
      await Promise.all([
        prisma.event.count({ where: { userId } }),
        prisma.volunteerHour.aggregate({
          where: { userId },
          _sum: { hours: true },
        }),
        prisma.moodEntry.count({ where: { userId } }),
        prisma.journalEntry.count({ where: { userId } }),
      ]);

    res.json({
      success: true,
      data: {
        eventsCount,
        totalVolunteerHours: volunteerHours._sum.hours || 0,
        moodEntriesCount,
        journalEntriesCount,
      },
    } as ApiResponse);
  }
}
