import React from 'react';
import { UserCheck, Check, Volume2, Shield } from 'lucide-react';
import { PERSONALITIES } from '../../utils/constants';

export default function StepPersonality({ selectedPersonality, onSelectPersonality }) {
  const handlePreviewVoice = (personality, e) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `Hello, I am your ${personality.name}. I look forward to evaluating your expertise.`
      );
      utterance.pitch = personality.voicePitch;
      utterance.rate = personality.voiceRate;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-purple-400" />
          Step 3: Choose AI Interviewer Personality
        </h2>
        <p className="text-xs md:text-sm text-[#94A3B8] mt-1">
          Personality modifies conversational cadence, tone of speech, and questioning pressure, while rigorous evaluation rubrics remain standard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PERSONALITIES.map((p) => {
          const isSelected = selectedPersonality === p.id;

          return (
            <div
              key={p.id}
              onClick={() => onSelectPersonality(p.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#111B32] border-[#3478F6] shadow-glow-electric ring-1 ring-[#3478F6]'
                  : 'bg-[#111B32]/70 border-[#1F2E52] hover:border-[#3478F6]/40 hover:bg-[#111B32]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#0B1020] border border-[#1F2E52] flex items-center justify-center text-2xl shadow-inner">
                      {p.avatar}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{p.name}</h3>
                      <p className="text-[11px] font-medium text-[#35D6E8]">{p.tagline}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#3478F6] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <p className="mt-3.5 text-xs text-[#94A3B8] leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1F2E52]/60 flex items-center justify-between">
                <span className="text-[10px] text-[#94A3B8] uppercase font-semibold tracking-wider">
                  Tone: {p.toneStyle}
                </span>
                <button
                  type="button"
                  onClick={(e) => handlePreviewVoice(p, e)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[#35D6E8] bg-[#0B1020] hover:bg-[#3478F6]/20 border border-[#1F2E52] rounded-lg transition-colors"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Test Voice</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 rounded-xl bg-[#0B1020] border border-[#1F2E52] flex items-center gap-2.5 text-xs text-[#94A3B8]">
        <Shield className="w-4 h-4 text-[#35D6E8] flex-shrink-0" />
        <span>
          <strong>Fairness Guarantee:</strong> Personality styles only alter vocal synthesis parameters and prompt phrasing. Scoring criteria remain strictly objective.
        </span>
      </div>
    </div>
  );
}
