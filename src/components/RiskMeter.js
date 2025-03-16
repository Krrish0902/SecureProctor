import React, { useEffect, useState } from 'react';

// Add after the import statement:
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// Add before the RiskMeter component:
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const RiskMeter = ({ riskScore, riskFactors }) => {
  const [previousScore, setPreviousScore] = useState(riskScore || 0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState(null);
  const [scoreChange, setScoreChange] = useState(0); // Track score change

  // Add warning thresholds
  const WARNING_THRESHOLDS = {
    MODERATE: 45,
    HIGH: 65,
    CRITICAL: 85
  };

  // Add a new effect to handle score changes
  useEffect(() => {
    if (riskScore !== previousScore && riskScore > previousScore) {
      const currentChange = riskScore - previousScore;
      setScoreChange(currentChange);
      
      // Check if we've crossed any threshold
      const crossedThreshold = 
        (previousScore < WARNING_THRESHOLDS.MODERATE && riskScore >= WARNING_THRESHOLDS.MODERATE) ||
        (previousScore < WARNING_THRESHOLDS.HIGH && riskScore >= WARNING_THRESHOLDS.HIGH) ||
        (previousScore < WARNING_THRESHOLDS.CRITICAL && riskScore >= WARNING_THRESHOLDS.CRITICAL);

      if (crossedThreshold) {
        let message = {
          title: riskScore >= WARNING_THRESHOLDS.CRITICAL ? 'Critical Risk Level' :
                 riskScore >= WARNING_THRESHOLDS.HIGH ? 'High Risk Level' :
                 'Moderate Risk Level',
          subtitle: riskScore >= WARNING_THRESHOLDS.CRITICAL ? "Immediate attention required - multiple violations detected" :
                   riskScore >= WARNING_THRESHOLDS.HIGH ? "Significant suspicious behavior detected" :
                   "Potentially suspicious behavior detected",
          details: []
        };

        // Add risk factor details since score increased
        if (riskFactors) {
          if (riskFactors.inactivity) {
            message.details.push({
              factor: 'Inactivity',
              detail: 'No activity detected in the last window',
              severity: 'High'
            });
          }
          if (riskFactors.tabSwitchFrequency > 2) {
            message.details.push({
              factor: 'Tab Switching',
              detail: `Switched tabs ${Math.round(riskFactors.tabSwitchFrequency)} times per minute`,
              severity: riskFactors.tabSwitchFrequency > 4 ? 'High' : 'Moderate'
            });
          }
          if (riskFactors.keyLatency > 1.5) {
            message.details.push({
              factor: 'Typing Pattern',
              detail: 'Significant change in typing rhythm detected',
              severity: riskFactors.keyLatency > 2 ? 'High' : 'Moderate'
            });
          }
          if (riskFactors.mouseSpeed > 2) {
            message.details.push({
              factor: 'Mouse Movement',
              detail: 'Unusual mouse movement patterns detected',
              severity: riskFactors.mouseSpeed > 3 ? 'High' : 'Moderate'
            });
          }
          if (riskFactors.mouseExit && (riskFactors.mouseExit.regular > 50 || riskFactors.mouseExit.tabBar > 50)) {
            message.details.push({
              factor: 'Mouse Exit Pattern',
              detail: `${riskFactors.mouseExit.tabBarExits} tab bar exits detected. ${riskFactors.mouseExit.totalExits} total exits.`,
              severity: riskFactors.mouseExit.tabBar > 50 ? 'High' : 'Moderate'
            });
          }
        }

        setWarningMessage(message);
        setShowWarning(true);
      }
      
      setPreviousScore(riskScore);
    }
  }, [riskScore]); // Only depend on riskScore, not previousScore

  // Remove previousScore update from the existing effect
  useEffect(() => {
    if (showWarning) {
      const timeout = setTimeout(() => {
        setShowWarning(false);
        setWarningMessage(null);
      }, 7000);
      
      return () => clearTimeout(timeout);
    }
  }, [showWarning]);

  // Add helper function to determine primary risk factor
  const getPrimaryRiskFactor = (factors) => {
    if (!factors) return { 
      title: 'Unknown',
      description: 'Multiple behavior changes detected',
      severity: 'High',
      color: '#F44336'
    };
    
    const riskLevels = [
      {
        check: factors.inactivity,
        title: 'Inactivity',
        description: 'No activity detected in the last window',
        severity: 'High',
        color: '#F44336'
      },
      {
        check: factors.tabSwitchFrequency > 4,
        title: 'Excessive Tab Switching',
        description: `Switched tabs ${Math.round(factors.tabSwitchFrequency)} times per minute`,
        severity: 'High',
        color: '#FF9800'
      },
      {
        check: factors.keyLatency > 2,
        title: 'Unusual Typing Pattern',
        description: 'Significant change in typing rhythm detected',
        severity: 'High',
        color: '#FF9800'
      },
      {
        check: factors.mouseSpeed > 3,
        title: 'Suspicious Mouse Movement',
        description: 'Highly unusual mouse movement patterns detected',
        severity: 'High',
        color: '#FF9800'
      },
      {
        check: factors.tabSwitchFrequency > 2,
        title: 'Frequent Tab Switching',
        description: `Above normal tab switching activity detected`,
        severity: 'Moderate',
        color: '#FFC107'
      }
    ];
    
    return riskLevels.find(level => level.check) || {
      title: 'Multiple Factors',
      description: 'Several behavior changes detected',
      severity: 'Moderate',
      color: '#FFC107'
    };
  };

  const getRiskLevel = (score) => {
    if (score < WARNING_THRESHOLDS.MODERATE) return { level: 'Low', color: '#4CAF50' };
    if (score < WARNING_THRESHOLDS.HIGH) return { level: 'Moderate', color: '#FFC107' };
    if (score < WARNING_THRESHOLDS.CRITICAL) return { level: 'High', color: '#FF9800' };
    return { level: 'Critical', color: '#F44336' };
  };

  const risk = getRiskLevel(riskScore);

  return (
    <div className="risk-meter-container">
      <div className="risk-meter-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>
          Risk Level: <span style={{ color: risk.color, fontWeight: 'bold' }}>{risk.level}</span>
        </span>
        {scoreChange !== 0 && (
          <span style={{ 
            color: scoreChange > 0 ? '#F44336' : '#4CAF50',
            fontSize: '0.9em',
            fontWeight: 'bold'
          }}>
            {scoreChange > 0 ? '▲' : '▼'} {Math.abs(scoreChange).toFixed(1)}%
          </span>
        )}
      </div>
      
      <div className="risk-meter">
        <div 
          className="risk-meter-fill" 
          style={{ 
            width: `${riskScore}%`, 
            backgroundColor: risk.color,
            transition: 'width 0.3s, background-color 0.3s'
          }} 
        />
        {previousScore > 0 && previousScore !== riskScore && (
          <div 
            style={{
              position: 'absolute',
              left: `${previousScore}%`,
              top: 0,
              height: '100%',
              width: '2px',
              backgroundColor: '#666',
              transform: 'translateX(-1px)',
              opacity: 0.5
            }}
          />
        )}
      </div>
      
      <div className="risk-meter-value" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{Math.round(riskScore)}%</span>
        {previousScore > 0 && previousScore !== riskScore && (
          <span style={{ fontSize: '0.8em', color: '#666' }}>
            Previous: {Math.round(previousScore)}%
          </span>
        )}
      </div>

      {/* Warning Popup */}
      {showWarning && warningMessage && (
        <div className="warning-popup" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: 'white',
          border: `2px solid ${risk.color}`,
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          maxWidth: '400px',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <h4 style={{ color: risk.color, margin: '0 0 5px 0' }}>
            {warningMessage.title}
          </h4>
          <div style={{ 
            fontSize: '0.9em', 
            color: '#666', 
            marginBottom: '10px'
          }}>
            {warningMessage.subtitle}
          </div>
          <div style={{ marginBottom: '10px' }}>
            Risk Score: {Math.round(riskScore)}% 
            <span style={{ color: scoreChange > 0 ? '#F44336' : '#4CAF50' }}>
              ({scoreChange > 0 ? '+' : ''}{Math.round(scoreChange)}%)
            </span>
          </div>
          {warningMessage.details.map((detail, index) => (
            <div 
              key={index} 
              style={{ 
                padding: '8px',
                marginBottom: '5px',
                backgroundColor: detail.severity === 'High' ? '#ffebee' : '#fff3e0',
                borderRadius: '4px'
              }}
            >
              <div style={{ fontWeight: 'bold', color: detail.severity === 'High' ? '#d32f2f' : '#f57c00' }}>
                {detail.factor}
              </div>
              <div style={{ fontSize: '0.9em' }}>{detail.detail}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiskMeter;