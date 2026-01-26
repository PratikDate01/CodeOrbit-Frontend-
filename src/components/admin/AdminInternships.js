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
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Tooltip,
  Skeleton,
  Divider
} from '@mui/material';
import { MoreVertical, Search, Download, Trash2, Filter, User, Clock, Phone, FileText, CheckCircle, Award, ExternalLink, CreditCard, Receipt } from 'lucide-react';
import API, { baseURL } from '../../api/api';

const AdminInternships = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  
  const [openDocDialog, setOpenDocDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/internships');
      setApplications(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await API.patch(`/internships/${selectedApp._id}/status`, { status });
      fetchApplications();
      setAnchorEl(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleVerifyPayment = async (paymentStatus) => {
    setVerifying(true);
    try {
      await API.patch(`/internships/${selectedApp._id}/status`, { paymentStatus });
      
      if (paymentStatus === 'Verified') {
        try {
          await API.post('/documents/generate-payment-slip', { applicationId: selectedApp._id });
        } catch (slipError) {
          console.error('Error generating payment slip:', slipError);
          alert('Payment verified but failed to generate slip. You can try again later.');
        }
      }
      
      fetchApplications();
      setOpenPaymentDialog(false);
      setAnchorEl(null);
    } catch (error) {
      console.error('Error verifying payment:', error);
    } finally {
      setVerifying(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await API.delete(`/internships/${id}`);
        fetchApplications();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status) => {
    const colors = {
      New: { bg: '#3b82f615', text: '#3b82f6' },
      Reviewed: { bg: '#f59e0b15', text: '#f59e0b' },
      Contacted: { bg: '#8b5cf615', text: '#8b5cf6' },
      Selected: { bg: '#10b98115', text: '#10b981' },
      Approved: { bg: '#05966915', text: '#059669' },
      Completed: { bg: '#64748b15', text: '#64748b' },
      Rejected: { bg: '#ef444415', text: '#ef4444' }
    };
    const style = colors[status] || { bg: '#f1f5f9', text: '#64748b' };
    return (
      <Chip 
        label={status} 
        size="small" 
        sx={{ 
          bgcolor: style.bg, 
          color: style.text, 
          fontWeight: 700,
          fontSize: '0.75rem',
          borderRadius: 1.5
        }} 
      />
    );
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.preferredDomain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.college?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const paginatedApps = filteredApps.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'College', 'Domain', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredApps.map(app => [
        app.name,
        app.email,
        app.phone,
        app.college,
        app.preferredDomain,
        app.status,
        new Date(app.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleGenerateDocs = async () => {
    setIsGenerating(true);
    try {
      await API.post('/documents/generate-offer-letter', {
        applicationId: selectedApp._id,
        startDate,
        endDate
      });
      alert('Documents (Offer Letter, Certificate, LOC) generated successfully!');
      setOpenDocDialog(false);
      setStartDate('');
      setEndDate('');
      fetchApplications();
    } catch (error) {
      console.error('Error generating documents:', error);
      alert('Failed to generate documents. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePaymentSlip = async () => {
    try {
      await API.post('/documents/generate-payment-slip', { applicationId: selectedApp._id });
      alert('Payment slip generated successfully!');
      fetchApplications();
      setAnchorEl(null);
    } catch (error) {
      console.error('Error generating payment slip:', error);
      alert('Failed to generate payment slip. Please check if payment is verified.');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, letterSpacing: '-1px' }}>
            Internship Applications
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and review all incoming internship requests.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<Download size={18} />} 
            onClick={exportCSV}
            sx={{ borderRadius: 2 }}
          >
            Export CSV
          </Button>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            placeholder="Search by name, email, or college..."
            size="small"
            sx={{ 
              width: 350,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.alt',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'divider' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#64748b" />
                </InputAdornment>
              ),
            }}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
          />
          <Button 
            startIcon={<Filter size={18} />} 
            variant={statusFilter !== 'All' ? "contained" : "text"} 
            color={statusFilter !== 'All' ? "primary" : "inherit"} 
            sx={{ fontWeight: 600, borderRadius: 2 }}
            onClick={(e) => setAnchorElFilter(e.currentTarget)}
          >
            {statusFilter === 'All' ? 'Filters' : `Status: ${statusFilter}`}
          </Button>
          <Menu
            anchorEl={anchorElFilter}
            open={Boolean(anchorElFilter)}
            onClose={() => setAnchorElFilter(null)}
          >
            {['All', 'New', 'Reviewed', 'Contacted', 'Selected', 'Approved', 'Rejected', 'Completed'].map((status) => (
              <MenuItem 
                key={status} 
                onClick={() => { setStatusFilter(status); setAnchorElFilter(null); setPage(0); }}
                selected={statusFilter === status}
              >
                {status}
              </MenuItem>
            ))}
          </Menu>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Showing {filteredApps.length} results
          </Typography>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: 'background.alt' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.85rem' }}>APPLICANT</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.85rem' }}>DOMAIN</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.85rem' }}>FEE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.85rem' }}>PAYMENT</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.85rem' }}>STATUS</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.85rem' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton variant="text" width={150} /><Skeleton variant="text" width={100} height={15} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="text" width={150} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                    <TableCell align="right"><Skeleton variant="circular" width={32} height={32} sx={{ ml: 'auto' }} /></TableCell>
                  </TableRow>
                ))
              ) : paginatedApps.length > 0 ? (
                paginatedApps.map((app) => (
                  <TableRow key={app._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <User size={20} color="#64748b" />
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{app.name}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{app.email}</Typography>
                          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>{app.college}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>Applied: {new Date(app.createdAt).toLocaleDateString()}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>{app.preferredDomain}</Typography>
                      <Typography variant="caption" color="text.secondary">{app.duration} Months</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>₹{app.amount}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={app.paymentStatus} 
                          size="small" 
                          variant="outlined"
                          color={app.paymentStatus === 'Verified' ? 'success' : 'warning'}
                          icon={<CreditCard size={14} />}
                          sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                        />
                        {app.documents?.paymentSlipUrl && (
                          <Tooltip title="View Receipt">
                            <IconButton 
                              size="small" 
                              href={`${baseURL}${app.documents.paymentSlipUrl}`}
                              target="_blank"
                              sx={{ color: '#06b6d4', p: 0.5 }}
                            >
                              <Receipt size={16} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{getStatusChip(app.status)}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        {app.documents && (
                          <Tooltip title="View Documents">
                            <IconButton 
                              size="small"
                              color="primary"
                              onClick={(e) => { 
                                // Maybe open a submenu or just the first doc
                                setAnchorEl(e.currentTarget); 
                                setSelectedApp(app); 
                              }}
                            >
                              <FileText size={16} />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Actions">
                          <IconButton 
                            size="small"
                            onClick={(e) => { setAnchorEl(e.currentTarget); setSelectedApp(app); }}
                            sx={{ border: '1px solid', borderColor: 'divider' }}
                          >
                            <MoreVertical size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small"
                            color="error" 
                            onClick={() => handleDelete(app._id)}
                            sx={{ ml: 0.5, border: '1px solid', borderColor: 'divider' }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                    <Box sx={{ opacity: 0.5, textAlign: 'center' }}>
                      <Search size={48} style={{ marginBottom: '16px' }} />
                      <Typography variant="h6">No applications found</Typography>
                      <Typography variant="body2">Try adjusting your search or filters</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredApps.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        />
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        elevation={3}
        PaperProps={{
          sx: { 
            minWidth: 180, 
            borderRadius: 2,
            mt: 0.5,
            border: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <MenuItem onClick={() => handleUpdateStatus('Reviewed')}>
          <ListItemIcon><Clock size={18} /></ListItemIcon>
          <ListItemText>Mark as Reviewed</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleUpdateStatus('Contacted')}>
          <ListItemIcon><Phone size={18} /></ListItemIcon>
          <ListItemText>Mark as Contacted</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleUpdateStatus('Selected')}>
          <ListItemIcon><User size={18} /></ListItemIcon>
          <ListItemText>Mark as Selected</ListItemText>
        </MenuItem>
        {selectedApp?.paymentStatus === 'Processing' && (
          <MenuItem onClick={() => { setAnchorEl(null); setOpenPaymentDialog(true); }}>
            <ListItemIcon><CreditCard size={18} color="#f59e0b" /></ListItemIcon>
            <ListItemText>Review Payment</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => handleUpdateStatus('Rejected')} sx={{ color: 'error.main' }}>
          <ListItemIcon><Trash2 size={18} color="currentColor" /></ListItemIcon>
          <ListItemText>Reject Application</ListItemText>
        </MenuItem>
        <Divider />
        {selectedApp?.paymentStatus === 'Verified' && !selectedApp?.documents?.paymentSlipUrl && (
          <MenuItem onClick={handleGeneratePaymentSlip}>
            <ListItemIcon><Receipt size={18} color="#06b6d4" /></ListItemIcon>
            <ListItemText>Generate Payment Slip</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => { setAnchorEl(null); setOpenDocDialog(true); }}>
          <ListItemIcon><FileText size={18} /></ListItemIcon>
          <ListItemText>Generate Documents</ListItemText>
        </MenuItem>
        {selectedApp?.documents && (
          <Box>
            <Divider />
            <MenuItem 
              component="a" 
              href={`${baseURL}${selectedApp.documents.offerLetterUrl}`}
              target="_blank"
            >
              <ListItemIcon><FileText size={18} color="#3b82f6" /></ListItemIcon>
              <ListItemText>View Offer Letter</ListItemText>
            </MenuItem>
            {selectedApp.documents.paymentSlipUrl && (
              <MenuItem 
                component="a" 
                href={`${baseURL}${selectedApp.documents.paymentSlipUrl}`}
                target="_blank"
              >
                <ListItemIcon><Receipt size={18} color="#06b6d4" /></ListItemIcon>
                <ListItemText>View Payment Slip</ListItemText>
              </MenuItem>
            )}
            <MenuItem 
              component="a" 
              href={`${baseURL}${selectedApp.documents.certificateUrl}`}
              target="_blank"
            >
              <ListItemIcon><CheckCircle size={18} color="#10b981" /></ListItemIcon>
              <ListItemText>View Certificate</ListItemText>
            </MenuItem>
            <MenuItem 
              component="a" 
              href={`${baseURL}${selectedApp.documents.locUrl}`}
              target="_blank"
            >
              <ListItemIcon><Award size={18} color="#8b5cf6" /></ListItemIcon>
              <ListItemText>View LOC</ListItemText>
            </MenuItem>
            <MenuItem 
              component="a" 
              href={`${window.location.origin}/verify/${selectedApp.documents.verificationId}`}
              target="_blank"
            >
              <ListItemIcon><ExternalLink size={18} /></ListItemIcon>
              <ListItemText>Verification Page</ListItemText>
            </MenuItem>
          </Box>
        )}
      </Menu>

      <Dialog 
        open={openDocDialog} 
        onClose={() => setOpenDocDialog(false)}
        PaperProps={{ sx: { borderRadius: 3, width: '100%', maxWidth: 450 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pt: 3 }}>Generate Documents</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Generate professional documents (Offer Letter, Certificate, and LOC) for <strong>{selectedApp?.name}</strong>.
            </Typography>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>
              Note: This will also update the application status to "Approved".
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setOpenDocDialog(false)} color="inherit">Cancel</Button>
          <Button 
            onClick={handleGenerateDocs} 
            variant="contained" 
            disabled={isGenerating || !startDate || !endDate}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {isGenerating ? 'Generating...' : 'Generate & Send'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Verification Dialog */}
      <Dialog 
        open={openPaymentDialog} 
        onClose={() => setOpenPaymentDialog(false)}
        PaperProps={{ sx: { borderRadius: 3, width: '100%', maxWidth: 500 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pt: 3 }}>Verify Payment</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>TRANSACTION ID</Typography>
              <Typography variant="body1" fontWeight={700} sx={{ mt: 0.5 }}>{selectedApp?.transactionId || 'N/A'}</Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>PAYMENT SCREENSHOT</Typography>
              {selectedApp?.paymentScreenshot ? (
                <Box 
                  component="img"
                  src={`${baseURL}${selectedApp.paymentScreenshot}`}
                  alt="Payment Screenshot"
                  sx={{ 
                    width: '100%', 
                    borderRadius: 2, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(`${baseURL}${selectedApp.paymentScreenshot}`, '_blank')}
                />
              ) : (
                <Typography variant="body2" color="error">No screenshot uploaded</Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={() => setOpenPaymentDialog(false)} color="inherit">Cancel</Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button 
            onClick={() => handleVerifyPayment('Failed')} 
            color="error"
            variant="outlined"
            disabled={verifying}
            sx={{ borderRadius: 2 }}
          >
            Reject
          </Button>
          <Button 
            onClick={() => handleVerifyPayment('Verified')} 
            variant="contained" 
            color="success"
            disabled={verifying}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {verifying ? 'Verifying...' : 'Verify & Approve Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminInternships;
