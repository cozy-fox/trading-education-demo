import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { connectDB } from './db/mongodb';
import User, { IUser } from './db/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export interface JWTPayload {
  userId: string;
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export async function getAuthUser(request: NextRequest): Promise<IUser | null> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);

    await connectDB();
    const user = await User.findById(decoded.userId);

    return user;
  } catch {
    return null;
  }
}

export async function requireAuth(request: NextRequest): Promise<{ user: IUser } | { error: string; status: number }> {
  const user = await getAuthUser(request);

  if (!user) {
    return { error: 'Authentication required', status: 401 };
  }

  return { user };
}

export async function requireAdmin(request: NextRequest): Promise<{ user: IUser } | { error: string; status: number }> {
  const result = await requireAuth(request);

  if ('error' in result) {
    return result;
  }

  if (!result.user.isAdmin) {
    return { error: 'Admin access required', status: 403 };
  }

  return result;
}

