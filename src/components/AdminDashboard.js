import React, { useState } from 'react';

const AdminDashboard = () => {
  // Mock data for active exam sessions
  const [activeSessions] = useState([
    {
      id: 'session1',
      userId: '12345',
      userName: 'John Doe',
      examTitle: 'Computer Science Fundamentals',
      startTime: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
      progress: 70, // percent
      riskScore: 15,
      questionsAnswered: 7,
      totalQuestions: 10,
      tabSwitches: 2,
      timeAway: '00:45'
    },
    {
      id: 'session2',
      userId: '67890',
      userName: 'Jane Smith',
      examTitle: 'Computer Science Fundamentals',
      startTime: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
      progress: 40,
      riskScore: 65,
      questionsAnswered: 4,
      totalQuestions: 10,
      tabSwitches: 8,
      timeAway: '03:20'
    },
    {
      id: 'session3',
      userId: '54321',
      userName: 'Bob Johnson',
      examTitle: 'Computer Science Fundamentals',
      startTime: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
      progress: 20,
      riskScore: 5,
      questionsAnswered: 2,
      totalQuestions: 10,
      tabSwitches: 0,
      timeAway: '00:00'
    }
  ]);

  // Get risk level and color
  const getRiskLevel = (score) => {
    if (score < 30) return { level: 'Low', color: '#4CAF50' };
    if (score < 60) return { level: 'Moderate', color: '#FFC107' };
    if (score < 80) return { level: 'High', color: '#FF9800' };
    return { level: 'Very High', color: '#F44336' };
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate time elapsed
  const getTimeElapsed = (dateString) => {
    const startTime = new Date(dateString);
    const now = new Date();
    const diffMs = now - startTime;
    const diffMins = Math.floor(diffMs / 60000);
    return `${diffMins} min`;
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header card">
        <h2>Admin Dashboard</h2>
        <p>Monitor active exam sessions and risk assessments</p>
      </div>

      <div className="dashboard-stats card">
        <h3>Overview</h3>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
          <div className="stat-card" style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px', textAlign: 'center' }}>
            <div className="stat-value" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
              {activeSessions.length}
            </div>
            <div className="stat-label">Active Sessions</div>
          </div>
          <div className="stat-card" style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px', textAlign: 'center' }}>
            <div className="stat-value" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>
              {activeSessions.filter(s => s.riskScore >= 60).length}
            </div>
            <div className="stat-label">High Risk Sessions</div>
          </div>
          <div className="stat-card" style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px', textAlign: 'center' }}>
            <div className="stat-value" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
              {activeSessions.reduce((sum, session) => sum + session.questionsAnswered, 0)}
            </div>
            <div className="stat-label">Questions Answered</div>
          </div>
        </div>
      </div>

      <div className="active-sessions card">
        <h3>Active Exam Sessions</h3>
        <div className="sessions-table" style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Student</th>
                <th style={{ padding: '0.75rem' }}>Exam</th>
                <th style={{ padding: '0.75rem' }}>Start Time</th>
                <th style={{ padding: '0.75rem' }}>Elapsed</th>
                <th style={{ padding: '0.75rem' }}>Progress</th>
                <th style={{ padding: '0.75rem' }}>Risk Score</th>
                <th style={{ padding: '0.75rem' }}>Tab Switches</th>
                <th style={{ padding: '0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeSessions.map(session => {
                const risk = getRiskLevel(session.riskScore);
                return (
                  <tr key={session.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem' }}>{session.userName}</td>
                    <td style={{ padding: '0.75rem' }}>{session.examTitle}</td>
                    <td style={{ padding: '0.75rem' }}>{formatDate(session.startTime)}</td>
                    <td style={{ padding: '0.75rem' }}>{getTimeElapsed(session.startTime)}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '100px', backgroundColor: '#eee', height: '8px', borderRadius: '4px', overflow: 'hidden', marginRight: '8px' }}>
                          <div style={{ width: `${session.progress}%`, backgroundColor: 'var(--primary-color)', height: '100%' }}></div>
                        </div>
                        <span>{session.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ 
                        color: risk.color, 
                        fontWeight: 'bold',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: `${risk.color}20`,
                        borderRadius: '4px'
                      }}>
                        {risk.level} ({session.riskScore}%)
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{session.tabSwitches} ({session.timeAway})</td>
                    <td style={{ padding: '0.75rem' }}>
                      <button className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="risk-analysis card">
        <h3>Risk Analysis</h3>
        <p>This section would contain charts and detailed analytics about risk patterns across all exams.</p>
        <div className="placeholder-chart" style={{ 
          height: '200px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginTop: '1rem'
        }}>
          <span>Risk Analysis Charts (Placeholder)</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 