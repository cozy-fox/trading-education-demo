import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { requireAuth } from '@/lib/auth';
import tradingService from '@/lib/services/tradingService';

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

    const userId = authResult.user._id.toString();
    const body = await request.json();
    const { symbol, type, quantity, orderType, limitPrice } = body;

    // Validate input
    if (!symbol || !type || !quantity) {
      return NextResponse.json(
        { error: 'Symbol, type, and quantity are required' },
        { status: 400 }
      );
    }

    if (!['BUY', 'SELL'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be BUY or SELL' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    const trade = await tradingService.executeTrade({
      userId,
      symbol,
      type,
      quantity,
      orderType: orderType || 'MARKET',
      limitPrice,
    });

    return NextResponse.json({
      message: 'Trade executed successfully',
      trade,
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Trade execution error:', error);
    const message = error instanceof Error ? error.message : 'Trade execution failed';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

