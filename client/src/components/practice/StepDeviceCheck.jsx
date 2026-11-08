import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Mic, MicOff, CheckCircle2, AlertTriangle, Shield, Volume2 } from 'lucide-react';

export default function StepDeviceCheck({
  deviceStatus,
  onUpdateDeviceStatus,
  onConsentChange,
  consentGiven
}) {
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const [micVolume, setMicVolume] = useState(0);
  const [stream, setStream] = useState(null);
  const [permissionError, setPermissionError] = useState(null);

  useEffect(() => {
    initMediaStream();
    return () => {
      cleanupMedia();
    };
  }, [deviceStatus.videoEnabled, deviceStatus.audioEnabled]);

  const initMediaStream = async () => {
    try {
      cleanupMedia();
      setPermissionError(null);

      const constraints = {
        video: deviceStatus.videoEnabled,
        audio: deviceStatus.audioEnabled,
      };

      if (!constraints.video && !constraints.audio) {
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current && deviceStatus.videoEnabled) {
        videoRef.current.srcObject = mediaStream;
      }

      // Initialize audio meter if audio enabled
      if (deviceStatus.audioEnabled && mediaStream.getAudioTracks().length > 0) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(mediaStream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateMeter = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setMicVolume(Math.min(100, Math.round((avg / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(updateMeter);
        };
        updateMeter();
      }
    } catch (err) {
      console.warn('Media access warning:', err.message);
      setPermissionError(
        'Unable to access camera or microphone. Please verify browser permissions, or continue in audio-only mode.'
      );
    }
  };

  const cleanupMedia = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleVideo = () => {
    onUpdateDeviceStatus({ ...deviceStatus, videoEnabled: !deviceStatus.videoEnabled });
  };

  const toggleAudio = () => {
    onUpdateDeviceStatus({ ...deviceStatus, audioEnabled: !deviceStatus.audioEnabled });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Camera className="w-5 h-5 text-[#3478F6]" />
          Step 6: Device Check & Privacy Consent
        </h2>
        <p className="text-xs md:text-sm text-[#94A3B8] mt-1">
          Verify your microphone input meter and webcam stream. Audio-only practice is fully supported.
        </p>
      </div>

      {permissionError && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{permissionError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Webcam Preview Container */}
        <div className="space-y-3">
          <div className="relative aspect-video rounded-2xl bg-[#0B1020] border border-[#1F2E52] overflow-hidden flex items-center justify-center">
            {deviceStatus.videoEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#94A3B8] p-4 text-center">
                <CameraOff className="w-10 h-10 mb-2 opacity-50" />
                <span className="text-xs font-semibold text-white">Camera Disabled</span>
                <span className="text-[11px] text-[#94A3B8]">Audio-only practice mode active</span>
              </div>
            )}

            {/* Bottom Controls Overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full bg-[#111B32]/90 backdrop-blur-md border border-[#1F2E52]">
              <button
                type="button"
                onClick={toggleVideo}
                className={`p-2 rounded-full transition-colors ${
                  deviceStatus.videoEnabled
                    ? 'bg-[#3478F6] text-white'
                    : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                }`}
                title={deviceStatus.videoEnabled ? 'Turn off camera' : 'Turn on camera'}
              >
                {deviceStatus.videoEnabled ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={toggleAudio}
                className={`p-2 rounded-full transition-colors ${
                  deviceStatus.audioEnabled
                    ? 'bg-[#35D6E8] text-[#0B1020]'
                    : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                }`}
                title={deviceStatus.audioEnabled ? 'Mute microphone' : 'Unmute microphone'}
              >
                {deviceStatus.audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#94A3B8]">
            <span>Video Status: <strong className="text-white">{deviceStatus.videoEnabled ? 'Enabled' : 'Audio Only'}</strong></span>
            <span>Microphone: <strong className="text-white">{deviceStatus.audioEnabled ? 'Ready' : 'Muted'}</strong></span>
          </div>
        </div>

        {/* Audio Meter & Consent Policy */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Audio Input Meter */}
          <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1F2E52] space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#35D6E8]" />
                Microphone Input Meter
              </span>
              <span className="text-[11px] text-[#94A3B8]">{micVolume}% signal</span>
            </div>

            {/* Dynamic Volume Bar */}
            <div className="h-3 w-full bg-[#111B32] rounded-full overflow-hidden p-0.5 border border-[#1F2E52]">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-[#35D6E8] to-[#3478F6] rounded-full transition-all duration-75"
                style={{ width: `${micVolume}%` }}
              />
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Speak into your microphone to verify speech levels.
            </p>
          </div>

          {/* Privacy & Recording Policy */}
          <div className="p-4 rounded-xl bg-[#111B32] border border-[#1F2E52] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <Shield className="w-4 h-4 text-[#3478F6]" />
              Data Privacy & Retention Policy
            </div>
            <ul className="text-xs text-[#94A3B8] space-y-1.5 list-disc pl-4">
              <li>Video streams are processed locally in your browser and are not permanently saved.</li>
              <li>Audio is used exclusively for speech-to-text transcription and metrics.</li>
              <li>You may purge recordings and interview history at any time from your settings.</li>
            </ul>

            <label className="flex items-start gap-3 pt-2 cursor-pointer border-t border-[#1F2E52]/60">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => onConsentChange(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#3478F6] bg-[#0B1020] border-[#1F2E52] rounded focus:ring-0 focus:outline-none"
              />
              <span className="text-xs text-[#E6EDF7] font-medium leading-tight">
                I grant explicit consent to use my audio & video for real-time AI evaluation and interview simulation.
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
