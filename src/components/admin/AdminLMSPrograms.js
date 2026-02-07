import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Switch,
  Tooltip,
} from '@mui/material';
import { 
  Plus, 
  Edit, 
  BookOpen, 
  Trash2, 
} from 'lucide-react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const AdminLMSPrograms = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    internshipDomain: '',
    duration: '',
    thumbnail: ''
  });

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/lms/programs');
      setPrograms(data);
    } catch (error) {
      showNotification('Error fetching programs', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const handleOpen = (program = null) => {
    if (program) {
      setEditingProgram(program);
      setFormData({
        title: program.title,
        description: program.description,
        internshipDomain: program.internshipDomain,
        duration: program.duration,
        thumbnail: program.thumbnail || ''
      });
    } else {
      setEditingProgram(null);
      setFormData({ title: '', description: '', internshipDomain: '', duration: '', thumbnail: '' });
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      if (editingProgram) {
        await API.put(`/admin/lms/programs/${editingProgram._id}`, formData);
        showNotification('Program updated successfully', 'success');
      } else {
        await API.post('/admin/lms/programs', formData);
        showNotification('Program created successfully', 'success');
      }
      setOpen(false);
      fetchPrograms();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error saving program', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (program) => {
    try {
      setTogglingId(program._id);
      await API.put(`/admin/lms/programs/${program._id}`, { isPublished: !program.isPublished });
      showNotification(`Program ${!program.isPublished ? 'published' : 'unpublished'}`, 'success');
      fetchPrograms();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error updating program', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this program? All associated courses and content will remain but the program entry will be removed.')) {
      try {
        setDeletingId(id);
        await API.delete(`/admin/lms/programs/${id}`);
        showNotification('Program deleted successfully', 'success');
        fetchPrograms();
      } catch (error) {
        showNotification(error.response?.data?.message || 'Error deleting program', 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h6" fontWeight={700}>Available Programs</Typography>
        <Button 
          variant="contained" 
          startIcon={<Plus size={18} />} 
          onClick={() => handleOpen()}
        >
          Create Program
        </Button>
      </Box>

      <Grid container spacing={2.5}>
        {programs.map((program) => (
          <Grid item xs={12} sm={6} lg={4} key={program._id}>
            <Card sx={{ 
              height: 380, // Enforce identical height
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              overflow: 'hidden',
              transition: 'all 0.15s ease-in-out',
              '&:hover': { 
                borderColor: 'primary.main', 
                bgcolor: 'rgba(0,0,0,0.01)'
              }
            }}>
              {/* Thumbnail Section - Fixed Height */}
              <Box sx={{ height: 140, overflow: 'hidden', position: 'relative', bgcolor: 'action.hover' }}>
                <CardMedia
                  component="img"
                  sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
                  image={program.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop'}
                  alt={program.title}
                />
                <Box sx={{ 
                  position: 'absolute', 
                  top: 10, 
                  right: 10, 
                  bgcolor: program.isPublished ? 'success.main' : 'text.disabled',
                  color: 'white',
                  px: 1,
                  py: 0.3,
                  borderRadius: 1,
                  fontSize: '0.6rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {program.isPublished ? "Live" : "Draft"}
                </Box>
              </Box>

              <CardContent sx={{ 
                p: 2, 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column' 
              }}>
                {/* Program Category */}
                <Typography 
                  variant="caption" 
                  fontWeight={800} 
                  color="primary.main"
                  sx={{ 
                    textTransform: 'uppercase', 
                    fontSize: '0.65rem',
                    letterSpacing: '1px',
                    mb: 1,
                    display: 'block'
                  }}
                >
                  {program.internshipDomain}
                </Typography>
                
                {/* Program Title - Clamped to 2 lines */}
                <Box sx={{ minHeight: 44, mb: 0.5 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ 
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    color: 'text.primary',
                    fontSize: '0.9rem'
                  }}>
                    {program.title}
                  </Typography>
                </Box>
                
                {/* Description - Clamped to 2 lines */}
                <Box sx={{ minHeight: 36, mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.4,
                    fontSize: '0.75rem'
                  }}>
                    {program.description}
                  </Typography>
                </Box>

                {/* Actions + Status Row */}
                <Box sx={{ 
                  mt: 'auto', 
                  pt: 1.5, 
                  borderTop: '1px solid', 
                  borderColor: 'divider', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between' 
                }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpen(program)}
                        sx={{ p: 0.5, color: 'text.secondary' }}
                      >
                        <Edit size={14} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Manage Courses">
                      <IconButton 
                        size="small" 
                        onClick={() => navigate(`/admin/lms/programs/${program._id}/courses`)}
                        sx={{ p: 0.5, color: 'primary.main' }}
                      >
                        <BookOpen size={14} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDelete(program._id)}
                        disabled={deletingId === program._id}
                        sx={{ p: 0.5 }}
                      >
                        {deletingId === program._id ? <CircularProgress size={14} /> : <Trash2 size={14} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.6rem', textTransform: 'uppercase' }}>
                      {program.isPublished ? 'Live' : 'Draft'}
                    </Typography>
                    {togglingId === program._id ? (
                      <CircularProgress size={16} sx={{ ml: 1 }} />
                    ) : (
                      <Switch 
                        size="small"
                        checked={program.isPublished} 
                        onChange={() => handleTogglePublish(program)}
                        sx={{ 
                          width: 34,
                          height: 20,
                          padding: 0,
                          display: 'flex',
                          '& .MuiSwitch-switchBase': {
                            padding: '3px',
                            '&.Mui-checked': {
                              transform: 'translateX(14px)',
                            },
                          },
                          '& .MuiSwitch-thumb': {
                            width: 14,
                            height: 14,
                            boxShadow: 'none',
                          },
                          '& .MuiSwitch-track': {
                            borderRadius: 10,
                          },
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProgram ? 'Edit Program' : 'Create New Program'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              label="Title" 
              fullWidth 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
            />
            <TextField 
              label="Description" 
              fullWidth 
              multiline 
              rows={4} 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
            <TextField 
              label="Internship Domain" 
              fullWidth 
              value={formData.internshipDomain} 
              onChange={(e) => setFormData({...formData, internshipDomain: e.target.value})} 
              placeholder="e.g. Web Development"
            />
            <TextField 
              label="Duration" 
              fullWidth 
              value={formData.duration} 
              onChange={(e) => setFormData({...formData, duration: e.target.value})} 
              placeholder="e.g. 4 Weeks"
            />
            <TextField 
              label="Thumbnail URL" 
              fullWidth 
              value={formData.thumbnail} 
              onChange={(e) => setFormData({...formData, thumbnail: e.target.value})} 
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={submitting}
            startIcon={submitting && <CircularProgress size={16} color="inherit" />}
          >
            {submitting ? 'Saving...' : (editingProgram ? 'Save Changes' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLMSPrograms;
