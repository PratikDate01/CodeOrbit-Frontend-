import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid,
  Divider,
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
  }, [showScanner]);

  function onScanSuccess(decodedText, decodedResult) {
    // Expected format: verificationId or a full URL containing the ID
    let id = decodedText;
    if (decodedText.includes('/verify/')) {
      id = decodedText.split('/verify/')[1].split('?')[0];
    }
    
    navigate(`/verify/${id}`);
  }

  function onScanFailure(error) {
    // console.warn(`Code scan error = ${error}`);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (!verificationId.trim()) {
      setError('Please enter a verification ID');
      return;
    }
    navigate(`/verify/${verificationId.trim()}`);
  };

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '80vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Verify Credentials
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Verify the authenticity of internship certificates and offer letters issued by CodeOrbit.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <Box sx={{ p: 1, bgcolor: 'primary.light', color: 'primary.main', borderRadius: 2 }}>
                  <Search size={24} />
                </Box>
                <Typography variant="h5" fontWeight={700}>Search by ID</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Enter the unique verification ID found at the bottom of the document.
              </Typography>

              <form onSubmit={handleSearch}>
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
                  sx={{ mb: 3 }}
                />
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="large" 
                  type="submit"
                  startIcon={<ShieldCheck size={20} />}
                >
                  Verify Now
                </Button>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <Box sx={{ p: 1, bgcolor: 'accent.light', color: 'accent.main', borderRadius: 2 }}>
                  <QrCode size={24} />
                </Box>
                <Typography variant="h5" fontWeight={700}>Scan QR Code</Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Use your camera to scan the QR code printed on the certificate for instant verification.
              </Typography>

              {!showScanner ? (
                <Button 
                  fullWidth 
                  variant="outlined" 
                  size="large" 
                  onClick={() => setShowScanner(true)}
                  startIcon={<QrCode size={20} />}
                  sx={{ mt: 'auto' }}
                >
                  Open Scanner
                </Button>
              ) : (
                <Box>
                  <Box id="reader" sx={{ width: '100%', mb: 2 }}></Box>
                  <Button 
                    fullWidth 
                    variant="text" 
                    color="error"
                    onClick={() => setShowScanner(false)}
                  >
                    Close Scanner
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 8 }}>
          <Alert icon={<AlertCircle size={20} />} severity="info" sx={{ borderRadius: 3 }}>
            <Typography variant="body2">
              <strong>Need help?</strong> If you're unable to verify a document, please contact our verification team at <strong>verification@codeorbit.ai</strong> with a clear photo of the document.
            </Typography>
          </Alert>
        </Box>
      </Container>
    </Box>
  );
};

export default VerifySearch;
