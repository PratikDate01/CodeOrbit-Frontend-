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

const AdminLMSApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
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
    try {
      await API.patch(`/admin/lms/progress/${id}/approve`, {
        status,
        marks: reviewDialog.marks,
        remarks: reviewDialog.remarks
      });
      setReviewDialog({ open: false, item: null, marks: 0, remarks: '' });
      fetchApprovals();
    } catch (error) {
      console.error('Error approving activity:', error);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Pending Activity Approvals</Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'background.alt' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Program</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Activity</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approvals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">No pending approvals found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              approvals.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>{item.user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.user.email}</Typography>
                  </TableCell>
                  <TableCell>{item.enrollment.program.title}</TableCell>
                  <TableCell>{item.activity.title}</TableCell>
                  <TableCell><Chip label={item.activity.type} size="small" variant="outlined" /></TableCell>
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      variant="contained" 
                      onClick={() => setReviewDialog({ open: true, item, marks: item.marks || 0, remarks: '' })}
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
          <Button color="error" onClick={() => handleApprove(reviewDialog.item._id, 'Rejected')}>Reject</Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button onClick={() => setReviewDialog({ ...reviewDialog, open: false })}>Cancel</Button>
          <Button variant="contained" color="success" onClick={() => handleApprove(reviewDialog.item._id, 'Completed')}>Approve & Complete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLMSApprovals;
