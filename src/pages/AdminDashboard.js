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
  Avatar,
  InputBase,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  LayoutDashboard,
  Briefcase,
  Mail,
  Users,
  Settings,
  Bell,
  Menu,
  LogOut,
  Search,
  TicketPercent,
  ShieldAlert,
  GraduationCap,
  Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdminOverview from '../components/admin/AdminOverview';
import AdminInternships from '../components/admin/AdminInternships';
import AdminMessages from '../components/admin/AdminMessages';
import AdminUsers from '../components/admin/AdminUsers';
import AdminCoupons from '../components/admin/AdminCoupons';
import AdminActivity from '../components/admin/AdminActivity';
import AdminAuditLogs from '../components/admin/AdminAuditLogs';
import AdminLMS from '../components/admin/AdminLMS';

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { text: 'Dashboard',      icon: LayoutDashboard, path: '/admin' },
  { text: 'LMS Management', icon: GraduationCap,   path: '/admin/lms' },
  { text: 'Applications',   icon: Briefcase,       path: '/admin/applications' },
  { text: 'Messages',       icon: Mail,            path: '/admin/messages' },
  { text: 'Users',          icon: Users,           path: '/admin/users' },
  { text: 'Activity',       icon: Activity,        path: '/admin/activity' },
  { text: 'Audit Logs',     icon: ShieldAlert,     path: '/admin/audit-logs' },
  { text: 'Coupons',        icon: TicketPercent,   path: '/admin/coupons' },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────
