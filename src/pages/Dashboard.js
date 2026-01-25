import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Button
} from '@mui/material';
import { 
  Briefcase, 
  Bell, 
  CheckCircle,
  Eye,
  FileText,
  Award,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { userInfo } = useAuth();
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, notiRes] = await Promise.all([
          API.get('/internships/my-applications'),
          API.get('/notifications')
        ]);
        setApplications(appRes.data);
        setNotifications(notiRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (userInfo) fetchData();
  }, [userInfo]);

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
    return <Chip label={status} size="small" color={colors[status] || 'default'} />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '90vh', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Welcome, {userInfo?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your internship applications and updates
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              component={Link} 
              to="/profile" 
              variant="outlined" 
              startIcon={<Settings size={18} />}
              sx={{ borderRadius: 2 }}
            >
              Settings
            </Button>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontWeight: 700 }}>
              {userInfo?.name?.charAt(0)}
            </Avatar>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Stats Section */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'primary.light', color: 'primary.main', mr: 2.5, display: 'flex' }}>
                  <Briefcase size={28} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={800}>{applications.length}</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>Total Applications</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'success.light', color: 'success.main', mr: 2.5, display: 'flex', opacity: 0.9 }}>
                  <CheckCircle size={28} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={800}>
                    {applications.filter(a => ['Selected', 'Approved', 'Completed'].includes(a.status)).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>Shortlisted / Selected</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'warning.light', color: 'warning.main', mr: 2.5, display: 'flex', opacity: 0.9 }}>
                  <Bell size={28} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={800}>
                    {notifications.filter(n => !n.isRead).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>Unread Notifications</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Applications Table */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight={800}>My Applications</Typography>
                <Button component={Link} to="/internships" variant="text" size="small" sx={{ fontWeight: 700 }}>
                  Explore More
                </Button>
              </Box>
              {applications.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Domain</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app._id} hover>
                          <TableCell fontWeight={500}>{app.preferredDomain}</TableCell>
                          <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusChip(app.status)}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              {app.documents?.offerLetterUrl && (
                                <Tooltip title="Download Offer Letter">
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${app.documents.offerLetterUrl}`}
                                    target="_blank"
                                  >
                                    <FileText size={18} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {app.documents?.certificateUrl && (
                                <Tooltip title="Download Certificate">
                                  <IconButton 
                                    size="small" 
                                    color="success"
                                    href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${app.documents.certificateUrl}`}
                                    target="_blank"
                                  >
                                    <CheckCircle size={18} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {app.documents?.locUrl && (
                                <Tooltip title="Download Completion Letter">
                                  <IconButton 
                                    size="small" 
                                    color="secondary"
                                    href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${app.documents.locUrl}`}
                                    target="_blank"
                                  >
                                    <Award size={18} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="View Verification Page">
                                <IconButton 
                                  size="small"
                                  component={Link}
                                  to={app.documents ? `/verify/${app.documents.verificationId}` : '#'}
                                  disabled={!app.documents}
                                >
                                  <Eye size={18} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">No applications yet.</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Notifications Section */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper sx={{ p: 3, borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Recent Notifications</Typography>
              {notifications.length > 0 ? (
                <Box>
                  {notifications.slice(0, 5).map((noti) => (
                    <Box 
                      key={noti._id} 
                      sx={{ 
                        pb: 2, 
                        mb: 2, 
                        borderBottom: '1px solid', 
                        borderColor: 'divider',
                        '&:last-child': { border: 0, mb: 0 }
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={600} color={noti.isRead ? 'text.secondary' : 'text.primary'}>
                        {noti.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {noti.message}
                      </Typography>
                      <Typography variant="caption" color="text.muted">
                        {new Date(noti.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">No notifications.</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
