import { Response } from 'express';
import { MoodService, CreateMoodEntryDto, UpdateMoodEntryDto } from '../services/mood.service';
import { AuthRequest } from '../types';
import { ApiResponse } from '../types';

export class MoodController {
  /**
   * Create a new mood entry
   * POST /api/mood
   */
  static async createMoodEntry(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const data: CreateMoodEntryDto = req.body;

    if (!data.mood || !data.emotions) {
      res.status(400).json({
        success: false,
        error: 'Mood and emotions are required',
      } as ApiResponse);
      return;
    }

    try {
      const moodEntry = await MoodService.createMoodEntry(userId, data);

      res.status(201).json({
        success: true,
        data: moodEntry,
        message: 'Mood entry created successfully',
      } as ApiResponse);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      } as ApiResponse);
    }
  }

  /**
   * Get all mood entries for the authenticated user
   * GET /api/mood
   */
  static async getMoodEntries(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { startDate, endDate, minMood, maxMood } = req.query;

    const filters = {
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      minMood: minMood ? parseInt(minMood as string) : undefined,
      maxMood: maxMood ? parseInt(maxMood as string) : undefined,
    };

    const moodEntries = await MoodService.getMoodEntries(userId, filters);

    res.json({
      success: true,
      data: moodEntries,
    } as ApiResponse);
  }

  /**
   * Get average mood for the authenticated user
   * GET /api/mood/average
   */
  static async getAverageMood(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { startDate, endDate } = req.query;

    const averageMood = await MoodService.getAverageMood(
      userId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );

    res.json({
      success: true,
      data: { averageMood: Math.round(averageMood * 10) / 10 },
    } as ApiResponse);
  }

  /**
   * Get a single mood entry by ID
   * GET /api/mood/:id
   */
  static async getMoodEntryById(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    const moodEntry = await MoodService.getMoodEntryById(id, userId);

    res.json({
      success: true,
      data: moodEntry,
    } as ApiResponse);
  }

  /**
   * Update a mood entry
   * PUT /api/mood/:id
   */
  static async updateMoodEntry(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;
    const data: UpdateMoodEntryDto = req.body;

    try {
      const moodEntry = await MoodService.updateMoodEntry(id, userId, data);

      res.json({
        success: true,
        data: moodEntry,
        message: 'Mood entry updated successfully',
      } as ApiResponse);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      } as ApiResponse);
    }
  }

  /**
   * Delete a mood entry
   * DELETE /api/mood/:id
   */
  static async deleteMoodEntry(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    await MoodService.deleteMoodEntry(id, userId);

    res.json({
      success: true,
      message: 'Mood entry deleted successfully',
    } as ApiResponse);
  }
}
