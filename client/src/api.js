import axios from 'axios';

const API_BASE = 'http://192.168.0.157:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  getProgress: () => api.get('/profile/progress'),
  setupProfile: (formData) => api.post('/profile/setup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  requestEmailChange: (newEmail) => api.post('/profile/request-email-change', { newEmail }),
  verifyEmailChange: (data) => api.post('/profile/verify-email-change', data),
  getEnquiryCount: () => api.get('/profile/enquiry-count'),
  getDetailedEnquiries: () => api.get('/profile/enquiries'),
  getReviews: () => api.get('/profile/reviews'),
};

export const vehicleAPI = {
  addVehicle: (formData) => api.post('/vehicles/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getUserVehicles: () => api.get('/vehicles'),
  resubmitVehicle: (id) => api.post(`/vehicles/${id}/resubmit`),
  deleteMedia: (vehicleId, mediaId) => api.delete(`/vehicles/${vehicleId}/media/${mediaId}`),
  addMedia: (vehicleId, formData) => api.post(`/vehicles/${vehicleId}/media/add`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  subscribe: (vehicleId, data) => api.post(`/vehicles/${vehicleId}/subscribe`, data),
  updatePricing: (id, data) => api.post(`/vehicles/${id}/update-pricing`, data),
  updateAvailability: (id, data) => api.post(`/vehicles/${id}/availability`, data),
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getPendingVerifications: () => api.get('/admin/verifications/pending'),
  updateVerificationStatus: (id, data) => api.post(`/admin/verifications/${id}/status`, data),
  getPendingVehicles: () => api.get('/admin/vehicles/pending'),
  getRejectedVehicles: () => api.get('/admin/vehicles/rejected'),
  getApprovedVehicles: () => api.get('/admin/vehicles/approved'),
  updateVehicleStatus: (id, data) => api.post(`/admin/vehicles/${id}/status`, data),
  getMasterVehicles: () => api.get('/admin/vehicles/master'),
  addMasterVehicle: (formData) => api.post('/admin/vehicles/master', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateMasterVehicle: (id, formData) => api.post(`/admin/vehicles/master/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateMasterVehicleOrder: (id, sort_order) => api.post(`/admin/vehicles/master/${id}/order`, { sort_order }),
  updateApprovedVehicleOrder: (id, sort_order) => api.post(`/admin/vehicles/approved/${id}/order`, { sort_order }),
  getSubscriptions: () => api.get('/admin/subscriptions'),
  getEnquiries: () => api.get('/admin/enquiries'),
  getReviews: () => api.get('/admin/reviews'),
  getServices: (type) => api.get(`/admin/services?type=${type}`),
  addService: (formData) => api.post('/admin/services', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const subscriptionAPI = {
  getStatus: () => api.get('/subscriptions/status'),
};

export default api;
