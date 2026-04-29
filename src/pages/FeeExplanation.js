import React from 'react';
import { Box, Container, Typography, Grid, Stack, Button } from '@mui/material';
import { GraduationCap, ShieldCheck, Zap, Target } from 'lucide-react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';

const feeDetails = [
  {
    icon: <GraduationCap size={22} />,
    title: 'Training & Resources',
    desc: 'High-quality project guidelines, curated learning resources, and technical support to ensure you build industry-grade projects.',
    dark: false,
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Verification Infrastructure',
    desc: 'Permanent QR-based digital verification system for recruiters and colleges to verify your credentials anytime, anywhere.',
    dark: true,
  },
  {
    icon: <Zap size={22} />,
    title: 'Admin & Operations',
    desc: 'Processing applications, managing dashboard infrastructure, and ensuring timely issuance of offer letters and certificates.',
    dark: false,
  },
  {
    icon: <Target size={22} />,
    title: 'Cloud Infrastructure',
    desc: 'Maintenance of the project submission portal, cloud storage for your work, and automated evaluation systems.',
    dark: false,
  },
];

const whatYouGet = [
  'Verified Offer Letter (Digital)',
  'QR-Based Completion Certificate',
  'Letter of Recommendation (LOR)',
  'Project Review & Feedback',
  'Lifetime Verification Support',
  'Industry-Relevant Project Experience',
];

const FeeExplanation = () => {
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
              Transparency Policy
            </Typography>
          </Box>

          <Typography variant="h1" sx={{
            fontSize: { xs: '2.75rem', sm: '4rem', md: '5.5rem' },
            fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.0,
            color: '#0a0a0a', mb: 4,
          }}>
            Why We
            <Box component="span" sx={{ color: '#2563eb' }}> Charge?</Box>
          </Typography>

          <Typography sx={{
            color: '#3f3f3f', fontWeight: 400,
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            lineHeight: 1.7, maxWidth: 600,
          }}>
            At CodeOrbit, we believe in radical transparency. We don't hide our fees — here's exactly where your contribution goes.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
        <Grid container spacing={6} alignItems="flex-start">

          {/* ── Left — explanation ── */}
          <Grid size={{ xs: 12, md: 7 }}>

            {/* Intro text */}
            <Box sx={{ mb: 8 }}>
              <Typography sx={{
                fontWeight: 900, fontSize: { xs: '1.6rem', md: '2.2rem' },
                letterSpacing: '-0.04em', color: '#0a0a0a', lineHeight: 1.2, mb: 3,
              }}>
                Selection is Free.{' '}
                <Box component="span" sx={{ color: '#737373' }}>
                  Preparation has a cost.
                </Box>
              </Typography>
              <Typography sx={{
                color: '#3f3f3f', fontSize: '1rem',
                lineHeight: 1.85, textAlign: 'justify',
              }}>
                We do <Box component="span" sx={{ fontWeight: 700, color: '#0a0a0a' }}>not</Box> charge
                for job placement or the selection process. The internship fee is a{' '}
                <Box component="span" sx={{ fontWeight: 700, color: '#0a0a0a' }}>
                  one-time technical and administrative fee
                </Box>{' '}
                that covers the essential pillars of your internship experience:
              </Typography>
            </Box>

            {/* Fee detail cards */}
            <Grid container spacing={3}>
              {feeDetails.map((item, index) => (
                <Grid size={{ xs: 12, sm: 6 }} key={index}>
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
          </Grid>

          {/* ── Right — what you get ── */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              {/* Dark card */}
              <Box sx={{
                p: { xs: 5, md: 5 },
                bgcolor: '#0a0a0a',
                borderRadius: '20px',
                position: 'relative',
                overflow: 'hidden',
                mb: 3,
              }}>
                {/* dot grid */}
                <Box sx={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
                  backgroundSize: '24px 24px', pointerEvents: 'none',
                }} />
                {/* blue glow */}
                <Box sx={{
                  position: 'absolute', top: '-40%', right: '-20%',
                  width: 280, height: 280, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 2, mb: 1.5 }}>
                    Included
                  </Typography>
                  <Typography sx={{
                    fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.6rem' },
                    letterSpacing: '-0.04em', color: '#fff', mb: 4,
                  }}>
                    What You Get
                  </Typography>

                  <Stack spacing={2.5} sx={{ mb: 5 }}>
                    {whatYouGet.map((text, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                          width: 22, height: 22, borderRadius: '50%',
                          bgcolor: 'rgba(255,255,255,0.08)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <CheckCircleIcon sx={{ fontSize: 14, color: '#4ade80' }} />
                        </Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 500 }}>
                          {text}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Box sx={{ pt: 4, borderTop: '1px solid rgba(255,255,255,0.08)', mb: 4 }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', lineHeight: 1.8, textAlign: 'justify' }}>
                      By charging a nominal fee, we filter out non-serious applicants and maintain a high standard of quality for those truly committed to their growth.
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    component={Link}
                    to="/internships"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      bgcolor: '#2563eb', color: '#fff',
                      py: 1.6, fontWeight: 600, fontSize: '0.95rem',
                      borderRadius: '10px', boxShadow: 'none',
                      '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 8px 30px rgba(37,99,235,0.45)' },
                      transition: 'all 0.2s',
                    }}
                  >
                    Browse Internships
                  </Button>
                </Box>
              </Box>

              {/* Stats strip */}
              <Box sx={{
                border: '1.5px solid #e8e8e4',
                borderRadius: '16px',
                overflow: 'hidden',
              }}>
                {[
                  { num: '100%', label: 'Free Selection Process' },
                  { num: '₹999', label: 'Starting Program Fee' },
                  { num: '7–10', label: 'Days Refund Processing' },
                ].map((s, i) => (
                  <Box key={i} sx={{
                    px: 4, py: 3,
                    borderBottom: i < 2 ? '1.5px solid #e8e8e4' : 'none',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: '#fff',
                    transition: 'bgcolor 0.2s',
                    '&:hover': { bgcolor: '#f7f7f5' },
                  }}>
                    <Typography sx={{ fontSize: '0.875rem', color: '#737373', fontWeight: 500 }}>
                      {s.label}
                    </Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em' }}>
                      {s.num}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FeeExplanation;