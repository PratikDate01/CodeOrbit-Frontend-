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
  Receipt, 
  FileText,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
  return <Chip label={status} size="small" color={colors[status] || 'default'} sx={{ fontWeight: 600 }} />;
};

const UserApplications = ({ applications, onPaymentClick, getDocumentUrl }) => {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
            My Applications
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all your internship applications.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          component={Link} 
          to="/internships" 
          startIcon={<Briefcase size={18} />}
          sx={{ borderRadius: 3, px: 3, py: 1, fontWeight: 700, textTransform: 'none' }}
        >
          Explore More
        </Button>
      </Box>

      <Paper sx={{ p: 0, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', overflow: 'hidden' }}>
        {applications.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, py: 2.5 }}>Domain</TableCell>
                  <TableCell sx={{ fontWeight: 800, py: 2.5 }}>Applied Date</TableCell>
                  <TableCell sx={{ fontWeight: 800, py: 2.5 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800, py: 2.5 }}>Payment</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, py: 2.5 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app._id} hover>
                    <TableCell sx={{ py: 3 }}>
                      <Typography variant="body2" fontWeight={700}>{app.preferredDomain}</Typography>
                      <Typography variant="caption" color="text.secondary">{app.duration} Months Program</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ py: 3 }}>{getStatusChip(app.status)}</TableCell>
                    <TableCell sx={{ py: 3 }}>
                      {app.paymentStatus === 'Verified' ? (
                        <Chip label="Verified" size="small" color="success" variant="outlined" sx={{ fontWeight: 700 }} />
                      ) : app.paymentStatus === 'Processing' ? (
                        <Chip label="Processing" size="small" color="warning" variant="outlined" sx={{ fontWeight: 700 }} />
                      ) : (
                        <Chip label="Pending" size="small" color="default" variant="outlined" sx={{ fontWeight: 700 }} />
                      )}
                    </TableCell>
                    <TableCell align="right" sx={{ py: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {app.status === 'Selected' && app.paymentStatus === 'Pending' && (
                          <Tooltip title="Pay Now">
                            <IconButton 
                              size="small" 
                              sx={{ bgcolor: 'warning.lighter', color: 'warning.main', '&:hover': { bgcolor: 'warning.light' } }}
                              onClick={() => onPaymentClick(app)}
                            >
                              <CreditCard size={18} />
                            </IconButton>
                          </Tooltip>
                        )}
                        {['Approved', 'Completed'].includes(app.status) && (
                          <Tooltip title="View Tasks">
                            <IconButton 
                              size="small" 
                              color="info"
                              component={Link}
                              to={`/internship-activity/${app._id}`}
                              sx={{ bgcolor: 'info.lighter', color: 'info.main', '&:hover': { bgcolor: 'info.light' } }}
                            >
                              <Briefcase size={18} />
                            </IconButton>
                          </Tooltip>
                        )}
                        {app.documents?.offerLetterUrl && (
                          <Tooltip title="Offer Letter">
                            <IconButton 
                              size="small" 
                              href={getDocumentUrl(app.documents.offerLetterUrl)}
                              target="_blank"
                              sx={{ bgcolor: 'primary.lighter', color: 'primary.main', '&:hover': { bgcolor: 'primary.light' } }}
                            >
                              <FileText size={18} />
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
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <Box sx={{ color: 'text.secondary', mb: 2 }}>
              <Search size={48} strokeWidth={1} />
            </Box>
            <Typography variant="h6" fontWeight={700}>No applications found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You haven't applied for any internship programs yet.
            </Typography>
            <Button component={Link} to="/internships" variant="outlined" sx={{ borderRadius: 2 }}>
              Apply Now
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UserApplications;
