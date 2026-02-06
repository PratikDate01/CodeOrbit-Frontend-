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
  IconButton,
  Modal,
  Button,
  Avatar,
  Tooltip,
  Skeleton,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress
} from '@mui/material';
import { Eye, Trash2, Mail, Phone, Calendar, Search, MessageSquare } from 'lucide-react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const AdminMessages = () => {
  const { showNotification } = useNotification();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/contact');
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setProcessingId(id);
    try {
      await API.put(`/contact/${id}/status`, { status });
      showNotification(`Message marked as ${status.toLowerCase()}`, 'success');
      fetchMessages();
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(prev => ({ ...prev, status }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showNotification('Failed to update message status', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message?')) {
      setProcessingId(id);
      try {
        await API.delete(`/contact/${id}`);
        showNotification('Message deleted successfully', 'success');
        fetchMessages();
      } catch (error) {
        console.error('Error deleting:', error);
        showNotification('Failed to delete message', 'error');
      } finally {
        setProcessingId(null);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || msg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedMessages = filteredMessages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'error';
      case 'Read': return 'info';
      case 'Resolved': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, letterSpacing: '-1px' }}>
          Contact Messages
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review inquiries and messages from the contact form.
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search messages..."
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
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
          />

          <Box sx={{ display: 'flex', gap: 1 }}>
            {['all', 'New', 'Read', 'Resolved'].map((status) => (
              <Chip
                key={status}
                label={status}
                onClick={() => { setStatusFilter(status); setPage(0); }}
                variant={statusFilter === status ? "contained" : "outlined"}
                color={statusFilter === status ? (status === 'all' ? 'primary' : getStatusColor(status)) : "default"}
                sx={{ 
                  borderRadius: 2, 
                  fontWeight: 600
                }}
              />
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {filteredMessages.length} messages
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'background.alt' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.85rem' }}>SENDER</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.85rem' }}>SUBJECT</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.85rem' }}>DATE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.85rem' }}>STATUS</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.85rem' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton variant="text" width={150} /><Skeleton variant="text" width={100} height={15} /></TableCell>
                    <TableCell><Skeleton variant="text" width={200} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                    <TableCell align="right"><Skeleton variant="circular" width={32} height={32} sx={{ ml: 'auto' }} /></TableCell>
                  </TableRow>
                ))
              ) : paginatedMessages.length > 0 ? (
                paginatedMessages.map((msg) => (
                  <TableRow key={msg._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', fontSize: '0.8rem' }}>
                          {msg.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{msg.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{msg.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500} sx={{ maxWidth: 300, noWrap: true, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {msg.subject}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{new Date(msg.createdAt).toLocaleDateString()}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={msg.status || 'New'} 
                        size="small" 
                        color={getStatusColor(msg.status || 'New')}
                        sx={{ fontWeight: 700, fontSize: '0.65rem', borderRadius: 1.5 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Message">
                        <IconButton 
                          color="primary" 
                          disabled={processingId === msg._id}
                          onClick={() => { 
                            setSelectedMessage(msg); 
                            setOpen(true); 
                            if (!msg.status || msg.status === 'New') {
                              handleUpdateStatus(msg._id, 'Read');
                            }
                          }}
                          sx={{ border: '1px solid', borderColor: 'divider', mr: 1 }}
                        >
                          <Eye size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          color="error" 
                          disabled={processingId === msg._id}
                          onClick={() => handleDelete(msg._id)}
                          sx={{ border: '1px solid', borderColor: 'divider' }}
                        >
                          {processingId === msg._id ? <CircularProgress size={16} color="inherit" /> : <Trash2 size={16} />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <Box sx={{ opacity: 0.5, textAlign: 'center' }}>
                      <MessageSquare size={48} style={{ marginBottom: '16px' }} />
                      <Typography variant="h6">No messages found</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredMessages.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        />
      </Paper>

      <Modal 
        open={open} 
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Paper sx={{
          width: '100%',
          maxWidth: 600,
          borderRadius: 4,
          overflow: 'hidden',
          outline: 'none'
        }}>
          {selectedMessage && (
            <Box>
              <Box sx={{ p: 3, bgcolor: 'background.alt', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight={800}>{selectedMessage.subject}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                    <Mail size={16} />
                    <Typography variant="caption" fontWeight={600}>{selectedMessage.email}</Typography>
                  </Box>
                  {selectedMessage.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <Phone size={16} />
                      <Typography variant="caption" fontWeight={600}>{selectedMessage.phone}</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                    <Calendar size={16} />
                    <Typography variant="caption" fontWeight={600}>{new Date(selectedMessage.createdAt).toLocaleString()}</Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ p: 4 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'text.primary' }}>
                  {selectedMessage.message}
                </Typography>

                <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="outlined" color="inherit" onClick={() => setOpen(false)} sx={{ borderRadius: 2 }}>
                    Close
                  </Button>
                  {selectedMessage.status !== 'Resolved' && (
                    <Button 
                      variant="contained" 
                      color="success"
                      onClick={() => handleUpdateStatus(selectedMessage._id, 'Resolved')}
                      sx={{ borderRadius: 2 }}
                    >
                      Mark as Resolved
                    </Button>
                  )}
                  <Button 
                    variant="contained" 
                    component="a" 
                    href={`mailto:${selectedMessage.email}`}
                    startIcon={<Mail size={18} />}
                    sx={{ borderRadius: 2 }}
                  >
                    Reply via Email
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Paper>
      </Modal>
    </Box>
  );
};

export default AdminMessages;
