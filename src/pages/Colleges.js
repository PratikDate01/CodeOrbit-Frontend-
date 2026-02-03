import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Stack,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import { 
  School, 
  Users, 
  BarChart, 
  ShieldCheck, 
  ArrowRight,
  Mail,
  Handshake
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Colleges = () => {
  const offerings = [
    {
      icon: <Users size={32} />,
      title: 'Bulk Internship Access',
      description: 'Onboard entire batches of students into industry-aligned internship programs with ease.'
    },
    {
      icon: <BarChart size={32} />,
      title: 'Admin Dashboard',
      description: 'Get a dedicated dashboard to track student progress, attendance, and performance in real-time.'
    },
    {
      icon: <ShieldCheck size={32} />,
      title: 'Verified Reports',
      description: 'Download authenticated internship completion reports and performance metrics for your records.'
    },
    {
      icon: <School size={32} />,
      title: 'Curriculum Integration',
      description: 'Our tasks can be mapped to your academic requirements for industrial training credits.'
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1f1f1f 50%, #000000 100%)',
          color: 'white',
          py: { xs: 12, md: 20 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          minHeight: { xs: 'auto', md: '70vh' }
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Avatar sx={{ bgcolor: 'accent.main', width: 80, height: 80, mb: 4, boxShadow: '0 0 20px rgba(217, 119, 6, 0.3)' }}>
              <Handshake size={40} />
            </Avatar>
            <Typography 
              variant="h1" 
              fontWeight={800} 
              gutterBottom 
              sx={{ 
                fontSize: { xs: '2.75rem', sm: '4rem', md: '5rem' },
                letterSpacing: '-0.04em',
                mb: 3
              }}
            >
              CodeOrbit for Institutions
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 6, 
                fontWeight: 400, 
                maxWidth: 800,
                mx: 'auto',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: { xs: '1.25rem', md: '1.75rem' },
                lineHeight: 1.4
              }}
            >
              Partner with us to provide your students with industry-standard internship experiences and simplified administrative tracking.
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              endIcon={<ArrowRight size={20} />}
              component={Link}
              to="/contact"
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                px: 6, 
                py: 2, 
                borderRadius: 2, 
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              Become a Partner
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
        <Grid container spacing={4} sx={{ mb: { xs: 12, md: 20 } }}>
          {offerings.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Paper 
                sx={{ 
                  p: 4, 
                  height: '100%', 
                  borderRadius: 4, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <Box sx={{ 
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: 3,
                  bgcolor: 'rgba(30, 41, 59, 0.05)',
                  color: 'accent.main', 
                  mb: 3 
                }}>
                  {item.icon}
                </Box>
                <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 2 }}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.8} fontSize="1rem">{item.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper 
          sx={{ 
            p: { xs: 6, md: 10 }, 
            borderRadius: 8, 
            bgcolor: 'background.alt', 
            overflow: 'hidden', 
            position: 'relative',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="h2" fontWeight={800} gutterBottom sx={{ mb: 3 }}>Why Partner with CodeOrbit?</Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 6, fontSize: '1.1rem', lineHeight: 1.8 }}>
                We bridge the gap between academic theory and industry practice. Our platform provides a transparent, accountable, and high-quality internship ecosystem that benefits both students and institutions.
              </Typography>
              <Stack spacing={3}>
                {[
                  'Centralized tracking for all student internships',
                  'Performance-based evaluation and grading',
                  'Direct industry exposure for students',
                  'Support for AICTE/MSME compliance requirements'
                ].map((text, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ color: 'success.main', display: 'flex' }}>
                      <ShieldCheck size={24} />
                    </Box>
                    <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>{text}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Card 
                sx={{ 
                  borderRadius: 6, 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  p: 2,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ 
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    mb: 4
                  }}>
                    <Mail size={40} />
                  </Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 2 }}>Contact our Partnerships Team</Typography>
                  <Typography variant="body2" sx={{ mb: 6, opacity: 0.8, fontSize: '1rem' }}>
                    Get a personalized demo of our institutional dashboard and bulk onboarding process.
                  </Typography>
                  <Typography 
                    variant="h4" 
                    fontWeight={800} 
                    sx={{ 
                      color: 'accent.main',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    partners@codeorbit.ai
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Colleges;
