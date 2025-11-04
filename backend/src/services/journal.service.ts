import prisma from '../config/database';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { JournalEntry, Prisma } from '@prisma/client';

export interface CreateJournalEntryDto {
  content: string;
  isVoice?: boolean;
  audioUrl?: string;
}

export interface UpdateJournalEntryDto {
  content?: string;
  audioUrl?: string;
}

export class JournalService {
  /**
   * Create a new journal entry
   */
  static async createJournalEntry(
    userId: string,
    data: CreateJournalEntryDto
  ): Promise<JournalEntry> {
    return await prisma.journalEntry.create({
      data: {
        ...data,
        userId,
        isVoice: data.isVoice || false,
      },
    });
  }

  /**
   * Get all journal entries for a user
   */
  static async getJournalEntries(
    userId: string,
    filters?: {
      startDate?: Date;
      endDate?: Date;
      isVoice?: boolean;
    }
  ): Promise<JournalEntry[]> {
    const where: Prisma.JournalEntryWhereInput = {
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

    if (filters?.isVoice !== undefined) {
      where.isVoice = filters.isVoice;
    }

    return await prisma.journalEntry.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get a single journal entry by ID
   */
  static async getJournalEntryById(
    journalEntryId: string,
    userId: string
  ): Promise<JournalEntry> {
    const journalEntry = await prisma.journalEntry.findUnique({
      where: { id: journalEntryId },
    });

    if (!journalEntry) {
      throw new NotFoundError('Journal entry not found');
    }

    if (journalEntry.userId !== userId) {
      throw new AuthorizationError('You do not have access to this journal entry');
    }

    return journalEntry;
  }

  /**
   * Update a journal entry
   */
  static async updateJournalEntry(
    journalEntryId: string,
    userId: string,
    data: UpdateJournalEntryDto
  ): Promise<JournalEntry> {
    // Verify ownership
    await this.getJournalEntryById(journalEntryId, userId);

    return await prisma.journalEntry.update({
      where: { id: journalEntryId },
      data,
    });
  }

  /**
   * Delete a journal entry
   */
  static async deleteJournalEntry(journalEntryId: string, userId: string): Promise<void> {
    // Verify ownership
    await this.getJournalEntryById(journalEntryId, userId);

    await prisma.journalEntry.delete({
      where: { id: journalEntryId },
    });
  }
}
