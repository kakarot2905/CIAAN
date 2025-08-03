'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/auth';
import Navigation from '@/components/Navigation';
import PostCard from '@/components/PostCard';
import { Loader2, User, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
    const { user, isAuthenticated, loading } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchProfile();
        }
    }, [isAuthenticated, user]);

    const fetchProfile = async () => {
        try {
            setLoadingProfile(true);
            const response = await apiClient.getUserProfile(user._id);
            setProfileData(response);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoadingProfile(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Please log in to view your profile
                        </h1>
                        <a
                            href="/login"
                            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700"
                        >
                            Sign In
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {loadingProfile ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : profileData ? (
                    <div>
                        {/* Profile Header */}
                        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-2xl font-bold">
                                        {profileData.user?.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {profileData.user?.name}
                                    </h1>
                                    <div className="flex items-center space-x-4 text-gray-600 mt-2">
                                        <div className="flex items-center space-x-1">
                                            <Mail size={16} />
                                            <span>{profileData.user?.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Calendar size={16} />
                                            <span>
                                                Joined {format(new Date(profileData.user?.createdAt), 'MMMM yyyy')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {profileData.user?.bio && (
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                                    <p className="text-gray-700">{profileData.user.bio}</p>
                                </div>
                            )}
                        </div>

                        {/* Posts */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Your Posts ({profileData.posts?.length || 0})
                            </h2>

                            {profileData.posts && profileData.posts.length > 0 ? (
                                <div className="space-y-4">
                                    {profileData.posts.map((post) => (
                                        <PostCard key={post._id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                                    <div className="text-gray-500 text-lg">
                                        You haven&apos;t posted anything yet.
                                    </div>
                                    <p className="text-gray-400 mt-2">
                                        Share your first post with the community!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">
                            Failed to load profile data.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 