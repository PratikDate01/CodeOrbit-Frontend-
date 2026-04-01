import React from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, Box, Paper, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import CodeIcon from '@mui/icons-material/Code';
import CloudIcon from '@mui/icons-material/Cloud';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MSMELogo from '../assets/logos/MSME LOGO.png';
import AICTELogo from '../assets/logos/AICTE LOGO.png';

const Home = () => {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1f1f1f 50%, #000000 100%)',
          color: 'white',
          py: { xs: 12, md: 20 },
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          minHeight: { xs: 'auto', md: '80vh' }
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
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{
                fontSize: { xs: '2.75rem', sm: '4rem', md: '5.5rem' },
                mb: 3,
                fontWeight: 800,
                letterSpacing: '-0.04em',
                textAlign: 'center'
              }}
            >
              CodeOrbit
            </Typography>
            <Typography
              variant="h4"
              sx={{
                mb: 3,
                fontWeight: 400,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                lineHeight: 1.4,
                maxWidth: 800,
                mx: 'auto',
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center'
              }}
            >
              Building the Future of Technology
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 6,
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                lineHeight: 1.7,
                maxWidth: 700,
                mx: 'auto',
                textAlign: 'center'
              }}
            >
              Delivering innovative technology solutions for businesses while cultivating the next generation of tech professionals.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center">
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/internships"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                Explore Internships
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/services"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Our Services
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Trust Badges */}
      <Box sx={{ py: 4, bgcolor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 3, md: 8 }} 
            alignItems="center" 
            justifyContent="center"
          >
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5 }}>
              Trusted & Recognized By
            </Typography>
            <Box sx={{ display: 'flex', gap: { xs: 4, md: 8 }, alignItems: 'center' }}>
              <Box 
                component="img" 
                src={MSMELogo} 
                alt="MSME Recognized" 
                sx={{ height: { xs: 40, md: 60 }, filter: 'grayscale(1)', transition: 'filter 0.3s', '&:hover': { filter: 'grayscale(0)' } }} 
              />
              <Box 
                component="img" 
                src={AICTELogo} 
                alt="AICTE Recognized" 
                sx={{ height: { xs: 40, md: 60 }, filter: 'grayscale(1)', transition: 'filter 0.3s', '&:hover': { filter: 'grayscale(0)' } }} 
              />
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
        {/* Dual Focus Section */}
        <Grid container spacing={4} sx={{ mb: { xs: 12, md: 20 } }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper 
              sx={{ 
                p: { xs: 4, md: 6 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <BusinessIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 3 }} />
              <Typography variant="h3" gutterBottom sx={{ mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                Enterprise Solutions
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, flexGrow: 1, fontSize: '1.1rem' }}>
                Transform your business with cutting-edge IT infrastructure, custom software development, and strategic technology consulting.
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/services"
                sx={{ alignSelf: 'flex-start' }}
              >
                Explore Services
              </Button>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper 
              sx={{ 
                p: { xs: 4, md: 6 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <SchoolIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 3 }} />
              <Typography variant="h3" gutterBottom sx={{ mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                Professional Training
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, flexGrow: 1, fontSize: '1.1rem' }}>
                Launch your technology career with comprehensive internship programs featuring hands-on experience and industry mentorship.
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/internships"
                sx={{ alignSelf: 'flex-start' }}
              >
                View Programs
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Services Overview */}
        <Box sx={{ mb: { xs: 12, md: 20 } }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 2, textAlign: 'center' }}>
              Our Core Services
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: '1.125rem',
                maxWidth: 600,
                mx: 'auto',
                textAlign: 'center'
              }}
            >
              Comprehensive technology solutions tailored to meet your business objectives and drive measurable results.
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {[
              { icon: <CodeIcon />, title: 'Web Development', desc: 'Responsive, high-performance web applications built with modern frameworks and best practices.' },
              { icon: <CloudIcon />, title: 'Custom Software', desc: 'Bespoke software solutions engineered to streamline operations and solve complex business challenges.' },
              { icon: <SecurityIcon />, title: 'Cyber Security', desc: 'Comprehensive security audits and implementation of industry-standard protection for your digital assets.' }
            ].map((service, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index} sx={{ display: 'flex' }}>
                <Card sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <CardContent sx={{ textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 3
                    }}>
                      <Box sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: 4,
                        bgcolor: 'rgba(37, 99, 235, 0.08)',
                        color: 'secondary.main'
                      }}>
                        {React.cloneElement(service.icon, { sx: { fontSize: 40 } })}
                      </Box>
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: '1rem', textAlign: 'center', flexGrow: 1 }}>
                      {service.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Why Choose Section */}
        <Box sx={{ mb: { xs: 12, md: 20 } }}>
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h2" gutterBottom>
                Why Partner With CodeOrbit
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, fontSize: '1.1rem' }}>
                Our commitment to excellence, innovation, and professional development sets us apart in the industry.
              </Typography>
              <Stack spacing={3}>
                {[
                  'Industry-Leading Expertise',
                  'Recognized Certifications',
                  'Real-World Application',
                  'Comprehensive Support'
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircleIcon sx={{ color: 'secondary.main' }} />
                    <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>{item}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box 
                sx={{ 
                  bgcolor: 'rgba(15, 23, 42, 0.03)', 
                  borderRadius: 8, 
                  p: 6,
                  textAlign: 'center',
                  border: '1px dashed',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="h4" color="primary" sx={{ mb: 2 }}>100+</Typography>
                <Typography variant="body2" color="text.secondary">Projects Delivered</Typography>
                <Box sx={{ my: 4, height: '1px', bgcolor: 'divider' }} />
                <Typography variant="h4" color="primary" sx={{ mb: 2 }}>500+</Typography>
                <Typography variant="body2" color="text.secondary">Trained Professionals</Typography>
                <Box sx={{ my: 4, height: '1px', bgcolor: 'divider' }} />
                <Typography variant="h4" color="primary" sx={{ mb: 2 }}>98%</Typography>
                <Typography variant="body2" color="text.secondary">Client Satisfaction</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* CTA Section */}
        <Paper 
          sx={{ 
            p: { xs: 6, md: 10 }, 
            textAlign: 'center',
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: 8,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <Typography variant="h2" gutterBottom sx={{ color: 'white' }}>
            Ready to Transform Your Future?
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 6, 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '1.25rem',
              maxWidth: 700,
              mx: 'auto'
            }}
          >
            Whether you're seeking innovative IT solutions to elevate your business or looking to launch a rewarding career in technology.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/contact"
              sx={{
                bgcolor: '#d97706',
                color: 'white',
                px: 6,
                '&:hover': { bgcolor: '#b45309' }
              }}
            >
              Get in Touch
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/about"
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                px: 6,
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Learn More
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
