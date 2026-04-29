import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Grid } from '@mui/material';
import { Search, QrCode, ShieldCheck } from 'lucide-react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Html5QrcodeScanner } from 'html5-qrcode';

const VerifySearch = () => {
  const [verificationId, setVerificationId] = useState('');
  const [error, setError] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  const onScanSuccess = useCallback((decodedText) => {
    let id = decodedText;
    if (decodedText.includes('/verify/')) {
      id = decodedText.split('/verify/')[1].split('?')[0];
    }
    navigate(`/verify/${id}`);
  }, [navigate]);

  useEffect(() => {
    let scanner = null;
    if (showScanner) {
      scanner = new Html5QrcodeScanner(
        'reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      scanner.render(onScanSuccess, () => {});
    }
    return () => {
      if (scanner) scanner.clear().catch(() => {});
    };
  }, [showScanner, onScanSuccess]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!verificationId.trim()) {
      setError('Please enter a verification ID');
      return;
    }
    navigate(`/verify/${verificationId.trim()}`);
  };

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
              Document Verification
            </Typography>
          </Box>

          <Typography variant="h1" sx={{
            fontSize: { xs: '2.75rem', sm: '4rem', md: '5.5rem' },
            fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.0,
            color: '#0a0a0a', mb: 4,
          }}>
            Credential
            <Box component="span" sx={{ color: '#2563eb' }}> Verification</Box>
          </Typography>

          <Typography sx={{
            color: '#3f3f3f', fontWeight: 400,
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            lineHeight: 1.7, maxWidth: 560,
          }}>
            Verify the authenticity of internship certificates, offer letters, and achievement awards issued by CodeOrbit.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>

        {/* ── Verification Cards ── */}
        <Grid container spacing={4} sx={{ mb: { xs: 10, md: 14 } }}>

          {/* Search by ID */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{
              p: { xs: 4, md: 5 },
              border: '1.5px solid #e8e8e4',
              borderRadius: '20px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#fff',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              '&:hover': { borderColor: '#2563eb', boxShadow: '0 0 0 4px rgba(37,99,235,0.06)' },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{
                  width: 44, height: 44, borderRadius: '10px',
                  bgcolor: '#eff6ff', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: '#2563eb', flexShrink: 0,
                }}>
                  <Search size={22} />
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#0a0a0a', letterSpacing: '-0.03em' }}>
                  Search by ID
                </Typography>
              </Box>

              <Typography sx={{ color: '#737373', fontSize: '0.95rem', lineHeight: 1.75, mb: 5 }}>
                Enter the unique verification ID found at the bottom of your CodeOrbit document.
              </Typography>

              <Box component="form" onSubmit={handleSearch} sx={{ mt: 'auto' }}>
                <TextField
                  fullWidth
                  label="Verification ID"
                  placeholder="CO-XXXX-XXXXXX"
                  value={verificationId}
                  onChange={(e) => { setVerificationId(e.target.value); setError(''); }}
                  error={!!error}
                  helperText={error}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '& fieldset': { borderColor: '#e8e8e4', borderWidth: '1.5px' },
                      '&:hover fieldset': { borderColor: '#0a0a0a' },
                      '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: '#0a0a0a', color: '#fff',
                    py: 1.6, fontWeight: 600, fontSize: '0.95rem',
                    borderRadius: '10px', boxShadow: 'none',
                    '&:hover': { bgcolor: '#1f1f1f', boxShadow: 'none' },
                  }}
                >
                  Verify Now
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Scan QR */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{
              p: { xs: 4, md: 5 },
              border: '1.5px solid #e8e8e4',
              borderRadius: '20px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#0a0a0a',
              position: 'relative',
              overflow: 'hidden',
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: '0 16px 40px rgba(10,10,10,0.18)' },
            }}>
              {/* dot grid */}
              <Box sx={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '24px 24px', pointerEvents: 'none',
              }} />
              {/* blue glow */}
              <Box sx={{
                position: 'absolute', bottom: '-30%', right: '-20%',
                width: 280, height: 280, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: '10px',
                    bgcolor: 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', flexShrink: 0,
                  }}>
                    <QrCode size={22} />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#fff', letterSpacing: '-0.03em' }}>
                    Scan QR Code
                  </Typography>
                </Box>

                <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.75, mb: 5 }}>
                  Use your device camera to scan the QR code printed on the document for instant validation.
                </Typography>

                <Box sx={{ mt: 'auto' }}>
                  {!showScanner ? (
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      onClick={() => setShowScanner(true)}
                      startIcon={<QrCode size={18} />}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.2)', borderWidth: '1.5px',
                        color: 'rgba(255,255,255,0.8)',
                        py: 1.6, fontWeight: 600, fontSize: '0.95rem',
                        borderRadius: '10px',
                        '&:hover': { borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(255,255,255,0.05)' },
                      }}
                    >
                      Open Scanner
                    </Button>
                  ) : (
                    <Box>
                      <Box sx={{
                        border: '1.5px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        mb: 3,
                        bgcolor: 'rgba(255,255,255,0.03)',
                      }}>
                        <Box id="reader" sx={{ width: '100%' }} />
                      </Box>
                      <Button
                        fullWidth
                        onClick={() => setShowScanner(false)}
                        sx={{
                          color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.875rem',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: '#fff' },
                        }}
                      >
                        Cancel Scanning
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* ── How It Works ── */}
        <Box sx={{
          py: { xs: 8, md: 10 },
          px: { xs: 4, md: 8 },
          bgcolor: '#f7f7f5',
          borderRadius: '24px',
          border: '1px solid #e8e8e4',
          position: 'relative',
          overflow: 'hidden',
          mb: { xs: 10, md: 14 },
        }}>
          <Box sx={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
            backgroundSize: '28px 28px', opacity: 0.4, pointerEvents: 'none',
          }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ mb: 8 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, mb: 1.5 }}>
                How It Works
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '2.75rem' } }}>
                Verification Steps
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {[
                { num: '01', title: 'Locate the ID', desc: 'Find the unique Verification ID or QR code at the bottom of your certificate or offer letter.' },
                { num: '02', title: 'Enter or Scan', desc: 'Type the ID into the search field above, or scan the QR code directly using your camera.' },
                { num: '03', title: 'Instant Result', desc: 'Our system instantly checks the record and displays the authentic certificate details.' },
              ].map((step, i) => (
                <Grid size={{ xs: 12, md: 4 }} key={i}>
                  <Box sx={{
                    p: 3.5, bgcolor: '#fff',
                    border: '1.5px solid #e8e8e4', borderRadius: '16px',
                    height: '100%', transition: 'all 0.2s',
                    '&:hover': { borderColor: '#2563eb', boxShadow: '0 0 0 4px rgba(37,99,235,0.06)', transform: 'translateY(-2px)' },
                  }}>
                    <Box sx={{
                      width: 40, height: 40, borderRadius: '8px',
                      bgcolor: '#eff6ff', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', mb: 3,
                    }}>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: '#2563eb' }}>{step.num}</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0a0a0a', mb: 1, letterSpacing: '-0.02em' }}>
                      {step.title}
                    </Typography>
                    <Typography sx={{ color: '#737373', fontSize: '0.9rem', lineHeight: 1.75 }}>
                      {step.desc}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* ── Assistance Notice ── */}
        <Box sx={{
          p: { xs: 4, md: 5 },
          border: '1.5px solid #bfdbfe',
          borderRadius: '16px',
          bgcolor: '#eff6ff',
          display: 'flex',
          gap: 3,
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', md: 'row' },
        }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: '10px',
            bgcolor: '#2563eb', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            color: '#fff',
          }}>
            <ShieldCheck size={22} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0a0a0a', mb: 1 }}>
              Need Assistance?
            </Typography>
            <Typography sx={{ color: '#3f3f3f', fontSize: '0.925rem', lineHeight: 1.8 }}>
              If you're unable to verify a document or suspect a fraudulent credential, please contact our verification team at{' '}
              <Box component="span" sx={{ color: '#2563eb', fontWeight: 600 }}>verification@codeorbit.ai</Box>
              {' '}with a clear photo or copy of the document.
            </Typography>
          </Box>
        </Box>

      </Container>
    </Box>
  );
};

export default VerifySearch;