import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Bearer Token from localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('newswave_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Clear token if expired
    }
    return Promise.reject(error);
  }
);

export default API;

// Auth API Calls
export const loginApi = (data) => API.post('/auth/login', data);
export const registerApi = (data) => API.post('/auth/register', data);
export const getMeApi = () => API.get('/auth/me');
export const updateProfileApi = (data) => API.put('/auth/profile', data);

// News API Calls
export const getNewsApi = (params) => API.get('/news', { params });
export const getFeaturedNewsApi = () => API.get('/news/featured');
export const getNewsByIdApi = (id) => API.get(`/news/${id}`);
export const getTrendingTopicsApi = () => API.get('/news/trending');
export const refreshNewsApi = () => API.post('/news/refresh');
export const importHistoricalNewsApi = (data) => API.post('/news/import-history', data);

// Category API Calls
export const getCategoriesApi = () => API.get('/categories');
export const getCategoryBySlugApi = (slug, params) => API.get(`/categories/${slug}`, { params });

// Bookmark API Calls
export const getBookmarksApi = () => API.get('/bookmarks');
export const toggleBookmarkApi = (articleId) => API.post('/bookmarks', { articleId });
export const checkBookmarkApi = (articleId) => API.get(`/bookmarks/check/${articleId}`);

// Analytics API Calls
export const getOverviewStatsApi = () => API.get('/analytics/overview');
export const getCategoryDistributionApi = () => API.get('/analytics/categories');
export const getSentimentDistributionApi = () => API.get('/analytics/sentiment');
export const getNewsActivityApi = (days) => API.get(`/analytics/activity?days=${days || 7}`);

// Admin API Calls
export const getAdminUsersApi = (params) => API.get('/admin/users', { params });
export const updateUserRoleApi = (id, role) => API.put(`/admin/users/${id}/role`, { role });
export const deleteUserApi = (id) => API.delete(`/admin/users/${id}`);
export const deleteArticleApi = (id) => API.delete(`/admin/news/${id}`);
export const forceFetchNewsApi = () => API.post('/admin/fetch-news');
