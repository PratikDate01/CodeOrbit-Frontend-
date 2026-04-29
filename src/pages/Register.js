import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CircularProgress,
  Grid,
} from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const Register = () => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    education: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return showNotification('Passwords do not match', 'error');
    }
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.phone, formData.education);
      showNotification('Account created successfully! Welcome to CodeOrbit.', 'success');
      navigate('/');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to register. Please try again.', 'error');
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
      py: 6,
    }}>

      {/* Subtle dot grid */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
        backgroundSize: '28px 28px', opacity: 0.45, pointerEvents: 'none',
      }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
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
              Create an account
            </Typography>
            <Typography sx={{ color: '#a3a3a3', fontSize: '0.9rem', fontWeight: 500 }}>
              Fill in the details below to get started
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Full name" name="name" variant="outlined"
                  required value={formData.name} onChange={handleChange} disabled={loading} sx={inputSx} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Email address" name="email" variant="outlined"
                  type="email" required value={formData.email} onChange={handleChange} disabled={loading} sx={inputSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Phone number" name="phone" variant="outlined"
                  value={formData.phone} onChange={handleChange} disabled={loading} sx={inputSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Education" name="education" variant="outlined"
                  value={formData.education} onChange={handleChange} disabled={loading} sx={inputSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth label="Password" name="password" variant="outlined"
                  type={showPassword ? 'text' : 'password'} required
                  value={formData.password} onChange={handleChange} disabled={loading} sx={inputSx}
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
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth label="Confirm password" name="confirmPassword" variant="outlined"
                  type={showConfirmPassword ? 'text' : 'password'} required
                  value={formData.confirmPassword} onChange={handleChange} disabled={loading} sx={inputSx}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" disabled={loading}
                          sx={{ color: '#a3a3a3', '&:hover': { color: '#2563eb' } }}>
                          {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              fullWidth variant="contained" size="large" type="submit" disabled={loading}
              sx={{
                mt: 3.5, py: 1.5, borderRadius: '10px',
                textTransform: 'none', fontSize: '0.925rem',
                fontWeight: 700, fontFamily: '"DM Sans", sans-serif',
                bgcolor: '#2563eb', boxShadow: 'none',
                '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 4px 20px rgba(37,99,235,0.2)' },
                '&:disabled': { bgcolor: '#bfdbfe', color: '#ffffff' },
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#ffffff' }} /> : 'Create account'}
            </Button>
          </form>

          {/* Footer */}
          <Typography sx={{
            mt: 3, textAlign: 'center',
            fontSize: '0.875rem', color: '#a3a3a3',
            fontFamily: '"DM Sans", sans-serif',
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 700 }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;