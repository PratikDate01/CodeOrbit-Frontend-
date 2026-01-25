import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Container,
  Button,
  Avatar, 
  Divider, 
  InputBase, 
  Badge, 
  Tooltip,
  Paper
} from '@mui/material';
import { 
  LayoutDashboard, 
  Briefcase, 
  Mail, 
  Users, 
  Settings, 
  Bell, 
  Menu,
  ChevronRight,
  LogOut,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdminOverview from '../components/admin/AdminOverview';
import AdminInternships from '../components/admin/AdminInternships';
import AdminMessages from '../components/admin/AdminMessages';
import AdminUsers from '../components/admin/AdminUsers';

const drawerWidth = 280;

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { text: 'Applications', icon: <Briefcase size={20} />, path: '/admin/applications' },
    { text: 'Messages', icon: <Mail size={20} />, path: '/admin/messages' },
    { text: 'Users', icon: <Users size={20} />, path: '/admin/users' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ 
          width: 40, 
          height: 40, 
          bgcolor: 'primary.main', 
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          C
        </Box>
        <Typography variant="h6" fontWeight={800} sx={{ color: 'text.primary', letterSpacing: '-0.5px' }}>
          CodeOrbit
        </Typography>
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.5 }} />

      <List sx={{ px: 2, mt: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  transition: 'all 0.2s',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                    '& .MuiListItemIcon-root': { color: 'white' }
                  },
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'rgba(15, 15, 15, 0.04)',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'white' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive ? 700 : 500, 
                    fontSize: '0.925rem',
                  }} 
                />
                {isActive && <ChevronRight size={16} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2, mt: 'auto' }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            bgcolor: 'background.alt', 
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: 'primary.light',
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              {user?.name?.charAt(0) || 'A'}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle2" fontWeight={700} noWrap>
                {user?.name || 'Admin User'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                {user?.email || 'admin@codeorbit.com'}
              </Typography>
            </Box>
          </Box>
          <Button 
            fullWidth 
            variant="outlined" 
            color="inherit"
            startIcon={<LogOut size={16} />}
            onClick={handleLogout}
            sx={{ 
              borderRadius: 2, 
              py: 1, 
              fontSize: '0.8rem',
              borderColor: 'divider',
              '&:hover': { bgcolor: 'error.lighter', color: 'error.main', borderColor: 'error.light' }
            }}
          >
            Sign Out
          </Button>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        component="nav"
        sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #e2e8f0' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth, 
              borderRight: '1px solid #e2e8f0',
              bgcolor: 'white'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${drawerWidth}px)` } }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { lg: 'none' } }}
            >
              <Menu size={20} />
            </IconButton>

            <Box sx={{ 
              display: { xs: 'none', sm: 'flex' }, 
              alignItems: 'center', 
              bgcolor: 'background.alt', 
              px: 2, 
              py: 0.75, 
              borderRadius: 2,
              width: 400,
              border: '1px solid',
              borderColor: 'transparent',
              '&:focus-within': { borderColor: 'primary.main', bgcolor: 'white' }
            }}>
              <Search size={18} color="#64748b" />
              <InputBase
                placeholder="Search anything..."
                sx={{ ml: 1.5, flex: 1, fontSize: '0.9rem' }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Tooltip title="Notifications">
                <IconButton size="small" sx={{ bgcolor: 'background.alt' }}>
                  <Badge badgeContent={4} color="error" variant="dot">
                    <Bell size={20} />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Settings">
                <IconButton size="small" sx={{ bgcolor: 'background.alt' }}>
                  <Settings size={20} />
                </IconButton>
              </Tooltip>
              <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1.5 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" fontWeight={600} sx={{ display: { xs: 'none', md: 'block' } }}>
                  {user?.name?.split(' ')[0] || 'Admin'}
                </Typography>
                <Avatar 
                  sx={{ 
                    width: 35, 
                    height: 35, 
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 700
                  }}
                >
                  {user?.name?.charAt(0) || 'A'}
                </Avatar>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, pb: 4 }}>
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="applications" element={<AdminInternships />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="users" element={<AdminUsers />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
