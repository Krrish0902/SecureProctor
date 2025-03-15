import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
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
          <Link to="/exam" className="btn btn-primary">
            Take an Exam
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ marginLeft: '10px' }}>
            Login
          </Link>
        </div>
      </section>

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