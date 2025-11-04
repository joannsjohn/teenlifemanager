import { Response } from 'express';
import {
  JournalService,
  CreateJournalEntryDto,
  UpdateJournalEntryDto,
} from '../services/journal.service';
import { AuthRequest } from '../types';
import { ApiResponse } from '../types';

export class JournalController {
  /**
   * Create a new journal entry
   * POST /api/journal
   */
  static async createJournalEntry(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const data: CreateJournalEntryDto = req.body;

    if (!data.content) {
      res.status(400).json({
        success: false,
        error: 'Content is required',
      } as ApiResponse);
      return;
    }

    const journalEntry = await JournalService.createJournalEntry(userId, data);

    res.status(201).json({
      success: true,
      data: journalEntry,
      message: 'Journal entry created successfully',
    } as ApiResponse);
  }

  /**
   * Get all journal entries for the authenticated user
   * GET /api/journal
   */
  static async getJournalEntries(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { startDate, endDate, isVoice } = req.query;

    const filters = {
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      isVoice: isVoice !== undefined ? isVoice === 'true' : undefined,
    };

    const journalEntries = await JournalService.getJournalEntries(userId, filters);

    res.json({
      success: true,
      data: journalEntries,
    } as ApiResponse);
  }

  /**
   * Get a single journal entry by ID
   * GET /api/journal/:id
   */
  static async getJournalEntryById(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    const journalEntry = await JournalService.getJournalEntryById(id, userId);

    res.json({
      success: true,
      data: journalEntry,
    } as ApiResponse);
  }

  /**
   * Update a journal entry
   * PUT /api/journal/:id
   */
  static async updateJournalEntry(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;
    const data: UpdateJournalEntryDto = req.body;

    const journalEntry = await JournalService.updateJournalEntry(id, userId, data);

    res.json({
      success: true,
      data: journalEntry,
      message: 'Journal entry updated successfully',
    } as ApiResponse);
  }

  /**
   * Delete a journal entry
   * DELETE /api/journal/:id
   */
  static async deleteJournalEntry(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    await JournalService.deleteJournalEntry(id, userId);

    res.json({
      success: true,
      message: 'Journal entry deleted successfully',
    } as ApiResponse);
  }
}