const Sidebar = ({ userInfo, onLogout, location }) => (
  <Box sx={{
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    bgcolor: '#0f1117',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    fontFamily: '"DM Sans", sans-serif',
  }}>

    {/* Logo */}
    <Box sx={{ px: 3, pt: 3.5, pb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 34, height: 34,
          bgcolor: '#2563eb',
          borderRadius: '9px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 0 4px rgba(37,99,235,0.15)',
        }}>
          <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1rem', letterSpacing: '-1px', fontFamily: '"DM Sans", sans-serif' }}>
            C
          </Typography>
        </Box>
        <Box>
          <Typography sx={{
            color: '#ffffff', fontWeight: 800, fontSize: '1.05rem',
            letterSpacing: '-0.04em', fontFamily: '"DM Sans", sans-serif', lineHeight: 1,
          }}>
            CodeOrbit
          </Typography>
          <Typography sx={{
            color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem',
            fontFamily: '"DM Sans", sans-serif', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>
            Admin Panel
          </Typography>
        </Box>
      </Box>
    </Box>

    {/* Section label */}
    <Box sx={{ px: 2.5, mb: 1 }}>
      <Typography sx={{
        fontSize: '0.68rem', fontWeight: 700,
        color: 'rgba(255,255,255,0.25)',
        letterSpacing: '0.1em', textTransform: 'uppercase', px: 1,
      }}>
        Navigation
      </Typography>
    </Box>

    {/* Nav items */}
    <List sx={{ px: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {NAV_ITEMS.map(({ text, icon: Icon, path }) => {
        const active = path === '/admin'
          ? location.pathname === '/admin'
          : location.pathname === path || location.pathname.startsWith(path + '/');

        return (
          <ListItem key={text} disablePadding>
            <ListItemButton
              component={Link}
              to={path}
              sx={{
                borderRadius: '10px',
                py: 1.1, px: 1.5,
                position: 'relative',
                transition: 'all 0.15s ease',
                bgcolor: active ? 'rgba(37,99,235,0.15)' : 'transparent',
                '&:hover': {
                  bgcolor: active ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.05)',
                },
              }}
            >
              {active && (
                <Box sx={{
                  position: 'absolute', left: 0, top: '20%', bottom: '20%',
                  width: 3, bgcolor: '#2563eb', borderRadius: '0 3px 3px 0',
                }} />
              )}
              <ListItemIcon sx={{ minWidth: 36, color: active ? '#2563eb' : 'rgba(255,255,255,0.38)' }}>
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
              </ListItemIcon>
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.875rem',
                  color: active ? '#ffffff' : 'rgba(255,255,255,0.5)',
                }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>

    {/* User card */}
    <Box sx={{ p: 2.5 }}>
      {/* Admin badge */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 1, px: 2, py: 0.75, mb: 2,
        bgcolor: 'rgba(37,99,235,0.1)',
        border: '1px solid rgba(37,99,235,0.2)',
        borderRadius: '8px',
      }}>
        <ShieldAlert size={13} color="#2563eb" />
        <Typography sx={{
          fontSize: '0.7rem', fontWeight: 700,
          color: '#2563eb', fontFamily: '"DM Sans", sans-serif',
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          Administrator
        </Typography>
      </Box>

      <Box sx={{
        p: 1.5,
        bgcolor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        display: 'flex', alignItems: 'center', gap: 1.5,
      }}>
        <Avatar sx={{
          width: 36, height: 36,
          bgcolor: '#2563eb',
          fontSize: '0.85rem', fontWeight: 700,
          fontFamily: '"DM Sans", sans-serif',
          flexShrink: 0,
        }}>
          {userInfo?.name?.charAt(0) || 'A'}
        </Avatar>
        <Box sx={{ overflow: 'hidden', flex: 1 }}>
          <Typography sx={{
            color: '#fff', fontWeight: 700, fontSize: '0.82rem',
            fontFamily: '"DM Sans", sans-serif',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {userInfo?.name || 'Admin User'}
          </Typography>
          <Typography sx={{
            color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem',
            fontFamily: '"DM Sans", sans-serif',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {userInfo?.email || ''}
          </Typography>
        </Box>
        <Tooltip title="Sign out">
          <IconButton
            size="small"
            onClick={onLogout}
            sx={{
              color: 'rgba(255,255,255,0.3)',
              '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.1)' },
              ml: 'auto',
            }}
          >
            <LogOut size={15} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  </Box>
);

// ── Main Admin Dashboard ──────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/login'); };

  const currentNav = NAV_ITEMS.find(n =>
    n.path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname === n.path || location.pathname.startsWith(n.path + '/')
  );

  const sidebarContent = <Sidebar userInfo={userInfo} onLogout={handleLogout} location={location} />;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f7f7f5', fontFamily: '"DM Sans", sans-serif' }}>

      {/* ── Sidebar ── */}
      <Box component="nav" sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' },
          }}
        >
          {sidebarContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' },
          }}
          open
        >
          {sidebarContent}
        </Drawer>
      </Box>

      {/* ── Main Content ── */}
      <Box component="main" sx={{
        flexGrow: 1,
        width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* ── Topbar ── */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'rgba(247,247,245,0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #e8e8e4',
            zIndex: 1100,
          }}
        >
          <Toolbar sx={{
            justifyContent: 'space-between',
            px: { xs: 2.5, md: 4 },
            minHeight: '64px !important',
          }}>

            {/* Left */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ display: { lg: 'none' }, color: '#0a0a0a', p: 1 }}
              >
                <Menu size={20} />
              </IconButton>

              <Box>
                <Typography sx={{
                  fontWeight: 800, fontSize: '1.05rem',
                  color: '#0a0a0a', letterSpacing: '-0.03em',
                  fontFamily: '"DM Sans", sans-serif', lineHeight: 1,
                }}>
                  {currentNav?.text || 'Admin Dashboard'}
                </Typography>
                <Typography sx={{
                  fontSize: '0.75rem', color: '#a3a3a3',
                  fontFamily: '"DM Sans", sans-serif', fontWeight: 500, mt: 0.25,
                }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </Typography>
              </Box>
            </Box>

            {/* Right */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>

              {/* Search */}
              <Box sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                bgcolor: '#ffffff',
                border: '1px solid #e8e8e4',
                px: 1.75, py: 0.75,
                borderRadius: '10px',
                width: 260,
                gap: 1,
                transition: 'all 0.2s',
                '&:focus-within': {
                  borderColor: '#2563eb',
                  boxShadow: '0 0 0 3px rgba(37,99,235,0.08)',
                },
              }}>
                <Search size={15} color="#a3a3a3" />
                <InputBase
                  placeholder="Search…"
                  sx={{
                    fontSize: '0.875rem',
                    fontFamily: '"DM Sans", sans-serif',
                    flex: 1, color: '#0a0a0a',
                    '& input::placeholder': { color: '#c0c0bc' },
                  }}
                />
              </Box>

              {/* Settings */}
              <Tooltip title="Settings">
                <IconButton
                  size="small"
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    width: 36, height: 36,
                    bgcolor: '#ffffff', border: '1px solid #e8e8e4',
                    borderRadius: '10px', color: '#737373',
                    '&:hover': { borderColor: '#2563eb', color: '#2563eb', bgcolor: '#eff6ff' },
                  }}
                >
                  <Settings size={17} />
                </IconButton>
              </Tooltip>

              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton
                  size="small"
                  sx={{
                    width: 36, height: 36,
                    bgcolor: '#ffffff', border: '1px solid #e8e8e4',
                    borderRadius: '10px', color: '#737373',
                    '&:hover': { borderColor: '#2563eb', color: '#2563eb', bgcolor: '#eff6ff' },
                  }}
                >
                  <Badge
                    badgeContent={4}
                    sx={{
                      '& .MuiBadge-badge': {
                        bgcolor: '#ef4444', color: '#fff',
                        fontSize: '0.6rem', minWidth: 16, height: 16, p: 0,
                      },
                    }}
                  >
                    <Bell size={17} />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Divider */}
              <Box sx={{ width: 1, height: 28, bgcolor: '#e8e8e4', mx: 0.5 }} />

              {/* Admin avatar */}
              <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1.25,
                cursor: 'default', py: 0.5, px: 1,
                borderRadius: '10px',
              }}>
                <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                  <Typography sx={{
                    fontWeight: 700, fontSize: '0.825rem', color: '#0a0a0a',
                    fontFamily: '"DM Sans", sans-serif', lineHeight: 1.2,
                  }}>
                    {userInfo?.name?.split(' ')[0] || 'Admin'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#2563eb', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>
                    Administrator
                  </Typography>
                </Box>
                <Avatar sx={{
                  width: 34, height: 34,
                  bgcolor: '#2563eb',
                  fontSize: '0.825rem', fontWeight: 800,
                  fontFamily: '"DM Sans", sans-serif',
                  boxShadow: '0 0 0 2px #f7f7f5, 0 0 0 3.5px #e8e8e4',
                }}>
                  {userInfo?.name?.charAt(0) || 'A'}
                </Avatar>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* ── Page Content ── */}
        <Box sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 } }}>
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="lms/*" element={<AdminLMS />} />
            <Route path="applications" element={<AdminInternships />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="activity" element={<AdminActivity />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
            <Route path="coupons" element={<AdminCoupons />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;