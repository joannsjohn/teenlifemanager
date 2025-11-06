import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthRequest, JWTPayload } from '../types';
import { AuthenticationError } from '../utils/errors';
import prisma from '../config/database';

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7);

    // In development mode, allow mock tokens for testing
    if (env.nodeEnv === 'development' && token.startsWith('mock-token-')) {
      // Extract user ID from mock token format: mock-token-{userId}-{timestamp}
      const match = token.match(/^mock-token-(\d+)-/);
      if (match) {
        const userId = match[1];
        // Try to find the user, or create a mock user object
        let user = await prisma.user.findUnique({
          where: { id: userId },
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

        // If user doesn't exist, create a mock user in the database (for development)
        if (!user) {
          try {
            user = await prisma.user.create({
              data: {
                id: userId,
                email: `test${userId}@example.com`,
                displayName: `Test User ${userId}`,
                passwordHash: 'mock', // Not used for mock auth
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
          } catch (error) {
            // If user creation fails, still allow request with mock user object
            console.log('Failed to create mock user, using temporary user object');
            user = {
              id: userId,
              email: `test${userId}@example.com`,
              displayName: `Test User ${userId}`,
              nickname: null,
              avatar: null,
              googleId: null,
              appleId: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            } as any;
          }
        }

        req.user = user as any;
        return next();
      }
    }

    // Verify real JWT token
    const decoded = jwt.verify(token, env.jwtSecret || 'default-secret') as JWTPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    req.user = user as any;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AuthenticationError('Invalid token'));
    }
    next(error);
  }
};

