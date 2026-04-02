import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { BookOpen, CheckCircle, Award, ChevronRight } from 'lucide-react';
import AdminLMSPrograms from './AdminLMSPrograms';
import AdminLMSCourses from './AdminLMSCourses';
import AdminLMSModules from './AdminLMSModules';
import AdminLMSLessons from './AdminLMSLessons';
import AdminLMSActivities from './AdminLMSActivities';
import AdminLMSApprovals from './AdminLMSApprovals';
import AdminLMSEnrollments from './AdminLMSEnrollments';

const AdminLMS = () => {
  const location = useLocation();
  
  const getTabValue = () => {
    if (location.pathname.includes('/approvals')) return 1;
    if (location.pathname.includes('/enrollments')) return 2;
    return 0;
  };

  const tabs = [
    { label: 'Programs & Courses', path: '/admin/lms/programs', icon: BookOpen },
    { label: 'Pending Approvals', path: '/admin/lms/approvals', icon: CheckCircle },
    { label: 'Enrollments & Certs', path: '/admin/lms/enrollments', icon: Award },
  ];

  const currentTab = getTabValue();

  return (
    <div className="p-4 md:p-8">
      {/* Breadcrumbs & Header */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/admin" className="hover:text-blue-600 transition-colors">Admin</Link>
          <ChevronRight size={14} />
          <span className="font-medium text-gray-900">LMS Management</span>
        </nav>
        
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
          LMS Management
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Manage training programs, course content, and student certifications with a professional-grade interface.
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = currentTab === index;
            return (
              <Link
                key={index}
                to={tab.path}
                className={`
                  flex items-center gap-2 px-8 py-5 text-sm font-bold whitespace-nowrap transition-all border-b-2
                  ${isActive 
                    ? 'text-blue-600 border-blue-600 bg-blue-50/30' 
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'}
                `}
              >
                <Icon size={18} />
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-10">
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
        </div>
      </div>
    </div>
  );
};

export default AdminLMS;
