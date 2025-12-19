import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { requireAdmin } from '@/lib/auth';
import User from '@/lib/db/models/User';
import Trade from '@/lib/db/models/Trade';
import Portfolio from '@/lib/db/models/Portfolio';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();

    const authResult = await requireAdmin(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { userId } = await params;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();

    const authResult = await requireAdmin(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { userId } = await params;
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete user's trades and portfolio
    await Trade.deleteMany({ userId: user._id });
    await Portfolio.deleteOne({ userId: user._id });
    await user.deleteOne();

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

