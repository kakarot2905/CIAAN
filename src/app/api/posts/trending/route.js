import { NextResponse } from 'next/server';
import { connectDB, Post } from '@/lib/db';

export async function GET() {
    try {
        await connectDB();

        // Get posts from the last 7 days with the most likes
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const trendingPosts = await Post.find({
            createdAt: { $gte: sevenDaysAgo }
        })
            .populate('author', 'name')
            .sort({ createdAt: -1 })
            .limit(5)
            .then(posts => {
                // Sort by likes count manually since MongoDB doesn't support $size in sort
                return posts.sort((a, b) => {
                    const aLikes = a.likes?.length || 0;
                    const bLikes = b.likes?.length || 0;
                    if (aLikes !== bLikes) {
                        return bLikes - aLikes; // Sort by likes descending
                    }
                    return new Date(b.createdAt) - new Date(a.createdAt); // Then by date
                });
            });

        return NextResponse.json({ posts: trendingPosts });
    } catch (error) {
        console.error('Get trending posts error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 