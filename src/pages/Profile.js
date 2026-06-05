import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { User, ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import { Link } from 'react-router-dom';

// ── Shared input styling ──────────────────────────────────────────────────────
const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    fontFamily: '"DM Sans", sans-serif',
    '& fieldset': { borderColor: '#e8e8e4', borderWidth: '1.5px' },
    '&:hover fieldset': { borderColor: '#0a0a0a' },
    '&.Mui-focused fieldset': { borderColor: '#2563eb' },
    '&.Mui-disabled': {
      bgcolor: '#f7f7f5',
      '& fieldset': { borderColor: '#e8e8e4 !important' },
    },
  },
  '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
  '& .MuiFormHelperText-root': { fontFamily: '"DM Sans", sans-serif' },
  '& .MuiInputBase-input.Mui-disabled': { color: '#a3a3a3', WebkitTextFillColor: '#a3a3a3' },
};

// ── Section header ────────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, label, index }) => (
  <Grid size={12}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
      <Box sx={{
        width: 36, height: 36, borderRadius: '9px',
        bgcolor: '#eff6ff', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#2563eb', flexShrink: 0,
      }}>
        <Icon size={17} />
      </Box>
      <Box>
        <Typography sx={{
          fontSize: '0.68rem', fontWeight: 700, color: '#2563eb',
          textTransform: 'uppercase', letterSpacing: '0.12em',
          fontFamily: '"DM Sans", sans-serif',
        }}>
          {index} — {label}
        </Typography>
      </Box>
    </Box>
    <Box sx={{ height: '1.5px', bgcolor: '#e8e8e4', mb: 3.5, mt: 1 }} />
  </Grid>
);

