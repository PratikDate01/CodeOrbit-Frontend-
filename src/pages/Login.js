import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import API, { baseURL } from '../api/api';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import GoogleIcon from '@mui/icons-material/Google';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const Login = () => {
  const { showNotification } = useNotification();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, setUserInfo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleTokenLogin = useCallback(async (token) => {
    setLoading(true);
    try {
      localStorage.setItem('userInfo', JSON.stringify({ token }));
      const { data } = await API.get('/auth/profile');
      const userInfo = { ...data, token };
      setUserInfo(userInfo);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      showNotification('Successfully logged in with Google!', 'success');
      navigate('/');
    } catch (err) {
      localStorage.removeItem('userInfo');
      showNotification('Google authentication failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [navigate, setUserInfo, showNotification]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) handleTokenLogin(token);
  }, [location, handleTokenLogin]);

  const handleGoogleLogin = () => {
    window.location.href = `${baseURL}/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showNotification('Successfully logged in!', 'success');
      navigate('/');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to login. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '0.925rem',
      backgroundColor: '#ffffff',
      '& fieldset': { borderColor: '#e8e8e4' },
      '&:hover fieldset': { borderColor: '#2563eb' },
      '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '1.5px' },
    },
    '& .MuiInputLabel-root': {
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '0.9rem',
      color: '#a3a3a3',
      '&.Mui-focused': { color: '#2563eb' },
    },
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#f7f7f5',
      fontFamily: '"DM Sans", sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Subtle dot grid */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
        backgroundSize: '28px 28px', opacity: 0.45, pointerEvents: 'none',
      }} />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{
          bgcolor: '#ffffff',
          border: '1px solid #e8e8e4',
          borderRadius: '16px',
          p: { xs: 4, md: 5 },
          boxShadow: '0 2px 24px rgba(0,0,0,0.05)',
        }}>

          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{
              fontSize: '1.6rem',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: '#0a0a0a',
              mb: 0.75,
            }}>
              Sign in
            </Typography>
            <Typography sx={{ color: '#a3a3a3', fontSize: '0.9rem', fontWeight: 500 }}>
              Enter your credentials to continue
            </Typography>
          </Box>

          {/* Google */}
          <Button
            fullWidth variant="outlined" size="large"
            onClick={handleGoogleLogin} disabled={loading}
            startIcon={<GoogleIcon sx={{ fontSize: '18px !important' }} />}
            sx={{
              py: 1.4, borderRadius: '10px',
              borderColor: '#e8e8e4', color: '#3f3f3f',
              textTransform: 'none', fontSize: '0.9rem',
              fontWeight: 600, fontFamily: '"DM Sans", sans-serif',
              bgcolor: '#ffffff', boxShadow: 'none',
              '&:hover': {
                borderColor: '#2563eb', bgcolor: '#eff6ff',
                color: '#2563eb', boxShadow: 'none',
              },
            }}
          >
            Continue with Google
          </Button>

          {/* Divider */}
          <Box sx={{ my: 3 }}>
            <Divider sx={{ borderColor: '#e8e8e4' }}>
              <Typography sx={{
                fontSize: '0.72rem', fontWeight: 800,
                color: '#d4d4d0', letterSpacing: '0.05em',
                fontFamily: '"DM Sans", sans-serif', px: 1,
              }}>
                OR
              </Typography>
            </Divider>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth label="Email address" variant="outlined" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} sx={inputSx}
              />
              <TextField
                fullWidth label="Password" variant="outlined"
                type={showPassword ? 'text' : 'password'} required
                value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} sx={inputSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" disabled={loading}
                        sx={{ color: '#a3a3a3', '&:hover': { color: '#2563eb' } }}>
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
              <Link to="/forgot-password" style={{
                color: '#2563eb', textDecoration: 'none',
                fontSize: '0.85rem', fontWeight: 600,
                fontFamily: '"DM Sans", sans-serif',
              }}>
                Forgot password?
              </Link>
            </Box>

            <Button
              fullWidth variant="contained" size="large" type="submit" disabled={loading}
              sx={{
                mt: 2.5, py: 1.5, borderRadius: '10px',
                textTransform: 'none', fontSize: '0.925rem',
                fontWeight: 700, fontFamily: '"DM Sans", sans-serif',
                bgcolor: '#2563eb', boxShadow: 'none',
                '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 4px 20px rgba(37,99,235,0.2)' },
                '&:disabled': { bgcolor: '#bfdbfe', color: '#ffffff' },
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#ffffff' }} /> : 'Sign in'}
            </Button>
          </form>

          {/* Footer */}
          <Typography sx={{
            mt: 3, textAlign: 'center',
            fontSize: '0.875rem', color: '#a3a3a3',
            fontFamily: '"DM Sans", sans-serif',
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 700 }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;