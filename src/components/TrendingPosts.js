'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Flame } from 'lucide-react';
// import PostCard from './PostCard';

export default function TrendingPosts() {
    const [trendingPosts, setTrendingPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrendingPosts();
    }, []);

    const fetchTrendingPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/posts/trending');
            const data = await response.json();
            setTrendingPosts(data.posts || []);
        } catch (error) {
            console.error('Failed to fetch trending posts:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trending Posts</h3>
                </div>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (trendingPosts.length === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
                <Flame className="h-5 w-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trending Posts</h3>
            </div>

            <div className="space-y-4">
                {trendingPosts.slice(0, 3).map((post, index) => (
                    <div key={post._id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900 dark:text-white text-sm">
                                    {post.author?.name}
                                </span>
                                <span className="text-gray-500 text-xs">
                                    {post.likes?.length || 0} likes
                                </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                                {post.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 