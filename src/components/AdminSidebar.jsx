import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Globe, FileText, HelpCircle, Newspaper, 
  Image, Settings, LogOut, ChevronDown, ChevronRight, 
  UserCheck, TrendingUp, Briefcase, Home, Building2, GraduationCap, 
  Coins, Layers, ShieldCheck, ExternalLink, BookmarkCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const { admin, logout } = useAuth();
  const [enquiriesOpen, setEnquiriesOpen] = useState(true);
  const [websiteOpen, setWebsiteOpen] = useState(false);
  const [loansOpen, setLoansOpen] = useState(false);

  const ENQUIRY_LINKS = [
    { name: 'Personal Loan', path: '/admin/enquiries/personal-loan', icon: UserCheck },
    { name: 'Loan Against Securities', path: '/admin/enquiries/loan-against-securities', icon: TrendingUp },
    { name: 'Business Loan', path: '/admin/enquiries/business-loan', icon: Briefcase },
    { name: 'Home Loan', path: '/admin/enquiries/home-loan', icon: Home },
    { name: 'Loan Against Property', path: '/admin/enquiries/loan-against-property', icon: Building2 },
    { name: 'Education Loan', path: '/admin/enquiries/education-loan', icon: GraduationCap },
    { name: 'Gold Loan', path: '/admin/enquiries/gold-loan', icon: Coins },
  ];

  return (
    <aside className="w-64 bg-brand-blue text-slate-200 min-h-screen flex flex-col flex-shrink-0 border-r border-brand-blueDark font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between">
        <Link to="/admin/dashboard" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-white text-brand-blue flex items-center justify-center font-extrabold text-sm shadow">
            FA
          </div>
          <div>
            <span className="font-bold text-brand-white text-base tracking-tight">FinAdvise</span>
            <span className="ml-1 text-[10px] uppercase font-bold text-brand-orange bg-orange-500/20 px-1 py-0.5 rounded">Admin</span>
          </div>
        </Link>
        <a 
          href="http://localhost:5173" 
          target="_blank" 
          rel="noreferrer" 
          title="Visit Public Website"
          className="text-blue-200 hover:text-brand-orange p-1 rounded transition"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 text-xs font-semibold">
        
        {/* 1. Dashboard */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `flex items-center px-3 py-2.5 rounded-xl transition ${isActive ? 'bg-brand-orange text-brand-white shadow-md font-bold' : 'text-blue-100 hover:bg-white/10 hover:text-brand-white'}`}
        >
          <LayoutDashboard className="w-4 h-4 mr-3 text-brand-green" />
          <span>Dashboard</span>
        </NavLink>

        {/* 2. Seven Dedicated Loan Enquiry Pages */}
        <div className="pt-2">
          <button
            onClick={() => setEnquiriesOpen(!enquiriesOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">Loan Enquiries</span>
            {enquiriesOpen ? <ChevronDown className="w-3.5 h-3.5 text-brand-green" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {enquiriesOpen && (
            <div className="mt-1 space-y-1 pl-1">
              {ENQUIRY_LINKS.map(link => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => `flex items-center px-3 py-2 rounded-lg transition text-[11px] ${isActive ? 'bg-brand-white text-brand-blue font-bold shadow-sm' : 'text-blue-100 hover:bg-white/10 hover:text-brand-white'}`}
                  >
                    <Icon className="w-3.5 h-3.5 mr-2.5 flex-shrink-0 text-brand-green" />
                    <span className="truncate">{link.name}</span>
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Loan Management */}
        <div className="pt-2">
          <button
            onClick={() => setLoansOpen(!loansOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Loan Products</span>
            {loansOpen ? <ChevronDown className="w-3.5 h-3.5 text-brand-green" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {loansOpen && (
            <div className="mt-1 space-y-1 pl-1">
              <NavLink
                to="/admin/loans"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-lg transition ${isActive ? 'bg-brand-white text-brand-blue font-bold' : 'text-blue-100 hover:bg-white/10'}`}
              >
                <Layers className="w-3.5 h-3.5 mr-2.5 text-brand-green" />
                <span>All 7 Loan Products</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* 4. Website CMS Management */}
        <div className="pt-2">
          <button
            onClick={() => setWebsiteOpen(!websiteOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Website Content</span>
            {websiteOpen ? <ChevronDown className="w-3.5 h-3.5 text-brand-green" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {websiteOpen && (
            <div className="mt-1 space-y-1 pl-1">
              <NavLink
                to="/admin/website/home"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-lg transition ${isActive ? 'bg-brand-white text-brand-blue font-bold' : 'text-blue-100 hover:bg-white/10'}`}
              >
                <span>Home Page CMS</span>
              </NavLink>
              <NavLink
                to="/admin/website/partners"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-lg transition ${isActive ? 'bg-brand-white text-brand-blue font-bold' : 'text-blue-100 hover:bg-white/10'}`}
              >
                <span>Lending Partners</span>
              </NavLink>
              <NavLink
                to="/admin/website/faqs"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-lg transition ${isActive ? 'bg-brand-white text-brand-blue font-bold' : 'text-blue-100 hover:bg-white/10'}`}
              >
                <span>FAQs</span>
              </NavLink>
              <NavLink
                to="/admin/website/news"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-lg transition ${isActive ? 'bg-brand-white text-brand-blue font-bold' : 'text-blue-100 hover:bg-white/10'}`}
              >
                <span>News & Updates</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* 5. Blogs Management */}
        <NavLink
          to="/admin/blogs"
          className={({ isActive }) => `flex items-center px-3 py-2.5 rounded-xl transition ${isActive ? 'bg-brand-orange text-brand-white font-bold shadow-md' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}
        >
          <FileText className="w-4 h-4 mr-3 text-brand-green" />
          <span>Blog Management</span>
        </NavLink>

        {/* 6. Media Library */}
        <NavLink
          to="/admin/media"
          className={({ isActive }) => `flex items-center px-3 py-2.5 rounded-xl transition ${isActive ? 'bg-brand-orange text-brand-white font-bold shadow-md' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}
        >
          <Image className="w-4 h-4 mr-3 text-brand-green" />
          <span>Media Library</span>
        </NavLink>

        {/* 7. Settings */}
        <NavLink
          to="/admin/settings"
          className={({ isActive }) => `flex items-center px-3 py-2.5 rounded-xl transition ${isActive ? 'bg-brand-orange text-brand-white font-bold shadow-md' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}
        >
          <Settings className="w-4 h-4 mr-3 text-brand-green" />
          <span>System Settings</span>
        </NavLink>

      </div>

      {/* Admin Profile & Logout */}
      <div className="p-3 border-t border-white/10">
        <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
          <div className="truncate pr-2">
            <p className="text-xs font-bold text-white truncate">{admin?.name || 'Administrator'}</p>
            <p className="text-[10px] text-blue-200 truncate">{admin?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 rounded-lg text-blue-200 hover:text-brand-orange hover:bg-white/10 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
};

export default AdminSidebar;