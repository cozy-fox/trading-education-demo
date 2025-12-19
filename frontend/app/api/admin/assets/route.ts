import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { requireAdmin } from '@/lib/auth';
import Asset from '@/lib/db/models/Asset';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authResult = await requireAdmin(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const { symbol, name, type, currentPrice } = body;

    if (!symbol || !name || !type || !currentPrice) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const asset = await Asset.findOneAndUpdate(
      { symbol: symbol.toUpperCase() },
      {
        symbol: symbol.toUpperCase(),
        name,
        type,
        currentPrice,
        isActive: true,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      message: 'Asset created/updated successfully',
      asset,
    });
  } catch (error) {
    console.error('Create asset error:', error);
    return NextResponse.json(
      { error: 'Failed to create/update asset' },
      { status: 500 }
    );
  }
}

