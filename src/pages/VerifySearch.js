import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid,
  Alert
} from '@mui/material';
import { 
  Search, 
  QrCode, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const VerifySearch = () => {
  const [verificationId, setVerificationId] = useState('');
  const [error, setError] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  const onScanSuccess = useCallback((decodedText, decodedResult) => {
    // Expected format: verificationId or a full URL containing the ID
    let id = decodedText;
    if (decodedText.includes('/verify/')) {
      id = decodedText.split('/verify/')[1].split('?')[0];
    }
    
    navigate(`/verify/${id}`);
  }, [navigate]);

  const onScanFailure = (error) => {
    // console.warn(`Code scan error = ${error}`);
  };

  useEffect(() => {
    let scanner = null;
    if (showScanner) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(error => {
          console.error("Failed to clear scanner", error);
        });
      }
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
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography 
            variant="h2" 
            fontWeight={800} 
            gutterBottom 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              letterSpacing: '-0.04em'
            }}
          >
            Credential Verification
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 700, 
              mx: 'auto', 
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            Verify the authenticity of internship certificates, offer letters, and achievement awards issued by CodeOrbit.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper 
              sx={{ 
                p: { xs: 4, md: 6 }, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 6,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2.5 }}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: 'rgba(15, 15, 15, 0.05)', 
                  color: 'primary.main', 
                  borderRadius: 3,
                  display: 'flex'
                }}>
                  <Search size={28} />
                </Box>
                <Typography variant="h4" fontWeight={700}>Search by ID</Typography>
              </Box>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 6, fontSize: '1.1rem' }}>
                Enter the unique verification ID found at the bottom of your CodeOrbit document.
              </Typography>

              <form onSubmit={handleSearch} style={{ marginTop: 'auto' }}>
                <TextField
                  fullWidth
                  label="Verification ID"
                  placeholder="CO-XXXX-XXXXXX"
                  value={verificationId}
                  onChange={(e) => {
                    setVerificationId(e.target.value);
                    setError('');
                  }}
                  error={!!error}
                  helperText={error}
                  sx={{ mb: 4 }}
                />
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="large" 
                  type="submit"
                  startIcon={<ShieldCheck size={20} />}
                  sx={{ py: 2, fontSize: '1.1rem' }}
                >
                  Verify Now
                </Button>
              </form>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper 
              sx={{ 
                p: { xs: 4, md: 6 }, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 6,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2.5 }}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: 'rgba(217, 119, 6, 0.05)', 
                  color: 'accent.main', 
                  borderRadius: 3,
                  display: 'flex'
                }}>
                  <QrCode size={28} />
                </Box>
                <Typography variant="h4" fontWeight={700}>Scan QR Code</Typography>
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 6, fontSize: '1.1rem' }}>
                Use your device camera to scan the QR code printed on the document for instant validation.
              </Typography>

              <Box sx={{ mt: 'auto' }}>
                {!showScanner ? (
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    size="large" 
                    onClick={() => setShowScanner(true)}
                    startIcon={<QrCode size={20} />}
                    sx={{ py: 2, fontSize: '1.1rem' }}
                  >
                    Open Scanner
                  </Button>
                ) : (
                  <Box>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        overflow: 'hidden', 
                        mb: 3, 
                        borderStyle: 'dashed',
                        borderColor: 'primary.main',
                        bgcolor: 'background.alt'
                      }}
                    >
                      <Box id="reader" sx={{ width: '100%' }}></Box>
                    </Paper>
                    <Button 
                      fullWidth 
                      variant="text" 
                      color="error"
                      onClick={() => setShowScanner(false)}
                      sx={{ fontWeight: 700 }}
                    >
                      Cancel Scanning
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 10, maxWidth: 900, mx: 'auto' }}>
          <Alert 
            icon={<AlertCircle size={24} />} 
            severity="info" 
            sx={{ 
              borderRadius: 4, 
              p: 3,
              bgcolor: 'background.alt',
              border: '1px solid',
              borderColor: 'divider',
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
              Need Assistance?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
              If you're unable to verify a document or suspect a fraudulent credential, please contact our verification team at <strong>verification@codeorbit.ai</strong> with a clear photo or copy of the document.
            </Typography>
          </Alert>
        </Box>
      </Container>
    </Box>
  );
};

export default VerifySearch;
