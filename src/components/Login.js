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
    
    // For demo purposes, we'll use a simple validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    // For the hackathon, we'll just simulate a successful login
    // In a real app, you would make an API call to authenticate
    
    // Store user info in localStorage (for demo purposes only)
    localStorage.setItem('user', JSON.stringify({
      id: '12345',
      email: formData.email,
      name: 'Demo User',
    }));
    
    // Redirect to exam page
    navigate('/exam');
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