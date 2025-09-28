# OAuth Authentication Flow

## Tổng quan
OAuth authentication flow đã được cải thiện để hoạt động giống như đăng nhập bằng password thông thường, đảm bảo trải nghiệm người dùng nhất quán.

## Flow hoạt động

### 1. Người dùng click "Đăng nhập với Google/Facebook"
- Frontend redirect đến backend OAuth endpoint
- Backend redirect đến Google/Facebook OAuth provider
- Người dùng xác thực với provider

### 2. OAuth Provider callback
- Google/Facebook redirect về backend với authorization code
- Backend exchange code lấy access token
- Backend tạo user account (nếu chưa có) và generate JWT tokens
- Backend redirect về frontend với tokens trong URL parameters

### 3. Frontend xử lý callback
- `TokenHandler` component nhận tokens từ URL parameters
- Sử dụng cùng logic với login thông thường:
  - Set tokens vào auth store
  - Set session ID
  - Fetch user profile
  - Redirect đến dashboard

## Các thay đổi chính

### Frontend
1. **Unified Callback Handling**: Chỉ sử dụng `TokenHandler` component
2. **Consistent Logic**: OAuth sử dụng cùng logic với password login
3. **Error Handling**: Xử lý lỗi OAuth giống như login thông thường
4. **URL Cleanup**: Tự động clean URL sau khi xử lý

### Backend
1. **Enhanced Redirect**: Redirect với đầy đủ thông tin (tokens, session, user data)
2. **Consistent Response**: OAuth response format giống password login
3. **Error Handling**: Redirect lỗi về đúng callback URL

## URL Structure

### Success Callback
```
http://localhost:5173/auth/callback?access_token=...&refresh_token=...&session_id=...&expires_in=...&refresh_expires_in=...&user_data=...
```

### Error Callback
```
http://localhost:5173/auth/callback?error=oauth_failed&message=...
```

## Lợi ích

1. **Consistent UX**: OAuth và password login có cùng trải nghiệm
2. **Unified State Management**: Cùng auth store và logic
3. **Better Error Handling**: Xử lý lỗi nhất quán
4. **Maintainable Code**: Ít duplicate code, dễ maintain
5. **Security**: Cùng security measures cho cả hai loại login

## Testing

Để test OAuth flow:

1. Start backend server
2. Start frontend development server
3. Click "Đăng nhập với Google" hoặc "Đăng nhập với Facebook"
4. Complete OAuth flow
5. Verify redirect đến dashboard với user đã đăng nhập
6. Verify tokens được lưu trong auth store
7. Verify có thể refresh page mà vẫn đăng nhập
