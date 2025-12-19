import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { requireAuth } from '@/lib/auth';
import marketDataService from '@/lib/services/marketDataService';

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

    let assets = await marketDataService.getAllAssets();

    // If no assets exist, initialize them
    if (assets.length === 0) {
      console.log('No assets found, initializing market data...');
      await marketDataService.updateAllPrices();
      assets = await marketDataService.getAllAssets();
    }

    return NextResponse.json(assets);
  } catch (error) {
    console.error('Get assets error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}

