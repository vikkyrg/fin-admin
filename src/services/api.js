import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authService = {
  login: (credentials) => api.post('/admin/auth/login', credentials),
  getProfile: () => api.get('/admin/auth/me'),
};

// Dashboard
export const dashboardService = {
  getStats: () => api.get('/enquiries/admin/stats'),
};

// Enquiries
export const enquiryService = {
  getEnquiriesByLoanType: (loanType, params) => api.get(`/enquiries/admin/by-type/${loanType}`, { params }),
  getEnquiryById: (id) => api.get(`/enquiries/admin/${id}`),
  updateStatus: (id, status) => api.patch(`/enquiries/admin/${id}/status`, { status }),
  addNote: (id, note) => api.post(`/enquiries/admin/${id}/notes`, { note }),
  deleteEnquiry: (id) => api.delete(`/enquiries/admin/${id}`),
};

// Loans
export const loanService = {
  getAllLoans: () => api.get('/loans?admin=true'),
  getLoanBySlug: (slug) => api.get(`/loans/${slug}?admin=true`),
  createLoan: (data) => api.post('/loans/admin', data),
  updateLoan: (slug, data) => api.put(`/loans/admin/${slug}`, data),
  togglePublish: (slug) => api.patch(`/loans/admin/${slug}/publish`),
};

// Blogs
export const blogService = {
  getBlogs: (params) => api.get('/blogs?admin=true', { params }),
  createBlog: (data) => api.post('/blogs/admin', data),
  updateBlog: (id, data) => api.put(`/blogs/admin/${id}`, data),
  deleteBlog: (id) => api.delete(`/blogs/admin/${id}`),
  togglePublish: (id) => api.patch(`/blogs/admin/${id}/publish`),
  getCategories: () => api.get('/blogs/categories'),
  createCategory: (data) => api.post('/blogs/admin/categories', data),
};

// Content & CMS
export const contentService = {
  getFAQs: () => api.get('/content/faqs?admin=true'),
  createFAQ: (data) => api.post('/content/admin/faqs', data),
  updateFAQ: (id, data) => api.put(`/content/admin/faqs/${id}`, data),
  deleteFAQ: (id) => api.delete(`/content/admin/faqs/${id}`),

  getPartners: () => api.get('/content/partners?admin=true'),
  createPartner: (data) => api.post('/content/admin/partners', data),
  updatePartner: (id, data) => api.put(`/content/admin/partners/${id}`, data),
  deletePartner: (id) => api.delete(`/content/admin/partners/${id}`),

  getNews: () => api.get('/content/news?admin=true'),
  createNews: (data) => api.post('/content/admin/news', data),
  updateNews: (id, data) => api.put(`/content/admin/news/${id}`, data),
  deleteNews: (id) => api.delete(`/content/admin/news/${id}`),

  getPageContent: (pageKey) => api.get(`/content/page/${pageKey}`),
  savePageContent: (pageKey, data) => api.put(`/content/admin/page/${pageKey}`, data),

  getSettings: () => api.get('/content/settings'),
  updateSettings: (data) => api.put('/content/admin/settings', data),

  getMedia: () => api.get('/content/admin/media'),
  uploadMedia: (formData) => api.post('/content/admin/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteMedia: (id) => api.delete(`/content/admin/media/${id}`),
};

export default api;
