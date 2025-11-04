import prisma from '../config/database';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { MoodEntry, Prisma } from '@prisma/client';

export interface CreateMoodEntryDto {
  mood: number; // 1-10 scale
  emotions: string[];
  notes?: string;
}

export interface UpdateMoodEntryDto extends Partial<CreateMoodEntryDto> {}

export class MoodService {
  /**
   * Create a new mood entry
   */
  static async createMoodEntry(userId: string, data: CreateMoodEntryDto): Promise<MoodEntry> {
    // Validate mood range
    if (data.mood < 1 || data.mood > 10) {
      throw new Error('Mood must be between 1 and 10');
    }

    return await prisma.moodEntry.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  /**
   * Get all mood entries for a user
   */
  static async getMoodEntries(
    userId: string,
    filters?: {
      startDate?: Date;
      endDate?: Date;
      minMood?: number;
      maxMood?: number;
    }
  ): Promise<MoodEntry[]> {
    const where: Prisma.MoodEntryWhereInput = {
      userId,
    };

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    if (filters?.minMood !== undefined || filters?.maxMood !== undefined) {
      where.mood = {};
      if (filters.minMood !== undefined) {
        where.mood.gte = filters.minMood;
      }
      if (filters.maxMood !== undefined) {
        where.mood.lte = filters.maxMood;
      }
    }

    return await prisma.moodEntry.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get average mood for a user over a time period
   */
  static async getAverageMood(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<number> {
    const where: Prisma.MoodEntryWhereInput = { userId };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    const result = await prisma.moodEntry.aggregate({
      where,
      _avg: {
        mood: true,
      },
    });

    return result._avg.mood || 0;
  }

  /**
   * Get a single mood entry by ID
   */
  static async getMoodEntryById(moodEntryId: string, userId: string): Promise<MoodEntry> {
    const moodEntry = await prisma.moodEntry.findUnique({
      where: { id: moodEntryId },
    });

    if (!moodEntry) {
      throw new NotFoundError('Mood entry not found');
    }

    if (moodEntry.userId !== userId) {
      throw new AuthorizationError('You do not have access to this mood entry');
    }

    return moodEntry;
  }

  /**
   * Update a mood entry
   */
  static async updateMoodEntry(
    moodEntryId: string,
    userId: string,
    data: UpdateMoodEntryDto
  ): Promise<MoodEntry> {
    // Verify ownership
    await this.getMoodEntryById(moodEntryId, userId);

    // Validate mood range if provided
    if (data.mood !== undefined && (data.mood < 1 || data.mood > 10)) {
      throw new Error('Mood must be between 1 and 10');
    }

    return await prisma.moodEntry.update({
      where: { id: moodEntryId },
      data,
    });
  }

  /**
   * Delete a mood entry
   */
  static async deleteMoodEntry(moodEntryId: string, userId: string): Promise<void> {
    // Verify ownership
    await this.getMoodEntryById(moodEntryId, userId);

    await prisma.moodEntry.delete({
      where: { id: moodEntryId },
    });
  }
}
