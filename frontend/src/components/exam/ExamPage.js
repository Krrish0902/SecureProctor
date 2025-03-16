import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Stepper, 
  Step, 
  StepButton, 
  Button, 
  Typography,
  Alert,
  Container 
} from '@mui/material';
import ProctorService from '../../services/proctoring/ProctorService';
import KeystrokeMonitor from '../../services/proctoring/KeystrokeMonitor';
import MouseTracker from '../../services/proctoring/MouseTracker';
import WindowMonitor from '../../services/proctoring/WindowMonitor';
import { MultipleChoice, EssayQuestion } from './QuestionTypes';

const sampleQuestions = [
  {
    type: 'mcq',
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 'Paris'
  },
  {
    type: 'essay',
    question: 'Explain the concept of Object-Oriented Programming.',
    minWords: 100
  },
  // Add more questions as needed
];

const ExamPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [warnings, setWarnings] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [riskLevel, setRiskLevel] = useState('LOW');

  useEffect(() => {
    KeystrokeMonitor.start();
    MouseTracker.start();
    WindowMonitor.start();

    const intervalId = setInterval(() => {
      const status = ProctorService.getCurrentStatus();
      setRiskLevel(status.riskLevel);
      
      if (status.riskLevel === 'HIGH') {
        setIsBlocked(true);
      }
      
      setWarnings(status.warnings);
    }, 5000);

    return () => {
      clearInterval(intervalId);
      KeystrokeMonitor.stop();
      MouseTracker.stop();
      WindowMonitor.stop();
    };
  }, []);

  const handleAnswer = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const handleStep = (step) => {
    setActiveStep(step);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {warnings.length > 0 && (
          <Alert 
            severity={riskLevel === 'HIGH' ? 'error' : 'warning'} 
            sx={{ mb: 2 }}
          >
            {warnings[warnings.length - 1].message}
          </Alert>
        )}

        {isBlocked ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            Your exam has been suspended due to suspicious activity.
          </Alert>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Online Examination
            </Typography>

            <Stepper nonLinear activeStep={activeStep} sx={{ mb: 4 }}>
              {sampleQuestions.map((_, index) => (
                <Step key={index}>
                  <StepButton onClick={() => handleStep(index)}>
                    Question {index + 1}
                  </StepButton>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mt: 2 }}>
              {sampleQuestions[activeStep].type === 'mcq' ? (
                <MultipleChoice
                  question={sampleQuestions[activeStep]}
                  value={answers[activeStep] || ''}
                  onChange={(value) => handleAnswer(activeStep, value)}
                />
              ) : (
                <EssayQuestion
                  question={sampleQuestions[activeStep]}
                  value={answers[activeStep] || ''}
                  onChange={(value) => handleAnswer(activeStep, value)}
                />
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={() => handleStep(activeStep - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (activeStep === sampleQuestions.length - 1) {
                      // Submit exam
                      console.log('Submitting answers:', answers);
                    } else {
                      handleStep(activeStep + 1);
                    }
                  }}
                >
                  {activeStep === sampleQuestions.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ExamPage;