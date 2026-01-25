// ==================== HEADER.JS ====================
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, useMediaQuery, useTheme, Avatar } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import BuildIcon from '@mui/icons-material/Build';
import WorkIcon from '@mui/icons-material/Work';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, User, LogOut, Settings } from 'lucide-react';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const { userInfo, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenu = (event) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setUserAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const navItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'About', path: '/about', icon: <InfoIcon /> },
    { text: 'Services', path: '/services', icon: <BuildIcon /> },
    { text: 'Internships', path: '/internships', icon: <WorkIcon /> },
    { text: 'Contact', path: '/contact', icon: <ContactMailIcon /> },
  ];

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ py: 1, minHeight: { xs: 64, md: 72 }, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 800,
            fontSize: { xs: '1.5rem', md: '1.75rem' },
            letterSpacing: '-0.02em',
            transition: 'opacity 0.2s',
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          CodeOrbit
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
              sx={{
                color: 'primary.main',
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  borderRadius: 2
                }
              }}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.path}
                  component={Link}
                  to={item.path}
                  onClick={handleClose}
                  selected={location.pathname === item.path}
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.50',
                      color: 'primary.main',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {item.icon}
                    {item.text}
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  fontSize: '0.925rem',
                  textTransform: 'none',
                  px: 2,
                  py: 0.75,
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(15, 23, 42, 0.04)',
                    color: 'primary.main',
                  },
                }}
              >
                {item.text}
              </Button>
            ))}

            {userInfo ? (
              <Box sx={{ ml: 1 }}>
                <IconButton onClick={handleUserMenu} sx={{ p: 0.5, border: '2px solid', borderColor: 'divider' }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                    {userInfo.name.charAt(0)}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={userAnchorEl}
                  open={Boolean(userAnchorEl)}
                  onClose={handleClose}
                  PaperProps={{ sx: { mt: 1.5, minWidth: 200, borderRadius: 3, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' } }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={700}>{userInfo.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{userInfo.email}</Typography>
                  </Box>
                  <MenuItem component={Link} to="/dashboard" onClick={handleClose}>
                    <LayoutDashboard size={18} style={{ marginRight: '12px' }} /> Dashboard
                  </MenuItem>
                  <MenuItem component={Link} to="/profile" onClick={handleClose}>
                    <User size={18} style={{ marginRight: '12px' }} /> Profile
                  </MenuItem>
                  {userInfo.role === 'admin' && (
                    <MenuItem component={Link} to="/admin" onClick={handleClose}>
                      <Settings size={18} style={{ marginRight: '12px' }} /> Admin Panel
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <LogOut size={18} style={{ marginRight: '12px' }} /> Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button 
                variant="contained" 
                component={Link} 
                to="/login"
                sx={{ ml: 1, px: 3 }}
              >
                Login
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

