import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB, User, Post } from '@/lib/db';

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

export async function POST(request) {
    try {
        await connectDB();

        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { content } = await request.json();

        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: 'Post content is required' },
                { status: 400 }
            );
        }

        const post = new Post({
            content: content.trim(),
            author: decoded.userId
        });

        await post.save();

        // Populate author details
        await post.populate('author', 'name');

        return NextResponse.json(
            { message: 'Post created successfully', post },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create post error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        let query = {};
        if (userId) {
            query.author = userId;
        }

        const posts = await Post.find(query)
            .populate('author', 'name')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'name' }
            })
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json({ posts });
    } catch (error) {
        console.error('Get posts error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 