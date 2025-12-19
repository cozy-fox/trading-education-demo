import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { requireAdmin } from '@/lib/auth';
import User from '@/lib/db/models/User';

export async function POST(
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

    user.demoBalance = 10000;
    await user.save();

    return NextResponse.json({
      message: 'User balance reset successfully',
      user: {
        id: user._id,
        email: user.email,
        demoBalance: user.demoBalance,
      },
    });
  } catch (error) {
    console.error('Reset user balance error:', error);
    return NextResponse.json(
      { error: 'Failed to reset user balance' },
      { status: 500 }
    );
  }
}

