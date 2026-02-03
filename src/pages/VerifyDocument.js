import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  CircularProgress, 
  Button,
  Grid,
  Chip,
  Avatar,
  Stack
} from '@mui/material';
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
import API from '../api/api';

const getDocumentUrl = (url) => {
  if (!url) return '#';
  return url;
};

const DetailRow = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
    <Box sx={{ 
      p: 1.5, 
      bgcolor: 'rgba(15, 15, 15, 0.05)', 
      color: 'primary.main', 
      borderRadius: 2,
      display: 'flex'
    }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>
        {label}
      </Typography>
      <Typography variant="h6" fontWeight={600} sx={{ mt: 0.5 }}>
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress thickness={2} size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button 
            component={Link} 
            to="/verify" 
            startIcon={<ChevronLeft size={18} />}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { bgcolor: 'background.paper' }
            }}
          >
            Back to Verification
          </Button>
        </Box>

        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 6, 
            overflow: 'hidden', 
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)'
          }}
        >
          {error ? (
            <Box sx={{ p: { xs: 6, md: 12 }, textAlign: 'center' }}>
              <Avatar sx={{ width: 96, height: 96, bgcolor: 'error.light', color: 'error.main', mx: 'auto', mb: 4 }}>
                <ShieldAlert size={48} />
              </Avatar>
              <Typography variant="h3" fontWeight={800} gutterBottom sx={{ letterSpacing: '-0.02em' }}>Verification Failed</Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 500, mx: 'auto', fontWeight: 400 }}>
                We couldn't locate any record matching this verification ID. This could be due to an incorrect ID or the document might not be authentic.
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="contained" component={Link} to="/verify" sx={{ px: 4 }}>Try Another ID</Button>
                <Button variant="outlined" component={Link} to="/contact" sx={{ px: 4 }}>Contact Support</Button>
              </Stack>
            </Box>
          ) : (
            <>
              {/* Status Header */}
              <Box sx={{ 
                p: { xs: 4, md: 6 }, 
                bgcolor: 'success.main', 
                color: 'white', 
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 80, height: 80, mx: 'auto', mb: 2 }}>
                    <ShieldCheck size={48} />
                  </Avatar>
                  <Typography variant="h3" fontWeight={800} sx={{ mb: 1, letterSpacing: '-0.02em' }}>
                    Authenticity Verified
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                    This document is officially issued and recognized by CodeOrbit Solutions
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ p: { xs: 4, md: 8 } }}>
                <Grid container spacing={6}>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Box sx={{ mb: 6 }}>
                      <Typography variant="overline" color="accent.main" fontWeight={800} letterSpacing={2}>
                        Official Record
                      </Typography>
                      <Typography variant="h2" fontWeight={800} sx={{ mt: 1, mb: 4, letterSpacing: '-0.02em' }}>
                        {document.applicationId?.name}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <DetailRow 
                        icon={<Award size={24} />} 
                        label="Program / Domain" 
                        value={document.applicationId?.preferredDomain} 
                      />
                      <DetailRow 
                        icon={<Calendar size={24} />} 
                        label="Tenure Period" 
                        value={`${new Date(document.applicationId?.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - ${new Date(document.applicationId?.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`} 
                      />
                      <DetailRow 
                        icon={<User size={24} />} 
                        label="Registered Email" 
                        value={document.applicationId?.email} 
                      />
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 5 }}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 4, 
                        bgcolor: 'background.alt', 
                        borderStyle: 'dashed', 
                        borderRadius: 4,
                        mb: 4
                      }}
                    >
                      <Typography variant="overline" color="text.secondary" fontWeight={800} letterSpacing={1}>
                        Security Metadata
                      </Typography>
                      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Verification ID</Typography>
                          <Typography variant="body1" fontWeight={700} sx={{ fontFamily: 'monospace', fontSize: '1.1rem', color: 'primary.main' }}>
                            {document.verificationId}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Issue Date</Typography>
                          <Typography variant="body1" fontWeight={700}>
                            {new Date(document.issuedOn).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Record Status</Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip 
                              label="Valid & Active" 
                              size="medium" 
                              color="success" 
                              sx={{ fontWeight: 700, px: 1 }} 
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Paper>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {document.certificateUrl && (
                        <Button 
                          fullWidth
                          variant="contained" 
                          startIcon={<FileDown size={20} />}
                          href={getDocumentUrl(document.certificateUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ py: 2, fontSize: '1rem' }}
                        >
                          Download Certificate
                        </Button>
                      )}
                      {document.offerLetterUrl && (
                        <Button 
                          fullWidth
                          variant="outlined" 
                          startIcon={<ExternalLink size={20} />}
                          href={getDocumentUrl(document.offerLetterUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ py: 1.5 }}
                        >
                          View Offer Letter
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 10, pt: 6, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
                    This is a digitally verified record issued by CodeOrbit Solutions. 
                    For any queries regarding this verification, please contact our support team at 
                    <strong style={{ color: '#1e293b' }}> verification@codeorbit.ai</strong>
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default VerifyDocument;
