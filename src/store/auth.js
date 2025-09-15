import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      sessionId: null,
      isAuthenticated: false,
      isLoading: false,
      tokenExpiresIn: null,
      refreshExpiresIn: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: true }),
      
      setTokens: (accessToken, refreshToken, expiresIn, refreshExpiresIn) => set({ 
        accessToken, 
        refreshToken,
        tokenExpiresIn: expiresIn,
        refreshExpiresIn: refreshExpiresIn
      }),
      
      setSession: (sessionId) => set({ sessionId }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      login: (user, accessToken, refreshToken, sessionId, expiresIn, refreshExpiresIn) => set({ 
        user, 
        accessToken, 
        refreshToken,
        sessionId,
        isAuthenticated: true,
        tokenExpiresIn: expiresIn,
        refreshExpiresIn: refreshExpiresIn
      }),
      
      logout: () => set({ 
        user: null, 
        accessToken: null, 
        refreshToken: null,
        sessionId: null,
        isAuthenticated: false,
        tokenExpiresIn: null,
        refreshExpiresIn: null
      }),
      
      updateAccessToken: (newAccessToken, expiresIn) => set({
        accessToken: newAccessToken,
        tokenExpiresIn: expiresIn
      }),
      
      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        try {
          const response = await fetch('/api/v1/auth/refresh', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            throw new Error('Refresh failed');
          }
          
          const data = await response.json();
          const { access_token, expires_in } = data.metadata;
          
          get().updateAccessToken(access_token, expires_in);
          return access_token;
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      isTokenExpired: () => {
        const { tokenExpiresIn } = get();
        if (!tokenExpiresIn) return true;
        
        const now = Math.floor(Date.now() / 1000);
        return now >= tokenExpiresIn;
      },

      isRefreshTokenExpired: () => {
        const { refreshExpiresIn } = get();
        if (!refreshExpiresIn) return true;
        
        const now = Math.floor(Date.now() / 1000);
        return now >= refreshExpiresIn;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        sessionId: state.sessionId,
        isAuthenticated: state.isAuthenticated,
        tokenExpiresIn: state.tokenExpiresIn,
        refreshExpiresIn: state.refreshExpiresIn
      }),
    }
  )
);

export { useAuthStore };
