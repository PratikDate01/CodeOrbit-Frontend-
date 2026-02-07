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
  Divider
} from '@mui/material';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Layers,
  ChevronRight
} from 'lucide-react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const AdminLMSCourses = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [courses, setCourses] = useState([]);
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [coursesRes, programsRes] = await Promise.all([
        API.get(`/admin/lms/programs/${programId}/courses`),
        API.get('/admin/lms/programs')
      ]);
      
      setCourses(coursesRes.data);
      const currentProgram = programsRes.data.find(p => p._id === programId);
      setProgram(currentProgram);
    } catch (error) {
      showNotification('Error fetching courses', 'error');
    } finally {
      setLoading(false);
    }
  }, [programId, showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpen = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        order: course.order || 0
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        order: courses.length + 1
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    if (submitting) return;
    setOpen(false);
    setEditingCourse(null);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      if (editingCourse) {
        await API.put(`/admin/lms/courses/${editingCourse._id}`, formData);
        showNotification('Course updated successfully', 'success');
      } else {
        await API.post('/admin/lms/courses', { ...formData, program: programId });
        showNotification('Course created successfully', 'success');
      }
      fetchData();
      handleClose();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error saving course', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      const originalCourses = [...courses];
      setCourses(courses.filter(c => c._id !== id));

      try {
        setDeletingId(id);
        await API.delete(`/admin/lms/courses/${id}`);
        showNotification('Course deleted successfully', 'success');
      } catch (error) {
        setCourses(originalCourses);
        showNotification(error.response?.data?.message || 'Error deleting course', 'error');
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
          <Typography color="text.primary" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
            {program?.title || 'Courses'}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/admin/lms/programs')} size="small" sx={{ bgcolor: 'action.hover' }}>
              <ArrowLeft size={18} />
            </IconButton>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {program?.title} - Courses
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage modules and lessons for this program
              </Typography>
            </Box>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<Plus size={18} />} 
            onClick={() => handleOpen()}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Add Course
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {courses.map((course, index) => (
          <Grid item xs={12} sm={6} lg={4} key={course._id}>
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
                    {course.order || index + 1}
                  </Box>
                  <Typography variant="subtitle2" fontWeight={800} color="primary.main" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Module {course.order || index + 1}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpen(course)} 
                    sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
                    disabled={deletingId === course._id}
                  >
                    <Edit size={14} />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleDelete(course._id)} 
                    sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'error.main', color: 'white' } }}
                    disabled={deletingId === course._id}
                  >
                    {deletingId === course._id ? <CircularProgress size={14} /> : <Trash2 size={14} />}
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
                  {course.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.6,
                  minHeight: '4.8em'
                }}>
                  {course.description}
                </Typography>

                <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Layers size={14} color="#64748b" />
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                      {course.modulesCount || 0} Lessons
                    </Typography>
                  </Box>
                  <Button 
                    size="small" 
                    variant="outlined"
                    endIcon={<ChevronRight size={14} />}
                    onClick={() => navigate(`/admin/lms/programs/${programId}/courses/${course._id}/modules`)}
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
        {courses.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ py: 8, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
              <Typography color="text.secondary">No courses found for this program.</Typography>
              <Button 
                variant="outlined" 
                startIcon={<Plus size={18} />} 
                onClick={() => handleOpen()}
                sx={{ mt: 2 }}
              >
                Create your first course
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingCourse ? 'Edit Course' : 'Add New Course'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Course Title"
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
            helperText="Display order of the course"
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
            {submitting ? 'Saving...' : (editingCourse ? 'Save Changes' : 'Create Course')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLMSCourses;
