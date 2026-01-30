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
  X,
  Receipt,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API, { baseURL } from '../api/api';
import { Link } from 'react-router-dom';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Snackbar, 
  Alert,
  TextField,
  InputAdornment,
  Divider
} from '@mui/material';

const getDocumentUrl = (url) => {
  if (!url) return '#';
  // Standardized: Always use the URL as provided by Cloudinary/Backend
  return url;
};

const Dashboard = () => {
  const { userInfo } = useAuth();
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [couponCode, setCouponCode] = useState('');
  const [couponDetails, setCouponDetails] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

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
    setCouponCode('');
    setCouponDetails(null);
    setPaymentModalOpen(true);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setValidatingCoupon(true);
    try {
      const { data } = await API.post('/payments/validate-coupon', {
        code: couponCode,
        applicationId: selectedApp._id
      });
      if (data.success) {
        setCouponDetails(data);
        setSnackbar({ open: true, message: 'Coupon applied successfully!', severity: 'success' });
      }
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Invalid coupon code', 
        severity: 'error' 
      });
      setCouponDetails(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const initiateRazorpayPayment = async () => {
    setProcessingPayment(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        setSnackbar({ open: true, message: 'Razorpay SDK failed to load. Are you online?', severity: 'error' });
        return;
      }

      // 1. Create Order
      const { data: orderData } = await API.post('payments/create-order', { 
        applicationId: selectedApp._id,
        couponCode: couponDetails?.code
      });
      const { order } = orderData;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'CodeOrbit Solutions',
        description: `Payment for ${selectedApp.preferredDomain} Internship`,
        image: `${baseURL}/assets/logos/Company Logo.png`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await API.post('payments/verify', {
              ...response,
              applicationId: selectedApp._id
            });
            if (verifyRes.data.success) {
              setSnackbar({ open: true, message: 'Payment successful and verified!', severity: 'success' });
              setPaymentModalOpen(false);
              fetchData();
            }
          } catch (error) {
            setSnackbar({ open: true, message: 'Payment verification failed. Please contact support.', severity: 'error' });
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: userInfo.phone
        },
        notes: {
          application_id: selectedApp._id,
          domain: selectedApp.preferredDomain
        },
        theme: {
          color: '#2563eb'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment Initialization Error:', error);
      setSnackbar({ open: true, message: 'Failed to initiate payment. Please try again.', severity: 'error' });
    } finally {
      setProcessingPayment(false);
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
                              {app.paymentStatus === 'Verified' && (
                                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Chip 
                                    label="Payment Verified" 
                                    size="small" 
                                    color="success" 
                                    variant="filled"
                                    sx={{ fontWeight: 700 }}
                                  />
                                  {app.documents?.paymentSlipUrl && (
                                    <Button
                                      size="small"
                                      variant="text"
                                      color="info"
                                      startIcon={<Receipt size={16} />}
                                      href={getDocumentUrl(app.documents.paymentSlipUrl)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      sx={{ 
                                        textTransform: 'none', 
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        '&:hover': { bgcolor: 'info.light' }
                                      }}
                                    >
                                      Download Receipt
                                    </Button>
                                  )}
                                </Box>
                              )}
                              {app.paymentStatus === 'Processing' && (
                                <Chip label="Payment Processing" size="small" variant="outlined" color="warning" sx={{ mt: 1 }} />
                              )}
                              {app.documents?.offerLetterUrl && (
                                <Tooltip title="Download Offer Letter">
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    href={getDocumentUrl(app.documents.offerLetterUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
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
                                    href={getDocumentUrl(app.documents.certificateUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
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
                                    href={getDocumentUrl(app.documents.locUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
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
        onClose={() => !processingPayment && setPaymentModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Complete Payment
          <IconButton onClick={() => setPaymentModalOpen(false)} disabled={processingPayment}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Secure payment for <strong>{selectedApp?.preferredDomain}</strong> Internship.
            </Typography>
            
            <Box sx={{ my: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <Typography variant="body2" color="text.secondary" align="left">Original Price:</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" fontWeight={600} align="right">₹{selectedApp?.amount}</Typography>
                </Grid>
                
                {couponDetails && (
                  <>
                    <Grid item xs={8}>
                      <Typography variant="body2" color="success.main" align="left">Discount ({couponDetails.code}):</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="success.main" fontWeight={600} align="right">- ₹{couponDetails.discountAmount}</Typography>
                    </Grid>
                  </>
                )}
                
                <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
                
                <Grid item xs={8}>
                  <Typography variant="h6" fontWeight={700} align="left">Total Amount:</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6" fontWeight={700} color="primary.main" align="right">
                    ₹{couponDetails ? couponDetails.finalAmount : selectedApp?.amount}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Apply Coupon (Optional)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={validatingCoupon || !!couponDetails}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                    bgcolor: 'white'
                  }}
                />
                <Button 
                  variant="outlined" 
                  onClick={couponDetails ? () => { setCouponDetails(null); setCouponCode(''); } : handleApplyCoupon}
                  disabled={validatingCoupon || (!couponCode && !couponDetails)}
                  sx={{ borderRadius: 2, whiteSpace: 'nowrap' }}
                >
                  {validatingCoupon ? <CircularProgress size={20} /> : couponDetails ? 'Remove' : 'Apply'}
                </Button>
              </Box>
              {couponDetails && (
                <Typography variant="caption" color="success.main" sx={{ mt: 0.5, display: 'block', fontWeight: 600 }}>
                  ✓ Coupon "{couponDetails.code}" applied! You saved ₹{couponDetails.discountAmount}
                </Typography>
              )}
            </Box>

            <Box sx={{ p: 2, bgcolor: '#eff6ff', borderRadius: 2, border: '1px dashed #bfdbfe' }}>
              <Typography variant="caption" display="block" color="primary.main" sx={{ fontWeight: 700, mb: 0.5 }}>
                SECURE CHECKOUT
              </Typography>
              <Typography variant="body2" color="text.secondary">
                UPI, Cards, Net Banking, Wallets
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={() => setPaymentModalOpen(false)} 
            color="inherit"
            disabled={processingPayment}
          >
            Cancel
          </Button>
          <Button 
            onClick={initiateRazorpayPayment} 
            variant="contained" 
            color="primary"
            disabled={processingPayment}
            startIcon={processingPayment ? <CircularProgress size={18} color="inherit" /> : <ShieldCheck size={18} />}
            sx={{ borderRadius: 2, px: 4, py: 1 }}
          >
            {processingPayment ? 'Processing...' : `Pay ₹${couponDetails ? couponDetails.finalAmount : selectedApp?.amount}`}
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
