import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.jsx";
import { useAuthStore } from "../../store/auth.js";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import BRAND from "../../config/brand";
import LogoMark from "../Brand/LogoMark";

const Login = () => {
  const navigate = useNavigate();
  const { login, setTokens, setSession, setUser } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await authService.login(formData);
      console.log("Login API result:", result.data); 

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
          setError("Đăng nhập thành công nhưng thiếu access token");
          return;
        }

        setTokens(accessToken, refreshToken, tokenExpiresAt, refreshExpiresAt);
        if (sessionId) setSession(sessionId);

        const inlineUser = metadata?.user || metadata?.users;
        if (inlineUser) {
          setUser(inlineUser);
          navigate("/");
          return;
        }

        try {
          const profileRes = await authService.getProfile();
          if (profileRes.success) {
            const profile = profileRes.data?.metadata?.user || profileRes.data?.user;
            if (profile) {
              setUser(profile);
              navigate("/");
              return;
            }
          }
          setError("Đăng nhập thành công nhưng không lấy được thông tin người dùng");
        } catch (profileErr) {
          console.error("Fetch profile error:", profileErr);
          setError("Không lấy được thông tin người dùng sau khi đăng nhập");
        }
      } else {
        setError(result.error || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi đăng nhập");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await authService.login_with_google();
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi đăng nhập Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      const result = await authService.login_with_facebook();
      if (!result.success) {
        setError(result.error);
      }
      // If successful, user will be redirected to Facebook OAuth
    } catch (err) {
      setError("Có lỗi xảy ra khi đăng nhập Facebook");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4" 
         style={{ background: 'linear-gradient(135deg, #0b0b0f 0%, #111318 50%, #0b0b0f 100%)' }}>
      <div 
        className="absolute inset-0 opacity-12 pointer-events-none" 
        style={{
          background: 'radial-gradient(900px 400px at 80% -10%, rgba(29,185,84,.12), transparent 60%), radial-gradient(700px 300px at 20% -10%, rgba(34,211,238,.10), transparent 60%)'
        }} 
      />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <LogoMark size={56} />
            <div className="text-left">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-200 to-sky-400 font-extrabold text-3xl tracking-wide">
                {BRAND.name}
              </span>
              <span className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">
                {BRAND.tagline}
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Chào mừng trở lại!</h1>
          <p className="text-gray-400 text-sm">Đăng nhập để tiếp tục nghe nhạc</p>
        </div>

        <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300 text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                  placeholder="Nhập email của bạn"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                  placeholder="Nhập mật khẩu"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-300 group-hover:text-white transition-colors">Ghi nhớ đăng nhập</span>
              </label>
              <Link to="/auth/forgot-password" className="text-sm text-green-500 hover:text-green-400 transition-colors font-medium">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-cyan-400 text-black font-bold py-3.5 px-4 rounded-xl hover:from-green-600 hover:to-cyan-500 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-800/90 text-gray-400">Hoặc tiếp tục với</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Tiếp tục với Google
            </button>

            <button
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Tiếp tục với Facebook
            </button>
          </div>

          <div className="text-center mt-6">
            <span className="text-gray-400 text-sm">Chưa có tài khoản? </span>
            <Link to="/auth/register" className="text-green-500 hover:text-green-400 font-semibold transition-colors">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
