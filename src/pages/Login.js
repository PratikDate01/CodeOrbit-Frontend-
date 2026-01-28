import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useGoogleLogin } from '@react-oauth/google';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper, 
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { LogIn } from 'lucide-react';
import GoogleIcon from '@mui/icons-material/Google';

const Login = () => {
  const { showNotification } = useNotification();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = async (tokenResponse) => {
    setLoading(true);
    try {
      await googleLogin(tokenResponse.access_token);
      showNotification('Successfully logged in with Google!', 'success');
      navigate('/');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Google login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: () => showNotification('Google login failed. Please try again.', 'error'),
  });

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

  return (
    <Box 
      sx={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        bgcolor: 'background.default',
        py: 8
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box 
              sx={{ 
                display: 'inline-flex', 
                p: 1.5, 
                borderRadius: '12px', 
                bgcolor: 'primary.main', 
                color: 'white',
                mb: 2
              }}
            >
              <LogIn size={24} />
            </Box>
            <Typography variant="h4" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Login to access your dashboard and internships
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              margin="normal"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </form>

          <Box sx={{ my: 2 }}>
            <Divider>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
          </Box>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={() => handleGoogleLogin()}
            disabled={loading}
            startIcon={<GoogleIcon />}
            sx={{ 
              py: 1.5,
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'text.primary',
                bgcolor: 'rgba(0,0,0,0.02)'
              }
            }}
          >
            Continue with Google
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#0f0f0f', textDecoration: 'none', fontWeight: 600 }}>
                Register Now
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
