import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import PracticePage from './pages/PracticePage';
import DomainTrackerPage from './pages/DomainTrackerPage';
import InterviewHistoryPage from './pages/InterviewHistoryPage';
import GrowthAnalyticsPage from './pages/GrowthAnalyticsPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import ReportPage from './pages/ReportPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main App Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="domain-tracker" element={<DomainTrackerPage />} />
            <Route path="history" element={<InterviewHistoryPage />} />
            <Route path="growth" element={<GrowthAnalyticsPage />} />
            <Route path="settings" element={<ProfileSettingsPage />} />
            <Route path="report/:sessionId" element={<ReportPage />} />
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
