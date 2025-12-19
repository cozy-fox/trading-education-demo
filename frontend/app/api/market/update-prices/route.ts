import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { requireAuth } from '@/lib/auth';
import marketDataService from '@/lib/services/marketDataService';

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

    await marketDataService.updateAllPrices();

    return NextResponse.json({ message: 'Prices updated successfully' });
  } catch (error) {
    console.error('Update prices error:', error);
    return NextResponse.json(
      { error: 'Failed to update prices' },
      { status: 500 }
    );
  }
}

