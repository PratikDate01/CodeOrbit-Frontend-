import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText
} from '@mui/material';
import { Plus, Edit2, Trash2, History } from 'lucide-react';
import API from '../../api/api';

const PLANS = [399, 599, 999];

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [usageModalOpen, setUsageModalOpen] = useState(false);
  const [usageHistory, setUsageHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    maxUses: 0,
    maxUsesPerUser: 1,
    expiryDate: '',
    status: 'active',
    applicablePlans: [399, 599, 999]
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await API.get('/admin/coupons');
      setCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageHistory = async () => {
    setLoadingHistory(true);
    setUsageModalOpen(true);
    try {
      const { data } = await API.get('/admin/coupons/usage-history');
      setUsageHistory(data);
    } catch (error) {
      console.error('Error fetching usage history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditMode(true);
      setSelectedCoupon(coupon);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxUses: coupon.maxUses,
        maxUsesPerUser: coupon.maxUsesPerUser,
        expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
        status: coupon.status,
        applicablePlans: coupon.applicablePlans
      });
    } else {
      setEditMode(false);
      setSelectedCoupon(null);
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        maxUses: 0,
        maxUsesPerUser: 1,
        expiryDate: '',
        status: 'active',
        applicablePlans: [399, 599, 999]
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await API.put(`/admin/coupons/${selectedCoupon._id}`, formData);
        setSnackbar({ open: true, message: 'Coupon updated successfully', severity: 'success' });
      } else {
        await API.post('/admin/coupons', formData);
        setSnackbar({ open: true, message: 'Coupon created successfully', severity: 'success' });
      }
      fetchCoupons();
      setModalOpen(false);
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Something went wrong', 
        severity: 'error' 
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await API.delete(`/admin/coupons/${id}`);
        setSnackbar({ open: true, message: 'Coupon deleted successfully', severity: 'success' });
        fetchCoupons();
      } catch (error) {
        setSnackbar({ open: true, message: 'Error deleting coupon', severity: 'error' });
      }
    }
  };

  const toggleStatus = async (coupon) => {
    try {
      const newStatus = coupon.status === 'active' ? 'inactive' : 'active';
      await API.put(`/admin/coupons/${coupon._id}`, { status: newStatus });
      fetchCoupons();
      setSnackbar({ open: true, message: `Coupon ${newStatus === 'active' ? 'activated' : 'deactivated'}`, severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error updating status', severity: 'error' });
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="primary.main">
            Coupon Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and manage promotional coupons for internships
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<History size={18} />} 
            onClick={fetchUsageHistory}
            sx={{ borderRadius: 2 }}
          >
            Usage History
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Plus size={18} />} 
            onClick={() => handleOpenModal()}
            sx={{ borderRadius: 2 }}
          >
            Create Coupon
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Code</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Discount</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Usage (Current/Max)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Expiry</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Plans</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Status</TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon._id} hover>
                <TableCell sx={{ fontWeight: 800 }}>{coupon.code}</TableCell>
                <TableCell>
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} OFF
                </TableCell>
                <TableCell>
                  {coupon.currentUses} / {coupon.maxUses === 0 ? '∞' : coupon.maxUses}
                </TableCell>
                <TableCell>
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                  {new Date(coupon.expiryDate) < new Date() && (
                    <Chip label="Expired" size="small" color="error" sx={{ ml: 1, fontSize: '0.65rem' }} />
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {coupon.applicablePlans.map(plan => (
                      <Chip key={plan} label={`₹${plan}`} size="small" variant="outlined" />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={coupon.status} 
                    color={coupon.status === 'active' ? 'success' : 'default'} 
                    size="small" 
                    onClick={() => toggleStatus(coupon)}
                    sx={{ cursor: 'pointer', fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton size="small" color="primary" onClick={() => handleOpenModal(coupon)}>
                      <Edit2 size={18} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(coupon._id)}>
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {coupons.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No coupons found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{editMode ? 'Edit Coupon' : 'Create New Coupon'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Coupon Code"
                fullWidth
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. SUMMER50"
                sx={{ gridColumn: 'span 2' }}
              />
              <FormControl fullWidth>
                <InputLabel>Discount Type</InputLabel>
                <Select
                  value={formData.discountType}
                  label="Discount Type"
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                >
                  <MenuItem value="percentage">Percentage (%)</MenuItem>
                  <MenuItem value="flat">Flat Amount (₹)</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Discount Value"
                type="number"
                fullWidth
                required
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
              />
              <TextField
                label="Max Global Uses"
                type="number"
                fullWidth
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                helperText="0 for unlimited"
              />
              <TextField
                label="Max Uses Per User"
                type="number"
                fullWidth
                value={formData.maxUsesPerUser}
                onChange={(e) => setFormData({ ...formData, maxUsesPerUser: e.target.value })}
              />
              <TextField
                label="Expiry Date"
                type="date"
                fullWidth
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ gridColumn: 'span 2' }}>
                <InputLabel>Applicable Plans</InputLabel>
                <Select
                  multiple
                  value={formData.applicablePlans}
                  onChange={(e) => setFormData({ ...formData, applicablePlans: e.target.value })}
                  input={<OutlinedInput label="Applicable Plans" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={`₹${value}`} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {PLANS.map((plan) => (
                    <MenuItem key={plan} value={plan}>
                      <Checkbox checked={formData.applicablePlans.indexOf(plan) > -1} />
                      <ListItemText primary={`₹${plan}`} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ px: 4, borderRadius: 2 }}>
              {editMode ? 'Update Coupon' : 'Create Coupon'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Usage History Modal */}
      <Dialog open={usageModalOpen} onClose={() => setUsageModalOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Coupon Usage History</DialogTitle>
        <DialogContent dividers>
          {loadingHistory ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Coupon</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Domain</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Saved</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usageHistory.map((usage) => (
                    <TableRow key={usage._id}>
                      <TableCell>{new Date(usage.appliedAt).toLocaleDateString()}</TableCell>
                      <TableCell><Chip label={usage.coupon?.code} size="small" variant="outlined" /></TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{usage.user?.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{usage.user?.email}</Typography>
                      </TableCell>
                      <TableCell>{usage.application?.preferredDomain}</TableCell>
                      <TableCell align="right" sx={{ color: 'success.main', fontWeight: 700 }}>₹{usage.discountAmount}</TableCell>
                    </TableRow>
                  ))}
                  {usageHistory.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No usage history found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUsageModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminCoupons;
