import React, { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, Layers, Settings, 
  LogOut, ChevronDown, ChevronRight, UserCheck, TrendingUp, Briefcase, 
  Home, Building2, GraduationCap, Coins, CarFront, ExternalLink, X,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationBadge from './NotificationBadge';

const AdminSidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { admin, logout } = useAuth();
  const { unreadCounts } = useNotifications();
  const [enquiriesOpen, setEnquiriesOpen] = React.useState(true);
  const [loansOpen, setLoansOpen] = React.useState(false);

  const ENQUIRY_LINKS = [
    { name: 'Personal Loan', slug: 'personal-loan', path: '/admin/enquiries/personal-loan', icon: UserCheck },
    { name: 'Loan Against Securities', slug: 'loan-against-securities', path: '/admin/enquiries/loan-against-securities', icon: TrendingUp },
    { name: 'Business Loan', slug: 'business-loan', path: '/admin/enquiries/business-loan', icon: Briefcase },
    { name: 'Home Loan', slug: 'home-loan', path: '/admin/enquiries/home-loan', icon: Home },
    { name: 'Loan Against Property', slug: 'loan-against-property', path: '/admin/enquiries/loan-against-property', icon: Building2 },
    { name: 'Education Loan', slug: 'education-loan', path: '/admin/enquiries/education-loan', icon: GraduationCap },
    { name: 'Gold Loan', slug: 'gold-loan', path: '/admin/enquiries/gold-loan', icon: Coins },
    { name: 'Vehicle Loan', slug: 'vehicle-loan', path: '/admin/enquiries/vehicle-loan', icon: CarFront },
  ];

  const totalLoanUnread = ENQUIRY_LINKS.reduce((sum, link) => sum + (unreadCounts[link.slug] || 0), 0);

  const closeMobile = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') closeMobile();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  // Sidebar item styling following typography spec: 14-15px, weight 500
  const navItemClass = (isActive) => `
    flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all text-[14px] font-medium group min-h-[42px]
    ${isActive 
      ? 'bg-[#194B87] text-white font-semibold shadow-sm border-l-[3px] border-[#F7901E]' 
      : 'text-slate-300 hover:text-white hover:bg-white/5'}
    ${collapsed ? 'lg:justify-center lg:px-2' : ''}
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={closeMobile} 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Drawer */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col flex-shrink-0
        bg-[#102D50] text-slate-200 border-r border-[#0A1E36]
        transition-all duration-300 ease-in-out font-['Plus_Jakarta_Sans',sans-serif]
        w-[280px] lg:w-[260px] ${collapsed ? 'lg:w-[76px]' : 'lg:w-[260px]'}
        ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Brand Header with FinAdvise Logo and CRM badge */}
        <div className={`h-20 px-4 border-b border-white/10 flex items-center justify-between ${collapsed ? 'lg:justify-center' : ''}`}>
          <Link to="/admin/dashboard" onClick={closeMobile} className="flex items-center space-x-3 min-w-0">
            {/* Official Logo Mark */}
            <div className="w-10 h-10 rounded-xl bg-[#194B87] flex items-center justify-center text-white font-extrabold text-lg shadow-sm border border-white/15 flex-shrink-0">
              FA
            </div>
            
            {/* Wordmark with strong typography and CRM badge */}
            <div className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>
              <div className="flex items-center">
                <span className="text-xl font-black text-white tracking-tight leading-tight">FinAdvise</span>
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#F7901E] bg-[#F7901E]/15 border border-[#F7901E]/30 rounded">
                  CRM
                </span>
              </div>
              <p className="text-[10px] text-blue-200/80 font-bold tracking-wider uppercase mt-0.5 truncate">
                Advisory Management
              </p>
            </div>
          </Link>

          {/* Desktop Collapse Toggle */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Toggle sidebar width"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Mobile Drawer Close Button */}
          <button 
            onClick={closeMobile} 
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close navigation drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
          
          {/* Section: OVERVIEW */}
          {(!collapsed || mobileOpen) && (
            <p className="px-3 pt-1 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Overview
            </p>
          )}

          {/* 1. Dashboard */}
          <NavLink
            to="/admin/dashboard"
            onClick={closeMobile}
            title={collapsed ? "Dashboard" : undefined}
            className={({ isActive }) => navItemClass(isActive)}
          >
            <div className="flex items-center min-w-0">
              <LayoutDashboard className="w-[18px] h-[18px] mr-3 text-blue-400 flex-shrink-0" />
              <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>Dashboard</span>
            </div>
          </NavLink>

          {/* 2. Homepage Enquiry Management */}
          <NavLink
            to="/admin/enquiries"
            end
            onClick={closeMobile}
            title={collapsed ? `Homepage Enquiries (${unreadCounts.homepage || 0})` : undefined}
            className={({ isActive }) => navItemClass(isActive)}
          >
            <div className="flex items-center min-w-0 pr-1">
              <MessageSquare className="w-[18px] h-[18px] mr-3 text-emerald-400 flex-shrink-0" />
              <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>Enquiry Management</span>
            </div>
            <NotificationBadge count={unreadCounts.homepage} />
          </NavLink>

          {/* Section: LOAN ENQUIRIES */}
          <div className="pt-3">
            {!collapsed || mobileOpen ? (
              <button
                onClick={() => setEnquiriesOpen(!enquiriesOpen)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-slate-400 hover:text-white rounded-md transition text-[11px] font-bold uppercase tracking-wider min-h-[36px]"
              >
                <div className="flex items-center space-x-2">
                  <span>Loan Enquiries</span>
                  {!enquiriesOpen && totalLoanUnread > 0 && (
                    <NotificationBadge count={totalLoanUnread} />
                  )}
                </div>
                {enquiriesOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            ) : (
              <div className="h-px bg-white/10 my-2" />
            )}

            {(enquiriesOpen || collapsed || mobileOpen) && (
              <div className={`mt-1 space-y-0.5 ${!collapsed || mobileOpen ? 'pl-1' : ''}`}>
                {ENQUIRY_LINKS.map(link => {
                  const Icon = link.icon;
                  const count = unreadCounts[link.slug] || 0;
                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={closeMobile}
                      title={collapsed ? `${link.name} (${count})` : undefined}
                      className={({ isActive }) => navItemClass(isActive)}
                    >
                      <div className="flex items-center min-w-0 pr-1">
                        <Icon className="w-[17px] h-[17px] mr-2.5 text-slate-300 flex-shrink-0 group-hover:text-white" />
                        <span className={`truncate text-[13.5px] ${collapsed ? 'lg:hidden' : ''}`}>{link.name}</span>
                      </div>
                      <NotificationBadge count={count} />
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* User Profile & Logout Area */}
        <div className="p-3.5 border-t border-white/10 bg-[#0A1E36]/60">
          {!collapsed || mobileOpen ? (
            <div className="flex items-center justify-between">
              <div className="truncate pr-2 min-w-0">
                <p className="text-[13.5px] font-semibold text-white truncate">{admin?.name || 'Administrator'}</p>
                <p className="text-[11px] text-slate-400 truncate">{admin?.email || 'admin@finadviseloans.com'}</p>
              </div>
              <div className="flex items-center space-x-1">
                <a
                  href="http://localhost:5173"
                  target="_blank"
                  rel="noreferrer"
                  title="View Public Website"
                  className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={logout}
                  title="Log Out"
                  className="p-2 rounded-md text-slate-400 hover:text-red-400 hover:bg-white/10 transition"
                  aria-label="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={logout}
                title="Log Out"
                className="p-2 rounded-md text-slate-400 hover:text-red-400 hover:bg-white/10 transition"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;
