import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../../services/auth.jsx';
import { useAuthStore } from '../../store/auth.js';

const SocialCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setTokens, setSession, setUser } = useAuthStore();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleSocialLogin = async () => {
      try {
        // Get token from URL params
        const token = searchParams.get('token');
        const provider = searchParams.get('provider'); // 'google' or 'facebook'
        
        if (!token || !provider) {
          setError('Thiếu thông tin đăng nhập');
          setIsLoading(false);
          return;
        }

        // Call appropriate social login service
        let result;
        if (provider === 'google') {
          result = await authService.login_with_google(token);
        } else if (provider === 'facebook') {
          result = await authService.login_with_facebook(token);
        } else {
          setError('Nhà cung cấp không được hỗ trợ');
          setIsLoading(false);
          return;
        }

        if (result.success) {
          const { metadata } = result.data;

          const accessToken = metadata?.access_token;
          const refreshToken = metadata?.refresh_token;
          const sessionId = metadata?.session_id;
          const expiresIn = metadata?.expires_in;
          const refreshExpiresIn = metadata?.refresh_expires_in;

          const now = Math.floor(Date.now() / 1000);
          const tokenExpiresAt = now + (expiresIn || 1800);
          const refreshExpiresAt = now + (refreshExpiresIn || 604800);

          if (!accessToken) {
            setError('Đăng nhập thành công nhưng thiếu access token');
            setIsLoading(false);
            return;
          }

          setTokens(accessToken, refreshToken, tokenExpiresAt, refreshExpiresAt);
          if (sessionId) setSession(sessionId);

          const inlineUser = metadata?.user || metadata?.users;
          if (inlineUser) {
            setUser(inlineUser);
            navigate("/dashboard");
            return;
          }

          // Try to get profile if user data not in response
          try {
            const profileRes = await authService.getProfile();
            if (profileRes.success) {
              const profile = profileRes.data?.metadata?.user || profileRes.data?.user;
              if (profile) {
                setUser(profile);
                navigate("/dashboard");
                return;
              }
            }
            setError("Đăng nhập thành công nhưng không lấy được thông tin người dùng");
          } catch (profileErr) {
            console.error("Fetch profile error:", profileErr);
            setError("Không lấy được thông tin người dùng sau khi đăng nhập");
          }
        } else {
          setError(result.error || `Đăng nhập ${provider} thất bại`);
        }
      } catch (err) {
        console.error('Social login error:', err);
        setError('Có lỗi xảy ra khi đăng nhập');
      } finally {
        setIsLoading(false);
      }
    };

    handleSocialLogin();
  }, [navigate, searchParams, setTokens, setSession, setUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
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

  return null;
};

export default SocialCallback;
