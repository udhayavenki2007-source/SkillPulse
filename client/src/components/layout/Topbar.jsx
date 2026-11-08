import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Settings,
  User,
  Sparkles,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ onMenuToggle }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const mockNotifications = [
    {
      id: 1,
      title: 'Adaptive AI Engine Ready',
      desc: 'Speech synthesis and multi-factor evaluation active.',
      time: '10m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Skill Roadmap Updated',
      desc: 'Added 5 new high-impact skills for Full Stack Development.',
      time: '1h ago',
      unread: false,
    },
    {
      id: 3,
      title: 'Performance Insight',
      desc: 'Your explanation clarity improved by +12% in technical rounds.',
      time: '1d ago',
      unread: false,
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/domain-tracker?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-[#0B1020]/90 backdrop-blur-md border-b border-[#1F2E52]">
      {/* Left: Mobile Toggle & Search Bar */}
      <div className="flex items-center gap-3 md:gap-4 flex-1">
        <button
          onClick={onMenuToggle}
          className="p-2 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#111B32] lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearch} className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, job roles, interview types..."
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-[#111B32] border border-[#1F2E52] rounded-xl text-[#E6EDF7] placeholder-[#94A3B8] focus:outline-none focus:border-[#3478F6] focus:ring-1 focus:ring-[#3478F6] transition-all"
          />
        </form>
      </div>

      {/* Right: Quick Actions, Notifications, Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Practice Quick Button */}
        <NavLink
          to="/practice"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#3478F6]/20 text-[#35D6E8] border border-[#3478F6]/40 hover:bg-[#3478F6]/30 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Session</span>
        </NavLink>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#94A3B8] hover:text-white rounded-xl hover:bg-[#111B32] transition-colors border border-transparent hover:border-[#1F2E52]"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#35D6E8] ring-2 ring-[#0B1020]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 p-3 bg-[#111B32] border border-[#1F2E52] rounded-2xl shadow-card-dark z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1F2E52]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Notifications
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#3478F6] text-white">
                    3
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[#94A3B8] hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {mockNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-2.5 rounded-xl border transition-all ${
                      notif.unread
                        ? 'bg-[#0B1020] border-[#3478F6]/40'
                        : 'bg-[#0E172C]/40 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-white">{notif.title}</h4>
                      <span className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-1">{notif.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings Direct Shortcut */}
        <NavLink
          to="/settings"
          className="p-2 text-[#94A3B8] hover:text-white rounded-xl hover:bg-[#111B32] transition-colors border border-transparent hover:border-[#1F2E52]"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </NavLink>

        {/* User Profile Avatar / Chip */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl hover:bg-[#111B32] border border-transparent hover:border-[#1F2E52] transition-all"
          >
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt={user?.name || 'Profile'}
              className="w-7 h-7 rounded-full object-cover border border-[#3478F6]"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight">
                {user?.name || 'Candidate'}
              </span>
              <span className="text-[10px] text-[#35D6E8] leading-tight">
                {user?.experience_level || 'Mid-Level'}
              </span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 p-2 bg-[#111B32] border border-[#1F2E52] rounded-xl shadow-card-dark z-50">
              <div className="px-3 py-2 border-b border-[#1F2E52] mb-1">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-[#94A3B8] truncate">{user?.email}</p>
              </div>
              <NavLink
                to="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-[#E6EDF7] hover:bg-[#0B1020] rounded-lg"
              >
                <User className="w-3.5 h-3.5 text-[#3478F6]" />
                <span>My Profile & Consent</span>
              </NavLink>
              <NavLink
                to="/domain-tracker"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-[#E6EDF7] hover:bg-[#0B1020] rounded-lg"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#35D6E8]" />
                <span>My Target Domain</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
