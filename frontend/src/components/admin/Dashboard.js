import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const mockStudents = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    riskLevel: 'HIGH',
    violations: [
      { type: 'TAB_SWITCH', count: 5 },
      { type: 'SUSPICIOUS_TYPING', value: 30 }
    ]
  },
  // Add more mock data
];

const Dashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setDialogOpen(true);
  };

  const handleAction = (action) => {
    console.log(`Taking action: ${action} for student:`, selectedStudent);
    setDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Exam Proctoring Dashboard
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Risk Level</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={student.riskLevel} 
                    color={getRiskColor(student.riskLevel)}
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => handleViewDetails(student)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md">
        {selectedStudent && (
          <>
            <DialogTitle>
              Student Details: {selectedStudent.name}
            </DialogTitle>
            <DialogContent>
              <Typography variant="h6" gutterBottom>
                Violations:
              </Typography>
              {selectedStudent.violations.map((violation, index) => (
                <Typography key={index}>
                  • {violation.type}: {violation.count || violation.value}
                </Typography>
              ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleAction('WARNING')}>
                Send Warning
              </Button>
              <Button 
                color="error" 
                onClick={() => handleAction('TERMINATE')}
              >
                Terminate Exam
              </Button>
              <Button onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Dashboard;