import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { requireAuth } from '@/lib/auth';
import tradingService from '@/lib/services/tradingService';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authResult = await requireAuth(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.user._id.toString();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const trades = await tradingService.getTradeHistory(userId, limit);

    return NextResponse.json(trades);
  } catch (error) {
    console.error('Get trade history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trade history' },
      { status: 500 }
    );
  }
}

