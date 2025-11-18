// src/hooks/useApi.js
import { useAuth } from '@clerk/clerk-react';
import { useMemo } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useApi = () => {
  const { getToken, isSignedIn } = useAuth();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to include auth token
    instance.interceptors.request.use(
      async (config) => {
        console.log('🔐 useApi - Preparing request to:', config.url);
        
        if (isSignedIn) {
          try {
            const token = await getToken();
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
              console.log('✅ useApi - Token added to request');
            } else {
              console.log('⚠️ useApi - No token available');
            }
          } catch (error) {
            console.error('❌ useApi - Error getting auth token:', error);
          }
        } else {
          console.log('🔐 useApi - User not signed in, sending request without token');
        }
        return config;
      },
      (error) => {
        console.error('❌ useApi - Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    instance.interceptors.response.use(
      (response) => {
        console.log('✅ useApi - Response received:', response.status, response.config.url);
        return response;
      },
      (error) => {
        console.error('❌ useApi - API Error:', {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url
        });
        
        if (error.response?.status === 401) {
          console.log('🔐 useApi - Authentication required - please sign in again');
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [getToken, isSignedIn]);

  return api;
};