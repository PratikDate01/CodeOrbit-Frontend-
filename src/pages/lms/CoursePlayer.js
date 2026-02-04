import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Collapse,
  Button,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  Video,
  FileDown,
  BookOpen
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/api';

const CoursePlayer = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ program: null, courses: [], modules: [], lessons: [], activities: [], progress: [] });
  const [activeActivity, setActiveActivity] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});

  const fetchCourseContent = useCallback(async (courseId) => {
    try {
      const { data: contentData } = await API.get(`/lms/courses/${courseId}/content`);
      setData(prev => ({
        ...prev,
        ...contentData
      }));
      
      if (contentData.activities.length > 0 && !activeActivity) {
        setActiveActivity(contentData.activities[0]);
      }
    } catch (error) {
      console.error('Error fetching course content:', error);
    }
  }, [activeActivity]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: programData } = await API.get(`/lms/programs/${programId}`);
      
      setData(prev => ({
        ...prev,
        program: programData.program,
        courses: programData.courses
      }));

      if (programData.courses && programData.courses.length > 0) {
        setActiveCourse(programData.courses[0]);
        await fetchCourseContent(programData.courses[0]._id);
      }
    } catch (error) {
      console.error('Error fetching program details:', error);
    } finally {
      setLoading(false);
    }
  }, [programId, fetchCourseContent]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCourseChange = async (course) => {
    setActiveCourse(course);
    setActiveActivity(null);
    setLoading(true);
    await fetchCourseContent(course._id);
    setLoading(false);
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const getActivityIcon = (type, isCompleted) => {
    if (isCompleted) return <CheckCircle2 size={18} color="#10b981" />;
    switch (type) {
      case 'Video': return <Video size={18} />;
      case 'PDF': return <FileDown size={18} />;
      case 'Quiz': return <HelpCircle size={18} />;
      default: return <FileText size={18} />;
    }
  };

  const handleCompleteActivity = async (activityId) => {
    try {
      await API.post(`/lms/activities/${activityId}/progress`, { status: 'Completed' });
      // Refresh progress data
      const { data: contentData } = await API.get(`/lms/courses/${activeCourse._id}/content`);
      setData(prev => ({ ...prev, progress: contentData.progress }));
    } catch (error) {
      console.error('Error completing activity:', error);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Sidebar Navigation */}
      <Paper 
        elevation={0} 
        sx={{ 
          width: 350, 
          height: '100%', 
          overflowY: 'auto', 
          borderRight: '1px solid', 
          borderColor: 'divider',
          borderRadius: 0
        }}
      >
        <Box sx={{ p: 2, bgcolor: 'background.alt', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Button 
            startIcon={<ChevronLeft size={18} />} 
            onClick={() => navigate('/my-learning')}
            sx={{ mb: 1, color: 'text.secondary' }}
          >
            Back to Learning
          </Button>
          <Typography variant="h6" fontWeight={800} noWrap>{data.program?.title}</Typography>
          {data.courses.length > 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary">SELECT COURSE</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, overflowX: 'auto', pb: 1 }}>
                {data.courses.map((course) => (
                  <Chip 
                    key={course._id}
                    label={course.title}
                    size="small"
                    onClick={() => handleCourseChange(course)}
                    color={activeCourse?._id === course._id ? "primary" : "default"}
                    variant={activeCourse?._id === course._id ? "filled" : "outlined"}
                    sx={{ fontWeight: 600 }}
                  />
                ))}
              </Box>
            </Box>
          )}
          {data.courses.length === 1 && (
            <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mt: 1 }}>
              {activeCourse?.title}
            </Typography>
          )}
        </Box>

        <List sx={{ p: 0 }}>
          {data.modules.map((module) => (
            <React.Fragment key={module._id}>
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => toggleModule(module._id)}
                  sx={{ py: 2, bgcolor: expandedModules[module._id] ? 'rgba(0,0,0,0.02)' : 'transparent' }}
                >
                  <ListItemText 
                    primary={module.title} 
                    primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }} 
                  />
                  {expandedModules[module._id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </ListItemButton>
              </ListItem>
              <Collapse in={expandedModules[module._id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {data.lessons.filter(l => l.module === module._id).map((lesson) => (
                    <Box key={lesson._id}>
                      <Typography variant="caption" sx={{ px: 3, py: 1, display: 'block', fontWeight: 700, color: 'text.muted' }}>
                        {lesson.title}
                      </Typography>
                      {data.activities.filter(a => a.lesson === lesson._id).map((activity) => {
                        const isCompleted = data.progress.find(p => p.activity === activity._id)?.status === 'Completed';
                        const isActive = activeActivity?._id === activity._id;
                        
                        return (
                          <ListItemButton 
                            key={activity._id}
                            selected={isActive}
                            onClick={() => setActiveActivity(activity)}
                            sx={{ 
                              pl: 4, 
                              py: 1.5,
                              borderLeft: isActive ? '4px solid' : '4px solid transparent',
                              borderColor: 'primary.main'
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              {getActivityIcon(activity.type, isCompleted)}
                            </ListItemIcon>
                            <ListItemText 
                              primary={activity.title} 
                              primaryTypographyProps={{ 
                                variant: 'body2', 
                                fontWeight: isActive ? 700 : 500,
                                color: isCompleted ? 'text.secondary' : 'text.primary'
                              }} 
                            />
                          </ListItemButton>
                        );
                      })}
                    </Box>
                  ))}
                </List>
              </Collapse>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Content Area */}
      <Box sx={{ flexGrow: 1, bgcolor: '#f8fafc', overflowY: 'auto', p: { xs: 2, md: 6 } }}>
        {activeActivity ? (
          <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Chip label={activeActivity.type} size="small" color="primary" sx={{ mb: 1, fontWeight: 700 }} />
                <Typography variant="h4" fontWeight={800}>{activeActivity.title}</Typography>
              </Box>
              <Button 
                variant="contained" 
                color="success" 
                onClick={() => handleCompleteActivity(activeActivity._id)}
                disabled={data.progress.find(p => p.activity === activeActivity._id)?.status === 'Completed'}
              >
                Mark as Completed
              </Button>
            </Box>

            <Paper sx={{ p: 4, borderRadius: 4, minHeight: 400 }}>
              {activeActivity.type === 'Video' && (
                <Box sx={{ position: 'relative', pt: '56.25%', bgcolor: 'black', borderRadius: 2, overflow: 'hidden' }}>
                  <iframe
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    src={activeActivity.content}
                    title={activeActivity.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </Box>
              )}
              {activeActivity.type === 'Text' && (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {activeActivity.content}
                </Typography>
              )}
              {activeActivity.type === 'PDF' && (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <FileText size={64} color="#64748b" />
                  <Typography variant="h6" sx={{ mt: 2, mb: 3 }}>This activity contains a PDF document.</Typography>
                  <Button variant="outlined" href={activeActivity.content} target="_blank">View PDF Document</Button>
                </Box>
              )}
              {activeActivity.type === 'Quiz' && (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <HelpCircle size={64} color="#64748b" />
                  <Typography variant="h6" sx={{ mt: 2, mb: 3 }}>Interactive Quiz Activity</Typography>
                  <Button variant="contained">Start Quiz Assessment</Button>
                </Box>
              )}
            </Paper>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <BookOpen size={64} color="#cbd5e1" />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>Select an activity to start learning</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CoursePlayer;
