import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.js';
import authService from '../../services/auth.jsx';

const TokenHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokens, setSession, setUser } = useAuthStore();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleToken = async () => {
      try {
        // Check for error parameters first
        const errorParam = searchParams.get('error');
        const errorMessage = searchParams.get('message');
        
        if (errorParam) {
          setError(errorMessage || 'OAuth authentication failed');
          setIsLoading(false);
          return;
        }

        // Get token parameters
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const sessionId = searchParams.get('session_id');
        const expiresIn = searchParams.get('expires_in');
        const refreshExpiresIn = searchParams.get('refresh_expires_in');
        const userData = searchParams.get('user_data');

        if (!accessToken) {
          setError('Không nhận được access token từ OAuth provider');
          setIsLoading(false);
          return;
        }

        // Set tokens using the same logic as regular login
        const now = Math.floor(Date.now() / 1000);
        const tokenExpiresAt = now + (parseInt(expiresIn) || 1800);
        const refreshExpiresAt = now + (parseInt(refreshExpiresIn) || 604800);

        setTokens(accessToken, refreshToken, tokenExpiresAt, refreshExpiresAt);
        if (sessionId) setSession(sessionId);

        // Parse user data if provided in URL
        if (userData) {
          try {
            const user = JSON.parse(decodeURIComponent(userData));
            setUser(user);
            // Clean URL and redirect to dashboard
            window.history.replaceState({}, document.title, '/');
            navigate('/');
            return;
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }

        // Try to get user profile using the same logic as regular login
        try {
          const profileRes = await authService.getProfile();
          if (profileRes.success) {
            const profile = profileRes.data?.metadata?.user || profileRes.data?.user;
            if (profile) {
              setUser(profile);
              // Clean URL and redirect to dashboard
              window.history.replaceState({}, document.title, '/');
              navigate('/');
              return;
            }
          }
          setError('Đăng nhập thành công nhưng không lấy được thông tin người dùng');
        } catch (profileErr) {
          console.error('Error fetching profile:', profileErr);
          setError('Không lấy được thông tin người dùng sau khi đăng nhập');
        }
      } catch (error) {
        console.error('Error processing OAuth token:', error);
        setError('Có lỗi xảy ra khi xử lý đăng nhập OAuth');
      } finally {
        setIsLoading(false);
      }
    };

    handleToken();
  }, [searchParams, navigate, setTokens, setSession, setUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4" 
           style={{ background: 'linear-gradient(135deg, #0b0b0f 0%, #111318 50%, #0b0b0f 100%)' }}>
        <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Đang xử lý đăng nhập...</h2>
          <p className="text-gray-400">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4" 
           style={{ background: 'linear-gradient(135deg, #0b0b0f 0%, #111318 50%, #0b0b0f 100%)' }}>
        <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Đăng nhập thất bại</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/auth/login')}
            className="w-full bg-gradient-to-r from-green-500 to-cyan-400 text-black font-bold py-3 px-4 rounded-xl hover:from-green-600 hover:to-cyan-500 transition-all duration-200"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return null; // This component doesn't render anything
};

export default TokenHandler;
