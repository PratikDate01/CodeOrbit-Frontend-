import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
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
} from '@mui/material';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Activity,
  ChevronRight
} from 'lucide-react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const AdminLMSLessons = () => {
  const { programId, courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [lessons, setLessons] = useState([]);
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [lessonsRes, modulesRes] = await Promise.all([
        API.get(`/admin/lms/modules/${moduleId}/lessons`),
        API.get(`/admin/lms/courses/${courseId}/modules`)
      ]);
      
      setLessons(lessonsRes.data);
      const currentModule = modulesRes.data.find(m => m._id === moduleId);
      setModule(currentModule);
    } catch (error) {
      showNotification('Error fetching lessons', 'error');
    } finally {
      setLoading(false);
    }
  }, [courseId, moduleId, showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpen = (lesson = null) => {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({
        title: lesson.title,
        description: lesson.description,
        order: lesson.order || 0
      });
    } else {
      setEditingLesson(null);
      setFormData({
        title: '',
        description: '',
        order: lessons.length + 1
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    if (submitting) return;
    setOpen(false);
    setEditingLesson(null);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      if (editingLesson) {
        await API.put(`/admin/lms/lessons/${editingLesson._id}`, formData);
        showNotification('Lesson updated successfully', 'success');
      } else {
        await API.post('/admin/lms/lessons', { ...formData, module: moduleId });
        showNotification('Lesson created successfully', 'success');
      }
      fetchData();
      handleClose();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error saving lesson', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      const originalLessons = [...lessons];
      setLessons(lessons.filter(l => l._id !== id));

      try {
        setDeletingId(id);
        await API.delete(`/admin/lms/lessons/${id}`);
        showNotification('Lesson deleted successfully', 'success');
      } catch (error) {
        setLessons(originalLessons);
        showNotification(error.response?.data?.message || 'Error deleting lesson', 'error');
      } finally {
        setDeletingId(null);
      }
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
          <Typography color="text.primary" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
            {module?.title || 'Lessons'}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate(`/admin/lms/programs/${programId}/courses/${courseId}/modules`)} size="small" sx={{ bgcolor: 'action.hover' }}>
              <ArrowLeft size={18} />
            </IconButton>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {module?.title} - Lessons
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage activities and content for this lesson
              </Typography>
            </Box>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<Plus size={18} />} 
            onClick={() => handleOpen()}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Add Lesson
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {lessons.map((lesson, index) => (
          <Grid item xs={12} sm={6} lg={4} key={lesson._id}>
            <Card sx={{ 
              height: 320, // Uniform height
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
              <Box sx={{ 
                p: 2, 
                bgcolor: 'primary.lighter', 
                borderBottom: '1px solid', 
                borderColor: 'divider', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: 1, 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 800, 
                    fontSize: '0.9rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {lesson.order || index + 1}
                  </Box>
                  <Typography variant="subtitle2" fontWeight={800} color="primary.main" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Lesson {lesson.order || index + 1}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpen(lesson)} 
                    sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
                    disabled={deletingId === lesson._id}
                  >
                    <Edit size={14} />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleDelete(lesson._id)} 
                    sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'error.main', color: 'white' } }}
                    disabled={deletingId === lesson._id}
                  >
                    {deletingId === lesson._id ? <CircularProgress size={14} /> : <Trash2 size={14} />}
                  </IconButton>
                </Box>
              </Box>

              <CardContent sx={{ 
                flexGrow: 1, 
                p: 2.5, 
                display: 'flex', 
                flexDirection: 'column',
                gap: 1
              }}>
                <Typography variant="h6" fontWeight={700} sx={{ 
                  lineHeight: 1.3, 
                  mb: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: '2.6em'
                }}>
                  {lesson.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.6,
                  minHeight: '4.8em'
                }}>
                  {lesson.description}
                </Typography>

                <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Activity size={14} color="#64748b" />
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                      {lesson.activitiesCount || 0} Activities
                    </Typography>
                  </Box>
                  <Button 
                    size="small" 
                    variant="outlined"
                    endIcon={<ChevronRight size={14} />}
                    onClick={() => navigate(`/admin/lms/programs/${programId}/courses/${courseId}/modules/${moduleId}/lessons/${lesson._id}/activities`)}
                    sx={{ 
                      borderRadius: 1.5, 
                      textTransform: 'none', 
                      fontWeight: 700,
                      px: 2
                    }}
                  >
                    Manage
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {lessons.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ py: 8, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
              <Typography color="text.secondary">No lessons found for this module.</Typography>
              <Button 
                variant="outlined" 
                startIcon={<Plus size={18} />} 
                onClick={() => handleOpen()}
                sx={{ mt: 2 }}
              >
                Create your first lesson
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Lesson Title"
            margin="normal"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Order"
            type="number"
            margin="normal"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            variant="outlined"
            helperText="Display order of the lesson"
          />
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
            {submitting ? 'Saving...' : (editingLesson ? 'Save Changes' : 'Create Lesson')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLMSLessons;
