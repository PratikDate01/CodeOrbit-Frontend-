import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  IconButton,
  Card,
  CardContent,
  Divider,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Activity,
  Database,
  Cpu,
  Layers,
  ShieldAlert,
  Eye,
  Zap,
  TrendingUp,
  Award,
  UserCheck,
  ShieldCheck,
  Clock,
  Check,
  AlertTriangle,
  Server,
  Key,
  Filter,
  ChevronRight,
  RotateCw,
  FolderLock
} from 'lucide-react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

// --- CUSTOM SVG CHARTS FOR REACT 19 STABILITY ---

const MiniSVGLineChart = ({ data, pointsColor = "#3b82f6", gradientId = "blueGrad", label = "Value" }) => {
  if (!data || data.length === 0) return <Typography variant="caption" color="text.secondary">No trend data available</Typography>;
  
  const width = 500;
  const height = 150;
  const padding = 25;
  
  const maxVal = Math.max(...data.map(d => d.value), 5);
  const minVal = Math.min(...data.map(d => d.value), 0);
  const valRange = maxVal - minVal || 1;
  
  const xStep = (width - padding * 2) / (data.length - 1 || 1);
  const yScale = (height - padding * 2) / valRange;
  
  const points = data.map((d, index) => {
    const x = padding + index * xStep;
    const y = height - padding - (d.value - minVal) * yScale;
    return { x, y, label: d.label, value: d.value };
  });
  
  let pathD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
  }
  
  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : "";

  return (
    <Box sx={{ width: '100%', height: 180, py: 1 }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={pointsColor} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={pointsColor} stopOpacity="0.0"/>
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(148, 163, 184, 0.15)" strokeWidth="1.5" />
        
        {/* Fill Area */}
        {areaD && <path d={areaD} fill={`url(#${gradientId})`} />}
        
        {/* Path Line */}
        {pathD && <path d={pathD} fill="none" stroke={pointsColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
        
        {/* Plot points & labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4.5" fill="#ffffff" stroke={pointsColor} strokeWidth="2.5" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor">
              {p.value}
            </text>
            <text x={p.x} y={height - 8} textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.6">
              {p.label.split('-').slice(1).join('/') || p.label}
            </text>
          </g>
        ))}
      </svg>
    </Box>
  );
};

const HealthScoreGauge = ({ score, status }) => {
  const radius = 42;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = "#10b981"; // green
  if (score < 50) color = "#ef4444"; // red
  else if (score < 80) color = "#f59e0b"; // yellow
  else if (score < 90) color = "#3b82f6"; // blue

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(148, 163, 184, 0.08)" strokeWidth={strokeWidth} />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
        />
      </svg>
      <Box sx={{ position: 'absolute', textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={900} color="text.primary" sx={{ lineHeight: 1 }}>
          {score}
        </Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.6rem', letterSpacing: 0.5 }}>
          {status.toUpperCase()}
        </Typography>
      </Box>
    </Box>
  );
};

// --- MAIN OPERATIONS CENTER COMPONENT ---

const AdminSystemMonitor = () => {
  const { showNotification } = useNotification();
  
  // Tab navigation
  const [activeSection, setActiveSection] = useState('overview');
  
  // Dashboard overall health data
  const [health, setHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  
  // Database Integrity
  const [integrity, setIntegrity] = useState(null);
  const [loadingIntegrity, setLoadingIntegrity] = useState(true);
  const [healing, setHealing] = useState(false);
  
  // Error Logs Center
  const [logsData, setLogsData] = useState({ logs: [], page: 1, pages: 1, totalLogs: 0, summary: { totalErrors: 0, criticalErrors: 0, warningErrors: 0, resolvedErrors: 0 } });
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Error log filters
  const [errorFilters, setErrorFilters] = useState({
    resolvedStatus: 'unresolved',
    severity: '',
    route: '',
    user: '',
    startDate: '',
    endDate: ''
  });

  // Maintenance Settings
  const [maintenance, setMaintenance] = useState({
    maintenanceMode: false,
    allowedUsers: [],
    enabledBy: null,
    enabledAt: null,
  });
  const [loadingMaintenance, setLoadingMaintenance] = useState(true);
  const [newUser, setNewUser] = useState('');
  const [savingMaintenance, setSavingMaintenance] = useState(false);

  // Auto-refresh config
  const [autoRefresh, setAutoRefresh] = useState(true);
  const refreshIntervalRef = useRef(null);

  const fetchHealth = useCallback(async () => {
    try {
      const { data } = await API.get('/admin/system/health');
      setHealth(data);
    } catch (error) {
      console.error('Error fetching health:', error);
      showNotification('Failed to load system operations metrics', 'error');
    } finally {
      setLoadingHealth(false);
    }
  }, [showNotification]);

  const fetchIntegrity = useCallback(async () => {
    setLoadingIntegrity(true);
    try {
      const { data } = await API.get('/admin/system/integrity');
      setIntegrity(data);
    } catch (error) {
      console.error('Error fetching data integrity:', error);
      showNotification('Failed to load database integrity report', 'error');
    } finally {
      setLoadingIntegrity(false);
    }
  }, [showNotification]);

  const fetchLogs = useCallback(async (page = 1) => {
    setLoadingLogs(true);
    try {
      const { resolvedStatus, severity, route, user, startDate, endDate } = errorFilters;
      let url = `/admin/system/logs?page=${page}&limit=10&resolvedStatus=${resolvedStatus}`;
      if (severity) url += `&severity=${severity}`;
      if (route) url += `&route=${encodeURIComponent(route)}`;
      if (user) url += `&user=${encodeURIComponent(user)}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      
      const { data } = await API.get(url);
      setLogsData(data);
    } catch (error) {
      console.error('Error fetching error logs:', error);
      showNotification('Failed to filter system error logs', 'error');
    } finally {
      setLoadingLogs(false);
    }
  }, [errorFilters, showNotification]);

  const fetchMaintenance = useCallback(async () => {
    setLoadingMaintenance(true);
    try {
      const { data } = await API.get('/admin/system/maintenance');
      setMaintenance(data);
    } catch (error) {
      console.error('Error fetching maintenance settings:', error);
      showNotification('Failed to load maintenance settings', 'error');
    } finally {
      setLoadingMaintenance(false);
    }
  }, [showNotification]);

  // Handle all initial loads
  useEffect(() => {
    fetchHealth();
    fetchIntegrity();
    fetchLogs(1);
    fetchMaintenance();
  }, [fetchHealth, fetchIntegrity, fetchLogs, fetchMaintenance]);

  // Set up auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(() => {
        fetchHealth();
      }, 30000); // 30 seconds interval
    } else {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    }
    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, [autoRefresh, fetchHealth]);

  const handleApplyLogFilters = () => {
    setCurrentPage(1);
    fetchLogs(1);
  };

  const handleClearLogFilters = () => {
    setErrorFilters({
      resolvedStatus: 'unresolved',
      severity: '',
      route: '',
      user: '',
      startDate: '',
      endDate: ''
    });
    setCurrentPage(1);
    // Timeout to let state update
    setTimeout(() => {
      setLoadingLogs(true);
      API.get(`/admin/system/logs?page=1&limit=10&resolvedStatus=unresolved`).then(({ data }) => {
        setLogsData(data);
        setLoadingLogs(false);
      });
    }, 50);
  };

  const handleResolveError = async (id) => {
    try {
      await API.put(`/admin/system/logs/${id}/resolve`);
      showNotification('Error log marked as resolved', 'success');
      fetchLogs(currentPage);
      fetchHealth(); // refresh stats count
    } catch (error) {
      showNotification('Failed to resolve error log', 'error');
    }
  };

  const handleToggleMaintenance = async () => {
    const nextMode = !maintenance.maintenanceMode;
    const confirmMsg = nextMode 
      ? "Activate Maintenance Mode? All public access will be blocked immediately."
      : "Deactivate Maintenance Mode? The website will be fully public.";
      
    if (window.confirm(confirmMsg)) {
      setSavingMaintenance(true);
      try {
        const { data } = await API.put('/admin/system/maintenance', {
          maintenanceMode: nextMode,
        });
        setMaintenance(data);
        showNotification(
          `Maintenance mode is now ${nextMode ? 'Active' : 'Inactive'}.`, 
          nextMode ? 'warning' : 'success'
        );
      } catch (error) {
        showNotification('Failed to update maintenance settings', 'error');
      } finally {
        setSavingMaintenance(false);
      }
    }
  };

  const handleAddAllowedUser = async (e) => {
    e.preventDefault();
    if (!newUser.trim()) return;
    
    if (maintenance.allowedUsers.some(u => u.toLowerCase() === newUser.trim().toLowerCase())) {
      showNotification('User is already whitelisted', 'warning');
      return;
    }

    const updatedUsers = [...maintenance.allowedUsers, newUser.trim()];
    
    setSavingMaintenance(true);
    try {
      const { data } = await API.put('/admin/system/maintenance', {
        allowedUsers: updatedUsers,
      });
      setMaintenance(data);
      setNewUser('');
      showNotification('User added to whitelist successfully', 'success');
    } catch (error) {
      showNotification('Failed to add whitelisted user', 'error');
    } finally {
      setSavingMaintenance(false);
    }
  };

  const handleRemoveAllowedUser = async (userToRemove) => {
    const updatedUsers = maintenance.allowedUsers.filter(u => u !== userToRemove);
    
    setSavingMaintenance(true);
    try {
      const { data } = await API.put('/admin/system/maintenance', {
        allowedUsers: updatedUsers,
      });
      setMaintenance(data);
      showNotification('User removed from whitelist successfully', 'success');
    } catch (error) {
      showNotification('Failed to remove whitelisted user', 'error');
    } finally {
      setSavingMaintenance(false);
    }
  };

  const handleHeal = async () => {
    if (window.confirm('Trigger automatic database self-healing? This resolves orphaned enrollments and cleans broken logs.')) {
      setHealing(true);
      try {
        const { data } = await API.post('/admin/system/integrity/heal');
        if (data.success) {
          showNotification(
            `Healing complete! Resolved ${data.results.resolvedUsers} users, cleaned ${data.results.cleanedProgressRecords} progress logs, and ${data.results.cleanedCertificates} certificates.`,
            'success'
          );
          fetchIntegrity();
          fetchHealth();
        } else {
          showNotification(data.results?.errors?.join(', ') || 'Self-healing failed', 'error');
        }
      } catch (error) {
        showNotification('Error during data healing execution', 'error');
      } finally {
        setHealing(false);
      }
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 MB';
    return Number(bytes).toFixed(1) + ' MB';
  };

  const getLogSeverityColor = (severity) => {
    const colors = {
      critical: '#ef4444', // Red
      error: '#f97316',    // Orange
      warning: '#eab308'   // Yellow
    };
    return colors[severity] || '#64748b';
  };

  const getAlertStatusColor = (status) => {
    if (status === 'Healthy' || status === 'Operational' || status === 'Connected') return 'success';
    if (status === 'Warning' || status === 'Connecting') return 'warning';
    return 'error';
  };

  // Pre-aggregate payment trends for custom line chart
  const paymentChartData = health?.payments?.paymentTrends?.map(item => ({
    label: item._id,
    value: item.verified
  })) || [];

  // Pre-aggregate document trends
  const docChartData = health?.documentGeneration?.trends?.map(item => ({
    label: item._id,
    value: item.successes
  })) || [];

  const navigationItems = [
    { id: 'overview', label: 'Overview Hub', icon: <Server size={18} /> },
    { id: 'system', label: 'System & Engine', icon: <Cpu size={18} /> },
    { id: 'api', label: 'API Performance', icon: <Activity size={18} /> },
    { id: 'payments', label: 'Payment Health', icon: <TrendingUp size={18} /> },
    { id: 'lms-docs', label: 'LMS & Documents', icon: <Award size={18} /> },
    { id: 'security', label: 'Security & Logs', icon: <ShieldCheck size={18} /> },
    { id: 'errors', label: 'Error Center', icon: <ShieldAlert size={18} /> },
    { id: 'integrity', label: 'Database Integrity', icon: <Database size={18} /> },
    { id: 'maintenance', label: 'Maintenance Mode', icon: <FolderLock size={18} /> }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '90vh', bgcolor: 'rgba(248, 250, 252, 0.35)', color: 'text.primary', fontFamily: '"DM Sans", sans-serif' }}>
      
      {/* Top Header Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: '-1.5px', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Server size={32} /> CodeOrbit Operations Center
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Enterprise-grade administrative engine console & diagnostic center.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Switch 
                checked={autoRefresh} 
                onChange={(e) => setAutoRefresh(e.target.checked)} 
                color="primary"
                size="small"
              />
            }
            label={
              <Typography variant="caption" fontWeight={700} color="text.secondary">
                AUTO REFRESH (30S)
              </Typography>
            }
            sx={{ m: 0, bgcolor: 'background.paper', px: 2, py: 0.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<RotateCw size={16} />}
            onClick={() => {
              setLoadingHealth(true);
              fetchHealth();
              fetchIntegrity();
              fetchLogs(currentPage);
              fetchMaintenance();
            }}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
          >
            Refetch Metrics
          </Button>
        </Box>
      </Box>

      {/* Main Layout Grid */}
      <Grid container spacing={3}>
        
        {/* Navigation Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 4, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 24 }}>
            <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: 1, display: 'block', mb: 1, pl: 1.5 }}>
              CONSOLE INDEX
            </Typography>
            <List disablePadding>
              {navigationItems.map(item => (
                <ListItem
                  key={item.id}
                  button
                  onClick={() => setActiveSection(item.id)}
                  sx={{
                    borderRadius: 3,
                    mb: 0.5,
                    bgcolor: activeSection === item.id ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                    color: activeSection === item.id ? 'primary.main' : 'text.secondary',
                    '&:hover': {
                      bgcolor: activeSection === item.id ? 'rgba(37, 99, 235, 0.08)' : 'rgba(148, 163, 184, 0.04)',
                      color: activeSection === item.id ? 'primary.main' : 'text.primary'
                    },
                    py: 1.25,
                    px: 2
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ fontWeight: 700, fontSize: '0.875rem' }} 
                  />
                  {activeSection === item.id && <ChevronRight size={16} />}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Dynamic Detail Panel */}
        <Grid item xs={12} md={9}>
          
          {/* CRITICAL ALERTS BANNER */}
          {health && (
            <Box sx={{ mb: 3 }}>
              {health?.services?.database?.status !== 'Healthy' && (
                <Alert severity="error" icon={<AlertTriangle size={20} />} sx={{ borderRadius: 3, mb: 1.5, fontWeight: 700 }}>
                  CRITICAL: Database connection is unhealthy. MongoDB connection state is disconnected.
                </Alert>
              )}
              {health?.eventLoop?.status === 'Critical' && (
                <Alert severity="error" icon={<ShieldAlert size={20} />} sx={{ borderRadius: 3, mb: 1.5, fontWeight: 700 }}>
                  CRITICAL WARNING: Event Loop Lag is severe ({health?.eventLoop?.currentLag}ms). Process scheduler experiencing high blocking workload.
                </Alert>
              )}
              {health?.apiPerformance?.errorRate > 15 && (
                <Alert severity="warning" icon={<AlertTriangle size={20} />} sx={{ borderRadius: 3, mb: 1.5, fontWeight: 700 }}>
                  WARNING: Elevated API Error Rate ({health?.apiPerformance?.errorRate}%). Inspect logs to diagnose endpoint faults.
                </Alert>
              )}
              {integrity && !integrity.summary.isClean && (
                <Alert severity="warning" icon={<ShieldAlert size={20} />} sx={{ borderRadius: 3, mb: 1.5, fontWeight: 700 }}>
                  INTEGRITY ALERT: {integrity.summary.issuesCount} database integrity anomalies detected. Launch the self-healing routine to recover.
                </Alert>
              )}
            </Box>
          )}

          {loadingHealth ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
              <CircularProgress thickness={5} size={50} />
            </Box>
          ) : (
            <Box>
              
              {/* TAB 1: OVERVIEW HUB */}
              {activeSection === 'overview' && (
                <Box>
                  {/* Health Score Summary Row */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={4}>
                      <Card sx={{ borderRadius: 4, height: '100%', display: 'flex', alignItems: 'center', p: 1, border: '1px solid', borderColor: 'divider' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%' }}>
                          <HealthScoreGauge score={health?.healthScore?.score || 100} status={health?.healthScore?.status || "Excellent"} />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={800} color="text.secondary">
                              SYSTEM HEALTH
                            </Typography>
                            <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                              Operations Score
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Weighted engine stability index
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider' }}>
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight={800} color="text.secondary">
                              API THROUGHPUT
                            </Typography>
                            <Activity size={18} color="#2563eb" />
                          </Box>
                          <Typography variant="h3" fontWeight={900}>{health?.apiPerformance?.totalRequestsToday}</Typography>
                          <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mt: 1 }}>
                            Hits Today • {health?.apiPerformance?.successRate}% Success Rate
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider' }}>
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight={800} color="text.secondary">
                              INTEGRATION STATUS
                            </Typography>
                            <Layers size={18} color="#16a34a" />
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" fontWeight={700}>MongoDB</Typography>
                              <Chip label={health?.services?.database?.status} color={getAlertStatusColor(health?.services?.database?.status)} size="small" sx={{ fontSize: '0.65rem', height: 16 }} />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" fontWeight={700}>Razorpay</Typography>
                              <Chip label={health?.services?.razorpay?.status} color={health?.services?.razorpay?.status === 'Configured' ? 'success' : 'default'} size="small" sx={{ fontSize: '0.65rem', height: 16 }} />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" fontWeight={700}>Cloudinary</Typography>
                              <Chip label={health?.services?.cloudinary?.status} color={health?.services?.cloudinary?.status === 'Configured' ? 'success' : 'default'} size="small" sx={{ fontSize: '0.65rem', height: 16 }} />
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Core Services Summary Row */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">DATABASE LATENCY</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ my: 1, letterSpacing: '-1px' }}>{health?.services?.database?.ping}ms</Typography>
                        <Chip label="Ping Status" color="success" size="small" sx={{ fontSize: '0.65rem', height: 16 }} />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">EVENT LOOP LAG</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ my: 1, letterSpacing: '-1px' }}>{health?.eventLoop?.currentLag}ms</Typography>
                        <Chip label={health?.eventLoop?.status} color={getAlertStatusColor(health?.eventLoop?.status)} size="small" sx={{ fontSize: '0.65rem', height: 16 }} />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">PAYMENT REVENUE</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ my: 1, letterSpacing: '-1px' }}>{health?.payments?.paymentsToday}</Typography>
                        <Typography variant="caption" fontWeight={700} color="text.secondary">Transacted Today</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">ACTIVE STUDENTS</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ my: 1, letterSpacing: '-1px' }}>{health?.lms?.activeStudents}</Typography>
                        <Typography variant="caption" fontWeight={700} color="text.secondary">LMS Learners</Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Activity Feeds Split */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                      <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Activity size={16} /> RECENT ENGINE ACTIVITY FEED
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 400, overflowY: 'auto' }}>
                          {health?.userActivity?.recentActivityFeed?.map((item, idx) => (
                            <Box key={item.id || idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <Box sx={{ p: 1, borderRadius: 2.5, bgcolor: item.type === 'admin_action' ? 'primary.light' : item.type === 'security' ? 'error.light' : 'success.light', color: item.type === 'admin_action' ? 'primary.main' : item.type === 'security' ? 'error.main' : 'success.main', display: 'flex' }}>
                                {item.type === 'admin_action' ? <Key size={14} /> : item.type === 'security' ? <ShieldAlert size={14} /> : <UserCheck size={14} />}
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={700}>
                                  {item.user?.name || item.user?.email || 'System'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                  {item.message}
                                </Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(item.timestamp).toLocaleTimeString()}
                              </Typography>
                            </Box>
                          ))}
                          {(!health?.userActivity?.recentActivityFeed || health.userActivity.recentActivityFeed.length === 0) && (
                            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center', fontStyle: 'italic' }}>
                              No activity logged in the last 24 hours.
                            </Typography>
                          )}
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ mb: 2 }}>
                          ENGINE METADATA
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Environment</Typography>
                            <Typography variant="body2" fontWeight={700}>{health?.deployment?.environment}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Uptime</Typography>
                            <Typography variant="body2" fontWeight={700}>{(health?.uptime / 3600).toFixed(2)} Hrs</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Git Commit</Typography>
                            <Typography variant="body2" fontWeight={700} sx={{ fontFamily: 'monospace' }}>{health?.deployment?.gitCommit}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">DNS resolution</Typography>
                            <Chip label={health?.dns?.status} color={getAlertStatusColor(health?.dns?.status)} size="small" />
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* TAB 2: SYSTEM & ENGINE */}
              {activeSection === 'system' && (
                <Box>
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Cpu size={16} /> NODE PROCESS MEMORY BREAKDOWN
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" fontWeight={700}>Heap Usage Ratio</Typography>
                              <Typography variant="body2" fontWeight={800}>{health?.system?.nodeMemory?.heapUsagePercentage}%</Typography>
                            </Box>
                            <Box sx={{ height: 6, bgcolor: 'rgba(148, 163, 184, 0.1)', borderRadius: 3, overflow: 'hidden' }}>
                              <Box sx={{ height: '100%', width: `${health?.system?.nodeMemory?.heapUsagePercentage}%`, bgcolor: 'primary.main', borderRadius: 3 }} />
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">RSS Memory</Typography>
                            <Typography variant="body2" fontWeight={700}>{formatBytes(health?.system?.nodeMemory?.rss)}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">Heap Used</Typography>
                            <Typography variant="body2" fontWeight={700}>{formatBytes(health?.system?.nodeMemory?.heapUsed)}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">Heap Total</Typography>
                            <Typography variant="body2" fontWeight={700}>{formatBytes(health?.system?.nodeMemory?.heapTotal)}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">External Memory</Typography>
                            <Typography variant="body2" fontWeight={700}>{formatBytes(health?.system?.nodeMemory?.external)}</Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            Last updated: {new Date(health?.system?.nodeMemory?.lastUpdated).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Clock size={16} /> EVENT LOOP PERFORMANCE
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Current Lag</Typography>
                            <Typography variant="h5" fontWeight={800} color={health?.eventLoop?.status === 'Healthy' ? 'success.main' : 'warning.main'}>
                              {health?.eventLoop?.currentLag}ms
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Average Lag</Typography>
                            <Typography variant="h6" fontWeight={700}>{health?.eventLoop?.averageLag}ms</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Peak Lag Recorded</Typography>
                            <Typography variant="h6" fontWeight={700}>{health?.eventLoop?.peakLag}ms</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Status Badge</Typography>
                            <Chip label={health?.eventLoop?.status} color={getAlertStatusColor(health?.eventLoop?.status)} />
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, mt: 1 }}>
                            Lag indicates the delay in scheduling execution tasks. A lower lag ensures smooth operations and faster backend response times.
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ mb: 2 }}>
                      SYSTEM INFO
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">OS PLATFORM</Typography>
                        <Typography variant="body1" fontWeight={700}>{health?.system?.platform}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">RELEASE VERSION</Typography>
                        <Typography variant="body1" fontWeight={700}>{health?.system?.release}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">UPTIME (HOURS)</Typography>
                        <Typography variant="body1" fontWeight={700}>{(health?.uptime / 3600).toFixed(2)} hrs</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">CPU LOAD AVERAGES</Typography>
                        <Typography variant="body1" fontWeight={700}>{health?.system?.cpuLoad?.map(v => v.toFixed(2)).join(', ')}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              )}

              {/* TAB 3: API PERFORMANCE */}
              {activeSection === 'api' && (
                <Box>
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">TOTAL REQUESTS</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ my: 1 }}>{health?.apiPerformance?.totalRequestsToday}</Typography>
                        <Typography variant="caption" color="text.secondary">Last 24 Hours</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">SUCCESS RATE</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ my: 1 }} color="success.main">{health?.apiPerformance?.successRate}%</Typography>
                        <Typography variant="caption" color="text.secondary">{health?.apiPerformance?.successfulRequestsToday} successful hits</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">ERROR RATE</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ my: 1 }} color={health?.apiPerformance?.errorRate > 5 ? 'error.main' : 'text.primary'}>{health?.apiPerformance?.errorRate}%</Typography>
                        <Typography variant="caption" color="text.secondary">{health?.apiPerformance?.failedRequestsToday} failed hits</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">AVG RESPONSE TIME</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ my: 1 }}>{health?.apiPerformance?.avgResponseTime}ms</Typography>
                        <Typography variant="caption" color="text.secondary">Process execution latency</Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'error.light', color: 'error.main' }}>
                          <Clock size={24} />
                        </Box>
                        <Box>
                          <Typography variant="caption" fontWeight={800} color="text.secondary">SLOWEST ENDPOINT TODAY</Typography>
                          <Typography variant="body1" fontWeight={700} sx={{ wordBreak: 'break-all', fontSize: '0.9rem' }}>
                            {health?.apiPerformance?.slowestEndpoint}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'success.light', color: 'success.main' }}>
                          <Zap size={24} />
                        </Box>
                        <Box>
                          <Typography variant="caption" fontWeight={800} color="text.secondary">FASTEST ENDPOINT TODAY</Typography>
                          <Typography variant="body1" fontWeight={700} sx={{ wordBreak: 'break-all', fontSize: '0.9rem' }}>
                            {health?.apiPerformance?.fastestEndpoint}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>

                  <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="subtitle2" fontWeight={800} color="text.secondary">
                        ROUTE HIT ANALYSIS (TOP ENDPOINTS TODAY)
                      </Typography>
                    </Box>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: 'rgba(148, 163, 184, 0.05)' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 800 }}>Method</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Route Path</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Hits Today</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Avg Response Time</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Errors logged</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {health?.apiPerformance?.topEndpoints?.map((route, i) => (
                          <TableRow key={i} hover>
                            <TableCell>
                              <Chip
                                label={route.method}
                                size="small"
                                color={route.method === 'POST' ? 'success' : route.method === 'GET' ? 'primary' : 'warning'}
                                sx={{ fontWeight: 900, fontSize: '0.65rem', height: 18 }}
                              />
                            </TableCell>
                            <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{route.route}</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>{route.hits}</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>{route.avgResponseTime} ms</TableCell>
                            <TableCell>
                              {route.errors > 0 ? (
                                <Chip label={`${route.errors} errors`} color="error" size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', height: 16 }} />
                              ) : (
                                <Chip label="0 errors" color="success" size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', height: 16 }} />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        {(!health?.apiPerformance?.topEndpoints || health.apiPerformance.topEndpoints.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                              <Typography color="text.secondary">No routes recorded today.</Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* TAB 4: PAYMENTS HEALTH */}
              {activeSection === 'payments' && (
                <Box>
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">PAYMENTS TODAY</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ my: 1 }}>{health?.payments?.paymentsToday}</Typography>
                        <Typography variant="caption" color="text.secondary">Total creation requests</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">VERIFIED CAPTURES</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ my: 1 }} color="success.main">{health?.payments?.verifiedPaymentsToday}</Typography>
                        <Typography variant="caption" color="text.secondary">Confirmed sales</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">PENDING CREATIONS</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ my: 1 }} color="warning.main">{health?.payments?.pendingPaymentsToday}</Typography>
                        <Typography variant="caption" color="text.secondary">Abandoned checkout</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">FUNNEL CONVERSION</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ my: 1 }} color="primary.main">{health?.payments?.paymentSuccessRate}%</Typography>
                        <Typography variant="caption" color="text.secondary">Captured vs Created ratio</Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={7}>
                      <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ mb: 2 }}>
                          PAYMENT TRENDS (LAST 7 DAYS CONVERSIONS)
                        </Typography>
                        <MiniSVGLineChart data={paymentChartData} pointsColor="#10b981" gradientId="greenGrad" />
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ mb: 2 }}>
                          RAZORPAY SERVICE FAILURES
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="body2" fontWeight={700}>Verification Signature Failures</Typography>
                              <Typography variant="caption" color="text.secondary">Failed manual signature checks</Typography>
                            </Box>
                            <Chip
                              label={health?.payments?.failures?.razorpayFailuresToday || 0}
                              color={health?.payments?.failures?.razorpayFailuresToday > 0 ? 'error' : 'default'}
                              sx={{ fontWeight: 900 }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="body2" fontWeight={700}>Webhook Verification Failures</Typography>
                              <Typography variant="caption" color="text.secondary">Incorrect webhook security payloads</Typography>
                            </Box>
                            <Chip
                              label={health?.payments?.failures?.webhookFailuresToday || 0}
                              color={health?.payments?.failures?.webhookFailuresToday > 0 ? 'error' : 'default'}
                              sx={{ fontWeight: 900 }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="body2" fontWeight={700}>Duplicate Payment Attempts</Typography>
                              <Typography variant="caption" color="text.secondary">Blocked repeat order triggers</Typography>
                            </Box>
                            <Chip
                              label={health?.payments?.failures?.duplicateAttemptsToday || 0}
                              color={health?.payments?.failures?.duplicateAttemptsToday > 0 ? 'warning' : 'default'}
                              sx={{ fontWeight: 900 }}
                            />
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* TAB 5: LMS & DOCUMENTS */}
              {activeSection === 'lms-docs' && (
                <Box>
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ mb: 2 }}>
                          LMS METRICS
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Active Enrollments</Typography>
                            <Typography variant="body2" fontWeight={700}>{health?.lms?.activeEnrollments}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Completed Programs</Typography>
                            <Typography variant="body2" fontWeight={700}>{health?.lms?.completedPrograms}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">LMS Certificates Issued</Typography>
                            <Typography variant="body2" fontWeight={700}>{health?.lms?.certificatesIssued}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Assignment Submissions</Typography>
                            <Typography variant="body2" fontWeight={700}>{health?.lms?.assignmentSubmissions}</Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ mb: 2 }}>
                          DOCUMENT QUANTITY
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Offer Letters</Typography>
                            <Typography variant="body2" fontWeight={700}>{health?.documentGeneration?.offerLettersGen}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">LOCs</Typography>
                            <Typography variant="body2" fontWeight={700}>{health?.documentGeneration?.locGen}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Internship Details</Typography>
                            <Typography variant="body2" fontWeight={700}>{health?.documentGeneration?.internshipDetailsGen}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Attendance Records</Typography>
                            <Typography variant="body2" fontWeight={700}>{health?.documentGeneration?.attendanceGen}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Payment Receipts</Typography>
                            <Typography variant="body2" fontWeight={700}>{health?.documentGeneration?.paymentReceiptsGen}</Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ mb: 2 }}>
                          GENERATION ENGINE HEALTH
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Generation Success Rate</Typography>
                            <Typography variant="body1" fontWeight={800} color="success.main">{health?.documentGeneration?.successRate}%</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Failed Generations</Typography>
                            <Typography variant="body1" fontWeight={700} color={health?.documentGeneration?.failedCount > 0 ? 'error.main' : 'text.primary'}>
                              {health?.documentGeneration?.failedCount}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Avg Generation Speed</Typography>
                            <Typography variant="body1" fontWeight={700}>{(health?.documentGeneration?.avgTime / 1000).toFixed(2)}s</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Longest PDF Generation</Typography>
                            <Typography variant="body1" fontWeight={700}>{(health?.documentGeneration?.longestTime / 1000).toFixed(2)}s</Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ mb: 2 }}>
                      DOCUMENT GENERATION ENGINE TRENDS (SUCCESSFUL GENERATIONS)
                    </Typography>
                    <MiniSVGLineChart data={docChartData} pointsColor="#2563eb" gradientId="blueGrad" />
                  </Paper>
                </Box>
              )}

              {/* TAB 6: SECURITY & LOGS */}
              {activeSection === 'security' && (
                <Box>
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">FAILED LOGINS</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ my: 1 }} color={health?.security?.failedLogins > 0 ? 'error.main' : 'text.primary'}>{health?.security?.failedLogins}</Typography>
                        <Typography variant="caption" color="text.secondary">Blocked auth attempts</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">UNAUTHORIZED ACCESS</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ my: 1 }} color={health?.security?.unauthorizedAccesses > 0 ? 'error.main' : 'text.primary'}>{health?.security?.unauthorizedAccesses}</Typography>
                        <Typography variant="caption" color="text.secondary">Access Denied attempts</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">INVALID JWT TOKENS</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ my: 1 }} color={health?.security?.invalidJWTs > 0 ? 'warning.main' : 'text.primary'}>{health?.security?.invalidJWTs}</Typography>
                        <Typography variant="caption" color="text.secondary">Expired or modified key scans</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">SUSPICIOUS REQUESTS</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ my: 1 }} color={health?.security?.suspiciousRequests > 0 ? 'error.main' : 'text.primary'}>{health?.security?.suspiciousRequests}</Typography>
                        <Typography variant="caption" color="text.secondary">Rate-limits and duplicate blocks</Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="subtitle2" fontWeight={800} color="text.secondary">
                        SECURITY THREAT EVENT FEED
                      </Typography>
                    </Box>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: 'rgba(148, 163, 184, 0.05)' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 800 }}>Timestamp</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Event Type</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Action Description</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Client IP Address</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {health?.security?.events?.map((event) => (
                          <TableRow key={event._id} hover>
                            <TableCell sx={{ fontSize: '0.8rem' }}>{new Date(event.timestamp).toLocaleString()}</TableCell>
                            <TableCell>
                              <Chip
                                label={event.eventType}
                                size="small"
                                color={event.eventType === 'failed_login' ? 'error' : event.eventType === 'unauthorized_access' ? 'warning' : 'default'}
                                sx={{ fontWeight: 900, fontSize: '0.65rem', height: 18 }}
                              />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.825rem' }}>{event.action}</TableCell>
                            <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{event.ipAddress || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                        {(!health?.security?.events || health.security.events.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                              <Typography color="text.secondary">No security threats captured in active window.</Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* TAB 7: ERROR CENTER */}
              {activeSection === 'errors' && (
                <Box>
                  {/* Summary Cards */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, borderRadius: 4, border: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="caption" fontWeight={800} color="text.secondary">TOTAL ERRORS</Typography>
                          <Typography variant="h5" fontWeight={900} sx={{ mt: 0.5 }}>{logsData?.summary?.totalErrors || 0}</Typography>
                        </Box>
                        <Chip label="All History" size="small" />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, borderRadius: 4, border: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="caption" fontWeight={800} color="text.secondary">CRITICAL ERRORS</Typography>
                          <Typography variant="h5" fontWeight={900} sx={{ mt: 0.5 }} color="error.main">{logsData?.summary?.criticalErrors || 0}</Typography>
                        </Box>
                        <Chip label="500 Errors" color="error" size="small" />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, borderRadius: 4, border: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="caption" fontWeight={800} color="text.secondary">WARNINGS</Typography>
                          <Typography variant="h5" fontWeight={900} sx={{ mt: 0.5 }} color="warning.main">{logsData?.summary?.warningErrors || 0}</Typography>
                        </Box>
                        <Chip label="400 Errors" color="warning" size="small" />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, borderRadius: 4, border: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="caption" fontWeight={800} color="text.secondary">RESOLVED</Typography>
                          <Typography variant="h5" fontWeight={900} sx={{ mt: 0.5 }} color="success.main">{logsData?.summary?.resolvedErrors || 0}</Typography>
                        </Box>
                        <Chip label="Dismissed" color="success" size="small" />
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Filters Console */}
                  <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Filter size={16} /> LOGS SEARCH & DYNAMIC FILTERING
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4} md={2}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={errorFilters.resolvedStatus}
                            label="Status"
                            onChange={(e) => setErrorFilters(prev => ({ ...prev, resolvedStatus: e.target.value }))}
                          >
                            <MenuItem value="unresolved">Unresolved Only</MenuItem>
                            <MenuItem value="resolved">Resolved Only</MenuItem>
                            <MenuItem value="all">All Logs</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4} md={2}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Severity</InputLabel>
                          <Select
                            value={errorFilters.severity}
                            label="Severity"
                            onChange={(e) => setErrorFilters(prev => ({ ...prev, severity: e.target.value }))}
                          >
                            <MenuItem value="">Any Severity</MenuItem>
                            <MenuItem value="critical">Critical (500+)</MenuItem>
                            <MenuItem value="warning">Warning (400-499)</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4} md={2.5}>
                        <TextField
                          fullWidth
                          label="Route Path"
                          size="small"
                          placeholder="e.g. /api/auth"
                          value={errorFilters.route}
                          onChange={(e) => setErrorFilters(prev => ({ ...prev, route: e.target.value }))}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.5}>
                        <TextField
                          fullWidth
                          label="User (Email/Name)"
                          size="small"
                          value={errorFilters.user}
                          onChange={(e) => setErrorFilters(prev => ({ ...prev, user: e.target.value }))}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <TextField
                            type="date"
                            label="From"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            value={errorFilters.startDate}
                            onChange={(e) => setErrorFilters(prev => ({ ...prev, startDate: e.target.value }))}
                          />
                          <TextField
                            type="date"
                            label="To"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            value={errorFilters.endDate}
                            onChange={(e) => setErrorFilters(prev => ({ ...prev, endDate: e.target.value }))}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2 }}>
                      <Button variant="outlined" size="small" onClick={handleClearLogFilters} sx={{ borderRadius: 1.5 }}>
                        Reset
                      </Button>
                      <Button variant="contained" size="small" onClick={handleApplyLogFilters} sx={{ borderRadius: 1.5 }}>
                        Apply Search
                      </Button>
                    </Box>
                  </Paper>

                  {/* Logs Table */}
                  <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                    {loadingLogs ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                    ) : (
                      <Box>
                        <Table size="small">
                          <TableHead sx={{ bgcolor: 'rgba(148, 163, 184, 0.05)' }}>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 800 }}>Timestamp</TableCell>
                              <TableCell sx={{ fontWeight: 800 }}>Severity</TableCell>
                              <TableCell sx={{ fontWeight: 800 }}>Method</TableCell>
                              <TableCell sx={{ fontWeight: 800 }}>Route Path</TableCell>
                              <TableCell sx={{ fontWeight: 800 }}>Message</TableCell>
                              <TableCell sx={{ fontWeight: 800 }}>User Context</TableCell>
                              <TableCell sx={{ fontWeight: 800 }} align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {logsData.logs.map((log) => (
                              <TableRow key={log._id} hover>
                                <TableCell sx={{ fontSize: '0.8rem' }}>{new Date(log.createdAt).toLocaleString()}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={log.severity || 'error'}
                                    size="small"
                                    sx={{
                                      fontWeight: 900,
                                      fontSize: '0.6rem',
                                      height: 18,
                                      color: '#ffffff',
                                      bgcolor: getLogSeverityColor(log.severity || 'error')
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Chip label={log.method} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', height: 18 }} />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', fontFamily: 'monospace' }}>{log.path}</TableCell>
                                <TableCell sx={{ color: 'error.main', fontSize: '0.8rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {log.message}
                                </TableCell>
                                <TableCell sx={{ fontSize: '0.8rem' }}>
                                  {log.user ? (
                                    <Box>
                                      <Typography variant="caption" fontWeight={700} sx={{ display: 'block' }}>{log.user.name}</Typography>
                                      <Typography variant="caption" color="text.secondary">{log.user.email}</Typography>
                                    </Box>
                                  ) : (
                                    <Typography variant="caption" color="text.secondary">Guest Session</Typography>
                                  )}
                                </TableCell>
                                <TableCell align="right">
                                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                    <IconButton size="small" onClick={() => setSelectedLog(log)} color="primary">
                                      <Eye size={16} />
                                    </IconButton>
                                    {!log.resolved && (
                                      <IconButton size="small" onClick={() => handleResolveError(log._id)} color="success" title="Mark as resolved">
                                        <Check size={16} />
                                      </IconButton>
                                    )}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                            {logsData.logs.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                  <Typography color="text.secondary">No error logs match the search filters.</Typography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                        
                        {logsData.pages > 1 && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                            <Pagination
                              count={logsData.pages}
                              page={currentPage}
                              onChange={(e, val) => {
                                setCurrentPage(val);
                                fetchLogs(val);
                              }}
                              color="primary"
                              size="small"
                            />
                          </Box>
                        )}
                      </Box>
                    )}
                  </TableContainer>
                </Box>
              )}

              {/* TAB 8: DATABASE INTEGRITY */}
              {activeSection === 'integrity' && (
                <Box>
                  <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Database size={16} /> DATA INTEGRITY SUMMARY REPORT
                    </Typography>
                    
                    {loadingIntegrity ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                    ) : integrity ? (
                      <Box>
                        {integrity.summary.isClean ? (
                          <Alert severity="success" sx={{ borderRadius: 3, mb: 3, fontWeight: 700 }}>
                            Perfect Database State! No integrity defects detected.
                          </Alert>
                        ) : (
                          <Alert severity="warning" sx={{ borderRadius: 3, mb: 3, fontWeight: 700 }}>
                            Data integrity checks identified {integrity.summary.issuesCount} anomalies.
                          </Alert>
                        )}

                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid item xs={6} sm={4} md={2}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(148, 163, 184, 0.04)', borderRadius: 3, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="h5" fontWeight={900} color={integrity.summary.orphanUsersCount > 0 ? 'warning.main' : 'text.primary'}>
                                {integrity.summary.orphanUsersCount}
                              </Typography>
                              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.65rem' }}>Orphan Users</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={4} md={2}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(148, 163, 184, 0.04)', borderRadius: 3, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="h5" fontWeight={900} color={integrity.summary.orphanApplicationsCount > 0 ? 'error.main' : 'text.primary'}>
                                {integrity.summary.orphanApplicationsCount}
                              </Typography>
                              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.65rem' }}>Orphan Apps</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={4} md={2}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(148, 163, 184, 0.04)', borderRadius: 3, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="h5" fontWeight={900} color={integrity.summary.orphanEnrollmentsCount > 0 ? 'error.main' : 'text.primary'}>
                                {integrity.summary.orphanEnrollmentsCount}
                              </Typography>
                              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.65rem' }}>Orphan Enrollments</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={4} md={2}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(148, 163, 184, 0.04)', borderRadius: 3, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="h5" fontWeight={900} color={integrity.summary.duplicateEnrollmentsCount > 0 ? 'warning.main' : 'text.primary'}>
                                {integrity.summary.duplicateEnrollmentsCount}
                              </Typography>
                              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.65rem' }}>Duplicates</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={4} md={2}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(148, 163, 184, 0.04)', borderRadius: 3, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="h5" fontWeight={900} color={integrity.summary.orphanProgressCount > 0 ? 'error.main' : 'text.primary'}>
                                {integrity.summary.orphanProgressCount}
                              </Typography>
                              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.65rem' }}>Orphan Progress</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={4} md={2}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(148, 163, 184, 0.04)', borderRadius: 3, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="h5" fontWeight={900} color={integrity.summary.orphanCertificatesCount > 0 ? 'error.main' : 'text.primary'}>
                                {integrity.summary.orphanCertificatesCount}
                              </Typography>
                              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.65rem' }}>Orphan Certs</Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        {!integrity.summary.isClean && (
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
                            <Button
                              variant="contained"
                              color="warning"
                              onClick={handleHeal}
                              disabled={healing}
                              sx={{ borderRadius: 2, fontWeight: 700 }}
                            >
                              {healing ? <CircularProgress size={18} color="inherit" /> : 'Run Database Integrity Self-Heal'}
                            </Button>
                          </Box>
                        )}
                        
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                          HISTORICAL INTEGRITY RUNS
                        </Typography>
                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                          <Table size="small">
                            <TableHead sx={{ bgcolor: 'rgba(148, 163, 184, 0.03)' }}>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 800 }}>Audit Date</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Result</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Total Faults</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Anomalies Summary Breakdown</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {integrity?.auditHistory?.map((audit, idx) => (
                                <TableRow key={audit._id || idx} hover>
                                  <TableCell sx={{ fontSize: '0.8rem' }}>{new Date(audit.timestamp).toLocaleString()}</TableCell>
                                  <TableCell>
                                    <Chip 
                                      label={audit.result} 
                                      color={audit.result === 'clean' ? 'success' : 'warning'} 
                                      size="small" 
                                      sx={{ fontWeight: 800, fontSize: '0.65rem', height: 18 }} 
                                    />
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 700 }}>{audit.issuesFound}</TableCell>
                                  <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                    {JSON.stringify(audit.details)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    ) : (
                      <Typography color="error">Integrity checker unavailable</Typography>
                    )}
                  </Paper>
                </Box>
              )}

              {/* TAB 9: MAINTENANCE MODE */}
              {activeSection === 'maintenance' && (
                <Box>
                  <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <ShieldAlert color="#ef4444" size={18} /> WEBSITE SYSTEM MAINTENANCE CONTROLS
                    </Typography>
                    
                    {loadingMaintenance ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                    ) : (
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: 3 }}>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Chip 
                                  label={maintenance.maintenanceMode ? "ACTIVE" : "INACTIVE"} 
                                  color={maintenance.maintenanceMode ? "error" : "default"}
                                  sx={{ fontWeight: 900 }}
                                />
                                {maintenance.maintenanceMode && (
                                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                                    Active since: {new Date(maintenance.enabledAt).toLocaleString()}
                                  </Typography>
                                )}
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                Activating maintenance mode triggers a HTTP 503 response for all clients. Only authorized test users in the whitelist below and admin roles will bypass the restriction block. Use this to patch upgrades or heal the database.
                              </Typography>
                            </Box>
                            
                            <Button
                              variant="contained"
                              color={maintenance.maintenanceMode ? "success" : "error"}
                              onClick={handleToggleMaintenance}
                              disabled={savingMaintenance}
                              sx={{
                                borderRadius: 2.5,
                                py: 1.5,
                                fontWeight: 800,
                                boxShadow: maintenance.maintenanceMode ? '0 4px 12px rgba(34, 197, 94, 0.2)' : '0 4px 12px rgba(239, 68, 68, 0.2)'
                              }}
                            >
                              {savingMaintenance ? (
                                <CircularProgress size={20} color="inherit" />
                              ) : maintenance.maintenanceMode ? (
                                "DEACTIVATE MAINTENANCE MODE"
                              ) : (
                                "ACTIVATE MAINTENANCE MODE"
                              )}
                            </Button>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Box sx={{ borderLeft: { md: '1px solid' }, borderColor: 'divider', pl: { md: 4 } }}>
                            <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
                              Whitelisted Client IPs / Email IDs
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                              Administrators automatically bypass block filters. Add test users here.
                            </Typography>
                            
                            <Box component="form" onSubmit={handleAddAllowedUser} sx={{ display: 'flex', gap: 1, mb: 3 }}>
                              <TextField
                                size="small"
                                fullWidth
                                label="Email / ID"
                                value={newUser}
                                onChange={(e) => setNewUser(e.target.value)}
                                placeholder="testuser@codeorbit.in"
                              />
                              <Button
                                type="submit"
                                variant="contained"
                                disabled={savingMaintenance || !newUser.trim()}
                                sx={{ px: 3, fontWeight: 700, borderRadius: 2 }}
                              >
                                Add
                              </Button>
                            </Box>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {maintenance.allowedUsers.map((user) => (
                                <Chip
                                  key={user}
                                  label={user}
                                  onDelete={() => handleRemoveAllowedUser(user)}
                                  disabled={savingMaintenance}
                                  sx={{ fontWeight: 700, borderRadius: 2 }}
                                />
                              ))}
                              {maintenance.allowedUsers.length === 0 && (
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                  Whitelist is empty. Only system administrators bypass filter block.
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    )}
                  </Paper>
                </Box>
              )}

            </Box>
          )}

        </Grid>
      </Grid>

      {/* EXPANDABLE LOG DETAIL DIALOG */}
      <Dialog
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        closeAfterTransition={false}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
          <ShieldAlert size={22} /> Production Error Details & Diagnostics
        </DialogTitle>
        <DialogContent dividers>
          {selectedLog && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={800} color="text.secondary">MESSAGE</Typography>
                <Typography variant="body1" fontWeight={700} color="error.main">
                  {selectedLog.message}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={4}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>PATH</Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                    {selectedLog.method} {selectedLog.path}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>IP ADDRESS</Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                    {selectedLog.ip || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>TIMESTAMP</Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {new Date(selectedLog.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>

              <Box>
                <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ mb: 1 }}>REQUEST METADATA</Typography>
                <Paper sx={{ p: 2, bgcolor: 'rgba(148, 163, 184, 0.05)', border: '1px solid', borderColor: 'divider', borderRadius: 3, maxHeight: 150, overflow: 'auto' }}>
                  <pre style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'Courier New, monospace' }}>
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </Paper>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ mb: 1 }}>STACK TRACE</Typography>
                <Paper sx={{ p: 2, bgcolor: '#0f172a', color: '#f8fafc', borderRadius: 3, maxHeight: 250, overflow: 'auto' }}>
                  <pre style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'Courier New, monospace', whiteSpace: 'pre-wrap' }}>
                    {selectedLog.stack || 'No stack trace recorded.'}
                  </pre>
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setSelectedLog(null)} variant="outlined" sx={{ borderRadius: 2, fontWeight: 700 }}>
            Dismiss Detail
          </Button>
          {selectedLog && !selectedLog.resolved && (
            <Button
              variant="contained"
              color="success"
              startIcon={<Check size={16} />}
              onClick={() => {
                handleResolveError(selectedLog._id);
                setSelectedLog(null);
              }}
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              Resolve Error
            </Button>
          )}
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AdminSystemMonitor;
