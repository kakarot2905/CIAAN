import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB, Post } from '@/lib/db';

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
        const userId = decoded.userId;

        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        // Initialize likes array if it doesn't exist
        if (!post.likes) {
            post.likes = [];
        }

        const userLikedIndex = post.likes.indexOf(userId);

        if (userLikedIndex === -1) {
            // Like the post
            post.likes.push(userId);
        } else {
            // Unlike the post
            post.likes.splice(userLikedIndex, 1);
        }

        await post.save();

        return NextResponse.json({
            message: userLikedIndex === -1 ? 'Post liked' : 'Post unliked',
            likes: post.likes,
            likeCount: post.likes.length
        });
    } catch (error) {
        console.error('Like post error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 