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

  const handleCreate = async () => {
    try {
      setSubmitting(true);
      await API.post('/admin/lms/programs', formData);
      showNotification('Program created successfully', 'success');
      setOpen(false);
      fetchPrograms();
      setFormData({ title: '', description: '', internshipDomain: '', duration: '', thumbnail: '' });
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error creating program', 'error');
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
          onClick={() => setOpen(true)}
        >
          Create Program
        </Button>
      </Box>

      <Grid container spacing={3}>
        {programs.map((program) => (
          <Grid item xs={12} sm={6} lg={4} key={program._id}>
            <Card sx={{ 
              height: '100%',
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              overflow: 'hidden',
              transition: 'all 0.2s ease-in-out',
              '&:hover': { 
                borderColor: 'primary.main', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transform: 'translateY(-4px)'
              }
            }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  sx={{ height: 180, width: '100%', objectFit: 'cover' }}
                  image={program.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop'}
                  alt={program.title}
                />
                <Box sx={{ 
                  position: 'absolute', 
                  top: 12, 
                  right: 12, 
                  bgcolor: program.isPublished ? 'success.main' : 'text.disabled',
                  color: 'white',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {program.isPublished ? "Live" : "Draft"}
                </Box>
              </Box>

              <CardContent sx={{ 
                flexGrow: 1, 
                p: 2.5, 
                display: 'flex', 
                flexDirection: 'column',
                gap: 1.5
              }}>
                <Box>
                  <Typography 
                    variant="caption" 
                    fontWeight={800} 
                    color="primary" 
                    sx={{ 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.5px',
                      fontSize: '0.7rem',
                      bgcolor: 'primary.lighter',
                      px: 1,
                      py: 0.4,
                      borderRadius: 1,
                      display: 'inline-block',
                      mb: 1.5
                    }}
                  >
                    {program.internshipDomain}
                  </Typography>
                  
                  <Typography variant="h6" fontWeight={700} sx={{ 
                    lineHeight: 1.3, 
                    mb: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {program.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.6,
                    minHeight: '4.8em' // 3 lines * 1.6
                  }}>
                    {program.description}
                  </Typography>
                </Box>

                <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit Details">
                      <IconButton 
                        size="small" 
                        sx={{ 
                          bgcolor: 'action.hover',
                          '&:hover': { bgcolor: 'primary.lighter', color: 'primary.main' }
                        }}
                      >
                        <Edit size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Manage Courses">
                      <IconButton 
                        size="small" 
                        onClick={() => navigate(`/admin/lms/programs/${program._id}/courses`)}
                        sx={{ 
                          bgcolor: 'action.hover',
                          color: 'primary.main',
                          '&:hover': { bgcolor: 'primary.main', color: 'white' }
                        }}
                      >
                        <BookOpen size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDelete(program._id)}
                        disabled={deletingId === program._id}
                        sx={{ 
                          bgcolor: 'action.hover',
                          '&:hover': { bgcolor: 'error.lighter' }
                        }}
                      >
                        {deletingId === program._id ? <CircularProgress size={16} /> : <Trash2 size={16} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                      {program.isPublished ? 'Published' : 'Draft'}
                    </Typography>
                    {togglingId === program._id ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Switch 
                        size="small"
                        checked={program.isPublished} 
                        onChange={() => handleTogglePublish(program)}
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
        <DialogTitle>Create New Program</DialogTitle>
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
            onClick={handleCreate}
            disabled={submitting}
            startIcon={submitting && <CircularProgress size={16} color="inherit" />}
          >
            {submitting ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLMSPrograms;
