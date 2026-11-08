import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Invalid credentials');
    }
    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    const res = await login('alex.mercer@example.com', 'password123');
    if (res.success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3478F6]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#35D6E8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#111B32] border border-[#1F2E52] rounded-3xl p-6 sm:p-8 shadow-card-dark relative z-10 space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3478F6] to-[#35D6E8] p-[1px] shadow-glow-electric mb-2">
            <div className="w-full h-full bg-[#111B32] rounded-[15px] flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-[#35D6E8]" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Sign In to <span className="text-[#35D6E8]">InterviewIQ</span>
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Adaptive AI interview simulation and domain skill intelligence
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-white">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B1020] border border-[#1F2E52] rounded-xl text-xs sm:text-sm text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#3478F6]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B1020] border border-[#1F2E52] rounded-xl text-xs sm:text-sm text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#3478F6]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#3478F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white text-xs font-bold shadow-glow-electric transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#1F2E52] w-full" />
          <span className="bg-[#111B32] px-3 text-[11px] text-[#94A3B8] uppercase font-semibold">or</span>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2.5 rounded-xl bg-[#0B1020] border border-[#3478F6]/40 hover:border-[#35D6E8] text-xs font-semibold text-[#35D6E8] transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Demo Login (Alex Mercer)</span>
        </button>

        <p className="text-center text-xs text-[#94A3B8]">
          Don&apos;t have an account?{' '}
          <NavLink to="/register" className="text-[#35D6E8] font-semibold hover:underline">
            Register now
          </NavLink>
        </p>
      </div>
    </div>
  );
}
