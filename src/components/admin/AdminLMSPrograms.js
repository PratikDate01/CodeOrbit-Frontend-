import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Switch,
  FormControlLabel,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  Plus, 
  Edit, 
  BookOpen, 
  Trash2, 
  CheckCircle2,
  XCircle
} from 'lucide-react';
import API from '../../api/api';

const AdminLMSPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const { data } = await API.get('/admin/lms/programs');
      setPrograms(data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleCreate = async () => {
    try {
      await API.post('/admin/lms/programs', formData);
      setOpen(false);
      fetchPrograms();
      setFormData({ title: '', description: '', internshipDomain: '', duration: '', thumbnail: '' });
    } catch (error) {
      console.error('Error creating program:', error);
    }
  };

  const handleTogglePublish = async (program) => {
    try {
      await API.put(`/admin/lms/programs/${program._id}`, { isPublished: !program.isPublished });
      fetchPrograms();
    } catch (error) {
      console.error('Error updating program:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this program? All associated courses and content will remain but the program entry will be removed.')) {
      try {
        await API.delete(`/admin/lms/programs/${id}`);
        fetchPrograms();
      } catch (error) {
        console.error('Error deleting program:', error);
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
          <Grid item xs={12} md={6} lg={4} key={program._id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              overflow: 'hidden',
              transition: 'all 0.2s',
              '&:hover': { borderColor: 'primary.main', transform: 'translateY(-4px)' }
            }}>
              <CardMedia
                component="img"
                height="160"
                image={program.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop'}
                alt={program.title}
              />
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Chip 
                    label={program.internshipDomain} 
                    size="small" 
                    color="primary" 
                    variant="soft" 
                    sx={{ fontWeight: 600, borderRadius: 1.5 }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {program.isPublished ? (
                      <Chip 
                        icon={<CheckCircle2 size={14} />} 
                        label="Live" 
                        size="small" 
                        color="success" 
                        variant="filled"
                        sx={{ height: 24, fontSize: '0.75rem', fontWeight: 700 }}
                      />
                    ) : (
                      <Chip 
                        icon={<XCircle size={14} />} 
                        label="Draft" 
                        size="small" 
                        color="default" 
                        variant="filled"
                        sx={{ height: 24, fontSize: '0.75rem', fontWeight: 700 }}
                      />
                    )}
                  </Box>
                </Box>
                
                <Typography variant="h6" fontWeight={800} gutterBottom sx={{ lineHeight: 1.3 }}>
                  {program.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ 
                  mb: 3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.6
                }}>
                  {program.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                    <BookOpen size={16} />
                    <Typography variant="caption" fontWeight={600}>Courses Available</Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 2, opacity: 0.6 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Manage Content">
                      <IconButton size="small" sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                        <Edit size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Program">
                      <IconButton 
                        size="small" 
                        color="error" 
                        sx={{ bgcolor: 'error.lighter' }}
                        onClick={() => handleDelete(program._id)}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <FormControlLabel
                    control={
                      <Switch 
                        size="small"
                        checked={program.isPublished} 
                        onChange={() => handleTogglePublish(program)}
                      />
                    }
                    label={<Typography variant="caption" fontWeight={700}>{program.isPublished ? 'Public' : 'Private'}</Typography>}
                    labelPlacement="start"
                    sx={{ m: 0 }}
                  />
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
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLMSPrograms;
