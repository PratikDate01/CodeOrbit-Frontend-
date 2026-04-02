import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Layers,
  ChevronRight,
  BookOpen,
  Search,
  X
} from 'lucide-react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const AdminLMSCourses = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [courses, setCourses] = useState([]);
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0
  });

  const fetchData = useCallback(async () => {
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
      showNotification('Error fetching courses', 'error');
    } finally {
      setLoading(false);
    }
  }, [programId, showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingCourse) {
        await API.put(`/admin/lms/courses/${editingCourse._id}`, formData);
        showNotification('Course updated successfully', 'success');
      } else {
        await API.post('/admin/lms/courses', { ...formData, program: programId });
        showNotification('Course created successfully', 'success');
      }
      fetchData();
      setOpen(false);
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error saving course', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      const originalCourses = [...courses];
      setCourses(courses.filter(c => c._id !== id));

      try {
        setDeletingId(id);
        await API.delete(`/admin/lms/courses/${id}`);
        showNotification('Course deleted successfully', 'success');
      } catch (error) {
        setCourses(originalCourses);
        showNotification(error.response?.data?.message || 'Error deleting course', 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Courses...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
            <Link to="/admin/lms/programs" className="hover:text-blue-600 transition-colors">Programs</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900">{program?.title || 'Course Builder'}</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/lms/programs')}
              className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm group"
            >
              <ArrowLeft size={20} className="text-gray-900 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Courses</h1>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
                {courses.length} Courses in this program
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => handleOpen()}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
        >
          <Plus size={20} />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search courses by title..." 
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-100 p-20 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
            <Layers size={40} />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-400 font-bold text-sm max-w-xs mx-auto">
            Get started by adding your first course to this program.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, idx) => (
            <div 
              key={course._id} 
              className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 group flex flex-col h-full"
            >
              <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-200">
                    {course.order || idx + 1}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpen(course)}
                      className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(course._id)}
                      disabled={deletingId === course._id}
                      className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      {deletingId === course._id ? <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight tracking-tight min-h-[48px]">
                  {course.title}
                </h3>
                
                <p className="text-gray-400 font-medium text-sm mb-8 line-clamp-3 leading-relaxed">
                  {course.description}
                </p>

                <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                          <BookOpen size={10} className="text-gray-400" />
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Multiple Lessons</span>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/admin/lms/programs/${programId}/courses/${course._id}/modules`)}
                    className="inline-flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest hover:translate-x-1 transition-transform"
                  >
                    Build <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal / Sidebar for Creation */}
      {open && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="flex items-center justify-between p-8 border-b border-gray-100">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                {editingCourse ? 'Edit Course' : 'Add Course'}
              </h2>
              <button onClick={() => setOpen(false)} className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Course Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Introduction to React Hooks"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl font-bold focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Display Order</label>
                <input 
                  type="number" 
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl font-bold focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                <textarea 
                  rows={5}
                  required
                  placeholder="What will students learn in this specific course?"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl font-bold focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </form>

            <div className="p-8 border-t border-gray-100 flex gap-4">
              <button 
                onClick={() => setOpen(false)}
                className="flex-1 px-8 py-4 bg-gray-50 text-gray-600 font-black rounded-3xl hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-[2] px-8 py-4 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                {submitting ? 'Saving...' : (editingCourse ? 'Save Changes' : 'Create Course')}
                {!submitting && <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLMSCourses;
