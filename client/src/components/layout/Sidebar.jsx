import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Mic,
  Compass,
  History,
  TrendingUp,
  Settings,
  Sparkles,
  Award,
  ChevronRight,
  LogOut,
  BrainCircuit,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Overview',
      primary: true,
    },
    {
      to: '/practice',
      label: 'Practice',
      icon: Mic,
      badge: 'Live AI',
      primary: true,
      highlight: true,
    },
    {
      to: '/domain-tracker',
      label: 'Domain & Skill Tracker',
      icon: Compass,
      badge: 'Roadmaps',
    },
    {
      to: '/history',
      label: 'Interview History',
      icon: History,
    },
    {
      to: '/growth',
      label: 'Growth Analytics',
      icon: TrendingUp,
    },
    {
      to: '/settings',
      label: 'Profile & Settings',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#0B1020] border-r border-[#1F2E52] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[#1F2E52] bg-[#0E172C]/80">
          <NavLink to="/dashboard" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3478F6] to-[#35D6E8] p-[1px] shadow-glow-electric">
              <div className="flex items-center justify-center w-full h-full bg-[#111B32] rounded-[11px]">
                <BrainCircuit className="w-5 h-5 text-[#35D6E8] transition-transform group-hover:scale-110" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-wider text-white">
                INTERVIEW<span className="text-[#35D6E8]">IQ</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[#3478F6]">
                AI Intelligence
              </span>
            </div>
          </NavLink>
        </div>

        {/* Primary Action Button */}
        <div className="p-4">
          <NavLink
            to="/practice"
            onClick={onClose}
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-white transition-all duration-200 rounded-xl bg-gradient-to-r from-[#3478F6] via-[#2563EB] to-[#1D4ED8] hover:shadow-glow-electric group"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#35D6E8] animate-pulse" />
              <span>Start New Practice</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/70 transition-transform group-hover:translate-x-0.5" />
          </NavLink>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#111B32] text-white border border-[#3478F6]/40 shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#E6EDF7] hover:bg-[#111B32]/60'
                  } ${item.highlight && !location.pathname.startsWith(item.to) ? 'text-white' : ''}`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#3478F6]" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide rounded bg-[#3478F6]/15 text-[#35D6E8] border border-[#3478F6]/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
            System Info
          </div>
          <div className="p-3 mx-1 rounded-xl bg-[#111B32]/70 border border-[#1F2E52] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#94A3B8]">Target Domain</span>
              <span className="text-[11px] font-medium text-[#35D6E8]">
                {user?.target_domain || 'Full Stack'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#94A3B8]">AI Voice Engine</span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Active
              </span>
            </div>
          </div>
        </nav>

        {/* Footer / User Profile Brief */}
        <div className="p-3 border-t border-[#1F2E52] bg-[#0E172C]/70">
          <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-[#111B32] transition-colors">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover border border-[#3478F6]/40"
              />
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-white truncate">
                  {user?.name || 'Candidate'}
                </span>
                <span className="text-[10px] text-[#94A3B8] truncate">
                  {user?.email || 'user@interviewiq.ai'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-[#94A3B8] hover:text-red-400 transition-colors rounded-md hover:bg-[#0B1020]"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
