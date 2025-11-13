// src/hooks/useAuthSetup.js
import { useAuth } from '@clerk/clerk-react';
import { useEffect, useRef } from 'react';
import { setAuthToken } from '../services/api';

export const useAuthSetup = () => {
  const { getToken, isSignedIn } = useAuth();
  const refreshIntervalRef = useRef(null);

  useEffect(() => {
    const setupAuth = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          setAuthToken(token);
          console.log('✅ Auth token set up successfully');

          // Set up automatic token refresh every 45 seconds
          if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
          }
          
          refreshIntervalRef.current = setInterval(async () => {
            try {
              const newToken = await getToken();
              setAuthToken(newToken);
              console.log('🔄 Token refreshed automatically');
            } catch (error) {
              console.error('❌ Failed to refresh token:', error);
            }
          }, 45000); // Refresh every 45 seconds

        } catch (error) {
          console.error('❌ Failed to set up auth token:', error);
        }
      } else {
        setAuthToken(null);
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
          refreshIntervalRef.current = null;
        }
        console.log('🔐 User signed out - token cleared');
      }
    };

    setupAuth();

    // Cleanup interval on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [getToken, isSignedIn]);
};