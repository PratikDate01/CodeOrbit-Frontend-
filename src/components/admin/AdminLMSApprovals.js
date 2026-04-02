import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Info, 
  ChevronRight,
  X,
  ClipboardList,
  User,
  BookOpen
} from 'lucide-react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const AdminLMSApprovals = () => {
  const { showNotification } = useNotification();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewDialog, setReviewDialog] = useState({ open: false, item: null, marks: 0, remarks: '' });

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/lms/approvals/pending');
      setApprovals(data);
    } catch (error) {
      console.error('Error fetching approvals:', error);
      showNotification('Failed to fetch pending approvals', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async (id, status) => {
    if (!reviewDialog.item) return;
    
    setSubmitting(true);
    try {
      await API.patch(`/admin/lms/progress/${id}/approve`, {
        status,
        marks: reviewDialog.marks,
        remarks: reviewDialog.remarks
      });
      showNotification(`Submission ${status === 'Completed' ? 'approved' : 'rejected'} successfully`, 'success');
      setReviewDialog({ open: false, item: null, marks: 0, remarks: '' });
      fetchApprovals();
    } catch (error) {
      console.error('Error approving activity:', error);
      showNotification(error.response?.data?.message || 'Failed to update submission', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredApprovals = approvals.filter(item => 
    item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.activity.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Loading pending approvals...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pending Approvals</h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
            {approvals.length} submissions awaiting review
          </p>
        </div>

        <div className="relative max-w-md w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by student or activity..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Program & Activity</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApprovals.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <Clock size={32} />
                    </div>
                    <p className="text-gray-400 font-bold">No pending submissions to review</p>
                  </td>
                </tr>
              ) : (
                filteredApprovals.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs shrink-0">
                          {item.user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-none mb-1">{item.user.name}</p>
                          <p className="text-[10px] font-medium text-gray-400">{item.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">{item.enrollment?.program?.title || 'Unknown Program'}</p>
                      <p className="font-bold text-gray-700 text-sm">{item.activity.title}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-widest rounded-lg border border-gray-200">
                        {item.activity.type}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => setReviewDialog({ open: true, item, marks: item.marks || 0, remarks: '' })}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95 text-xs uppercase tracking-widest"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {reviewDialog.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setReviewDialog({ ...reviewDialog, open: false })}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Review Submission</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Activity: {reviewDialog.item?.activity.title}</p>
              </div>
              <button 
                onClick={() => setReviewDialog({ ...reviewDialog, open: false })}
                className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Submitted By</p>
                  <p className="font-bold text-blue-900">{reviewDialog.item?.user.name} ({reviewDialog.item?.user.email})</p>
                </div>
              </div>

              {reviewDialog.item?.submissionContent && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Submission</label>
                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 text-gray-700 font-medium whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                    {reviewDialog.item.submissionContent}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Marks / Score</label>
                  <input 
                    type="number" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                    value={reviewDialog.marks}
                    onChange={(e) => setReviewDialog({ ...reviewDialog, marks: e.target.value })}
                  />
                </div>
                <div className="space-y-2 flex flex-col justify-center">
                   <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-4 rounded-2xl border border-amber-100">
                      <Info size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Passing Score: {reviewDialog.item?.activity?.passingScore || 60}%</span>
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mentor Feedback</label>
                <textarea 
                  rows={3}
                  placeholder="Provide constructive feedback..."
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                  value={reviewDialog.remarks}
                  onChange={(e) => setReviewDialog({ ...reviewDialog, remarks: e.target.value })}
                ></textarea>
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 shrink-0">
              <button 
                onClick={() => handleApprove(reviewDialog.item._id, 'Rejected')}
                disabled={submitting}
                className="flex-1 px-8 py-4 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <XCircle size={18} />
                Reject
              </button>
              <button 
                onClick={() => handleApprove(reviewDialog.item._id, 'Completed')}
                disabled={submitting}
                className="flex-[2] px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                {submitting ? 'Processing...' : (
                  <>
                    <CheckCircle2 size={18} />
                    Approve & Complete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLMSApprovals;