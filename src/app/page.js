'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/auth';
import Navigation from '@/components/Navigation';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';
import TrendingPosts from '@/components/TrendingPosts';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const response = await apiClient.getPosts();
      setPosts(response.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {isAuthenticated ? (
          <>
            <CreatePost onPostCreated={fetchPosts} />

            <TrendingPosts />

            <div className="space-y-4">
              {loadingPosts ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">
                    No posts yet. Be the first to share something!
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to LinkDein
              </h1>
              <p className="text-gray-600 mb-8">
                Connect with professionals and share your thoughts with the community.
              </p>
              <div className="space-y-4">
                <a
                  href="/register"
                  className="block w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700"
                >
                  Get Started
                </a>
                <a
                  href="/login"
                  className="block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
