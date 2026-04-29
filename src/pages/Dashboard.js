import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Dialog,
  DialogContent,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  Badge,
  InputBase,
} from '@mui/material';
import {
  LayoutDashboard,
  Briefcase,
  Bell,
  Settings,
  LogOut,
  Menu,
  CreditCard,
  Search,
  HelpCircle,
  GraduationCap,
  FileText,
  X,
} from 'lucide-react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API, { baseURL } from '../api/api';

import UserOverview from '../components/user/UserOverview';
import UserApplications from '../components/user/UserApplications';
import UserNotifications from '../components/user/UserNotifications';
import UserPayments from '../components/user/UserPayments';
import UserDocuments from '../components/user/UserDocuments';

const DRAWER_WIDTH = 260;

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { text: 'Overview',         icon: LayoutDashboard, path: '/dashboard' },
  { text: 'Applications',     icon: Briefcase,       path: '/dashboard/applications' },
  { text: 'Payments',         icon: CreditCard,      path: '/dashboard/payments' },
  { text: 'Documents',        icon: FileText,        path: '/dashboard/documents' },
  { text: 'My Learning',      icon: GraduationCap,   path: '/my-learning' },
  { text: 'Notifications',    icon: Bell,            path: '/dashboard/notifications' },
  { text: 'Profile Settings', icon: Settings,        path: '/profile' },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ userInfo, onLogout }) => {
  const location = useLocation();

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#0f1117',
      fontFamily: '"DM Sans", sans-serif',
      borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>

      {/* Logo */}
      <Box sx={{ px: 3, pt: 3.5, pb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 34, height: 34,
            bgcolor: '#2563eb',
            borderRadius: '9px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 4px rgba(37,99,235,0.15)',
          }}>
            <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1rem', letterSpacing: '-1px', fontFamily: '"DM Sans", sans-serif' }}>
              C
            </Typography>
          </Box>
          <Typography sx={{
            color: '#ffffff', fontWeight: 800, fontSize: '1.05rem',
            letterSpacing: '-0.04em', fontFamily: '"DM Sans", sans-serif',
          }}>
            CodeOrbit
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 2.5, mb: 1 }}>
        <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', px: 1 }}>
          Menu
        </Typography>
      </Box>

      {/* Nav */}
      <List sx={{ px: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {NAV_ITEMS.map(({ text, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to={path}
                sx={{
                  borderRadius: '10px',
                  py: 1.1,
                  px: 1.5,
                  position: 'relative',
                  transition: 'all 0.15s ease',
                  bgcolor: active ? 'rgba(37,99,235,0.15)' : 'transparent',
                  '&:hover': {
                    bgcolor: active ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                {active && (
                  <Box sx={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: 3, bgcolor: '#2563eb', borderRadius: '0 3px 3px 0',
                  }} />
                )}
                <ListItemIcon sx={{ minWidth: 36, color: active ? '#2563eb' : 'rgba(255,255,255,0.38)' }}>
                  <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.875rem',
                    color: active ? '#ffffff' : 'rgba(255,255,255,0.5)',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User card */}
      <Box sx={{ p: 2.5 }}>
        <Box sx={{
          p: 1.5,
          bgcolor: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', gap: 1.5,
        }}>
          <Avatar sx={{
            width: 36, height: 36,
            bgcolor: '#2563eb',
            fontSize: '0.85rem', fontWeight: 700,
            fontFamily: '"DM Sans", sans-serif',
            flexShrink: 0,
          }}>
            {userInfo?.name?.charAt(0)}
          </Avatar>
          <Box sx={{ overflow: 'hidden', flex: 1 }}>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.82rem', fontFamily: '"DM Sans", sans-serif', noWrap: true }}>
              {userInfo?.name}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', fontFamily: '"DM Sans", sans-serif' }}>
              Student
            </Typography>
          </Box>
          <Tooltip title="Sign out">
            <IconButton
              size="small"
              onClick={onLogout}
              sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.1)' }, ml: 'auto' }}
            >
              <LogOut size={15} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const { userInfo, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Payment state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDetails, setCouponDetails] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    try {
      const [appRes, notiRes] = await Promise.all([
        API.get('/internships/my-applications'),
        API.get('/notifications'),
      ]);
      setApplications(appRes.data);
      setNotifications(notiRes.data);
    } catch {
      setSnackbar({ open: true, message: 'Failed to load dashboard data.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (userInfo) fetchData(); }, [userInfo]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleClearNotifications = async () => {
    if (!window.confirm('Clear all notifications?')) return;
    try {
      await API.delete('/notifications');
      setNotifications([]);
      setSnackbar({ open: true, message: 'Notifications cleared', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to clear', severity: 'error' });
    }
  };

  const getDocumentUrl = (url) => url || '#';

  const loadRazorpayScript = () => new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

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
      const { data } = await API.post('/payments/validate-coupon', { code: couponCode, applicationId: selectedApp._id });
      if (data.success) { setCouponDetails(data); setSnackbar({ open: true, message: 'Coupon applied!', severity: 'success' }); }
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Invalid coupon', severity: 'error' });
      setCouponDetails(null);
    } finally { setValidatingCoupon(false); }
  };

  const initiateRazorpayPayment = async () => {
    setProcessingPayment(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) { setSnackbar({ open: true, message: 'Razorpay SDK failed to load', severity: 'error' }); return; }
      const { data: orderData } = await API.post('payments/create-order', { applicationId: selectedApp._id, couponCode: couponDetails?.code });
      const { order } = orderData;
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount, currency: order.currency,
        name: 'CodeOrbit Solutions',
        description: `Payment for ${selectedApp.preferredDomain}`,
        image: `${baseURL}/assets/logos/Company Logo.png`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await API.post('payments/verify', { ...response, applicationId: selectedApp._id });
            if (verifyRes.data.success) { setSnackbar({ open: true, message: 'Payment verified!', severity: 'success' }); setPaymentModalOpen(false); fetchData(); }
          } catch { setSnackbar({ open: true, message: 'Verification failed', severity: 'error' }); }
        },
        prefill: { name: userInfo.name, email: userInfo.email, contact: userInfo.phone },
        theme: { color: '#2563eb' },
      };
      new window.Razorpay(options).open();
    } catch { setSnackbar({ open: true, message: 'Failed to initiate payment', severity: 'error' }); }
    finally { setProcessingPayment(false); }
  };

  // Current page label
  const currentNav = NAV_ITEMS.find(n => n.path === location.pathname);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f7f7f5' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#2563eb' }} size={36} thickness={3} />
          <Typography sx={{ mt: 2, color: '#a3a3a3', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', fontWeight: 500 }}>
            Loading your dashboard…
          </Typography>
        </Box>
      </Box>
    );
  }

  const sidebarContent = <Sidebar userInfo={userInfo} onLogout={handleLogout} />;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f7f7f5', fontFamily: '"DM Sans", sans-serif' }}>

      {/* ── Sidebar ── */}
      <Box component="nav" sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}>
        <Drawer
          variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', lg: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}
        >
          {sidebarContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', lg: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}
          open
        >
          {sidebarContent}
        </Drawer>
      </Box>

      {/* ── Main ── */}
      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` }, display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'rgba(247,247,245,0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #e8e8e4',
            zIndex: 1100,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2.5, md: 4 }, minHeight: '64px !important' }}>

            {/* Left: hamburger + page title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ display: { lg: 'none' }, color: '#0a0a0a', p: 1 }}
              >
                <Menu size={20} />
              </IconButton>

              <Box>
                <Typography sx={{
                  fontWeight: 800, fontSize: '1.05rem',
                  color: '#0a0a0a', letterSpacing: '-0.03em',
                  fontFamily: '"DM Sans", sans-serif', lineHeight: 1,
                }}>
                  {currentNav?.text || 'Dashboard'}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#a3a3a3', fontFamily: '"DM Sans", sans-serif', fontWeight: 500, mt: 0.25 }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </Typography>
              </Box>
            </Box>

            {/* Right: search + actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>

              {/* Search */}
              <Box sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                bgcolor: '#ffffff',
                border: '1px solid #e8e8e4',
                px: 1.75, py: 0.75,
                borderRadius: '10px',
                width: 240,
                gap: 1,
                transition: 'all 0.2s',
                '&:focus-within': { borderColor: '#2563eb', boxShadow: '0 0 0 3px rgba(37,99,235,0.08)' },
              }}>
                <Search size={15} color="#a3a3a3" />
                <InputBase
                  placeholder="Search…"
                  sx={{ fontSize: '0.875rem', fontFamily: '"DM Sans", sans-serif', flex: 1, color: '#0a0a0a', '& input::placeholder': { color: '#c0c0bc' } }}
                />
              </Box>

              {/* Help */}
              <Tooltip title="Help & Support">
                <IconButton
                  size="small"
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    width: 36, height: 36,
                    bgcolor: '#ffffff', border: '1px solid #e8e8e4',
                    borderRadius: '10px', color: '#737373',
                    '&:hover': { borderColor: '#2563eb', color: '#2563eb', bgcolor: '#eff6ff' },
                  }}
                >
                  <HelpCircle size={17} />
                </IconButton>
              </Tooltip>

              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton
                  size="small"
                  component={Link}
                  to="/dashboard/notifications"
                  sx={{
                    width: 36, height: 36,
                    bgcolor: '#ffffff', border: '1px solid #e8e8e4',
                    borderRadius: '10px', color: '#737373',
                    '&:hover': { borderColor: '#2563eb', color: '#2563eb', bgcolor: '#eff6ff' },
                  }}
                >
                  <Badge
                    badgeContent={unreadCount}
                    sx={{ '& .MuiBadge-badge': { bgcolor: '#ef4444', color: '#fff', fontSize: '0.6rem', minWidth: 16, height: 16, p: 0 } }}
                  >
                    <Bell size={17} />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Divider */}
              <Box sx={{ width: 1, height: 28, bgcolor: '#e8e8e4', mx: 0.5 }} />

              {/* Avatar */}
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.25, cursor: 'pointer', py: 0.5, px: 1, borderRadius: '10px', transition: 'all 0.15s', '&:hover': { bgcolor: '#ffffff' } }}
                onClick={() => navigate('/profile')}
              >
                <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.825rem', color: '#0a0a0a', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.2 }}>
                    {userInfo?.name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#a3a3a3', fontFamily: '"DM Sans", sans-serif' }}>
                    Student
                  </Typography>
                </Box>
                <Avatar sx={{
                  width: 34, height: 34,
                  bgcolor: '#2563eb',
                  fontSize: '0.825rem', fontWeight: 800,
                  fontFamily: '"DM Sans", sans-serif',
                  boxShadow: '0 0 0 2px #f7f7f5, 0 0 0 3.5px #e8e8e4',
                }}>
                  {userInfo?.name?.charAt(0)}
                </Avatar>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 } }}>
          <Routes>
            <Route index element={
              <UserOverview
                applications={applications} notifications={notifications}
                userInfo={userInfo} onPaymentClick={handlePaymentClick}
                getDocumentUrl={getDocumentUrl}
              />
            } />
            <Route path="applications" element={
              <UserApplications applications={applications} onPaymentClick={handlePaymentClick} getDocumentUrl={getDocumentUrl} />
            } />
            <Route path="notifications" element={
              <UserNotifications notifications={notifications} onClearAll={handleClearNotifications} />
            } />
            <Route path="payments" element={
              <UserPayments applications={applications} onPaymentClick={handlePaymentClick} />
            } />
            <Route path="documents" element={
              <UserDocuments applications={applications} getDocumentUrl={getDocumentUrl} />
            } />
          </Routes>
        </Box>
      </Box>

      {/* ── Payment Dialog ── */}
      <Dialog
        open={paymentModalOpen}
        onClose={() => !processingPayment && setPaymentModalOpen(false)}
        maxWidth="xs" fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            border: '1px solid #e8e8e4',
            boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
            fontFamily: '"DM Sans", sans-serif',
            overflow: 'hidden',
          },
        }}
      >
        {/* Dialog header */}
        <Box sx={{ px: 3.5, pt: 3.5, pb: 2.5, borderBottom: '1px solid #e8e8e4', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#0a0a0a', letterSpacing: '-0.03em', fontFamily: '"DM Sans", sans-serif' }}>
              Complete Enrollment
            </Typography>
            <Typography sx={{ fontSize: '0.825rem', color: '#a3a3a3', fontFamily: '"DM Sans", sans-serif', mt: 0.25 }}>
              {selectedApp?.preferredDomain}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => !processingPayment && setPaymentModalOpen(false)}
            sx={{ color: '#a3a3a3', '&:hover': { color: '#0a0a0a' }, mt: -0.5, mr: -0.5 }}>
            <X size={18} />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3.5, py: 3 }}>

          {/* Amount display */}
          <Box sx={{
            p: 2.5, mb: 3,
            bgcolor: '#f7f7f5',
            border: '1px solid #e8e8e4',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', color: '#a3a3a3', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Amount Due
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
                <Typography sx={{ fontWeight: 900, fontSize: '2rem', color: '#0a0a0a', letterSpacing: '-0.04em', fontFamily: '"DM Sans", sans-serif', lineHeight: 1 }}>
                  ₹{couponDetails ? (Number(couponDetails.finalAmount) || 0) : (Number(selectedApp?.amount) || 0)}
                </Typography>
                {couponDetails && (
                  <Typography sx={{ fontSize: '0.9rem', color: '#a3a3a3', textDecoration: 'line-through', fontFamily: '"DM Sans", sans-serif' }}>
                    ₹{Number(selectedApp?.amount) || 0}
                  </Typography>
                )}
              </Box>
            </Box>
            {couponDetails && (
              <Box sx={{ px: 1.5, py: 0.5, bgcolor: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', fontFamily: '"DM Sans", sans-serif' }}>
                  −₹{Number(couponDetails.discountAmount) || 0} saved
                </Typography>
              </Box>
            )}
          </Box>

          {/* Coupon */}
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#3f3f3f', mb: 1, fontFamily: '"DM Sans", sans-serif' }}>
            Coupon Code
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth size="small" placeholder="Enter code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              disabled={validatingCoupon || !!couponDetails}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '9px', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem',
                  bgcolor: '#ffffff',
                  '& fieldset': { borderColor: '#e8e8e4' },
                  '&:hover fieldset': { borderColor: '#2563eb' },
                  '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                },
              }}
            />
            <Button
              variant="outlined"
              onClick={handleApplyCoupon}
              disabled={!couponCode || validatingCoupon || !!couponDetails}
              sx={{
                borderRadius: '9px', px: 2, fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700, fontSize: '0.8rem', textTransform: 'none',
                borderColor: '#e8e8e4', color: '#3f3f3f',
                '&:hover': { borderColor: '#2563eb', color: '#2563eb', bgcolor: '#eff6ff' },
                whiteSpace: 'nowrap',
              }}
            >
              {validatingCoupon ? <CircularProgress size={16} /> : 'Apply'}
            </Button>
          </Box>

          {couponDetails && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography sx={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
                ✓ Coupon applied successfully
              </Typography>
              <Button size="small" onClick={() => { setCouponDetails(null); setCouponCode(''); }}
                sx={{ color: '#ef4444', fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', textTransform: 'none', fontWeight: 600, p: 0, minWidth: 'auto' }}>
                Remove
              </Button>
            </Box>
          )}
        </DialogContent>

        <Box sx={{ px: 3.5, pb: 3.5 }}>
          <Button
            fullWidth variant="contained" size="large"
            onClick={initiateRazorpayPayment}
            disabled={processingPayment}
            sx={{
              py: 1.5, borderRadius: '10px',
              textTransform: 'none', fontSize: '0.925rem',
              fontWeight: 700, fontFamily: '"DM Sans", sans-serif',
              bgcolor: '#2563eb', boxShadow: 'none',
              '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 4px 20px rgba(37,99,235,0.25)' },
              '&:disabled': { bgcolor: '#bfdbfe', color: '#fff' },
            }}
          >
            {processingPayment
              ? <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CircularProgress size={18} sx={{ color: '#fff' }} /> Processing…</Box>
              : <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CreditCard size={17} /> Pay Securely</Box>
            }
          </Button>
          <Typography sx={{ textAlign: 'center', mt: 1.5, fontSize: '0.72rem', color: '#c0c0bc', fontFamily: '"DM Sans", sans-serif' }}>
            Secured by Razorpay · 256-bit SSL encryption
          </Typography>
        </Box>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ borderRadius: '10px', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '0.875rem' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;