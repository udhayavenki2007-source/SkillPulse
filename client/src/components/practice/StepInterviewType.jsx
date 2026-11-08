import React from 'react';
import { Layers, Check, Code, Users, Briefcase, Award, Sparkles, Building2 } from 'lucide-react';
import { INTERVIEW_TYPES } from '../../utils/constants';

const ICONS_MAP = {
  'Technical Interview': Code,
  'HR Interview': Users,
  'Coding Interview': Code,
  'Behavioral Interview': Users,
  'Project-Based Interview': Briefcase,
  'Managerial Interview': Award,
  'Company-Specific Interview': Building2,
  'Mixed Interview': Sparkles,
};

export default function StepInterviewType({ selectedType, onSelectType }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#35D6E8]" />
          Step 2: Select Interview Round Type
        </h2>
        <p className="text-xs md:text-sm text-[#94A3B8] mt-1">
          Each interview type switches rubrics: technical correctness vs communication clarity and behavioral frameworks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTERVIEW_TYPES.map((type) => {
          const isSelected = selectedType === type.id;
          const IconComponent = ICONS_MAP[type.id] || Sparkles;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onSelectType(type.id)}
              className={`p-5 text-left rounded-2xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#111B32] border-[#35D6E8] shadow-glow-cyan'
                  : 'bg-[#111B32]/70 border-[#1F2E52] hover:border-[#35D6E8]/40 hover:bg-[#111B32]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#35D6E8] text-[#0B1020]'
                        : 'bg-[#0B1020] text-[#3478F6]'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{type.name}</h3>
                    <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-semibold rounded bg-[#3478F6]/15 text-[#35D6E8]">
                      {type.badge}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#35D6E8] text-[#0B1020] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <p className="mt-3 text-xs text-[#94A3B8] leading-relaxed">
                {type.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
