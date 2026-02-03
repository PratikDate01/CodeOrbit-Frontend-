import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
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
  IconButton, 
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  Briefcase, 
  CheckCircle, 
  Bell, 
  ChevronRight,
  Sparkles,
  FileText,
  Plus,
  ArrowRight
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
  return <Chip label={status} size="small" color={colors[status] || 'default'} />;
};

const UserOverview = ({ applications, notifications, userInfo, onPaymentClick, getDocumentUrl }) => {
  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  
  return (
    <Box>
      {/* Welcome Banner */}
      <Paper 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: 5, 
          background: 'linear-gradient(135deg, #0f0f0f 0%, #2d2d2d 100%)',
          color: 'white',
          mb: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Sparkles size={20} color="#fbbf24" />
            <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: '2px', opacity: 0.8 }}>
              Welcome back, Student
            </Typography>
          </Box>
          <Typography variant="h3" fontWeight={800} sx={{ mb: 1, letterSpacing: '-1px' }}>
            Hello, {userInfo?.name?.split(' ')[0]}!
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400, mb: 3, maxWidth: 500 }}>
            You have {applications.length} active applications and {unreadNotifications} new notifications. 
            Keep up the great work!
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              component={Link} 
              to="/internships"
              startIcon={<Plus size={18} />}
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main', 
                '&:hover': { bgcolor: '#f1f5f9' },
                borderRadius: 2,
                px: 3
              }}
            >
              Apply for New
            </Button>
            <Button 
              variant="outlined" 
              component={Link} 
              to="/profile"
              sx={{ 
                borderColor: 'rgba(255,255,255,0.3)', 
                color: 'white', 
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                borderRadius: 2,
                px: 3
              }}
            >
              Update Profile
            </Button>
          </Box>
        </Box>
        {/* Decorative background elements */}
        <Box sx={{ position: 'absolute', right: -50, top: -50, width: 250, height: 250, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
        <Box sx={{ position: 'absolute', right: 100, bottom: -100, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(15, 15, 15, 0.05)', color: 'primary.main' }}>
                  <Briefcase size={24} />
                </Box>
                <Chip label="Applications" size="small" variant="outlined" sx={{ fontWeight: 700, borderColor: 'divider' }} />
              </Box>
              <Typography variant="h3" fontWeight={800}>{applications.length}</Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>Total submitted applications</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(5, 150, 105, 0.1)', color: 'success.main' }}>
                  <CheckCircle size={24} />
                </Box>
                <Chip label="Success" size="small" variant="outlined" color="success" sx={{ fontWeight: 700 }} />
              </Box>
              <Typography variant="h3" fontWeight={800}>
                {applications.filter(a => ['Selected', 'Approved', 'Completed'].includes(a.status)).length}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>Selected / Approved programs</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: unreadNotifications > 0 ? 'rgba(220, 38, 38, 0.1)' : 'rgba(15, 15, 15, 0.05)', color: unreadNotifications > 0 ? 'error.main' : 'text.secondary' }}>
                  <Bell size={24} />
                </Box>
                <Chip label="Alerts" size="small" variant="outlined" color={unreadNotifications > 0 ? "error" : "default"} sx={{ fontWeight: 700 }} />
              </Box>
              <Typography variant="h3" fontWeight={800}>{unreadNotifications}</Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>Unread notifications</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Recent Applications */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight={800}>Recent Applications</Typography>
              <Button 
                component={Link} 
                to="/dashboard/applications" 
                endIcon={<ArrowRight size={16} />}
                variant="text" 
                size="small" 
                sx={{ fontWeight: 700 }}
              >
                View All
              </Button>
            </Box>
            
            {applications.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, py: 2 }}>Domain</TableCell>
                      <TableCell sx={{ fontWeight: 700, py: 2 }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, py: 2 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.slice(0, 5).map((app) => (
                      <TableRow key={app._id} hover>
                        <TableCell sx={{ py: 2 }}>
                          <Typography variant="body2" fontWeight={700}>{app.preferredDomain}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>{getStatusChip(app.status)}</TableCell>
                        <TableCell align="right" sx={{ py: 2 }}>
                          {app.status === 'Selected' && app.paymentStatus === 'Pending' ? (
                            <Button 
                              variant="contained" 
                              size="small" 
                              color="warning"
                              onClick={() => onPaymentClick(app)}
                              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 2 }}
                            >
                              Pay Now
                            </Button>
                          ) : (
                            <IconButton size="small" component={Link} to="/dashboard/applications">
                              <ChevronRight size={18} />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'rgba(15, 15, 15, 0.02)', borderRadius: 4 }}>
                <Box sx={{ mb: 2, opacity: 0.2 }}>
                  <FileText size={48} />
                </Box>
                <Typography color="text.secondary" fontWeight={500}>No applications found.</Typography>
                <Button component={Link} to="/internships" sx={{ mt: 2, fontWeight: 700 }}>
                  Browse Programs
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Notifications */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Recent Alerts</Typography>
            {notifications.length > 0 ? (
              <List disablePadding>
                {notifications.slice(0, 4).map((noti, idx) => (
                  <React.Fragment key={noti._id}>
                    <ListItem 
                      alignItems="flex-start" 
                      sx={{ 
                        px: 0, 
                        py: 2,
                        '&:hover': { bgcolor: 'rgba(15, 15, 15, 0.02)' },
                        transition: '0.2s',
                        borderRadius: 2
                      }}
                    >
                      <Box sx={{ mr: 2, mt: 0.8 }}>
                        <Box 
                          sx={{ 
                            width: 10, 
                            height: 10, 
                            borderRadius: '50%', 
                            bgcolor: noti.isRead ? 'transparent' : 'primary.main', 
                            border: noti.isRead ? '1px solid' : 'none', 
                            borderColor: 'divider',
                            boxShadow: noti.isRead ? 'none' : '0 0 0 4px rgba(15, 15, 15, 0.1)'
                          }} 
                        />
                      </Box>
                      <ListItemText 
                        primary={noti.title}
                        secondary={
                          <React.Fragment>
                            <Typography variant="body2" color="text.primary" sx={{ display: 'block', mt: 0.5, lineHeight: 1.4 }}>
                              {noti.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontWeight: 500 }}>
                              {new Date(noti.createdAt).toLocaleDateString()}
                            </Typography>
                          </React.Fragment>
                        }
                        primaryTypographyProps={{ fontWeight: 800, fontSize: '0.95rem' }}
                      />
                    </ListItem>
                    {idx < notifications.slice(0, 4).length - 1 && <Divider sx={{ my: 0.5, opacity: 0.5 }} />}
                  </React.Fragment>
                ))}
                <Button 
                  fullWidth 
                  component={Link} 
                  to="/dashboard/notifications" 
                  variant="outlined"
                  sx={{ mt: 3, fontWeight: 700, textTransform: 'none', borderRadius: 2 }}
                >
                  View All Alerts
                </Button>
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'rgba(15, 15, 15, 0.02)', borderRadius: 4 }}>
                <Box sx={{ mb: 2, opacity: 0.2 }}>
                  <Bell size={48} />
                </Box>
                <Typography color="text.secondary" variant="body2" fontWeight={500}>No new alerts at the moment.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserOverview;
