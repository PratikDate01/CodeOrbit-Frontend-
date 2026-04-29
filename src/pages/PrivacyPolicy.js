import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';

const sections = [
  {
    num: '01',
    title: 'Introduction',
    body: 'Welcome to CodeOrbit. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.',
  },
  {
    num: '02',
    title: 'Data We Collect',
    body: 'We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:',
    bullets: [
      { bold: 'Identity Data', rest: ' — first name, last name, username or similar identifier.' },
      { bold: 'Contact Data', rest: ' — email address and telephone numbers.' },
      { bold: 'Educational Data', rest: ' — college name, degree, and graduation year for internship applications.' },
      { bold: 'Technical Data', rest: ' — IP address, login data, browser type and version.' },
    ],
  },
  {
    num: '03',
    title: 'How We Use Your Data',
    body: 'We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:',
    bullets: [
      { rest: 'To process your internship application.' },
      { rest: 'To issue certificates and offer letters.' },
      { rest: 'To manage our relationship with you.' },
      { rest: 'To improve our website, products/services, marketing, customer relationships and experiences.' },
    ],
  },
  {
    num: '04',
    title: 'Data Security',
    body: 'We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.',
  },
  {
    num: '05',
    title: 'Contact Us',
    body: 'If you have any questions about this privacy policy or our privacy practices, please contact us at:',
    contact: 'privacy@codeorbit.ai',
  },
];

const PrivacyPolicy = () => {
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
            Privacy{' '}
            <Box component="span" sx={{ color: '#2563eb' }}>Policy</Box>
          </Typography>

          <Typography sx={{ color: '#a3a3a3', fontSize: '0.875rem', fontWeight: 500 }}>
            Last Updated: February 2, 2026
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
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
                  mb: section.bullets || section.contact ? 3 : 0,
                }}>
                  {section.body}
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
                          {item.bold && (
                            <Box component="span" sx={{ fontWeight: 700, color: '#0a0a0a' }}>
                              {item.bold}
                            </Box>
                          )}
                          {item.rest}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}

                {section.contact && (
                  <Box sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 1.5,
                    px: 2.5, py: 1.25,
                    border: '1.5px solid #bfdbfe',
                    borderRadius: '10px',
                    bgcolor: '#eff6ff',
                  }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#737373' }}>
                      Email
                    </Typography>
                    <Box sx={{ width: 1, height: 14, bgcolor: '#bfdbfe' }} />
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#2563eb' }}>
                      {section.contact}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;