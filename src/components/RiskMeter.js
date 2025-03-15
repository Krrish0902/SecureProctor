import React from 'react';

/**
 * RiskMeter Component
 * 
 * Displays a visual representation of the current risk score.
 * 
 * @param {Object} props
 * @param {Number} props.riskScore - The current risk score (0-100)
 */
const RiskMeter = ({ riskScore }) => {
  // Ensure the risk score is within bounds
  const normalizedScore = Math.min(100, Math.max(0, riskScore));
  
  // Determine risk level and color based on score
  const getRiskLevel = (score) => {
    if (score < 30) return 'Low';
    if (score < 60) return 'Moderate';
    if (score < 80) return 'High';
    return 'Very High';
  };
  
  const getRiskColor = (score) => {
    if (score < 30) return '#4CAF50'; // Green
    if (score < 60) return '#FFC107'; // Yellow
    if (score < 80) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };
  
  const riskLevel = getRiskLevel(normalizedScore);
  const riskColor = getRiskColor(normalizedScore);
  
  return (
    <div className="risk-meter-container">
      <div className="risk-meter-label">
        Risk Level: <span style={{ color: riskColor, fontWeight: 'bold' }}>{riskLevel}</span>
      </div>
      <div className="risk-meter">
        <div 
          className="risk-meter-fill" 
          style={{ 
            width: `${normalizedScore}%`, 
            backgroundColor: riskColor 
          }}
        />
      </div>
      <div className="risk-meter-value">{Math.round(normalizedScore)}%</div>
      
      {normalizedScore >= 60 && (
        <div className="risk-warning" style={{ color: riskColor, marginTop: '0.5rem' }}>
          <strong>Warning:</strong> Unusual behavior detected. Please ensure you're following exam guidelines.
        </div>
      )}
    </div>
  );
};

export default RiskMeter; 