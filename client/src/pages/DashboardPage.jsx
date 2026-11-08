import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Award,
  Clock,
  Mic,
  Activity,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ChevronRight,
  BarChart2,
  Brain,
  ShieldAlert,
  Compass
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trendFilter, setTrendFilter] = useState('monthly'); // 'weekly' | 'monthly'
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardOverview();
  }, [trendFilter]);

  const fetchDashboardOverview = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/dashboard/overview?filter=${trendFilter}`);
      setDashboardData(res.data);
    } catch (err) {
      console.warn('Dashboard API unreachable, using empty or initialized state:', err.message);
      // Clean fallback if database is empty or server initializing
      setDashboardData({
        isEmptyUser: true,
        sessionsCount: { total: 0, weekly: 0, monthly: 0 },
        averageScore: { current: 0, previous: 0, percentChange: 0 },
        lastPractice: null,
        deliveryIndicator: { score: 0, wpm: 0, fillerRate: 0, label: 'No practice data yet' },
        trendData: [],
        communicationData: [],
        radarData: [
          { subject: 'Technical Knowledge', score: 0, fullMark: 100 },
          { subject: 'Communication', score: 0, fullMark: 100 },
          { subject: 'Problem Solving', score: 0, fullMark: 100 },
          { subject: 'Answer Relevance', score: 0, fullMark: 100 },
          { subject: 'Explanation Clarity', score: 0, fullMark: 100 },
        ],
        growthAreas: [],
        strengths: [],
        recentSessions: [],
        recommendations: [
          'Begin your preparation by selecting a target job role and completing your first adaptive interview session.'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const hasSessions = dashboardData && !dashboardData.isEmptyUser && dashboardData.sessionsCount?.total > 0;

  return (
    <div className="space-y-6">
      {/* Top Welcome Section */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#111B32] via-[#0E172C] to-[#111B32] border border-[#1F2E52] shadow-card-dark">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#3478F6]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3478F6]/15 border border-[#3478F6]/30 text-[#35D6E8] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Adaptive Interview Platform</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-[#35D6E8]">{user?.name || 'Candidate'}</span>
            </h1>
            <p className="text-sm md:text-base text-[#94A3B8]">
              Your next interview starts with better preparation.
            </p>
          </div>

          <button
            onClick={() => navigate('/practice')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#3478F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white font-semibold shadow-glow-electric transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm whitespace-nowrap"
          >
            <Mic className="w-4 h-4 text-[#35D6E8]" />
            <span>Start New Practice</span>
          </button>
        </div>
      </div>

      {/* Onboarding Banner for New Users */}
      {!hasSessions && !loading && (
        <div className="p-5 rounded-2xl bg-[#111B32]/90 border border-[#3478F6]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#3478F6]/20 text-[#35D6E8] mt-0.5">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">First Time Here? Launch Your Diagnostic Round</h3>
              <p className="text-xs text-[#94A3B8] mt-0.5 max-w-2xl">
                Complete a 5-question baseline interview to calibrate your adaptive difficulty, measure your speaking pace, and populate your personalized skill radar.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/practice')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#3478F6] rounded-lg hover:bg-[#2563EB] transition-colors whitespace-nowrap"
          >
            Take 5-Min Diagnostic
          </button>
        </div>
      )}

      {/* Performance Cards (A, B, C, D) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Card A: Sessions Completed */}
        <div className="p-5 rounded-2xl bg-[#111B32] border border-[#1F2E52] hover:border-[#3478F6]/40 transition-all shadow-card-dark">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-semibold uppercase tracking-wider">Sessions Completed</span>
            <div className="p-2 rounded-xl bg-[#0B1020] text-[#3478F6]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {dashboardData?.sessionsCount?.total || 0}
            </span>
            <span className="text-xs text-[#94A3B8]">interviews</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#1F2E52]/60 flex items-center justify-between text-xs text-[#94A3B8]">
            <span>This week: <strong className="text-white">{dashboardData?.sessionsCount?.weekly || 0}</strong></span>
            <span>This month: <strong className="text-white">{dashboardData?.sessionsCount?.monthly || 0}</strong></span>
          </div>
        </div>

        {/* Card B: Average Interview Score */}
        <div className="p-5 rounded-2xl bg-[#111B32] border border-[#1F2E52] hover:border-[#3478F6]/40 transition-all shadow-card-dark">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Score</span>
            <div className="p-2 rounded-xl bg-[#0B1020] text-[#35D6E8]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {dashboardData?.averageScore?.current ? `${Math.round(dashboardData.averageScore.current)}/100` : '—'}
            </span>
            {dashboardData?.averageScore?.percentChange !== undefined && dashboardData?.averageScore?.percentChange !== 0 && (
              <span className={`inline-flex items-center text-xs font-semibold ${dashboardData.averageScore.percentChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                <ArrowUpRight className="w-3.5 h-3.5" />
                {dashboardData.averageScore.percentChange > 0 ? `+${dashboardData.averageScore.percentChange}%` : `${dashboardData.averageScore.percentChange}%`}
              </span>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-[#1F2E52]/60 text-xs text-[#94A3B8]">
            {dashboardData?.averageScore?.previous ? (
              <span>Previous session: <strong className="text-white">{Math.round(dashboardData.averageScore.previous)}/100</strong></span>
            ) : (
              <span>Baseline pending completion</span>
            )}
          </div>
        </div>

        {/* Card C: Last Practice */}
        <div className="p-5 rounded-2xl bg-[#111B32] border border-[#1F2E52] hover:border-[#3478F6]/40 transition-all shadow-card-dark">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-semibold uppercase tracking-wider">Last Practice</span>
            <div className="p-2 rounded-xl bg-[#0B1020] text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-sm font-bold text-white block truncate">
              {dashboardData?.lastPractice?.jobRole || 'No previous session'}
            </span>
            <span className="text-xs text-[#94A3B8] block truncate mt-0.5">
              {dashboardData?.lastPractice?.interviewType || 'Start practice anytime'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#1F2E52]/60 flex items-center justify-between text-xs text-[#94A3B8]">
            <span>{dashboardData?.lastPractice?.date ? new Date(dashboardData.lastPractice.date).toLocaleDateString() : '—'}</span>
            <span className="font-semibold text-emerald-400">
              {dashboardData?.lastPractice?.score ? `${Math.round(dashboardData.lastPractice.score)}%` : ''}
            </span>
          </div>
        </div>

        {/* Card D: Confidence / Delivery Indicator */}
        <div className="p-5 rounded-2xl bg-[#111B32] border border-[#1F2E52] hover:border-[#3478F6]/40 transition-all shadow-card-dark">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-semibold uppercase tracking-wider">Delivery Indicator</span>
            <div className="p-2 rounded-xl bg-[#0B1020] text-amber-400">
              <Mic className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {dashboardData?.deliveryIndicator?.score ? `${Math.round(dashboardData.deliveryIndicator.score)}%` : '—'}
            </span>
            <span className="text-xs text-[#35D6E8] font-medium">
              {dashboardData?.deliveryIndicator?.label || 'Awaiting input'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#1F2E52]/60 flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span>Pace: <strong className="text-white">{dashboardData?.deliveryIndicator?.wpm || 0} WPM</strong></span>
            <span>Pause: <strong className="text-white">{dashboardData?.deliveryIndicator?.pauseSecs || 0}s</strong></span>
          </div>
          <p className="mt-1.5 text-[9px] text-[#94A3B8]/70 italic leading-tight">
            * Estimated practice delivery indicator based on speaking pace & pauses; non-psychological.
          </p>
        </div>
      </div>

      {/* Main Interactive Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Performance Trend Graph (2 Columns wide) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#111B32] border border-[#1F2E52] shadow-card-dark space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#3478F6]" />
                Performance Trend
              </h2>
              <p className="text-xs text-[#94A3B8]">Adaptive scoring trajectory over practice sessions</p>
            </div>
            {/* Filter Toggle */}
            <div className="inline-flex p-1 bg-[#0B1020] rounded-xl border border-[#1F2E52] self-start sm:self-auto">
              <button
                onClick={() => setTrendFilter('weekly')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  trendFilter === 'weekly'
                    ? 'bg-[#3478F6] text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTrendFilter('monthly')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  trendFilter === 'monthly'
                    ? 'bg-[#3478F6] text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            {dashboardData?.trendData && dashboardData.trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3478F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3478F6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2E52" vertical={false} />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B1020', borderColor: '#1F2E52', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#3478F6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#scoreGrad)"
                    name="Interview Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-[#1F2E52] rounded-xl text-center p-6">
                <BarChart2 className="w-8 h-8 text-[#94A3B8] mb-2" />
                <p className="text-xs font-medium text-white">No Practice History Available</p>
                <p className="text-[11px] text-[#94A3B8] max-w-xs mt-1">
                  Complete your first interview to generate an authentic performance curve.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Skill Radar Chart (1 Column wide) */}
        <div className="p-6 rounded-2xl bg-[#111B32] border border-[#1F2E52] shadow-card-dark space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#35D6E8]" />
              Skill Radar Analysis
            </h2>
            <p className="text-xs text-[#94A3B8]">Multidimensional candidate evaluation</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {hasSessions ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={75} data={dashboardData.radarData}>
                  <PolarGrid stroke="#1F2E52" />
                  <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={10} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#1F2E52" tick={false} />
                  <Radar
                    name="Skill Level"
                    dataKey="score"
                    stroke="#35D6E8"
                    fill="#3478F6"
                    fillOpacity={0.4}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B1020', borderColor: '#1F2E52', borderRadius: '12px', fontSize: '12px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-[#0B1020] border border-[#1F2E52] flex items-center justify-center mx-auto mb-2 text-[#35D6E8]">
                  <Brain className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-white">Skill Matrix Uncalibrated</p>
                <p className="text-[11px] text-[#94A3B8] mt-1">
                  Takes 1 session to map technical, communication, and problem solving faculties.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Communication Graph & Growth Areas / Strengths */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Communication Graph */}
        <div className="p-6 rounded-2xl bg-[#111B32] border border-[#1F2E52] shadow-card-dark space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Mic className="w-4 h-4 text-purple-400" />
              Communication Dynamics
            </h2>
            <p className="text-xs text-[#94A3B8]">Speaking speed, filler frequency, and answer completion</p>
          </div>

          <div className="h-56 w-full pt-2">
            {dashboardData?.communicationData && dashboardData.communicationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.communicationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2E52" vertical={false} />
                  <XAxis dataKey="metric" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B1020', borderColor: '#1F2E52', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="value" fill="#3478F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-[#1F2E52] rounded-xl text-center p-4">
                <Mic className="w-6 h-6 text-[#94A3B8] mb-1.5" />
                <p className="text-xs text-white">Speech Metrics Inactive</p>
                <p className="text-[11px] text-[#94A3B8]">Microphone audio dynamics will render after session answers.</p>
              </div>
            )}
          </div>
        </div>

        {/* 4. Growth Areas (Weak Areas) & 5. Strengths */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-2xl bg-[#111B32] border border-[#1F2E52] shadow-card-dark">
          {/* Growth Areas */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              Target Growth Areas
            </h3>
            <p className="text-xs text-[#94A3B8]">Identified from weak or incomplete answers</p>

            <div className="space-y-2 mt-2">
              {dashboardData?.growthAreas && dashboardData.growthAreas.length > 0 ? (
                dashboardData.growthAreas.map((area, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#0B1020] border border-rose-500/20 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-white">{area.topic}</h4>
                      <p className="text-[10px] text-[#94A3B8]">{area.notes || 'Identified in recent session'}</p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      {area.status || 'Needs Practice'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1F2E52] text-xs text-[#94A3B8]">
                  Complete practice interviews to reveal targeted areas for technical mastery.
                </div>
              )}
            </div>
          </div>

          {/* Strengths */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Demonstrated Strengths
            </h3>
            <p className="text-xs text-[#94A3B8]">High scoring conceptual domains</p>

            <div className="space-y-2 mt-2">
              {dashboardData?.strengths && dashboardData.strengths.length > 0 ? (
                dashboardData.strengths.map((str, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#0B1020] border border-emerald-500/20 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-white">{str.topic}</h4>
                      <p className="text-[10px] text-[#94A3B8]">{str.notes || 'Consistently strong score'}</p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {str.level || 'Mastered'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1F2E52] text-xs text-[#94A3B8]">
                  Demonstrate proficiency in interview rounds to unlock recognized strengths.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Practice Sessions & AI Personalized Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 6. Recent Practice Sessions (2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#111B32] border border-[#1F2E52] shadow-card-dark space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#3478F6]" />
                Recent Practice Sessions
              </h2>
              <p className="text-xs text-[#94A3B8]">Completed interviews and evaluation archives</p>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-semibold text-[#35D6E8] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            {dashboardData?.recentSessions && dashboardData.recentSessions.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1F2E52] text-[#94A3B8]">
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Job Role</th>
                    <th className="pb-3 font-semibold">Difficulty</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2E52]/40">
                  {dashboardData.recentSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-[#0B1020]/50 transition-colors">
                      <td className="py-3 text-white">
                        {new Date(session.completed_at || session.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 font-medium text-white">{session.job_role_name}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#3478F6]/15 text-[#35D6E8]">
                          {session.difficulty}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-emerald-400">
                        {Math.round(session.final_score || session.overall_score || 0)}%
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => navigate(`/report/${session.id}`)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#3478F6]/80 hover:bg-[#3478F6] rounded-md transition-all"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-xs text-[#94A3B8]">
                No completed sessions found. Click &quot;Start New Practice&quot; to begin.
              </div>
            )}
          </div>
        </div>

        {/* 7. AI Personalized Recommendations */}
        <div className="p-6 rounded-2xl bg-[#111B32] border border-[#1F2E52] shadow-card-dark space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#35D6E8]" />
              AI Recommendations
            </h2>
            <p className="text-xs text-[#94A3B8]">Synthesized from your actual answer transcripts</p>
          </div>

          <div className="space-y-3">
            {dashboardData?.recommendations && dashboardData.recommendations.map((rec, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#0B1020] border border-[#1F2E52] flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#35D6E8] mt-1.5 flex-shrink-0" />
                <p className="text-xs text-[#E6EDF7] leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/domain-tracker')}
            className="w-full mt-2 py-2.5 text-xs font-semibold text-white bg-[#1F2E52] hover:bg-[#3478F6]/20 hover:border-[#3478F6]/40 border border-[#1F2E52] rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>Open Domain Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
