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
  Chip
} from '@mui/material';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle
} from 'lucide-react';

const UserPayments = ({ applications, onPaymentClick }) => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-1px' }}>
          Payments & Billing
        </Typography>
        <Typography variant="body1" color="text.secondary" fontWeight={500}>
          Manage your internship fees and view transaction history.
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', overflow: 'hidden' }}>
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
              {applications.length > 0 ? (
                applications.map((app) => (
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">No payment history found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default UserPayments;