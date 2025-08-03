'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, User, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const searchPosts = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setResults(data.results || []);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimer = setTimeout(searchPosts, 300);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleResultClick = (result) => {
        setShowResults(false);
        setQuery('');

        if (result.type === 'user') {
            router.push(`/profile/${result._id}`);
        } else if (result.type === 'post') {
            // For now, just navigate to home and scroll to post
            router.push('/');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setShowResults(false);
        }
    };

    return (
        <div className="relative" ref={searchRef}>
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowResults(true);
                        }}
                        placeholder="Search posts and users..."
                                                        className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('');
                                setResults([]);
                            }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </form>

            {/* Search Results Dropdown */}
            {showResults && (query.length >= 2 || results.length > 0) && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    {isSearching ? (
                        <div className="p-4 text-center text-gray-500">
                            Searching...
                        </div>
                    ) : results.length > 0 ? (
                        <div className="py-2">
                            {results.map((result) => (
                                <button
                                    key={`${result.type}-${result._id}`}
                                    onClick={() => handleResultClick(result)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3"
                                >
                                    {result.type === 'user' ? (
                                        <User className="h-5 w-5 text-blue-500" />
                                    ) : (
                                        <FileText className="h-5 w-5 text-green-500" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                                                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {result.name || result.content?.substring(0, 50)}
                                        </div>
                                                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {result.type === 'user' ? 'User' : 'Post'}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : query.length >= 2 ? (
                        <div className="p-4 text-center text-gray-500">
                            No results found
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
} 