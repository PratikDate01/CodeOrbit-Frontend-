import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { BookOpen, CheckCircle, Award } from 'lucide-react';
import AdminLMSPrograms from './AdminLMSPrograms';
import AdminLMSCourses from './AdminLMSCourses';
import AdminLMSModules from './AdminLMSModules';
import AdminLMSLessons from './AdminLMSLessons';
import AdminLMSActivities from './AdminLMSActivities';
import AdminLMSApprovals from './AdminLMSApprovals';
import AdminLMSEnrollments from './AdminLMSEnrollments';

const AdminLMS = () => {
  const location = useLocation();
  
  // Determine current tab based on path
  const getTabValue = () => {
    if (location.pathname.includes('/programs')) return 0;
    if (location.pathname.includes('/approvals')) return 1;
    if (location.pathname.includes('/enrollments')) return 2;
    return 0;
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 1 }}>
          <MuiLink component={Link} to="/admin" underline="hover" color="inherit" sx={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
            Admin
          </MuiLink>
          <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>LMS Management</Typography>
        </Breadcrumbs>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          LMS Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage training programs, course content, and student certifications.
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: 'none', mb: 4 }}>
        <Tabs 
          value={getTabValue()} 
          sx={{ 
            px: 2, 
            pt: 1,
            borderBottom: '1px solid', 
            borderColor: 'divider',
            '& .MuiTab-root': { 
              minHeight: 64, 
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem'
            }
          }}
        >
          <Tab 
            icon={<BookOpen size={18} />} 
            iconPosition="start" 
            label="Programs & Courses" 
            component={Link} 
            to="/admin/lms/programs" 
          />
          <Tab 
            icon={<CheckCircle size={18} />} 
            iconPosition="start" 
            label="Pending Approvals" 
            component={Link} 
            to="/admin/lms/approvals" 
          />
          <Tab 
            icon={<Award size={18} />} 
            iconPosition="start" 
            label="Enrollments & Certs" 
            component={Link} 
            to="/admin/lms/enrollments" 
          />
        </Tabs>

        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Routes>
            <Route path="/" element={<AdminLMSPrograms />} />
            <Route path="programs" element={<AdminLMSPrograms />} />
            <Route path="programs/:programId/courses" element={<AdminLMSCourses />} />
            <Route path="programs/:programId/courses/:courseId/modules" element={<AdminLMSModules />} />
            <Route path="programs/:programId/courses/:courseId/modules/:moduleId/lessons" element={<AdminLMSLessons />} />
            <Route path="programs/:programId/courses/:courseId/modules/:moduleId/lessons/:lessonId/activities" element={<AdminLMSActivities />} />
            <Route path="approvals" element={<AdminLMSApprovals />} />
            <Route path="enrollments" element={<AdminLMSEnrollments />} />
          </Routes>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminLMS;
