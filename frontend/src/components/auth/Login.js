import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Demo users
      const demoUsers = {
        'admin@test.com': { password: 'admin123', role: 'admin' },
        'student@test.com': { password: 'student123', role: 'student' }
      };

      const user = demoUsers[credentials.email];
      if (user && user.password === credentials.password) {
        const userData = {
          email: credentials.email,
          role: user.role,
          name: credentials.email.split('@')[0]
        };
        
        await login(userData);
        navigate(user.role === 'admin' ? '/admin/dashboard' : '/exam');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={credentials.email}
          onChange={(e) => setCredentials({...credentials, email: e.target.value})}
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="normal"
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        />
        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;