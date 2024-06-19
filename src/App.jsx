import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RegistrationPage from './RegistrationPage';
import LoginPage from './LoginPage';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import NotFoundPage from './NotFoundPage';
import ExamList from './ExamList'; // Adjust the import path to where your ExamList file is located
import ExamPage from './ExamPage';
import Performance from './Performance';
import ExamReview from './ExamReview';
import './index.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/examList" element={<ExamList />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/exam/:examId" element={<ExamPage />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/review" element={<ExamReview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
