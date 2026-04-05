import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Grid,
  Divider,
  CircularProgress,
  IconButton,
  Paper
} from '@mui/material';
import { Plus, Minus, Save, FileText } from 'lucide-react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const AdminAttendanceDialog = ({ open, onClose, application, onAttendanceSaved }) => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [weeks, setWeeks] = useState(['']); // Initial one week

  useEffect(() => {
    if (open && application) {
      fetchAttendance();
    }
  }, [open, application]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/attendance/${application._id}`);
      if (data && data.weeks) {
        setWeeks(data.weeks.map(w => w.presentDays.toString()));
      } else {
        // Default to number of weeks based on duration if no record exists
        const durationWeeks = (application.duration || 1) * 4;
        setWeeks(new Array(durationWeeks).fill(''));
      }
    } catch (error) {
      showNotification('Error fetching attendance data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWeek = () => {
    setWeeks([...weeks, '']);
  };

  const handleRemoveWeek = () => {
    if (weeks.length > 1) {
      setWeeks(weeks.slice(0, -1));
    }
  };

  const handleWeekChange = (index, value) => {
    const newWeeks = [...weeks];
    newWeeks[index] = value;
    setWeeks(newWeeks);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        internshipId: application._id,
        weeklyPresentDays: weeks.map(w => Number(w) || 0)
      };
      const { data } = await API.post('/attendance', payload, {
        loaderMessage: 'Saving attendance...'
      });
      showNotification('Attendance saved successfully', 'success');
      if (onAttendanceSaved) onAttendanceSaved(data);
      onClose();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to save attendance', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 800, pt: 3 }}>
        Manage Attendance: {application?.name}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Enter the number of present days for each week. Total working days are calculated automatically based on the internship duration (Mon-Fri).
            </Typography>

            <Box sx={{ mt: 3, maxHeight: '400px', overflowY: 'auto', pr: 1 }}>
              <Grid container spacing={2}>
                {weeks.map((days, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                        Week {index + 1}
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        label="Present Days"
                        type="number"
                        value={days}
                        onChange={(e) => handleWeekChange(index, e.target.value)}
                        placeholder="0-5"
                        inputProps={{ min: 0, max: 5 }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
              <Button 
                startIcon={<Plus size={18} />} 
                onClick={handleAddWeek}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 2 }}
              >
                Add Week
              </Button>
              <Button 
                startIcon={<Minus size={18} />} 
                onClick={handleRemoveWeek}
                variant="outlined"
                size="small"
                color="error"
                sx={{ borderRadius: 2 }}
                disabled={weeks.length <= 1}
              >
                Remove Week
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />}
          disabled={saving}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Save Attendance
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminAttendanceDialog;
