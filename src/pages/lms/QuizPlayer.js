import React, { useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { CheckCircle2, X, Send, HelpCircle } from 'lucide-react';

const QuizPlayer = ({ activity, onComplete, existingProgress }) => {
  const questions = activity.questions?.length
    ? activity.questions
    : activity.quizData || [];

  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(
    existingProgress?.status === 'Pending Approval' ||
    existingProgress?.status === 'Completed'
  );
  const [result, setResult] = useState(null);

  const handleOptionChange = (qIndex, value) => {
    setAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      return;
    }
    setSubmitting(true);
    const answerArray = questions.map((_, i) => answers[i]);
    const data = await onComplete(answerArray);
    if (data) {
      setResult(data);
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  const allAnswered = Object.keys(answers).length === questions.length;
  const score = result?.score ?? result?.marks ?? existingProgress?.marks;
  const isPassed = result?.passed || result?.status === 'Completed' || existingProgress?.status === 'Completed';

  // ── Submitted state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <Box sx={{ fontFamily: '"DM Sans", sans-serif' }}>
        <Box sx={{
          bgcolor: '#ffffff',
          border: '1px solid #e8e8e4',
          borderRadius: '16px',
          p: { xs: 3, sm: 4, md: 6 },
          textAlign: 'center',
        }}>
          {/* Icon */}
          <Box sx={{
            width: 64, height: 64,
            borderRadius: '50%',
            bgcolor: isPassed ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${isPassed ? '#bbf7d0' : '#fecaca'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 3,
          }}>
            {isPassed
              ? <CheckCircle2 size={28} color="#16a34a" strokeWidth={2} />
              : <X size={28} color="#dc2626" strokeWidth={2.5} />
            }
          </Box>

          <Typography sx={{
            fontWeight: 900, fontSize: { xs: '1.35rem', sm: '1.5rem' }, letterSpacing: '-0.04em',
            color: '#0a0a0a', fontFamily: '"DM Sans", sans-serif', mb: 0.75,
          }}>
            {isPassed ? 'Quiz Passed!' : 'Quiz Failed'}
          </Typography>

          <Typography sx={{
            fontSize: '0.9rem', color: '#a3a3a3',
            fontFamily: '"DM Sans", sans-serif', fontWeight: 500,
            maxWidth: 360, mx: 'auto', lineHeight: 1.7, mb: 4,
          }}>
            {isPassed
              ? 'Well done! You have successfully completed this knowledge check.'
              : `You didn't reach the passing score of ${activity.passingScore || 60}%. Review the material and try again.`}
          </Typography>

          {/* Score display */}
          {score !== undefined && (
            <Box sx={{
              display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
              px: { xs: 3, sm: 5 }, py: { xs: 2, sm: 3 },
              bgcolor: isPassed ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${isPassed ? '#bbf7d0' : '#fecaca'}`,
              borderRadius: '14px',
              mb: 4,
              width: { xs: '100%', sm: 'auto' },
              boxSizing: 'border-box',
            }}>
              <Typography sx={{
                fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: isPassed ? '#16a34a' : '#dc2626',
                fontFamily: '"DM Sans", sans-serif', mb: 0.5,
              }}>
                Your Score
              </Typography>
              <Typography sx={{
                fontWeight: 900, fontSize: { xs: '2rem', sm: '2.5rem' }, letterSpacing: '-0.05em', lineHeight: 1,
                color: isPassed ? '#16a34a' : '#dc2626',
                fontFamily: '"DM Sans", sans-serif',
              }}>
                {typeof score === 'number' ? score.toFixed(1) : score}%
              </Typography>
            </Box>
          )}

          {!isPassed && (
            <Box>
              <Button
                onClick={() => { setSubmitted(false); setAnswers({}); setResult(null); }}
                sx={{
                  py: 1.4, px: 4, borderRadius: '10px',
                  textTransform: 'none', fontWeight: 700,
                  fontSize: '0.9rem', fontFamily: '"DM Sans", sans-serif',
                  bgcolor: '#0a0a0a', color: '#ffffff', boxShadow: 'none',
                  '&:hover': { bgcolor: '#1a1a1a' },
                }}
              >
                Try Again
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  // ── Quiz form ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ fontFamily: '"DM Sans", sans-serif' }}>

      {/* Header */}
      <Box sx={{ mb: { xs: 3.5, md: 5 } }}>
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', gap: 1,
          bgcolor: '#eff6ff', border: '1px solid #bfdbfe',
          borderRadius: '100px', px: 2, py: 0.5, mb: 2.5,
        }}>
          <HelpCircle size={12} color="#2563eb" />
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: '"DM Sans", sans-serif' }}>
            Knowledge Check
          </Typography>
        </Box>

        <Typography sx={{
          fontWeight: 900, fontSize: { xs: '1.35rem', sm: '1.6rem', md: '1.9rem' },
          letterSpacing: '-0.04em', color: '#0a0a0a',
          fontFamily: '"DM Sans", sans-serif', lineHeight: 1.15, mb: 1,
        }}>
          {activity.title}
        </Typography>

        {activity.instructions && (
          <Typography sx={{
            fontSize: '0.9rem', color: '#737373', lineHeight: 1.7,
            fontFamily: '"DM Sans", sans-serif', fontWeight: 500,
          }}>
            {activity.instructions}
          </Typography>
        )}
      </Box>

      {/* Progress indicator */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        mb: 4, px: 0.5,
      }}>
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#a3a3a3', fontFamily: '"DM Sans", sans-serif' }}>
          {Object.keys(answers).length} of {questions.length} answered
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.75 }}>
          {questions.map((_, i) => (
            <Box key={i} sx={{
              width: 8, height: 8, borderRadius: '50%',
              bgcolor: answers[i] !== undefined ? '#2563eb' : '#e8e8e4',
              transition: 'background-color 0.2s',
            }} />
          ))}
        </Box>
      </Box>

      {/* Questions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {questions.map((q, qIdx) => (
          <Box key={qIdx} sx={{
            bgcolor: '#ffffff',
            border: `1px solid ${answers[qIdx] !== undefined ? '#bfdbfe' : '#e8e8e4'}`,
            borderRadius: '16px',
            p: { xs: 2.25, sm: 3, md: 3.5 },
            transition: 'border-color 0.2s',
          }}>
            {/* Question */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Box sx={{
                width: 28, height: 28, borderRadius: '7px', flexShrink: 0,
                bgcolor: answers[qIdx] !== undefined ? '#eff6ff' : '#f7f7f5',
                border: `1px solid ${answers[qIdx] !== undefined ? '#bfdbfe' : '#e8e8e4'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Typography sx={{
                  fontSize: '0.72rem', fontWeight: 800,
                  color: answers[qIdx] !== undefined ? '#2563eb' : '#a3a3a3',
                  fontFamily: '"DM Sans", sans-serif',
                }}>
                  {qIdx + 1}
                </Typography>
              </Box>
              <Typography sx={{
                fontWeight: 700, fontSize: '0.95rem', color: '#0a0a0a',
                fontFamily: '"DM Sans", sans-serif', lineHeight: 1.6, pt: 0.25,
              }}>
                {q.question}
              </Typography>
            </Box>

            {/* Options */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, pl: 0.5 }}>
              {q.options.map((option, oIdx) => {
                const isSelected = answers[qIdx] === oIdx || answers[qIdx] === option;
                return (
                  <Box
                    key={oIdx}
                    onClick={() => handleOptionChange(qIdx, oIdx)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 2,
                      p: { xs: 1.5, sm: 1.75 }, borderRadius: '10px', cursor: 'pointer',
                      border: `1.5px solid ${isSelected ? '#2563eb' : '#e8e8e4'}`,
                      bgcolor: isSelected ? '#eff6ff' : '#fafaf9',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        borderColor: isSelected ? '#2563eb' : '#c0c0bc',
                        bgcolor: isSelected ? '#eff6ff' : '#f7f7f5',
                      },
                    }}
                  >
                    {/* Radio circle */}
                    <Box sx={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${isSelected ? '#2563eb' : '#d4d4d0'}`,
                      bgcolor: isSelected ? '#2563eb' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}>
                      {isSelected && (
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#ffffff' }} />
                      )}
                    </Box>

                    <Typography sx={{
                      fontSize: '0.9rem',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? '#1d4ed8' : '#3f3f3f',
                      fontFamily: '"DM Sans", sans-serif',
                      lineHeight: 1.5,
                    }}>
                      {option}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Unanswered warning */}
      {!allAnswered && Object.keys(answers).length > 0 && (
        <Box sx={{
          mt: 3, px: { xs: 2, sm: 2.5 }, py: { xs: 1.25, sm: 1.5 },
          bgcolor: '#fffbeb', border: '1px solid #fde68a',
          borderRadius: '10px', display: 'flex', alignItems: 'center', gap: 1.5,
        }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#d97706', flexShrink: 0 }} />
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#92400e', fontFamily: '"DM Sans", sans-serif' }}>
            Please answer all {questions.length} questions before submitting.
          </Typography>
        </Box>
      )}

      {/* Submit */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          disabled={!allAnswered || submitting}
          onClick={handleSubmit}
          sx={{
            px: { xs: 4, sm: 6 }, py: { xs: 1.25, sm: 1.6 }, borderRadius: '10px',
            textTransform: 'none', fontWeight: 700,
            fontSize: '0.95rem', fontFamily: '"DM Sans", sans-serif',
            bgcolor: '#2563eb', boxShadow: 'none',
            '&:hover': { bgcolor: '#1d4ed8', boxShadow: '0 4px 20px rgba(37,99,235,0.22)' },
            '&:disabled': { bgcolor: '#e8e8e4', color: '#a3a3a3' },
          }}
        >
          {submitting
            ? <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CircularProgress size={16} sx={{ color: '#ffffff' }} />
                Submitting…
              </Box>
            : <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Send size={16} />
                Submit My Answers
              </Box>
          }
        </Button>
      </Box>
    </Box>
  );
};

export default QuizPlayer;