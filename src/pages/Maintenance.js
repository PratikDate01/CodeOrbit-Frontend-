import React from 'react';
import { Box, Typography, Container, Button, Paper, Link } from '@mui/material';
import { Wrench, Mail, ShieldAlert } from 'lucide-react';

const Maintenance = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1e293b 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        py: 6,
        px: 2,
        position: 'relative',
        color: '#ffffff',
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <Container maxWidth="sm">
        {/* Stylized Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            mb: 5,
            animation: 'fadeIn 1s ease-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(-10px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              bgcolor: '#2563eb',
              borderRadius: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(37,99,235,0.4)',
            }}
          >
            <Typography
              sx={{
                color: '#fff',
                fontWeight: 900,
                fontSize: '1.25rem',
                letterSpacing: '-1px',
              }}
            >
              C
            </Typography>
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(to right, #ffffff, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            CodeOrbit
          </Typography>
        </Box>

        {/* Maintenance Message Card */}
        <Paper
          elevation={24}
          sx={{
            p: { xs: 4, md: 5 },
            borderRadius: '24px',
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle accent glow */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              left: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(37,99,235,0) 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Icon */}
          <Box
            sx={{
              display: 'inline-flex',
              p: 2.5,
              borderRadius: '50%',
              bgcolor: 'rgba(37, 99, 235, 0.1)',
              color: '#3b82f6',
              mb: 3,
              boxShadow: '0 0 20px rgba(37, 99, 235, 0.1)',
              animation: 'spinPulse 4s infinite linear',
              '@keyframes spinPulse': {
                '0%': { transform: 'scale(1) rotate(0deg)' },
                '50%': { transform: 'scale(1.05) rotate(180deg)' },
                '100%': { transform: 'scale(1) rotate(360deg)' },
              },
            }}
          >
            <Wrench size={32} />
          </Box>

          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              mb: 2,
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
            }}
          >
            Scheduled Maintenance
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#94a3b8',
              mb: 4,
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            We are performing essential system upgrades and optimizing our databases to bring you a faster and more secure learning environment. We expect to be fully operational shortly.
          </Typography>

          {/* Time Estimate Box */}
          <Box
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              p: 2,
              mb: 4,
            }}
          >
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
              Estimated Return Time
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ color: '#f59e0b' }}>
              We will be back online shortly. Thank you for your patience!
            </Typography>
          </Box>

          {/* Contact Support */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Button
              component="a"
              href="mailto:support@codeorbit.com"
              variant="outlined"
              startIcon={<Mail size={16} />}
              sx={{
                borderRadius: '12px',
                borderColor: 'rgba(255,255,255,0.12)',
                color: '#e2e8f0',
                px: 3,
                py: 1,
                fontSize: '0.875rem',
                '&:hover': {
                  borderColor: '#fff',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Contact Support
            </Button>
          </Box>
        </Paper>

        {/* Footer Admin Bypass Link */}
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Link
            href="/login"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              color: '#475569',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'color 0.2s',
              '&:hover': {
                color: '#94a3b8',
              },
            }}
          >
            <ShieldAlert size={14} />
            Admin Portal
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Maintenance;
