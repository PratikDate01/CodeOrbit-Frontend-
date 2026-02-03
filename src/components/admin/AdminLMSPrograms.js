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
  CircularProgress
} from '@mui/material';
import { Plus, Edit, BookOpen } from 'lucide-react';
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
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image={program.thumbnail || 'https://via.placeholder.com/300x140?text=No+Thumbnail'}
                alt={program.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip label={program.internshipDomain} size="small" color="primary" variant="outlined" />
                  <Typography variant="caption" color="text.secondary">{program.duration}</Typography>
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>{program.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  mb: 2
                }}>
                  {program.description}
                </Typography>
                <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<BookOpen size={16} />}
                    fullWidth
                  >
                    Manage
                  </Button>
                  <IconButton size="small" color="primary">
                    <Edit size={18} />
                  </IconButton>
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
