import axios from 'axios';

// Pre-configured Axios client instance (uses VITE_API_URL if set in production, defaults to /api for local Vite proxy)
const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg = error.response?.data?.message || error.message || 'An unexpected error occurred';
    console.error('API Error:', errorMsg);
    return Promise.reject(new Error(errorMsg));
  }
);

export const api = {
  // Dashboard Stats
  getDashboardStats: () => apiClient.get('/dashboard/stats'),

  // Clients
  getClients: () => apiClient.get('/clients'),
  getClientById: (id) => apiClient.get(`/clients/${id}`),
  createClient: (data) => apiClient.post('/clients', data),
  updateClient: (id, data) => apiClient.put(`/clients/${id}`, data),
  deleteClient: (id) => apiClient.delete(`/clients/${id}`),

  // Tasks
  getTasks: (params = {}) => apiClient.get('/tasks', { params }),
  getTaskById: (id) => apiClient.get(`/tasks/${id}`),
  createTask: (data) => apiClient.post('/tasks', data),
  updateTask: (id, data) => apiClient.put(`/tasks/${id}`, data),
  deleteTask: (id) => apiClient.delete(`/tasks/${id}`),

  // Content Planner Posts
  getContentPosts: (params = {}) => apiClient.get('/content', { params }),
  getContentPostById: (id) => apiClient.get(`/content/${id}`),
  createContentPost: (data) => apiClient.post('/content', data),
  updateContentPost: (id, data) => apiClient.put(`/content/${id}`, data),
  deleteContentPost: (id) => apiClient.delete(`/content/${id}`),

  // AI Assistant (Google Gemini)
  generateAIContent: (payload) => apiClient.post('/ai/generate', payload),
  getAIHistory: () => apiClient.get('/ai/history'),
};

export default api;
