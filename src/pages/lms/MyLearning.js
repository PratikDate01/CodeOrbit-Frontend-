import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  LinearProgress, 
  Button, 
  Chip,
  CircularProgress,
  IconButton
} from '@mui/material';
import { PlayCircle, Award, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../api/api';

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await API.get('/lms/my-enrollments');
        setEnrollments(data);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        setError('Failed to load your courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 15 }}>
      <CircularProgress sx={{ mb: 2 }} />
      <Typography color="text.secondary">Loading your workspace...</Typography>
    </Box>
  );

  if (error) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 15 }}>
      <Typography variant="h6" color="error" gutterBottom>{error}</Typography>
      <Button variant="outlined" onClick={() => window.location.reload()}>Retry</Button>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '90vh', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            component={Link} 
            to="/dashboard" 
            sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'background.alt' } }}
          >
            <ArrowLeft size={20} />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={800} gutterBottom sx={{ mb: 0 }}>My Learning</Typography>
            <Typography variant="body1" color="text.secondary">
              Continue where you left off and track your progress.
            </Typography>
          </Box>
        </Box>

        {enrollments.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>No enrollments found.</Typography>
            <Typography variant="body2" color="text.muted" sx={{ mb: 3 }}>
              You will be automatically enrolled once your internship is approved.
            </Typography>
            <Button component={Link} to="/dashboard" variant="contained">Go to Dashboard</Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {enrollments.map((enrollment) => (
              <Grid item xs={12} md={6} key={enrollment._id}>
                <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, height: '100%' }}>
                  <CardMedia
                    component="img"
                    sx={{ width: { xs: '100%', sm: 200 }, height: { xs: 160, sm: 'auto' } }}
                    image={enrollment.program.thumbnail || 'https://via.placeholder.com/200x200?text=LMS'}
                    alt={enrollment.program.title}
                  />
                  <CardContent sx={{ flex: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip label={enrollment.program.internshipDomain} size="small" variant="outlined" color="primary" />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Clock size={14} color="#64748b" />
                        <Typography variant="caption" color="text.secondary">{enrollment.program.duration}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>{enrollment.program.title}</Typography>
                    
                    <Box sx={{ mt: 2, mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" fontWeight={700}>Progress</Typography>
                        <Typography variant="caption" fontWeight={700}>{enrollment.progress}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={enrollment.progress} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button 
                        component={Link} 
                        to={`/learning/${enrollment.program._id}`}
                        variant="contained" 
                        fullWidth
                        startIcon={<PlayCircle size={18} />}
                      >
                        {enrollment.progress === 0 ? 'Start Learning' : 'Continue'}
                      </Button>
                      {enrollment.isCertificateIssued && (
                        <Button 
                          variant="outlined" 
                          color="success"
                          startIcon={<Award size={18} />}
                        >
                          Certificate
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default MyLearning;
