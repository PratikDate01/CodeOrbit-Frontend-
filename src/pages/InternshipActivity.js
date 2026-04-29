import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  LinearProgress,
  TextField,
  Dialog,
  DialogContent,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
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
  FileText,
  X,
} from 'lucide-react';
import API from '../api/api';
import { useNotification } from '../context/NotificationContext';

// ── Shared input styling ──────────────────────────────────────────────────────
const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    fontFamily: '"DM Sans", sans-serif',
    '& fieldset': { borderColor: '#e8e8e4', borderWidth: '1.5px' },
    '&:hover fieldset': { borderColor: '#0a0a0a' },
    '&.Mui-focused fieldset': { borderColor: '#2563eb' },
  },
  '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
};

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Approved:              { label: 'Approved',   bg: '#dcfce7', color: '#15803d', icon: <CheckCircle2 size={13} /> },
  Rejected:              { label: 'Rejected',   bg: '#fee2e2', color: '#b91c1c', icon: <AlertCircle size={13} /> },
  'Resubmission Required': { label: 'Resubmit', bg: '#fef9c3', color: '#a16207', icon: <Info size={13} /> },
  Submitted:             { label: 'Submitted',  bg: '#eff6ff', color: '#2563eb', icon: <Send size={13} /> },
  Pending:               { label: 'Pending',    bg: '#f7f7f5', color: '#737373', icon: <Clock size={13} /> },
};

