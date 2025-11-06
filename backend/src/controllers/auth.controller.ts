import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../types';
import { ApiResponse } from '../types';

export class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const data: RegisterDto = req.body;

      // Validate required fields
      if (!data.email || !data.password || !data.displayName) {
        res.status(400).json({
          success: false,
          error: 'Email, password, and display name are required',
        } as ApiResponse);
        return;
      }

      const result = await AuthService.register(data);

      res.status(201).json({
        success: true,
        data: result,
        message: 'User registered successfully',
      } as ApiResponse);
    } catch (error: any) {
      // Error will be caught by error handler middleware
      throw error;
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const data: LoginDto = req.body;

      // Validate required fields
      if (!data.email || !data.password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required',
        } as ApiResponse);
        return;
      }

      const result = await AuthService.login(data);

      res.json({
        success: true,
        data: result,
        message: 'Login successful',
      } as ApiResponse);
    } catch (error: any) {
      // Error will be caught by error handler middleware
      throw error;
    }
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  static async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: 'Refresh token is required',
      } as ApiResponse);
      return;
    }

    const result = await AuthService.refreshToken(refreshToken);

    res.json({
      success: true,
      data: result,
      message: 'Token refreshed successfully',
    } as ApiResponse);
  }
}
