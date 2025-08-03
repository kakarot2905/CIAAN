import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB, User } from '@/lib/db';

// Helper function to verify token
const verifyToken = (request) => {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;

    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
        return null;
    }
};

export async function GET(request) {
    try {
        await connectDB();

        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Get current user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 