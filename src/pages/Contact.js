import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Grid, Box, Paper, TextField, Avatar } from '@mui/material';
import API from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/contact', formData);
      showNotification('Thank you for reaching out! We will get back to you soon.', 'success');
      setFormData({ name: userInfo?.name || '', email: userInfo?.email || '', phone: userInfo?.phone || '', company: '', subject: '', message: '' });
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error sending message.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const info = [
    { icon: '📧', title: 'Email', detail: 'codeorbit.internship@gmail.com' },
    { icon: '📞', title: 'Phone', detail: '+91 7666394641' },
    { icon: '📍', title: 'Address', detail: 'Whitehouse Vadgaon Bk Pune 41' },
    { icon: '🕒', title: 'Hours', detail: 'Mon - Fri: 9AM - 6PM' }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1f1f1f 50%, #000000 100%)',
          color: 'white',
          py: { xs: 12, md: 16 },
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 2,
                textAlign: 'center'
              }}
            >
              Get in Touch
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.5rem' },
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center'
              }}
            >
              Have a project in mind or questions about our services? We're here to help.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
        <Grid container spacing={6}>
          {/* Contact Information */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
                Contact Information
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                Reach out to us through any of the following channels. Our team is ready to assist you.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {info.map((item, idx) => (
                <Grid size={{ xs: 12, sm: 6, lg: 12 }} key={idx} sx={{ display: 'flex' }}>
                  <Paper 
                    sx={{ 
                      p: 3,
                      width: '100%',
                      height: '100%',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(37, 99, 235, 0.02)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: 'rgba(37, 99, 235, 0.1)',
                          width: 54,
                          height: 54,
                          fontSize: '1.5rem'
                        }}
                      >
                        {item.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                          {item.detail}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Contact Form */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 4, md: 6 },
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 4,
                bgcolor: 'background.paper'
              }}
            >
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                Send a Message
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {loading && <LoadingSpinner />}

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Name *"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email *"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  label="Subject *"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Message *"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  multiline
                  rows={6}
                  variant="outlined"
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Send Message
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
