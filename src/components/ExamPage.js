import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RiskMeter from './RiskMeter';
import BaselineProgress from './BaselineProgress';
import sampleExamData from '../utils/sampleExamData';
import UserBehaviorModel from '../models/UserBehaviorModel';
import { 
  initBehaviorTracking, 
  getCurrentBehaviorWindow, 
  recordQuestionInteraction 
} from '../utils/behaviorTracking';

const ExamPage = () => {
  const navigate = useNavigate();
  const [examData] = useState(sampleExamData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(examData.duration * 60); // in seconds
  const [isBaselineCollecting, setIsBaselineCollecting] = useState(true);
  const [baselineProgress, setBaselineProgress] = useState(0);
  const [riskScore, setRiskScore] = useState(0);
  const [userModel, setUserModel] = useState(null);
  
  // Initialize behavior tracking and user model
  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Initialize behavior tracking
    const cleanupTracking = initBehaviorTracking();
    
    // Initialize user model
    const model = new UserBehaviorModel(user.id);
    setUserModel(model);
    
    // Start baseline collection
    const hasExistingBaseline = model.collectBaselineData(
      (progress) => {
        setBaselineProgress(progress);
      },
      () => {
        setIsBaselineCollecting(false);
        setBaselineProgress(100);
      }
    );
    
    // If user already has a baseline, skip collection phase
    if (hasExistingBaseline) {
      setIsBaselineCollecting(false);
      setBaselineProgress(100);
    }
    
    // Start timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Start risk assessment
    const riskAssessmentInterval = setInterval(() => {
      if (!isBaselineCollecting && userModel) {
        const currentWindow = getCurrentBehaviorWindow();
        const score = userModel.detectAnomalies(currentWindow);
        setRiskScore(score);
      }
    }, 5000); // Check every 5 seconds
    
    return () => {
      cleanupTracking();
      clearInterval(timer);
      clearInterval(riskAssessmentInterval);
    };
  }, [navigate]);
  
  // Record question view when changing questions
  useEffect(() => {
    if (examData.questions[currentQuestionIndex]) {
      recordQuestionInteraction(
        examData.questions[currentQuestionIndex].id,
        'view'
      );
    }
  }, [currentQuestionIndex, examData.questions]);
  
  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
    
    // Record the answer interaction
    recordQuestionInteraction(questionId, 'answer', { answer });
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < examData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSubmitExam = () => {
    // In a real app, you would submit the answers to a server
    alert('Exam submitted successfully!');
    
    // Update the user model with the completed exam data
    if (userModel) {
      userModel.updateFromCompletedExam(getCurrentBehaviorWindow());
    }
    
    // Navigate to a results page (not implemented in this demo)
    navigate('/');
  };
  
  // Format time remaining as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get current question
  const currentQuestion = examData.questions[currentQuestionIndex];
  
  return (
    <div className="exam-page">
      {/* Exam Header */}
      <div className="exam-header card">
        <h2>{examData.title}</h2>
        <p>{examData.description}</p>
        <div className="exam-meta" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <div>
            Question {currentQuestionIndex + 1} of {examData.questions.length}
          </div>
          <div className="timer" style={{ fontWeight: 'bold' }}>
            Time Remaining: {formatTime(timeRemaining)}
          </div>
        </div>
      </div>
      
      {/* Baseline Progress */}
      {isBaselineCollecting && (
        <BaselineProgress progress={baselineProgress} />
      )}
      
      {/* Risk Meter */}
      {!isBaselineCollecting && (
        <RiskMeter riskScore={riskScore} />
      )}
      
      {/* Question Card */}
      <div className="question-card card">
        <h3>Question {currentQuestionIndex + 1}</h3>
        <p className="question-text">{currentQuestion.text}</p>
        
        {/* Multiple Choice Question */}
        {currentQuestion.type === 'multiple-choice' && (
          <div className="options">
            {currentQuestion.options.map((option) => (
              <div className="option" key={option.id}>
                <label>
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option.id}
                    checked={answers[currentQuestion.id] === option.id}
                    onChange={() => handleAnswerChange(currentQuestion.id, option.id)}
                  />
                  {option.text}
                </label>
              </div>
            ))}
          </div>
        )}
        
        {/* Text Question */}
        {currentQuestion.type === 'text' && (
          <div className="text-answer">
            <textarea
              rows="5"
              placeholder="Type your answer here..."
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            ></textarea>
          </div>
        )}
      </div>
      
      {/* Navigation Buttons */}
      <div className="question-nav" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
        <button 
          className="btn btn-secondary" 
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        
        {currentQuestionIndex < examData.questions.length - 1 ? (
          <button 
            className="btn btn-primary" 
            onClick={handleNextQuestion}
          >
            Next
          </button>
        ) : (
          <button 
            className="btn btn-primary" 
            onClick={handleSubmitExam}
          >
            Submit Exam
          </button>
        )}
      </div>
      
      {/* Question Navigator */}
      <div className="question-navigator card" style={{ marginTop: '2rem' }}>
        <h3>Question Navigator</h3>
        <div className="question-dots" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
          {examData.questions.map((question, index) => (
            <div
              key={question.id}
              className="question-dot"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: answers[question.id] ? 'var(--success-color)' : 'var(--gray-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                border: index === currentQuestionIndex ? '2px solid var(--primary-color)' : 'none'
              }}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamPage; 