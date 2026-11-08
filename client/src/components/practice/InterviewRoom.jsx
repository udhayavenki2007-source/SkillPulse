import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Volume2,
  RotateCcw,
  Send,
  Square,
  AlertCircle,
  Clock,
  Sparkles,
  HelpCircle,
  Brain,
  CheckCircle2,
  Radio
} from 'lucide-react';
import api from '../../services/api';

export default function InterviewRoom({
  sessionConfig,
  deviceStatus,
  onEndEarly
}) {
  const navigate = useNavigate();

  // Session State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(sessionConfig.totalQuestions || 5);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState((sessionConfig.durationMinutes || 15) * 60);

  // Hardware states
  const [camOn, setCamOn] = useState(deviceStatus.videoEnabled);
  const [micOn, setMicOn] = useState(deviceStatus.audioEnabled);

  // References
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const answerStartTimeRef = useRef(null);

  // Initialize Interview Room & First Question
  useEffect(() => {
    initCameraStream();
    initSpeechRecognition();
    startSessionOnBackend();

    // Start Timer
    timerIntervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          handleFinishInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerIntervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const initCameraStream = async () => {
    if (camOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera stream error:', err.message);
        setCamOn(false);
      }
    }
  };

  const initSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      recognizer.lang = 'en-US';

      recognizer.onresult = (event) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(fullTranscript.trim());
      };

      recognizer.onerror = (event) => {
        console.warn('Speech recognition event:', event.error);
      };

      recognitionRef.current = recognizer;
    }
  };

  const startSessionOnBackend = async () => {
    try {
      const res = await api.post('/interviews', {
        job_role_name: sessionConfig.role,
        interview_type: sessionConfig.interviewType,
        personality: sessionConfig.personality,
        difficulty: sessionConfig.difficulty,
        total_questions: sessionConfig.totalQuestions,
        duration_minutes: sessionConfig.durationMinutes,
        preparation_topic: sessionConfig.preparationTopic,
        resume_id: sessionConfig.resumeData?.id || null,
        allow_video: camOn,
      });

      const session = res.data.session;
      const initialQuestion = res.data.initialQuestion;

      setSessionId(session.id);
      setCurrentQuestion(initialQuestion);
      speakQuestion(initialQuestion.question_text);
    } catch (err) {
      console.warn('Backend session fallback:', err.message);
      // Fallback initial question for development
      const fallbackQ = {
        id: 1,
        question_number: 1,
        difficulty: sessionConfig.difficulty || 'Beginner',
        question_text: `Can you introduce yourself and explain your foundational experience with ${sessionConfig.role}?`
      };
      setSessionId(999);
      setCurrentQuestion(fallbackQ);
      speakQuestion(fallbackQ.question_text);
    }
  };

  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = sessionConfig.personality === 'Strict Interviewer' ? 1.05 : 0.98;
      utterance.pitch = sessionConfig.personality === 'Friendly Interviewer' ? 1.1 : 0.95;

      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => {
        setIsAiSpeaking(false);
        // Automatically activate candidate microphone after AI finishes question
        startRecording();
      };
      utterance.onerror = () => setIsAiSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = () => {
    if (recognitionRef.current && micOn) {
      try {
        setTranscript('');
        answerStartTimeRef.current = Date.now();
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        setIsRecording(true);
      }
    } else {
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
  };

  const handleReplayVoice = () => {
    if (currentQuestion) {
      speakQuestion(currentQuestion.question_text);
    }
  };

  const handleSubmitAnswer = async () => {
    stopRecording();
    setIsEvaluating(true);

    const durationSeconds = answerStartTimeRef.current
      ? Math.round((Date.now() - answerStartTimeRef.current) / 1000)
      : 25;

    const answerPayload = {
      sessionId,
      questionId: currentQuestion.id,
      transcribedText: transcript || 'The candidate provided an answer explaining technical architecture and core implementation paradigms.',
      durationSeconds: Math.max(5, durationSeconds),
    };

    try {
      const res = await api.post(`/interviews/${sessionId}/answer`, answerPayload);

      if (res.data.isCompleted || currentQuestionIndex + 1 >= totalQuestions) {
        handleFinishInterview();
      } else {
        const nextQ = res.data.nextQuestion;
        setCurrentQuestionIndex((prev) => prev + 1);
        setCurrentQuestion(nextQ);
        setTranscript('');
        setIsEvaluating(false);
        speakQuestion(nextQ.question_text);
      }
    } catch (err) {
      console.warn('Answer progression fallback:', err.message);
      if (currentQuestionIndex + 1 >= totalQuestions) {
        handleFinishInterview();
      } else {
        const nextIdx = currentQuestionIndex + 1;
        const fallbackNext = {
          id: nextIdx + 1,
          question_number: nextIdx + 1,
          difficulty: 'Intermediate',
          question_text: `Based on your answer, how would you optimize performance, handle edge cases, and scale this implementation in production?`
        };
        setCurrentQuestionIndex(nextIdx);
        setCurrentQuestion(fallbackNext);
        setTranscript('');
        setIsEvaluating(false);
        speakQuestion(fallbackNext.question_text);
      }
    }
  };

  const handleFinishInterview = async () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    try {
      if (sessionId) {
        await api.post(`/interviews/${sessionId}/complete`);
        navigate(`/report/${sessionId}`);
      } else {
        navigate('/report/1');
      }
    } catch (err) {
      navigate(`/report/${sessionId || 1}`);
    }
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto animate-fadeIn">
      {/* Top Session Status Bar */}
      <div className="p-4 rounded-2xl bg-[#111B32] border border-[#1F2E52] flex flex-wrap items-center justify-between gap-4 shadow-card-dark">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B1020] border border-[#3478F6]/40 flex items-center justify-center text-[#35D6E8]">
            <Radio className="w-5 h-5 animate-pulse text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white">{sessionConfig.role}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#3478F6]/15 text-[#35D6E8] border border-[#3478F6]/30">
                {sessionConfig.interviewType}
              </span>
            </div>
            <span className="text-xs text-[#94A3B8]">
              Interviewer: <strong className="text-white">{sessionConfig.personality}</strong>
            </span>
          </div>
        </div>

        {/* Progress & Timer */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right">
            <span className="text-[11px] text-[#94A3B8] block">Question Progress</span>
            <span className="text-xs font-bold text-white">
              {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B1020] border border-[#1F2E52] text-xs font-mono font-bold text-[#35D6E8]">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <button
            type="button"
            onClick={onEndEarly || handleFinishInterview}
            className="px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/15 hover:bg-rose-500 rounded-lg transition-colors border border-rose-500/30"
          >
            End Interview
          </button>
        </div>
      </div>

      {/* Main Split Stage: AI Interviewer vs Candidate Webcam */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: AI Interviewer Panel */}
        <div className="p-6 rounded-2xl bg-[#111B32] border border-[#1F2E52] shadow-card-dark flex flex-col justify-between space-y-6 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${isAiSpeaking ? 'bg-[#35D6E8]/20' : 'bg-transparent'}`} />

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl bg-[#0B1020] border-2 flex items-center justify-center text-3xl shadow-inner transition-all ${isAiSpeaking ? 'border-[#35D6E8] ring-4 ring-[#35D6E8]/20 scale-105' : 'border-[#1F2E52]'}`}>
                  {sessionConfig.personality === 'Strict Interviewer' ? '🧐' :
                   sessionConfig.personality === 'Friendly Interviewer' ? '😊' :
                   sessionConfig.personality === 'Technical Expert' ? '⚡' :
                   sessionConfig.personality === 'HR Interviewer' ? '🤝' : '👔'}
                </div>
                {isAiSpeaking && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#111B32] animate-bounce" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{sessionConfig.personality}</h3>
                <span className="text-[11px] text-[#35D6E8] font-medium flex items-center gap-1.5">
                  {isAiSpeaking ? (
                    <>
                      <Volume2 className="w-3 h-3 text-[#35D6E8] animate-pulse" />
                      Speaking question...
                    </>
                  ) : (
                    'Listening to your answer...'
                  )}
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-[#0B1020] border border-[#1F2E52] text-[#94A3B8]">
              Level: {currentQuestion?.difficulty || 'Adaptive'}
            </span>
          </div>

          {/* Current Question Text Display */}
          <div className="p-5 rounded-2xl bg-[#0B1020]/90 border border-[#1F2E52] min-h-[140px] flex flex-col justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#3478F6] mb-2">
              Question #{currentQuestionIndex + 1}
            </span>
            <p className="text-base md:text-lg font-medium text-white leading-relaxed">
              {currentQuestion?.question_text || 'Synthesizing adaptive question based on role and difficulty level...'}
            </p>
          </div>

          {/* AI Voice & Replay Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-[#1F2E52]/60">
            <button
              type="button"
              onClick={handleReplayVoice}
              disabled={isAiSpeaking}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#35D6E8] bg-[#0B1020] hover:bg-[#3478F6]/20 border border-[#1F2E52] rounded-lg transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay AI Voice</span>
            </button>

            <span className="text-[11px] text-[#94A3B8]">
              Answers evaluated confidentially without interruptions.
            </span>
          </div>
        </div>

        {/* Right: Candidate Webcam & Live Response Transcription */}
        <div className="p-6 rounded-2xl bg-[#111B32] border border-[#1F2E52] shadow-card-dark flex flex-col justify-between space-y-4">
          {/* Webcam Stream */}
          <div className="relative aspect-video rounded-xl bg-[#0B1020] border border-[#1F2E52] overflow-hidden flex items-center justify-center">
            {camOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />
            ) : (
              <div className="text-center p-4">
                <CameraOff className="w-8 h-8 text-[#94A3B8] mx-auto mb-1 opacity-60" />
                <span className="text-xs text-white">Audio-Only Practice Mode</span>
              </div>
            )}

            {/* Live Indicator Pill */}
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-white">
              <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-[#94A3B8]'}`} />
              <span>{isRecording ? 'LIVE RECORDING' : 'MIC STANDBY'}</span>
            </div>

            {/* Quick Stream Toggles */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCamOn(!camOn)}
                className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 backdrop-blur-md"
              >
                {camOn ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5 text-rose-400" />}
              </button>
              <button
                type="button"
                onClick={() => setMicOn(!micOn)}
                className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 backdrop-blur-md"
              >
                {micOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
              </button>
            </div>
          </div>

          {/* Real-time Candidate Transcription Preview */}
          <div className="p-3.5 rounded-xl bg-[#0B1020] border border-[#1F2E52] space-y-2 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Mic className="w-3 h-3 text-[#35D6E8]" />
                Live Speech Transcription Preview
              </span>
              <span>{isRecording ? 'Transcribing...' : 'Paused'}</span>
            </div>

            {/* Transcript text box with editing capability so candidates can confirm or refine before submission */}
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your spoken words will transcribe here automatically. You may also edit or type additional technical explanations..."
              rows={3}
              className="w-full p-2 text-xs bg-transparent text-[#E6EDF7] placeholder-[#94A3B8] resize-none focus:outline-none focus:ring-0 border-0"
            />
          </div>

          {/* Candidate Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                isRecording
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 hover:bg-rose-500/25'
                  : 'bg-[#0B1020] border-[#1F2E52] text-white hover:border-[#35D6E8]'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-rose-400" />
                  <span>Pause Recording</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-[#35D6E8]" />
                  <span>Resume Speaking</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSubmitAnswer}
              disabled={isEvaluating || (!transcript.trim() && isRecording)}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3478F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white text-xs font-bold shadow-glow-electric disabled:opacity-50 transition-all"
            >
              {isEvaluating ? (
                <>
                  <Sparkles className="w-4 h-4 text-[#35D6E8] animate-spin" />
                  <span>Processing & Adapting Next Question...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit & Next Question</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
