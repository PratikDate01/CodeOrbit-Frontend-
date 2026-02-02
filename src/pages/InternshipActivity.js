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
  Alert,
  Paper,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Info as InfoIcon
} from '@mui/icons-material';
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
    if (!submission) return { label: 'Pending', color: 'default', icon: <PendingIcon fontSize="small" /> };
    
    switch (submission.status) {
      case 'Approved':
        return { label: 'Approved', color: 'success', icon: <CheckCircleIcon fontSize="small" /> };
      case 'Rejected':
        return { label: 'Rejected', color: 'error', icon: <ErrorIcon fontSize="small" /> };
      case 'Resubmission Required':
        return { label: 'Resubmit', color: 'warning', icon: <InfoIcon fontSize="small" /> };
      default:
        return { label: 'Submitted', color: 'primary', icon: <SendIcon fontSize="small" /> };
    }
  };

  if (loading) return <LinearProgress />;

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component="button" onClick={() => navigate('/dashboard')} underline="hover" color="inherit">
          Dashboard
        </MuiLink>
        <Typography color="text.primary">Internship Activity</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {internship?.preferredDomain} Internship
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your progress and complete tasks to become eligible for your certificate.
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Progress Section */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Overall Progress</Typography>
              <Typography variant="h6">{Math.round(progress.progressPercentage)}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress.progressPercentage} 
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {progress.completedTasksCount} of {tasks.length} tasks approved
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Alert 
              severity={progress.isEligibleForCertificate ? "success" : "info"}
              icon={progress.isEligibleForCertificate ? <CheckCircleIcon /> : <InfoIcon />}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                Certificate Eligibility
              </Typography>
              {progress.isEligibleForCertificate 
                ? "You are eligible! Admin will issue your certificate soon." 
                : "Complete all tasks and get them approved to become eligible."}
            </Alert>
          </Grid>
        </Grid>
      </Paper>

      {/* Tasks List */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Internship Tasks
      </Typography>
      
      {tasks.length === 0 ? (
        <Alert severity="info">No tasks assigned for this internship yet.</Alert>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => {
            const status = getTaskStatus(task._id);
            const submission = submissions.find(s => s.task._id === task._id || s.task === task._id);
            
            return (
              <Grid item xs={12} key={task._id}>
                <Card sx={{ 
                  borderLeft: 6, 
                  borderColor: status.color === 'success' ? 'success.main' : 
                               status.color === 'primary' ? 'primary.main' : 
                               status.color === 'warning' ? 'warning.main' : 'divider'
                }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="flex-start">
                      <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                          <Typography variant="h6" component="div">
                            {task.title}
                          </Typography>
                          <Chip 
                            label={status.label} 
                            color={status.color} 
                            size="small" 
                            icon={status.icon}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {task.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AssignmentIcon fontSize="inherit" /> Type: {task.type}
                          </Typography>
                          {task.deadline && (
                            <Typography variant="caption" color="error">
                              Deadline: {new Date(task.deadline).toLocaleDateString()}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' }, mt: { xs: 2, md: 0 } }}>
                        {status.label === 'Approved' ? (
                          <Box>
                            <Typography variant="h6" color="success.main">
                              Score: {submission?.marks}/{task.maxMarks}
                            </Typography>
                            {submission?.adminRemarks && (
                              <Typography variant="caption" display="block">
                                Remark: {submission.adminRemarks}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Button 
                            variant="contained" 
                            disabled={status.label === 'Submitted'}
                            onClick={() => handleOpenSubmit(task)}
                          >
                            {status.label === 'Pending' ? 'Submit Work' : 'Resubmit Work'}
                          </Button>
                        )}
                        {submission?.adminRemarks && status.label !== 'Approved' && (
                          <Box sx={{ mt: 1, p: 1, bgcolor: 'background.alt', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              <strong>Admin Remark:</strong> {submission.adminRemarks}
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
      <Dialog open={submitDialogOpen} onClose={() => !submitting && setSubmitDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Task: {selectedTask?.title}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Instructions: {selectedTask?.description}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              {selectedTask?.type === 'Link' ? 'Provide link to your work (GitHub/Drive/etc.)' : 
               selectedTask?.type === 'Text' ? 'Enter your submission content' : 
               'Provide submission details/link'}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder={selectedTask?.type === 'Link' ? 'https://github.com/...' : 'Your work...'}
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
              disabled={submitting}
            />
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            Max Marks: {selectedTask?.maxMarks} | Passing Marks: {selectedTask?.passingMarks}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialogOpen(false)} disabled={submitting}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitTask} 
            loading={submitting}
            disabled={submitting}
          >
            Submit Task
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InternshipActivity;
