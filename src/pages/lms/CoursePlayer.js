import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  PlayCircle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Unlock, 
  Video, 
  HelpCircle, 
  ArrowLeft,
  Menu,
  X,
  Send,
  Info,
  ExternalLink,
  Award,
  BookOpen,
  ClipboardList
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/api';
import VideoPlayer from '../../components/common/VideoPlayer';

// Internal Quiz Player Component (Tailwind version)
const QuizPlayer = ({ activity, onSubmit, previousResult }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(
    previousResult?.status === 'Pending Approval' || 
    previousResult?.status === 'Completed'
  );

  const handleOptionChange = (questionIndex, value) => {
    setAnswers({ ...answers, [questionIndex]: value });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < activity.quizData.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    const answerArray = activity.quizData.map((_, index) => answers[index]);
    const success = await onSubmit(answerArray);
    if (success) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12 px-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Submitted!</h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Your answers have been recorded. {previousResult?.status === 'Pending Approval' ? 'It is currently pending admin review.' : 'Well done!'}
        </p>
        {(previousResult?.marks !== undefined || previousResult?.marks === 0) && (
          <div className="inline-block bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">
            <span className="text-blue-700 font-bold">Score: {previousResult.marks.toFixed(1)}%</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <HelpCircle size={20} />
          <span className="text-sm font-bold uppercase tracking-widest">Knowledge Check</span>
        </div>
        <h3 className="text-3xl font-black text-gray-900 mb-2">{activity.title}</h3>
        <p className="text-gray-500 font-medium">Test your understanding of the module topics.</p>
      </div>
      
      <div className="space-y-6">
        {activity.quizData.map((q, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-4 mb-6">
              <span className="flex shrink-0 w-8 h-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-sm">
                {index + 1}
              </span>
              <p className="font-bold text-gray-900 text-lg leading-relaxed pt-0.5">
                {q.question}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 ml-12">
              {q.options.map((option, optIndex) => (
                <label 
                  key={optIndex} 
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    answers[index] === option 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-50 hover:border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    name={`q-${index}`} 
                    value={option}
                    checked={answers[index] === option}
                    onChange={() => handleOptionChange(index, option)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className={`font-semibold ${answers[index] === option ? 'text-blue-900' : 'text-gray-600'}`}>
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center pb-20">
        <button 
          onClick={handleSubmit}
          className="flex items-center gap-3 px-12 py-5 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 group active:scale-95"
        >
          <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          <span>Submit My Answers</span>
        </button>
      </div>
    </div>
  );
};

// Internal Task Submission Component (merged with existing Assignment logic)
const TaskSubmission = ({ activity, onSubmit, previousResult }) => {
  const [content, setContent] = useState(previousResult?.submissionContent || '');
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(
    previousResult?.status === 'Submitted' || 
    previousResult?.status === 'Pending Approval' || 
    previousResult?.status === 'Completed'
  );

  const task = activity.task;

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('Please provide some content or a link for your submission.');
      return;
    }
    setSubmitting(true);
    const success = await onSubmit({ submissionContent: content, status: 'Pending Approval' });
    if (success) {
      setIsSubmitted(true);
    }
    setSubmitting(false);
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
                <h4 className="text-2xl font-black text-gray-900 mb-1">Task Submitted</h4>
                <div className="flex items-center gap-2 text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                  <span className="text-sm font-bold uppercase tracking-wider">Awaiting Mentor Review</span>
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
              <p className="text-gray-700 font-medium break-all leading-relaxed">{content}</p>
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
                Try Resubmission
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-10">
      <div className="flex items-center gap-3 text-blue-600 mb-4">
        <ClipboardList size={24} />
        <span className="text-sm font-bold uppercase tracking-widest">Task Submission</span>
      </div>
      
      <h4 className="text-3xl font-black text-gray-900 mb-4">Submit Your Work</h4>
      <p className="text-gray-500 font-medium mb-8 leading-relaxed">
        {task?.description || activity.description || "Complete the required task for this lesson and submit the results below. You can provide a link (GitHub, Drive) or a text description of your work."}
      </p>

      {task && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Max Score</p>
            <p className="text-xl font-black text-gray-900">{task.maxMarks || 100}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Passing Score</p>
            <p className="text-xl font-black text-gray-900">{task.passingMarks || 40}</p>
          </div>
        </div>
      )}
      
      <div className="relative group mb-8">
        <textarea 
          className="w-full bg-white border-2 border-gray-100 rounded-3xl p-6 text-gray-700 focus:border-blue-600 transition-all outline-none min-h-[200px] font-medium leading-relaxed"
          placeholder={task?.type === 'Link' ? "Paste your link here (e.g. https://github.com/yourproject)" : "Explain your solution or provide a link..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={submitting}
        ></textarea>
        <div className="absolute top-4 right-4 text-gray-300 opacity-0 group-focus-within:opacity-100 transition-opacity">
          <Send size={20} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
          <Info size={18} />
          <span className="text-xs font-bold">Requires mentor approval to unlock next content.</span>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:bg-blue-300 active:scale-95"
        >
          {submitting ? 'Submitting...' : 'Confirm Submission'}
          {!submitting && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
};

const CoursePlayer = () => {
  const { userInfo } = useAuth();
  const { programId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ program: null, courses: [], modules: [], lessons: [], activities: [], progress: [] });
  const [activeActivity, setActiveActivity] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchCourseContent = useCallback(async (courseId) => {
    try {
      const { data: contentData } = await API.get(`/lms/courses/${courseId}/content`);
      setData(prev => ({
        ...prev,
        ...contentData
      }));
      
      // Auto-select first activity if none active
      if (contentData.activities.length > 0 && !activeActivity) {
        // Try to find first incomplete activity
        const firstIncomplete = contentData.activities.find(a => {
          const p = contentData.progress.find(pr => pr.activity === a._id);
          return p?.status !== 'Completed';
        });
        setActiveActivity(firstIncomplete || contentData.activities[0]);
      }
      
      // Expand modules that contain the active activity
      if (activeActivity) {
        const lesson = contentData.lessons.find(l => l._id === activeActivity.lesson);
        if (lesson) {
          setExpandedModules(prev => ({ ...prev, [lesson.module]: true }));
        }
      } else if (contentData.modules.length > 0) {
        setExpandedModules({ [contentData.modules[0]._id]: true });
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

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const flatActivities = useMemo(() => data.activities, [data.activities]);
  
  const currentIndex = useMemo(() => {
    if (!activeActivity) return -1;
    return flatActivities.findIndex(a => a._id === activeActivity._id);
  }, [activeActivity, flatActivities]);

  const handlePrev = () => {
    if (currentIndex > 0) setActiveActivity(flatActivities[currentIndex - 1]);
  };

  const handleNext = () => {
    if (currentIndex < flatActivities.length - 1) {
      const nextActivity = flatActivities[currentIndex + 1];
      if (nextActivity.isLocked) {
        return;
      }
      setActiveActivity(nextActivity);
    }
  };

  const getActivityIcon = (type, progress) => {
    if (progress?.status === 'Completed') return <CheckCircle2 size={18} className="text-green-500" />;
    if (progress?.status === 'Pending Approval' || progress?.status === 'Submitted') return <Clock size={18} className="text-blue-500" />;
    
    switch (type) {
      case 'Video': return <Video size={18} className="text-gray-400" />;
      case 'PDF': return <FileText size={18} className="text-gray-400" />;
      case 'Quiz': return <HelpCircle size={18} className="text-gray-400" />;
      case 'Assignment': 
      case 'Task': return <ClipboardList size={18} className="text-gray-400" />;
      default: return <FileText size={18} className="text-gray-400" />;
    }
  };

  const handleUpdateProgress = async (activityId, payload) => {
    try {
      await API.post(`/lms/activities/${activityId}/progress`, payload);
      // Refresh progress data
      if (data.courses.length > 0) {
        const { data: contentData } = await API.get(`/lms/courses/${data.courses[0]._id}/content`);
        setData(prev => ({ ...prev, progress: contentData.progress }));
      }
      return true;
    } catch (error) {
      console.error('Error updating progress:', error);
      return false;
    }
  };

  const handleQuizSubmit = async (answers) => {
    try {
      await API.post(`/lms/activities/${activeActivity._id}/submit-quiz`, { answers });
      // Refresh progress data
      if (data.courses.length > 0) {
        const { data: contentData } = await API.get(`/lms/courses/${data.courses[0]._id}/content`);
        setData(prev => ({ ...prev, progress: contentData.progress }));
      }
      return true;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      return false;
    }
  };

  const currentProgress = useMemo(() => {
    if (!activeActivity) return null;
    return data.progress.find(p => p.activity === activeActivity._id);
  }, [activeActivity, data.progress]);

  const markAsComplete = async () => {
    if (!activeActivity) return;
    await handleUpdateProgress(activeActivity._id, { status: 'Completed' });
  };

  if (loading) return (
    <div className="flex h-screen bg-white">
      <div className="w-80 border-r border-gray-100 p-8 hidden md:block">
        <div className="h-8 bg-gray-100 rounded-xl w-2/3 mb-12 animate-pulse"></div>
        <div className="space-y-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-4">
              <div className="h-10 bg-gray-50 rounded-2xl w-full animate-pulse"></div>
              <div className="h-4 bg-gray-50/50 rounded-full w-3/4 animate-pulse ml-4"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-12">
        <div className="max-w-4xl mx-auto">
          <div className="h-12 bg-gray-100 rounded-2xl w-1/2 mb-8 animate-pulse"></div>
          <div className="aspect-video bg-gray-50 rounded-[40px] animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-white overflow-hidden text-gray-900 font-sans">
      {/* Sidebar Mobile Overlay */}
      {!sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(true)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed md:relative z-40 w-[340px] h-full bg-white border-r border-gray-100 transition-transform duration-500 ease-in-out flex flex-col shadow-2xl md:shadow-none
      `}>
        {/* Sidebar Header */}
        <div className="p-8 border-b border-gray-100 bg-white">
          <Link to="/my-learning" className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-all mb-6 group font-bold">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase tracking-[0.2em]">Exit Course</span>
          </Link>
          <h2 className="text-2xl font-black leading-tight mb-4 tracking-tight">{data.program?.title}</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Course Progress</p>
              <p className="text-xs font-black text-blue-600">{data.program?.progress || 0}%</p>
            </div>
            <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                style={{ width: `${data.program?.progress || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Journey Tree (Weeks -> Lessons -> Activities) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {data.modules.map((module, mIdx) => (
            <div key={module._id} className="rounded-3xl border border-transparent transition-all">
              <button 
                onClick={() => toggleModule(module._id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${expandedModules[module._id] ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-sm ${expandedModules[module._id] ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-500'}`}>
                    {mIdx + 1}
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Week {mIdx + 1}</p>
                    <h3 className={`font-bold text-sm leading-tight ${expandedModules[module._id] ? 'text-blue-900' : 'text-gray-700'}`}>{module.title}</h3>
                  </div>
                </div>
                <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${expandedModules[module._id] ? 'rotate-180 text-blue-600' : ''}`} />
              </button>

              {expandedModules[module._id] && (
                <div className="mt-2 ml-2 pl-4 border-l-2 border-gray-100 space-y-2 py-2">
                  {data.lessons.filter(l => l.module === module._id).map((lesson) => (
                    <div key={lesson._id} className="space-y-1">
                      <div className="px-2 py-2">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <BookOpen size={12} />
                          {lesson.title}
                        </h4>
                        <div className="space-y-1">
                          {data.activities.filter(a => a.lesson === lesson._id).map((activity) => {
                            const prog = data.progress.find(p => p.activity === activity._id);
                            const isActive = activeActivity?._id === activity._id;
                            const isLocked = activity.isLocked;
                            
                            return (
                              <button
                                key={activity._id}
                                disabled={isLocked}
                                title={isLocked ? "Complete previous lesson first" : ""}
                                onClick={() => {
                                  if (!isLocked) {
                                    setActiveActivity(activity);
                                    if (window.innerWidth < 768) setSidebarOpen(false);
                                  }
                                }}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left ${
                                  isActive 
                                    ? 'bg-white shadow-md border border-gray-100' 
                                    : isLocked 
                                      ? 'opacity-50 cursor-not-allowed border border-transparent' 
                                      : 'hover:bg-gray-50 border border-transparent'
                                }`}
                              >
                                <div className="shrink-0">
                                  {isLocked ? (
                                    <Lock size={18} className="text-gray-300" />
                                  ) : (
                                    getActivityIcon(activity.type, prog)
                                  )}
                                </div>
                                <span className={`text-sm font-semibold truncate ${isActive ? 'text-blue-600' : isLocked ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {activity.title}
                                </span>
                                
                                <div className="ml-auto flex items-center gap-2">
                                  {isLocked ? (
                                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Locked</span>
                                  ) : (
                                    <>
                                      {activity.xpPoints > 0 && (
                                        <span className="flex items-center gap-1 text-[8px] font-black text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100">
                                          {activity.xpPoints} XP
                                        </span>
                                      )}
                                      {prog?.status === 'Completed' ? (
                                        <CheckCircle2 size={14} className="text-green-500" />
                                      ) : (
                                        prog?.status === 'Pending Approval' && <Clock size={14} className="text-blue-500" />
                                      )}
                                    </>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 bg-gray-50/50">
          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Award size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Certified Program</p>
              <p className="text-xs font-bold text-gray-700 leading-none">Unlock Certificate at 100%</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#FAFBFF]">
        {/* Top Navigation / Mobile Toggle */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-500"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-4">
            {activeActivity && currentProgress?.status !== 'Completed' && (
              <button 
                onClick={markAsComplete}
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-green-50 text-green-700 font-bold rounded-xl border border-green-100 hover:bg-green-100 transition-all"
              >
                <CheckCircle2 size={18} />
                <span>Mark as Complete</span>
              </button>
            )}
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Lesson {currentIndex + 1} of {flatActivities.length}</span>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            {activeActivity ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-10">
                  <div className="flex items-center gap-3 text-blue-600 mb-3">
                    <span className="px-3 py-1 bg-blue-50 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100">
                      {activeActivity.type}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                    <span className="text-sm font-bold text-gray-400">Section {expandedModules[activeActivity.lesson] ? "Active" : "Module"}</span>
                  </div>
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
                    {activeActivity.title}
                  </h1>
                </div>

                {/* Content Renderers */}
                <div className="space-y-12">
                  {activeActivity.type === 'Video' && (
                    <div className="rounded-[40px] overflow-hidden shadow-2xl shadow-blue-900/10 border-8 border-white bg-black aspect-video relative group">
                      <VideoPlayer 
                        url={activeActivity.content} 
                        onProgress={(prog) => {
                          if (prog.played > 0.9 && currentProgress?.status !== 'Completed') {
                            markAsComplete();
                          }
                        }}
                      />
                    </div>
                  )}

                  {activeActivity.type === 'PDF' && (
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden h-[800px] flex flex-col">
                      <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500">Resource Viewer</span>
                        <a 
                          href={activeActivity.content} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 text-blue-600 font-bold text-xs hover:underline"
                        >
                          Open in New Tab <ExternalLink size={14} />
                        </a>
                      </div>
                      <iframe 
                        src={activeActivity.content} 
                        className="w-full h-full border-none"
                        title="PDF Viewer"
                      />
                    </div>
                  )}

                  {activeActivity.type === 'Text' && (
                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 md:p-16">
                      <div className="prose prose-blue max-w-none prose-h2:font-black prose-p:text-gray-600 prose-p:text-lg prose-p:leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: activeActivity.content }} />
                      </div>
                    </div>
                  )}

                  {activeActivity.type === 'Quiz' && (
                    <QuizPlayer 
                      activity={activeActivity} 
                      onSubmit={handleQuizSubmit}
                      previousResult={currentProgress}
                    />
                  )}

                  {(activeActivity.type === 'Assignment' || activeActivity.type === 'Task' || activeActivity.type === 'Reflection') && (
                    <TaskSubmission 
                      activity={activeActivity} 
                      onSubmit={(payload) => handleUpdateProgress(activeActivity._id, payload)}
                      previousResult={currentProgress}
                    />
                  )}
                  
                  {activeActivity.type === 'ExternalLink' && (
                    <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
                      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <ExternalLink size={40} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">External Resource</h3>
                      <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                        This lesson contains an external resource that will help you dive deeper into the topic.
                      </p>
                      <a 
                        href={activeActivity.content} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                      >
                        Visit Link <ExternalLink size={18} />
                      </a>
                    </div>
                  )}
                </div>

                <div className="h-32"></div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                  <PlayCircle size={48} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Ready to start?</h2>
                <p className="text-gray-500 max-w-md">Select a lesson from the sidebar to begin your learning journey.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <footer className="h-24 bg-white border-t border-gray-100 flex items-center justify-between px-8 shrink-0 z-20">
          <button 
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft size={24} />
            <span className="hidden sm:inline">Previous Lesson</span>
          </button>

          <div className="hidden lg:flex flex-col items-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Up Next</p>
            <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">
              {currentIndex < flatActivities.length - 1 ? flatActivities[currentIndex + 1].title : "End of Journey"}
            </p>
          </div>

          <button 
            onClick={handleNext}
            disabled={currentIndex >= flatActivities.length - 1 || (currentIndex < flatActivities.length - 1 && flatActivities[currentIndex + 1].isLocked)}
            className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all disabled:opacity-30 active:scale-95 shadow-xl shadow-gray-200"
          >
            <span className="hidden sm:inline">Next Lesson</span>
            <ChevronRight size={24} />
          </button>
        </footer>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
      ` }} />
    </div>
  );
};

export default CoursePlayer;
