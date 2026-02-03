import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  LinearProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress
} from '@mui/material';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  Send,
  Info,
  Calendar,
  Award,
  ChevronRight,
  FileText
} from 'lucide-react';
import API from '../api/api';
import { useNotification } from '../context/NotificationContext';

const InternshipActivity = () => {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [progress, setProgress] = useState({ progressPercentage: 0, completedTasksCount: 0 });
  const [internship, setInternship] = useState(null);
  
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch my applications to find this specific internship details
      const appRes = await API.get('/internships/my-applications');
      const currentApp = appRes.data.find(app => app._id === internshipId);
      
      if (!currentApp) {
        showNotification('Internship not found', 'error');
        navigate('/dashboard');
        return;
      }
      setInternship(currentApp);

      // Fetch tasks for this domain
      const tasksRes = await API.get(`/activity/tasks?domain=${currentApp.preferredDomain}`);
      setTasks(tasksRes.data);

      // Fetch submissions for this internship
      const submissionsRes = await API.get(`/activity/submissions?internshipId=${internshipId}`);
      setSubmissions(submissionsRes.data);

      // Fetch progress
      const progressRes = await API.get(`/activity/progress/${internshipId}`);
      setProgress(progressRes.data);

    } catch (error) {
      console.error('Error fetching activity data:', error);
      showNotification('Failed to load internship activity', 'error');
    } finally {
      setLoading(false);
    }
  }, [internshipId, navigate, showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenSubmit = (task) => {
    setSelectedTask(task);
    const existing = submissions.find(s => s.task._id === task._id);
    setSubmissionContent(existing ? existing.content : '');
    setSubmitDialogOpen(true);
  };

  const handleSubmitTask = async () => {
    if (!submissionContent.trim()) {
      showNotification('Please provide submission content', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      await API.post('/activity/submissions', {
        taskId: selectedTask._id,
        internshipId,
        content: submissionContent
      });
      showNotification('Task submitted successfully', 'success');
      setSubmitDialogOpen(false);
      fetchData(); // Refresh data
    } catch (error) {
      showNotification(error.response?.data?.message || 'Submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getTaskStatus = (taskId) => {
    const submission = submissions.find(s => s.task._id === taskId || s.task === taskId);
    if (!submission) return { label: 'Pending', color: 'default', icon: <Clock size={16} /> };
    
    switch (submission.status) {
      case 'Approved':
        return { label: 'Approved', color: 'success', icon: <CheckCircle2 size={16} /> };
      case 'Rejected':
        return { label: 'Rejected', color: 'error', icon: <AlertCircle size={16} /> };
      case 'Resubmission Required':
        return { label: 'Resubmit', color: 'warning', icon: <Info size={16} /> };
      default:
        return { label: 'Submitted', color: 'primary', icon: <Send size={16} /> };
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Breadcrumbs sx={{ mb: 3 }} separator={<ChevronRight size={14} />}>
        <MuiLink 
          component="button" 
          onClick={() => navigate('/dashboard')} 
          underline="hover" 
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}
        >
          Dashboard
        </MuiLink>
        <Typography color="text.primary" fontWeight={700}>Internship Activity</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h3" gutterBottom fontWeight={800} sx={{ letterSpacing: '-1px' }}>
            {internship?.preferredDomain}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip label="Internship Program" size="small" color="primary" sx={{ fontWeight: 700, borderRadius: 1.5 }} />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Progress: {Math.round(progress.progressPercentage)}%
            </Typography>
          </Box>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<ArrowLeft size={18} />} 
          onClick={() => navigate('/dashboard')}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Progress Section */}
      <Paper sx={{ p: 4, mb: 6, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', overflow: 'hidden', position: 'relative' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Typography variant="h6" fontWeight={800}>Program Progress</Typography>
              <Typography variant="h5" fontWeight={800} color="primary.main">{Math.round(progress.progressPercentage)}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress.progressPercentage} 
              sx={{ height: 12, borderRadius: 6, bgcolor: 'rgba(15,15,15,0.05)', '& .MuiLinearProgress-bar': { borderRadius: 6 } }}
            />
            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle2 size={16} color="#059669" />
                <Typography variant="body2" fontWeight={600}>{progress.completedTasksCount} Approved</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Clock size={16} color="#64748b" />
                <Typography variant="body2" fontWeight={600} color="text.secondary">{tasks.length} Total Tasks</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box 
              sx={{ 
                p: 3, 
                borderRadius: 3, 
                bgcolor: progress.isEligibleForCertificate ? 'rgba(5, 150, 105, 0.05)' : 'rgba(37, 99, 235, 0.05)',
                border: '1px solid',
                borderColor: progress.isEligibleForCertificate ? 'success.light' : 'primary.light',
                display: 'flex',
                gap: 2
              }}
            >
              <Box sx={{ p: 1, height: 'fit-content', borderRadius: 1.5, bgcolor: progress.isEligibleForCertificate ? 'success.main' : 'primary.main', color: 'white' }}>
                <Award size={24} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={800} gutterBottom>
                  Certificate Eligibility
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {progress.isEligibleForCertificate 
                    ? "Congratulations! You are eligible for the certificate. Our team will issue it shortly." 
                    : "Complete all assigned tasks and get them approved to unlock your internship certificate."}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tasks List */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Briefcase size={24} />
        <Typography variant="h5" fontWeight={800}>Internship Tasks</Typography>
      </Box>
      
      {tasks.length === 0 ? (
        <Box sx={{ p: 6, textAlign: 'center', bgcolor: 'rgba(15, 15, 15, 0.01)', borderRadius: 4, border: '1px dashed', borderColor: 'divider' }}>
          <Typography color="text.secondary" fontWeight={500}>No tasks have been assigned for your domain yet.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => {
            const status = getTaskStatus(task._id);
            const submission = submissions.find(s => s.task._id === task._id || s.task === task._id);
            
            return (
              <Grid item xs={12} key={task._id}>
                <Card 
                  sx={{ 
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none',
                    transition: 'all 0.2s',
                    '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.05)', transform: 'translateY(-2px)' }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3} alignItems="flex-start">
                      <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1.5, flexWrap: 'wrap' }}>
                          <Typography variant="h6" fontWeight={800}>
                            {task.title}
                          </Typography>
                          <Chip 
                            label={status.label} 
                            color={status.color} 
                            size="small" 
                            icon={status.icon}
                            sx={{ fontWeight: 700, borderRadius: 1.5 }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.6, mb: 3 }}>
                          {task.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'text.secondary' }}>
                            <FileText size={14} />
                            <Typography variant="caption" fontWeight={600}>Type: {task.type}</Typography>
                          </Box>
                          {task.deadline && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'error.main' }}>
                              <Calendar size={14} />
                              <Typography variant="caption" fontWeight={600}>Deadline: {new Date(task.deadline).toLocaleDateString()}</Typography>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' }, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        {status.label === 'Approved' ? (
                          <Box sx={{ p: 2, bgcolor: 'rgba(5, 150, 105, 0.05)', borderRadius: 2, textAlign: 'center' }}>
                            <Typography variant="h5" color="success.main" fontWeight={800}>
                              {submission?.marks} / {task.maxMarks}
                            </Typography>
                            <Typography variant="caption" color="success.main" fontWeight={700}>Approved Score</Typography>
                          </Box>
                        ) : (
                          <Button 
                            variant={status.label === 'Pending' ? "contained" : "outlined"}
                            disabled={status.label === 'Submitted'}
                            onClick={() => handleOpenSubmit(task)}
                            sx={{ borderRadius: 2, fontWeight: 700, py: 1 }}
                            fullWidth
                          >
                            {status.label === 'Pending' ? 'Submit Your Work' : 'Resubmit Work'}
                          </Button>
                        )}
                        
                        {submission?.adminRemarks && (
                          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.alt', borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: 'left' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Info size={14} />
                              <Typography variant="caption" fontWeight={800}>Admin Feedback</Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                              {submission.adminRemarks}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Submission Dialog */}
      <Dialog 
        open={submitDialogOpen} 
        onClose={() => !submitting && setSubmitDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Submit Task: {selectedTask?.title}</DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            {selectedTask?.description}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              {selectedTask?.type === 'Link' ? 'Provide link to your work (GitHub, Drive, etc.)' : 
               selectedTask?.type === 'Text' ? 'Enter your submission content' : 
               'Provide submission details/link'}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder={selectedTask?.type === 'Link' ? 'https://github.com/your-username/project' : 'Explain your work here...'}
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
              disabled={submitting}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
          </Box>
          
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(37, 99, 235, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" fontWeight={700} color="primary.main">Max Score: {selectedTask?.maxMarks}</Typography>
            <Typography variant="caption" fontWeight={700} color="primary.main">Passing Score: {selectedTask?.passingMarks}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setSubmitDialogOpen(false)} disabled={submitting} sx={{ fontWeight: 700, borderRadius: 2 }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitTask} 
            loading={submitting}
            disabled={submitting}
            sx={{ fontWeight: 800, borderRadius: 2, px: 3 }}
          >
            Submit Now
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InternshipActivity;
