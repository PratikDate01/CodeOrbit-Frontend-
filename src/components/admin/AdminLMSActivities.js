import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
  Divider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip
} from '@mui/material';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Video,
  FileText,
  HelpCircle,
  FileDown,
  ExternalLink,
  Type
} from 'lucide-react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const AdminLMSActivities = () => {
  const { programId, courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [activities, setActivities] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Video',
    content: '',
    order: 0,
    isRequired: true
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [activitiesRes, lessonsRes] = await Promise.all([
        API.get(`/admin/lms/lessons/${lessonId}/activities`),
        API.get(`/admin/lms/modules/${moduleId}/lessons`)
      ]);
      
      setActivities(activitiesRes.data);
      const currentLesson = lessonsRes.data.find(l => l._id === lessonId);
      setLesson(currentLesson);
    } catch (error) {
      showNotification('Error fetching activities', 'error');
    } finally {
      setLoading(false);
    }
  }, [moduleId, lessonId, showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpen = (activity = null) => {
    if (activity) {
      setEditingActivity(activity);
      setFormData({
        title: activity.title,
        type: activity.type,
        content: activity.content || '',
        order: activity.order || 0,
        isRequired: activity.isRequired !== undefined ? activity.isRequired : true
      });
    } else {
      setEditingActivity(null);
      setFormData({
        title: '',
        type: 'Video',
        content: '',
        order: activities.length + 1,
        isRequired: true
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    if (submitting) return;
    setOpen(false);
    setEditingActivity(null);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      if (editingActivity) {
        await API.put(`/admin/lms/activities/${editingActivity._id}`, formData);
        showNotification('Activity updated successfully', 'success');
      } else {
        await API.post('/admin/lms/activities', { ...formData, lesson: lessonId });
        showNotification('Activity created successfully', 'success');
      }
      fetchData();
      handleClose();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error saving activity', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      const originalActivities = [...activities];
      setActivities(activities.filter(a => a._id !== id));

      try {
        setDeletingId(id);
        await API.delete(`/admin/lms/activities/${id}`);
        showNotification('Activity deleted successfully', 'success');
      } catch (error) {
        setActivities(originalActivities);
        showNotification(error.response?.data?.message || 'Error deleting activity', 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'Video': return <Video size={20} />;
      case 'PDF': return <FileDown size={20} />;
      case 'Quiz': return <HelpCircle size={20} />;
      case 'Text': return <Type size={20} />;
      case 'ExternalLink': return <ExternalLink size={20} />;
      default: return <FileText size={20} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <MuiLink component={Link} to="/admin/lms/programs" underline="hover" color="inherit" sx={{ fontSize: '0.8rem' }}>
            Programs
          </MuiLink>
          <MuiLink component={Link} to={`/admin/lms/programs/${programId}/courses`} underline="hover" color="inherit" sx={{ fontSize: '0.8rem' }}>
            Courses
          </MuiLink>
          <MuiLink component={Link} to={`/admin/lms/programs/${programId}/courses/${courseId}/modules`} underline="hover" color="inherit" sx={{ fontSize: '0.8rem' }}>
            Modules
          </MuiLink>
          <MuiLink component={Link} to={`/admin/lms/programs/${programId}/courses/${courseId}/modules/${moduleId}/lessons`} underline="hover" color="inherit" sx={{ fontSize: '0.8rem' }}>
            Lessons
          </MuiLink>
          <Typography color="text.primary" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
            Activities
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate(`/admin/lms/programs/${programId}/courses/${courseId}/modules/${moduleId}/lessons`)} size="small" sx={{ bgcolor: 'action.hover' }}>
              <ArrowLeft size={18} />
            </IconButton>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {lesson?.title} - Activities
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage learning content, videos, and quizzes for this lesson
              </Typography>
            </Box>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<Plus size={18} />} 
            onClick={() => handleOpen()}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Add Activity
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {activities.map((activity, index) => (
          <Grid item xs={12} key={activity._id}>
            <Card sx={{ 
              display: 'flex', 
              alignItems: 'center',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              p: 1.5,
              transition: 'all 0.2s ease-in-out',
              '&:hover': { 
                borderColor: 'primary.main', 
                bgcolor: 'rgba(0,0,0,0.01)'
              }
            }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: 2, 
                bgcolor: 'primary.lighter', 
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}>
                {getActivityIcon(activity.type)}
              </Box>
              
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {activity.title}
                  </Typography>
                  <Chip 
                    label={activity.type} 
                    size="small" 
                    variant="outlined" 
                    sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} 
                  />
                  {!activity.isRequired && (
                    <Chip 
                      label="Optional" 
                      size="small" 
                      sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: 'action.hover' }} 
                    />
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activity.content || 'No content description'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" fontWeight={700} color="text.muted" sx={{ mr: 2 }}>
                  Order: {activity.order}
                </Typography>
                <IconButton size="small" onClick={() => handleOpen(activity)} sx={{ color: 'text.secondary' }}>
                  <Edit size={16} />
                </IconButton>
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => handleDelete(activity._id)}
                  disabled={deletingId === activity._id}
                >
                  {deletingId === activity._id ? <CircularProgress size={16} /> : <Trash2 size={16} />}
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
        {activities.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ py: 6, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
              <Typography color="text.secondary">No activities found for this lesson.</Typography>
              <Button 
                variant="outlined" 
                startIcon={<Plus size={18} />} 
                onClick={() => handleOpen()}
                sx={{ mt: 2 }}
              >
                Add your first activity
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingActivity ? 'Edit Activity' : 'Add New Activity'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              label="Activity Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              variant="outlined"
            />
            
            <FormControl fullWidth>
              <InputLabel>Activity Type</InputLabel>
              <Select
                value={formData.type}
                label="Activity Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="Video">Video (YouTube/Vimeo/Direct Link)</MenuItem>
                <MenuItem value="PDF">PDF Document (URL)</MenuItem>
                <MenuItem value="Text">Text/Markdown Content</MenuItem>
                <MenuItem value="Quiz">Interactive Quiz</MenuItem>
                <MenuItem value="Assignment">Assignment Submission</MenuItem>
                <MenuItem value="ExternalLink">External Resource Link</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label={formData.type === 'Text' ? 'Content (Markdown/HTML)' : 'Content URL / Resource'}
              multiline={formData.type === 'Text'}
              rows={formData.type === 'Text' ? 8 : 1}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              variant="outlined"
              placeholder={formData.type === 'Video' ? 'https://youtube.com/watch?v=...' : ''}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                variant="outlined"
                sx={{ width: 120 }}
              />
              <FormControl fullWidth>
                <InputLabel>Requirement</InputLabel>
                <Select
                  value={formData.isRequired}
                  label="Requirement"
                  onChange={(e) => setFormData({ ...formData, isRequired: e.target.value })}
                >
                  <MenuItem value={true}>Mandatory to complete</MenuItem>
                  <MenuItem value={false}>Optional activity</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            sx={{ px: 3 }}
            disabled={submitting}
            startIcon={submitting && <CircularProgress size={16} color="inherit" />}
          >
            {submitting ? 'Saving...' : (editingActivity ? 'Save Changes' : 'Create Activity')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLMSActivities;
