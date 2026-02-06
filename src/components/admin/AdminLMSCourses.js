import React, { useState, useEffect } from 'react';
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
  Tooltip,
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

const AdminLMSCourses = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0
  });

  const fetchData = async () => {
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
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [programId]);

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
    setOpen(false);
    setEditingCourse(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingCourse) {
        await API.put(`/admin/lms/courses/${editingCourse._id}`, formData);
      } else {
        await API.post('/admin/lms/courses', { ...formData, program: programId });
      }
      fetchData();
      handleClose();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await API.delete(`/admin/lms/courses/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting course:', error);
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
                      <IconButton size="small" onClick={() => handleOpen(course)} sx={{ p: 0.5 }}>
                        <Edit size={14} />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(course._id)} sx={{ p: 0.5 }}>
                        <Trash2 size={14} />
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ px: 3 }}>
            {editingCourse ? 'Save Changes' : 'Create Course'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLMSCourses;
