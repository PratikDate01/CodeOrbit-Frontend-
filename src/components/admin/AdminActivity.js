import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Divider,
  Tooltip,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Plus as PlusIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  Eye as EyeIcon,
  Check as CheckIcon,
  X as CloseIcon,
  Info as InfoIcon,
  Filter as FilterIcon
} from 'lucide-react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const DOMAINS = [
  "Web Development",
  "App Development",
  "Graphic Design",
  "Digital Marketing",
  "UI/UX Design",
  "Data Science",
  "Content Writing",
  "Python Development",
  "Java Development",
  "C++ Development"
];

const AdminActivity = () => {
  const [tabValue, setTabValue] = useState(0);
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  
  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    type: 'File',
    internshipDomain: DOMAINS[0],
    maxMarks: 100,
    passingMarks: 40,
    deadline: ''
  });

  // Submissions state
  const [submissions, setSubmissions] = useState([]);
  const [evaluateDialogOpen, setEvaluateDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [evaluationForm, setEvaluationForm] = useState({
    status: 'Approved',
    marks: 0,
    adminRemarks: ''
  });

  const [filterDomain, setFilterDomain] = useState('All');

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/activity/tasks');
      setTasks(res.data);
    } catch (error) {
      showNotification('Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/activity/submissions');
      setSubmissions(res.data);
    } catch (error) {
      showNotification('Failed to fetch submissions', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    if (tabValue === 0) fetchTasks();
    else fetchSubmissions();
  }, [tabValue, fetchTasks, fetchSubmissions]);

  // --- Task Handlers ---
  const handleOpenTaskDialog = (task = null) => {
    if (task) {
      setSelectedTask(task);
      setTaskForm({
        ...task,
        deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : ''
      });
    } else {
      setSelectedTask(null);
      setTaskForm({
        title: '',
        description: '',
        type: 'File',
        internshipDomain: DOMAINS[0],
        maxMarks: 100,
        passingMarks: 40,
        deadline: ''
      });
    }
    setTaskDialogOpen(true);
  };

  const handleSaveTask = async () => {
    try {
      if (selectedTask) {
        await API.put(`/activity/tasks/${selectedTask._id}`, taskForm);
        showNotification('Task updated successfully', 'success');
      } else {
        await API.post('/activity/tasks', taskForm);
        showNotification('Task created successfully', 'success');
      }
      setTaskDialogOpen(false);
      fetchTasks();
    } catch (error) {
      showNotification('Error saving task', 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await API.delete(`/activity/tasks/${id}`);
        showNotification('Task deleted', 'success');
        fetchTasks();
      } catch (error) {
        showNotification('Error deleting task', 'error');
      }
    }
  };

  // --- Submission Handlers ---
  const handleOpenEvaluate = (submission) => {
    setSelectedSubmission(submission);
    setEvaluationForm({
      status: submission.status === 'Submitted' ? 'Approved' : submission.status,
      marks: submission.marks || 0,
      adminRemarks: submission.adminRemarks || ''
    });
    setEvaluateDialogOpen(true);
  };

  const handleSaveEvaluation = async () => {
    try {
      await API.put(`/activity/submissions/${selectedSubmission._id}/evaluate`, evaluationForm);
      showNotification('Evaluation saved', 'success');
      setEvaluateDialogOpen(false);
      fetchSubmissions();
    } catch (error) {
      showNotification('Error saving evaluation', 'error');
    }
  };

  const filteredTasks = filterDomain === 'All' ? tasks : tasks.filter(t => t.internshipDomain === filterDomain);

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={800}>Activity Management</Typography>
        {tabValue === 0 && (
          <Button 
            variant="contained" 
            startIcon={<PlusIcon size={18} />}
            onClick={() => handleOpenTaskDialog()}
          >
            Create Task
          </Button>
        )}
      </Box>

      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, v) => setTabValue(v)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Internship Tasks" />
          <Tab label="Student Submissions" />
        </Tabs>
      </Paper>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {tabValue === 0 ? (
        <Box>
          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <TextField
              select
              label="Filter by Domain"
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              size="small"
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="All">All Domains</MenuItem>
              {DOMAINS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell fontWeight={600}>Title</TableCell>
                  <TableCell fontWeight={600}>Domain</TableCell>
                  <TableCell fontWeight={600}>Type</TableCell>
                  <TableCell fontWeight={600}>Passing</TableCell>
                  <TableCell align="right" fontWeight={600}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task._id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>{task.title}</Typography>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200, display: 'block' }}>
                        {task.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={task.internshipDomain} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{task.type}</TableCell>
                    <TableCell>{task.passingMarks}/{task.maxMarks}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenTaskDialog(task)}>
                        <EditIcon size={18} />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteTask(task._id)}>
                        <TrashIcon size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTasks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No tasks found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box>
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell fontWeight={600}>Student</TableCell>
                  <TableCell fontWeight={600}>Task</TableCell>
                  <TableCell fontWeight={600}>Status</TableCell>
                  <TableCell fontWeight={600}>Marks</TableCell>
                  <TableCell align="right" fontWeight={600}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.map((sub) => (
                  <TableRow key={sub._id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>{sub.student?.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{sub.student?.email}</Typography>
                    </TableCell>
                    <TableCell>{sub.task?.title}</TableCell>
                    <TableCell>
                      <Chip 
                        label={sub.status} 
                        size="small" 
                        color={
                          sub.status === 'Approved' ? 'success' : 
                          sub.status === 'Rejected' ? 'error' : 
                          sub.status === 'Submitted' ? 'primary' : 'warning'
                        } 
                      />
                    </TableCell>
                    <TableCell>{sub.marks || 0}/{sub.task?.maxMarks || 100}</TableCell>
                    <TableCell align="right">
                      <Button 
                        size="small" 
                        variant="outlined" 
                        startIcon={<EyeIcon size={14} />}
                        onClick={() => handleOpenEvaluate(sub)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {submissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No submissions found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Task Dialog */}
      <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Task Title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth multiline rows={3} label="Description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth select label="Domain"
                value={taskForm.internshipDomain}
                onChange={(e) => setTaskForm({...taskForm, internshipDomain: e.target.value})}
              >
                {DOMAINS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth select label="Type"
                value={taskForm.type}
                onChange={(e) => setTaskForm({...taskForm, type: e.target.value})}
              >
                <MenuItem value="File">File Upload / Link</MenuItem>
                <MenuItem value="Link">Only Link</MenuItem>
                <MenuItem value="Text">Text Content</MenuItem>
                <MenuItem value="MCQ">MCQ</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth type="number" label="Max Marks"
                value={taskForm.maxMarks}
                onChange={(e) => setTaskForm({...taskForm, maxMarks: parseInt(e.target.value)})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth type="number" label="Passing Marks"
                value={taskForm.passingMarks}
                onChange={(e) => setTaskForm({...taskForm, passingMarks: parseInt(e.target.value)})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth type="date" label="Deadline"
                InputLabelProps={{ shrink: true }}
                value={taskForm.deadline}
                onChange={(e) => setTaskForm({...taskForm, deadline: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveTask}>Save Task</Button>
        </DialogActions>
      </Dialog>

      {/* Evaluate Dialog */}
      <Dialog open={evaluateDialogOpen} onClose={() => setEvaluateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Review Submission</DialogTitle>
        <DialogContent dividers>
          {selectedSubmission && (
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>Submission Content:</Typography>
              <Paper sx={{ p: 2, bgcolor: 'background.alt', my: 1, whiteSpace: 'pre-wrap' }}>
                {selectedSubmission.content}
              </Paper>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" sx={{ mb: 2 }}>Evaluation</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth select label="Status"
                    value={evaluationForm.status}
                    onChange={(e) => setEvaluationForm({...evaluationForm, status: e.target.value})}
                  >
                    <MenuItem value="Approved">Approve</MenuItem>
                    <MenuItem value="Rejected">Reject</MenuItem>
                    <MenuItem value="Resubmission Required">Request Resubmission</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth type="number" label="Marks Awarded"
                    value={evaluationForm.marks}
                    onChange={(e) => setEvaluationForm({...evaluationForm, marks: parseInt(e.target.value)})}
                    helperText={`Max marks: ${selectedSubmission.task?.maxMarks}`}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth multiline rows={2} label="Admin Remarks"
                    value={evaluationForm.adminRemarks}
                    onChange={(e) => setEvaluationForm({...evaluationForm, adminRemarks: e.target.value})}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEvaluateDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveEvaluation}>Save Evaluation</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminActivity;
