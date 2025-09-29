const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock login endpoint
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email, password });
  
  // Mock validation
  if (email === 'ThanhBinh@gmail.com' && password === '123456') {
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        metadata: {
          user: {
            id: 1,
            email: email,
            name: 'Thanh Binh',
            role: 'user'
          },
          access_token: 'mock_access_token_123',
          refresh_token: 'mock_refresh_token_456',
          session_id: 'mock_session_789',
          expires_in: 1800,
          refresh_expires_in: 604800
        }
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Mock register endpoint
app.post('/api/v1/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'Registration successful',
    data: {
      user: {
        id: 2,
        email: req.body.email,
        name: req.body.name
      }
    }
  });
});

// Mock other endpoints
app.post('/api/v1/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logout successful' });
});

app.post('/api/v1/auth/refresh', (req, res) => {
  res.json({
    success: true,
    data: {
      access_token: 'new_mock_access_token_123'
    }
  });
});

app.get('/api/v1/auth/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      metadata: {
        user: {
          id: 1,
          email: 'ThanhBinh@gmail.com',
          name: 'Thanh Binh',
          full_name: 'Thanh Binh',
          username: 'thanhbinh'
        }
      }
    }
  });
});

// Mock Google OAuth endpoint
app.get('/api/v1/auth/google', (req, res) => {
  // Simulate OAuth redirect to frontend callback
  const mockToken = 'mock_google_token_' + Date.now();
  res.redirect(`http://localhost:3000/auth/callback?token=${mockToken}&provider=google`);
});

// Mock Facebook OAuth endpoint  
app.get('/api/v1/auth/facebook', (req, res) => {
  // Simulate OAuth redirect to frontend callback
  const mockToken = 'mock_facebook_token_' + Date.now();
  res.redirect(`http://localhost:3000/auth/callback?token=${mockToken}&provider=facebook`);
});

// Mock Google login endpoint
app.post('/api/v1/auth/google', (req, res) => {
  const { token } = req.body;
  console.log('Google login attempt with token:', token);
  
  res.json({
    success: true,
    message: 'Google login successful',
    data: {
      metadata: {
        user: {
          id: 3,
          email: 'user@gmail.com',
          name: 'Google User',
          full_name: 'Google User',
          username: 'googleuser',
          role: 'user'
        },
        access_token: 'mock_google_access_token_' + Date.now(),
        refresh_token: 'mock_google_refresh_token_' + Date.now(),
        session_id: 'mock_google_session_' + Date.now(),
        expires_in: 1800,
        refresh_expires_in: 604800
      }
    }
  });
});

// Mock Facebook login endpoint
app.post('/api/v1/auth/facebook', (req, res) => {
  const { token } = req.body;
  console.log('Facebook login attempt with token:', token);
  
  res.json({
    success: true,
    message: 'Facebook login successful',
    data: {
      metadata: {
        user: {
          id: 4,
          email: 'user@facebook.com',
          name: 'Facebook User',
          full_name: 'Facebook User',
          username: 'facebookuser',
          role: 'user'
        },
        access_token: 'mock_facebook_access_token_' + Date.now(),
        refresh_token: 'mock_facebook_refresh_token_' + Date.now(),
        session_id: 'mock_facebook_session_' + Date.now(),
        expires_in: 1800,
        refresh_expires_in: 604800
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /api/v1/auth/login');
  console.log('- POST /api/v1/auth/register');
  console.log('- POST /api/v1/auth/logout');
  console.log('- POST /api/v1/auth/refresh');
  console.log('- GET /api/v1/auth/profile');
  console.log('- GET /api/v1/auth/google (OAuth redirect)');
  console.log('- POST /api/v1/auth/google (token exchange)');
  console.log('- GET /api/v1/auth/facebook (OAuth redirect)');
  console.log('- POST /api/v1/auth/facebook (token exchange)');
});

