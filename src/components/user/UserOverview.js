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
  ChevronRight
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
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
          Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quick summary of your internship progress.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'primary.lighter', color: 'primary.main', mr: 2.5, display: 'flex' }}>
                <Briefcase size={28} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>{applications.length}</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>Total Applications</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'success.lighter', color: 'success.main', mr: 2.5, display: 'flex' }}>
                <CheckCircle size={28} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  {applications.filter(a => ['Selected', 'Approved', 'Completed'].includes(a.status)).length}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>Selected / Approved</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'warning.lighter', color: 'warning.main', mr: 2.5, display: 'flex' }}>
                <Bell size={28} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  {notifications.filter(n => !n.isRead).length}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>Unread Alerts</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Recent Applications */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', height: '100%' }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight={800}>Recent Applications</Typography>
              <Button component={Link} to="/internships" variant="text" size="small" sx={{ fontWeight: 700 }}>
                Apply New
              </Button>
            </Box>
            
            {applications.length > 0 ? (
              <TableContainer>
                <Table size="small">
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
                        <TableCell sx={{ py: 2, fontWeight: 500 }}>{app.preferredDomain}</TableCell>
                        <TableCell sx={{ py: 2 }}>{getStatusChip(app.status)}</TableCell>
                        <TableCell align="right" sx={{ py: 2 }}>
                          {app.status === 'Selected' && app.paymentStatus === 'Pending' ? (
                            <Button 
                              variant="contained" 
                              size="small" 
                              color="warning"
                              onClick={() => onPaymentClick(app)}
                              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
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
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography color="text.secondary">No applications found.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Notifications */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', height: '100%' }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Recent Alerts</Typography>
            {notifications.length > 0 ? (
              <List disablePadding>
                {notifications.slice(0, 4).map((noti, idx) => (
                  <React.Fragment key={noti._id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                      <Box sx={{ mr: 2, mt: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: noti.isRead ? 'transparent' : 'primary.main', border: noti.isRead ? '1px solid' : 'none', borderColor: 'divider' }} />
                      </Box>
                      <ListItemText 
                        primary={noti.title}
                        secondary={
                          <React.Fragment>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                              {new Date(noti.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.primary" noWrap sx={{ display: 'block', maxWidth: 200 }}>
                              {noti.message}
                            </Typography>
                          </React.Fragment>
                        }
                        primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }}
                      />
                    </ListItem>
                    {idx < 3 && <Divider sx={{ opacity: 0.5 }} />}
                  </React.Fragment>
                ))}
                <Button fullWidth component={Link} to="/dashboard/notifications" sx={{ mt: 2, fontWeight: 700, textTransform: 'none' }}>
                  View All Alerts
                </Button>
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary" variant="body2">No alerts.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserOverview;
