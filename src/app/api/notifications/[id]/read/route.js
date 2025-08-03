import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
    try {
        const { id } = params;

        // For demo purposes, just return success
        // In a real app, you would update the notification in the database
        return NextResponse.json({
            message: 'Notification marked as read',
            notificationId: id
        });
    } catch (error) {
        console.error('Mark notification as read error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 