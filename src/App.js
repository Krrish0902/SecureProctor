import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './components/Home';
import ExamPage from './components/ExamPage';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App; 