// ── Component ─────────────────────────────────────────────────────────────────
const Profile = () => {
  const { userInfo, setUserInfo } = useAuth();
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    education: userInfo?.education || '',
    skills: userInfo?.skills?.join(', ') || '',
    password: '',
    confirmPassword: '',
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
      return setStatus({ type: 'error', message: 'Passwords do not match.' });
    }

    setLoading(true);
    try {
      const updateData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      };
      const { data } = await API.put('/auth/profile', updateData);
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Update failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f7f7f5', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>

      {/* ── Hero strip ── */}
      <Box sx={{
        bgcolor: '#f7f7f5',
        pt: { xs: 5, md: 8 },
        pb: { xs: 5, md: 7 },
        borderBottom: '1px solid #e8e8e4',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* dot grid */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
          backgroundSize: '28px 28px', opacity: 0.45, pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', top: '-20%', right: '-4%',
          width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.09) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Back link */}
          <Button
            component={Link}
            to="/dashboard"
            startIcon={<ArrowLeft size={15} />}
            sx={{
              mb: 4, color: '#737373', fontWeight: 600, fontSize: '0.825rem',
              p: 0, minWidth: 0, textTransform: 'none',
              fontFamily: '"DM Sans", sans-serif',
              '&:hover': { bgcolor: 'transparent', color: '#0a0a0a' },
            }}
          >
            Back to Dashboard
          </Button>

          {/* Eyebrow + title row */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
            {/* Avatar */}
            <Avatar sx={{
              width: 72, height: 72,
              bgcolor: '#2563eb',
              fontSize: '1.75rem', fontWeight: 800,
              fontFamily: '"DM Sans", sans-serif',
              boxShadow: '0 0 0 4px #f7f7f5, 0 0 0 5.5px #e8e8e4',
              flexShrink: 0,
            }}>
              {userInfo?.name?.charAt(0)}
            </Avatar>

            <Box>
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', gap: 1,
                bgcolor: '#eff6ff', border: '1px solid #bfdbfe',
                borderRadius: '100px', px: 2, py: 0.4, mb: 1.5,
              }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2563eb' }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', fontFamily: '"DM Sans", sans-serif' }}>
                  Profile Settings
                </Typography>
              </Box>

              <Typography sx={{
                fontWeight: 900, fontSize: { xs: '1.75rem', md: '2.5rem' },
                letterSpacing: '-0.04em', color: '#0a0a0a', lineHeight: 1.1,
                fontFamily: '"DM Sans", sans-serif',
              }}>
                {userInfo?.name}
              </Typography>
              <Typography sx={{
                mt: 0.5, color: '#737373', fontSize: '0.9rem',
                fontFamily: '"DM Sans", sans-serif', fontWeight: 400,
              }}>
                {userInfo?.email}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Form ── */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>

        {/* Status alert */}
        {status.message && (
          <Box sx={{
            display: 'flex', alignItems: 'flex-start', gap: 2,
            p: 3, mb: 4, borderRadius: '12px',
            bgcolor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
            border: '1.5px solid',
            borderColor: status.type === 'success' ? '#bbf7d0' : '#fecaca',
          }}>
            <Box sx={{ flexShrink: 0, mt: 0.1, color: status.type === 'success' ? '#15803d' : '#b91c1c' }}>
              {status.type === 'success'
                ? <CheckCircle2 size={18} />
                : <AlertCircle size={18} />
              }
            </Box>
            <Typography sx={{
              fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.55,
              color: status.type === 'success' ? '#15803d' : '#b91c1c',
              fontFamily: '"DM Sans", sans-serif',
            }}>
              {status.message}
            </Typography>
          </Box>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 4, md: 6 },
            border: '1.5px solid #e8e8e4',
            borderRadius: '24px',
            bgcolor: '#fff',
          }}
        >
          <Grid container spacing={3}>

            {/* ── Section: Basic Info ── */}
            <SectionHeader icon={User} label="Basic Information" index="01" />

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth label="Full Name" name="name"
                value={formData.name} onChange={handleChange}
                required sx={inputSx}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth label="Email Address" name="email"
                value={formData.email} onChange={handleChange}
                disabled
                helperText="Email cannot be changed"
                sx={inputSx}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth label="Phone Number" name="phone"
                value={formData.phone} onChange={handleChange}
                sx={inputSx}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth label="College / University" name="education"
                value={formData.education} onChange={handleChange}
                sx={inputSx}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth label="Skills (comma separated)" name="skills"
                placeholder="React, Node.js, Python…"
                value={formData.skills} onChange={handleChange}
                multiline rows={3}
                helperText="Separate each skill with a comma"
                sx={inputSx}
              />
            </Grid>

            {/* ── Section: Security ── */}
            <Grid size={12} sx={{ mt: 2 }}>
              <Box sx={{ height: 0 }} /> {/* spacer */}
            </Grid>
            <SectionHeader icon={ShieldCheck} label="Security" index="02" />

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth label="New Password" name="password"
                type="password" value={formData.password}
                onChange={handleChange}
                helperText="Leave blank to keep your current password"
                sx={inputSx}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth label="Confirm New Password" name="confirmPassword"
                type="password" value={formData.confirmPassword}
                onChange={handleChange}
                sx={inputSx}
              />
            </Grid>

            {/* ── Submit ── */}
            <Grid size={12} sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                type="submit"
                disabled={loading}
                sx={{
                  bgcolor: '#2563eb', color: '#fff',
                  px: 5, py: 1.6,
                  fontSize: '0.95rem', fontWeight: 700,
                  borderRadius: '10px', boxShadow: 'none',
                  textTransform: 'none', fontFamily: '"DM Sans", sans-serif',
                  '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 4px 20px rgba(37,99,235,0.25)' },
                  '&.Mui-disabled': { bgcolor: '#bfdbfe', color: '#fff' },
                  transition: 'all 0.2s',
                }}
              >
                {loading
                  ? <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CircularProgress size={17} sx={{ color: '#fff' }} />
                      Saving…
                    </Box>
                  : 'Save Changes'
                }
              </Button>

              <Button
                component={Link}
                to="/dashboard"
                sx={{
                  color: '#737373', fontWeight: 600, fontSize: '0.875rem',
                  textTransform: 'none', fontFamily: '"DM Sans", sans-serif',
                  p: 0, minWidth: 0,
                  '&:hover': { bgcolor: 'transparent', color: '#0a0a0a' },
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* ── Info note ── */}
        <Box sx={{
          mt: 4, p: 3,
          border: '1.5px solid #e8e8e4',
          borderRadius: '14px',
          bgcolor: '#f7f7f5',
          display: 'flex', alignItems: 'flex-start', gap: 2,
        }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: '8px',
            bgcolor: '#eff6ff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0, color: '#2563eb',
          }}>
            <ShieldCheck size={16} />
          </Box>
          <Typography sx={{
            fontSize: '0.825rem', color: '#737373',
            fontFamily: '"DM Sans", sans-serif', lineHeight: 1.7,
          }}>
            Your information is securely stored and only used for internship-related communication.
            Password changes take effect on your next login.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Profile;