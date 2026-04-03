import React, { useState } from 'react';
import { 
  ClipboardList, 
  Send, 
  CheckCircle2, 
  Info, 
  ChevronRight,
  Upload,
  FileText
} from 'lucide-react';
import API from '../../api/api';

const AssignmentPlayer = ({ activity, onComplete, previousResult }) => {
  const [submissionText, setSubmissionText] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(
    previousResult?.status === 'Pending Approval' || 
    previousResult?.status === 'Completed' ||
    previousResult?.status === 'Rejected'
  );

  const handleSubmit = async () => {
    if (!submissionText.trim() && !fileUrl.trim()) {
      alert('Please provide some text or a file for your submission.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await API.post('/lms/assignment/submit', {
        activityId: activity._id,
        submissionText,
        fileUrl
      });
      
      if (response.data) {
        setIsSubmitted(true);
        if (onComplete) onComplete();
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert(error.response?.data?.message || 'Error submitting assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 overflow-hidden relative">
        <div className="flex items-start gap-6">
          <div className="bg-green-100 text-green-600 p-3 rounded-2xl shrink-0">
            <CheckCircle2 size={32} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-2xl font-black text-gray-900 mb-1">Assignment Submitted</h4>
                <div className="flex items-center gap-2 text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                  <span className="text-sm font-bold uppercase tracking-wider">
                    {previousResult?.status === 'Completed' ? 'Approved & Completed' : 'Awaiting Mentor Review'}
                  </span>
                </div>
              </div>
              {previousResult?.marks !== undefined && (
                <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 text-center">
                  <p className="text-2xl font-black text-blue-700 leading-none">{previousResult.marks}<span className="text-sm font-bold text-blue-400">/{activity.maxMarks || 100}</span></p>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Score</p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-6">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Your Submission</p>
              {submissionText && <p className="text-gray-700 font-medium break-all leading-relaxed mb-4">{submissionText}</p>}
              {fileUrl && (
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                  <FileText size={16} />
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-xs">
                    View Submitted File
                  </a>
                </div>
              )}
            </div>

            {previousResult?.adminApproval?.remarks && (
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2 mb-2 text-blue-700">
                  <Info size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Mentor Feedback</span>
                </div>
                <p className="text-blue-900 font-medium italic">"{previousResult.adminApproval.remarks}"</p>
              </div>
            )}

            {previousResult?.status === 'Rejected' && (
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-6 px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
              >
                Resubmit Assignment
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[40px] border border-gray-200 shadow-sm p-10">
      <div className="flex items-center gap-3 text-blue-600 mb-4">
        <ClipboardList size={24} />
        <span className="text-sm font-bold uppercase tracking-widest">Assignment Submission</span>
      </div>
      
      <h4 className="text-3xl font-black text-gray-900 mb-4">{activity.title}</h4>
      
      {activity.instructions && (
        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 mb-8">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Instructions</p>
          <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
            {activity.instructions}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Max Score</p>
          <p className="text-xl font-black text-gray-900">{activity.maxMarks || 100}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
          <p className="text-xl font-black text-amber-500">Not Submitted</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="relative group">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Text Submission</label>
          <textarea 
            className="w-full bg-white border-2 border-gray-100 rounded-3xl p-6 text-gray-700 focus:border-blue-600 transition-all outline-none min-h-[150px] font-medium leading-relaxed"
            placeholder="Write your submission here or provide details about your work..."
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
            disabled={submitting}
          ></textarea>
        </div>

        <div className="relative group">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">File URL (Optional)</label>
          <div className="flex items-center gap-3 w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 focus-within:border-blue-600 transition-all">
            <Upload size={20} className="text-gray-400" />
            <input 
              type="text"
              className="flex-1 bg-transparent outline-none text-gray-700 font-medium"
              placeholder="Paste link to your file (GitHub, GDrive, etc.)"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              disabled={submitting}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-10">
        <div className="flex items-center gap-3 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
          <Info size={18} />
          <span className="text-xs font-bold">Requires mentor review for grading and completion.</span>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:bg-blue-300 active:scale-95"
        >
          {submitting ? 'Submitting...' : 'Submit Assignment'}
          {!submitting && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default AssignmentPlayer;