// ── Status pill ───────────────────────────────────────────────────────────────
const StatusPill = ({ label, bg, color, icon }) => (
  <Box sx={{
    display: 'inline-flex', alignItems: 'center', gap: 0.75,
    px: 1.5, py: 0.4, borderRadius: '100px',
    bgcolor: bg, fontSize: '0.75rem', fontWeight: 700,
    color, fontFamily: '"DM Sans", sans-serif',
    flexShrink: 0,
  }}>
    {icon}
    {label}
  </Box>
);

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
      const appRes = await API.get('/internships/my-applications');
      const currentApp = appRes.data.find(app => app._id === internshipId);

      if (!currentApp) {
        showNotification('Internship not found', 'error');
        navigate('/dashboard');
        return;
      }
      setInternship(currentApp);

      const [tasksRes, submissionsRes, progressRes] = await Promise.all([
        API.get(`/activity/tasks?domain=${currentApp.preferredDomain}`),
        API.get(`/activity/submissions?internshipId=${internshipId}`),
        API.get(`/activity/progress/${internshipId}`),
      ]);
      setTasks(tasksRes.data);
      setSubmissions(submissionsRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Error fetching activity data:', error);
      showNotification('Failed to load internship activity', 'error');
    } finally {
      setLoading(false);
    }
  }, [internshipId, navigate, showNotification]);

  useEffect(() => { fetchData(); }, [fetchData]);

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
        content: submissionContent,
      });
      showNotification('Task submitted successfully', 'success');
      setSubmitDialogOpen(false);
      fetchData();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getTaskStatus = (taskId) => {
    const submission = submissions.find(s => s.task._id === taskId || s.task === taskId);
    if (!submission) return STATUS_CONFIG.Pending;
    return STATUS_CONFIG[submission.status] || STATUS_CONFIG.Submitted;
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', bgcolor: '#f7f7f5' }}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#2563eb' }} size={36} thickness={3} />
        <Typography sx={{ mt: 2, color: '#a3a3a3', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', fontWeight: 500 }}>
          Loading internship activity…
        </Typography>
      </Box>
    </Box>
  );

  const pct = Math.round(progress.progressPercentage);

  return (
    <Box sx={{ bgcolor: '#f7f7f5', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>

        {/* ── Breadcrumbs ── */}
        <Breadcrumbs
          separator={<ChevronRight size={13} color="#a3a3a3" />}
          sx={{ mb: 4 }}
        >
          <MuiLink
            component="button"
            onClick={() => navigate('/dashboard')}
            underline="hover"
            sx={{
              fontSize: '0.8rem', fontWeight: 600, color: '#737373',
              fontFamily: '"DM Sans", sans-serif',
              display: 'flex', alignItems: 'center', gap: 0.5, border: 'none', background: 'none', cursor: 'pointer',
            }}
          >
            Dashboard
          </MuiLink>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#0a0a0a', fontFamily: '"DM Sans", sans-serif' }}>
            Internship Activity
          </Typography>
        </Breadcrumbs>

        {/* ── Page Header ── */}
        <Box sx={{
          mb: 5,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 3,
        }}>
          <Box>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              bgcolor: '#eff6ff', border: '1px solid #bfdbfe',
              borderRadius: '100px', px: 2, py: 0.4, mb: 2,
            }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2563eb' }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', fontFamily: '"DM Sans", sans-serif' }}>
                Internship Program
              </Typography>
            </Box>
            <Typography sx={{
              fontWeight: 900, fontSize: { xs: '1.75rem', md: '2.5rem' },
              letterSpacing: '-0.04em', color: '#0a0a0a',
              fontFamily: '"DM Sans", sans-serif', lineHeight: 1.1,
            }}>
              {internship?.preferredDomain}
            </Typography>
            <Typography sx={{ mt: 1, fontSize: '0.875rem', color: '#737373', fontFamily: '"DM Sans", sans-serif', fontWeight: 500 }}>
              Progress: {pct}% complete
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={16} />}
            onClick={() => navigate('/dashboard')}
            sx={{
              borderRadius: '10px', textTransform: 'none', fontWeight: 700,
              fontFamily: '"DM Sans", sans-serif',
              borderColor: '#e8e8e4', borderWidth: '1.5px', color: '#3f3f3f',
              px: 2.5, py: 1.1, fontSize: '0.875rem',
              '&:hover': { borderColor: '#0a0a0a', bgcolor: 'transparent', boxShadow: 'none' },
            }}
          >
            Back to Dashboard
          </Button>
        </Box>

        {/* ── Progress Card ── */}
        <Box sx={{
          p: { xs: 4, md: 5 },
          mb: 5,
          bgcolor: '#fff',
          border: '1.5px solid #e8e8e4',
          borderRadius: '20px',
          overflow: 'hidden',
        }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ mb: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0a0a0a', fontFamily: '"DM Sans", sans-serif', letterSpacing: '-0.02em' }}>
                  Program Progress
                </Typography>
                <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#2563eb', fontFamily: '"DM Sans", sans-serif', letterSpacing: '-0.04em', lineHeight: 1 }}>
                  {pct}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={progress.progressPercentage}
                sx={{
                  height: 10, borderRadius: '100px',
                  bgcolor: '#f7f7f5',
                  '& .MuiLinearProgress-bar': { borderRadius: '100px', bgcolor: '#2563eb' },
                }}
              />

              <Box sx={{ display: 'flex', gap: 3, mt: 2.5, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={12} color="#15803d" />
                  </Box>
                  <Typography sx={{ fontSize: '0.825rem', fontWeight: 600, color: '#15803d', fontFamily: '"DM Sans", sans-serif' }}>
                    {progress.completedTasksCount} Approved
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#f7f7f5', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e8e8e4' }}>
                    <Clock size={12} color="#737373" />
                  </Box>
                  <Typography sx={{ fontSize: '0.825rem', fontWeight: 600, color: '#737373', fontFamily: '"DM Sans", sans-serif' }}>
                    {tasks.length} Total Tasks
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{
                p: 3,
                borderRadius: '14px',
                bgcolor: progress.isEligibleForCertificate ? 'rgba(5,150,105,0.04)' : '#eff6ff',
                border: '1.5px solid',
                borderColor: progress.isEligibleForCertificate ? '#bbf7d0' : '#bfdbfe',
                display: 'flex', gap: 2, alignItems: 'flex-start',
              }}>
                <Box sx={{
                  width: 40, height: 40, borderRadius: '10px', flexShrink: 0,
                  bgcolor: progress.isEligibleForCertificate ? '#15803d' : '#2563eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Award size={20} color="#fff" />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#0a0a0a', fontFamily: '"DM Sans", sans-serif', mb: 0.5, letterSpacing: '-0.02em' }}>
                    Certificate Eligibility
                  </Typography>
                  <Typography sx={{ fontSize: '0.825rem', color: '#737373', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.65 }}>
                    {progress.isEligibleForCertificate
                      ? 'Congratulations! You are eligible. Our team will issue your certificate shortly.'
                      : 'Complete all assigned tasks and get them approved to unlock your certificate.'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* ── Tasks Section Header ── */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '9px',
            bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Briefcase size={18} color="#2563eb" />
          </Box>
          <Typography sx={{
            fontWeight: 800, fontSize: '1.2rem', color: '#0a0a0a',
            fontFamily: '"DM Sans", sans-serif', letterSpacing: '-0.03em',
          }}>
            Internship Tasks
          </Typography>
        </Box>

        {/* ── Empty State ── */}
        {tasks.length === 0 ? (
          <Box sx={{
            p: 8, textAlign: 'center',
            border: '1.5px dashed #e8e8e4',
            borderRadius: '16px',
            bgcolor: '#fff',
          }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: '#f7f7f5', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <Briefcase size={22} color="#a3a3a3" />
            </Box>
            <Typography sx={{ color: '#737373', fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '0.95rem' }}>
              No tasks have been assigned for your domain yet.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {tasks.map((task) => {
              const status = getTaskStatus(task._id);
              const submission = submissions.find(s => s.task._id === task._id || s.task === task._id);
              const isApproved  = status.label === 'Approved';
              const isPending   = status.label === 'Pending';
              const isSubmitted = status.label === 'Submitted';

              return (
                <Grid item xs={12} key={task._id}>
                  <Box sx={{
                    bgcolor: '#fff',
                    border: '1.5px solid #e8e8e4',
                    borderRadius: '16px',
                    p: { xs: 3, md: 4 },
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#2563eb',
                      boxShadow: '0 0 0 4px rgba(37,99,235,0.06)',
                      transform: 'translateY(-1px)',
                    },
                  }}>
                    <Grid container spacing={3} alignItems="flex-start">

                      {/* Left — task info */}
                      <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                          <Typography sx={{
                            fontWeight: 800, fontSize: '1rem', color: '#0a0a0a',
                            fontFamily: '"DM Sans", sans-serif', letterSpacing: '-0.02em',
                          }}>
                            {task.title}
                          </Typography>
                          <StatusPill {...status} />
                        </Box>

                        <Typography sx={{
                          fontSize: '0.9rem', color: '#737373',
                          fontFamily: '"DM Sans", sans-serif', lineHeight: 1.7, mb: 3,
                        }}>
                          {task.description}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#f7f7f5', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e8e8e4' }}>
                              <FileText size={11} color="#737373" />
                            </Box>
                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#737373', fontFamily: '"DM Sans", sans-serif' }}>
                              Type: {task.type}
                            </Typography>
                          </Box>
                          {task.deadline && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                              <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Calendar size={11} color="#b91c1c" />
                              </Box>
                              <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#b91c1c', fontFamily: '"DM Sans", sans-serif' }}>
                                Deadline: {new Date(task.deadline).toLocaleDateString()}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Grid>

                      {/* Right — action / score */}
                      <Grid item xs={12} md={4}>
                        {isApproved ? (
                          <Box sx={{
                            p: 3, bgcolor: 'rgba(5,150,105,0.04)',
                            border: '1.5px solid #bbf7d0',
                            borderRadius: '12px', textAlign: 'center',
                          }}>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.75rem', color: '#15803d', fontFamily: '"DM Sans", sans-serif', letterSpacing: '-0.04em', lineHeight: 1 }}>
                              {submission?.marks}
                              <Box component="span" sx={{ fontSize: '1rem', color: '#a3a3a3', fontWeight: 600 }}>
                                /{task.maxMarks}
                              </Box>
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', fontFamily: '"DM Sans", sans-serif', mt: 0.5 }}>
                              Approved Score
                            </Typography>
                          </Box>
                        ) : (
                          <Button
                            variant={isPending ? 'contained' : 'outlined'}
                            disabled={isSubmitted}
                            onClick={() => handleOpenSubmit(task)}
                            fullWidth
                            sx={{
                              borderRadius: '10px', fontWeight: 700, py: 1.3,
                              textTransform: 'none', fontFamily: '"DM Sans", sans-serif',
                              fontSize: '0.875rem',
                              ...(isPending ? {
                                bgcolor: '#0a0a0a', color: '#fff', boxShadow: 'none',
                                '&:hover': { bgcolor: '#1f1f1f', boxShadow: 'none' },
                              } : {
                                borderColor: '#e8e8e4', borderWidth: '1.5px', color: '#3f3f3f',
                                '&:hover': { borderColor: '#2563eb', color: '#2563eb', bgcolor: '#eff6ff' },
                              }),
                              '&.Mui-disabled': { bgcolor: '#f7f7f5', color: '#a3a3a3', borderColor: '#e8e8e4' },
                            }}
                          >
                            {isPending ? 'Submit Your Work' : isSubmitted ? 'Under Review' : 'Resubmit Work'}
                          </Button>
                        )}

                        {submission?.adminRemarks && (
                          <Box sx={{
                            mt: 2, p: 2.5,
                            bgcolor: '#f7f7f5',
                            border: '1.5px solid #e8e8e4',
                            borderRadius: '12px',
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Info size={11} color="#2563eb" />
                              </Box>
                              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#0a0a0a', fontFamily: '"DM Sans", sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Admin Feedback
                              </Typography>
                            </Box>
                            <Typography sx={{ fontSize: '0.825rem', color: '#737373', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.65 }}>
                              {submission.adminRemarks}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* ── Submit Dialog ── */}
      <Dialog
        open={submitDialogOpen}
        onClose={() => !submitting && setSubmitDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            border: '1px solid #e8e8e4',
            boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
            fontFamily: '"DM Sans", sans-serif',
            overflow: 'hidden',
          },
        }}
      >
        {/* Dialog Header */}
        <Box sx={{
          px: 3.5, pt: 3.5, pb: 2.5,
          borderBottom: '1px solid #e8e8e4',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0a0a0a', letterSpacing: '-0.03em', fontFamily: '"DM Sans", sans-serif' }}>
              Submit Task
            </Typography>
            <Typography sx={{ fontSize: '0.825rem', color: '#a3a3a3', fontFamily: '"DM Sans", sans-serif', mt: 0.25 }}>
              {selectedTask?.title}
            </Typography>
          </Box>
          <Box
            onClick={() => !submitting && setSubmitDialogOpen(false)}
            sx={{
              width: 32, height: 32, borderRadius: '8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#a3a3a3', mt: -0.5, mr: -0.5,
              '&:hover': { bgcolor: '#f7f7f5', color: '#0a0a0a' },
            }}
          >
            <X size={16} />
          </Box>
        </Box>

        <DialogContent sx={{ px: 3.5, py: 3 }}>
          {/* Task description */}
          <Typography sx={{
            fontSize: '0.875rem', color: '#737373',
            fontFamily: '"DM Sans", sans-serif', lineHeight: 1.7, mb: 3,
          }}>
            {selectedTask?.description}
          </Typography>

          {/* Input label */}
          <Typography sx={{
            fontSize: '0.8rem', fontWeight: 700, color: '#3f3f3f',
            fontFamily: '"DM Sans", sans-serif', mb: 1,
          }}>
            {selectedTask?.type === 'Link'
              ? 'Provide a link to your work (GitHub, Drive, etc.)'
              : selectedTask?.type === 'Text'
                ? 'Enter your submission content'
                : 'Provide submission details or link'}
          </Typography>

          <TextField
            fullWidth multiline rows={6}
            placeholder={
              selectedTask?.type === 'Link'
                ? 'https://github.com/your-username/project'
                : 'Explain your work here…'
            }
            value={submissionContent}
            onChange={(e) => setSubmissionContent(e.target.value)}
            disabled={submitting}
            sx={{ ...inputSx, mb: 3 }}
          />

          {/* Score bar */}
          <Box sx={{
            p: 2.5, borderRadius: '12px',
            bgcolor: '#eff6ff', border: '1px solid #bfdbfe',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#737373', fontFamily: '"DM Sans", sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Max Score
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#2563eb', fontFamily: '"DM Sans", sans-serif', letterSpacing: '-0.03em' }}>
                {selectedTask?.maxMarks}
              </Typography>
            </Box>
            <Box sx={{ width: 1, height: 28, bgcolor: '#bfdbfe' }} />
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#737373', fontFamily: '"DM Sans", sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Passing Score
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#2563eb', fontFamily: '"DM Sans", sans-serif', letterSpacing: '-0.03em' }}>
                {selectedTask?.passingMarks}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <Box sx={{ px: 3.5, pb: 3.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              onClick={() => setSubmitDialogOpen(false)}
              disabled={submitting}
              sx={{
                flex: 1, borderRadius: '10px', fontWeight: 700, py: 1.4,
                textTransform: 'none', fontFamily: '"DM Sans", sans-serif',
                fontSize: '0.875rem',
                borderColor: '#e8e8e4', borderWidth: '1.5px', color: '#3f3f3f',
                border: '1.5px solid #e8e8e4',
                '&:hover': { borderColor: '#0a0a0a', bgcolor: 'transparent' },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitTask}
              disabled={submitting}
              sx={{
                flex: 2, py: 1.4, borderRadius: '10px',
                textTransform: 'none', fontSize: '0.925rem',
                fontWeight: 700, fontFamily: '"DM Sans", sans-serif',
                bgcolor: '#2563eb', boxShadow: 'none',
                '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 4px 20px rgba(37,99,235,0.25)' },
                '&.Mui-disabled': { bgcolor: '#bfdbfe', color: '#fff' },
              }}
            >
              {submitting
                ? <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} sx={{ color: '#fff' }} /> Submitting…
                  </Box>
                : <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Send size={15} /> Submit Now
                  </Box>
              }
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default InternshipActivity;