import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Menu, Bell, ExternalLink, ChevronRight, User, LogOut, 
  Settings, CheckCircle, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationBadge from './NotificationBadge';

const ROUTE_LABELS = {
  '/admin/dashboard': 'Dashboard',
  '/admin/enquiries': 'Homepage Enquiries',
  '/admin/enquiries/personal-loan': 'Personal Loan',
  '/admin/enquiries/loan-against-securities': 'Loan Against Securities',
  '/admin/enquiries/business-loan': 'Business Loan',
  '/admin/enquiries/home-loan': 'Home Loan',
  '/admin/enquiries/loan-against-property': 'Loan Against Property',
  '/admin/enquiries/education-loan': 'Education Loan',
  '/admin/enquiries/gold-loan': 'Gold Loan',
  '/admin/enquiries/vehicle-loan': 'Vehicle Loan',
  '/admin/loans': 'Loan Products',
  '/admin/settings': 'System Settings'
};

const AdminHeader = ({ setMobileOpen }) => {
  const { admin, logout } = useAuth();
  const { totalUnread } = useNotifications();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentTitle = ROUTE_LABELS[location.pathname] || 'Administration';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.02)] font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center space-x-3 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#194B87]"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile FinAdvise Logo next to Hamburger */}
        <Link to="/admin/dashboard" className="lg:hidden flex items-center space-x-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#194B87] text-white flex items-center justify-center font-black text-xs shadow-xs">
            FA
          </div>
          <span className="font-bold text-crm-text text-base tracking-tight hidden xs:inline">FinAdvise</span>
        </Link>

        <span className="hidden sm:inline-block text-slate-300 font-light lg:hidden">|</span>

        {/* Breadcrumb Navigation with 14-15px typography */}
        <nav className="flex items-center space-x-2 text-[13px] sm:text-[14px] text-slate-400 min-w-0 truncate">
          <Link to="/admin/dashboard" className="hover:text-[#194B87] transition font-semibold text-slate-500 hidden md:inline">
            Admin
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden md:inline" />
          <span className="font-bold text-crm-text truncate text-[14px] sm:text-[15px]">
            {currentTitle}
          </span>
        </nav>
      </div>

      {/* Right: Status Indicator, Notification Bell & Profile Dropdown */}
      <div className="flex items-center space-x-2 sm:space-x-3.5">
        
        {/* Live Indicator (Tablet & Desktop) */}
        <div className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
          CRM Live
        </div>

        {/* Public Website Shortcut */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          title="Open Public Website"
          className="hidden sm:inline-flex items-center text-[13px] font-semibold text-slate-600 hover:text-[#194B87] px-3 py-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-[#E2E8F0] transition"
        >
          <span>Website</span>
          <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-slate-400" />
        </a>

        {/* Global Notification Bell */}
        <Link
          to="/admin/enquiries"
          className="relative p-2 rounded-lg text-slate-600 hover:text-[#194B87] hover:bg-slate-50 border border-transparent hover:border-[#E2E8F0] transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          title={`${totalUnread} total unread enquiries`}
          aria-label="View unread enquiries"
        >
          <Bell className="w-5 h-5 text-slate-600" />
          {totalUnread > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-600 text-white text-[9px] font-bold shadow-xs">
              {totalUnread > 99 ? '99+' : totalUnread}
            </span>
          )}
        </Link>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-[#E2E8F0] min-h-[44px] focus:outline-none"
            aria-label="Admin profile menu"
          >
            <div className="w-8 h-8 rounded-lg bg-[#194B87] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[13.5px] font-bold text-crm-text leading-tight">{admin?.name || 'Administrator'}</p>
              <p className="text-[11px] text-slate-500 capitalize">{admin?.role || 'Advisor'}</p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-[#E2E8F0] py-2 text-xs animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="font-bold text-crm-text text-[14px]">{admin?.name || 'Administrator'}</p>
                <p className="text-[12px] text-slate-500 truncate mt-0.5">{admin?.email}</p>
              </div>
              <Link
                to="/admin/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center px-4 py-2.5 text-[13px] text-slate-700 hover:bg-slate-50 hover:text-[#194B87] transition font-medium min-h-[38px]"
              >
                <Settings className="w-4 h-4 mr-2.5 text-slate-400" />
                <span>System Settings</span>
              </Link>
              <a
                href="http://localhost:5173"
                target="_blank"
                rel="noreferrer"
                className="sm:hidden flex items-center px-4 py-2.5 text-[13px] text-slate-700 hover:bg-slate-50 hover:text-[#194B87] transition font-medium min-h-[38px]"
              >
                <ExternalLink className="w-4 h-4 mr-2.5 text-slate-400" />
                <span>Visit Website</span>
              </a>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition font-medium min-h-[38px]"
              >
                <LogOut className="w-4 h-4 mr-2.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};

export default AdminHeader;
