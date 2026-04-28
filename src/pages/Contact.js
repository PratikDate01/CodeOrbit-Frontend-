import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Grid, Box, TextField, Stack } from '@mui/material';
import API from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

const Contact = () => {
  const { userInfo } = useAuth();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    company: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setFormData(prev => ({
        ...prev,
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone || ''
      }));
    }
  }, [userInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/contact', formData);
      showNotification('Thank you for reaching out! We will get back to you soon.', 'success');
      setFormData({
        name: userInfo?.name || '', email: userInfo?.email || '',
        phone: userInfo?.phone || '', company: '', subject: '', message: ''
      });
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error sending message.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const info = [
    { icon: <EmailOutlinedIcon sx={{ fontSize: 22, color: '#2563eb' }} />, title: 'Email', detail: 'codeorbit.internship@gmail.com' },
    { icon: <PhoneOutlinedIcon sx={{ fontSize: 22, color: '#2563eb' }} />, title: 'Phone', detail: '+91 7666394641' },
    { icon: <LocationOnOutlinedIcon sx={{ fontSize: 22, color: '#2563eb' }} />, title: 'Address', detail: 'Whitehouse Vadgaon Bk, Pune 41' },
    { icon: <AccessTimeOutlinedIcon sx={{ fontSize: 22, color: '#2563eb' }} />, title: 'Hours', detail: 'Mon – Fri: 9AM – 6PM' },
  ];

  return (
    <Box sx={{ bgcolor: '#ffffff', fontFamily: '"DM Sans", sans-serif' }}>

      {/* ── Hero ── */}
      <Box sx={{
        bgcolor: '#f7f7f5',
        pt: { xs: 14, md: 22 },
        pb: { xs: 10, md: 16 },
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid #e8e8e4',
      }}>
        {/* dot grid */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
          backgroundSize: '28px 28px', opacity: 0.55, pointerEvents: 'none',
        }} />
        {/* blue blob */}
        <Box sx={{
          position: 'absolute', top: '10%', right: '-5%',
          width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* eyebrow */}
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1,
            bgcolor: '#eff6ff', border: '1px solid #bfdbfe',
            borderRadius: '100px', px: 2, py: 0.5, mb: 4,
          }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#2563eb' }} />
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#2563eb', letterSpacing: 0.5 }}>
              Let's Talk
            </Typography>
          </Box>

          <Typography variant="h1" sx={{
            fontSize: { xs: '2.75rem', sm: '4rem', md: '5.5rem' },
            fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.0,
            color: '#0a0a0a', mb: 4,
          }}>
            Get in
            <Box component="span" sx={{ color: '#2563eb' }}> Touch</Box>
          </Typography>

          <Typography sx={{
            color: '#3f3f3f', fontWeight: 400,
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            lineHeight: 1.7, maxWidth: 520,
          }}>
            Have a project in mind or questions about our services? We're here to help.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
        <Grid container spacing={5} alignItems="flex-start">

          {/* ── Contact Info ── */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ mb: 5 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 1.5 }}>
                Contact Details
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 2 }}>
                Contact Information
              </Typography>
              <Typography sx={{ color: '#737373', fontSize: '0.95rem', lineHeight: 1.75 }}>
                Reach out through any channel. Our team is ready to assist you.
              </Typography>
            </Box>

            <Stack spacing={2}>
              {info.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 3,
                    border: '1.5px solid #e8e8e4',
                    borderRadius: '14px',
                    bgcolor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2.5,
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: '#2563eb', boxShadow: '0 0 0 4px rgba(37,99,235,0.06)' },
                  }}
                >
                  <Box sx={{
                    width: 44, height: 44, borderRadius: '10px',
                    bgcolor: '#eff6ff', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: 1.5, mb: 0.25 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#0a0a0a', fontSize: '0.9rem' }}>
                      {item.detail}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* ── Contact Form ── */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Box sx={{
              p: { xs: 4, md: 6 },
              border: '1.5px solid #e8e8e4',
              borderRadius: '20px',
              bgcolor: '#fff',
            }}>
              <Box sx={{ mb: 5 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 1.5 }}>
                  Message Us
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                  Send a Message
                </Typography>
              </Box>

              {loading && <LoadingSpinner />}

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="Full Name *" name="name"
                        value={formData.name} onChange={handleChange} required sx={inputSx} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="Email Address *" name="email"
                        type="email" value={formData.email} onChange={handleChange} required sx={inputSx} />
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="Phone" name="phone"
                        type="tel" value={formData.phone} onChange={handleChange} sx={inputSx} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="Company" name="company"
                        value={formData.company} onChange={handleChange} sx={inputSx} />
                    </Grid>
                  </Grid>

                  <TextField fullWidth label="Subject *" name="subject"
                    value={formData.subject} onChange={handleChange} required sx={inputSx} />

                  <TextField fullWidth label="Message *" name="message"
                    value={formData.message} onChange={handleChange}
                    required multiline rows={6} sx={inputSx} />

                  <Box>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        bgcolor: '#0a0a0a', color: '#fff',
                        px: 4, py: 1.6,
                        fontSize: '0.95rem', fontWeight: 600,
                        borderRadius: '10px', boxShadow: 'none',
                        '&:hover': { bgcolor: '#1f1f1f', boxShadow: 'none' },
                      }}
                    >
                      Send Message
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    '& fieldset': { borderColor: '#e8e8e4', borderWidth: '1.5px' },
    '&:hover fieldset': { borderColor: '#0a0a0a' },
    '&.Mui-focused fieldset': { borderColor: '#2563eb' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
};

export default Contact;