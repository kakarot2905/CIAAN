'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Home, Users } from 'lucide-react';
import SearchBar from './SearchBar';
import DarkModeToggle from './DarkModeToggle';
import NotificationBell from './NotificationBell';

export default function Navigation() {
    const { user, logout, isAuthenticated } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">L</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">LinkDein</span>
                        </Link>

                        {isAuthenticated && (
                            <div className="hidden md:block w-96">
                                <SearchBar />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/"
                                    className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    <Home size={16} />
                                    <span>Home</span>
                                </Link>

                                <Link
                                    href="/profile"
                                    className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    <User size={16} />
                                    <span>Profile</span>
                                </Link>

                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {user?.name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {user?.name}
                                        </span>
                                    </div>

                                    <NotificationBell />
                                    {/* <DarkModeToggle /> */}

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
} 