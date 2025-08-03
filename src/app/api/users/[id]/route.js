import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB, User, Post } from '@/lib/db';

export async function GET(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid user ID' },
                { status: 400 }
            );
        }

        const user = await User.findById(id).select('-password');
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Get user's posts
        const posts = await Post.find({ author: id })
            .populate('author', 'name')
            .sort({ createdAt: -1 })
            .limit(20);

        return NextResponse.json({
            user,
            posts
        });
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 