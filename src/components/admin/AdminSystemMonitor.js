import React, { useState, useEffect, useCallback } from 'react';
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
  IconButton
} from '@mui/material';
import {
  Activity,
  CheckCircle2,
  XCircle,
  Database,
  Cpu,
  Layers,
  ShieldAlert,
  RefreshCw,
  Eye,
  Info,
  Zap
} from 'lucide-react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const AdminSystemMonitor = () => {
  const { showNotification } = useNotification();
  const [health, setHealth] = useState(null);
  const [integrity, setIntegrity] = useState(null);
  const [logsData, setLogsData] = useState({ logs: [], page: 1, pages: 1, totalLogs: 0 });
  const [selectedLog, setSelectedLog] = useState(null);
  
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [loadingIntegrity, setLoadingIntegrity] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [healing, setHealing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Maintenance state
  const [maintenance, setMaintenance] = useState({
    maintenanceMode: false,
    allowedUsers: [],
    enabledBy: null,
    enabledAt: null,
  });
  const [loadingMaintenance, setLoadingMaintenance] = useState(true);
  const [newUser, setNewUser] = useState('');
  const [savingMaintenance, setSavingMaintenance] = useState(false);

  const fetchHealth = useCallback(async () => {
    setLoadingHealth(true);
    try {
      const { data } = await API.get('/admin/system/health');
      setHealth(data);
    } catch (error) {
      console.error('Error fetching health:', error);
      showNotification('Failed to load system health metrics', 'error');
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
      showNotification('Failed to load data integrity report', 'error');
    } finally {
      setLoadingIntegrity(false);
    }
  }, [showNotification]);

  const fetchLogs = useCallback(async (page = 1) => {
    setLoadingLogs(true);
    try {
      const { data } = await API.get(`/admin/system/logs?page=${page}&limit=10`);
      setLogsData(data);
    } catch (error) {
      console.error('Error fetching error logs:', error);
      showNotification('Failed to load system error logs', 'error');
    } finally {
      setLoadingLogs(false);
    }
  }, [showNotification]);

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

  useEffect(() => {
    fetchHealth();
    fetchIntegrity();
    fetchLogs(1);
    fetchMaintenance();
  }, [fetchHealth, fetchIntegrity, fetchLogs, fetchMaintenance]);

  const handleToggleMaintenance = async () => {
    const nextMode = !maintenance.maintenanceMode;
    const confirmMsg = nextMode 
      ? "Are you sure you want to ENABLE Maintenance Mode? Public access will be blocked immediately."
      : "Are you sure you want to DISABLE Maintenance Mode? The site will be public immediately.";
      
    if (window.confirm(confirmMsg)) {
      setSavingMaintenance(true);
      try {
        const { data } = await API.put('/admin/system/maintenance', {
          maintenanceMode: nextMode,
        });
        setMaintenance(data);
        showNotification(
          `Maintenance mode has been ${nextMode ? 'enabled' : 'disabled'} successfully.`, 
          nextMode ? 'warning' : 'success'
        );
      } catch (error) {
        showNotification('Failed to update maintenance mode', 'error');
      } finally {
        setSavingMaintenance(false);
      }
    }
  };

  const handleAddAllowedUser = async (e) => {
    e.preventDefault();
    if (!newUser.trim()) return;
    
    // Check if already in list
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
      showNotification('User added to whitelist successfully.', 'success');
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
      showNotification('User removed from whitelist successfully.', 'success');
    } catch (error) {
      showNotification('Failed to remove whitelisted user', 'error');
    } finally {
      setSavingMaintenance(false);
    }
  };

  const handleHeal = async () => {
    if (window.confirm('Are you sure you want to trigger the automatic data integrity healing routine? This will resolve orphan user references and clean up broken progress logs.')) {
      setHealing(true);
      try {
        const { data } = await API.post('/admin/system/integrity/heal');
        if (data.success) {
          showNotification(
            `Healing complete! Resolved ${data.results.resolvedUsers} users, cleaned ${data.results.cleanedProgressRecords} progress logs, and ${data.results.cleanedCertificates} certificates.`,
            'success'
          );
          fetchIntegrity();
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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    fetchLogs(value);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, fontFamily: '"DM Sans", sans-serif' }}>
      
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="primary.main">
            System Monitor & Diagnostic Center
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Audit system health, inspect error logs, check data integrity, and run self-healing routines.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshCw size={18} />}
          onClick={() => {
            fetchHealth();
            fetchIntegrity();
            fetchLogs(currentPage);
            fetchMaintenance();
          }}
          sx={{ borderRadius: 2 }}
        >
          Refresh All
        </Button>
      </Box>

      {/* Maintenance Mode Section */}
      <Typography variant="h6" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ShieldAlert size={20} color="#dc2626" /> System Maintenance Settings
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, mb: 5, border: '1px solid', borderColor: maintenance.maintenanceMode ? 'error.light' : 'divider', bgcolor: maintenance.maintenanceMode ? 'rgba(239, 68, 68, 0.02)' : 'background.paper' }}>
        {loadingMaintenance ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip 
                      label={maintenance.maintenanceMode ? "Active" : "Inactive"} 
                      color={maintenance.maintenanceMode ? "error" : "default"}
                      sx={{ fontWeight: 800, px: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {maintenance.maintenanceMode 
                        ? `Enabled by ${maintenance.enabledBy?.name || 'Admin'} on ${new Date(maintenance.enabledAt).toLocaleString()}` 
                        : "Website is accessible to all public visitors."}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    When Maintenance Mode is active, public pages, dashboards, LMS student areas, payment gateways, and client APIs will return a 503 error. Only administrators and whitelisted test users will have full access to the site.
                  </Typography>
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    color={maintenance.maintenanceMode ? "success" : "error"}
                    onClick={handleToggleMaintenance}
                    disabled={savingMaintenance}
                    startIcon={<Zap size={18} />}
                    sx={{
                      borderRadius: 2.5,
                      px: 4,
                      py: 1.5,
                      fontWeight: 700,
                      boxShadow: maintenance.maintenanceMode ? '0 10px 15px -3px rgba(34, 197, 94, 0.3)' : '0 10px 15px -3px rgba(239, 68, 68, 0.3)',
                      '&:hover': {
                        bgcolor: maintenance.maintenanceMode ? 'success.dark' : 'error.dark',
                      }
                    }}
                  >
                    {savingMaintenance ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : maintenance.maintenanceMode ? (
                      "Deactivate Maintenance Mode"
                    ) : (
                      "Activate Maintenance Mode"
                    )}
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ borderLeft: { md: '1px solid' }, borderColor: 'divider', pl: { md: 4 } }}>
                <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Whitelisted Test Users
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  Admins always retain access. Whitelist clients or testers using their Email or User ID.
                </Typography>
                
                <Box component="form" onSubmit={handleAddAllowedUser} sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  <input
                    type="text"
                    placeholder="Enter email or User ID..."
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      fontFamily: '"DM Sans", sans-serif',
                      outline: 'none',
                    }}
                  />
                  <Button
                    type="submit"
                    variant="outlined"
                    disabled={savingMaintenance || !newUser.trim()}
                    sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}
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
                      sx={{
                        borderRadius: '6px',
                        fontWeight: 600,
                        bgcolor: 'rgba(37, 99, 235, 0.08)',
                        color: '#2563eb',
                        '& .MuiChip-deleteIcon': {
                          color: '#2563eb',
                          '&:hover': { color: '#1d4ed8' }
                        }
                      }}
                    />
                  ))}
                  {maintenance.allowedUsers.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      No test users whitelisted. (Admins still retain access).
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Grid for System Health Cards */}
      <Typography variant="h6" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Activity size={20} color="#2563eb" /> System Health Status
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        
        {/* Memory/CPU Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Server OS Metrics
                </Typography>
                <Cpu size={20} color="#2563eb" />
              </Box>
              {loadingHealth ? (
                <CircularProgress size={24} />
              ) : health ? (
                <Box>
                  <Typography variant="h4" fontWeight={900} sx={{ mb: 1, letterSpacing: '-1px' }}>
                    {health.system.memoryUsagePercentage.toFixed(1)}% <Typography component="span" variant="body2" color="text.secondary">RAM Use</Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Free Memory: {formatBytes(health.system.freeMemory)} / {formatBytes(health.system.totalMemory)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    CPU Load (1m, 5m, 15m): {health.system.cpuLoad.map(v => v.toFixed(2)).join(', ')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Uptime: {(health.uptime / 3600).toFixed(2)} hours
                  </Typography>
                </Box>
              ) : (
                <Typography color="error">Unavailable</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Database Status Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Database Connection
                </Typography>
                <Database size={20} color="#16a34a" />
              </Box>
              {loadingHealth ? (
                <CircularProgress size={24} />
              ) : health ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    {health.services.database.status === 'Healthy' ? (
                      <CheckCircle2 size={24} color="#16a34a" />
                    ) : (
                      <XCircle size={24} color="#dc2626" />
                    )}
                    <Typography variant="h5" fontWeight={900}>
                      {health.services.database.status}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    MongoDB connection state: {health.services.database.connectionState} (Connected)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    DNS Status: <Chip label={health.dns.status} color={health.dns.status === 'Healthy' ? 'success' : 'error'} size="small" sx={{ fontSize: '0.65rem', height: 18 }} />
                  </Typography>
                </Box>
              ) : (
                <Typography color="error">Unavailable</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Integrations Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  External Integrations
                </Typography>
                <Layers size={20} color="#ca8a04" />
              </Box>
              {loadingHealth ? (
                <CircularProgress size={24} />
              ) : health ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight={600}>Razorpay Credentials</Typography>
                    <Chip label={health.services.razorpay.status} color={health.services.razorpay.status === 'Configured' ? 'success' : 'error'} size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight={600}>Cloudinary Uploads</Typography>
                    <Chip label={health.services.cloudinary.status} color={health.services.cloudinary.status === 'Configured' ? 'success' : 'error'} size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight={600}>Google OAuth Services</Typography>
                    <Chip label={health.services.googleOAuth.status} color={health.services.googleOAuth.status === 'Configured' ? 'success' : 'error'} size="small" />
                  </Box>
                </Box>
              ) : (
                <Typography color="error">Unavailable</Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Render Cold Start Prevention Section */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 5, border: '1px solid #e0f2fe', bgcolor: '#f0f9ff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: '#e0f2fe', borderRadius: '12px', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={24} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={800} color="#0369a1">
                Render Cold-Start Prevention
              </Typography>
              <Typography variant="body2" color="#0284c7">
                Self-pinging background worker is active. The server will ping itself every 10 minutes in production mode to avoid free-tier dormancy.
              </Typography>
            </Box>
          </Box>
          <Chip label="Worker Active" color="info" sx={{ fontWeight: 700 }} />
        </Box>
      </Paper>

      {/* Data Integrity Section */}
      <Typography variant="h6" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ShieldAlert size={20} color="#e11d48" /> Database Integrity Diagnostics
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, mb: 5 }}>
        {loadingIntegrity ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
        ) : integrity ? (
          <Box>
            {integrity.summary.isClean ? (
              <Alert severity="success" sx={{ borderRadius: 2, mb: 3 }}>
                Data integrity check passed perfectly! No orphaned or duplicate records were detected in the database.
              </Alert>
            ) : (
              <Alert severity="warning" sx={{ borderRadius: 2, mb: 3 }}>
                Data integrity checks flagged some issues. Review the details below and execute self-healing if necessary.
              </Alert>
            )}

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <Typography variant="h4" fontWeight={900} color={integrity.summary.orphanEnrollmentsCount > 0 ? 'error.main' : 'text.primary'}>
                    {integrity.summary.orphanEnrollmentsCount}
                  </Typography>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">Orphaned Enrollments</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <Typography variant="h4" fontWeight={900} color={integrity.summary.duplicateEnrollmentsCount > 0 ? 'warning.main' : 'text.primary'}>
                    {integrity.summary.duplicateEnrollmentsCount}
                  </Typography>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">Duplicate Enrollments</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <Typography variant="h4" fontWeight={900} color={integrity.summary.orphanProgressCount > 0 ? 'error.main' : 'text.primary'}>
                    {integrity.summary.orphanProgressCount}
                  </Typography>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">Orphaned Progress Logs</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <Typography variant="h4" fontWeight={900} color={integrity.summary.orphanCertificatesCount > 0 ? 'error.main' : 'text.primary'}>
                    {integrity.summary.orphanCertificatesCount}
                  </Typography>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">Orphaned Certificates</Typography>
                </Box>
              </Grid>
            </Grid>

            {!integrity.summary.isClean && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleHeal}
                  disabled={healing}
                  sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}
                >
                  {healing ? <CircularProgress size={20} color="inherit" /> : 'Run Auto-Healing Routine'}
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Typography color="error">Failed to load diagnostics report.</Typography>
        )}
      </Paper>

      {/* Error Logging console */}
      <Typography variant="h6" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ShieldAlert size={20} color="#f59e0b" /> Production Error Logs
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, mb: 3 }}>
        {loadingLogs ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : (
          <Box>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.100' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Method</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Path</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Error Message</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logsData.logs.map((log) => (
                  <TableRow key={log._id} hover>
                    <TableCell sx={{ fontSize: '0.825rem' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.method}
                        size="small"
                        color={log.method === 'POST' ? 'success' : log.method === 'GET' ? 'info' : 'warning'}
                        sx={{ fontWeight: 800, fontSize: '0.65rem' }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.825rem' }}>{log.path}</TableCell>
                    <TableCell sx={{ color: 'error.main', fontSize: '0.825rem', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.message}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.825rem' }}>
                      {log.user ? (
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{log.user.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{log.user.email}</Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">Guest User</Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => setSelectedLog(log)} color="primary">
                        <Eye size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {logsData.logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No errors recorded in logs.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {logsData.pages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <Pagination
                  count={logsData.pages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </Box>
        )}
      </TableContainer>

      {/* Expandable Log details modal */}
      <Dialog
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        closeAfterTransition={false}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
          <Info size={22} /> Production Error Stack Trace
        </DialogTitle>
        <DialogContent dividers>
          {selectedLog && (
            <Box>
              <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>
                {selectedLog.message}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Typography variant="caption" color="text.secondary">
                  <strong>Path:</strong> {selectedLog.method} {selectedLog.path}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  <strong>IP Address:</strong> {selectedLog.ip || 'N/A'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  <strong>Time:</strong> {new Date(selectedLog.createdAt).toLocaleString()}
                </Typography>
              </Box>

              <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>Request Metadata</Typography>
              <Paper sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 2, mb: 3, overflow: 'auto', maxHeight: 200 }}>
                <pre style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'Courier New, monospace' }}>
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </Paper>

              <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>Stack Trace</Typography>
              <Paper sx={{ p: 2, bgcolor: '#1e293b', color: '#f8fafc', borderRadius: 2, overflow: 'auto', maxHeight: 300 }}>
                <pre style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'Courier New, monospace', whiteSpace: 'pre-wrap' }}>
                  {selectedLog.stack || 'No stack trace recorded.'}
                </pre>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedLog(null)} variant="contained" sx={{ px: 4, borderRadius: 2 }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSystemMonitor;
