import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Stack } from '@mui/material';
import {
  ShieldCheck,
  ShieldAlert,
  FileDown,
  Calendar,
  User,
  Award,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import API from '../api/api';

const getDocumentUrl = (url) => {
  if (!url) return '#';
  return url;
};

const DetailRow = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
    <Box sx={{
      width: 44, height: 44, borderRadius: '10px',
      bgcolor: '#eff6ff', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0, color: '#2563eb',
    }}>
      {icon}
    </Box>
    <Box>
      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: 1.5, mb: 0.25 }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 600, color: '#0a0a0a', fontSize: '0.95rem', lineHeight: 1.5 }}>
        {value || 'N/A'}
      </Typography>
    </Box>
  </Box>
);

const VerifyDocument = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await API.get(`/documents/verify/${id}`);
        setDocument(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Verification failed');
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '80vh', bgcolor: '#ffffff',
      }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: '50%',
          border: '2.5px solid #e8e8e4',
          borderTopColor: '#2563eb',
          animation: 'spin 0.8s linear infinite',
          '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
        }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>

      {/* ── Hero strip ── */}
      <Box sx={{
        bgcolor: '#f7f7f5',
        pt: { xs: 14, md: 18 },
        pb: { xs: 8, md: 10 },
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
          width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Button
            component={Link}
            to="/verify"
            startIcon={<ChevronLeft size={16} />}
            sx={{
              mb: 4, color: '#737373', fontWeight: 600, fontSize: '0.875rem',
              p: 0, minWidth: 0,
              '&:hover': { bgcolor: 'transparent', color: '#0a0a0a' },
            }}
          >
            Back to Verification
          </Button>

          {/* eyebrow */}
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1,
            bgcolor: '#eff6ff', border: '1px solid #bfdbfe',
            borderRadius: '100px', px: 2, py: 0.5, mb: 4,
          }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#2563eb' }} />
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#2563eb', letterSpacing: 0.5 }}>
              Document Verification
            </Typography>
          </Box>

          <Typography variant="h1" sx={{
            fontSize: { xs: '2.75rem', sm: '4rem', md: '5rem' },
            fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.0,
            color: '#0a0a0a',
          }}>
            Verify
            <Box component="span" sx={{ color: '#2563eb' }}> Certificate</Box>
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>

        {/* ── Error State ── */}
        {error ? (
          <Box sx={{
            p: { xs: 6, md: 10 },
            border: '1.5px solid #e8e8e4',
            borderRadius: '24px',
            textAlign: 'center',
            bgcolor: '#fff',
          }}>
            <Box sx={{
              width: 80, height: 80, borderRadius: '50%',
              bgcolor: '#fee2e2', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              mx: 'auto', mb: 4, color: '#b91c1c',
            }}>
              <ShieldAlert size={40} />
            </Box>
            <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.75rem', md: '2.5rem' }, letterSpacing: '-0.04em', color: '#0a0a0a', mb: 2 }}>
              Verification Failed
            </Typography>
            <Typography sx={{ color: '#737373', fontSize: '1rem', lineHeight: 1.75, maxWidth: 500, mx: 'auto', mb: 6 }}>
              We couldn't locate any record matching this verification ID. This could be due to an incorrect ID or the document might not be authentic.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                component={Link}
                to="/verify"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: '#0a0a0a', color: '#fff',
                  px: 4, py: 1.6, fontWeight: 600, fontSize: '0.95rem',
                  borderRadius: '10px', boxShadow: 'none',
                  '&:hover': { bgcolor: '#1f1f1f', boxShadow: 'none' },
                }}
              >
                Try Another ID
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to="/contact"
                sx={{
                  borderColor: '#d4d4d0', borderWidth: '1.5px',
                  color: '#3f3f3f', px: 4, py: 1.6,
                  fontWeight: 600, fontSize: '0.95rem', borderRadius: '10px',
                  '&:hover': { borderColor: '#0a0a0a', bgcolor: 'transparent' },
                }}
              >
                Contact Support
              </Button>
            </Stack>
          </Box>
        ) : (
          <>
            {/* ── Success Banner ── */}
            <Box sx={{
              p: { xs: 5, md: 8 },
              bgcolor: '#0a0a0a',
              borderRadius: '24px',
              mb: 4,
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
              {/* green glow */}
              <Box sx={{
                position: 'absolute', top: '-30%', left: '30%',
                width: 400, height: 400, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(22,163,74,0.2) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{
                  width: 72, height: 72, borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mx: 'auto', mb: 3, color: '#4ade80',
                }}>
                  <ShieldCheck size={40} />
                </Box>
                <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.75rem', md: '2.5rem' }, letterSpacing: '-0.04em', color: '#fff', mb: 1.5 }}>
                  Authenticity Verified
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 520, mx: 'auto' }}>
                  This document is officially issued and recognized by CodeOrbit Solutions.
                </Typography>
              </Box>
            </Box>

            {/* ── Details ── */}
            <Grid container spacing={4}>
              {/* Left — Holder info */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Box sx={{
                  p: { xs: 4, md: 5 },
                  border: '1.5px solid #e8e8e4',
                  borderRadius: '20px',
                  bgcolor: '#fff',
                  height: '100%',
                }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 1.5 }}>
                    Official Record
                  </Typography>
                  <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.5rem', md: '2rem' }, letterSpacing: '-0.04em', color: '#0a0a0a', mb: 6 }}>
                    {document.applicationId?.name}
                  </Typography>

                  <Stack spacing={4}>
                    <DetailRow
                      icon={<Award size={22} />}
                      label="Program / Domain"
                      value={document.applicationId?.preferredDomain}
                    />
                    <DetailRow
                      icon={<Calendar size={22} />}
                      label="Tenure Period"
                      value={`${new Date(document.applicationId?.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} – ${new Date(document.applicationId?.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
                    />
                    <DetailRow
                      icon={<User size={22} />}
                      label="Registered Email"
                      value={document.applicationId?.email}
                    />
                  </Stack>
                </Box>
              </Grid>

              {/* Right — Meta + Actions */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Stack spacing={3}>
                  {/* Security Metadata */}
                  <Box sx={{
                    p: { xs: 4, md: 4 },
                    border: '1.5px solid #e8e8e4',
                    borderRadius: '20px',
                    bgcolor: '#f7f7f5',
                  }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 3 }}>
                      Security Metadata
                    </Typography>
                    <Stack spacing={3}>
                      <Box>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: 1.5, mb: 0.5 }}>
                          Verification ID
                        </Typography>
                        <Typography sx={{ fontWeight: 700, color: '#2563eb', fontFamily: 'monospace', fontSize: '1rem', letterSpacing: 0.5 }}>
                          {document.verificationId}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: 1.5, mb: 0.5 }}>
                          Issue Date
                        </Typography>
                        <Typography sx={{ fontWeight: 600, color: '#0a0a0a', fontSize: '0.95rem' }}>
                          {new Date(document.issuedOn).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: 1.5, mb: 1 }}>
                          Record Status
                        </Typography>
                        <Box sx={{
                          display: 'inline-flex', alignItems: 'center', gap: 1,
                          px: 2, py: 0.5, borderRadius: '100px',
                          bgcolor: '#dcfce7', fontSize: '0.8rem', fontWeight: 700, color: '#15803d',
                        }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#16a34a' }} />
                          Valid & Active
                        </Box>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Download Actions */}
                  <Stack spacing={2}>
                    {document.certificateUrl && (
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<FileDown size={18} />}
                        href={getDocumentUrl(document.certificateUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          bgcolor: '#0a0a0a', color: '#fff',
                          py: 1.6, fontWeight: 600, fontSize: '0.95rem',
                          borderRadius: '10px', boxShadow: 'none',
                          '&:hover': { bgcolor: '#1f1f1f', boxShadow: 'none' },
                        }}
                      >
                        Download Certificate
                      </Button>
                    )}
                    {document.offerLetterUrl && (
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<ExternalLink size={18} />}
                        href={getDocumentUrl(document.offerLetterUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          borderColor: '#d4d4d0', borderWidth: '1.5px',
                          color: '#3f3f3f', py: 1.6,
                          fontWeight: 600, fontSize: '0.95rem', borderRadius: '10px',
                          '&:hover': { borderColor: '#0a0a0a', bgcolor: 'transparent' },
                        }}
                      >
                        View Offer Letter
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>

            {/* ── Footer note ── */}
            <Box sx={{
              mt: 6, pt: 6,
              borderTop: '1px solid #e8e8e4',
              textAlign: 'center',
            }}>
              <Typography sx={{ color: '#a3a3a3', fontSize: '0.875rem', lineHeight: 1.75, maxWidth: 600, mx: 'auto' }}>
                This is a digitally verified record issued by CodeOrbit Solutions. For queries regarding this verification, contact our support team at{' '}
                <Box component="span" sx={{ color: '#2563eb', fontWeight: 600 }}>verification@codeorbit.ai</Box>
              </Typography>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default VerifyDocument;