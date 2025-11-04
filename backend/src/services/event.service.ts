import prisma from '../config/database';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { Event, Prisma } from '@prisma/client';

export interface CreateEventDto {
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  category: string;
  color?: string;
  location?: string;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}

export class EventService {
  /**
   * Create a new event
   */
  static async createEvent(userId: string, data: CreateEventDto): Promise<Event> {
    return await prisma.event.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  /**
   * Get all events for a user (with optional filtering)
   */
  static async getEvents(
    userId: string,
    filters?: {
      startDate?: Date;
      endDate?: Date;
      category?: string;
    }
  ): Promise<Event[]> {
    const where: Prisma.EventWhereInput = {
      userId,
    };

    if (filters?.startDate || filters?.endDate) {
      where.startTime = {};
      if (filters.startDate) {
        where.startTime.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.startTime.lte = filters.endDate;
      }
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    return await prisma.event.findMany({
      where,
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  /**
   * Get a single event by ID
   */
  static async getEventById(eventId: string, userId: string): Promise<Event> {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    if (event.userId !== userId) {
      throw new AuthorizationError('You do not have access to this event');
    }

    return event;
  }

  /**
   * Update an event
   */
  static async updateEvent(
    eventId: string,
    userId: string,
    data: UpdateEventDto
  ): Promise<Event> {
    // Verify ownership
    await this.getEventById(eventId, userId);

    return await prisma.event.update({
      where: { id: eventId },
      data,
    });
  }

  /**
   * Delete an event
   */
  static async deleteEvent(eventId: string, userId: string): Promise<void> {
    // Verify ownership
    await this.getEventById(eventId, userId);

    await prisma.event.delete({
      where: { id: eventId },
    });
  }
}
