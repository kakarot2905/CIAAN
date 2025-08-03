import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB, Post, Comment } from '@/lib/db';

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

export async function POST(request, { params }) {
    try {
        await connectDB();

        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const { content } = await request.json();

        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: 'Comment content is required' },
                { status: 400 }
            );
        }

        // Check if post exists
        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        // Create comment
        const comment = new Comment({
            content: content.trim(),
            author: decoded.userId,
            post: id
        });

        await comment.save();

        // Add comment to post
        post.comments.push(comment._id);
        await post.save();

        // Populate author details
        await comment.populate('author', 'name');

        return NextResponse.json(
            { message: 'Comment created successfully', comment },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create comment error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        // Check if post exists
        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        // Get comments for the post
        const comments = await Comment.find({ post: id })
            .populate('author', 'name')
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json({ comments });
    } catch (error) {
        console.error('Get comments error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 