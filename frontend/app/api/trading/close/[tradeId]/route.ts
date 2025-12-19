import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { requireAuth } from '@/lib/auth';
import tradingService from '@/lib/services/tradingService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tradeId: string }> }
) {
  try {
    await connectDB();

    const authResult = await requireAuth(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { tradeId } = await params;
    const userId = authResult.user._id.toString();

    const trade = await tradingService.closeTrade(tradeId, userId);

    return NextResponse.json({
      message: 'Trade closed successfully',
      trade,
    });
  } catch (error: unknown) {
    console.error('Close trade error:', error);
    const message = error instanceof Error ? error.message : 'Failed to close trade';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

