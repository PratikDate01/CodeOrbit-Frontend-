import React from 'react';
import { Container, Typography, Button, Grid, Box, Paper, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import CodeIcon from '@mui/icons-material/Code';
import CloudIcon from '@mui/icons-material/Cloud';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MSMELogo from '../assets/logos/MSME LOGO.png';
import AICTELogo from '../assets/logos/AICTE LOGO.png';

const Home = () => {
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
        {/* Decorative grid dot pattern */}
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
              MSME & AICTE Recognized
            </Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', sm: '4.5rem', md: '6.5rem' },
              fontWeight: 900,
              letterSpacing: '-0.05em',
              lineHeight: 1.0,
              color: '#0a0a0a',
              maxWidth: 900,
              mb: 2,
            }}
          >
            Code
            <Box component="span" sx={{ color: '#2563eb' }}>Orbit</Box>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4, flexDirection: { xs: 'column', md: 'row' }, mt: 6 }}>
            <Typography
              variant="h5"
              sx={{
                color: '#3f3f3f',
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.35rem' },
                lineHeight: 1.6,
                maxWidth: 480,
                flex: 1,
              }}
            >
              Building the future of technology — delivering enterprise solutions and cultivating the next generation of tech professionals.
            </Typography>
            <Stack spacing={2} sx={{ flex: '0 0 auto', pt: { xs: 0, md: 1 } }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/internships"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: '#0a0a0a',
                  color: '#fff',
                  px: 3.5,
                  py: 1.6,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  borderRadius: '10px',
                  letterSpacing: 0.2,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#1f1f1f', boxShadow: 'none' },
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
                  borderColor: '#d4d4d0',
                  borderWidth: '1.5px',
                  color: '#3f3f3f',
                  px: 3.5,
                  py: 1.6,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  borderRadius: '10px',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#0a0a0a', bgcolor: 'transparent', boxShadow: 'none' },
                }}
              >
                Our Services
              </Button>
            </Stack>
          </Box>

          {/* Stat strip */}
          <Box sx={{
            display: 'flex',
            gap: { xs: 4, md: 10 },
            mt: 10,
            pt: 6,
            borderTop: '1px solid #e8e8e4',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {[
              { num: '100+', label: 'Projects Delivered' },
              { num: '500+', label: 'Professionals Trained' },
              { num: '98%', label: 'Client Satisfaction' },
            ].map((s, i) => (
              <Box key={i} sx={{ textAlign: 'center', minWidth: 120 }}>
                <Typography sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em' }}>
                  {s.num}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#737373', fontWeight: 500, mt: 0.25 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Trust Badges */}
      <Box sx={{ py: 3.5, bgcolor: '#fff', borderBottom: '1px solid #e8e8e4' }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, md: 6 }} alignItems="center" justifyContent="center">
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#a3a3a3' }}>
              Trusted & Recognized By
            </Typography>
            <Box sx={{ display: 'flex', gap: { xs: 5, md: 8 }, alignItems: 'center' }}>
              <Box component="img" src={MSMELogo} alt="MSME" sx={{ height: { xs: 36, md: 52 }, filter: 'grayscale(1) opacity(0.55)', transition: 'filter 0.3s', '&:hover': { filter: 'grayscale(0) opacity(1)' } }} />
              <Box component="img" src={AICTELogo} alt="AICTE" sx={{ height: { xs: 36, md: 52 }, filter: 'grayscale(1) opacity(0.55)', transition: 'filter 0.3s', '&:hover': { filter: 'grayscale(0) opacity(1)' } }} />
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>

        {/* Dual Focus Section */}
        <Grid container spacing={3} sx={{ mb: { xs: 12, md: 20 } }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{
              p: { xs: 4, md: 5 },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: '1.5px solid #e8e8e4',
              bgcolor: '#fff',
              borderRadius: '16px',
              boxShadow: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              '&:hover': { borderColor: '#2563eb', boxShadow: '0 0 0 4px rgba(37,99,235,0.06)' }
            }}>
              <Box sx={{
                width: 44, height: 44, borderRadius: '10px',
                bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4
              }}>
                <BusinessIcon sx={{ fontSize: 24, color: '#2563eb' }} />
              </Box>
              <Typography variant="h4" sx={{ mb: 1.5, fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.03em' }}>
                Enterprise Solutions
              </Typography>
              <Typography sx={{ color: '#737373', mb: 4, flexGrow: 1, fontSize: '1rem', lineHeight: 1.7 }}>
                Transform your business with cutting-edge IT infrastructure, custom software development, and strategic technology consulting.
              </Typography>
              <Button
                component={Link}
                to="/services"
                endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem !important' }} />}
                sx={{
                  alignSelf: 'flex-start', color: '#2563eb', fontWeight: 600,
                  fontSize: '0.9rem', p: 0, minWidth: 0,
                  '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                }}
              >
                Explore Services
              </Button>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{
              p: { xs: 4, md: 5 },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: '1.5px solid #e8e8e4',
              bgcolor: '#fff',
              borderRadius: '16px',
              boxShadow: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              '&:hover': { borderColor: '#2563eb', boxShadow: '0 0 0 4px rgba(37,99,235,0.06)' }
            }}>
              <Box sx={{
                width: 44, height: 44, borderRadius: '10px',
                bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4
              }}>
                <SchoolIcon sx={{ fontSize: 24, color: '#2563eb' }} />
              </Box>
              <Typography variant="h4" sx={{ mb: 1.5, fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.03em' }}>
                Professional Training
              </Typography>
              <Typography sx={{ color: '#737373', mb: 4, flexGrow: 1, fontSize: '1rem', lineHeight: 1.7 }}>
                Launch your technology career with comprehensive internship programs featuring hands-on experience and industry mentorship.
              </Typography>
              <Button
                component={Link}
                to="/internships"
                endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem !important' }} />}
                sx={{
                  alignSelf: 'flex-start', color: '#2563eb', fontWeight: 600,
                  fontSize: '0.9rem', p: 0, minWidth: 0,
                  '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                }}
              >
                View Programs
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Services Overview */}
        <Box sx={{ mb: { xs: 12, md: 20 } }}>
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

          <Grid container spacing={3}>
            {[
              { icon: <CodeIcon />, title: 'Web Development', desc: 'Responsive, high-performance web applications built with modern frameworks and best practices.' },
              { icon: <CloudIcon />, title: 'Custom Software', desc: 'Bespoke software solutions engineered to streamline operations and solve complex business challenges.' },
              { icon: <SecurityIcon />, title: 'Cyber Security', desc: 'Comprehensive security audits and implementation of industry-standard protection for your digital assets.' }
            ].map((service, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Box sx={{
                  p: { xs: 3.5, md: 4 },
                  border: '1.5px solid #e8e8e4',
                  borderRadius: '16px',
                  height: '100%',
                  bgcolor: index === 1 ? '#0a0a0a' : '#fff',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: index === 1 ? '#0a0a0a' : '#2563eb',
                    boxShadow: index === 1 ? '0 16px 40px rgba(10,10,10,0.18)' : '0 0 0 4px rgba(37,99,235,0.06)',
                    transform: 'translateY(-2px)',
                  }
                }}>
                  <Box sx={{
                    width: 40, height: 40, borderRadius: '8px',
                    bgcolor: index === 1 ? 'rgba(255,255,255,0.1)' : '#eff6ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3
                  }}>
                    {React.cloneElement(service.icon, { sx: { fontSize: 22, color: index === 1 ? '#fff' : '#2563eb' } })}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700, color: index === 1 ? '#fff' : '#0a0a0a', letterSpacing: '-0.02em' }}>
                    {service.title}
                  </Typography>
                  <Typography sx={{ color: index === 1 ? 'rgba(255,255,255,0.6)' : '#737373', lineHeight: 1.75, fontSize: '0.95rem' }}>
                    {service.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Why Choose Section */}
        <Box sx={{ mb: { xs: 12, md: 20 } }}>
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 1.5 }}>
                Why Us
              </Typography>
              <Typography variant="h2" gutterBottom sx={{ fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '2.75rem' }, lineHeight: 1.15, mb: 3 }}>
                Why Partner With CodeOrbit
              </Typography>
              <Typography sx={{ color: '#737373', mb: 5, fontSize: '1rem', lineHeight: 1.7 }}>
                Our commitment to excellence, innovation, and professional development sets us apart in the industry.
              </Typography>
              <Stack spacing={2.5}>
                {[
                  'Industry-Leading Expertise',
                  'Recognized Certifications',
                  'Real-World Application',
                  'Comprehensive Support'
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircleIcon sx={{ fontSize: 15, color: '#2563eb' }} />
                    </Box>
                    <Typography sx={{ fontSize: '1rem', color: '#1a1a1a', fontWeight: 500 }}>{item}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{
                border: '1.5px solid #e8e8e4',
                borderRadius: '20px',
                overflow: 'hidden',
              }}>
                {[
                  { num: '100+', label: 'Projects Delivered' },
                  { num: '500+', label: 'Trained Professionals' },
                  { num: '98%', label: 'Client Satisfaction' },
                ].map((s, i) => (
                  <Box key={i} sx={{
                    px: { xs: 4, md: 6 },
                    py: 4,
                    borderBottom: i < 2 ? '1.5px solid #e8e8e4' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: '#fff',
                    transition: 'bgcolor 0.2s',
                    '&:hover': { bgcolor: '#f7f7f5' }
                  }}>
                    <Typography sx={{ fontSize: '0.9rem', color: '#737373', fontWeight: 500 }}>{s.label}</Typography>
                    <Typography sx={{ fontSize: '2.2rem', fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em' }}>{s.num}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>

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
            <Typography variant="h2" gutterBottom sx={{ color: '#ffffff', fontWeight: 800, letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '3rem' } }}>
              Ready to Transform<br />Your Future?
            </Typography>
            <Typography sx={{ mb: 6, color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', maxWidth: 560, mx: 'auto', lineHeight: 1.7 }}>
              Whether you're seeking innovative IT solutions or looking to launch a rewarding career in technology.
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
                  boxShadow: '0 0 0 0 rgba(37,99,235,0)',
                  '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 8px 30px rgba(37,99,235,0.45)' },
                  transition: 'all 0.2s',
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

export default Home;