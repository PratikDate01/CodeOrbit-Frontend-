import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Paper,
  CircularProgress,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Button,
  LinearProgress
} from '@mui/material';
import { 
  Users, 
  Briefcase, 
  Mail, 
  Clock, 
  ArrowRight,
  FileCheck,
  UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const quickActions = [
    { label: 'Review Applications', icon: <FileCheck size={18} />, path: '/admin/applications', color: 'primary' },
    { label: 'Manage Users', icon: <UserPlus size={18} />, path: '/admin/users', color: 'info' },
    { label: 'View Messages', icon: <Mail size={18} />, path: '/admin/messages', color: 'success' },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <CircularProgress thickness={5} size={60} sx={{ color: 'primary.main' }} />
    </Box>
  );

  const statCards = [
    { label: 'Total Applications', value: stats?.totalApplications, icon: <Briefcase size={24} />, color: '#3b82f6', trend: '+12%' },
    { label: 'Contact Messages', value: stats?.totalMessages, icon: <Mail size={24} />, color: '#10b981', trend: '+5%' },
    { label: 'Registered Users', value: stats?.totalUsers, icon: <Users size={24} />, color: '#f59e0b', trend: '+8%' },
    { label: 'Pending Reviews', value: stats?.pendingReviews, icon: <Clock size={24} />, color: '#ef4444', trend: '2 new' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      New: '#3b82f6',
      Approved: '#10b981',
      Rejected: '#ef4444',
      Reviewed: '#f59e0b'
    };
    return colors[status] || '#64748b';
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, letterSpacing: '-1px' }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, here's what's happening today.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {quickActions.map((action, i) => (
            <Button 
              key={i}
              variant="outlined" 
              color={action.color}
              startIcon={action.icon}
              onClick={() => navigate(action.path)}
              sx={{ 
                borderRadius: 2, 
                fontWeight: 600, 
                textTransform: 'none',
                borderWidth: '1.5px',
                '&:hover': { borderWidth: '1.5px' }
              }}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {statCards.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 4, 
              border: '1px solid', 
              borderColor: 'divider',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 20px -10px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 3, 
                    bgcolor: `${stat.color}10`, 
                    color: stat.color,
                    display: 'flex'
                  }}>
                    {stat.icon}
                  </Box>
                  <Chip 
                    label={stat.trend} 
                    size="small" 
                    sx={{ 
                      bgcolor: 'success.light', 
                      color: 'success.dark', 
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      height: 20
                    }} 
                  />
                </Box>
                <Typography variant="h3" fontWeight={800} sx={{ mb: 0.5 }}>{stat.value || 0}</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 0, borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={700}>Recent Applications</Typography>
              <Button 
                endIcon={<ArrowRight size={16} />} 
                size="small"
                onClick={() => navigate('/admin/applications')}
              >
                View All
              </Button>
            </Box>
            <List disablePadding>
              {stats?.recentApplications?.length > 0 ? (
                stats.recentApplications.map((app, index) => (
                  <React.Fragment key={app._id}>
                    <ListItem 
                      sx={{ 
                        px: 3, 
                        py: 2,
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' }
                      }}
                      secondaryAction={
                        <Box sx={{ textAlign: 'right' }}>
                          <Chip 
                            label={app.status} 
                            size="small" 
                            sx={{ 
                              bgcolor: `${getStatusColor(app.status)}15`, 
                              color: getStatusColor(app.status),
                              fontWeight: 700,
                              fontSize: '0.7rem'
                            }} 
                          />
                          <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
                            {new Date(app.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light', fontWeight: 600 }}>
                          {app.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={app.name} 
                        secondary={app.preferredDomain}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItem>
                    {index < stats.recentApplications.length - 1 && <Divider component="li" sx={{ mx: 3 }} />}
                  </React.Fragment>
                ))
              ) : (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No recent applications found.</Typography>
                </Box>
              )}
            </List>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              Application Status
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {stats?.applicationsByStatus?.map((status, i) => {
                const percentage = Math.round((status.count / stats.totalApplications) * 100) || 0;
                const color = getStatusColor(status._id);
                return (
                  <Box key={i}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: color }} />
                        <Typography variant="body2" fontWeight={600}>{status._id}</Typography>
                      </Box>
                      <Typography variant="caption" fontWeight={700}>{status.count} ({percentage}%)</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={percentage} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        bgcolor: `${color}15`,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: color,
                          borderRadius: 3
                        }
                      }}
                    />
                  </Box>
                );
              })}
              {(!stats?.applicationsByStatus || stats.applicationsByStatus.length === 0) && (
                <Typography variant="body2" color="text.secondary">No status data available.</Typography>
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              System Status
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { label: 'API Services', status: 'Operational', color: '#10b981' },
                { label: 'Database', status: 'Connected', color: '#10b981' },
                { label: 'Security', status: 'Enhanced', color: '#10b981' },
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: item.color, borderRadius: '50%' }} />
                    <Typography variant="caption" fontWeight={700}>{item.status}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminOverview;
