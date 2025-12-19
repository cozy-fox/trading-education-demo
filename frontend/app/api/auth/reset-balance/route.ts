import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authResult = await requireAuth(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const user = authResult.user;
    user.demoBalance = 10000;
    await user.save();

    return NextResponse.json({
      message: 'Demo balance reset successfully',
      demoBalance: user.demoBalance,
    });
  } catch (error) {
    console.error('Reset balance error:', error);
    return NextResponse.json(
      { error: 'Failed to reset balance' },
      { status: 500 }
    );
  }
}

