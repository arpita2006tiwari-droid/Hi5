import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';
import Login from './pages/Login';
import CoachDashboard from './pages/CoachDashboard';
import Attendance from './pages/Attendance';
import FraudDetection from './pages/FraudDetection';
import Insights from './pages/Insights';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route straight to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Default redirect for dashboard */}
          <Route index element={<Navigate to="/dashboard/coach" replace />} />
          {/* Coach routes */}
          <Route path="coach" element={<CoachDashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="fraud" element={<FraudDetection />} />
          <Route path="insights" element={<Insights />} />
          {/* Admin routes */}
          <Route path="admin" element={<div>Admin Dashboard (WIP)</div>} />
          {/* Fallbacks */}
          <Route path="*" element={<div className="p-8 text-center text-muted-foreground">Module under development</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
