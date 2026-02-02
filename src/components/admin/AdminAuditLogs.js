import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Skeleton,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { Search, Shield, ChevronDown, Clock, Activity, Target } from 'lucide-react';
import API from '../../api/api';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, [page, rowsPerPage]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/admin/audit-logs?page=${page + 1}&limit=${rowsPerPage}`);
      setLogs(data.logs);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getActionColor = (action) => {
    if (action.includes('DELETE')) return 'error';
    if (action.includes('UPDATE')) return 'warning';
    if (action.includes('CREATE')) return 'success';
    if (action.includes('APPROVE')) return 'info';
    return 'default';
  };

  const formatDetails = (details) => {
    if (!details) return 'No additional details';
    return JSON.stringify(details, null, 2);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, letterSpacing: '-1px' }}>
          Audit Logs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Detailed history of administrative actions for transparency and accountability.
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search logs..."
            size="small"
            sx={{ 
              width: { xs: '100%', sm: 350 },
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.alt',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'divider' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#64748b" />
                </InputAdornment>
              ),
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {total} total operations logged
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'background.alt' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.85rem' }}>ADMIN</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.85rem' }}>ACTION</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.85rem' }}>TARGET</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.85rem' }}>TIMESTAMP</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.85rem' }}>DETAILS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton variant="text" width={120} /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={100} height={24} /></TableCell>
                    <TableCell><Skeleton variant="text" width={150} /></TableCell>
                    <TableCell><Skeleton variant="text" width={120} /></TableCell>
                    <TableCell align="right"><Skeleton variant="circular" width={32} height={32} sx={{ ml: 'auto' }} /></TableCell>
                  </TableRow>
                ))
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: 'primary.light', 
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {log.admin?.name?.charAt(0) || 'A'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{log.admin?.name || 'Unknown Admin'}</Typography>
                          <Typography variant="caption" color="text.secondary">{log.admin?.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={log.actionType} 
                        size="small" 
                        color={getActionColor(log.actionType)}
                        sx={{ fontWeight: 700, fontSize: '0.65rem', borderRadius: 1.5 }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2" fontWeight={600}>{log.targetType}</Typography>
                        <Typography variant="caption" color="text.secondary">ID: {log.targetId}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Clock size={14} color="#64748b" />
                        <Typography variant="body2">
                          {new Date(log.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Accordion sx={{ 
                        boxShadow: 'none', 
                        bgcolor: 'transparent',
                        '&:before': { display: 'none' }
                      }}>
                        <AccordionSummary
                          expandIcon={<ChevronDown size={16} />}
                          sx={{ minHeight: 'unset', '.MuiAccordionSummary-content': { my: 0.5 } }}
                        >
                          <Typography variant="caption" fontWeight={600} color="primary">View JSON</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 1, bgcolor: 'background.alt', borderRadius: 1 }}>
                          <pre style={{ margin: 0, fontSize: '10px', textAlign: 'left', overflowX: 'auto' }}>
                            {formatDetails(log.details)}
                          </pre>
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <Box sx={{ opacity: 0.5, textAlign: 'center' }}>
                      <Shield size={48} style={{ marginBottom: '16px' }} />
                      <Typography variant="h6">No logs found</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        />
      </Paper>
    </Box>
  );
};

export default AdminAuditLogs;
