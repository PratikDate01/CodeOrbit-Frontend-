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
  Button,
  Chip,
  IconButton
} from '@mui/material';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserPayments = ({ applications, onPaymentClick }) => {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton 
          component={Link} 
          to="/dashboard" 
          sx={{ bgcolor: 'background.alt', '&:hover': { bgcolor: 'divider' } }}
        >
          <ArrowLeft size={20} />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-1px' }}>
            Payments & Billing
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            Manage your internship fees and view transaction history.
          </Typography>
        </Box>
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
                      <TableCell sx={{ fontWeight: 800, py: 2.5, color: 'text.secondary', fontSize: '0.85rem', textTransform: 'uppercase' }}>Program</TableCell>
                      <TableCell sx={{ fontWeight: 800, py: 2.5, color: 'text.secondary', fontSize: '0.85rem', textTransform: 'uppercase' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 800, py: 2.5, color: 'text.secondary', fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 800, py: 2.5, color: 'text.secondary', fontSize: '0.85rem', textTransform: 'uppercase' }}>Transaction ID</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, py: 2.5, color: 'text.secondary', fontSize: '0.85rem', textTransform: 'uppercase' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app._id} hover>
                        <TableCell sx={{ py: 3 }}>
                          <Typography variant="body2" fontWeight={800}>{app.preferredDomain}</Typography>
                        </TableCell>
                        <TableCell sx={{ py: 3 }}>
                          <Typography variant="body2" fontWeight={700}>₹{app.amount}</Typography>
                        </TableCell>
                        <TableCell sx={{ py: 3 }}>
                          {app.paymentStatus === 'Verified' ? (
                            <Chip label="Verified" color="success" size="small" icon={<CheckCircle2 size={14} />} sx={{ fontWeight: 700 }} />
                          ) : app.paymentStatus === 'Processing' ? (
                            <Chip label="Processing" color="warning" size="small" icon={<Clock size={14} />} sx={{ fontWeight: 700 }} />
                          ) : (
                            <Chip label="Pending" color="error" size="small" icon={<AlertCircle size={14} />} sx={{ fontWeight: 700 }} />
                          )}
                        </TableCell>
                        <TableCell sx={{ py: 3 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                            {app.razorpayPaymentId || app.transactionId || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 3 }}>
                          {app.status === 'Selected' && app.paymentStatus === 'Pending' ? (
                            <Button 
                              variant="contained" 
                              size="small" 
                              color="warning"
                              startIcon={<CreditCard size={16} />}
                              onClick={() => onPaymentClick(app)}
                              sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 800 }}
                            >
                              Pay Now
                            </Button>
                          ) : (
                            <Typography variant="caption" color="text.secondary">No actions required</Typography>
                          )}
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="body2" fontWeight={800} sx={{ fontSize: '0.95rem' }}>{app.preferredDomain}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>Internship Program Fee</Typography>
                      </Box>
                      <Typography variant="body1" fontWeight={800} color="primary.main">₹{app.amount}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'space-between', alignItems: 'center', py: 0.5, borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'rgba(0,0,0,0.04)' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Transaction ID</Typography>
                        <Typography variant="caption" color="text.primary" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                          {app.razorpayPaymentId || app.transactionId || 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Status</Typography>
                        <Box sx={{ mt: 0.5 }}>
                          {app.paymentStatus === 'Verified' ? (
                            <Chip label="Verified" color="success" size="small" icon={<CheckCircle2 size={12} />} sx={{ fontWeight: 700 }} />
                          ) : app.paymentStatus === 'Processing' ? (
                            <Chip label="Processing" color="warning" size="small" icon={<Clock size={12} />} sx={{ fontWeight: 700 }} />
                          ) : (
                            <Chip label="Pending" color="error" size="small" icon={<AlertCircle size={12} />} sx={{ fontWeight: 700 }} />
                          )}
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {app.status === 'Selected' && app.paymentStatus === 'Pending' ? (
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
                      ) : (
                        <Typography variant="caption" color="text.secondary">No actions required</Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No payment history found.</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UserPayments;