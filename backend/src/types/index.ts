import { Request } from 'express';
import { User } from '@prisma/client';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: User;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth types
export interface RegisterDto {
  email: string;
  password: string;
  displayName: string;
  nickname?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  accessToken: string;
  refreshToken: string;
}

