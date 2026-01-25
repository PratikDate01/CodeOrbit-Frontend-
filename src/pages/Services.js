import React from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, Box, Paper, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      title: 'Web Development',
      description: 'Modern, responsive web applications built with cutting-edge technologies and frameworks.',
      icon: '🌐',
      features: [
        'Responsive Design & Mobile Optimization',
        'Progressive Web Applications (PWA)',
        'E-commerce Solutions',
      ],
      technologies: ['React.js', 'Next.js', 'Node.js', 'MongoDB'],
    },
    {
      title: 'Custom Software',
      description: 'Tailored software solutions designed to streamline operations and drive business growth.',
      icon: '⚙️',
      features: [
        'Enterprise Application Development',
        'API Design & Integration',
        'Workflow Automation',
      ],
      technologies: ['Python', 'Java', 'Django', 'Spring Boot'],
    },
    {
      title: 'Cloud Solutions',
      description: 'Comprehensive cloud services including migration, deployment, and infrastructure management.',
      icon: '☁️',
      features: [
        'Cloud Migration & Strategy',
        'Infrastructure as Code (IaC)',
        'Container Orchestration',
      ],
      technologies: ['AWS', 'Azure', 'Docker', 'Kubernetes'],
    },
    {
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android platforms.',
      icon: '📱',
      features: [
        'iOS & Android Development',
        'Cross-Platform Solutions',
        'Mobile UI/UX Design',
      ],
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
    },
    {
      title: 'IT Consulting',
      description: 'Strategic technology consulting to optimize infrastructure and accelerate digital transformation.',
      icon: '💼',
      features: [
        'Technology Strategy & Roadmap',
        'Digital Transformation',
        'System Architecture Review',
      ],
      technologies: ['Enterprise Architecture', 'DevOps', 'Agile'],
    },
    {
      title: 'Cybersecurity',
      description: 'Comprehensive security solutions to protect your digital assets and ensure compliance.',
      icon: '🔒',
      features: [
        'Security Assessments & Audits',
        'Penetration Testing',
        'Incident Response',
      ],
      technologies: ['SSL/TLS', 'OAuth 2.0', 'SIEM Tools'],
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
              Our Services
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
              Advanced Technology Solutions for Modern Business
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
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
            {services.map((service, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index} sx={{ display: 'flex' }}>
                <Card sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  width: '100%',
                  minHeight: 520,
                  p: { xs: 3, md: 5 }, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 4,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: (theme) => theme.shadows[8],
                    borderColor: 'primary.main'
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 3,
                      minHeight: 80,
                      alignItems: 'center'
                    }}>
                      <Box sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: 4,
                        bgcolor: 'rgba(37, 99, 235, 0.08)',
                        color: 'secondary.main'
                      }}>
                        <Typography variant="h3">{service.icon}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2, textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: '1rem', textAlign: 'center', mb: 4, minHeight: 60 }}>
                      {service.description}
                    </Typography>
                    <Box sx={{ mb: 4, flexGrow: 1, textAlign: 'left' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: '0.9rem', fontWeight: 700, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>Key Features</Typography>
                      <Stack spacing={2} sx={{ px: { xs: 0, md: 4 } }}>
                        {service.features.map((feature, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main', mt: 0.8, flexShrink: 0 }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.95rem', lineHeight: 1.4, fontWeight: 500 }}>{feature}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                    <Box sx={{ mt: 'auto' }}>
                      <Button
                        variant="contained"
                        component={Link}
                        to="/contact"
                        size="large"
                        fullWidth
                        sx={{ 
                          py: 2,
                          fontSize: '1.1rem', 
                          fontWeight: 700,
                          borderRadius: 2,
                          textTransform: 'none',
                          boxShadow: 'none',
                          '&:hover': {
                            boxShadow: (theme) => theme.shadows[4]
                          }
                        }}
                      >
                        Get Started
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
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
            Need a Custom Solution?
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
            Let's discuss how we can help your business grow with our expert technology services.
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
              Schedule a Consultation
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Services;
