import React, { useEffect } from 'react';
import { useAuthStore } from '../store/auth.js';

const AuthProvider = ({ children }) => {
  const { setLoading } = useAuthStore();

  useEffect(() => {
    // Set loading to false when component mounts
    // This will allow the auth state to be checked
    setLoading(false);
  }, [setLoading]);

  return <>{children}</>;
};

export default AuthProvider;
