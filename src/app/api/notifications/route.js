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

        // For demo purposes, return some sample notifications
        const sampleNotifications = [
            {
                _id: '1',
                message: 'Welcome to LinkDein! Start connecting with professionals.',
                read: false,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
            },
            {
                _id: '2',
                message: 'Your post received 5 likes!',
                read: false,
                createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
            },
            {
                _id: '3',
                message: 'New user John Doe joined the platform.',
                read: true,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
            }
        ];

        return NextResponse.json({ notifications: sampleNotifications });
    } catch (error) {
        console.error('Get notifications error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 