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
  LinearProgress,
  CircularProgress
} from '@mui/material';
import { Award, User } from 'lucide-react';
import API from '../../api/api';

const AdminLMSEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    try {
      const { data } = await API.get('/admin/lms/enrollments');
      setEnrollments(data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleIssueCertificate = async (id) => {
    try {
      await API.post(`/admin/lms/enrollments/${id}/issue-certificate`);
      fetchEnrollments();
    } catch (error) {
      console.error('Error issuing certificate:', error);
      alert(error.response?.data?.message || 'Failed to issue certificate');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Student Enrollments & Progress</Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'background.alt' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Program</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Progress</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Certification</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollments.map((enrollment) => (
              <TableRow key={enrollment._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <User size={16} color="#64748b" />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{enrollment.user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{enrollment.user.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{enrollment.program.title}</TableCell>
                <TableCell sx={{ minWidth: 150 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress variant="determinate" value={enrollment.progress} sx={{ height: 6, borderRadius: 3 }} />
                    </Box>
                    <Typography variant="caption" fontWeight={700}>{enrollment.progress}%</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={enrollment.status} 
                    size="small" 
                    color={enrollment.status === 'Completed' ? 'success' : 'primary'} 
                    variant="outlined" 
                  />
                </TableCell>
                <TableCell align="right">
                  {enrollment.isCertificateIssued ? (
                    <Chip label="Issued" size="small" color="success" icon={<Award size={14} />} />
                  ) : (
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="success"
                      disabled={enrollment.progress < 100}
                      onClick={() => handleIssueCertificate(enrollment._id)}
                    >
                      Issue Cert
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {enrollments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">No enrollments found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminLMSEnrollments;
