import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DedicatedEnquiryManager from './pages/DedicatedEnquiryManager';
import LoansManager from './pages/LoansManager';
import BlogsManager from './pages/BlogsManager';
import WebsiteManager from './pages/WebsiteManager';
import LendingPartnersManager from './pages/LendingPartnersManager';
import FAQsManager from './pages/FAQsManager';
import NewsManager from './pages/NewsManager';
import MediaManager from './pages/MediaManager';
import SettingsManager from './pages/SettingsManager';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* THE 7 MANDATORY DEDICATED LOAN ENQUIRY PAGES */}
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

          {/* Loans CRUD */}
          <Route path="loans" element={<LoansManager />} />

          {/* CMS & Content Management */}
          <Route path="website/home" element={<WebsiteManager section="home" />} />
          <Route path="website/partners" element={<LendingPartnersManager />} />
          <Route path="website/faqs" element={<FAQsManager />} />
          <Route path="website/news" element={<NewsManager />} />

          {/* Blogs */}
          <Route path="blogs" element={<BlogsManager />} />

          {/* Media & Settings */}
          <Route path="media" element={<MediaManager />} />
          <Route path="settings" element={<SettingsManager />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
