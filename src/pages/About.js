import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Paper, Avatar, Stack } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const About = () => {
  const values = [
    {
      icon: <LightbulbIcon sx={{ fontSize: 32 }} />,
      title: 'Innovation',
      description: 'Embracing cutting-edge technologies and creative solutions to solve complex challenges.'
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 32 }} />,
      title: 'Excellence',
      description: 'Maintaining the highest standards in every project and training program we deliver.'
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 32 }} />,
      title: 'Integrity',
      description: 'Building trust through transparency, honesty, and ethical business practices.'
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 32 }} />,
      title: 'Collaboration',
      description: 'Fostering partnerships and teamwork to achieve shared goals and success.'
    }
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
              About CodeOrbit
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
              Empowering businesses with innovative IT solutions while cultivating the next generation of technology professionals.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
        {/* Mission & Vision */}
        <Grid container spacing={4} sx={{ mb: { xs: 10, md: 16 } }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper 
              sx={{ 
                p: { xs: 4, md: 6 },
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'rgba(37, 99, 235, 0.1)',
                    width: 56,
                    height: 56,
                  }}
                >
                  <TrackChangesIcon sx={{ fontSize: 32, color: 'secondary.main' }} />
                </Avatar>
                <Typography variant="h3">
                  Our Mission
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                To deliver cutting-edge IT services that drive business growth and innovation while creating meaningful opportunities for aspiring technology professionals through comprehensive training and real-world experience.
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper 
              sx={{ 
                p: { xs: 4, md: 6 },
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'rgba(37, 99, 235, 0.1)',
                    width: 56,
                    height: 56,
                  }}
                >
                  <VisibilityIcon sx={{ fontSize: 32, color: 'secondary.main' }} />
                </Avatar>
                <Typography variant="h3">
                  Our Vision
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                To be recognized as a leading technology solutions provider and premier internship destination, known for excellence, innovation, and commitment to developing skilled professionals who shape the future of technology.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* What We Do */}
        <Box sx={{ mb: { xs: 10, md: 16 } }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 2, textAlign: 'center' }}>
              What We Do
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: '1.125rem',
                maxWidth: 700,
                mx: 'auto',
                textAlign: 'center'
              }}
            >
              CodeOrbit operates at the intersection of technology services and professional development.
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ p: { xs: 4, md: 6 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                    <BusinessCenterIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
                    <Typography variant="h3" sx={{ textAlign: 'left' }}>
                      IT Services
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, textAlign: 'left', flexGrow: 1 }}>
                    We provide comprehensive technology solutions designed to help businesses thrive in the digital age.
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      'Custom web and mobile development',
                      'Enterprise software solutions',
                      'Cloud infrastructure services',
                      'IT consulting and transformation',
                    ].map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'secondary.main' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'left' }}>{item}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ p: { xs: 4, md: 6 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                    <SchoolIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
                    <Typography variant="h3" sx={{ textAlign: 'left' }}>
                      Training Programs
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, textAlign: 'left', flexGrow: 1 }}>
                    Our professional internship programs bridge the gap between academic learning and industry requirements.
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      'Hands-on training with live projects',
                      'Industry professional mentorship',
                      'Recognized completion certificates',
                      'Career guidance and assistance',
                    ].map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'secondary.main' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'left' }}>{item}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Our Values */}
        <Box sx={{ py: { xs: 10, md: 16 }, px: 4, bgcolor: 'rgba(15, 23, 42, 0.02)', borderRadius: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 2, textAlign: 'center' }}>
              Our Core Values
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
              The principles that guide everything we do.
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {values.map((value, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 3
                  }}>
                    <Box sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: 'white',
                      color: 'secondary.main',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}>
                      {value.icon}
                    </Box>
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>{value.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', flexGrow: 1, lineHeight: 1.6 }}>{value.description}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
