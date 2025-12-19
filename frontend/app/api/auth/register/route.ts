import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import Portfolio from '@/lib/db/models/Portfolio';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
    });

    await user.save();

    // Create empty portfolio
    const portfolio = new Portfolio({
      userId: user._id,
      holdings: [],
    });
    await portfolio.save();

    // Generate token
    const token = generateToken(user._id.toString());

    return NextResponse.json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        demoBalance: user.demoBalance,
        isAdmin: user.isAdmin,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

