import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      // Demo users for testing
      const demoUsers = {
        'admin@test.com': {
          id: 'admin_1',
          name: 'Admin User',
          password: 'admin123',
          role: 'admin'
        },
        'student@test.com': {
          id: 'student_1',
          name: 'Student User',
          password: 'student123',
          role: 'student'
        }
      };

      const user = demoUsers[formData.email];

      if (user && user.password === formData.password) {
        // Store user data in localStorage
        const userData = {
          id: user.id,
          name: user.name,
          email: formData.email,
          role: user.role,
          loginTime: Date.now()
        };
        
        localStorage.setItem('user', JSON.stringify(userData));

        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/exam');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    }
  };

  return (
    <div className="login-container">
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 className="card-title">Login to SecureProctor</h2>
        
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Login
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p>Don't have an account? <span style={{ color: 'var(--primary-color)', cursor: 'pointer' }}>Sign up</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;