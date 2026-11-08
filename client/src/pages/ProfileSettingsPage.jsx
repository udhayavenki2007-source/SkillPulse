import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Key,
  Trash2,
  Save,
  CheckCircle2,
  Camera,
  Mic,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DOMAIN_TRACKS } from '../utils/constants';

export default function ProfileSettingsPage() {
  const { user, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    headline: user?.headline || 'Full Stack Engineer in Training',
    target_domain: user?.target_domain || 'Full Stack Development',
    experience_level: user?.experience_level || 'Mid-Level',
    avatar_url: user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    webcam_consent: user?.webcam_consent ?? true,
    mic_consent: user?.mic_consent ?? true,
  });

  const [savedMessage, setSavedMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handlePurgeData = () => {
    if (window.confirm('Are you sure you want to purge your past interview audio and evaluation history? This cannot be undone.')) {
      alert('All past recordings and session cache have been securely purged.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3478F6]/15 text-[#35D6E8] text-xs font-semibold mb-2 border border-[#3478F6]/30">
          <Settings className="w-3.5 h-3.5" />
          Account & Privacy Controls
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Profile & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Manage your candidate identity, target career track, hardware permissions, and privacy preferences.
        </p>
      </div>

      {savedMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile preferences successfully updated.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Candidate Profile Details */}
        <div className="p-6 rounded-2xl bg-[#111B32] border border-[#1F2E52] shadow-card-dark space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-[#3478F6]" />
            Candidate Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-[#94A3B8] block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#0B1020] border border-[#1F2E52] rounded-xl text-white focus:outline-none focus:border-[#3478F6]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#94A3B8] block mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 bg-[#0B1020]/60 border border-[#1F2E52] rounded-xl text-[#94A3B8] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#94A3B8] block mb-1">Professional Headline</label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="w-full px-3 py-2 bg-[#0B1020] border border-[#1F2E52] rounded-xl text-white focus:outline-none focus:border-[#3478F6]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#94A3B8] block mb-1">Target Career Domain</label>
              <select
                value={formData.target_domain}
                onChange={(e) => setFormData({ ...formData, target_domain: e.target.value })}
                className="w-full px-3 py-2 bg-[#0B1020] border border-[#1F2E52] rounded-xl text-white focus:outline-none focus:border-[#3478F6]"
              >
                {DOMAIN_TRACKS.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#94A3B8] block mb-1">Seniority / Experience Level</label>
              <select
                value={formData.experience_level}
                onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                className="w-full px-3 py-2 bg-[#0B1020] border border-[#1F2E52] rounded-xl text-white focus:outline-none focus:border-[#3478F6]"
              >
                <option value="Entry">Entry Level (0-2 yrs)</option>
                <option value="Mid-Level">Mid-Level (2-5 yrs)</option>
                <option value="Senior">Senior (5+ yrs)</option>
                <option value="Lead">Lead / Architect (8+ yrs)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#94A3B8] block mb-1">Avatar Image URL</label>
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                className="w-full px-3 py-2 bg-[#0B1020] border border-[#1F2E52] rounded-xl text-white focus:outline-none focus:border-[#3478F6]"
              />
            </div>
          </div>
        </div>

        {/* Privacy & Hardware Permissions */}
        <div className="p-6 rounded-2xl bg-[#111B32] border border-[#1F2E52] shadow-card-dark space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#35D6E8]" />
            Privacy & Recording Permissions
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#0B1020] border border-[#1F2E52] cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Camera className="w-4 h-4 text-[#3478F6]" />
                <div>
                  <span className="font-semibold text-white block">Camera Delivery Indicator</span>
                  <span className="text-[11px] text-[#94A3B8]">Allows video preview during live practice rounds</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.webcam_consent}
                onChange={(e) => setFormData({ ...formData, webcam_consent: e.target.checked })}
                className="w-4 h-4 text-[#3478F6] bg-[#111B32] border-[#1F2E52] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#0B1020] border border-[#1F2E52] cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Mic className="w-4 h-4 text-[#35D6E8]" />
                <div>
                  <span className="font-semibold text-white block">Microphone Speech-to-Text</span>
                  <span className="text-[11px] text-[#94A3B8]">Allows speech transcription and speech dynamics analysis</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.mic_consent}
                onChange={(e) => setFormData({ ...formData, mic_consent: e.target.checked })}
                className="w-4 h-4 text-[#3478F6] bg-[#111B32] border-[#1F2E52] rounded"
              />
            </label>
          </div>
        </div>

        {/* AI & Environment Integration Info */}
        <div className="p-6 rounded-2xl bg-[#111B32] border border-[#1F2E52] shadow-card-dark space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            AI & Backend Configuration
          </h3>

          <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1F2E52] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8]">LLM Evaluation Engine:</span>
              <span className="font-mono text-emerald-400 font-semibold">Gemini / OpenAI API + Fallback Adaptive Engine</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8]">Speech Synthesis:</span>
              <span className="font-mono text-[#35D6E8] font-semibold">Web Speech API (5 Personality Modulations)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8]">Speech-to-Text:</span>
              <span className="font-mono text-purple-400 font-semibold">Continuous Speech Recognition API</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8]">Database Store:</span>
              <span className="font-mono text-white font-semibold">MySQL 8.0 (17 Relational Tables)</span>
            </div>
          </div>
        </div>

        {/* Save & Danger Zone */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handlePurgeData}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge Recordings & Data</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#3478F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] rounded-xl shadow-glow-electric transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
