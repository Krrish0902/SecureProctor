import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [examSessions, setExamSessions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [riskData, setRiskData] = useState(null);

  useEffect(() => {
    // Get exam sessions from localStorage
    const sessions = getAllExamSessions();
    setExamSessions(sessions);
  }, []);

  // Function to get all exam sessions from localStorage
  const getAllExamSessions = () => {
    const sessions = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('examSession_')) {
        const session = JSON.parse(localStorage.getItem(key));
        sessions.push(session);
      }
    }
    return sessions;
  };

  // Prepare chart data for a student's risk analysis
  const prepareRiskChartData = (studentId) => {
    const studentSessions = examSessions.filter(session => 
      session.userId === studentId
    );

    return {
      labels: studentSessions.map(session => 
        new Date(session.startTime).toLocaleTimeString()
      ),
      datasets: [
        {
          label: 'Risk Score',
          data: studentSessions.map(session => session.riskScore),
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        },
        {
          label: 'Tab Switches',
          data: studentSessions.map(session => session.tabSwitches),
          borderColor: 'rgb(53, 162, 235)',
          tension: 0.1
        }
      ]
    };
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setRiskData(prepareRiskChartData(student.userId));
  };

  const getRiskLevel = (score) => {
    if (score < 30) return { level: 'Low', color: '#4CAF50' };
    if (score < 60) return { level: 'Moderate', color: '#FFC107' };
    return { level: 'High', color: '#F44336' };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Risk Analysis Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header card">
        <h2>Admin Dashboard</h2>
        <p>Monitor active exam sessions and risk assessments</p>
      </div>

      <div className="dashboard-stats card">
        <h3>Overview</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{examSessions.length}</div>
            <div className="stat-label">Total Sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {examSessions.filter(s => s.riskScore >= 60).length}
            </div>
            <div className="stat-label">High Risk Sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {examSessions.filter(s => s.isCompleted).length}
            </div>
            <div className="stat-label">Completed Exams</div>
          </div>
        </div>
      </div>

      <div className="active-sessions card">
        <h3>Exam Sessions</h3>
        <div className="sessions-table">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Start Time</th>
                <th>Duration</th>
                <th>Progress</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {examSessions.map((session) => {
                const risk = getRiskLevel(session.riskScore);
                return (
                  <tr key={session.sessionId}>
                    <td>{session.userName}</td>
                    <td>{new Date(session.startTime).toLocaleString()}</td>
                    <td>{Math.round(session.duration / 60)} mins</td>
                    <td>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${session.progress}%` }}
                        />
                        <span>{session.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        color: risk.color,
                        fontWeight: 'bold'
                      }}>
                        {risk.level} ({session.riskScore}%)
                      </span>
                    </td>
                    <td>{session.isCompleted ? 'Completed' : 'In Progress'}</td>
                    <td>
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleViewDetails(session)}
                      >
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

      {selectedStudent && riskData && (
        <div className="risk-analysis card">
          <h3>Risk Analysis for {selectedStudent.userName}</h3>
          <div className="risk-charts" style={{ height: '400px' }}>
            <Line data={riskData} options={chartOptions} />
          </div>
          <div className="risk-factors">
            <h4>Risk Factors</h4>
            <ul>
              {/* Fix the risk factors mapping */}
              {Object.entries(selectedStudent.riskFactors || {}).map(([type, value]) => (
                <li key={type}>
                  <strong>{type}:</strong>{' '}
                  {typeof value === 'object' ? (
                    <>
                      {value.regular && <span>Regular exits: {value.regular}, </span>}
                      {value.tabBar && <span>Tab bar exits: {value.tabBar}</span>}
                    </>
                  ) : (
                    <span>{value}</span>
                  )}
                </li>
              ))}
              <li>
                <strong>Tab Switches:</strong> {selectedStudent.tabSwitches || 0}
              </li>
              <li>
                <strong>Mouse Exits:</strong> {
                  selectedStudent.mouseExits?.count || 0
                } (Tab bar: {
                  selectedStudent.mouseExits?.topEdgeExits || 0
                })
              </li>
              <li>
                <strong>Inactivity Periods:</strong> {
                  selectedStudent.inactivityPeriods?.length || 0
                }
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;