import React from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton
} from '@mui/material';
import { 
  FileText, 
  Award, 
  CheckCircle2, 
  Download,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDocuments = ({ applications, getDocumentUrl }) => {
  const hasDocuments = applications.some(app => app.documents && (
    app.documents.offerLetterUrl || 
    app.documents.certificateUrl || 
    app.documents.locUrl || 
    app.documents.paymentSlipUrl
  ));

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton 
          component={Link} 
          to="/dashboard" 
          sx={{ bgcolor: 'background.alt', '&:hover': { bgcolor: 'divider' } }}
        >
          <ArrowLeft size={20} />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-1px' }}>
            My Documents
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            Access your offer letters, certificates, and completion documents.
          </Typography>
        </Box>
      </Box>

      {hasDocuments ? (
        <Grid container spacing={3}>
          {applications.map((app) => (
            app.documents && (
              <React.Fragment key={app._id}>
                {/* Offer Letter */}
                {app.documents.offerLetterUrl && (
                  <Grid item xs={12} md={6} lg={4}>
                    <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.lighter', color: 'primary.main' }}>
                            <FileText size={24} />
                          </Box>
                          <Chip label="Offer Letter" size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                        </Box>
                        <Typography variant="h6" fontWeight={800} gutterBottom>{app.preferredDomain}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Official internship offer letter from CodeOrbit Solutions.
                        </Typography>
                        <Button 
                          fullWidth 
                          variant="contained" 
                          startIcon={<Download size={18} />}
                          href={getDocumentUrl(app.documents.offerLetterUrl)}
                          target="_blank"
                          sx={{ borderRadius: 2, fontWeight: 700 }}
                        >
                          Download PDF
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Certificate */}
                {app.documents.certificateUrl && (
                  <Grid item xs={12} md={6} lg={4}>
                    <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'secondary.lighter', color: 'secondary.main' }}>
                            <Award size={24} />
                          </Box>
                          <Chip label="Certificate" size="small" variant="outlined" color="secondary" sx={{ fontWeight: 700 }} />
                        </Box>
                        <Typography variant="h6" fontWeight={800} gutterBottom>{app.preferredDomain}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Official internship completion certificate.
                        </Typography>
                        <Button 
                          fullWidth 
                          variant="contained" 
                          color="secondary"
                          startIcon={<Download size={18} />}
                          href={getDocumentUrl(app.documents.certificateUrl)}
                          target="_blank"
                          sx={{ borderRadius: 2, fontWeight: 700 }}
                        >
                          Download PDF
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* LOC */}
                {app.documents.locUrl && (
                  <Grid item xs={12} md={6} lg={4}>
                    <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'info.lighter', color: 'info.main' }}>
                            <CheckCircle2 size={24} />
                          </Box>
                          <Chip label="LOC" size="small" variant="outlined" color="info" sx={{ fontWeight: 700 }} />
                        </Box>
                        <Typography variant="h6" fontWeight={800} gutterBottom>{app.preferredDomain}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Letter of Completion for your internship program.
                        </Typography>
                        <Button 
                          fullWidth 
                          variant="contained" 
                          color="info"
                          startIcon={<Download size={18} />}
                          href={getDocumentUrl(app.documents.locUrl)}
                          target="_blank"
                          sx={{ borderRadius: 2, fontWeight: 700 }}
                        >
                          Download PDF
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Payment Slip */}
                {app.documents.paymentSlipUrl && (
                  <Grid item xs={12} md={6} lg={4}>
                    <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'success.lighter', color: 'success.main' }}>
                            <CreditCard size={24} />
                          </Box>
                          <Chip label="Payment Slip" size="small" variant="outlined" color="success" sx={{ fontWeight: 700 }} />
                        </Box>
                        <Typography variant="h6" fontWeight={800} gutterBottom>{app.preferredDomain}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Official payment receipt for your internship.
                        </Typography>
                        <Button 
                          fullWidth 
                          variant="contained" 
                          color="success"
                          startIcon={<Download size={18} />}
                          href={getDocumentUrl(app.documents.paymentSlipUrl)}
                          target="_blank"
                          sx={{ borderRadius: 2, fontWeight: 700 }}
                        >
                          Download PDF
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Verification Link */}
                {app.documents.verificationId && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'background.alt', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ShieldCheck size={32} color="#10b981" />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={800}>Digital Verification ({app.preferredDomain})</Typography>
                          <Typography variant="body2" color="text.secondary">All documents are digitally verifiable using ID: <strong>{app.documents.verificationId}</strong></Typography>
                        </Box>
                      </Box>
                      <Button 
                        endIcon={<ExternalLink size={18} />}
                        href={`${window.location.origin}/verify/${app.documents.verificationId}`}
                        target="_blank"
                        sx={{ fontWeight: 700 }}
                      >
                        Verify Now
                      </Button>
                    </Paper>
                  </Grid>
                )}
              </React.Fragment>
            )
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 10, borderRadius: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider', bgcolor: 'background.alt' }}>
          <FileText size={64} style={{ opacity: 0.1, marginBottom: '24px' }} />
          <Typography variant="h6" fontWeight={800} gutterBottom>No documents available</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
            Documents like offer letters and certificates will appear here once they are issued by the administration.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default UserDocuments;