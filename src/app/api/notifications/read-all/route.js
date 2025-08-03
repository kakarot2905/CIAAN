import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // For demo purposes, just return success
        // In a real app, you would update all notifications for the user
        return NextResponse.json({
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Mark all notifications as read error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 