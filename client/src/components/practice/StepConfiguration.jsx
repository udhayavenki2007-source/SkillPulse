import React from 'react';
import { Sliders, CheckCircle2, Clock, HelpCircle, BookOpen, Globe } from 'lucide-react';

export default function StepConfiguration({
  config,
  onChangeConfig,
  role,
  interviewType,
  personality,
  resumeData
}) {
  const difficulties = [
    { id: 'Beginner', label: 'Beginner', desc: 'Core fundamentals & conceptual definitions' },
    { id: 'Intermediate', label: 'Intermediate', desc: 'Real-world application, debugging & design trade-offs' },
    { id: 'Advanced', label: 'Advanced', desc: 'Distributed architecture, concurrency & edge case mastery' }
  ];

  const questionCounts = [5, 10, 15];
  const durations = [10, 20, 30, 45];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#35D6E8]" />
          Step 5: Interview Session Configuration
        </h2>
        <p className="text-xs md:text-sm text-[#94A3B8] mt-1">
          Tune duration, baseline question count, and baseline difficulty. The engine will adapt difficulty upwards or downwards dynamically.
        </p>
      </div>

      {/* Difficulty Selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-white uppercase tracking-wider">
          Baseline Difficulty
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {difficulties.map((diff) => {
            const isSelected = config.difficulty === diff.id;
            return (
              <button
                key={diff.id}
                type="button"
                onClick={() => onChangeConfig({ ...config, difficulty: diff.id })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#111B32] border-[#3478F6] shadow-glow-electric text-white'
                    : 'bg-[#111B32]/70 border-[#1F2E52] text-[#94A3B8] hover:border-[#3478F6]/40 hover:text-white'
                }`}
              >
                <div className="font-bold text-sm text-white">{diff.label}</div>
                <div className="text-[11px] text-[#94A3B8] mt-1">{diff.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Number of Questions & Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-white uppercase tracking-wider">
            Total Questions
          </label>
          <div className="grid grid-cols-3 gap-2">
            {questionCounts.map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => onChangeConfig({ ...config, totalQuestions: count })}
                className={`py-2.5 rounded-xl border font-bold text-xs transition-all ${
                  config.totalQuestions === count
                    ? 'bg-[#3478F6] text-white border-[#3478F6]'
                    : 'bg-[#0B1020] text-[#94A3B8] border-[#1F2E52] hover:text-white'
                }`}
              >
                {count} Questions
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-white uppercase tracking-wider">
            Session Duration
          </label>
          <div className="grid grid-cols-4 gap-2">
            {durations.map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => onChangeConfig({ ...config, durationMinutes: mins })}
                className={`py-2.5 rounded-xl border font-bold text-xs transition-all ${
                  config.durationMinutes === mins
                    ? 'bg-[#35D6E8] text-[#0B1020] border-[#35D6E8]'
                    : 'bg-[#0B1020] text-[#94A3B8] border-[#1F2E52] hover:text-white'
                }`}
              >
                {mins} Mins
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Optional Preparation Topic */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#3478F6]" />
          Specific Focus Topic (Optional)
        </label>
        <input
          type="text"
          value={config.preparationTopic || ''}
          onChange={(e) => onChangeConfig({ ...config, preparationTopic: e.target.value })}
          placeholder="e.g. Concurrency, Indexing Strategies, React Virtual DOM, System Design..."
          className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#0B1020] border border-[#1F2E52] rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#3478F6]"
        />
        <p className="text-[11px] text-[#94A3B8]">
          Leave blank to cover a full range across your selected job role.
        </p>
      </div>

      {/* Configuration Summary Card */}
      <div className="p-4 rounded-2xl bg-[#0E172C] border border-[#1F2E52] space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Configuration Summary
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[#94A3B8] block text-[11px]">Role:</span>
            <span className="font-semibold text-white truncate block">{role || 'Not selected'}</span>
          </div>
          <div>
            <span className="text-[#94A3B8] block text-[11px]">Interview Type:</span>
            <span className="font-semibold text-white truncate block">{interviewType || 'Not selected'}</span>
          </div>
          <div>
            <span className="text-[#94A3B8] block text-[11px]">Interviewer:</span>
            <span className="font-semibold text-white truncate block">{personality || 'Not selected'}</span>
          </div>
          <div>
            <span className="text-[#94A3B8] block text-[11px]">Resume Grounding:</span>
            <span className="font-semibold text-[#35D6E8] truncate block">
              {resumeData ? 'Enabled (Project Deep Dive)' : 'Standard Bank'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
