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
          <>
            {/* Desktop view */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
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
            </Box>

            {/* Mobile view */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {applications.map((app) => (
                  <Box 
                    key={app._id} 
                    sx={{ 
                      p: 2.5, 
                      borderRadius: 3, 
                      border: '1px solid', 
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(15, 15, 15, 0.05)', color: 'primary.main', display: 'flex', mt: 0.5 }}>
                        <Briefcase size={18} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={800} sx={{ fontSize: '0.95rem' }}>{app.preferredDomain}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>{app.duration} Months Internship</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'space-between', alignItems: 'center', py: 0.5, borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'rgba(0,0,0,0.04)' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Applied Date</Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.825rem' }}>
                          {new Date(app.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Status</Typography>
                        <Box sx={{ mt: 0.5 }}>{getStatusChip(app.status)}</Box>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Payment</Typography>
                        <Box sx={{ mt: 0.5 }}>
                          {app.paymentStatus === 'Verified' ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'success.main' }}>
                              <CheckCircle2 size={14} />
                              <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.8rem' }}>Verified</Typography>
                            </Box>
                          ) : app.paymentStatus === 'Processing' ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'warning.main' }}>
                              <Clock size={14} />
                              <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.8rem' }}>Processing</Typography>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                              <AlertCircle size={14} />
                              <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.8rem' }}>Pending</Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-end', alignItems: 'center' }}>
                      {app.status === 'Selected' && app.paymentStatus === 'Pending' && (
                        <Button 
                          variant="contained" 
                          size="small" 
                          color="warning"
                          startIcon={<CreditCard size={15} />}
                          onClick={() => onPaymentClick(app)}
                          fullWidth
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 800, py: 1 }}
                        >
                          Pay Now
                        </Button>
                      )}
                      
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: '100%', justifyContent: 'flex-start' }}>
                        {['Approved', 'Completed'].includes(app.status) && (
                          <Button
                            variant="outlined"
                            size="small"
                            component={Link}
                            to={`/internship-activity/${app._id}`}
                            startIcon={<ArrowUpRight size={14} />}
                            sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700, flexGrow: 1 }}
                          >
                            Dashboard
                          </Button>
                        )}
                        {app.documents?.offerLetterUrl && app.documents?.offerLetterVisible && (
                          <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            href={getDocumentUrl(app.documents.offerLetterUrl)}
                            target="_blank"
                            startIcon={<FileText size={14} />}
                            sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700, flexGrow: 1 }}
                          >
                            Offer Letter
                          </Button>
                        )}
                        {app.documents?.certificateUrl && app.documents?.certificateVisible && (
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            href={getDocumentUrl(app.documents.certificateUrl)}
                            target="_blank"
                            startIcon={<Award size={14} />}
                            sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700, flexGrow: 1 }}
                          >
                            Certificate
                          </Button>
                        )}
                        {app.documents?.locUrl && app.documents?.locVisible && (
                          <Button
                            variant="outlined"
                            color="info"
                            size="small"
                            href={getDocumentUrl(app.documents.locUrl)}
                            target="_blank"
                            startIcon={<CheckCircle2 size={14} />}
                            sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700, flexGrow: 1 }}
                          >
                            LOC
                          </Button>
                        )}
                        {app.documents?.paymentSlipUrl && app.documents?.paymentSlipVisible && (
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            href={getDocumentUrl(app.documents.paymentSlipUrl)}
                            target="_blank"
                            startIcon={<CreditCard size={14} />}
                            sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700, flexGrow: 1 }}
                          >
                            Receipt
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </>
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
