import React from 'react';

/**
 * BaselineProgress Component
 * 
 * Displays a progress bar for the baseline data collection phase.
 * 
 * @param {Object} props
 * @param {Number} props.progress - The current progress percentage (0-100)
 */
const BaselineProgress = ({ progress }) => {
  // Ensure the progress is within bounds
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  // Calculate remaining time in minutes
  const remainingTimeMinutes = Math.ceil((100 - normalizedProgress) / 100 * 10); // Assuming 10 minutes total
  
  return (
    <div className="baseline-progress-container" style={{ marginBottom: '2rem' }}>
      <div className="card">
        <h3 className="card-title">Establishing Your Behavioral Baseline</h3>
        
        <p>
          We're collecting data to establish your unique behavioral patterns. 
          This helps us accurately detect anomalies during the exam.
        </p>
        
        <div className="progress-bar-container" style={{ marginTop: '1.5rem' }}>
          <div className="progress-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Progress</span>
            <span>{Math.round(normalizedProgress)}%</span>
          </div>
          
          <div className="progress-bar" style={{ 
            height: '10px', 
            backgroundColor: '#e0e0e0', 
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div className="progress-fill" style={{ 
              height: '100%', 
              width: `${normalizedProgress}%`, 
              backgroundColor: 'var(--primary-color)',
              transition: 'width 0.3s'
            }} />
          </div>
          
          <div className="remaining-time" style={{ 
            textAlign: 'center', 
            marginTop: '1rem',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            {normalizedProgress < 100 ? (
              <span>Approximately {remainingTimeMinutes} minute{remainingTimeMinutes !== 1 ? 's' : ''} remaining</span>
            ) : (
              <span>Baseline collection complete!</span>
            )}
          </div>
        </div>
        
        <div className="baseline-instructions" style={{ marginTop: '1.5rem' }}>
          <p>Please continue working on the exam normally. The system is learning your:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Typing patterns</li>
            <li>Mouse movement behavior</li>
            <li>Focus and attention patterns</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BaselineProgress;