import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance with credentials
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Auth utilities
export const auth = {
    // Register user
    async register(userData) {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Registration failed' };
        }
    },

    // Login user
    async login(credentials) {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Login failed' };
        }
    },

    // Logout user
    async logout() {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    // Get current user (if needed)
    async getCurrentUser() {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            return null;
        }
    }
};

// API utilities
export const apiClient = {
    // Get posts
    async getPosts(userId = null) {
        try {
            const url = userId ? `/posts?userId=${userId}` : '/posts';
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch posts' };
        }
    },

    // Create post
    async createPost(content) {
        try {
            const response = await api.post('/posts', { content });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to create post' };
        }
    },

    // Get user profile
    async getUserProfile(userId) {
        try {
            const response = await api.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch user profile' };
        }
    }
}; 