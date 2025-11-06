import { Response } from 'express';
import {
  OrganizationService,
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from '../services/organization.service';
import { AuthRequest } from '../types';
import { ApiResponse } from '../types';

export class OrganizationController {
  /**
   * Create a new organization
   * POST /api/organizations
   */
  static async createOrganization(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const data: CreateOrganizationDto = req.body;

    if (!data.name) {
      res.status(400).json({
        success: false,
        error: 'Organization name is required',
      } as ApiResponse);
      return;
    }

    const organization = await OrganizationService.createOrganization(userId, data);

    res.status(201).json({
      success: true,
      data: organization,
      message: 'Organization created successfully',
    } as ApiResponse);
  }

  /**
   * Get all organizations for the authenticated user
   * GET /api/organizations
   */
  static async getOrganizations(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { verified, search } = req.query;

    const filters = {
      verified: verified !== undefined ? verified === 'true' : undefined,
      search: search as string | undefined,
    };

    const organizations = await OrganizationService.getOrganizations(userId, filters);

    res.json({
      success: true,
      data: organizations,
    } as ApiResponse);
  }

  /**
   * Get a single organization by ID
   * GET /api/organizations/:id
   */
  static async getOrganizationById(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    const organization = await OrganizationService.getOrganizationById(id, userId);

    res.json({
      success: true,
      data: organization,
    } as ApiResponse);
  }

  /**
   * Update an organization
   * PUT /api/organizations/:id
   */
  static async updateOrganization(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;
    const data: UpdateOrganizationDto = req.body;

    const organization = await OrganizationService.updateOrganization(id, userId, data);

    res.json({
      success: true,
      data: organization,
      message: 'Organization updated successfully',
    } as ApiResponse);
  }

  /**
   * Delete an organization
   * DELETE /api/organizations/:id
   */
  static async deleteOrganization(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    await OrganizationService.deleteOrganization(id, userId);

    res.json({
      success: true,
      message: 'Organization deleted successfully',
    } as ApiResponse);
  }

  /**
   * Get organizations with stats
   * GET /api/organizations/stats
   */
  static async getOrganizationsWithStats(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;

    const organizations = await OrganizationService.getOrganizationsWithStats(userId);

    res.json({
      success: true,
      data: organizations,
    } as ApiResponse);
  }
}

