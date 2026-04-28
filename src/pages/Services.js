import React from 'react';
import { Container, Typography, Button, Grid, Box, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudIcon from '@mui/icons-material/Cloud';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Services = () => {
  const services = [
    {
      icon: <CodeIcon />,
      title: 'Web Development',
      description: 'Modern, responsive web applications built with cutting-edge technologies and frameworks.',
      features: [
        'Responsive Design & Mobile Optimization',
        'Progressive Web Applications (PWA)',
        'E-commerce Solutions',
      ],
      technologies: ['React.js', 'Next.js', 'Node.js', 'MongoDB'],
      dark: false,
    },
    {
      icon: <SettingsIcon />,
      title: 'Custom Software',
      description: 'Tailored software solutions designed to streamline operations and drive business growth.',
      features: [
        'Enterprise Application Development',
        'API Design & Integration',
        'Workflow Automation',
      ],
      technologies: ['Python', 'Java', 'Django', 'Spring Boot'],
      dark: true,
    },
    {
      icon: <CloudIcon />,
      title: 'Cloud Solutions',
      description: 'Comprehensive cloud services including migration, deployment, and infrastructure management.',
      features: [
        'Cloud Migration & Strategy',
        'Infrastructure as Code (IaC)',
        'Container Orchestration',
      ],
      technologies: ['AWS', 'Azure', 'Docker', 'Kubernetes'],
      dark: false,
    },
    {
      icon: <SmartphoneIcon />,
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android platforms.',
      features: [
        'iOS & Android Development',
        'Cross-Platform Solutions',
        'Mobile UI/UX Design',
      ],
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
      dark: true,
    },
    {
      icon: <BusinessCenterIcon />,
      title: 'IT Consulting',
      description: 'Strategic technology consulting to optimize infrastructure and accelerate digital transformation.',
      features: [
        'Technology Strategy & Roadmap',
        'Digital Transformation',
        'System Architecture Review',
      ],
      technologies: ['Enterprise Architecture', 'DevOps', 'Agile'],
      dark: false,
    },
    {
      icon: <SecurityIcon />,
      title: 'Cybersecurity',
      description: 'Comprehensive security solutions to protect your digital assets and ensure compliance.',
      features: [
        'Security Assessments & Audits',
        'Penetration Testing',
        'Incident Response',
      ],
      technologies: ['SSL/TLS', 'OAuth 2.0', 'SIEM Tools'],
      dark: true,
    },
  ];

  return (
    <Box sx={{ bgcolor: '#ffffff', fontFamily: '"DM Sans", sans-serif' }}>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: '#f7f7f5',
          pt: { xs: 14, md: 22 },
          pb: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid #e8e8e4',
        }}
      >
        {/* Dot grid */}
        <Box sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.55,
          pointerEvents: 'none',
        }} />
        {/* Blue accent blob */}
        <Box sx={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Eyebrow tag */}
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '100px',
            px: 2,
            py: 0.5,
            mb: 4,
          }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#2563eb' }} />
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#2563eb', letterSpacing: 0.5 }}>
              What We Offer
            </Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.75rem', sm: '4rem', md: '5.5rem' },
              fontWeight: 900,
              letterSpacing: '-0.05em',
              lineHeight: 1.0,
              color: '#0a0a0a',
              mb: 4,
            }}
          >
            Our
            <Box component="span" sx={{ color: '#2563eb' }}> Services</Box>
          </Typography>

          <Typography
            sx={{
              color: '#3f3f3f',
              fontWeight: 400,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              lineHeight: 1.7,
              maxWidth: 580,
            }}
          >
            Advanced technology solutions engineered to transform your business and drive measurable, lasting results.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>

        {/* Section Header */}
        <Box sx={{ mb: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 1.5 }}>
              What We Do
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '2.75rem' } }}>
              Core Services
            </Typography>
          </Box>
          <Typography sx={{ color: '#737373', fontSize: '1rem', maxWidth: 380, lineHeight: 1.7 }}>
            Comprehensive technology solutions tailored to meet your business objectives and drive measurable results.
          </Typography>
        </Box>

        {/* Services Grid */}
        <Grid container spacing={3} sx={{ mb: { xs: 12, md: 20 } }}>
          {services.map((service, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Box sx={{
                p: { xs: 4, md: 5 },
                border: '1.5px solid #e8e8e4',
                borderRadius: '16px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: service.dark ? '#0a0a0a' : '#fff',
                transition: 'all 0.2s',
                '&:hover': service.dark
                  ? { boxShadow: '0 16px 40px rgba(10,10,10,0.2)', transform: 'translateY(-2px)' }
                  : { borderColor: '#2563eb', boxShadow: '0 0 0 4px rgba(37,99,235,0.06)', transform: 'translateY(-2px)' },
              }}>
                {/* Icon */}
                <Box sx={{
                  width: 44, height: 44, borderRadius: '10px',
                  bgcolor: service.dark ? 'rgba(255,255,255,0.08)' : '#eff6ff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3,
                }}>
                  {React.cloneElement(service.icon, {
                    sx: { fontSize: 24, color: service.dark ? '#fff' : '#2563eb' }
                  })}
                </Box>

                {/* Title */}
                <Typography sx={{
                  fontWeight: 700,
                  fontSize: '1.3rem',
                  color: service.dark ? '#fff' : '#0a0a0a',
                  letterSpacing: '-0.03em',
                  mb: 1.5,
                }}>
                  {service.title}
                </Typography>

                {/* Description */}
                <Typography sx={{
                  color: service.dark ? 'rgba(255,255,255,0.55)' : '#737373',
                  fontSize: '0.95rem',
                  lineHeight: 1.75,
                  mb: 4,
                }}>
                  {service.description}
                </Typography>

                {/* Features */}
                <Stack spacing={2} sx={{ mb: 4, flexGrow: 1 }}>
                  {service.features.map((feature, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 22, height: 22, borderRadius: '50%',
                        bgcolor: service.dark ? 'rgba(255,255,255,0.08)' : '#eff6ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <CheckCircleIcon sx={{ fontSize: 14, color: service.dark ? 'rgba(255,255,255,0.5)' : '#2563eb' }} />
                      </Box>
                      <Typography sx={{
                        fontSize: '0.9rem',
                        color: service.dark ? 'rgba(255,255,255,0.65)' : '#3f3f3f',
                        fontWeight: 500,
                      }}>
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                {/* Tech tags */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                  {service.technologies.map((tech, idx) => (
                    <Box key={idx} sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      bgcolor: service.dark ? 'rgba(255,255,255,0.07)' : '#f7f7f5',
                      color: service.dark ? 'rgba(255,255,255,0.5)' : '#737373',
                      border: '1px solid',
                      borderColor: service.dark ? 'rgba(255,255,255,0.1)' : '#e8e8e4',
                      letterSpacing: 0.3,
                    }}>
                      {tech}
                    </Box>
                  ))}
                </Box>

                {/* CTA link */}
                <Button
                  component={Link}
                  to="/contact"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem !important' }} />}
                  sx={{
                    alignSelf: 'flex-start',
                    color: service.dark ? 'rgba(255,255,255,0.7)' : '#2563eb',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    p: 0,
                    minWidth: 0,
                    '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        <Box sx={{
          p: { xs: 6, md: 10 },
          textAlign: 'center',
          bgcolor: '#0a0a0a',
          borderRadius: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Box sx={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
          }} />
          <Box sx={{
            position: 'absolute', top: '-30%', left: '30%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h2" gutterBottom sx={{
              color: '#ffffff',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              fontSize: { xs: '2rem', md: '3rem' },
            }}>
              Need a Custom<br />Solution?
            </Typography>
            <Typography sx={{
              mb: 6,
              color: 'rgba(255,255,255,0.5)',
              fontSize: '1.1rem',
              maxWidth: 560,
              mx: 'auto',
              lineHeight: 1.7,
            }}>
              Let's discuss how we can help your business grow with expert technology services tailored to your needs.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/contact"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: '#2563eb',
                  color: '#fff',
                  px: 5,
                  py: 1.6,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  borderRadius: '10px',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 8px 30px rgba(37,99,235,0.45)' },
                  transition: 'all 0.2s',
                }}
              >
                Schedule a Consultation
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/about"
                sx={{
                  borderColor: 'rgba(255,255,255,0.18)',
                  borderWidth: '1.5px',
                  color: 'rgba(255,255,255,0.75)',
                  px: 5,
                  py: 1.6,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  borderRadius: '10px',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(255,255,255,0.05)' },
                }}
              >
                Learn More
              </Button>
            </Stack>
          </Box>
        </Box>

      </Container>
    </Box>
  );
};

export default Services;