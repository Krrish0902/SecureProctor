import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserBehaviorModel from '../models/UserBehaviorModel';

const Home = () => {
  const [hasBaseline, setHasBaseline] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [recalculateProgress, setRecalculateProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has baseline
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const model = new UserBehaviorModel(user.id);
      setHasBaseline(model.loadModel());
    }
  }, []);

  const handleRecalculateBaseline = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please login first to recalculate baseline');
      return;
    }

    if (window.confirm('Are you sure you want to recalculate the baseline? This will reset all existing behavioral patterns.')) {
      setIsRecalculating(true);
      setRecalculateProgress(0);
      
      const model = new UserBehaviorModel(user.id);
      model.recalculateBaseline(
        (progress) => {
          setRecalculateProgress(progress);
        },
        () => {
          setIsRecalculating(false);
          setRecalculateProgress(100);
          setHasBaseline(true);
        }
      );
    }
  };

  // Add check for login before exam
  const handleStartExam = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      if (window.confirm('Please log in first to take an exam. Would you like to log in now?')) {
        navigate('/login');
      }
      return;
    }
    navigate('/exam');
  };

  return (
    <div className="home-container">
      <section className="hero">
        <h1>SecureProctor</h1>
        <h2>Privacy-Preserving Online Assessment System</h2>
        <p>
          Take online exams with confidence, knowing your privacy is protected.
          No invasive video surveillance, just smart behavioral analysis.
        </p>
        <div className="cta-buttons">
          <button onClick={handleStartExam} className="btn btn-primary">
            Take Exam
          </button>
          <Link to="/admin" className="btn btn-secondary" style={{ marginLeft: '10px' }}>
            Admin Dashboard
          </Link>
        </div>
      </section>

      {hasBaseline && !isRecalculating && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Behavioral Baseline</h3>
              <p style={{ color: '#666', margin: 0 }}>
                Not seeing accurate risk assessments? You can recalculate your behavioral baseline.
              </p>
            </div>
            <button
              className="btn btn-secondary"
              onClick={handleRecalculateBaseline}
              style={{ fontSize: '0.9em' }}
            >
              Recalculate Baseline
            </button>
          </div>
        </div>
      )}

      {isRecalculating && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
          <h3>Recalculating Baseline</h3>
          <div className="progress-bar" style={{ 
            height: '8px', 
            backgroundColor: '#e0e0e0', 
            borderRadius: '4px',
            marginTop: '1rem',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${recalculateProgress}%`,
              backgroundColor: 'var(--primary-color)',
              transition: 'width 0.3s'
            }} />
          </div>
          <p style={{ textAlign: 'center', marginTop: '0.5rem', color: '#666' }}>
            {recalculateProgress < 100 
              ? `Progress: ${Math.round(recalculateProgress)}%`
              : 'Baseline recalculation complete!'}
          </p>
        </div>
      )}

      <section className="features">
        <h2>Key Features</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>Privacy-First Approach</h3>
            <p>No camera required. We respect your privacy while maintaining academic integrity.</p>
          </div>
          <div className="card">
            <h3>Behavioral Analysis</h3>
            <p>Our system learns your unique test-taking patterns to detect anomalies.</p>
          </div>
          <div className="card">
            <h3>Real-time Feedback</h3>
            <p>Get immediate feedback on your risk score during the exam.</p>
          </div>
          <div className="card">
            <h3>Cross-Exam Learning</h3>
            <p>The system improves with each exam you take, becoming more accurate over time.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Baseline Creation</h3>
            <p>The system establishes your unique behavioral baseline during the first part of the exam.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Continuous Monitoring</h3>
            <p>Your typing patterns, mouse movements, and focus behaviors are analyzed in real-time.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Risk Assessment</h3>
            <p>The system calculates a risk score based on deviations from your baseline behavior.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Model Improvement</h3>
            <p>After each exam, the system refines its understanding of your normal behavior.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;