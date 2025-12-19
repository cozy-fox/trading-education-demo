import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { requireAdmin } from '@/lib/auth';
import Trade from '@/lib/db/models/Trade';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authResult = await requireAdmin(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    const trades = await Trade.find()
      .populate('userId', 'email firstName lastName')
      .sort({ openedAt: -1 })
      .limit(limit);

    return NextResponse.json(trades);
  } catch (error) {
    console.error('Get trades error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trades' },
      { status: 500 }
    );
  }
}

