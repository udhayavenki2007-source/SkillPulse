import React, { useState } from 'react';
import { Search, Plus, Check, Briefcase } from 'lucide-react';
import { JOB_ROLES } from '../../utils/constants';

export default function StepJobRole({ selectedRole, onSelectRole }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const filteredRoles = JOB_ROLES.filter((role) =>
    role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (role) => {
    if (role === 'Custom Job Role') {
      setIsAddingCustom(true);
    } else {
      setIsAddingCustom(false);
      onSelectRole(role);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customRoleInput.trim()) {
      onSelectRole(customRoleInput.trim());
      setIsAddingCustom(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#3478F6]" />
          Step 1: Select Your Target Job Role
        </h2>
        <p className="text-xs md:text-sm text-[#94A3B8] mt-1">
          The adaptive AI engine calibrates its question bank and technical depth specifically for this domain.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search job roles (e.g. Java, Full Stack, Data...)"
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#0B1020] border border-[#1F2E52] rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#3478F6] focus:ring-1 focus:ring-[#3478F6] transition-all"
        />
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredRoles.map((role) => {
          const isSelected = selectedRole === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => handleSelect(role)}
              className={`p-4 text-left rounded-xl border transition-all flex items-center justify-between group ${
                isSelected
                  ? 'bg-[#111B32] border-[#3478F6] shadow-glow-electric text-white'
                  : 'bg-[#111B32]/70 border-[#1F2E52] text-[#E6EDF7] hover:border-[#3478F6]/50 hover:bg-[#111B32]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-[#3478F6] text-white'
                      : 'bg-[#0B1020] text-[#94A3B8] group-hover:text-[#35D6E8]'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold">{role}</span>
              </div>
              {isSelected && <Check className="w-4 h-4 text-[#35D6E8]" />}
            </button>
          );
        })}
      </div>

      {/* Custom Role Input Dialog */}
      {isAddingCustom && (
        <form
          onSubmit={handleCustomSubmit}
          className="p-4 rounded-xl bg-[#0B1020] border border-[#3478F6] max-w-lg space-y-3"
        >
          <label className="text-xs font-semibold text-white">Enter Custom Role Title</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customRoleInput}
              onChange={(e) => setCustomRoleInput(e.target.value)}
              placeholder="e.g. SRE / Embedded Linux Engineer"
              className="flex-1 px-3 py-2 text-sm bg-[#111B32] border border-[#1F2E52] rounded-lg text-white focus:outline-none focus:border-[#3478F6]"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#3478F6] rounded-lg hover:bg-[#2563EB]"
            >
              Apply Role
            </button>
          </div>
        </form>
      )}

      {selectedRole && (
        <div className="p-3 rounded-xl bg-[#111B32] border border-[#1F2E52] flex items-center justify-between text-xs">
          <span className="text-[#94A3B8]">
            Selected Job Role: <strong className="text-white">{selectedRole}</strong>
          </span>
          <span className="text-[#35D6E8] font-medium flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Ready for Type Selection
          </span>
        </div>
      )}
    </div>
  );
}
