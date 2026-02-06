import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';

import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const AdminLMSApprovals = () => {
  const { showNotification } = useNotification();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviewDialog, setReviewDialog] = useState({ open: false, item: null, marks: 0, remarks: '' });

  const fetchApprovals = async () => {
    try {
      const { data } = await API.get('/admin/lms/approvals/pending');
      setApprovals(data);
    } catch (error) {
      console.error('Error fetching approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async (id, status) => {
    setSubmitting(true);
    try {
      await API.patch(`/admin/lms/progress/${id}/approve`, {
        status,
        marks: reviewDialog.marks,
        remarks: reviewDialog.remarks
      });
      showNotification(`Submission ${status.toLowerCase()} successfully`, 'success');
      setReviewDialog({ open: false, item: null, marks: 0, remarks: '' });
      fetchApprovals();
    } catch (error) {
      console.error('Error approving activity:', error);
      showNotification(error.response?.data?.message || 'Failed to update submission', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={700}>Pending Activity Approvals</Typography>
        <Chip label={`${approvals.length} Pending`} color="primary" size="small" sx={{ fontWeight: 700 }} />
      </Box>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: 'background.alt' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, py: 1.5, fontSize: '0.8rem' }}>Student</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 1.5, fontSize: '0.8rem' }}>Program</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 1.5, fontSize: '0.8rem' }}>Activity</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 1.5, fontSize: '0.8rem' }}>Type</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, py: 1.5, fontSize: '0.8rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approvals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary" variant="body2">No pending approvals found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              approvals.map((item) => (
                <TableRow key={item._id} hover>
                  <TableCell sx={{ py: 1 }}>
                    <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.85rem' }}>{item.user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.user.email}</Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1, fontSize: '0.85rem' }}>{item.enrollment.program.title}</TableCell>
                  <TableCell sx={{ py: 1, fontSize: '0.85rem' }}>{item.activity.title}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip 
                      label={item.activity.type} 
                      size="small" 
                      variant="outlined" 
                      sx={{ fontSize: '0.65rem', height: 20, fontWeight: 700, textTransform: 'uppercase' }} 
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1 }}>
                    <Button 
                      size="small" 
                      variant="contained" 
                      onClick={() => setReviewDialog({ open: true, item, marks: item.marks || 0, remarks: '' })}
                      sx={{ borderRadius: 1.5, textTransform: 'none', px: 2, fontWeight: 700, fontSize: '0.75rem' }}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Review Dialog */}
      <Dialog open={reviewDialog.open} onClose={() => setReviewDialog({ ...reviewDialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Review Submission</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">Student: {reviewDialog.item?.user.name}</Typography>
            <Typography variant="subtitle2" color="text.secondary">Activity: {reviewDialog.item?.activity.title}</Typography>
            
            {reviewDialog.item?.submissionContent && (
              <Paper sx={{ p: 2, my: 2, bgcolor: 'background.alt', maxHeight: 200, overflow: 'auto' }}>
                <Typography variant="caption" fontWeight={700} sx={{ display: 'block', mb: 1 }}>SUBMISSION CONTENT:</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{reviewDialog.item.submissionContent}</Typography>
              </Paper>
            )}

            <TextField
              label="Marks / Score"
              type="number"
              fullWidth
              sx={{ mt: 2 }}
              value={reviewDialog.marks}
              onChange={(e) => setReviewDialog({ ...reviewDialog, marks: e.target.value })}
            />
            <TextField
              label="Feedback / Remarks"
              multiline
              rows={3}
              fullWidth
              sx={{ mt: 2 }}
              value={reviewDialog.remarks}
              onChange={(e) => setReviewDialog({ ...reviewDialog, remarks: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button color="error" onClick={() => handleApprove(reviewDialog.item._id, 'Rejected')} disabled={submitting}>Reject</Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button onClick={() => setReviewDialog({ ...reviewDialog, open: false })} disabled={submitting}>Cancel</Button>
          <Button variant="contained" color="success" onClick={() => handleApprove(reviewDialog.item._id, 'Completed')} disabled={submitting}>
            {submitting ? <CircularProgress size={20} /> : 'Approve & Complete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLMSApprovals;
