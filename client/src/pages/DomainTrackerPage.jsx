import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  Layers,
  Server,
  Layout,
  Code,
  BarChart3,
  Brain,
  Cpu,
  Cloud,
  Shield,
  ExternalLink,
  Github,
  Edit3,
  Plus,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Check
} from 'lucide-react';
import { DOMAIN_TRACKS } from '../utils/constants';
import api from '../services/api';

const DOMAIN_ICONS = {
  Layers,
  Server,
  Layout,
  Code,
  BarChart3,
  Brain,
  Cpu,
  Cloud,
  Shield
};

export default function DomainTrackerPage() {
  const [selectedDomain, setSelectedDomain] = useState(DOMAIN_TRACKS[0]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeEditingSkill, setActiveEditingSkill] = useState(null);
  const [skillGapAnalysis, setSkillGapAnalysis] = useState(null);

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools', 'Core Skills', 'Projects'];

  useEffect(() => {
    fetchDomainSkills(selectedDomain.id);
    fetchSkillGaps(selectedDomain.id);
  }, [selectedDomain]);

  const fetchDomainSkills = async (domainId) => {
    setLoading(true);
    try {
      const res = await api.get(`/domains/${domainId}/skills`);
      setSkills(res.data.skills || []);
    } catch (err) {
      console.warn('Fallback default domain skills:', err.message);
      // High quality initial seed skills
      const initialSkills = [
        { id: 101, skill_name: 'HTML5 & Semantic Markup', category: 'Frontend', importance: 'Essential', status: 'Completed', notes: 'Built accessibility semantic structures', github_url: 'https://github.com/example/html-docs' },
        { id: 102, skill_name: 'CSS3, Flexbox & Tailwind', category: 'Frontend', importance: 'Essential', status: 'Completed', notes: 'Mastered responsive layouts', github_url: 'https://github.com/example/css-grid' },
        { id: 103, skill_name: 'JavaScript ES6+ & Async/Await', category: 'Frontend', importance: 'Essential', status: 'Practicing', notes: 'Reviewing event loop and microtask queues', github_url: '' },
        { id: 104, skill_name: 'React.js Components & Hooks', category: 'Frontend', importance: 'Essential', status: 'Practicing', notes: 'Custom hooks and memoization patterns', github_url: '' },
        { id: 105, skill_name: 'Node.js Runtime & Express', category: 'Backend', importance: 'Essential', status: 'Learning', notes: 'Building REST endpoints and middleware', github_url: '' },
        { id: 106, skill_name: 'RESTful API Architecture & JWT', category: 'Backend', importance: 'Essential', status: 'Learning', notes: 'Token signing and refresh rotation', github_url: '' },
        { id: 107, skill_name: 'MySQL Schema & Normalization', category: 'Database', importance: 'Essential', status: 'Learning', notes: 'Foreign keys, indexes and ACID transactions', github_url: '' },
        { id: 108, skill_name: 'Git, Branching & GitHub PRs', category: 'Tools', importance: 'Essential', status: 'Completed', notes: 'Daily rebase and PR workflows', github_url: 'https://github.com/example' },
        { id: 109, skill_name: 'Data Structures & Algorithms', category: 'Core Skills', importance: 'Essential', status: 'Not Started', notes: '', github_url: '' },
        { id: 110, skill_name: 'Intermediate E-Commerce Project', category: 'Projects', importance: 'Essential', status: 'Not Started', notes: '', github_url: '' },
      ];
      setSkills(initialSkills);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkillGaps = async (domainId) => {
    try {
      const res = await api.get(`/domains/${domainId}/skill-gaps`);
      setSkillGapAnalysis(res.data);
    } catch (err) {
      setSkillGapAnalysis({
        strong: ['HTML5', 'CSS3 / Tailwind', 'Git & GitHub'],
        needsImprovement: ['JavaScript Event Loop', 'React Custom Hooks', 'REST API Authentication'],
        missing: ['MySQL 3NF & Indexes', 'Data Structures & Algorithms', 'Microservices Architecture'],
        recommendation: 'Prioritize mastering MySQL schema indexing and asynchronous error handling before moving to advanced system design.'
      });
    }
  };

  const handleStatusChange = async (skillId, newStatus) => {
    const updated = skills.map((s) => (s.id === skillId ? { ...s, status: newStatus } : s));
    setSkills(updated);

    try {
      await api.put(`/skills/${skillId}/progress`, { status: newStatus });
    } catch (err) {
      console.warn('Local update preserved:', err.message);
    }
  };

  const handleSaveSkillNotes = async (skillId, notes, githubUrl) => {
    const updated = skills.map((s) => (s.id === skillId ? { ...s, notes, github_url: githubUrl } : s));
    setSkills(updated);
    setActiveEditingSkill(null);

    try {
      await api.put(`/skills/${skillId}/progress`, { personal_notes: notes, github_url: githubUrl });
    } catch (err) {
      console.warn('Local save preserved:', err.message);
    }
  };

  // Metrics
  const totalSkills = skills.length;
  const completedSkills = skills.filter((s) => s.status === 'Completed').length;
  const inProgressSkills = skills.filter((s) => s.status === 'Learning' || s.status === 'Practicing').length;
  const remainingSkills = totalSkills - completedSkills;
  const completionPercentage = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;

  const filteredSkills = skills.filter(
    (s) => activeCategory === 'All' || s.category === activeCategory
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3478F6]/15 text-[#35D6E8] text-xs font-semibold mb-2 border border-[#3478F6]/30">
            <Compass className="w-3.5 h-3.5" />
            Domain & Career Skill Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Target Domain Skill Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Map out prerequisites, track verification progress, and resolve AI-detected skill gaps.
          </p>
        </div>
      </div>

      {/* Step 1: Select Target Domain Carousel/Chips */}
      <div className="p-4 rounded-2xl bg-[#111B32] border border-[#1F2E52] shadow-card-dark space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
          <span>Target Career Domains</span>
          <span className="text-[#35D6E8]">Selected: {selectedDomain.name}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {DOMAIN_TRACKS.map((domain) => {
            const Icon = DOMAIN_ICONS[domain.icon] || Code;
            const isSelected = selectedDomain.id === domain.id;
            return (
              <button
                key={domain.id}
                type="button"
                onClick={() => setSelectedDomain(domain)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-[#3478F6] text-white border-[#3478F6] shadow-glow-electric'
                    : 'bg-[#0B1020] border-[#1F2E52] text-[#94A3B8] hover:text-white hover:border-[#3478F6]/40'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs font-bold truncate">{domain.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 4: Domain Progress Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#111B32] border border-[#1F2E52]">
          <span className="text-xs text-[#94A3B8] block">Total Domain Skills</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">{totalSkills}</span>
          <span className="text-[10px] text-[#94A3B8]">Curated requirements</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111B32] border border-[#1F2E52]">
          <span className="text-xs text-emerald-400 block">Completed Skills</span>
          <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">{completedSkills}</span>
          <span className="text-[10px] text-[#94A3B8]">Verified & practiced</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111B32] border border-[#1F2E52]">
          <span className="text-xs text-[#35D6E8] block">In Progress</span>
          <span className="text-2xl font-extrabold text-[#35D6E8] mt-1 block">{inProgressSkills}</span>
          <span className="text-[10px] text-[#94A3B8]">Learning & practicing</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111B32] border border-[#1F2E52]">
          <span className="text-xs text-[#94A3B8] block">Domain Mastery</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-white">{completionPercentage}%</span>
            <span className="text-xs text-[#94A3B8]">complete</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-[#0B1020] rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3478F6] to-[#35D6E8] rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step 5: AI Skill Gap Detection & Recommendations */}
      {skillGapAnalysis && (
        <div className="p-6 rounded-2xl bg-[#111B32] border border-[#3478F6]/30 shadow-card-dark space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#3478F6]/20 text-[#35D6E8]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Skill Gap Calibration</h3>
                <p className="text-xs text-[#94A3B8]">Synthesized from target domain demands vs actual interview rounds</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-semibold text-[#35D6E8] bg-[#0B1020] rounded-lg border border-[#1F2E52]">
              Live Gap Analysis
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Strong */}
            <div className="p-4 rounded-xl bg-[#0B1020] border border-emerald-500/30 space-y-2">
              <span className="font-bold text-emerald-400 block uppercase tracking-wider text-[11px]">
                Strongly Evidenced
              </span>
              <ul className="space-y-1 text-white">
                {skillGapAnalysis.strong.map((s, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Needs Improvement */}
            <div className="p-4 rounded-xl bg-[#0B1020] border border-amber-500/30 space-y-2">
              <span className="font-bold text-amber-400 block uppercase tracking-wider text-[11px]">
                Needs Improvement
              </span>
              <ul className="space-y-1 text-white">
                {skillGapAnalysis.needsImprovement.map((s, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing */}
            <div className="p-4 rounded-xl bg-[#0B1020] border border-rose-500/30 space-y-2">
              <span className="font-bold text-rose-400 block uppercase tracking-wider text-[11px]">
                Missing Core Skills
              </span>
              <ul className="space-y-1 text-white">
                {skillGapAnalysis.missing.map((s, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Recommendation Quote */}
          <div className="p-3.5 rounded-xl bg-[#0E172C] border border-[#1F2E52] text-xs text-[#E6EDF7] flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-[#35D6E8] mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">
              <strong>AI Recommendation:</strong> {skillGapAnalysis.recommendation}
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Interactive Skill Checklist by Category */}
      <div className="p-6 rounded-2xl bg-[#111B32] border border-[#1F2E52] shadow-card-dark space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Domain Skill Checklist</h3>
            <p className="text-xs text-[#94A3B8]">
              Track each competency manually with verification evidence, notes, and repository links.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-[#3478F6] text-white shadow-sm'
                    : 'bg-[#0B1020] text-[#94A3B8] hover:text-white border border-[#1F2E52]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills List Table / Cards */}
        <div className="space-y-3">
          {filteredSkills.map((skill) => {
            const isEditing = activeEditingSkill?.id === skill.id;

            return (
              <div
                key={skill.id}
                className="p-4 rounded-xl bg-[#0B1020] border border-[#1F2E52] hover:border-[#3478F6]/40 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#111B32] border border-[#1F2E52] text-[#3478F6]">
                      {skill.category}
                    </span>
                    <h4 className="text-sm font-semibold text-white">{skill.skill_name}</h4>
                  </div>

                  {/* Status Dropdown Controls */}
                  <div className="flex items-center gap-2">
                    {['Not Started', 'Learning', 'Practicing', 'Completed'].map((statusOption) => (
                      <button
                        key={statusOption}
                        type="button"
                        onClick={() => handleStatusChange(skill.id, statusOption)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                          skill.status === statusOption
                            ? statusOption === 'Completed'
                              ? 'bg-emerald-500 text-[#0B1020] font-bold'
                              : statusOption === 'Practicing'
                              ? 'bg-[#35D6E8] text-[#0B1020] font-bold'
                              : statusOption === 'Learning'
                              ? 'bg-[#3478F6] text-white'
                              : 'bg-white/10 text-white'
                            : 'text-[#94A3B8] hover:bg-[#111B32]'
                        }`}
                      >
                        {statusOption}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setActiveEditingSkill(isEditing ? null : skill)}
                      className="p-1.5 text-[#94A3B8] hover:text-[#35D6E8] rounded-md hover:bg-[#111B32]"
                      title="Edit notes & GitHub link"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Notes and Evidence Links */}
                {(skill.notes || skill.github_url) && !isEditing && (
                  <div className="pt-2 border-t border-[#1F2E52]/40 flex flex-wrap items-center justify-between gap-2 text-xs text-[#94A3B8]">
                    <span>{skill.notes}</span>
                    {skill.github_url && (
                      <a
                        href={skill.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#35D6E8] hover:underline text-[11px]"
                      >
                        <Github className="w-3 h-3" />
                        <span>Code Evidence</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                )}

                {/* Inline Editing Drawer */}
                {isEditing && (
                  <div className="pt-3 border-t border-[#1F2E52] space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[11px] text-[#94A3B8] block mb-1">Personal Notes</label>
                        <input
                          type="text"
                          defaultValue={skill.notes || ''}
                          id={`notes-${skill.id}`}
                          placeholder="e.g. Completed projects, tested with Mocha..."
                          className="w-full px-3 py-1.5 bg-[#111B32] border border-[#1F2E52] rounded-lg text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#94A3B8] block mb-1">GitHub Project / Evidence URL</label>
                        <input
                          type="url"
                          defaultValue={skill.github_url || ''}
                          id={`github-${skill.id}`}
                          placeholder="https://github.com/..."
                          className="w-full px-3 py-1.5 bg-[#111B32] border border-[#1F2E52] rounded-lg text-white text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveEditingSkill(null)}
                        className="px-3 py-1 text-xs text-[#94A3B8] hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const notes = document.getElementById(`notes-${skill.id}`).value;
                          const git = document.getElementById(`github-${skill.id}`).value;
                          handleSaveSkillNotes(skill.id, notes, git);
                        }}
                        className="px-3 py-1 text-xs font-semibold text-white bg-[#3478F6] rounded-md hover:bg-[#2563EB]"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
