// src/services/api.js
import { useApi } from '../hooks/useAPI';

// Custom hook for parent API
export const useParentAPI = () => {
  const api = useApi();
  
  return {
    getAll: () => api.get('/parents'),
    getById: (id) => api.get(`/parents/${id}`),
    create: (data) => api.post('/parents', data),
    update: (id, data) => api.put(`/api/parents/${id}`, data),
    delete: (id) => api.delete(`/parents/${id}`),
  };
};

// Custom hook for staff API
export const useStaffAPI = () => {
  const api = useApi();
  
  return {
    getAll: () => api.get('/staff'),
    getById: (id) => api.get(`/staff/${id}`),
    create: (data) => api.post('/staff', data),
    update: (id, data) => api.put(`/staff/${id}`, data),
    delete: (id) => api.delete(`/staff/${id}`),
  };
};

// Custom hook for student API
export const useStudentAPI = () => {
  const api = useApi();
  
  return {
    getAll: () => api.get('/students'),
    getById: (id) => api.get(`/students/${id}`),
    create: (data) => api.post('/students', data),
    update: (id, data) => api.put(`/students/${id}`, data),
    delete: (id) => api.delete(`/students/${id}`),
  };
};

// Custom hook for course API
export const useCourseAPI = () => {
  const api = useApi();
  
  return {
    getAll: () => api.get('/courses'),
    getById: (id) => api.get(`/courses/${id}`),
    create: (data) => api.post('/courses', data),
    update: (id, data) => api.put(`/courses/${id}`, data),
    delete: (id) => api.delete(`/courses/${id}`),
  };
};

// Custom hook for curriculum API
export const useCurriculumAPI = () => {
  const api = useApi();
  
  return {
    getAll: () => api.get('/curriculums'),
    getById: (id) => api.get(`/curriculums/${id}`),
    create: (data) => api.post('/curriculums', data),
    update: (id, data) => api.put(`/curriculums/${id}`, data),
    delete: (id) => api.delete(`/curriculums/${id}`),
  };
};

// Custom hook for classroom API
export const useClassroomAPI = () => {
  const api = useApi();
  
  return {
    getAll: () => api.get('/classrooms'),
    getById: (id) => api.get(`/classrooms/${id}`),
    create: (data) => api.post('/classrooms', data),
    update: (id, data) => api.put(`/classrooms/${id}`, data),
    delete: (id) => api.delete(`/classrooms/${id}`),
  };
};

// Custom hook for club API
export const useClubAPI = () => {
  const api = useApi();
  
  return {
    getAll: () => api.get('/clubs'),
    getById: (id) => api.get(`/clubs/${id}`),
    create: (data) => api.post('/clubs', data),
    update: (id, data) => api.put(`/clubs/${id}`, data),
    delete: (id) => api.delete(`/clubs/${id}`),
  };
};

// Custom hook for department API
export const useDepartmentAPI = () => {
  const api = useApi();
  
  return {
    getAll: () => api.get('/departments'),
    getById: (id) => api.get(`/departments/${id}`),
    create: (data) => api.post('/departments', data),
    update: (id, data) => api.put(`/departments/${id}`, data),
    delete: (id) => api.delete(`/departments/${id}`),
  };
};

// Custom hook for stakeholder API
export const useStakeholderAPI = () => {
  const api = useApi();
  
  return {
    getAll: () => api.get('/stakeholders'),
    getById: (id) => api.get(`/stakeholders/${id}`),
    create: (data) => api.post('/stakeholders', data),
    update: (id, data) => api.put(`/stakeholders/${id}`, data),
    delete: (id) => api.delete(`/stakeholders/${id}`),
  };
};

// Custom hook for inventory API
export const useInventoryAPI = () => {
  const api = useApi();
  
  return {
    getAll: () => api.get('/inventory'),
    getById: (id) => api.get(`/inventory/${id}`),
    create: (data) => api.post('/inventory', data),
    update: (id, data) => api.put(`/inventory/${id}`),
    delete: (id) => api.delete(`/inventory/${id}`),
  };
};

export default {
  useParentAPI,
  useStaffAPI, 
  useStudentAPI,
  useCourseAPI,
  useCurriculumAPI, 
  useClassroomAPI,
  useClubAPI,
  useDepartmentAPI, 
  useStakeholderAPI,
  useInventoryAPI
};