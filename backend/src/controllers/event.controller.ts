import { Response } from 'express';
import { EventService, CreateEventDto, UpdateEventDto } from '../services/event.service';
import { NotificationService } from '../services/notification.service';
import { AuthRequest } from '../types';
import { ApiResponse } from '../types';

export class EventController {
  /**
   * Create a new event
   * POST /api/events
   */
  static async createEvent(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const data: CreateEventDto = req.body;

    if (!data.title || !data.startTime || !data.category) {
      res.status(400).json({
        success: false,
        error: 'Title, startTime, and category are required',
      } as ApiResponse);
      return;
    }

    const event = await EventService.createEvent(userId, {
      ...data,
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : undefined,
    });

    // Create notification for event creation
    try {
      await NotificationService.createNotification({
        userId,
        title: 'Event Created',
        message: `Your event "${event.title}" has been scheduled`,
        type: 'schedule',
        category: 'event_created',
        actionUrl: `/schedule/event/${event.id}`,
        metadata: { eventId: event.id },
      });
    } catch (error) {
      // Log error but don't fail the request
      console.error('Failed to create notification:', error);
    }

    res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully',
    } as ApiResponse);
  }

  /**
   * Get all events for the authenticated user
   * GET /api/events
   */
  static async getEvents(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { startDate, endDate, category } = req.query;

    const filters = {
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      category: category as string | undefined,
    };

    const events = await EventService.getEvents(userId, filters);

    res.json({
      success: true,
      data: events,
    } as ApiResponse);
  }

  /**
   * Get a single event by ID
   * GET /api/events/:id
   */
  static async getEventById(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    const event = await EventService.getEventById(id, userId);

    res.json({
      success: true,
      data: event,
    } as ApiResponse);
  }

  /**
   * Update an event
   * PUT /api/events/:id
   */
  static async updateEvent(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;
    const data: UpdateEventDto = req.body;

    const updateData: UpdateEventDto = { ...data };
    if (data.startTime) {
      updateData.startTime = new Date(data.startTime);
    }
    if (data.endTime) {
      updateData.endTime = new Date(data.endTime);
    }

    const event = await EventService.updateEvent(id, userId, updateData);

    res.json({
      success: true,
      data: event,
      message: 'Event updated successfully',
    } as ApiResponse);
  }

  /**
   * Delete an event
   * DELETE /api/events/:id
   */
  static async deleteEvent(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    await EventService.deleteEvent(id, userId);

    res.json({
      success: true,
      message: 'Event deleted successfully',
    } as ApiResponse);
  }
}
