// src/hooks/useApi.js
import { useAuth } from '@clerk/clerk-react';
import { useMemo } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const useApi = () => {
  const { getToken, isSignedIn } = useAuth();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Adding request interceptor to include auth token
    instance.interceptors.request.use(
      async (config) => {
        if (isSignedIn) {
          try {
            const token = await getToken();
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (error) {
            console.error('Error getting auth token:', error);
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Adding response interceptor for error handling
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        if (error.response?.status === 401) {
          // You can trigger re-authentication here if needed
          console.log('Authentication required - please sign in again');
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [getToken, isSignedIn]);

  return api;
};