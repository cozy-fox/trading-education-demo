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

    const assets = await marketDataService.getAllAssets();
    return NextResponse.json(assets);
  } catch (error) {
    console.error('Get assets error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}

