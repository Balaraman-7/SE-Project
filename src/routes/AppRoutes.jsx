import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout & Route Protection
import DashboardLayout from '../components/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Public & Auth Pages
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import Users from '../pages/admin/Users';
import Courses from '../pages/admin/Courses';
import Subjects from '../pages/admin/Subjects';
import AdminExams from '../pages/admin/AdminExams';
import AdminReports from '../pages/admin/AdminReports';
import AdminResults from '../pages/admin/AdminResults';

// Faculty Pages
import FacultyDashboard from '../pages/faculty/FacultyDashboard';
import QuestionBank from '../pages/faculty/QuestionBank';
import CreateExam from '../pages/faculty/CreateExam';
import ScheduleExam from '../pages/faculty/ScheduleExam';
import Evaluation from '../pages/faculty/Evaluation';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import AvailableExams from '../pages/student/AvailableExams';
import OnlineExam from '../pages/student/OnlineExam';
import StudentResults from '../pages/student/StudentResults';
import StudentPerformance from '../pages/student/StudentPerformance';

// Shared Pages
import Profile from '../pages/common/Profile';
import Notifications from '../pages/common/Notifications';
import Settings from '../pages/common/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Portal */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="courses" element={<Courses />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="exams" element={<AdminExams />} />
        <Route path="questions" element={<QuestionBank />} />
        <Route path="results" element={<AdminResults />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Faculty Portal */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/faculty/dashboard" replace />} />
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="questions" element={<QuestionBank />} />
        <Route path="exams/create" element={<CreateExam />} />
        <Route path="exams" element={<ScheduleExam />} />
        <Route path="evaluation" element={<Evaluation />} />
        <Route path="results" element={<AdminResults />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Student Portal (with sidebar layout) */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="exams" element={<AvailableExams />} />
        <Route path="my-exams" element={<AvailableExams />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="performance" element={<StudentPerformance />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Dedicated Fullscreen Online Examination Hall (without Dashboard sidebar) */}
      <Route
        path="/student/exam/:id"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <div className="min-h-screen bg-gray-100 p-6">
              <OnlineExam />
            </div>
          </ProtectedRoute>
        }
      />

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
