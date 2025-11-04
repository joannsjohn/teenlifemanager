import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../config/database';
import { env } from '../config/env';
import { RegisterDto, LoginDto, AuthResponse, JWTPayload } from '../types';
import { AuthenticationError, ValidationError } from '../utils/errors';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterDto): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        displayName: data.displayName,
        nickname: data.nickname || data.displayName,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        nickname: true,
        avatar: true,
        googleId: true,
        appleId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.email);

    return {
      user,
      ...tokens,
    };
  }

  /**
   * Login user
   */
  static async login(data: LoginDto): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValidPassword) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        nickname: user.nickname,
        avatar: user.avatar,
        googleId: user.googleId,
        appleId: user.appleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      ...tokens,
    };
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, env.jwtRefreshSecret) as JWTPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true },
      });

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      const secret = env.jwtSecret || 'default-secret';
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        secret,
        { expiresIn: env.jwtExpiresIn } as SignOptions
      );

      return { accessToken };
    } catch (error) {
      throw new AuthenticationError('Invalid refresh token');
    }
  }

  /**
   * Generate access and refresh tokens
   */
  private static generateTokens(userId: string, email: string): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload: JWTPayload = { userId, email };
    const secret = env.jwtSecret || 'default-secret';
    const refreshSecret = env.jwtRefreshSecret || 'default-refresh-secret';

    const accessToken = jwt.sign(payload, secret, { expiresIn: env.jwtExpiresIn } as SignOptions);
    const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: env.jwtRefreshExpiresIn } as SignOptions);

    return { accessToken, refreshToken };
  }
}
