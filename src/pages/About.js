import React from 'react';
import { Container, Typography, Grid, Box, Paper, Stack } from '@mui/material';
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
      icon: <LightbulbIcon sx={{ fontSize: 22 }} />,
      title: 'Innovation',
      description: 'Embracing cutting-edge technologies and creative solutions to solve complex challenges.'
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 22 }} />,
      title: 'Excellence',
      description: 'Maintaining the highest standards in every project and training program we deliver.'
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 22 }} />,
      title: 'Integrity',
      description: 'Building trust through transparency, honesty, and ethical business practices.'
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 22 }} />,
      title: 'Collaboration',
      description: 'Fostering partnerships and teamwork to achieve shared goals and success.'
    }
  ];

  return (
    <Box sx={{ bgcolor: '#ffffff' }}>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: '#f7f7f5',
          pt: { xs: 14, md: 20 },
          pb: { xs: 10, md: 14 },
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
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.09) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Eyebrow */}
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
              Who We Are
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
            About Code
            <Box component="span" sx={{ color: '#2563eb' }}>Orbit</Box>
          </Typography>

          <Typography
            sx={{
              color: '#3f3f3f',
              fontWeight: 400,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              lineHeight: 1.7,
              maxWidth: 620,
            }}
          >
            Empowering businesses with innovative IT solutions while cultivating the next generation of technology professionals.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>

        {/* Mission & Vision */}
        <Grid container spacing={3} sx={{ mb: { xs: 10, md: 16 } }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              sx={{
                p: { xs: 4, md: 5 },
                height: '100%',
                border: '1.5px solid #e8e8e4',
                borderRadius: '16px',
                boxShadow: 'none',
                bgcolor: '#fff',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                '&:hover': { borderColor: '#2563eb', boxShadow: '0 0 0 4px rgba(37,99,235,0.06)' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <Box sx={{
                  width: 44, height: 44, borderRadius: '10px',
                  bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <TrackChangesIcon sx={{ fontSize: 24, color: '#2563eb' }} />
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#0a0a0a', letterSpacing: '-0.03em' }}>
                  Our Mission
                </Typography>
              </Box>
              <Typography sx={{ color: '#737373', fontSize: '1rem', lineHeight: 1.75 }}>
                To deliver cutting-edge IT services that drive business growth and innovation while creating meaningful opportunities for aspiring technology professionals through comprehensive training and real-world experience.
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              sx={{
                p: { xs: 4, md: 5 },
                height: '100%',
                border: '1.5px solid #e8e8e4',
                borderRadius: '16px',
                boxShadow: 'none',
                bgcolor: '#0a0a0a',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 16px 40px rgba(10,10,10,0.18)' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <Box sx={{
                  width: 44, height: 44, borderRadius: '10px',
                  bgcolor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <VisibilityIcon sx={{ fontSize: 24, color: '#fff' }} />
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.03em' }}>
                  Our Vision
                </Typography>
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', lineHeight: 1.75 }}>
                To be recognized as a leading technology solutions provider and premier internship destination, known for excellence, innovation, and commitment to developing skilled professionals who shape the future of technology.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* What We Do */}
        <Box sx={{ mb: { xs: 10, md: 16 } }}>
          <Box sx={{ mb: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 1.5 }}>
                What We Do
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '2.75rem' } }}>
                Our Focus Areas
              </Typography>
            </Box>
            <Typography sx={{ color: '#737373', fontSize: '1rem', maxWidth: 380, lineHeight: 1.7 }}>
              CodeOrbit operates at the intersection of technology services and professional development.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{
                p: { xs: 4, md: 5 },
                border: '1.5px solid #e8e8e4',
                borderRadius: '16px',
                height: '100%',
                bgcolor: '#fff',
                transition: 'all 0.2s',
                '&:hover': { borderColor: '#2563eb', boxShadow: '0 0 0 4px rgba(37,99,235,0.06)', transform: 'translateY(-2px)' }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '8px', bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BusinessCenterIcon sx={{ fontSize: 22, color: '#2563eb' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                    IT Services
                  </Typography>
                </Box>
                <Typography sx={{ color: '#737373', mb: 4, fontSize: '0.95rem', lineHeight: 1.75 }}>
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
                      <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2563eb' }} />
                      </Box>
                      <Typography sx={{ fontSize: '0.9rem', color: '#3f3f3f' }}>{item}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{
                p: { xs: 4, md: 5 },
                border: '1.5px solid #e8e8e4',
                borderRadius: '16px',
                height: '100%',
                bgcolor: '#0a0a0a',
                transition: 'all 0.2s',
                '&:hover': { boxShadow: '0 16px 40px rgba(10,10,10,0.2)', transform: 'translateY(-2px)' }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SchoolIcon sx={{ fontSize: 22, color: '#fff' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#fff', letterSpacing: '-0.02em' }}>
                    Training Programs
                  </Typography>
                </Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.55)', mb: 4, fontSize: '0.95rem', lineHeight: 1.75 }}>
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
                      <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2563eb' }} />
                      </Box>
                      <Typography sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)' }}>{item}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Our Values */}
        <Box sx={{
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 8 },
          bgcolor: '#f7f7f5',
          borderRadius: '24px',
          border: '1px solid #e8e8e4',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Dot grid */}
          <Box sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.4,
            pointerEvents: 'none',
            borderRadius: '24px',
          }} />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ mb: 8 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 1.5 }}>
                Our Principles
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '2.75rem' } }}>
                Core Values
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {values.map((value, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <Box sx={{
                    p: 3.5,
                    bgcolor: '#fff',
                    border: '1.5px solid #e8e8e4',
                    borderRadius: '16px',
                    height: '100%',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: '#2563eb', boxShadow: '0 0 0 4px rgba(37,99,235,0.06)', transform: 'translateY(-2px)' }
                  }}>
                    <Box sx={{
                      width: 40, height: 40, borderRadius: '8px',
                      bgcolor: '#eff6ff', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', mb: 3, color: '#2563eb'
                    }}>
                      {value.icon}
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0a0a0a', mb: 1.5, letterSpacing: '-0.02em' }}>
                      {value.title}
                    </Typography>
                    <Typography sx={{ color: '#737373', fontSize: '0.9rem', lineHeight: 1.7 }}>
                      {value.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

      </Container>
    </Box>
  );
};

export default About;