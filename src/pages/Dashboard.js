import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Button
} from '@mui/material';
import { 
  Briefcase, 
  Bell, 
  CheckCircle,
  Eye,
  FileText,
  Award,
  Settings,
  CreditCard,
  QrCode,
  Upload,
  X,
  Receipt
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API, { baseURL } from '../api/api';
import { Link } from 'react-router-dom';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Snackbar,
  Alert
} from '@mui/material';

const Dashboard = () => {
  const { userInfo } = useAuth();
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    try {
      const [appRes, notiRes] = await Promise.all([
        API.get('/internships/my-applications'),
        API.get('/notifications')
      ]);
      setApplications(appRes.data);
      setNotifications(notiRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) fetchData();
  }, [userInfo]);

  const handlePaymentClick = (app) => {
    setSelectedApp(app);
    setPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async () => {
    if (!transactionId || !screenshot) {
      setSnackbar({ open: true, message: 'Please provide both Transaction ID and Screenshot', severity: 'error' });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('transactionId', transactionId);
    formData.append('screenshot', screenshot);

    try {
      await API.post(`/internships/${selectedApp._id}/payment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSnackbar({ open: true, message: 'Payment details submitted successfully!', severity: 'success' });
      setPaymentModalOpen(false);
      setTransactionId('');
      setScreenshot(null);
      fetchData();
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to submit payment', severity: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const getStatusChip = (status) => {
    const colors = {
      New: 'info',
      Reviewed: 'warning',
      Contacted: 'primary',
      Selected: 'success',
      Approved: 'success',
      Completed: 'secondary',
      Rejected: 'error'
    };
    return <Chip label={status} size="small" color={colors[status] || 'default'} />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '90vh', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Welcome, {userInfo?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your internship applications and updates
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              component={Link} 
              to="/profile" 
              variant="outlined" 
              startIcon={<Settings size={18} />}
              sx={{ borderRadius: 2 }}
            >
              Settings
            </Button>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontWeight: 700 }}>
              {userInfo?.name?.charAt(0)}
            </Avatar>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Stats Section */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'primary.light', color: 'primary.main', mr: 2.5, display: 'flex' }}>
                  <Briefcase size={28} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={800}>{applications.length}</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>Total Applications</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'success.light', color: 'success.main', mr: 2.5, display: 'flex', opacity: 0.9 }}>
                  <CheckCircle size={28} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={800}>
                    {applications.filter(a => ['Selected', 'Approved', 'Completed'].includes(a.status)).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>Shortlisted / Selected</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'warning.light', color: 'warning.main', mr: 2.5, display: 'flex', opacity: 0.9 }}>
                  <Bell size={28} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={800}>
                    {notifications.filter(n => !n.isRead).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>Unread Notifications</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Applications Table */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight={800}>My Applications</Typography>
                <Button component={Link} to="/internships" variant="text" size="small" sx={{ fontWeight: 700 }}>
                  Explore More
                </Button>
              </Box>
              {applications.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Domain</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app._id} hover>
                          <TableCell fontWeight={500}>{app.preferredDomain}</TableCell>
                          <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusChip(app.status)}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              {app.status === 'Selected' && app.paymentStatus === 'Pending' && (
                                <Tooltip title="Pay Now">
                                  <IconButton 
                                    size="small" 
                                    color="warning"
                                    onClick={() => handlePaymentClick(app)}
                                  >
                                    <CreditCard size={18} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {app.paymentStatus === 'Processing' && (
                                <Chip label="Payment Processing" size="small" variant="outlined" color="warning" />
                              )}
                              {app.paymentStatus === 'Verified' && (
                                <Chip label="Payment Verified" size="small" variant="outlined" color="success" />
                              )}
                              {app.documents?.paymentSlipUrl && (
                                <Tooltip title="Download Fee Receipt">
                                  <IconButton 
                                    size="small" 
                                    color="info"
                                    href={`${baseURL}${app.documents.paymentSlipUrl}`}
                                    target="_blank"
                                  >
                                    <Receipt size={18} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {app.documents?.offerLetterUrl && (
                                <Tooltip title="Download Offer Letter">
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    href={`${baseURL}${app.documents.offerLetterUrl}`}
                                    target="_blank"
                                  >
                                    <FileText size={18} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {app.documents?.certificateUrl && (
                                <Tooltip title="Download Certificate">
                                  <IconButton 
                                    size="small" 
                                    color="success"
                                    href={`${baseURL}${app.documents.certificateUrl}`}
                                    target="_blank"
                                  >
                                    <CheckCircle size={18} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {app.documents?.locUrl && (
                                <Tooltip title="Download Completion Letter">
                                  <IconButton 
                                    size="small" 
                                    color="secondary"
                                    href={`${baseURL}${app.documents.locUrl}`}
                                    target="_blank"
                                  >
                                    <Award size={18} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="View Verification Page">
                                <IconButton 
                                  size="small"
                                  component={Link}
                                  to={app.documents ? `/verify/${app.documents.verificationId}` : '#'}
                                  disabled={!app.documents}
                                >
                                  <Eye size={18} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">No applications yet.</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Notifications Section */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper sx={{ p: 3, borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Recent Notifications</Typography>
              {notifications.length > 0 ? (
                <Box>
                  {notifications.slice(0, 5).map((noti) => (
                    <Box 
                      key={noti._id} 
                      sx={{ 
                        pb: 2, 
                        mb: 2, 
                        borderBottom: '1px solid', 
                        borderColor: 'divider',
                        '&:last-child': { border: 0, mb: 0 }
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={600} color={noti.isRead ? 'text.secondary' : 'text.primary'}>
                        {noti.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {noti.message}
                      </Typography>
                      <Typography variant="caption" color="text.muted">
                        {new Date(noti.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">No notifications.</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Payment Modal */}
      <Dialog 
        open={paymentModalOpen} 
        onClose={() => !uploading && setPaymentModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Complete Payment
          <IconButton onClick={() => setPaymentModalOpen(false)} disabled={uploading}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={700} color="primary.main" gutterBottom>
              Amount to Pay: ₹{selectedApp?.amount || (selectedApp?.duration === 1 ? 399 : selectedApp?.duration === 3 ? 599 : 999)}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Scan the QR code below to make the payment. After payment, enter the Transaction ID and upload the screenshot.
            </Typography>
            <Box 
              component="img"
              src={`${baseURL}/assets/payments/QR.jpeg`}
              alt="Payment QR Code"
              sx={{ 
                width: '100%', 
                maxWidth: 250, 
                height: 'auto', 
                mx: 'auto', 
                my: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            />
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Transaction ID"
                variant="outlined"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter your UPI/Bank transaction ID"
                disabled={uploading}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<Upload size={18} />}
                sx={{ py: 1.5, borderRadius: 2 }}
                disabled={uploading}
              >
                {screenshot ? screenshot.name : 'Upload Payment Screenshot'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setScreenshot(e.target.files[0])}
                />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={() => setPaymentModalOpen(false)} 
            color="inherit"
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePaymentSubmit} 
            variant="contained" 
            color="primary"
            disabled={uploading || !transactionId || !screenshot}
            startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : <QrCode size={18} />}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {uploading ? 'Submitting...' : 'Submit Payment Details'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
