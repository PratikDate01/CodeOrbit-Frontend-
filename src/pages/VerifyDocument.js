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
  Avatar
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
import API, { baseURL } from '../api/api';

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
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="md">
        <Button 
          component={Link} 
          to="/" 
          startIcon={<ChevronLeft size={18} />}
          sx={{ mb: 4, color: 'text.secondary' }}
        >
          Back to Home
        </Button>

        <Paper sx={{ 
          borderRadius: 4, 
          overflow: 'hidden', 
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
        }}>
          {error ? (
            <Box sx={{ p: 8, textAlign: 'center' }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'error.light', color: 'error.main', mx: 'auto', mb: 3 }}>
                <ShieldAlert size={40} />
              </Avatar>
              <Typography variant="h4" fontWeight={800} gutterBottom>Verification Failed</Typography>
              <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                We couldn't find any record matching this verification ID. Please check the ID or contact support.
              </Typography>
              <Button variant="contained" component={Link} to="/">Return Home</Button>
            </Box>
          ) : (
            <>
              {/* Header Status */}
              <Box sx={{ 
                p: 4, 
                bgcolor: 'success.main', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 1
              }}>
                <ShieldCheck size={48} />
                <Typography variant="h5" fontWeight={700}>Authenticity Verified</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  This document is officially issued and recognized by CodeOrbit Solutions
                </Typography>
              </Box>

              <Box sx={{ p: { xs: 3, md: 6 } }}>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1}>
                      Internship Details
                    </Typography>
                    <Typography variant="h4" fontWeight={800} sx={{ mt: 1, mb: 4 }}>
                      {document.applicationId?.name}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <DetailRow 
                        icon={<Award size={20} />} 
                        label="Role / Domain" 
                        value={document.applicationId?.preferredDomain} 
                      />
                      <DetailRow 
                        icon={<Calendar size={20} />} 
                        label="Internship Period" 
                        value={`${new Date(document.applicationId?.startDate).toLocaleDateString()} - ${new Date(document.applicationId?.endDate).toLocaleDateString()}`} 
                      />
                      <DetailRow 
                        icon={<User size={20} />} 
                        label="Issued To" 
                        value={document.applicationId?.email} 
                      />
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 5 }}>
                    <Paper variant="outlined" sx={{ p: 3, bgcolor: '#f8fafc', borderStyle: 'dashed', borderRadius: 3 }}>
                      <Typography variant="overline" color="text.secondary" fontWeight={700}>
                        Document Metadata
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Verification ID</Typography>
                          <Typography variant="body2" fontWeight={700}>{document.verificationId}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Issue Date</Typography>
                          <Typography variant="body2" fontWeight={700}>{new Date(document.issuedOn).toLocaleDateString()}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Status</Typography>
                          <Box sx={{ mt: 0.5 }}>
                            <Chip label="Active & Valid" size="small" color="success" sx={{ fontWeight: 600 }} />
                          </Box>
                        </Box>
                      </Box>
                    </Paper>

                    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {document.certificateUrl && (
                        <Button 
                          fullWidth
                          variant="contained" 
                          startIcon={<FileDown size={18} />}
                          href={`${baseURL}${document.certificateUrl}`}
                          target="_blank"
                          sx={{ py: 1.5 }}
                        >
                          View Certificate
                        </Button>
                      )}
                      {document.offerLetterUrl && (
                        <Button 
                          fullWidth
                          variant="outlined" 
                          startIcon={<ExternalLink size={18} />}
                          href={`${baseURL}${document.offerLetterUrl}`}
                          target="_blank"
                        >
                          View Offer Letter
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Verification powered by CodeOrbit Trust Services. 
                    Questions? Contact us at <strong>verification@codeorbit.ai</strong>
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

const DetailRow = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
    <Box sx={{ p: 1, bgcolor: '#eff6ff', color: 'primary.main', borderRadius: 1.5 }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={600}>
        {value || 'N/A'}
      </Typography>
    </Box>
  </Box>
);

export default VerifyDocument;
