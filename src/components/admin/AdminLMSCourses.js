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
      try {
        setDeletingId(id);
        await API.delete(`/admin/lms/courses/${id}`);
        showNotification('Course deleted successfully', 'success');
        fetchData();
      } catch (error) {
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

      <Grid container spacing={2}>
        {courses.map((course, index) => (
          <Grid item xs={12} md={6} lg={4} key={course._id}>
            <Card sx={{ 
              display: 'flex',
              height: 100,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              transition: 'all 0.2s',
              overflow: 'hidden',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'background.alt' }
            }}>
              <Box sx={{ 
                width: 40, 
                bgcolor: 'primary.main', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontWeight: 800,
                fontSize: '1rem'
              }}>
                {course.order || index + 1}
              </Box>
              <CardContent sx={{ 
                flex: 1, 
                p: '12px !important', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                overflow: 'hidden'
              }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ lineHeight: 1.2, maxWidth: '70%' }}>
                      {course.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpen(course)} 
                        sx={{ p: 0.5 }}
                        disabled={deletingId === course._id}
                      >
                        <Edit size={14} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDelete(course._id)} 
                        sx={{ p: 0.5 }}
                        disabled={deletingId === course._id}
                      >
                        {deletingId === course._id ? <CircularProgress size={14} /> : <Trash2 size={14} />}
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                    {course.description}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Layers size={12} color="#64748b" />
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.65rem' }}>
                      {course.modulesCount || 0} Modules
                    </Typography>
                  </Box>
                  <Button 
                    size="small" 
                    endIcon={<ChevronRight size={12} />}
                    sx={{ fontSize: '0.65rem', fontWeight: 700, p: 0, minWidth: 0 }}
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
