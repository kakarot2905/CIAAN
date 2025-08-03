'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/auth';
import { Send } from 'lucide-react';

export default function CreatePost({ onPostCreated }) {
    const [isLoading, setIsLoading] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const maxChars = 500;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await apiClient.createPost(data.content);
            toast.success('Post created successfully!');
            reset();
            setCharCount(0);
            if (onPostCreated) {
                onPostCreated();
            }
        } catch (error) {
            toast.error(error.error || 'Failed to create post');
        } finally {
            setIsLoading(false);
        }
    };

    const handleContentChange = (e) => {
        const content = e.target.value;
        setCharCount(content.length);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <textarea
                        {...register('content', {
                            required: 'Post content is required',
                            maxLength: {
                                value: maxChars,
                                message: `Post cannot exceed ${maxChars} characters`
                            }
                        })}
                        onChange={handleContentChange}
                        rows="4"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.content ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                            }`}
                        placeholder="What's on your mind?"
                        disabled={isLoading}
                    />
                    {errors.content && (
                        <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {charCount}/{maxChars} characters
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || charCount === 0}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={16} />
                        <span>{isLoading ? 'Posting...' : 'Post'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
} 