import prisma from '../config/database';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { Organization, Prisma } from '@prisma/client';

export interface CreateOrganizationDto {
  name: string;
  description?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  categories?: string[];
}

export interface UpdateOrganizationDto extends Partial<CreateOrganizationDto> {
  isVerified?: boolean;
}

export class OrganizationService {
  /**
   * Create a new organization
   */
  static async createOrganization(
    userId: string,
    data: CreateOrganizationDto
  ): Promise<Organization> {
    return await prisma.organization.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  /**
   * Get all organizations for a user (or public/verified ones)
   */
  static async getOrganizations(
    userId?: string,
    filters?: {
      verified?: boolean;
      search?: string;
    }
  ): Promise<Organization[]> {
    const where: Prisma.OrganizationWhereInput = {};

    if (userId) {
      // Get user's organizations OR verified public organizations
      where.OR = [
        { userId },
        { isVerified: true },
      ];
    } else {
      // Only verified organizations if no user
      where.isVerified = true;
    }

    if (filters?.verified !== undefined) {
      where.isVerified = filters.verified;
    }

    if (filters?.search) {
      where.OR = [
        ...(where.OR || []),
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return await prisma.organization.findMany({
      where,
      orderBy: [
        { isVerified: 'desc' },
        { name: 'asc' },
      ],
      include: {
        _count: {
          select: {
            volunteerHours: true,
          },
        },
      },
    });
  }

  /**
   * Get a single organization by ID
   */
  static async getOrganizationById(
    organizationId: string,
    userId?: string
  ): Promise<Organization> {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        _count: {
          select: {
            volunteerHours: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    // If organization is private (has userId), check ownership
    if (organization.userId && organization.userId !== userId) {
      throw new AuthorizationError('You do not have access to this organization');
    }

    return organization;
  }

  /**
   * Update an organization
   */
  static async updateOrganization(
    organizationId: string,
    userId: string,
    data: UpdateOrganizationDto
  ): Promise<Organization> {
    // Verify ownership
    const organization = await this.getOrganizationById(organizationId, userId);
    
    if (organization.userId !== userId) {
      throw new AuthorizationError('You do not have permission to update this organization');
    }

    return await prisma.organization.update({
      where: { id: organizationId },
      data,
    });
  }

  /**
   * Delete an organization
   */
  static async deleteOrganization(organizationId: string, userId: string): Promise<void> {
    // Verify ownership
    const organization = await this.getOrganizationById(organizationId, userId);
    
    if (organization.userId !== userId) {
      throw new AuthorizationError('You do not have permission to delete this organization');
    }

    await prisma.organization.delete({
      where: { id: organizationId },
    });
  }

  /**
   * Get organizations with volunteer hours count
   */
  static async getOrganizationsWithStats(userId: string): Promise<Organization[]> {
    return await prisma.organization.findMany({
      where: {
        OR: [
          { userId },
          { isVerified: true },
        ],
      },
      include: {
        _count: {
          select: {
            volunteerHours: true,
          },
        },
      },
      orderBy: [
        { isVerified: 'desc' },
        { name: 'asc' },
      ],
    });
  }
}

