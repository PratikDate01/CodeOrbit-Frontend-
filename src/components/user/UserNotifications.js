import React from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Button, 
  Avatar,
  IconButton
} from '@mui/material';
import { 
  Bell, 
  Trash2, 
  Mail, 
  Briefcase, 
  CreditCard,
  ArrowLeft 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserNotifications = ({ notifications, onClearAll }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'application_status': return <Briefcase size={20} />;
      case 'payment_status': return <CreditCard size={20} />;
      default: return <Mail size={20} />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'application_status': return 'primary.lighter';
      case 'payment_status': return 'warning.lighter';
      default: return 'info.lighter';
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'application_status': return 'primary.main';
      case 'payment_status': return 'warning.main';
      default: return 'info.main';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            component={Link} 
            to="/dashboard" 
            sx={{ bgcolor: 'background.alt', '&:hover': { bgcolor: 'divider' } }}
          >
            <ArrowLeft size={20} />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
              Notifications
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Stay updated with your application status and news.
            </Typography>
          </Box>
        </Box>
        {notifications.length > 0 && (
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<Trash2 size={18} />}
            onClick={onClearAll}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Clear All
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 0, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', overflow: 'hidden' }}>
        {notifications.length > 0 ? (
          <List disablePadding>
            {notifications.map((noti, idx) => (
              <React.Fragment key={noti._id}>
                <ListItem 
                  sx={{ 
                    p: 3, 
                    bgcolor: noti.isRead ? 'transparent' : 'rgba(37, 99, 235, 0.02)',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' }
                  }}
                >
                  <Avatar sx={{ 
                    bgcolor: getBgColor(noti.type), 
                    color: getColor(noti.type), 
                    mr: 3,
                    width: 48,
                    height: 48
                  }}>
                    {getIcon(noti.type)}
                  </Avatar>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight={700}>{noti.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(noti.createdAt).toLocaleDateString()} at {new Date(noti.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
                        {noti.message}
                      </Typography>
                    }
                  />
                </ListItem>
                {idx < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <Box sx={{ color: 'text.secondary', mb: 2 }}>
              <Bell size={48} strokeWidth={1} />
            </Box>
            <Typography variant="h6" fontWeight={700}>All caught up!</Typography>
            <Typography variant="body2" color="text.secondary">
              No new notifications at the moment.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UserNotifications;
