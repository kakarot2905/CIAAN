'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/auth';
import Navigation from '@/components/Navigation';
import PostCard from '@/components/PostCard';
import { Loader2, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function UserProfilePage() {
    const params = useParams();
    const userId = params.id;
    const [profileData, setProfileData] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        try {
            setLoadingProfile(true);
            setError(null);
            const response = await apiClient.getUserProfile(userId);
            setProfileData(response);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            setError(error.error || 'Failed to load profile');
        } finally {
            setLoadingProfile(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchProfile();
        }
    }, [userId, fetchProfile]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {loadingProfile ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="text-red-600 text-lg mb-4">
                            {error}
                        </div>
                            <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700">
                                Go Home
                            </Link>
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
                                Posts ({profileData.posts?.length || 0})
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
                                        No posts yet.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">
                            User not found.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 