import React from 'react';
import { Box, Container, Typography, Grid, Button, Stack } from '@mui/material';
import { Users, BarChart, ShieldCheck, School } from 'lucide-react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';

const offerings = [
  {
    icon: <Users size={22} />,
    title: 'Bulk Internship Access',
    desc: 'Onboard entire batches of students into industry-aligned internship programs with ease.',
    dark: false,
  },
  {
    icon: <BarChart size={22} />,
    title: 'Admin Dashboard',
    desc: 'Get a dedicated dashboard to track student progress, attendance, and performance in real-time.',
    dark: true,
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Verified Reports',
    desc: 'Download authenticated internship completion reports and performance metrics for your records.',
    dark: false,
  },
  {
    icon: <School size={22} />,
    title: 'Curriculum Integration',
    desc: 'Our tasks can be mapped to your academic requirements for industrial training credits.',
    dark: false,
  },
];

const whyPoints = [
  'Centralized tracking for all student internships',
  'Performance-based evaluation and grading',
  'Direct industry exposure for students',
  'Support for AICTE / MSME compliance requirements',
];

const Colleges = () => {
  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>

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
              Institutional Partnerships
            </Typography>
          </Box>

          <Typography variant="h1" sx={{
            fontSize: { xs: '2.75rem', sm: '4rem', md: '5.5rem' },
            fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.0,
            color: '#0a0a0a', mb: 4, maxWidth: 800,
          }}>
            CodeOrbit for
            <Box component="span" sx={{ color: '#2563eb' }}> Institutions</Box>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4, flexDirection: { xs: 'column', md: 'row' }, mt: 2 }}>
            <Typography sx={{
              color: '#3f3f3f', fontWeight: 400,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              lineHeight: 1.7, maxWidth: 520, flex: 1,
            }}>
              Partner with us to provide your students with industry-standard internship experiences and simplified administrative tracking.
            </Typography>
            <Stack spacing={2} sx={{ flex: '0 0 auto', pt: { xs: 0, md: 1 } }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/contact"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: '#0a0a0a', color: '#fff',
                  px: 3.5, py: 1.6,
                  fontSize: '0.95rem', fontWeight: 600,
                  borderRadius: '10px', boxShadow: 'none',
                  '&:hover': { bgcolor: '#1f1f1f', boxShadow: 'none' },
                }}
              >
                Become a Partner
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/contact"
                sx={{
                  borderColor: '#d4d4d0', borderWidth: '1.5px',
                  color: '#3f3f3f', px: 3.5, py: 1.6,
                  fontSize: '0.95rem', fontWeight: 600, borderRadius: '10px',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#0a0a0a', bgcolor: 'transparent', boxShadow: 'none' },
                }}
              >
                Learn More
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>

        {/* ── Offerings ── */}
        <Box sx={{ mb: { xs: 12, md: 20 } }}>
          <Box sx={{ mb: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 1.5 }}>
                What We Offer
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '2.75rem' } }}>
                Institutional Benefits
              </Typography>
            </Box>
            <Typography sx={{ color: '#737373', fontSize: '1rem', maxWidth: 380, lineHeight: 1.7 }}>
              Everything your institution needs to run a seamless, verifiable internship program for your students.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {offerings.map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Box sx={{
                  p: { xs: 3.5, md: 4 },
                  border: '1.5px solid #e8e8e4',
                  borderRadius: '16px',
                  height: '100%',
                  bgcolor: item.dark ? '#0a0a0a' : '#fff',
                  transition: 'all 0.2s',
                  '&:hover': item.dark
                    ? { boxShadow: '0 16px 40px rgba(10,10,10,0.18)', transform: 'translateY(-2px)' }
                    : { borderColor: '#2563eb', boxShadow: '0 0 0 4px rgba(37,99,235,0.06)', transform: 'translateY(-2px)' },
                }}>
                  <Box sx={{
                    width: 40, height: 40, borderRadius: '8px', mb: 3,
                    bgcolor: item.dark ? 'rgba(255,255,255,0.08)' : '#eff6ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.dark ? '#fff' : '#2563eb',
                  }}>
                    {item.icon}
                  </Box>
                  <Typography sx={{
                    fontWeight: 700, fontSize: '1rem',
                    color: item.dark ? '#fff' : '#0a0a0a',
                    letterSpacing: '-0.02em', mb: 1.5,
                  }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{
                    color: item.dark ? 'rgba(255,255,255,0.55)' : '#737373',
                    fontSize: '0.9rem', lineHeight: 1.75,
                  }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ── Why Partner ── */}
        <Box sx={{ mb: { xs: 12, md: 20 } }}>
          <Grid container spacing={6} alignItems="center">

            {/* Left — text */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 1.5 }}>
                Why Us
              </Typography>
              <Typography variant="h2" sx={{
                fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em',
                fontSize: { xs: '2rem', md: '2.75rem' }, lineHeight: 1.15, mb: 3,
              }}>
                Why Partner with CodeOrbit?
              </Typography>
              <Typography sx={{ color: '#737373', fontSize: '1rem', lineHeight: 1.75, mb: 5 }}>
                We bridge the gap between academic theory and industry practice. Our platform provides a transparent, accountable, and high-quality internship ecosystem that benefits both students and institutions.
              </Typography>
              <Stack spacing={2.5}>
                {whyPoints.map((text, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: 22, height: 22, borderRadius: '50%',
                      bgcolor: '#eff6ff', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <CheckCircleIcon sx={{ fontSize: 15, color: '#2563eb' }} />
                    </Box>
                    <Typography sx={{ fontSize: '1rem', color: '#1a1a1a', fontWeight: 500 }}>{text}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Right — contact card */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{
                bgcolor: '#0a0a0a',
                borderRadius: '20px',
                p: { xs: 5, md: 6 },
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center',
              }}>
                {/* dot grid */}
                <Box sx={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
                  backgroundSize: '24px 24px', pointerEvents: 'none',
                }} />
                {/* blue glow */}
                <Box sx={{
                  position: 'absolute', top: '-30%', left: '20%',
                  width: 300, height: 300, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{
                    width: 56, height: 56, borderRadius: '14px',
                    bgcolor: 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto', mb: 3, color: '#fff',
                  }}>
                    <School size={28} />
                  </Box>

                  <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: '#fff', letterSpacing: '-0.03em', mb: 1.5 }}>
                    Contact Partnerships Team
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.75, mb: 4 }}>
                    Get a personalized demo of our institutional dashboard and bulk onboarding process.
                  </Typography>

                  <Box sx={{
                    px: 3, py: 2,
                    bgcolor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    mb: 4,
                  }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#2563eb', letterSpacing: '-0.01em' }}>
                      partners@codeorbit.ai
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    component={Link}
                    to="/contact"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      bgcolor: '#2563eb', color: '#fff',
                      py: 1.6, fontWeight: 600, fontSize: '0.95rem',
                      borderRadius: '10px', boxShadow: 'none',
                      '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 8px 30px rgba(37,99,235,0.45)' },
                      transition: 'all 0.2s',
                    }}
                  >
                    Get in Touch
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* ── CTA Strip ── */}
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
            backgroundSize: '24px 24px', pointerEvents: 'none',
          }} />
          <Box sx={{
            position: 'absolute', top: '-30%', left: '30%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h2" gutterBottom sx={{
              color: '#ffffff', fontWeight: 800,
              letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '3rem' },
            }}>
              Ready to Partner<br />With Us?
            </Typography>
            <Typography sx={{
              mb: 6, color: 'rgba(255,255,255,0.5)',
              fontSize: '1.1rem', maxWidth: 520, mx: 'auto', lineHeight: 1.7,
            }}>
              Join institutions already benefiting from CodeOrbit's internship ecosystem. Let's build the future of student training together.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/contact"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: '#2563eb', color: '#fff',
                  px: 5, py: 1.6, fontWeight: 600, fontSize: '0.95rem',
                  borderRadius: '10px', boxShadow: 'none',
                  '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 8px 30px rgba(37,99,235,0.45)' },
                  transition: 'all 0.2s',
                }}
              >
                Become a Partner
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/internships"
                sx={{
                  borderColor: 'rgba(255,255,255,0.18)', borderWidth: '1.5px',
                  color: 'rgba(255,255,255,0.75)',
                  px: 5, py: 1.6, fontWeight: 600, fontSize: '0.95rem',
                  borderRadius: '10px',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(255,255,255,0.05)' },
                }}
              >
                View Programs
              </Button>
            </Stack>
          </Box>
        </Box>

      </Container>
    </Box>
  );
};

export default Colleges;