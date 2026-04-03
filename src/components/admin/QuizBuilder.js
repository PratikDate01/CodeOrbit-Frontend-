import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

const QuizBuilder = ({ questions, setQuestions }) => {
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Quiz Questions</h3>
        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-sm shadow-lg shadow-blue-200"
        >
          <Plus size={16} /> Add Question
        </button>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {questions.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No questions added yet. Click "Add Question" to start.</p>
          </div>
        ) : (
          questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative group hover:shadow-md transition-shadow">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={20} />
              </div>
              
              <div className="flex justify-between items-start mb-4 pl-4">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 rounded-lg text-sm font-black">
                  {qIndex + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-4 pl-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                    Question Text
                  </label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                    placeholder="Enter question here..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-gray-900 placeholder:text-gray-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className="relative">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                        Option {oIndex + 1}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correctAnswer === oIndex}
                          onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                          className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-sm ${
                            q.correctAnswer === oIndex ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-100'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `}} />
    </div>
  );
};

export default QuizBuilder;
