import { NextResponse } from 'next/server';
import { connectDB, User, Post } from '@/lib/db';

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query || query.trim().length < 2) {
            return NextResponse.json({ results: [] });
        }

        const searchRegex = new RegExp(query, 'i');

        // Search users
        const users = await User.find({
            $or: [
                { name: searchRegex },
                { email: searchRegex },
                { bio: searchRegex }
            ]
        })
            .select('name email bio')
            .limit(5);

        // Search posts
        const posts = await Post.find({
            content: searchRegex
        })
            .populate('author', 'name')
            .limit(5);

        // Combine and format results
        const results = [
            ...users.map(user => ({
                _id: user._id,
                type: 'user',
                name: user.name,
                email: user.email,
                bio: user.bio
            })),
            ...posts.map(post => ({
                _id: post._id,
                type: 'post',
                content: post.content,
                author: post.author,
                createdAt: post.createdAt
            }))
        ];

        // Sort results: users first, then posts
        results.sort((a, b) => {
            if (a.type === 'user' && b.type === 'post') return -1;
            if (a.type === 'post' && b.type === 'user') return 1;
            return 0;
        });

        return NextResponse.json({ results: results.slice(0, 10) });
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 