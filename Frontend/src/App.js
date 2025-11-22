import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import CoursePage from './pages/CoursePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TutorsLoginPage from './pages/TutorsLoginPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tutors-login" element={<TutorsLoginPage />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/course/:slug" element={<CoursePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;