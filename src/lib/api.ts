import axios from 'axios';
import { AuthResponse, User, Video, Comment, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const response = await api.post('/users/refresh-token');
        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: FormData): Promise<AuthResponse> => {
    const response = await api.post('/users/register', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  login: async (credentials: { email?: string; username?: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await api.post('/users/logout');
    localStorage.removeItem('accessToken');
  },
  
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/users/current-user');
    return response.data;
  },
  
  getUserProfile: async (username: string): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/c/${username}`);
    return response.data;
  }
};

// Video API (placeholder - adjust endpoints based on your actual backend)
export const videoAPI = {
  getAllVideos: async (): Promise<ApiResponse<Video[]>> => {
    // Note: This endpoint doesn't exist in your backend yet
    // You'll need to create it or adjust based on your actual endpoints
    const response = await api.get('/videos');
    return response.data;
  },
  
  getVideoById: async (id: string): Promise<ApiResponse<Video>> => {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },
  
  uploadVideo: async (data: FormData): Promise<ApiResponse<Video>> => {
    const response = await api.post('/videos/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  searchVideos: async (query: string): Promise<ApiResponse<Video[]>> => {
    const response = await api.get(`/videos/search?query=${encodeURIComponent(query)}`);
    return response.data;
  }
};

// Comments API (placeholder)
export const commentAPI = {
  getVideoComments: async (videoId: string): Promise<ApiResponse<Comment[]>> => {
    const response = await api.get(`/comments/${videoId}`);
    return response.data;
  },
  
  addComment: async (videoId: string, content: string): Promise<ApiResponse<Comment>> => {
    const response = await api.post('/comments', { videoId, content });
    return response.data;
  }
};

// Subscription API (placeholder)
export const subscriptionAPI = {
  subscribe: async (channelId: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/subscribe/${channelId}`);
    return response.data;
  },
  
  getSubscriptions: async (): Promise<ApiResponse<Video[]>> => {
    const response = await api.get('/subscriptions');
    return response.data;
  }
};

export default api;