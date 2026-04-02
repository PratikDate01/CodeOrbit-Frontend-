import React, { useState, useEffect, useCallback } from 'react';
import { PlayCircle, Award, Clock, ArrowLeft, BookOpen, ChevronRight, CheckCircle2, Layout, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/api';

const MyLearning = () => {
  const { userInfo } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/lms/my-enrollments');
      setEnrollments(data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      setError('Failed to load your courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] bg-white">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-r-transparent border-b-transparent border-l-transparent"></div>
        <div className="absolute inset-0 animate-pulse bg-blue-50 rounded-full -z-10 scale-150 opacity-50"></div>
      </div>
      <p className="text-gray-900 font-black mt-8 text-xl tracking-tight">Preparing your workspace...</p>
      <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">Hang tight!</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] px-4">
      <div className="bg-red-50 text-red-600 p-6 rounded-[32px] mb-6 text-center max-w-sm border border-red-100">
        <p className="font-bold text-lg mb-2">Oops!</p>
        <p className="font-medium opacity-80">{error}</p>
      </div>
      <button 
        onClick={fetchEnrollments}
        className="px-10 py-4 bg-gray-900 text-white rounded-2xl shadow-xl hover:bg-black transition-all font-black active:scale-95"
      >
        Retry Fetching
      </button>
    </div>
  );

  return (
    <div className="bg-[#FAFBFF] min-h-screen py-12 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex items-start gap-6">
            <Link 
              to="/dashboard" 
              className="p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm group mt-1"
            >
              <ArrowLeft size={24} className="text-gray-900 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <div className="flex items-center gap-3 text-blue-600 mb-2">
                <Layout size={20} />
                <span className="text-sm font-black uppercase tracking-[0.2em]">Student Workspace</span>
              </div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none">My Learning</h1>
              <p className="text-gray-400 mt-4 font-bold max-w-lg">
                Your professional journey continues here. Track your progress, complete tasks, and earn your certification.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                <Star size={24} fill="currentColor" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900 leading-none">{userInfo?.totalXP || 0}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total XP Earned</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900 leading-none">{enrollments.length}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Active Programs</p>
              </div>
            </div>
          </div>
        </div>

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-[48px] border border-gray-100 p-20 text-center shadow-xl shadow-blue-900/5">
            <div className="bg-blue-50 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-blue-600">
              <BookOpen size={48} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Nothing here yet</h2>
            <p className="text-gray-400 mb-10 max-w-md mx-auto font-bold">
              Your learning journey begins once your internship is approved. Check your application status on the dashboard.
            </p>
            <Link 
              to="/dashboard" 
              className="inline-flex items-center px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {enrollments.map((enrollment) => (
              <div 
                key={enrollment._id} 
                className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 group flex flex-col h-full relative"
              >
                {/* Status Badge */}
                <div className="absolute top-6 right-6 z-10">
                  {enrollment.status === 'Completed' ? (
                    <span className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white text-[10px] font-black rounded-full shadow-lg shadow-green-200">
                      <CheckCircle2 size={12} /> COMPLETED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-[10px] font-black rounded-full shadow-lg shadow-blue-200">
                      <PlayCircle size={12} /> IN PROGRESS
                    </span>
                  )}
                </div>

                {/* Hero Section */}
                <div className="h-64 relative overflow-hidden">
                  <img 
                    src={enrollment.program.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'} 
                    alt={enrollment.program.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-8">
                    <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-400 mb-2 inline-block">
                      {enrollment.program.internshipDomain}
                    </span>
                    <h3 className="text-2xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
                      {enrollment.program.title}
                    </h3>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">{enrollment.program.duration || '4 Weeks'}</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <BookOpen size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">Self-Paced</span>
                    </div>
                  </div>

                  {/* Current Module Display */}
                  {enrollment.currentModule && (
                    <div className="bg-blue-50/50 rounded-2xl p-4 mb-6 border border-blue-50 group-hover:bg-blue-50 transition-colors">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Current Module</p>
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="font-bold text-gray-900 truncate">{enrollment.currentModule.title}</h4>
                        <ChevronRight size={16} className="text-blue-600 shrink-0" />
                      </div>
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="mt-auto pt-4 border-t border-gray-50">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Completion</p>
                        <p className="text-3xl font-black text-gray-900 leading-none">{enrollment.progress}%</p>
                      </div>
                      {enrollment.progress > 0 && (
                        <p className="text-xs font-bold text-blue-600 mb-1">Keep it up!</p>
                      )}
                    </div>
                    <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden mb-10 border border-gray-100">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>

                    <div className="flex gap-4">
                      <Link 
                        to={`/learning/${enrollment.program._id}`}
                        className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 bg-gray-900 text-white font-black rounded-[24px] hover:bg-black transition-all shadow-xl shadow-gray-200 group/btn active:scale-95"
                      >
                        <PlayCircle size={20} className="group-hover:scale-125 transition-transform" />
                        <span>{enrollment.progress === 0 ? 'Start Program' : 'Continue Learning'}</span>
                      </Link>
                      
                      {enrollment.isCertificateIssued && (
                        <button className="w-16 h-16 bg-green-50 text-green-600 flex items-center justify-center rounded-[24px] hover:bg-green-100 transition-all border border-green-100 group shadow-lg shadow-green-900/5 active:scale-95">
                          <Award size={28} className="group-hover:rotate-12 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      ` }} />
    </div>
  );
};

export default MyLearning;
