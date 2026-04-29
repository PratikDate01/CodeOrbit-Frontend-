import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';

const sections = [
  {
    num: '01',
    title: 'Non-Refundable Fees',
    body: 'Fees paid for internship programs are generally non-refundable. This is because upon payment, we immediately allocate resources, create your portal access, and initiate administrative processing.',
  },
  {
    num: '02',
    title: 'Eligibility for Refund',
    body: 'Refunds may only be considered in the following exceptional circumstances:',
    bullets: [
      'Duplicate payments made due to technical glitches.',
      'Cancellation of the internship program by CodeOrbit before the start date.',
    ],
  },
  {
    num: '03',
    title: 'Refund Process',
    body: null,
    richBody: (
      <>
        To request a refund for a duplicate payment, please email us at{' '}
        <Box component="span" sx={{ color: '#2563eb', fontWeight: 600 }}>support@codeorbit.ai</Box>
        {' '}with your payment receipt and transaction ID within 48 hours of the transaction. Approved refunds will be processed within 7–10 working days to the original payment method.
      </>
    ),
  },
  {
    num: '04',
    title: 'Program Cancellation',
    body: 'If CodeOrbit cancels an internship track for any reason, all registered candidates will receive a 100% refund of the fees paid for that specific track.',
  },
  {
    num: '05',
    title: 'No-Show Policy',
    body: 'If a candidate fails to join or participate in the internship after payment, no refund or credit will be provided.',
  },
];

const RefundPolicy = () => {
  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>

      {/* Hero */}
      <Box sx={{
        bgcolor: '#f7f7f5',
        pt: { xs: 14, md: 20 },
        pb: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid #e8e8e4',
      }}>
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
          backgroundSize: '28px 28px', opacity: 0.55, pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', top: '10%', right: '-5%',
          width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.09) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1,
            bgcolor: '#eff6ff', border: '1px solid #bfdbfe',
            borderRadius: '100px', px: 2, py: 0.5, mb: 4,
          }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#2563eb' }} />
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#2563eb', letterSpacing: 0.5 }}>
              Legal
            </Typography>
          </Box>

          <Typography variant="h1" sx={{
            fontSize: { xs: '2.75rem', sm: '3.75rem', md: '5rem' },
            fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.0,
            color: '#0a0a0a', mb: 3,
          }}>
            Refund &{' '}
            <Box component="span" sx={{ color: '#2563eb' }}>Cancellation</Box>
          </Typography>

          <Typography sx={{ color: '#a3a3a3', fontSize: '0.875rem', fontWeight: 500 }}>
            Last Updated: February 2, 2026
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>

        {/* Notice banner */}
        <Box sx={{
          p: 3.5, mb: 8,
          border: '1.5px solid #bfdbfe',
          borderRadius: '14px',
          bgcolor: '#eff6ff',
          display: 'flex',
          gap: 2,
          alignItems: 'flex-start',
        }}>
          <Box sx={{
            width: 22, height: 22, borderRadius: '50%',
            bgcolor: '#2563eb', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: '1px',
          }}>
            <Box component="span" sx={{ color: '#fff', fontSize: '0.7rem', fontWeight: 800, lineHeight: 1 }}>i</Box>
          </Box>
          <Typography sx={{ color: '#1d4ed8', fontSize: '0.95rem', lineHeight: 1.75, fontWeight: 500, textAlign: 'justify' }}>
            At CodeOrbit, we strive to provide the best learning experience. Please read our refund policy carefully before making any payments.
          </Typography>
        </Box>

        <Stack spacing={0}>
          {sections.map((section, idx) => (
            <Box key={idx} sx={{
              py: { xs: 5, md: 6 },
              borderBottom: idx < sections.length - 1 ? '1px solid #e8e8e4' : 'none',
              display: 'flex',
              gap: { xs: 3, md: 5 },
              alignItems: 'flex-start',
            }}>
              <Typography sx={{
                fontSize: '0.72rem', fontWeight: 800, color: '#d4d4d0',
                letterSpacing: '0.05em', flexShrink: 0, mt: '5px',
                minWidth: 28,
              }}>
                {section.num}
              </Typography>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{
                  fontWeight: 800, fontSize: { xs: '1.05rem', md: '1.2rem' },
                  color: '#0a0a0a', letterSpacing: '-0.03em', mb: 2,
                }}>
                  {section.title}
                </Typography>

                <Typography sx={{
                  color: '#3f3f3f', fontSize: '0.95rem',
                  lineHeight: 1.85, textAlign: 'justify',
                  mb: section.bullets ? 3 : 0,
                }}>
                  {section.richBody || section.body}
                </Typography>

                {section.bullets && (
                  <Stack spacing={2}>
                    {section.bullets.map((item, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{
                          width: 22, height: 22, borderRadius: '50%',
                          bgcolor: '#eff6ff', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', flexShrink: 0, mt: '2px',
                        }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2563eb' }} />
                        </Box>
                        <Typography sx={{
                          color: '#3f3f3f', fontSize: '0.925rem',
                          lineHeight: 1.8, textAlign: 'justify',
                        }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default RefundPolicy;