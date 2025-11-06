import { Response } from 'express';
import {
  VolunteerService,
  CreateVolunteerHourDto,
  UpdateVolunteerHourDto,
} from '../services/volunteer.service';
import { NotificationService } from '../services/notification.service';
import { AuthRequest } from '../types';
import { ApiResponse } from '../types';

export class VolunteerController {
  /**
   * Create a new volunteer hour entry
   * POST /api/volunteer
   */
  static async createVolunteerHour(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const data: CreateVolunteerHourDto = req.body;

    if (!data.organization || !data.description || !data.hours || !data.date) {
      res.status(400).json({
        success: false,
        error: 'Organization, description, hours, and date are required',
      } as ApiResponse);
      return;
    }

    const volunteerHour = await VolunteerService.createVolunteerHour(userId, {
      ...data,
      date: new Date(data.date),
    });

    // Create notification for volunteer hour creation
    try {
      await NotificationService.createNotification({
        userId,
        title: 'Volunteer Hours Logged',
        message: `Your ${volunteerHour.hours} hours at ${volunteerHour.organization} have been logged`,
        type: 'volunteering',
        category: 'hours_logged',
        actionUrl: `/volunteering/hours/${volunteerHour.id}`,
        metadata: { hoursId: volunteerHour.id },
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
    }

    res.status(201).json({
      success: true,
      data: volunteerHour,
      message: 'Volunteer hour entry created successfully',
    } as ApiResponse);
  }

  /**
   * Get all volunteer hours for the authenticated user
   * GET /api/volunteer
   */
  static async getVolunteerHours(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { startDate, endDate, organization, verified } = req.query;

    const filters = {
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      organization: organization as string | undefined,
      verified: verified !== undefined ? verified === 'true' : undefined,
    };

    const volunteerHours = await VolunteerService.getVolunteerHours(userId, filters);

    res.json({
      success: true,
      data: volunteerHours,
    } as ApiResponse);
  }

  /**
   * Get total volunteer hours for the authenticated user
   * GET /api/volunteer/total
   */
  static async getTotalHours(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;

    const totalHours = await VolunteerService.getTotalHours(userId);

    res.json({
      success: true,
      data: { totalHours },
    } as ApiResponse);
  }

  /**
   * Get a single volunteer hour entry by ID
   * GET /api/volunteer/:id
   */
  static async getVolunteerHourById(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    const volunteerHour = await VolunteerService.getVolunteerHourById(id, userId);

    res.json({
      success: true,
      data: volunteerHour,
    } as ApiResponse);
  }

  /**
   * Update a volunteer hour entry
   * PUT /api/volunteer/:id
   */
  static async updateVolunteerHour(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;
    const data: UpdateVolunteerHourDto = req.body;

    const updateData: UpdateVolunteerHourDto = { ...data };
    if (data.date) {
      updateData.date = new Date(data.date);
    }

    const oldVolunteerHour = await VolunteerService.getVolunteerHourById(id, userId);
    const volunteerHour = await VolunteerService.updateVolunteerHour(id, userId, updateData);

    // Create notification if hours were approved/rejected
    if (updateData.verified !== undefined && oldVolunteerHour.verified !== updateData.verified) {
      try {
        if (updateData.verified) {
          await NotificationService.createHoursApprovedNotification(
            userId,
            volunteerHour.id,
            volunteerHour.organization,
            volunteerHour.hours
          );

          // Check for milestones
          const totalHours = await VolunteerService.getTotalHours(userId);
          const milestones = [10, 50, 100, 200, 500];
          const reachedMilestone = milestones.find(m => totalHours >= m && totalHours - volunteerHour.hours < m);
          
          if (reachedMilestone) {
            await NotificationService.createVolunteerMilestoneNotification(userId, reachedMilestone);
          }
        } else {
          await NotificationService.createHoursRejectedNotification(
            userId,
            volunteerHour.id,
            volunteerHour.organization
          );
        }
      } catch (error) {
        console.error('Failed to create notification:', error);
      }
    }

    res.json({
      success: true,
      data: volunteerHour,
      message: 'Volunteer hour entry updated successfully',
    } as ApiResponse);
  }

  /**
   * Delete a volunteer hour entry
   * DELETE /api/volunteer/:id
   */
  static async deleteVolunteerHour(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    await VolunteerService.deleteVolunteerHour(id, userId);

    res.json({
      success: true,
      message: 'Volunteer hour entry deleted successfully',
    } as ApiResponse);
  }

  /**
   * Verify a volunteer hour entry by code (public endpoint for supervisors)
   * POST /api/volunteer/verify
   */
  static async verifyByCode(req: AuthRequest, res: Response): Promise<void> {
    const { verificationCode } = req.body;

    if (!verificationCode) {
      res.status(400).json({
        success: false,
        error: 'Verification code is required',
      } as ApiResponse);
      return;
    }

    const volunteerHour = await VolunteerService.verifyByCode(verificationCode);

    // Create notification for the user when verified
    try {
      await NotificationService.createHoursApprovedNotification(
        volunteerHour.userId,
        volunteerHour.id,
        volunteerHour.organization,
        volunteerHour.hours
      );

      // Check for milestones
      const totalHours = await VolunteerService.getTotalHours(volunteerHour.userId);
      const milestones = [10, 50, 100, 200, 500];
      const reachedMilestone = milestones.find(m => totalHours >= m && totalHours - volunteerHour.hours < m);
      
      if (reachedMilestone) {
        await NotificationService.createVolunteerMilestoneNotification(volunteerHour.userId, reachedMilestone);
      }
    } catch (error) {
      console.error('Failed to create notification:', error);
    }

    res.json({
      success: true,
      data: volunteerHour,
      message: 'Volunteer hour verified successfully',
    } as ApiResponse);
  }
}
