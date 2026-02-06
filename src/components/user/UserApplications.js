import React from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton, 
  Tooltip, 
  Chip,
  Button
} from '@mui/material';
import { 
  Briefcase, 
  CreditCard, 
  FileText,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Award,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const getStatusChip = (status) => {
  const configs = {
    New: { color: 'info', icon: <Clock size={14} /> },
    Reviewed: { color: 'warning', icon: <Clock size={14} /> },
    Contacted: { color: 'primary', icon: <AlertCircle size={14} /> },
    Selected: { color: 'success', icon: <CheckCircle2 size={14} /> },
    Approved: { color: 'success', icon: <CheckCircle2 size={14} /> },
    Completed: { color: 'secondary', icon: <CheckCircle2 size={14} /> },
    Rejected: { color: 'error', icon: <XCircle size={14} /> }
  };
  const config = configs[status] || { color: 'default', icon: null };
  return (
    <Chip 
      label={status} 
      size="small" 
      color={config.color} 
      icon={config.icon}
      sx={{ fontWeight: 700, borderRadius: 1.5, px: 0.5 }} 
    />
  );
};

const UserApplications = ({ applications, onPaymentClick, getDocumentUrl }) => {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            component={Link} 
            to="/dashboard" 
            sx={{ bgcolor: 'background.alt', '&:hover': { bgcolor: 'divider' } }}
          >
            <ArrowLeft size={20} />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-1px' }}>
              My Applications
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
              Track your progress and manage your enrollments.
            </Typography>
          </Box>
        </Box>
        <Button 
          variant="contained" 
          component={Link} 
          to="/internships" 
          startIcon={<Briefcase size={18} />}
          sx={{ borderRadius: 2.5, px: 3, py: 1.2, fontWeight: 700, textTransform: 'none', boxShadow: '0 4px 12px rgba(15,15,15,0.1)' }}
        >
          Explore Internships
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', overflow: 'hidden' }}>
        {applications.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'rgba(15, 15, 15, 0.02)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, py: 2.5, color: 'text.secondary', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Program / Domain</TableCell>
                  <TableCell sx={{ fontWeight: 800, py: 2.5, color: 'text.secondary', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Applied Date</TableCell>
                  <TableCell sx={{ fontWeight: 800, py: 2.5, color: 'text.secondary', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800, py: 2.5, color: 'text.secondary', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, py: 2.5, color: 'text.secondary', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ py: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(15, 15, 15, 0.05)', color: 'primary.main', display: 'flex' }}>
                          <Briefcase size={20} />
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight={800}>{app.preferredDomain}</Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={500}>{app.duration} Months Internship</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>
                      <Typography variant="body2" fontWeight={500}>{new Date(app.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>{getStatusChip(app.status)}</TableCell>
                    <TableCell sx={{ py: 3 }}>
                      {app.paymentStatus === 'Verified' ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'success.main' }}>
                          <CheckCircle2 size={16} />
                          <Typography variant="body2" fontWeight={700}>Verified</Typography>
                        </Box>
                      ) : app.paymentStatus === 'Processing' ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'warning.main' }}>
                          <Clock size={16} />
                          <Typography variant="body2" fontWeight={700}>Processing</Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                          <AlertCircle size={16} />
                          <Typography variant="body2" fontWeight={700}>Pending</Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="right" sx={{ py: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {app.status === 'Selected' && app.paymentStatus === 'Pending' && (
                          <Button 
                            variant="contained" 
                            size="small" 
                            color="warning"
                            startIcon={<CreditCard size={16} />}
                            onClick={() => onPaymentClick(app)}
                            sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 800, px: 2 }}
                          >
                            Pay Now
                          </Button>
                        )}
                        {['Approved', 'Completed'].includes(app.status) && (
                          <Tooltip title="View Internship Dashboard">
                            <IconButton 
                              size="small" 
                              component={Link}
                              to={`/internship-activity/${app._id}`}
                              sx={{ bgcolor: 'primary.lighter', color: 'primary.main', '&:hover': { bgcolor: 'primary.light' } }}
                            >
                              <ArrowUpRight size={18} />
                            </IconButton>
                          </Tooltip>
                        )}
                        {app.documents?.offerLetterUrl && app.documents?.offerLetterVisible && (
                          <Tooltip title="View Offer Letter">
                            <IconButton 
                              size="small" 
                              href={getDocumentUrl(app.documents.offerLetterUrl)}
                              target="_blank"
                              sx={{ bgcolor: 'success.lighter', color: 'success.main', '&:hover': { bgcolor: 'success.light' } }}
                            >
                              <FileText size={18} />
                            </IconButton>
                          </Tooltip>
                        )}
                        {app.documents?.certificateUrl && app.documents?.certificateVisible && (
                          <Tooltip title="View Certificate">
                            <IconButton 
                              size="small" 
                              href={getDocumentUrl(app.documents.certificateUrl)}
                              target="_blank"
                              sx={{ bgcolor: 'secondary.lighter', color: 'secondary.main', '&:hover': { bgcolor: 'secondary.light' } }}
                            >
                              <Award size={18} />
                            </IconButton>
                          </Tooltip>
                        )}
                        {app.documents?.locUrl && app.documents?.locVisible && (
                          <Tooltip title="View LOC">
                            <IconButton 
                              size="small" 
                              href={getDocumentUrl(app.documents.locUrl)}
                              target="_blank"
                              sx={{ bgcolor: 'info.lighter', color: 'info.main', '&:hover': { bgcolor: 'info.light' } }}
                            >
                              <CheckCircle2 size={18} />
                            </IconButton>
                          </Tooltip>
                        )}
                        {app.documents?.paymentSlipUrl && app.documents?.paymentSlipVisible && (
                          <Tooltip title="View Payment Receipt">
                            <IconButton 
                              size="small" 
                              href={getDocumentUrl(app.documents.paymentSlipUrl)}
                              target="_blank"
                              sx={{ bgcolor: 'primary.lighter', color: 'primary.main', '&:hover': { bgcolor: 'primary.light' } }}
                            >
                              <CreditCard size={18} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: { xs: 4, md: 8 }, textAlign: 'center', bgcolor: 'rgba(15, 15, 15, 0.01)' }}>
            <Box sx={{ display: 'inline-flex', p: 3, borderRadius: '50%', bgcolor: 'rgba(15, 15, 15, 0.04)', color: 'text.secondary', mb: 3 }}>
              <Briefcase size={48} strokeWidth={1} />
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>No applications yet</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              Your application list is currently empty. Start your career journey by applying for our internship programs.
            </Typography>
            <Button 
              component={Link} 
              to="/internships" 
              variant="contained" 
              sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 800 }}
            >
              Browse Programs
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UserApplications;
