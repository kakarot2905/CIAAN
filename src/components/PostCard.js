'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { User, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import CommentSection from './CommentSection';

export default function PostCard({ post, onLikeUpdate }) {
    const { isAuthenticated } = useAuth();
    const [isLiked, setIsLiked] = useState(post.likes?.includes(post.author?._id) || false);
    const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
    const [isLiking, setIsLiking] = useState(false);
    const [showComments, setShowComments] = useState(false);

    const formatDate = (dateString) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch (error) {
            return 'Unknown time';
        }
    };

    const handleLike = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to like posts');
            return;
        }

        setIsLiking(true);
        try {
            const response = await fetch(`/api/posts/${post._id}/like`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                const newIsLiked = !isLiked;
                setIsLiked(newIsLiked);
                setLikeCount(newIsLiked ? likeCount + 1 : likeCount - 1);
                toast.success(newIsLiked ? 'Post liked!' : 'Post unliked');
                if (onLikeUpdate) {
                    onLikeUpdate(post._id, newIsLiked);
                }
            }
        } catch (error) {
            toast.error('Failed to like post');
        } finally {
            setIsLiking(false);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${post.author?.name}'s post`,
                    text: post.content,
                    url: window.location.href
                });
            } catch (error) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(post.content);
            toast.success('Post content copied to clipboard!');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-4 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                        {post.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                        <Link
                            href={`/profile/${post.author?._id}`}
                            className="font-medium text-gray-900 dark:text-white hover:text-blue-600"
                        >
                            {post.author?.name || 'Unknown User'}
                        </Link>
                        <span className="text-gray-500 text-sm">
                            {formatDate(post.createdAt)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
                {post.content}
            </div>

            {/* Engagement Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLike}
                        disabled={isLiking}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${isLiked
                            ? 'text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
                            : 'text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                        <span className="text-sm font-medium">{likeCount}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 px-3 py-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <MessageCircle size={16} />
                        <span className="text-sm font-medium">{post.comments?.length || 0}</span>
                    </button>
                </div>

                <button
                    onClick={handleShare}
                    className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 px-3 py-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    <Share2 size={16} />
                    <span className="text-sm font-medium">Share</span>
                </button>
            </div>

            {/* Comment Section */}
            {showComments && (
                <CommentSection
                    postId={post._id}
                    onCommentAdded={() => {
                        // Update comment count when a new comment is added
                        const updatedPost = { ...post, comments: [...(post.comments || []), 'new-comment'] };
                        // You could also trigger a refresh of the post data here
                    }}
                />
            )}
        </div>
    );
} 