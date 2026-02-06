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
import { useNotification } from '../../context/NotificationContext';

const AdminLMSEnrollments = () => {
  const { showNotification } = useNotification();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issuingId, setIssuingId] = useState(null);

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
    setIssuingId(id);
    try {
      await API.post(`/admin/lms/enrollments/${id}/issue-certificate`);
      showNotification('Certificate issued successfully', 'success');
      fetchEnrollments();
    } catch (error) {
      console.error('Error issuing certificate:', error);
      showNotification(error.response?.data?.message || 'Failed to issue certificate', 'error');
    } finally {
      setIssuingId(null);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={700}>Student Enrollments & Progress</Typography>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase' }}>
          Total Students: {enrollments.length}
        </Typography>
      </Box>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: 'background.alt' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, py: 1.5, fontSize: '0.8rem' }}>Student</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 1.5, fontSize: '0.8rem' }}>Program</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 1.5, fontSize: '0.8rem' }}>Progress</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 1.5, fontSize: '0.8rem' }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, py: 1.5, fontSize: '0.8rem' }}>Certification</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollments.map((enrollment) => (
              <TableRow key={enrollment._id} hover>
                <TableCell sx={{ py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%', 
                      bgcolor: 'primary.lighter', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <User size={16} color="#0066FF" />
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.85rem' }}>{enrollment.user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{enrollment.user.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 1, fontSize: '0.85rem' }}>{enrollment.program.title}</TableCell>
                <TableCell sx={{ py: 1, minWidth: 140 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={enrollment.progress} 
                        sx={{ height: 6, borderRadius: 3, bgcolor: 'action.hover' }} 
                      />
                    </Box>
                    <Typography variant="caption" fontWeight={800} sx={{ fontSize: '0.7rem' }}>{enrollment.progress}%</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Chip 
                    label={enrollment.status} 
                    size="small" 
                    color={enrollment.status === 'Completed' ? 'success' : 'primary'} 
                    variant="outlined"
                    sx={{ fontSize: '0.65rem', fontWeight: 700, height: 20, textTransform: 'uppercase' }} 
                  />
                </TableCell>
                <TableCell align="right" sx={{ py: 1 }}>
                  {enrollment.isCertificateIssued ? (
                    <Chip 
                      label="Issued" 
                      size="small" 
                      color="success" 
                      icon={<Award size={12} />} 
                      sx={{ fontSize: '0.65rem', fontWeight: 700, height: 20 }}
                    />
                  ) : (
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="success"
                      disabled={enrollment.progress < 100 || issuingId === enrollment._id}
                      onClick={() => handleIssueCertificate(enrollment._id)}
                      sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', px: 1.5 }}
                    >
                      {issuingId === enrollment._id ? <CircularProgress size={16} color="inherit" /> : 'Issue Cert'}
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
