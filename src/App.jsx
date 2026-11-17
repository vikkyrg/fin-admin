import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HomepageEnquiriesPage from './pages/HomepageEnquiriesPage';
import DedicatedEnquiryManager from './pages/DedicatedEnquiryManager';
import LoansManager from './pages/LoansManager';
import WebsiteManager from './pages/WebsiteManager';
import LendingPartnersManager from './pages/LendingPartnersManager';
import FAQsManager from './pages/FAQsManager';
import NewsManager from './pages/NewsManager';
import MediaManager from './pages/MediaManager';
import SettingsManager from './pages/SettingsManager';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* DEDICATED HOMEPAGE ENQUIRY MANAGEMENT */}
            <Route path="enquiries" element={<HomepageEnquiriesPage />} />

            {/* THE 8 DEDICATED LOAN ENQUIRY PAGES */}
            <Route 
              path="enquiries/personal-loan" 
              element={<DedicatedEnquiryManager loanType="personal-loan" />} 
            />
            <Route 
              path="enquiries/loan-against-securities" 
              element={<DedicatedEnquiryManager loanType="loan-against-securities" />} 
            />
            <Route 
              path="enquiries/business-loan" 
              element={<DedicatedEnquiryManager loanType="business-loan" />} 
            />
            <Route 
              path="enquiries/home-loan" 
              element={<DedicatedEnquiryManager loanType="home-loan" />} 
            />
            <Route 
              path="enquiries/loan-against-property" 
              element={<DedicatedEnquiryManager loanType="loan-against-property" />} 
            />
            <Route 
              path="enquiries/education-loan" 
              element={<DedicatedEnquiryManager loanType="education-loan" />} 
            />
            <Route 
              path="enquiries/gold-loan" 
              element={<DedicatedEnquiryManager loanType="gold-loan" />} 
            />
            <Route 
              path="enquiries/vehicle-loan" 
              element={<DedicatedEnquiryManager loanType="vehicle-loan" />} 
            />

            {/* Loans CRUD */}
            <Route path="loans" element={<LoansManager />} />

            {/* CMS & Content Management */}
            <Route path="website/home" element={<WebsiteManager section="home" />} />
            <Route path="website/partners" element={<LendingPartnersManager />} />
            <Route path="website/faqs" element={<FAQsManager />} />
            <Route path="website/news" element={<NewsManager />} />

            {/* Media & Settings */}
            <Route path="media" element={<MediaManager />} />
            <Route path="settings" element={<SettingsManager />} />
          </Route>

          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
