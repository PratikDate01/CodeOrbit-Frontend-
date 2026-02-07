import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  FormControl, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Paper,
  Divider,
  Alert
} from '@mui/material';
import { CheckCircle, Send } from 'lucide-react';

const QuizPlayer = ({ activity, onComplete, existingProgress }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(existingProgress?.status === 'Pending Approval' || existingProgress?.status === 'Completed');
  const [result, setResult] = useState(null);

  const handleOptionChange = (questionIndex, value) => {
    setAnswers({ ...answers, [questionIndex]: value });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < activity.quizData.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    const answerArray = activity.quizData.map((_, index) => answers[index]);
    const data = await onComplete(answerArray);
    if (data) {
      setResult(data);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircle size={64} color="#10b981" />
        <Typography variant="h5" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
          Quiz Submitted!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Your quiz has been submitted and is pending admin review.
        </Typography>
        {existingProgress?.marks !== undefined && (
          <Alert severity="info" sx={{ maxWidth: 300, mx: 'auto', fontWeight: 700 }}>
            Auto-calculated Score: {existingProgress.marks.toFixed(1)}%
          </Alert>
        )}
        {result && (
          <Alert severity="success" sx={{ maxWidth: 300, mx: 'auto', mt: 2, fontWeight: 700 }}>
            Score: {result.score.toFixed(1)}%
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
        {activity.title}
      </Typography>
      <Divider sx={{ mb: 4 }} />
      
      {activity.quizData.map((q, index) => (
        <Paper key={index} variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            {index + 1}. {q.question}
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={answers[index] || ''}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            >
              {q.options.map((option, optIndex) => (
                <FormControlLabel 
                  key={optIndex} 
                  value={option} 
                  control={<Radio />} 
                  label={option} 
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
      ))}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          size="large" 
          startIcon={<Send size={18} />}
          onClick={handleSubmit}
          sx={{ px: 6, borderRadius: 2 }}
        >
          Submit Quiz
        </Button>
      </Box>
    </Box>
  );
};

export default QuizPlayer;
