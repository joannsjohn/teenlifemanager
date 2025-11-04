import prisma from '../config/database';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { VolunteerHour, Prisma } from '@prisma/client';

export interface CreateVolunteerHourDto {
  organization: string;
  description: string;
  hours: number;
  date: Date;
  location?: string;
  supervisorEmail?: string;
  supervisorName?: string;
}

export interface UpdateVolunteerHourDto extends Partial<CreateVolunteerHourDto> {
  verified?: boolean;
}

export class VolunteerService {
  /**
   * Create a new volunteer hour entry
   */
  static async createVolunteerHour(
    userId: string,
    data: CreateVolunteerHourDto
  ): Promise<VolunteerHour> {
    // Generate verification code
    const verificationCode = this.generateVerificationCode();

    return await prisma.volunteerHour.create({
      data: {
        ...data,
        userId,
        verificationCode,
      },
    });
  }

  /**
   * Get all volunteer hours for a user
   */
  static async getVolunteerHours(
    userId: string,
    filters?: {
      startDate?: Date;
      endDate?: Date;
      organization?: string;
      verified?: boolean;
    }
  ): Promise<VolunteerHour[]> {
    const where: Prisma.VolunteerHourWhereInput = {
      userId,
    };

    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    if (filters?.organization) {
      where.organization = { contains: filters.organization, mode: 'insensitive' };
    }

    if (filters?.verified !== undefined) {
      where.verified = filters.verified;
    }

    return await prisma.volunteerHour.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    });
  }

  /**
   * Get total hours for a user
   */
  static async getTotalHours(userId: string): Promise<number> {
    const result = await prisma.volunteerHour.aggregate({
      where: { userId },
      _sum: {
        hours: true,
      },
    });

    return result._sum.hours || 0;
  }

  /**
   * Get a single volunteer hour entry by ID
   */
  static async getVolunteerHourById(
    volunteerHourId: string,
    userId: string
  ): Promise<VolunteerHour> {
    const volunteerHour = await prisma.volunteerHour.findUnique({
      where: { id: volunteerHourId },
    });

    if (!volunteerHour) {
      throw new NotFoundError('Volunteer hour entry not found');
    }

    if (volunteerHour.userId !== userId) {
      throw new AuthorizationError('You do not have access to this entry');
    }

    return volunteerHour;
  }

  /**
   * Update a volunteer hour entry
   */
  static async updateVolunteerHour(
    volunteerHourId: string,
    userId: string,
    data: UpdateVolunteerHourDto
  ): Promise<VolunteerHour> {
    // Verify ownership
    await this.getVolunteerHourById(volunteerHourId, userId);

    return await prisma.volunteerHour.update({
      where: { id: volunteerHourId },
      data,
    });
  }

  /**
   * Delete a volunteer hour entry
   */
  static async deleteVolunteerHour(volunteerHourId: string, userId: string): Promise<void> {
    // Verify ownership
    await this.getVolunteerHourById(volunteerHourId, userId);

    await prisma.volunteerHour.delete({
      where: { id: volunteerHourId },
    });
  }

  /**
   * Verify a volunteer hour entry by code (for supervisors)
   */
  static async verifyByCode(verificationCode: string): Promise<VolunteerHour> {
    const volunteerHour = await prisma.volunteerHour.findUnique({
      where: { verificationCode },
    });

    if (!volunteerHour) {
      throw new NotFoundError('Verification code not found');
    }

    return await prisma.volunteerHour.update({
      where: { id: volunteerHour.id },
      data: { verified: true },
    });
  }

  /**
   * Generate a unique verification code
   */
  private static generateVerificationCode(): string {
    return `VH-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }
}
