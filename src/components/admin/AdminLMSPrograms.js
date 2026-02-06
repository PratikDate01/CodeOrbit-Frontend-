import React, { useState, useEffect } from 'react';
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

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/lms/programs');
      setPrograms(data);
    } catch (error) {
      showNotification('Error fetching programs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

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

      <Grid container spacing={2}>
        {programs.map((program) => (
          <Grid item xs={12} md={6} lg={4} key={program._id}>
            <Card sx={{ 
              display: 'flex', 
              height: 120,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              overflow: 'hidden',
              transition: 'all 0.2s',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'background.alt' }
            }}>
              <CardMedia
                component="img"
                sx={{ width: 120, height: 120, objectFit: 'cover' }}
                image={program.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop'}
                alt={program.title}
              />
              <CardContent sx={{ 
                flex: 1, 
                p: '12px !important', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                overflow: 'hidden'
              }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography 
                      variant="caption" 
                      fontWeight={700} 
                      color="primary" 
                      sx={{ 
                        textTransform: 'uppercase', 
                        fontSize: '0.6rem',
                        bgcolor: 'primary.lighter',
                        px: 0.8,
                        borderRadius: 0.5
                      }}
                    >
                      {program.internshipDomain}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: program.isPublished ? 'success.main' : 'text.disabled' }} />
                      <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.65rem' }}>
                        {program.isPublished ? "Live" : "Draft"}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ lineHeight: 1.2 }}>
                    {program.title}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.3,
                    height: '2.6em',
                    mt: 0.5
                  }}>
                    {program.description}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit Details">
                      <IconButton size="small" sx={{ p: 0.5 }}>
                        <Edit size={14} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Manage Courses">
                      <IconButton 
                        size="small" 
                        sx={{ p: 0.5, color: 'primary.main' }}
                        onClick={() => navigate(`/admin/lms/programs/${program._id}/courses`)}
                      >
                        <BookOpen size={14} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDelete(program._id)}
                        sx={{ p: 0.5 }}
                        disabled={deletingId === program._id}
                      >
                        {deletingId === program._id ? <CircularProgress size={14} /> : <Trash2 size={14} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  {togglingId === program._id ? (
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                  ) : (
                    <Switch 
                      size="small"
                      checked={program.isPublished} 
                      onChange={() => handleTogglePublish(program)}
                      sx={{ transform: 'scale(0.8)' }}
                    />
                  )}
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
