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
  Divider,
  CircularProgress
} from '@mui/material';
import { MoreVertical, Search, Download, Trash2, Filter, User, Clock, Phone, FileText, Award, ExternalLink, CreditCard, Receipt } from 'lucide-react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const getDocumentUrl = (url) => {
  if (!url) return '#';
  // Standardized: Always use the URL as provided by Cloudinary/Backend
  return url;
};

const AdminInternships = () => {
  const { showNotification } = useNotification();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingEligibilityId, setUpdatingEligibilityId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  
  useEffect(() => {
    fetchApplications();
  }, []);

  const [openDocDialog, setOpenDocDialog] = useState(false);
  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [appDocuments, setAppDocuments] = useState({});
  const [internshipDates, setInternshipDates] = useState({
    startDate: '',
    endDate: '',
    documentIssueDate: ''
  });

  const handleOpenDateDialog = (app) => {
    setSelectedApp(app);
    setInternshipDates({
      startDate: app.startDate ? new Date(app.startDate).toISOString().split('T')[0] : '',
      endDate: app.endDate ? new Date(app.endDate).toISOString().split('T')[0] : '',
      documentIssueDate: app.documentIssueDate ? new Date(app.documentIssueDate).toISOString().split('T')[0] : ''
    });
    setOpenDateDialog(true);
    setAnchorEl(null);
  };

  const handleUpdateDates = async () => {
    try {
      await API.patch(`/internships/${selectedApp._id}/status`, internshipDates, {
        loaderMessage: 'Updating internship dates...'
      });
      showNotification('Internship dates updated successfully', 'success');
      setOpenDateDialog(false);
      fetchApplications();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to update dates', 'error');
    }
  };

  const fetchAppDocuments = async (applicationId) => {
    try {
      const { data } = await API.get(`/documents/application/${applicationId}`, {
        showLoader: false // Silent fetch
      });
      setAppDocuments(data);
    } catch (error) {
      showNotification('Error fetching documents', 'error');
    }
  };

  const handleGenerateDocument = async (type) => {
    try {
      await API.post(`/documents/generate/${type}`, {
        applicationId: selectedApp._id
      }, {
        loaderMessage: `Generating ${type.replace('-', ' ').toUpperCase()}...`
      });
      showNotification(`${type.replace('-', ' ').toUpperCase()} generated successfully!`, 'success');
      fetchAppDocuments(selectedApp._id);
      fetchApplications();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to generate document', 'error');
    }
  };

  const handleToggleDocVisibility = async (type, visible) => {
    try {
      await API.patch('/documents/visibility', {
        applicationId: selectedApp._id,
        type,
        visible
      });
      fetchAppDocuments(selectedApp._id);
      showNotification('Visibility updated', 'success');
    } catch (error) {
      showNotification('Failed to update visibility', 'error');
    }
  };

  const handleOpenDocDialog = (app) => {
    setSelectedApp(app);
    fetchAppDocuments(app._id);
    setOpenDocDialog(true);
    setAnchorEl(null);
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/internships');
      
      // Fetch progress for each application to show eligibility
      const appsWithProgress = await Promise.all(data.map(async (app) => {
        try {
          const progressRes = await API.get(`/activity/progress/${app._id}`);
          return { ...app, progress: progressRes.data };
        } catch (e) {
          return { ...app, progress: { isEligibleForCertificate: false, progressPercentage: 0 } };
        }
      }));

      setApplications(appsWithProgress);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEligibility = async (app) => {
    try {
      setUpdatingEligibilityId(app._id);
      const currentEligible = app.progress?.isEligibleForCertificate || false;
      await API.put(`/activity/progress/${app._id}/eligibility`, {
        isEligibleForCertificate: !currentEligible,
        adminManuallyCompleted: !currentEligible
      });
      showNotification(`Eligibility ${!currentEligible ? 'granted' : 'revoked'} successfully`, 'success');
      fetchApplications();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to update eligibility', 'error');
    } finally {
      setUpdatingEligibilityId(null);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      setUpdatingStatusId(selectedApp._id);
      await API.patch(`/internships/${selectedApp._id}/status`, { status });
      showNotification(`Status updated to ${status}`, 'success');
      fetchApplications();
      setAnchorEl(null);
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error updating status', 'error');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleVerifyPayment = async (paymentStatus) => {
    try {
      await API.patch(`/internships/${selectedApp._id}/status`, { paymentStatus }, {
        loaderMessage: 'Verifying payment...'
      });
      
      if (paymentStatus === 'Verified') {
        try {
          await API.post('/documents/generate-payment-slip', { 
            applicationId: selectedApp._id 
          }, {
            loaderMessage: 'Generating payment slip...'
          });
          showNotification('Payment verified and slip generated', 'success');
        } catch (slipError) {
          showNotification('Payment verified but failed to generate slip', 'warning');
        }
      } else {
        showNotification(`Payment status updated to ${paymentStatus}`, 'success');
      }
      
      fetchApplications();
      setOpenPaymentDialog(false);
      setAnchorEl(null);
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error verifying payment', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        setDeletingId(id);
        await API.delete(`/internships/${id}`);
        showNotification('Application deleted successfully', 'success');
        fetchApplications();
      } catch (error) {
        showNotification(error.response?.data?.message || 'Error deleting application', 'error');
      } finally {
        setDeletingId(null);
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontWeight={700}>{app.name}</Typography>
                            {app.progress?.isEligibleForCertificate && (
                              <Tooltip title="Eligible for Certificate">
                                <Award size={14} color="#8b5cf6" />
                              </Tooltip>
                            )}
                          </Box>
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
                        {app.razorpayPaymentId && (
                          <Chip 
                            label="Razorpay" 
                            size="small" 
                            color="info"
                            sx={{ fontWeight: 700, fontSize: '0.6rem', height: 20 }}
                          />
                        )}
                        {app.documents?.paymentSlipUrl && (
                          <Tooltip title="View Receipt">
                            <IconButton 
                              size="small" 
                              href={getDocumentUrl(app.documents.paymentSlipUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
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
                            disabled={deletingId === app._id}
                            sx={{ ml: 0.5, border: '1px solid', borderColor: 'divider' }}
                          >
                            {deletingId === app._id ? <CircularProgress size={16} /> : <Trash2 size={16} />}
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
        <MenuItem onClick={() => handleUpdateStatus('Reviewed')} disabled={updatingStatusId !== null}>
          <ListItemIcon>{updatingStatusId === selectedApp?._id ? <CircularProgress size={18} /> : <Clock size={18} />}</ListItemIcon>
          <ListItemText>Mark as Reviewed</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleUpdateStatus('Contacted')} disabled={updatingStatusId !== null}>
          <ListItemIcon>{updatingStatusId === selectedApp?._id ? <CircularProgress size={18} /> : <Phone size={18} />}</ListItemIcon>
          <ListItemText>Mark as Contacted</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleUpdateStatus('Selected')} disabled={updatingStatusId !== null}>
          <ListItemIcon>{updatingStatusId === selectedApp?._id ? <CircularProgress size={18} /> : <User size={18} />}</ListItemIcon>
          <ListItemText>Mark as Selected</ListItemText>
        </MenuItem>
        {selectedApp?.paymentStatus === 'Verified' && (
          <MenuItem 
            onClick={() => { handleToggleEligibility(selectedApp); setAnchorEl(null); }}
            disabled={updatingEligibilityId !== null}
          >
            <ListItemIcon>
              {updatingEligibilityId === selectedApp?._id ? 
                <CircularProgress size={18} /> : 
                <Award size={18} color={selectedApp.progress?.isEligibleForCertificate ? "#64748b" : "#8b5cf6"} />
              }
            </ListItemIcon>
            <ListItemText>{selectedApp.progress?.isEligibleForCertificate ? "Revoke Eligibility" : "Grant Certificate Eligibility"}</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => handleUpdateStatus('Rejected')} sx={{ color: 'error.main' }} disabled={updatingStatusId !== null}>
          <ListItemIcon>{updatingStatusId === selectedApp?._id ? <CircularProgress size={18} color="inherit" /> : <Trash2 size={18} color="currentColor" />}</ListItemIcon>
          <ListItemText>Reject Application</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleOpenDateDialog(selectedApp)}>
          <ListItemIcon><Clock size={18} /></ListItemIcon>
          <ListItemText>Edit Internship Dates</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleOpenDocDialog(selectedApp)}>
          <ListItemIcon><FileText size={18} /></ListItemIcon>
          <ListItemText>Manage Documents</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog 
        open={openDocDialog} 
        onClose={() => setOpenDocDialog(false)}
        PaperProps={{ sx: { borderRadius: 3, width: '100%', maxWidth: 550 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pt: 3 }}>Manage Documents</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Control individual documents for <strong>{selectedApp?.name}</strong>.
            </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>Offer Letter</Typography>
                    <Typography variant="caption" color="text.secondary">Required after approval</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={() => handleGenerateDocument('offer-letter')}
                    >
                      {appDocuments.offerLetterUrl ? 'Regenerate' : 'Generate'}
                    </Button>
                    {appDocuments.offerLetterUrl && (
                      <Button 
                        size="small" 
                        variant={appDocuments.offerLetterVisible ? "contained" : "outlined"}
                        color={appDocuments.offerLetterVisible ? "success" : "inherit"}
                        onClick={() => handleToggleDocVisibility('offerLetter', !appDocuments.offerLetterVisible)}
                      >
                        {appDocuments.offerLetterVisible ? 'Visible' : 'Hidden'}
                      </Button>
                    )}
                  </Box>
                </Box>
                {appDocuments.offerLetterUrl && (
                  <Button size="small" component="a" href={appDocuments.offerLetterUrl} target="_blank" startIcon={<ExternalLink size={14} />}>View PDF</Button>
                )}
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>Certificate</Typography>
                    <Typography variant="caption" color="text.secondary">Required after completion</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={() => handleGenerateDocument('certificate')}
                      disabled={!selectedApp?.progress?.isEligibleForCertificate}
                    >
                      {appDocuments.certificateUrl ? 'Regenerate' : 'Generate'}
                    </Button>
                    {appDocuments.certificateUrl && (
                      <Button 
                        size="small" 
                        variant={appDocuments.certificateVisible ? "contained" : "outlined"}
                        color={appDocuments.certificateVisible ? "success" : "inherit"}
                        onClick={() => handleToggleDocVisibility('certificate', !appDocuments.certificateVisible)}
                      >
                        {appDocuments.certificateVisible ? 'Visible' : 'Hidden'}
                      </Button>
                    )}
                  </Box>
                </Box>
                {!selectedApp?.progress?.isEligibleForCertificate && (
                  <Typography variant="caption" color="error">Student not eligible yet</Typography>
                )}
                {appDocuments.certificateUrl && (
                  <Button size="small" component="a" href={appDocuments.certificateUrl} target="_blank" startIcon={<ExternalLink size={14} />}>View PDF</Button>
                )}
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>LOC (Letter of Completion)</Typography>
                    <Typography variant="caption" color="text.secondary">Required after completion</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={() => handleGenerateDocument('loc')}
                    >
                      {appDocuments.locUrl ? 'Regenerate' : 'Generate'}
                    </Button>
                    {appDocuments.locUrl && (
                      <Button 
                        size="small" 
                        variant={appDocuments.locVisible ? "contained" : "outlined"}
                        color={appDocuments.locVisible ? "success" : "inherit"}
                        onClick={() => handleToggleDocVisibility('loc', !appDocuments.locVisible)}
                      >
                        {appDocuments.locVisible ? 'Visible' : 'Hidden'}
                      </Button>
                    )}
                  </Box>
                </Box>
                {appDocuments.locUrl && (
                  <Button size="small" component="a" href={appDocuments.locUrl} target="_blank" startIcon={<ExternalLink size={14} />}>View PDF</Button>
                )}
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>Payment Receipt</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={async () => {
                        await API.post('/documents/generate-payment-slip', { applicationId: selectedApp._id, regenerate: true });
                        fetchAppDocuments(selectedApp._id);
                      }}
                      disabled={selectedApp?.paymentStatus !== 'Verified'}
                    >
                      {appDocuments.paymentSlipUrl ? 'Regenerate' : 'Generate'}
                    </Button>
                    {appDocuments.paymentSlipUrl && (
                      <Button 
                        size="small" 
                        variant={appDocuments.paymentSlipVisible ? "contained" : "outlined"}
                        color={appDocuments.paymentSlipVisible ? "success" : "inherit"}
                        onClick={() => handleToggleDocVisibility('paymentSlip', !appDocuments.paymentSlipVisible)}
                      >
                        {appDocuments.paymentSlipVisible ? 'Visible' : 'Hidden'}
                      </Button>
                    )}
                  </Box>
                </Box>
                {appDocuments.paymentSlipUrl && (
                  <Button size="small" component="a" href={appDocuments.paymentSlipUrl} target="_blank" startIcon={<ExternalLink size={14} />}>View PDF</Button>
                )}
              </Paper>
            </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDocDialog(false)} variant="contained" fullWidth sx={{ borderRadius: 2 }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dates Dialog */}
      <Dialog 
        open={openDateDialog} 
        onClose={() => setOpenDateDialog(false)}
        PaperProps={{ sx: { borderRadius: 3, width: '100%', maxWidth: 450 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pt: 3 }}>Edit Internship Dates</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Set the internship duration for <strong>{selectedApp?.name}</strong>. These dates will reflect in all generated documents.
            </Typography>
            
            <TextField
              label="Internship Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={internshipDates.startDate}
              onChange={(e) => setInternshipDates({ ...internshipDates, startDate: e.target.value })}
            />

            <TextField
              label="Internship End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={internshipDates.endDate}
              onChange={(e) => setInternshipDates({ ...internshipDates, endDate: e.target.value })}
            />

            <TextField
              label="Document Issue Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={internshipDates.documentIssueDate}
              onChange={(e) => setInternshipDates({ ...internshipDates, documentIssueDate: e.target.value })}
              helperText="This date will appear as 'Date:' on top of letters."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setOpenDateDialog(false)} variant="outlined" sx={{ borderRadius: 2, flex: 1 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateDates} 
            variant="contained" 
            sx={{ borderRadius: 2, flex: 1 }}
          >
            Save Dates
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
              <Typography variant="caption" color="text.secondary" fontWeight={600}>TRANSACTION / PAYMENT ID</Typography>
              <Typography variant="body1" fontWeight={700} sx={{ mt: 0.5 }}>{selectedApp?.razorpayPaymentId || selectedApp?.transactionId || 'N/A'}</Typography>
            </Box>
            {selectedApp?.razorpayOrderId && (
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>RAZORPAY ORDER ID</Typography>
                <Typography variant="body1" fontWeight={700} sx={{ mt: 0.5 }}>{selectedApp.razorpayOrderId}</Typography>
              </Box>
            )}
            <Divider />
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>PAYMENT DETAILS</Typography>
              {selectedApp?.razorpayPaymentId ? (
                <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 2, color: 'success.contrastText' }}>
                  <Typography variant="body2" fontWeight={600}>Verified via Razorpay</Typography>
                  <Typography variant="caption">Automatic verification successful</Typography>
                </Box>
              ) : selectedApp?.paymentScreenshot ? (
                <Box 
                  component="img"
                  src={getDocumentUrl(selectedApp.paymentScreenshot)}
                  alt="Payment Screenshot"
                  sx={{ 
                    width: '100%', 
                    borderRadius: 2, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(getDocumentUrl(selectedApp.paymentScreenshot), '_blank')}
                />
              ) : (
                <Typography variant="body2" color="error">No screenshot or Razorpay data available</Typography>
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
            sx={{ borderRadius: 2 }}
          >
            Reject
          </Button>
          <Button 
            onClick={() => handleVerifyPayment('Verified')} 
            variant="contained" 
            color="success"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Verify & Approve Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminInternships;
