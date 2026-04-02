import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Search,
  X,
  Layers,
  Calendar
} from 'lucide-react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const AdminLMSModules = () => {
  const { programId, courseId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [modules, setModules] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [modulesRes, coursesRes] = await Promise.all([
        API.get(`/admin/lms/courses/${courseId}/modules`),
        API.get(`/admin/lms/programs/${programId}/courses`)
      ]);
      
      setModules(modulesRes.data);
      const currentCourse = coursesRes.data.find(c => c._id === courseId);
      setCourse(currentCourse);
    } catch (error) {
      showNotification('Error fetching modules', 'error');
    } finally {
      setLoading(false);
    }
  }, [programId, courseId, showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpen = (moduleObj = null) => {
    if (moduleObj) {
      setEditingModule(moduleObj);
      setFormData({
        title: moduleObj.title,
        description: moduleObj.description,
        order: moduleObj.order || 0
      });
    } else {
      setEditingModule(null);
      setFormData({
        title: '',
        description: '',
        order: modules.length + 1
      });
    }
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingModule) {
        await API.put(`/admin/lms/modules/${editingModule._id}`, formData);
        showNotification('Week updated successfully', 'success');
      } else {
        await API.post('/admin/lms/modules', { ...formData, course: courseId });
        showNotification('Week created successfully', 'success');
      }
      fetchData();
      setOpen(false);
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error saving week', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? All lessons in this week will be deleted.')) {
      const originalModules = [...modules];
      setModules(modules.filter(m => m._id !== id));

      try {
        setDeletingId(id);
        await API.delete(`/admin/lms/modules/${id}`);
        showNotification('Week deleted successfully', 'success');
      } catch (error) {
        setModules(originalModules);
        showNotification(error.response?.data?.message || 'Error deleting week', 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredModules = modules.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Weeks...</p>
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
            <Link to={`/admin/lms/programs/${programId}/courses`} className="hover:text-blue-600 transition-colors">Courses</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900">{course?.title || 'Week Builder'}</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(`/admin/lms/programs/${programId}/courses`)}
              className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm group"
            >
              <ArrowLeft size={20} className="text-gray-900 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Weeks</h1>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
                {course?.title}
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => handleOpen()}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
        >
          <Plus size={20} />
          <span>Add New Week</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search weeks..." 
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredModules.length === 0 ? (
        <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-100 p-20 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
            <Calendar size={40} />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">No weeks defined</h3>
          <p className="text-gray-400 font-bold text-sm max-w-xs mx-auto">
            Organize your course content into weekly blocks.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredModules.map((moduleObj, idx) => (
            <div 
              key={moduleObj._id} 
              className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 group flex flex-col h-full"
            >
              <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Week</span>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl flex items-center justify-center font-black text-xl">
                      {moduleObj.order || idx + 1}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpen(moduleObj)}
                      className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(moduleObj._id)}
                      disabled={deletingId === moduleObj._id}
                      className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      {deletingId === moduleObj._id ? <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight tracking-tight min-h-[48px]">
                  {moduleObj.title}
                </h3>
                
                <p className="text-gray-400 font-medium text-sm mb-8 line-clamp-3 leading-relaxed">
                  {moduleObj.description}
                </p>

                <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <BookOpen size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Lessons Builder</span>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/admin/lms/programs/${programId}/courses/${courseId}/modules/${moduleObj._id}/lessons`)}
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
                {editingModule ? 'Edit Week' : 'Add Week'}
              </h2>
              <button onClick={() => setOpen(false)} className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Week Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Fundamental Concepts"
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
                  placeholder="Briefly describe what this week covers."
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
                {submitting ? 'Saving...' : (editingModule ? 'Save Changes' : 'Create Week')}
                {!submitting && <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLMSModules;
