'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { Send, User, Heart } from 'lucide-react';

export default function CommentSection({ postId, onCommentAdded }) {
    const { isAuthenticated, user } = useAuth();
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        if (showComments) {
            fetchComments();
        }
    }, [showComments, postId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/posts/${postId}/comments`);
            const data = await response.json();
            setComments(data.comments || []);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
            toast.error('Failed to load comments');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        if (!isAuthenticated) {
            toast.error('Please login to comment');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ content: data.content })
            });

            if (response.ok) {
                const result = await response.json();
                setComments(prev => [result.comment, ...prev]);
                reset();
                toast.success('Comment added successfully!');
                if (onCommentAdded) {
                    onCommentAdded();
                }
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to add comment');
            }
        } catch (error) {
            toast.error('Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch (error) {
            return 'Unknown time';
        }
    };

    return (
        <div className="mt-4">
            {/* Toggle Comments Button */}
            <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 px-3 py-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
                <span className="text-sm font-medium">
                    {showComments ? 'Hide' : 'Show'} Comments ({comments.length})
                </span>
            </button>

            {showComments && (
                <div className="mt-4 space-y-4">
                    {/* Add Comment Form */}
                    {isAuthenticated && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                                <div>
                                    <textarea
                                        {...register('content', {
                                            required: 'Comment content is required',
                                            maxLength: {
                                                value: 500,
                                                message: 'Comment cannot exceed 500 characters'
                                            }
                                        })}
                                        rows="3"
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white ${errors.content ? 'border-red-300' : 'border-gray-300 dark:border-gray-500'
                                            }`}
                                        placeholder="Write a comment..."
                                        disabled={submitting}
                                    />
                                    {errors.content && (
                                        <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                                    )}
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send size={16} />
                                        <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-3">
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                                No comments yet. Be the first to comment!
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-xs font-medium">
                                                {comment.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {comment.author?.name || 'Unknown User'}
                                                </span>
                                                <span className="text-gray-500 text-xs">
                                                    {formatDate(comment.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 