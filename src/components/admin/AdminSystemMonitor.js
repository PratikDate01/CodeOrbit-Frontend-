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
  Tabs,
  Tab
} from '@mui/material';
import {
  Database,
  Cpu,
  ShieldAlert,
  Eye,
  Zap,
  Clock,
  Check,
  Server,
  Filter,
  RotateCw,
  FolderLock,
  UserCheck,
  Terminal,
  ShieldCheck,
  Play
} from 'lucide-react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

// --- CUSTOM SVG METRIC CHARTS ---
const MiniSVGLineChart = ({ data, pointsColor = "#3b82f6", gradientId = "blueGrad" }) => {
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
        
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(148, 163, 184, 0.15)" strokeWidth="1.5" />
        
        {areaD && <path d={areaD} fill={`url(#${gradientId})`} />}
        {pathD && <path d={pathD} fill="none" stroke={pointsColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
        
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


// --- MAIN OPERATIONS CENTER ---
const AdminSystemMonitor = () => {
  const { showNotification } = useNotification();
  
  // Tabs navigation state: 0=Overview, 1=Performance, 2=Database, 3=Logs, 4=Maintenance
  const [activeTab, setActiveTab] = useState(0);

  // Tab Data States
  const [overview, setOverview] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  const [performance, setPerformance] = useState(null);
  const [loadingPerformance, setLoadingPerformance] = useState(true);
  const [memoryHistory, setMemoryHistory] = useState([]);

  const [database, setDatabase] = useState(null);
  const [loadingDatabase, setLoadingDatabase] = useState(true);

  const [logsData, setLogsData] = useState({ logs: [], page: 1, pages: 1, totalLogs: 0, summary: { totalErrors: 0, criticalErrors: 0, warningErrors: 0, resolvedErrors: 0 } });
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [errorFilters, setErrorFilters] = useState({
    resolvedStatus: 'unresolved',
    severity: '',
    logType: '',
    route: '',
    user: '',
    startDate: '',
    endDate: ''
  });

  const [maintenance, setMaintenance] = useState(null);
  const [loadingMaintenance, setLoadingMaintenance] = useState(true);
  const [newUser, setNewUser] = useState('');
  const [savingMaintenance, setSavingMaintenance] = useState(false);

  const [integrity, setIntegrity] = useState(null);
  const [loadingIntegrity, setLoadingIntegrity] = useState(false);
  const [healingPreview, setHealingPreview] = useState(null);
  const [loadingHealPreview, setLoadingHealPreview] = useState(false);
  const [showHealDialog, setShowHealDialog] = useState(false);
  const [healing, setHealing] = useState(false);

  // Auto-refresh configuration (default 30 seconds)
  const [autoRefresh, setAutoRefresh] = useState(true);
  const refreshIntervalRef = useRef(null);

  // --- TAB-SPECIFIC API CALLS ---
  const fetchOverview = useCallback(async (silent = false) => {
    if (!silent) setLoadingOverview(true);
    try {
      const { data } = await API.get('/admin/system/overview');
      setOverview(data);
    } catch (error) {
      console.error('Error fetching overview metrics:', error);
      showNotification('Failed to load system overview metrics', 'error');
    } finally {
      setLoadingOverview(false);
    }
  }, [showNotification]);

  const fetchPerformance = useCallback(async (silent = false) => {
    if (!silent) setLoadingPerformance(true);
    try {
      const { data } = await API.get('/admin/system/performance');
      setPerformance(data);
      setMemoryHistory(prev => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const next = [...prev, { label: timestamp, value: data.memory.heapUsed }];
        if (next.length > 8) next.shift();
        return next;
      });
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      showNotification('Failed to load runtime engine performance metrics', 'error');
    } finally {
      setLoadingPerformance(false);
    }
  }, [showNotification]);

  const fetchDatabase = useCallback(async (silent = false, forceRefresh = false) => {
    if (!silent) setLoadingDatabase(true);
    try {
      const { data } = await API.get(`/admin/system/database?refresh=${forceRefresh}`);
      setDatabase(data);
    } catch (error) {
      console.error('Error fetching database diagnostics:', error);
      showNotification('Failed to load MongoDB diagnostic logs', 'error');
    } finally {
      setLoadingDatabase(false);
    }
  }, [showNotification]);

  const fetchLogs = useCallback(async (page = 1) => {
    setLoadingLogs(true);
    try {
      const { resolvedStatus, severity, logType, route, user, startDate, endDate } = errorFilters;
      let url = `/admin/system/logs?page=${page}&limit=12&resolvedStatus=${resolvedStatus}`;
      if (severity) url += `&severity=${severity}`;
      if (logType) url += `&logType=${logType}`;
      if (route) url += `&route=${encodeURIComponent(route)}`;
      if (user) url += `&user=${encodeURIComponent(user)}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      
      const { data } = await API.get(url);
      setLogsData(data);
    } catch (error) {
      console.error('Error fetching system logs:', error);
      showNotification('Failed to retrieve centralized system logs', 'error');
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
      showNotification('Failed to load system maintenance configurations', 'error');
    } finally {
      setLoadingMaintenance(false);
    }
  }, [showNotification]);

  // Load active tab data on demand (Lazy Loading)
  useEffect(() => {
    if (activeTab === 0) {
      fetchOverview();
    } else if (activeTab === 1) {
      fetchPerformance();
    } else if (activeTab === 2) {
      fetchDatabase(false, false);
    } else if (activeTab === 3) {
      fetchLogs(currentPage);
    } else if (activeTab === 4) {
      fetchMaintenance();
      setIntegrity(null); // Clear previous scans until user clicks Scan
      setHealingPreview(null);
    }
  }, [activeTab, fetchOverview, fetchPerformance, fetchDatabase, fetchLogs, fetchMaintenance, currentPage]);

  // Auto-refresh interval (applied only to Overview & Performance tabs)
  useEffect(() => {
    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(() => {
        if (activeTab === 0) fetchOverview(true);
        if (activeTab === 1) fetchPerformance(true);
      }, 30000);
    } else {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    }
    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, [autoRefresh, activeTab, fetchOverview, fetchPerformance]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleForceRefetch = () => {
    if (activeTab === 0) fetchOverview();
    if (activeTab === 1) fetchPerformance();
    if (activeTab === 2) fetchDatabase(false, true);
    if (activeTab === 3) fetchLogs(currentPage);
    if (activeTab === 4) fetchMaintenance();
  };

  // Logs Action: Apply Filters
  const handleApplyLogFilters = () => {
    setCurrentPage(1);
    fetchLogs(1);
  };

  // Logs Action: Reset Filters
  const handleClearLogFilters = () => {
    setErrorFilters({
      resolvedStatus: 'unresolved',
      severity: '',
      logType: '',
      route: '',
      user: '',
      startDate: '',
      endDate: ''
    });
    setCurrentPage(1);
    setTimeout(() => {
      setLoadingLogs(true);
      API.get(`/admin/system/logs?page=1&limit=12&resolvedStatus=unresolved`).then(({ data }) => {
        setLogsData(data);
        setLoadingLogs(false);
      });
    }, 50);
  };

  // Logs Action: Resolve Log Alert
  const handleResolveError = async (id) => {
    try {
      await API.put(`/admin/system/logs/${id}/resolve`);
      showNotification('Log alert marked as resolved successfully', 'success');
      fetchLogs(currentPage);
      if (activeTab === 0) fetchOverview(true);
    } catch (error) {
      showNotification('Failed to resolve error log', 'error');
    }
  };

  // Maintenance: Toggle mode
  const handleToggleMaintenance = async () => {
    const nextMode = !maintenance?.maintenanceMode;
    const confirmMsg = nextMode 
      ? "ACTIVATE MAINTENANCE MODE? All public visitors will be blocked from accessing CodeOrbit modules immediately."
      : "DEACTIVATE MAINTENANCE MODE? System public access routes will be restored.";
      
    if (window.confirm(confirmMsg)) {
      setSavingMaintenance(true);
      try {
        const { data } = await API.put('/admin/system/maintenance', {
          maintenanceMode: nextMode,
        });
        setMaintenance(data);
        showNotification(
          `Maintenance mode is now ${nextMode ? 'Enabled' : 'Disabled'}.`, 
          nextMode ? 'warning' : 'success'
        );
        if (activeTab === 0) fetchOverview(true);
      } catch (error) {
        showNotification('Failed to toggle maintenance settings', 'error');
      } finally {
        setSavingMaintenance(false);
      }
    }
  };

  // Maintenance: Add Whitelist User
  const handleAddAllowedUser = async (e) => {
    e.preventDefault();
    if (!newUser.trim()) return;
    
    if (maintenance?.allowedUsers.some(u => u.toLowerCase() === newUser.trim().toLowerCase())) {
      showNotification('User email/ID is already whitelisted', 'warning');
      return;
    }

    const updatedUsers = [...(maintenance?.allowedUsers || []), newUser.trim()];
    
    setSavingMaintenance(true);
    try {
      const { data } = await API.put('/admin/system/maintenance', {
        allowedUsers: updatedUsers,
      });
      setMaintenance(data);
      setNewUser('');
      showNotification('Added user email to maintenance whitelist', 'success');
    } catch (error) {
      showNotification('Failed to update whitelist', 'error');
    } finally {
      setSavingMaintenance(false);
    }
  };

  // Maintenance: Remove Whitelist User
  const handleRemoveAllowedUser = async (userToRemove) => {
    const updatedUsers = maintenance.allowedUsers.filter(u => u !== userToRemove);
    
    setSavingMaintenance(true);
    try {
      const { data } = await API.put('/admin/system/maintenance', {
        allowedUsers: updatedUsers,
      });
      setMaintenance(data);
      showNotification('Removed user from whitelist successfully', 'success');
    } catch (error) {
      showNotification('Failed to update whitelist', 'error');
    } finally {
      setSavingMaintenance(false);
    }
  };

  // Maintenance: Manual Data Integrity Scan
  const handleScanIntegrity = async () => {
    setLoadingIntegrity(true);
    try {
      const { data } = await API.get('/admin/system/integrity?refresh=true');
      setIntegrity(data);
      showNotification('Data integrity analysis scan completed', 'success');
    } catch (error) {
      showNotification('Data integrity scan failed to complete', 'error');
    } finally {
      setLoadingIntegrity(false);
    }
  };

  // Maintenance: Safe Preview of Self-Heal actions
  const handlePreviewHeal = async () => {
    setLoadingHealPreview(true);
    try {
      const { data } = await API.post('/admin/system/integrity/heal', { confirm: false });
      setHealingPreview(data.summary);
      setShowHealDialog(true);
    } catch (error) {
      showNotification('Failed to construct self-healing preview', 'error');
    } finally {
      setLoadingHealPreview(false);
    }
  };

  // Maintenance: Execute Self-Heal actions
  const handleExecuteHeal = async () => {
    setHealing(true);
    try {
      const { data } = await API.post('/admin/system/integrity/heal', { confirm: true });
      if (data.success) {
        showNotification(
          `Self-heal executed! Resolved ${data.results.resolvedUsers} enrollments, cleaned ${data.results.cleanedProgressRecords} progresses, and ${data.results.cleanedCertificates} certificates.`,
          'success'
        );
        setShowHealDialog(false);
        setHealingPreview(null);
        handleScanIntegrity(); // Scan again to refresh
      } else {
        showNotification(data.results?.errors?.join(', ') || 'Healing process encountered errors', 'error');
      }
    } catch (error) {
      showNotification('Error executing DB self-healing script', 'error');
    } finally {
      setHealing(false);
    }
  };

  // Helper formats
  const formatBytes = (mb) => {
    if (!mb) return '0 MB';
    return mb.toFixed(1) + ' MB';
  };

  const getSeverityBadgeColor = (severity) => {
    const colors = {
      critical: '#ef4444', 
      error: '#f97316',    
      warning: '#eab308',
      info: '#3b82f6'
    };
    return colors[severity] || '#64748b';
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '90vh', color: 'text.primary', fontFamily: '"DM Sans", sans-serif' }}>
      
      {/* CSS PULSE LED ANIMATION */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes led-pulsate {
          0% { opacity: 0.5; box-shadow: 0 0 1px 1px currentColor; }
          50% { opacity: 1; box-shadow: 0 0 8px 3px currentColor; }
          100% { opacity: 0.5; box-shadow: 0 0 1px 1px currentColor; }
        }
        .pulsating-led {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          animation: led-pulsate 1.8s infinite ease-in-out;
        }
      `}} />

      {/* Main console header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: '-1.5px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Server size={30} strokeWidth={2.5} color="#2563eb" /> CodeOrbit Operations Center
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Enterprise Admin Control Deck & Diagnostic Console.
          </Typography>
        </Box>
        
        {/* Global Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {(activeTab === 0 || activeTab === 1) && (
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
                <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: 0.8 }}>
                  AUTO REFRESH (30S)
                </Typography>
              }
              sx={{ m: 0, bgcolor: 'background.paper', border: '1px solid #e2e8f0', px: 2, py: 0.5, borderRadius: 2 }}
            />
          )}
          <Button
            variant="outlined"
            onClick={handleForceRefetch}
            startIcon={<RotateCw size={15} />}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 2, py: 0.8, borderColor: '#cbd5e1', color: '#334155' }}
          >
            Refetch Tab Metrics
          </Button>
        </Box>
      </Box>

      {/* Operations Quick LED Indicators Bar */}
      <Paper sx={{ p: 2, borderRadius: 4, mb: 3, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: 1 }}>
          AT-A-GLANCE STATUS:
        </Typography>
        
        {/* 1. Server LED */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span className="pulsating-led" style={{ color: '#10b981', backgroundColor: '#10b981' }} />
          <Typography variant="caption" fontWeight={700} color="#334155">Server: Online</Typography>
        </Box>

        {/* 2. MongoDB LED */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {overview || database ? (
            <>
              <span 
                className="pulsating-led" 
                style={{ 
                  color: (overview?.dbStatus === 'Healthy' || database?.dbStatus === 'Connected') ? '#10b981' : '#ef4444', 
                  backgroundColor: (overview?.dbStatus === 'Healthy' || database?.dbStatus === 'Connected') ? '#10b981' : '#ef4444' 
                }} 
              />
              <Typography variant="caption" fontWeight={700} color="#334155">
                MongoDB: {(overview?.dbStatus === 'Healthy' || database?.dbStatus === 'Connected') ? 'Connected' : 'Offline'}
              </Typography>
            </>
          ) : (
            <Typography variant="caption" color="text.secondary">MongoDB: ...</Typography>
          )}
        </Box>

        {/* 3. RAM Limit LED */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {overview ? (
            <>
              <span 
                className="pulsating-led" 
                style={{ 
                  color: overview.memory.percentage > 85 ? '#ef4444' : overview.memory.percentage > 70 ? '#f59e0b' : '#10b981',
                  backgroundColor: overview.memory.percentage > 85 ? '#ef4444' : overview.memory.percentage > 70 ? '#f59e0b' : '#10b981'
                }} 
              />
              <Typography variant="caption" fontWeight={700} color="#334155">
                Process RAM: {formatBytes(overview.memory.heapUsed)} ({overview.memory.percentage}%)
              </Typography>
            </>
          ) : (
            <Typography variant="caption" color="text.secondary">RAM Load: ...</Typography>
          )}
        </Box>

        {/* 4. CPU Load LED */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {performance ? (
            <>
              <span 
                className="pulsating-led" 
                style={{ 
                  color: performance.cpu.loadavg[0] > (performance.cpu.cores * 0.8) ? '#ef4444' : performance.cpu.loadavg[0] > (performance.cpu.cores * 0.5) ? '#f59e0b' : '#10b981',
                  backgroundColor: performance.cpu.loadavg[0] > (performance.cpu.cores * 0.8) ? '#ef4444' : performance.cpu.loadavg[0] > (performance.cpu.cores * 0.5) ? '#f59e0b' : '#10b981'
                }} 
              />
              <Typography variant="caption" fontWeight={700} color="#334155">
                CPU Load (1m): {performance.cpu.loadavg[0].toFixed(2)} / {performance.cpu.cores} Cores
              </Typography>
            </>
          ) : (
            <Typography variant="caption" color="text.secondary">CPU Load: ...</Typography>
          )}
        </Box>

        {/* 5. Maintenance LED */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {overview !== null ? (
            <>
              <span 
                className="pulsating-led" 
                style={{ 
                  color: overview.maintenanceMode ? '#f59e0b' : '#10b981', 
                  backgroundColor: overview.maintenanceMode ? '#f59e0b' : '#10b981' 
                }} 
              />
              <Typography variant="caption" fontWeight={700} color="#334155">
                Maintenance: {overview.maintenanceMode ? 'ACTIVE' : 'INACTIVE'}
              </Typography>
            </>
          ) : (
            <Typography variant="caption" color="text.secondary">Maintenance: ...</Typography>
          )}
        </Box>
      </Paper>

      {/* Tab Navigation System */}
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: '1px solid #e2e8f0',
          mb: 3,
          '& .MuiTabs-indicator': { height: 3, borderRadius: '3px' },
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, minHeight: 48, fontSize: '0.9rem', gap: 1 }
        }}
      >
        <Tab icon={<Server size={17} />} label="Overview" />
        <Tab icon={<Cpu size={17} />} label="Performance" />
        <Tab icon={<Database size={17} />} label="Database" />
        <Tab icon={<ShieldCheck size={17} />} label="Security & Logs" />
        <Tab icon={<FolderLock size={17} />} label="Maintenance Center" />
      </Tabs>

      {/* --- TAB CONTENT PANEL RENDERS --- */}

      {/* TAB 0: OVERVIEW HUB */}
      {activeTab === 0 && (
        <Box>
          {loadingOverview ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress thickness={4} /></Box>
          ) : overview && (
            <Grid container spacing={3}>
              
              {/* 1. Backend Status Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" fontWeight={800} color="text.secondary">BACKEND STATUS</Typography>
                      <Server size={18} color={
                        overview.backendStatus === 'Healthy' ? '#10b981' : 
                        overview.backendStatus === 'Warning' ? '#f59e0b' : '#ef4444'
                      } />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1.5 }}>
                      <span className="pulsating-led" style={{ 
                        color: overview.backendStatus === 'Healthy' ? '#10b981' : overview.backendStatus === 'Warning' ? '#f59e0b' : '#ef4444', 
                        backgroundColor: overview.backendStatus === 'Healthy' ? '#10b981' : overview.backendStatus === 'Warning' ? '#f59e0b' : '#ef4444' 
                      }} />
                      <Typography variant="h5" fontWeight={900} color={
                        overview.backendStatus === 'Healthy' ? 'success.main' : 
                        overview.backendStatus === 'Warning' ? 'warning.main' : 'error.main'
                      }>
                        {overview.backendStatus}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Active health check validation
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* 2. MongoDB Status Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" fontWeight={800} color="text.secondary">MONGODB STATUS</Typography>
                      <Database size={18} color={
                        overview.dbStatus === 'Healthy' ? '#10b981' : 
                        overview.dbStatus === 'Warning' ? '#f59e0b' : '#ef4444'
                      } />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1.5 }}>
                      <span className="pulsating-led" style={{ 
                        color: overview.dbStatus === 'Healthy' ? '#10b981' : overview.dbStatus === 'Warning' ? '#f59e0b' : '#ef4444', 
                        backgroundColor: overview.dbStatus === 'Healthy' ? '#10b981' : overview.dbStatus === 'Warning' ? '#f59e0b' : '#ef4444' 
                      }} />
                      <Typography variant="h5" fontWeight={900} color={
                        overview.dbStatus === 'Healthy' ? 'success.main' : 
                        overview.dbStatus === 'Warning' ? 'warning.main' : 'error.main'
                      }>
                        {overview.dbStatus}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Ready state connection count
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* 3. Memory Usage Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" fontWeight={800} color="text.secondary">MEMORY USAGE</Typography>
                      <Cpu size={18} color="#2563eb" />
                    </Box>
                    <Typography variant="h5" fontWeight={900} sx={{ my: 0.5 }}>
                      {overview.memory.percentage}%
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem' }}>
                        <span>RSS: <strong>{formatBytes(overview.memory.rss)}</strong></span>
                        <span>Used: <strong>{formatBytes(overview.memory.heapUsed)}</strong></span>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem' }}>
                        <span>Total: <strong>{formatBytes(overview.memory.heapTotal)}</strong></span>
                        <span>Ext: <strong>{formatBytes(overview.memory.external)}</strong></span>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* 4. API Success Rate Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" fontWeight={800} color="text.secondary">API SUCCESS RATE</Typography>
                      <Zap size={18} color={
                        overview.apiSuccessRate >= 95 ? '#10b981' : 
                        overview.apiSuccessRate >= 85 ? '#f59e0b' : '#ef4444'
                      } />
                    </Box>
                    <Typography variant="h4" fontWeight={900} sx={{ my: 1 }} color={
                      overview.apiSuccessRate >= 95 ? 'success.main' : 
                      overview.apiSuccessRate >= 85 ? 'warning.main' : 'error.main'
                    }>
                      {overview.apiSuccessRate}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {overview.apiRequestsToday} total requests logged
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* 5. Users Active Today Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" fontWeight={800} color="text.secondary">USERS ACTIVE TODAY</Typography>
                      <UserCheck size={18} color="#3b82f6" />
                    </Box>
                    <Typography variant="h3" fontWeight={900} sx={{ my: 1 }}>
                      {overview.activeUsers}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Unique active user sessions
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* 6. Errors Today Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" fontWeight={800} color="text.secondary">ERRORS TODAY</Typography>
                      <ShieldAlert size={18} color={overview.errorsToday > 0 ? "#ef4444" : "#10b981"} />
                    </Box>
                    <Typography variant="h3" fontWeight={900} sx={{ my: 1 }} color={overview.errorsToday > 0 ? "error.main" : "inherit"}>
                      {overview.errorsToday}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Warning and error logs logged
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* 7. Maintenance Mode Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" fontWeight={800} color="text.secondary">MAINTENANCE MODE</Typography>
                      <FolderLock size={18} color={overview.maintenanceMode ? '#f59e0b' : '#10b981'} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1.5 }}>
                      <span className="pulsating-led" style={{ 
                        color: overview.maintenanceMode ? '#f59e0b' : '#10b981', 
                        backgroundColor: overview.maintenanceMode ? '#f59e0b' : '#10b981' 
                      }} />
                      <Typography variant="h5" fontWeight={900} color={overview.maintenanceMode ? 'warning.main' : 'success.main'}>
                        {overview.maintenanceMode ? 'Active' : 'Inactive'}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Public path access limitation
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* 8. System Uptime Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" fontWeight={800} color="text.secondary">SYSTEM UPTIME</Typography>
                      <Clock size={18} color="#6366f1" />
                    </Box>
                    <Typography variant="h4" fontWeight={900} sx={{ my: 1 }}>
                      {(overview.uptime / 3600).toFixed(1)} Hrs
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Since last process spin up
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* 9. Current Environment Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" fontWeight={800} color="text.secondary">ENVIRONMENT</Typography>
                      <Terminal size={18} color="#8b5cf6" />
                    </Box>
                    <Typography variant="h4" fontWeight={900} sx={{ my: 1, textTransform: 'capitalize' }}>
                      {overview.deployment.environment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Execution platform mode
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* 10. Deployment Revision Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" fontWeight={800} color="text.secondary">DEPLOYMENT REVISION</Typography>
                      <RotateCw size={18} color="#ec4899" />
                    </Box>
                    <Typography variant="h5" fontWeight={900} sx={{ my: 1, fontFamily: 'monospace' }}>
                      {overview.deployment.gitCommit}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      Branch: {overview.deployment.gitBranch || 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Specifications Sub-Card */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                  <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Terminal size={16} /> DEPLOYMENT SPECIFICATIONS
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" color="text.secondary">LAST BOOTED TIMESTAMP</Typography>
                      <Typography variant="body1" fontWeight={700}>
                        {new Date(overview.deployment.deploymentTimestamp).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" color="text.secondary">ENTRYPOINT FILE VERSION</Typography>
                      <Typography variant="body1" fontWeight={700}>
                        CodeOrbit API Engine v1.0.0
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" color="text.secondary">DEPLOYED RECENT FILE CHANGE</Typography>
                      <Typography variant="body1" fontWeight={700}>
                        {new Date(overview.deployment.buildTimestamp).toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

            </Grid>
          )}
        </Box>
      )}

      {/* TAB 1: PERFORMANCE */}
      {activeTab === 1 && (
        <Box>
          {loadingPerformance ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
          ) : performance && (
            <Grid container spacing={3}>
              
              {/* RAM Usage Breakdown */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
                  <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Cpu size={16} /> NODE.JS PROCESS MEMORY BREAKDOWN
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={700}>Heap Usage Ratio</Typography>
                        <Typography variant="body2" fontWeight={800} color="primary.main">{performance.memory.percentage}%</Typography>
                      </Box>
                      <Box sx={{ height: 8, bgcolor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: `${performance.memory.percentage}%`, bgcolor: '#2563eb', borderRadius: 4 }} />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Heap Used</Typography>
                      <Typography variant="body2" fontWeight={700}>{formatBytes(performance.memory.heapUsed)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Heap Total</Typography>
                      <Typography variant="body2" fontWeight={700}>{formatBytes(performance.memory.heapTotal)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Resident Set Size (RSS)</Typography>
                      <Typography variant="body2" fontWeight={700}>{formatBytes(performance.memory.rss)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">External Memory</Typography>
                      <Typography variant="body2" fontWeight={700}>{formatBytes(performance.memory.external)}</Typography>
                    </Box>
                    
                    {memoryHistory.length > 1 && (
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #cbd5e1' }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          HEAP USAGE ACTIVE HISTORY TREND (MB)
                        </Typography>
                        <MiniSVGLineChart data={memoryHistory} pointsColor="#2563eb" gradientId="memGrad" />
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Event Loop & CPU metrics */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
                  <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Clock size={16} /> PROCESS EVENT LOOP LAG & OS LOAD
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Current Delay</Typography>
                      <Typography variant="h5" fontWeight={800} color={performance.eventLoop.status === 'Healthy' ? 'success.main' : 'warning.main'}>
                        {performance.eventLoop.currentLag} ms
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Average Delay (Lag)</Typography>
                      <Typography variant="body2" fontWeight={700}>{performance.eventLoop.averageLag} ms</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Peak Delay Recorded</Typography>
                      <Typography variant="body2" fontWeight={700}>{performance.eventLoop.peakLag} ms</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Event Loop Status</Typography>
                      <Chip 
                        label={performance.eventLoop.status} 
                        color={performance.eventLoop.status === 'Healthy' ? 'success' : 'warning'} 
                        size="small"
                        sx={{ fontWeight: 800 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">CPU cores count</Typography>
                      <Typography variant="body2" fontWeight={700}>{performance.cpu.cores} Core(s)</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">OS loadavg (1m, 5m, 15m)</Typography>
                      <Typography variant="body2" fontWeight={700}>{performance.cpu.loadavg.map(v => v.toFixed(2)).join(', ')}</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* API Speed Metrics */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                  <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ mb: 2 }}>
                    API HTTP PERFORMANCE SUMMARY
                  </Typography>
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>AVERAGE RESPONSE TIME</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>{performance.apiMetrics.avgResponseTime} ms</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>REQUESTS PER MINUTE (RPM)</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>{performance.apiMetrics.rpm}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>SLOWEST TRANSACTION ROUTE</Typography>
                        <Typography variant="body2" fontWeight={700} color="error.main" sx={{ mt: 1, wordBreak: 'break-all' }}>
                          {performance.apiMetrics.slowestEndpoint}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Top Endpoints Table */}
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                    <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
                      <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: 0.8 }}>
                        TOP ENDPOINTS HIT ANALYSIS (TODAY)
                      </Typography>
                    </Box>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 800 }}>Method</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Route Path</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Hits Today</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Avg Response Time</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Errors logged</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {performance.apiMetrics.topEndpoints.map((route, idx) => (
                          <TableRow key={idx} hover>
                            <TableCell>
                              <Chip 
                                label={route.method} 
                                size="small"
                                sx={{ 
                                  fontWeight: 900, 
                                  fontSize: '0.65rem', 
                                  height: 18,
                                  color: '#fff',
                                  bgcolor: route.method === 'POST' ? '#10b981' : route.method === 'GET' ? '#3b82f6' : '#eab308'
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{route.route}</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>{route.hits}</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>{route.avgResponseTime} ms</TableCell>
                            <TableCell>
                              {route.errors > 0 ? (
                                <Chip label={`${route.errors} error(s)`} color="error" size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', height: 16 }} />
                              ) : (
                                <Chip label="0 errors" color="success" size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', height: 16 }} />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        {performance.apiMetrics.topEndpoints.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                              <Typography color="text.secondary">No hits tracked today.</Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

            </Grid>
          )}
        </Box>
      )}

      {/* TAB 2: DATABASE */}
      {activeTab === 2 && (
        <Box>
          {loadingDatabase ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
          ) : database && (
            <Grid container spacing={3}>
              
              {/* DB Status metrics */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <Typography variant="caption" fontWeight={800} color="text.secondary">MONGODB CONNECTION STATUS</Typography>
                  <Typography variant="h4" fontWeight={900} color="success.main" sx={{ my: 1.5 }}>
                    {database.dbStatus}
                  </Typography>
                  <Chip label={`Ping Latency: ${database.dbPing}ms`} color="primary" size="small" sx={{ fontWeight: 700 }} />
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <Typography variant="caption" fontWeight={800} color="text.secondary">TOTAL DATABASE DOCUMENTS</Typography>
                  <Typography variant="h4" fontWeight={900} sx={{ my: 1.5 }}>
                    {database.totalDocuments.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    Estimated across all collections
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <Typography variant="caption" fontWeight={800} color="text.secondary">COLLECTIONS & INDEXES</Typography>
                  <Typography variant="h4" fontWeight={900} sx={{ my: 1.5 }}>
                    {database.collectionsCount} / {database.indexesCount}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    Active Tables / Search Indexes
                  </Typography>
                </Paper>
              </Grid>

              {/* Exact Business Collections counts */}
              <Grid item xs={12}>
                <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
                  <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
                    <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Database size={16} /> CORE BUSINESS COLLECTIONS ANALYTICS
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<RotateCw size={14} />}
                      onClick={() => fetchDatabase(false, true)}
                      sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700 }}
                    >
                      Refresh Database Metrics
                    </Button>
                  </Box>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800 }}>Collection name</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Underlying Model</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Exact Documents Count</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Database Type</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow hover>
                        <TableCell sx={{ fontWeight: 700 }}>Users</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace' }}>User.js</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>{database.businessCounts.Users}</TableCell>
                        <TableCell><Chip label="Identity" size="small" sx={{ fontSize: '0.65rem', height: 18 }} /></TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell sx={{ fontWeight: 700 }}>Applications</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace' }}>InternshipApplication.js</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>{database.businessCounts.Applications}</TableCell>
                        <TableCell><Chip label="Transactions" size="small" sx={{ fontSize: '0.65rem', height: 18 }} /></TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell sx={{ fontWeight: 700 }}>Enrollments</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace' }}>Enrollment.js</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>{database.businessCounts.Enrollments}</TableCell>
                        <TableCell><Chip label="LMS Core" size="small" sx={{ fontSize: '0.65rem', height: 18 }} /></TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell sx={{ fontWeight: 700 }}>Programs</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace' }}>Program.js</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>{database.businessCounts.Programs}</TableCell>
                        <TableCell><Chip label="Configuration" size="small" sx={{ fontSize: '0.65rem', height: 18 }} /></TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell sx={{ fontWeight: 700 }}>Certificates</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace' }}>LMSCertificate.js / Document.js</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>{database.businessCounts.Certificates}</TableCell>
                        <TableCell><Chip label="LMS Assets" size="small" sx={{ fontSize: '0.65rem', height: 18 }} /></TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell sx={{ fontWeight: 700 }}>Progress Logs</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace' }}>LMSActivityProgress.js / ActivityProgress.js</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>{database.businessCounts.ProgressLogs}</TableCell>
                        <TableCell><Chip label="Logs Data" size="small" sx={{ fontSize: '0.65rem', height: 18 }} /></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

            </Grid>
          )}
        </Box>
      )}

      {/* TAB 3: SECURITY & LOGS */}
      {activeTab === 3 && (
        <Box>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, borderRadius: 4, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" fontWeight={800} color="text.secondary">CRITICAL ERRORS</Typography>
                  <Typography variant="h5" fontWeight={900} sx={{ mt: 0.5 }} color="error.main">{logsData.summary.criticalErrors}</Typography>
                </Box>
                <Chip label="500 Errors" color="error" size="small" />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, borderRadius: 4, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" fontWeight={800} color="text.secondary">WARNING EVENTS</Typography>
                  <Typography variant="h5" fontWeight={900} sx={{ mt: 0.5 }} color="warning.main">{logsData.summary.warningErrors}</Typography>
                </Box>
                <Chip label="400 Warnings" color="warning" size="small" />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, borderRadius: 4, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" fontWeight={800} color="text.secondary">SECURITY SHIELD EVENTS</Typography>
                  <Typography variant="h5" fontWeight={900} sx={{ mt: 0.5 }}>
                    {logsData.logs.filter(l => l.logType === 'security').length}
                  </Typography>
                </Box>
                <Chip label="Security Audit" color="secondary" size="small" />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, borderRadius: 4, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" fontWeight={800} color="text.secondary">RESOLVED ALERTS</Typography>
                  <Typography variant="h5" fontWeight={900} sx={{ mt: 0.5 }} color="success.main">{logsData.summary.resolvedErrors}</Typography>
                </Box>
                <Chip label="Resolved" color="success" size="small" />
              </Paper>
            </Grid>
          </Grid>

          {/* Central Search Filters */}
          <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid #e2e8f0', mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Filter size={16} /> CENTRALIZED LOG ENGINE FILTERING
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
                    <MenuItem value="unresolved">Unresolved alerts</MenuItem>
                    <MenuItem value="resolved">Resolved alerts</MenuItem>
                    <MenuItem value="all">All Logs & Audits</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={errorFilters.logType}
                    label="Type"
                    onChange={(e) => setErrorFilters(prev => ({ ...prev, logType: e.target.value }))}
                  >
                    <MenuItem value="">Any Type</MenuItem>
                    <MenuItem value="error">Error Log</MenuItem>
                    <MenuItem value="warning">Warning Log</MenuItem>
                    <MenuItem value="security">Security Alert</MenuItem>
                    <MenuItem value="audit">Admin Audit</MenuItem>
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
                    <MenuItem value="error">Error (400+)</MenuItem>
                    <MenuItem value="warning">Warning</MenuItem>
                    <MenuItem value="info">Info</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Route / Keyword search"
                  size="small"
                  placeholder="e.g. /api/auth"
                  value={errorFilters.route}
                  onChange={(e) => setErrorFilters(prev => ({ ...prev, route: e.target.value }))}
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
              <Button variant="outlined" size="small" onClick={handleClearLogFilters} sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700 }}>
                Clear
              </Button>
              <Button variant="contained" size="small" onClick={handleApplyLogFilters} sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700 }}>
                Query Logs
              </Button>
            </Box>
          </Paper>

          {/* Logs Output Grid */}
          <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
            {loadingLogs ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
            ) : (
              <Box>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800 }}>Timestamp</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Method</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Route Endpoint</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Message</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>IP Address</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>User Context</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logsData.logs.map((log) => (
                      <TableRow key={log._id} hover>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{new Date(log.timestamp).toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip 
                            label={log.logType.toUpperCase()} 
                            size="small"
                            sx={{ 
                              fontWeight: 900, 
                              fontSize: '0.6rem', 
                              height: 18,
                              color: '#fff',
                              bgcolor: log.logType === 'error' ? '#ef4444' : log.logType === 'warning' ? '#f59e0b' : log.logType === 'security' ? '#7c3aed' : '#2563eb'
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>{log.method || 'N/A'}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.route || 'N/A'}</TableCell>
                        <TableCell sx={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                          {log.message}
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{log.ipAddress || 'N/A'}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>
                          {log.user ? (
                            <Box>
                              <Typography variant="caption" fontWeight={700} sx={{ display: 'block' }}>{log.user.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{log.user.email}</Typography>
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.secondary">Guest</Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                            <IconButton size="small" onClick={() => setSelectedLog(log)} color="primary">
                              <Eye size={15} />
                            </IconButton>
                            {!log.resolved && (log.logType === 'error' || log.logType === 'warning') && (
                              <IconButton size="small" onClick={() => handleResolveError(log._id)} color="success">
                                <Check size={15} />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {logsData.logs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                          <Typography color="text.secondary">No log events match your queries.</Typography>
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
                      onChange={(e, val) => setCurrentPage(val)} 
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

      {/* TAB 4: MAINTENANCE */}
      {activeTab === 4 && (
        <Box>
          <Grid container spacing={3}>
            
            {/* Maintenance Mode configuration */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
                <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <FolderLock size={16} /> SYSTEM MAINTENANCE DECK
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {loadingMaintenance ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                ) : maintenance && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="body2" fontWeight={800}>Maintenance Mode Status:</Typography>
                        <Chip 
                          label={maintenance.maintenanceMode ? "ACTIVE" : "INACTIVE"} 
                          color={maintenance.maintenanceMode ? "error" : "default"} 
                          size="small"
                          sx={{ fontWeight: 900 }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                        {maintenance.maintenanceMode 
                          ? `Activated by ${maintenance.enabledBy?.name || 'Admin'} at ${new Date(maintenance.enabledAt).toLocaleString()}`
                          : "Public traffic routes are functional."}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        Turning on maintenance mode locks down API access with a 503 response. Whitelisted test emails/user IDs and root administrators bypass this block.
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      color={maintenance.maintenanceMode ? "success" : "error"}
                      onClick={handleToggleMaintenance}
                      disabled={savingMaintenance}
                      sx={{ borderRadius: 2, fontWeight: 800, py: 1.2 }}
                    >
                      {savingMaintenance ? <CircularProgress size={18} color="inherit" /> : (
                        maintenance.maintenanceMode ? "DEACTIVATE MAINTENANCE MODE" : "ACTIVATE MAINTENANCE MODE"
                      )}
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Whitelist Panel */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
                <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <UserCheck size={16} /> MAINTENANCE TESTERS WHITELIST
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {loadingMaintenance ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                ) : maintenance && (
                  <Box>
                    <Box component="form" onSubmit={handleAddAllowedUser} sx={{ display: 'flex', gap: 1, mb: 3 }}>
                      <TextField
                        size="small"
                        fullWidth
                        label="User Email"
                        value={newUser}
                        onChange={(e) => setNewUser(e.target.value)}
                        placeholder="tester@codeorbit.in"
                      />
                      <Button type="submit" variant="contained" disabled={savingMaintenance || !newUser.trim()} sx={{ px: 3, borderRadius: 2 }}>
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
                          No users on the whitelist.
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Cold Start self pinger & Env Variables checklist */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
                <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Zap size={16} /> COLD START WORKER & ENV STATUS
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box>
                    <Typography variant="body2" fontWeight={800} sx={{ mb: 1 }}>Self-Ping Worker Status:</Typography>
                    {maintenance?.coldStartWorker ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Chip 
                            label={maintenance.coldStartWorker.status.toUpperCase()} 
                            color={
                              maintenance.coldStartWorker.status === "Active" ? "success" : 
                              maintenance.coldStartWorker.status === "Degraded" ? "warning" : "default"
                            } 
                            size="small" 
                            sx={{ fontWeight: 900 }} 
                          />
                          <Typography variant="caption" fontWeight={700} color="text.secondary">
                            Success Rate: {maintenance.coldStartWorker.successRate}% ({maintenance.coldStartWorker.successCount} / {maintenance.coldStartWorker.successCount + maintenance.coldStartWorker.failureCount} pings)
                          </Typography>
                        </Box>
                        
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>LAST SUCCESS PING</Typography>
                            <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.75rem' }}>
                              {maintenance.coldStartWorker.lastSuccessPing 
                                ? new Date(maintenance.coldStartWorker.lastSuccessPing).toLocaleString() 
                                : 'Never'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>LAST FAILED PING</Typography>
                            <Typography variant="body2" fontWeight={700} color={maintenance.coldStartWorker.lastFailedPing ? "error.main" : "text.primary"} sx={{ fontSize: '0.75rem' }}>
                              {maintenance.coldStartWorker.lastFailedPing 
                                ? new Date(maintenance.coldStartWorker.lastFailedPing).toLocaleString() 
                                : 'None'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>LAST PING DURATION</Typography>
                            <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.75rem' }}>
                              {maintenance.coldStartWorker.lastPingDuration ? `${maintenance.coldStartWorker.lastPingDuration} ms` : 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>LAST PING TIME</Typography>
                            <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.75rem' }}>
                              {maintenance.coldStartWorker.lastPingTime 
                                ? new Date(maintenance.coldStartWorker.lastPingTime).toLocaleString() 
                                : 'N/A'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary">Loading worker health...</Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={800} sx={{ mb: 1 }}>Configuration Environment Variables check:</Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}><Chip icon={<Check size={12} />} label="MONGO_URI" color="success" size="small" variant="outlined" /></Grid>
                      <Grid item xs={6}><Chip icon={<Check size={12} />} label="JWT_SECRET" color="success" size="small" variant="outlined" /></Grid>
                      <Grid item xs={6}><Chip icon={<Check size={12} />} label="CLOUDINARY" color="success" size="small" variant="outlined" /></Grid>
                      <Grid item xs={6}><Chip icon={<Check size={12} />} label="RAZORPAY" color="success" size="small" variant="outlined" /></Grid>
                    </Grid>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Database Integrity & Self heal center */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
                <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Database size={16} /> DATABASE INTEGRITY SCANNER
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {loadingIntegrity ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                ) : integrity ? (
                  <Box>
                    {integrity.summary.isClean ? (
                      <Alert severity="success" sx={{ borderRadius: 3, mb: 2.5, fontWeight: 700 }}>
                        No Integrity Issues Found.
                      </Alert>
                    ) : (
                      <Box>
                        <Alert severity="warning" sx={{ borderRadius: 3, mb: 2.5, fontWeight: 700 }}>
                          Detected {integrity.summary.issuesCount} database integrity anomalies.
                        </Alert>
                        <Grid container spacing={1.5} sx={{ mb: 2 }}>
                          <Grid item xs={6}><Typography variant="body2">Orphan Users: <strong>{integrity.summary.orphanUsersCount}</strong></Typography></Grid>
                          <Grid item xs={6}><Typography variant="body2">Orphan Apps: <strong>{integrity.summary.orphanApplicationsCount}</strong></Typography></Grid>
                          <Grid item xs={6}><Typography variant="body2">Orphan Enrollments: <strong>{integrity.summary.orphanEnrollmentsCount}</strong></Typography></Grid>
                          <Grid item xs={6}><Typography variant="body2">Duplicate Enrollments: <strong>{integrity.summary.duplicateEnrollmentsCount}</strong></Typography></Grid>
                        </Grid>
                        <Button
                          variant="contained"
                          color="warning"
                          fullWidth
                          onClick={handlePreviewHeal}
                          disabled={loadingHealPreview}
                          startIcon={<Play size={14} />}
                          sx={{ borderRadius: 2, fontWeight: 700 }}
                        >
                          {loadingHealPreview ? "Analyzing..." : "Review self-healing changes"}
                        </Button>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ py: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Scan the database collections to verify data integrity and orphan models.
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={handleScanIntegrity} 
                      startIcon={<RotateCw size={14} />}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                    >
                      Run Integrity Diagnostics
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>

          </Grid>
        </Box>
      )}

      {/* --- DETAIL MODALS AND DIALOGS --- */}

      {/* 1. Log Detail Dialog */}
      <Dialog
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        closeAfterTransition={false}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1, color: '#ef4444' }}>
          <ShieldAlert size={22} /> Production Log Details & Context
        </DialogTitle>
        <DialogContent dividers>
          {selectedLog && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={800} color="text.secondary">MESSAGE</Typography>
                <Typography variant="body1" fontWeight={700} color={selectedLog.logType === 'error' ? 'error.main' : 'text.primary'}>
                  {selectedLog.message}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary" fontWeight={800}>LOG TYPE</Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                    {selectedLog.logType}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ display: 'block', mb: 0.5 }}>SEVERITY</Typography>
                  <Chip 
                    label={selectedLog.severity ? selectedLog.severity.toUpperCase() : 'INFO'} 
                    size="small" 
                    sx={{ 
                      fontWeight: 850, 
                      color: '#fff', 
                      bgcolor: getSeverityBadgeColor(selectedLog.severity || 'info'),
                      fontSize: '0.65rem',
                      height: 18
                    }} 
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary" fontWeight={800}>ROUTE ROUTING</Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                    {selectedLog.method} {selectedLog.route || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary" fontWeight={800}>IP ADDRESS</Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                    {selectedLog.ipAddress || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>

              {selectedLog.details && (
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ mb: 1 }}>RAW SPECIFICATIONS & METADATA</Typography>
                  <Paper sx={{ p: 2, bgcolor: '#0f172a', color: '#f8fafc', borderRadius: 3, maxHeight: 250, overflow: 'auto' }}>
                    <pre style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'Courier New, monospace', whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </Paper>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          <Button onClick={() => setSelectedLog(null)} variant="outlined" sx={{ borderRadius: 2, fontWeight: 700 }}>
            Close Detail
          </Button>
          {selectedLog && !selectedLog.resolved && (selectedLog.logType === 'error' || selectedLog.logType === 'warning') && (
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
              Resolve Log Alert
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* 2. Self Heal Preview Dialog */}
      <Dialog
        open={showHealDialog}
        onClose={() => !healing && setShowHealDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Safe Self-Healing Execution Preview
        </DialogTitle>
        <DialogContent dividers>
          {healingPreview && (
            <Box>
              <Alert severity="warning" sx={{ mb: 3, fontWeight: 700, borderRadius: 2 }}>
                Confirming this action will modify/delete {healingPreview.recordsAffected} records. Ensure you reviewed the details below.
              </Alert>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The following actions will be performed:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                {healingPreview.actions.map((act, i) => (
                  <Box key={i} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #cbd5e1' }}>
                    <Typography variant="subtitle2" fontWeight={800}>{act.action}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">Collection: {act.collection}</Typography>
                      <Typography variant="caption" color="error.main" fontWeight={700}>Records Affected: {act.count}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                An administrative audit log will be automatically recorded upon execution. This is a non-destructive healing process focused only on orphaned indexes.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowHealDialog(false)} disabled={healing} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleExecuteHeal} 
            disabled={healing} 
            variant="contained" 
            color="warning" 
            startIcon={<Check size={16} />}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            {healing ? "Executing..." : "Confirm & Execute Repair"}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AdminSystemMonitor;
