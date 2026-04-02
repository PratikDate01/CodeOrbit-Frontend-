import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  BookOpen, 
  Trash2, 
  Search,
  MoreVertical,
  Layers,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  Settings,
  X,
  Image as ImageIcon
} from 'lucide-react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const AdminLMSPrograms = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    internshipDomain: '',
    duration: '',
    thumbnail: ''
  });

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/lms/programs');
      setPrograms(data);
    } catch (error) {
      showNotification('Error fetching programs', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const handleOpen = (program = null) => {
    if (program) {
      setEditingProgram(program);
      setFormData({
        title: program.title,
        description: program.description,
        internshipDomain: program.internshipDomain,
        duration: program.duration,
        thumbnail: program.thumbnail || ''
      });
    } else {
      setEditingProgram(null);
      setFormData({ title: '', description: '', internshipDomain: '', duration: '', thumbnail: '' });
    }
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingProgram) {
        await API.put(`/admin/lms/programs/${editingProgram._id}`, formData);
        showNotification('Program updated successfully', 'success');
      } else {
        await API.post('/admin/lms/programs', formData);
        showNotification('Program created successfully', 'success');
      }
      setOpen(false);
      fetchPrograms();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error saving program', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (program) => {
    const originalPrograms = [...programs];
    setPrograms(programs.map(p => 
      p._id === program._id ? { ...p, isPublished: !p.isPublished } : p
    ));

    try {
      await API.put(`/admin/lms/programs/${program._id}`, { isPublished: !program.isPublished });
      showNotification(`Program ${!program.isPublished ? 'published' : 'unpublished'}`, 'success');
    } catch (error) {
      setPrograms(originalPrograms);
      showNotification(error.response?.data?.message || 'Error updating program', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will permanently delete all courses, lessons, and activities in this program.')) {
      const originalPrograms = [...programs];
      setPrograms(programs.filter(p => p._id !== id));

      try {
        setDeletingId(id);
        await API.delete(`/admin/lms/programs/${id}`);
        showNotification('Program deleted successfully', 'success');
      } catch (error) {
        setPrograms(originalPrograms);
        showNotification(error.response?.data?.message || 'Error deleting program', 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredPrograms = programs.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.internshipDomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Programs...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search programs by name or domain..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => handleOpen()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
        >
          <Plus size={20} />
          <span>Create New Program</span>
        </button>
      </div>

      {filteredPrograms.length === 0 ? (
        <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-100 p-20 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
            <BookOpen size={40} />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">No programs found</h3>
          <p className="text-gray-400 font-bold text-sm max-w-xs mx-auto">
            Try adjusting your search or create a new program to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredPrograms.map((program) => (
            <div 
              key={program._id} 
              className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 group flex flex-col h-full relative"
            >
              {/* Image Header */}
              <div className="h-48 relative overflow-hidden shrink-0">
                <img 
                  src={program.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop'} 
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                    program.isPublished ? 'bg-green-500 text-white' : 'bg-gray-900 text-white opacity-80'
                  }`}>
                    {program.isPublished ? 'Live' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Layers size={14} className="text-blue-600" />
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{program.internshipDomain}</span>
                </div>
                
                <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight tracking-tight min-h-[48px]">
                  {program.title}
                </h3>
                
                <div className="flex items-center gap-4 text-gray-400 mb-8 pb-8 border-b border-gray-50 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span className="text-xs font-bold uppercase tracking-widest">{program.duration || '4 Weeks'}</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={14} />
                    <span className="text-xs font-bold uppercase tracking-widest">LMS Program</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => navigate(`/admin/lms/programs/${program._id}/courses`)}
                    className="flex items-center justify-center gap-2 py-3.5 bg-blue-50 text-blue-700 font-black rounded-2xl hover:bg-blue-100 transition-all text-xs uppercase tracking-widest shadow-sm shadow-blue-100"
                  >
                    <BookOpen size={16} />
                    Manage
                  </button>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpen(program)}
                      className="flex-1 flex items-center justify-center py-3.5 bg-gray-50 text-gray-600 font-black rounded-2xl hover:bg-gray-100 transition-all shadow-sm"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(program._id)}
                      disabled={deletingId === program._id}
                      className="flex-1 flex items-center justify-center py-3.5 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition-all shadow-sm disabled:opacity-50"
                    >
                      {deletingId === program._id ? <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>

                {/* Publish Switch - Positioned absolutely in content for better UX */}
                <div className="mt-6 flex items-center justify-between px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Public Access</span>
                  <button 
                    onClick={() => handleTogglePublish(program)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${program.isPublished ? 'bg-blue-600' : 'bg-gray-200'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${program.isPublished ? 'translate-x-5' : 'translate-x-0'}`} />
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
                {editingProgram ? 'Edit Program' : 'New Program'}
              </h2>
              <button onClick={() => setOpen(false)} className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Program Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Master React & Node.js"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl font-bold focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Internship Domain</label>
                <select 
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl font-bold focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                  value={formData.internshipDomain}
                  onChange={(e) => setFormData({...formData, internshipDomain: e.target.value})}
                >
                  <option value="">Select Domain</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Social Media Marketing">Social Media Marketing</option>
                  <option value="Cyber Security">Cyber Security</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 4 Weeks"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl font-bold focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thumbnail</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Image URL"
                      className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl font-bold focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                <textarea 
                  rows={5}
                  required
                  placeholder="What will students learn in this program?"
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
                {submitting ? 'Saving...' : (editingProgram ? 'Save Changes' : 'Create Program')}
                {!submitting && <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLMSPrograms;
