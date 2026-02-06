import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  Avatar, 
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { User, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';

const Profile = () => {
  const { userInfo, setUserInfo } = useAuth();
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    education: userInfo?.education || '',
    skills: userInfo?.skills?.join(', ') || '',
    password: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (formData.password && formData.password !== formData.confirmPassword) {
      return setStatus({ type: 'error', message: 'Passwords do not match' });
    }

    setLoading(true);
    try {
      const updateData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
      };
      const { data } = await API.put('/auth/profile', updateData);
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '90vh', py: 8 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            component={Link} 
            to="/dashboard" 
            sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'background.alt' } }}
          >
            <ArrowLeft size={20} />
          </IconButton>
          <Typography variant="h6" fontWeight={700}>Back to Dashboard</Typography>
        </Box>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem', mr: 3 }}>
              {userInfo?.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700}>{userInfo?.name}</Typography>
              <Typography variant="body1" color="text.secondary">Manage your personal information</Typography>
            </Box>
          </Box>

          {status.message && <Alert severity={status.type} sx={{ mb: 4 }}>{status.message}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <User size={20} style={{ marginRight: '8px' }} /> Basic Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Skills (comma separated)"
                  name="skills"
                  placeholder="React, Node.js, Python..."
                  value={formData.skills}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid size={12} sx={{ mt: 2 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <ShieldCheck size={20} style={{ marginRight: '8px' }} /> Security
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  helperText="Leave blank to keep current password"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={12} sx={{ mt: 4 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  type="submit"
                  disabled={loading}
                  sx={{ px: 6 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
