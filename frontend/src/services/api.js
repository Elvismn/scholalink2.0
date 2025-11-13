import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API methods for Parents
export const parentAPI = {
  getAll: (token) => api.get('/parents', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getById: (id, token) => api.get(`/parents/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  create: (data, token) => api.post('/parents', data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  update: (id, data, token) => api.put(`/parents/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  delete: (id, token) => api.delete(`/parents/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

// API methods for Staff
export const staffAPI = {
  getAll: (token) => api.get('/staff', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getById: (id, token) => api.get(`/staff/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  create: (data, token) => api.post('/staff', data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  update: (id, data, token) => api.put(`/staff/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  delete: (id, token) => api.delete(`/staff/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

// API methods for Courses
export const courseAPI = {
  getAll: (token) => api.get('/courses', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getById: (id, token) => api.get(`/courses/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  create: (data, token) => api.post('/courses', data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  update: (id, data, token) => api.put(`/courses/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  delete: (id, token) => api.delete(`/courses/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

// API methods for Curriculum
export const curriculumAPI = {
  getAll: (token) => api.get('/curriculums', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getById: (id, token) => api.get(`/curriculums/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  create: (data, token) => api.post('/curriculums', data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  update: (id, data, token) => api.put(`/curriculums/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  delete: (id, token) => api.delete(`/curriculums/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

// API methods for Classrooms
export const classroomAPI = {
  getAll: (token) => api.get('/classrooms', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getById: (id, token) => api.get(`/classrooms/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  create: (data, token) => api.post('/classrooms', data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  update: (id, data, token) => api.put(`/classrooms/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  delete: (id, token) => api.delete(`/classrooms/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

// API methods for Clubs
export const clubAPI = {
  getAll: (token) => api.get('/clubs', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getById: (id, token) => api.get(`/clubs/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  create: (data, token) => api.post('/clubs', data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  update: (id, data, token) => api.put(`/clubs/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  delete: (id, token) => api.delete(`/clubs/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

// API methods for Departments
export const departmentAPI = {
  getAll: (token) => api.get('/departments', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getById: (id, token) => api.get(`/departments/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  create: (data, token) => api.post('/departments', data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  update: (id, data, token) => api.put(`/departments/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  delete: (id, token) => api.delete(`/departments/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

// API methods for Stakeholders
export const stakeholderAPI = {
  getAll: (token) => api.get('/stakeholders', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getById: (id, token) => api.get(`/stakeholders/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  create: (data, token) => api.post('/stakeholders', data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  update: (id, data, token) => api.put(`/stakeholders/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  delete: (id, token) => api.delete(`/stakeholders/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

// API methods for Inventory
export const inventoryAPI = {
  getAll: (token) => api.get('/inventory', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getById: (id, token) => api.get(`/inventory/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  create: (data, token) => api.post('/inventory', data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  update: (id, data, token) => api.put(`/inventory/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  delete: (id, token) => api.delete(`/inventory/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

export default api;