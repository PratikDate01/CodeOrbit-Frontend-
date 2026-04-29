import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';

const sections = [
  {
    num: '01',
    title: 'Agreement to Terms',
    body: "By accessing or using CodeOrbit's platform and services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.",
  },
  {
    num: '02',
    title: 'Internship Program',
    body: 'CodeOrbit provides virtual internship programs for educational purposes. Admission to these programs is based on selection criteria defined by CodeOrbit.',
    bullets: [
      'Interns are expected to complete tasks within the specified timeline.',
      'Certificates are only issued upon successful completion of all required tasks and payment of relevant fees (if applicable).',
      'Misconduct or plagiarism will lead to immediate termination from the program without a refund.',
    ],
  },
  {
    num: '03',
    title: 'Fees and Payments',
    body: 'Certain internship tracks may require a fee for training resources, administrative processing, and certification infrastructure. All fees are clearly mentioned before the final application step.',
  },
  {
    num: '04',
    title: 'Intellectual Property',
    body: 'All content provided during the internship, including training materials and project skeletons, are the property of CodeOrbit. Interns retain ownership of the original code they write during the internship but grant CodeOrbit a license to use it for evaluation and showcase purposes.',
  },
  {
    num: '05',
    title: 'Limitation of Liability',
    body: 'CodeOrbit shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.',
  },
  {
    num: '06',
    title: 'Changes to Terms',
    body: 'We reserve the right to modify or replace these terms at any time. We will provide notice of any significant changes by posting the new terms on this page.',
  },
];

const Terms = () => {
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
            Terms &{' '}
            <Box component="span" sx={{ color: '#2563eb' }}>Conditions</Box>
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
                  mb: section.bullets ? 3 : 0,
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

export default Terms;