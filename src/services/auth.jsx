import api from "./api.jsx"

export default {
    async login(credentials) {
        try {
            const response = await api.post("auth/login", credentials);
            console.log(response);
            return {
                success: true,
                data: response
            }
        }
        catch(err) {
            let errMess = err.response?.data?.message || "Login failed";
            return {
                success: false,
                error: errMess
            }
        }
    },

    async register(credentials) {
        try {
            const response = await api.post("auth/register", credentials)
            return {
                success: true,
                data: response
            }
        }
        catch(err) {
            let errMess = err.response?.data?.message || "Registration failed";
            return {
                success: false,
                error: errMess
            }
        }
    },

    async logout({ sessionId, refreshToken } = {}) {
        try {
            const response = await api.post("auth/logout", {
                session_id: sessionId,
                refresh_token: refreshToken
            })
            return {
                success: true,
                message: response?.message || "Đăng xuất thành công",
            }
        }
        catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Đăng xuất thất bại"
            }
        }
    },

    async logout_all() {
        try {
            const response = await api.post("auth/logout-all")
            return {
                success: true,
                message: response?.message || "Đăng xuất tất cả thiết bị thành công",
            }
        }
        catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Đăng xuất tất cả thiết bị thất bại"
            }
        }
    },

    async refreshToken() {
        try {
            const response = await api.post("auth/refresh")
            return {
                success: true,
                data: response
            }
        }
        catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Token refresh failed"
            }
        }
    },

    async getProfile() {
        try {
            const response = await api.get("auth/profile")
            return {
                success: true,
                data: response
            }
        }
        catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Get profile failed"
            }
        }
    },

    async forgotPassword(email) {
        try {
            const response = await api.post("auth/forgot-password", { email })
            return {
                success: true,
                message: response?.message || "Reset link sent successfully",
                data: response
            }
        }
        catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Forgot password failed"
            }
        }
    },

    async resetPassword(resetToken, newPassword) {
        try {
            const response = await api.post("auth/reset-password", {
                reset_token: resetToken,
                new_password: newPassword
            })
            return {
                success: true,
                message: response?.message || "Password reset successfully",
                data: response
            }
        }
        catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Password reset failed"
            }
        }
    }
}