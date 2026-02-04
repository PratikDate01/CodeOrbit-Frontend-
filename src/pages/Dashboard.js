import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  Paper,
  Badge,
  InputBase
} from '@mui/material';
import { 
  LayoutDashboard, 
  Briefcase, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  ChevronRight,
  CreditCard,
  Search,
  HelpCircle,
  GraduationCap,
  FileText
} from 'lucide-react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API, { baseURL } from '../api/api';

import UserOverview from '../components/user/UserOverview';
import UserApplications from '../components/user/UserApplications';
import UserNotifications from '../components/user/UserNotifications';
import UserPayments from '../components/user/UserPayments';
import UserDocuments from '../components/user/UserDocuments';

const drawerWidth = 280;

const Dashboard = () => {
  const { userInfo, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Payment State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDetails, setCouponDetails] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

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
      setSnackbar({ open: true, message: 'Failed to load dashboard data. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) fetchData();
  }, [userInfo]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleClearNotifications = async () => {
    if (window.confirm('Clear all notifications?')) {
      try {
        await API.delete('/notifications');
        setNotifications([]);
        setSnackbar({ open: true, message: 'Notifications cleared', severity: 'success' });
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to clear', severity: 'error' });
      }
    }
  };

  const getDocumentUrl = (url) => url || '#';

  // --- Payment Logic ---
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

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
        setSnackbar({ open: true, message: 'Coupon applied!', severity: 'success' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Invalid coupon', severity: 'error' });
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
        setSnackbar({ open: true, message: 'Razorpay SDK failed to load', severity: 'error' });
        return;
      }

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
        description: `Payment for ${selectedApp.preferredDomain}`,
        image: `${baseURL}/assets/logos/Company Logo.png`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await API.post('payments/verify', {
              ...response,
              applicationId: selectedApp._id
            });
            if (verifyRes.data.success) {
              setSnackbar({ open: true, message: 'Payment verified!', severity: 'success' });
              setPaymentModalOpen(false);
              fetchData();
            }
          } catch (error) {
            setSnackbar({ open: true, message: 'Verification failed', severity: 'error' });
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: userInfo.phone
        },
        theme: { color: '#2563eb' }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to initiate payment', severity: 'error' });
    } finally {
      setProcessingPayment(false);
    }
  };

  const menuItems = [
    { text: 'Overview', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { text: 'Applications', icon: <Briefcase size={20} />, path: '/dashboard/applications' },
    { text: 'Payments', icon: <CreditCard size={20} />, path: '/dashboard/payments' },
    { text: 'Documents', icon: <FileText size={20} />, path: '/dashboard/documents' },
    { text: 'My Learning', icon: <GraduationCap size={20} />, path: '/my-learning' },
    { text: 'Notifications', icon: <Bell size={20} />, path: '/dashboard/notifications' },
    { text: 'Profile Settings', icon: <Settings size={20} />, path: '/profile' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ 
          width: 40, 
          height: 40, 
          bgcolor: 'primary.main', 
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          C
        </Box>
        <Typography variant="h6" fontWeight={800} sx={{ color: 'text.primary', letterSpacing: '-0.5px' }}>
          CodeOrbit
        </Typography>
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.5 }} />

      <List sx={{ px: 2, mt: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={isActive}
                sx={{
                  borderRadius: 2.5,
                  py: 1.5,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(15, 15, 15, 0.15)',
                    '&:hover': { bgcolor: 'primary.dark' },
                    '& .MuiListItemIcon-root': { color: 'white' }
                  },
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'rgba(15, 15, 15, 0.04)',
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'white' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.925rem' }} 
                />
                {isActive && <ChevronRight size={16} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2, mt: 'auto' }}>
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.alt', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.light', fontSize: '1rem', fontWeight: 600 }}>
              {userInfo?.name?.charAt(0)}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle2" fontWeight={700} noWrap>{userInfo?.name}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>Student Account</Typography>
            </Box>
          </Box>
          <Button 
            fullWidth 
            variant="outlined" 
            color="inherit"
            startIcon={<LogOut size={16} />}
            onClick={handleLogout}
            sx={{ borderRadius: 2, py: 1, fontSize: '0.8rem', borderColor: 'divider' }}
          >
            Sign Out
          </Button>
        </Paper>
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #e2e8f0' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #e2e8f0', bgcolor: 'white' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${drawerWidth}px)` } }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { lg: 'none' } }}>
                <Menu size={20} />
              </IconButton>

              <Box sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                alignItems: 'center', 
                bgcolor: 'background.alt', 
                px: 2, 
                py: 0.75, 
                borderRadius: 2,
                width: { md: 300, lg: 400 },
                border: '1px solid',
                borderColor: 'transparent',
                transition: 'all 0.2s',
                '&:focus-within': { borderColor: 'primary.main', bgcolor: 'white', boxShadow: '0 0 0 4px rgba(15, 15, 15, 0.05)' }
              }}>
                <Search size={18} color="#64748b" />
                <InputBase
                  placeholder="Search applications, tasks..."
                  sx={{ ml: 1.5, flex: 1, fontSize: '0.9rem' }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Tooltip title="Help & Support">
                <IconButton size="small" sx={{ bgcolor: 'background.alt', display: { xs: 'none', sm: 'flex' } }}>
                  <HelpCircle size={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications">
                <IconButton size="small" component={Link} to="/dashboard/notifications" sx={{ bgcolor: 'background.alt' }}>
                  <Badge badgeContent={notifications.filter(n => !n.isRead).length} color="error">
                    <Bell size={20} />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1.5 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/profile')}>
                <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                  <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                    {userInfo?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Student
                  </Typography>
                </Box>
                <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.9rem', fontWeight: 700, border: '2px solid white', boxShadow: '0 0 0 1px #e2e8f0' }}>
                  {userInfo?.name?.charAt(0)}
                </Avatar>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, pb: 4 }}>
          <Routes>
            <Route index element={
              <UserOverview 
                applications={applications} 
                notifications={notifications} 
                userInfo={userInfo}
                onPaymentClick={handlePaymentClick}
                getDocumentUrl={getDocumentUrl}
              />
            } />
            <Route path="applications" element={
              <UserApplications 
                applications={applications} 
                onPaymentClick={handlePaymentClick}
                getDocumentUrl={getDocumentUrl}
              />
            } />
            <Route path="notifications" element={
              <UserNotifications 
                notifications={notifications} 
                onClearAll={handleClearNotifications}
              />
            } />
            <Route path="payments" element={
              <UserPayments 
                applications={applications} 
                onPaymentClick={handlePaymentClick}
              />
            } />
            <Route path="documents" element={
              <UserDocuments 
                applications={applications} 
                getDocumentUrl={getDocumentUrl}
              />
            } />
          </Routes>
        </Container>
      </Box>

      {/* Payment Dialog */}
      <Dialog 
        open={paymentModalOpen} 
        onClose={() => !processingPayment && setPaymentModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, textAlign: 'center', pt: 4 }}>Complete Enrollment</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary">Domain</Typography>
            <Typography variant="h6" fontWeight={700}>{selectedApp?.preferredDomain}</Typography>
            <Typography variant="h4" fontWeight={800} sx={{ mt: 2, color: 'primary.main' }}>
              ₹{couponDetails ? couponDetails.finalAmount : selectedApp?.amount}
            </Typography>
            {couponDetails && (
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                ₹{selectedApp?.amount}
              </Typography>
            )}
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              disabled={validatingCoupon || couponDetails}
            />
            <Button 
              variant="outlined" 
              onClick={handleApplyCoupon}
              disabled={!couponCode || validatingCoupon || couponDetails}
            >
              {validatingCoupon ? <CircularProgress size={20} /> : 'Apply'}
            </Button>
          </Box>
          {couponDetails && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="success.main" fontWeight={600}>
                Code Applied! You saved ₹{couponDetails.discountAmount}
              </Typography>
              <Button 
                size="small" 
                color="error" 
                onClick={() => { setCouponDetails(null); setCouponCode(''); }}
                sx={{ fontSize: '0.65rem', minWidth: 'auto', p: 0 }}
              >
                Remove
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            fullWidth 
            variant="contained" 
            size="large"
            onClick={initiateRazorpayPayment}
            disabled={processingPayment}
            startIcon={processingPayment ? <CircularProgress size={20} color="inherit" /> : <CreditCard size={20} />}
            sx={{ borderRadius: 3, py: 1.5, fontWeight: 700 }}
          >
            {processingPayment ? 'Processing...' : 'Pay Securely'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
