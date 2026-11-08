import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Layers,
  UserCheck,
  UploadCloud,
  Sliders,
  Camera,
  Play,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check
} from 'lucide-react';
import StepJobRole from '../components/practice/StepJobRole';
import StepInterviewType from '../components/practice/StepInterviewType';
import StepPersonality from '../components/practice/StepPersonality';
import StepResumeUpload from '../components/practice/StepResumeUpload';
import StepConfiguration from '../components/practice/StepConfiguration';
import StepDeviceCheck from '../components/practice/StepDeviceCheck';
import InterviewRoom from '../components/practice/InterviewRoom';

export default function PracticePage() {
  const navigate = useNavigate();

  // Wizard state: 1 to 7
  const [currentStep, setCurrentStep] = useState(1);

  // Configuration state
  const [selectedRole, setSelectedRole] = useState('Full Stack Developer');
  const [selectedType, setSelectedType] = useState('Technical Interview');
  const [selectedPersonality, setSelectedPersonality] = useState('Professional Interviewer');
  const [resumeData, setResumeData] = useState(null);
  const [sessionConfig, setSessionConfig] = useState({
    difficulty: 'Intermediate',
    totalQuestions: 5,
    durationMinutes: 15,
    preparationTopic: '',
  });
  const [deviceStatus, setDeviceStatus] = useState({
    videoEnabled: true,
    audioEnabled: true,
  });
  const [consentGiven, setConsentGiven] = useState(true);

  // Steps Definitions
  const steps = [
    { num: 1, title: 'Job Role', icon: Briefcase },
    { num: 2, title: 'Round Type', icon: Layers },
    { num: 3, title: 'AI Personality', icon: UserCheck },
    { num: 4, title: 'Resume (Opt)', icon: UploadCloud },
    { num: 5, title: 'Configuration', icon: Sliders },
    { num: 6, title: 'Device Check', icon: Camera },
    { num: 7, title: 'Interview Room', icon: Play },
  ];

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) return !!selectedRole;
    if (currentStep === 2) return !!selectedType;
    if (currentStep === 3) return !!selectedPersonality;
    if (currentStep === 4) return true; // Resume is optional
    if (currentStep === 5) return !!sessionConfig.difficulty && !!sessionConfig.totalQuestions;
    if (currentStep === 6) return consentGiven;
    return true;
  };

  return (
    <div className="space-y-6">
      {/* If in active interview room (Step 7), render full screen interview room */}
      {currentStep === 7 ? (
        <InterviewRoom
          sessionConfig={{
            role: selectedRole,
            interviewType: selectedType,
            personality: selectedPersonality,
            resumeData,
            ...sessionConfig,
          }}
          deviceStatus={deviceStatus}
          onEndEarly={() => setCurrentStep(1)}
        />
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3478F6]/15 text-[#35D6E8] text-xs font-semibold mb-2 border border-[#3478F6]/30">
                <Sparkles className="w-3.5 h-3.5" />
                Adaptive Practice Studio
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Design Your Interview Simulation
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                Customize technical focus, interviewer demeanor, resume integration, and timing.
              </p>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-xs text-[#94A3B8]">Step {currentStep} of 6</span>
              <div className="text-sm font-bold text-[#35D6E8]">{steps[currentStep - 1].title}</div>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="p-3 sm:p-4 rounded-2xl bg-[#111B32] border border-[#1F2E52] shadow-card-dark">
            <div className="grid grid-cols-6 gap-2">
              {steps.slice(0, 6).map((step) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.num;
                const isCurrent = currentStep === step.num;

                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => step.num < currentStep && setCurrentStep(step.num)}
                    disabled={step.num > currentStep}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl text-center transition-all ${
                      isCurrent
                        ? 'bg-[#3478F6]/20 border border-[#3478F6] text-white'
                        : isCompleted
                        ? 'text-emerald-400 hover:bg-[#0B1020]'
                        : 'text-[#94A3B8] opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isCurrent
                          ? 'bg-[#3478F6] text-white shadow-glow-electric'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-[#0B1020] text-[#94A3B8]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold truncate hidden md:block">
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Content Container */}
          <div className="p-6 md:p-8 rounded-2xl bg-[#111B32] border border-[#1F2E52] shadow-card-dark min-h-[420px] flex flex-col justify-between">
            <div>
              {currentStep === 1 && (
                <StepJobRole selectedRole={selectedRole} onSelectRole={setSelectedRole} />
              )}
              {currentStep === 2 && (
                <StepInterviewType selectedType={selectedType} onSelectType={setSelectedType} />
              )}
              {currentStep === 3 && (
                <StepPersonality
                  selectedPersonality={selectedPersonality}
                  onSelectPersonality={setSelectedPersonality}
                />
              )}
              {currentStep === 4 && (
                <StepResumeUpload
                  resumeData={resumeData}
                  onResumeParsed={setResumeData}
                  onSkipResume={() => setResumeData(null)}
                />
              )}
              {currentStep === 5 && (
                <StepConfiguration
                  config={sessionConfig}
                  onChangeConfig={setSessionConfig}
                  role={selectedRole}
                  interviewType={selectedType}
                  personality={selectedPersonality}
                  resumeData={resumeData}
                />
              )}
              {currentStep === 6 && (
                <StepDeviceCheck
                  deviceStatus={deviceStatus}
                  onUpdateDeviceStatus={setDeviceStatus}
                  onConsentChange={setConsentGiven}
                  consentGiven={consentGiven}
                />
              )}
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#1F2E52]/60">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#94A3B8] hover:text-white rounded-xl hover:bg-[#0B1020] transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#3478F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white text-xs font-bold shadow-glow-electric disabled:opacity-40 transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!consentGiven}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-[#35D6E8] to-[#3478F6] text-[#0B1020] text-xs font-extrabold shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Enter Live Interview Room</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
