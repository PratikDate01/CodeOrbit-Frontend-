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
  CircularProgress
} from '@mui/material';

const AdminLMSApprovals = () => {
  const [approvals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    // This endpoint should be added to backend to fetch pending approvals
    // For now, it's a placeholder
    try {
      // const { data } = await API.get('/admin/lms/approvals/pending');
      // setApprovals(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching approvals:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  if (loading) return <CircularProgress />;

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
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
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
                  <TableCell>{item.user.name}</TableCell>
                  <TableCell>{item.enrollment.program.title}</TableCell>
                  <TableCell>{item.activity.title}</TableCell>
                  <TableCell><Chip label={item.status} size="small" color="warning" /></TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="outlined" sx={{ mr: 1 }}>Review</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminLMSApprovals;
