import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { requireAdmin } from '@/lib/auth';
import User from '@/lib/db/models/User';
import Trade from '@/lib/db/models/Trade';
import Asset from '@/lib/db/models/Asset';

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

    const totalUsers = await User.countDocuments();
    const totalTrades = await Trade.countDocuments();
    const openTrades = await Trade.countDocuments({ status: 'OPEN' });
    const closedTrades = await Trade.countDocuments({ status: 'CLOSED' });
    const activeAssets = await Asset.countDocuments({ isActive: true });

    return NextResponse.json({
      totalUsers,
      totalTrades,
      openTrades,
      closedTrades,
      activeAssets,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

