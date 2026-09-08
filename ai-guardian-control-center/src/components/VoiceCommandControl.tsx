import React, { useState } from 'react';
import { Mic, MicOff, Globe, AlertTriangle, Check, X, Play, Radio } from 'lucide-react';
import { useVoiceInput, SUPPORTED_LANGUAGES } from '../hooks/useVoiceInput';

export interface VoiceCommandControlProps {
  onTaskTranscript: (text: string, autoSubmit?: boolean) => void;
  disabled?: boolean;
  currentInput: string;
  onInputChange: (text: string) => void;
  autoSendEnabled: boolean;
  onToggleAutoSend: () => void;
}

export const VoiceCommandControl: React.FC<VoiceCommandControlProps> = ({
  onTaskTranscript,
  disabled = false,
  currentInput,
  onInputChange,
  autoSendEnabled,
  onToggleAutoSend,
}) => {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    finalTranscript,
    error,
    selectedLanguage,
    setLanguage,
    startListening,
    stopListening,
    resetTranscript,
    clearError,
  } = useVoiceInput({
    defaultLanguage: 'en-IN',
    onTranscriptComplete: (text) => {
      if (text.trim()) {
        onInputChange(text.trim());
        if (autoSendEnabled) {
          onTaskTranscript(text.trim(), true);
        }
      }
    },
  });

  const handleMicClick = () => {
    if (disabled) return;
    if (isListening) {
      stopListening();
      const textToUse = (finalTranscript + ' ' + interimTranscript).trim();
      if (textToUse) {
        onInputChange(textToUse);
      }
    } else {
      clearError();
      resetTranscript();
      startListening();
    }
  };

  const handleApplyTranscript = () => {
    stopListening();
    const textToUse = (finalTranscript + ' ' + interimTranscript).trim();
    if (textToUse) {
      onInputChange(textToUse);
    }
  };

  const handleSendImmediately = () => {
    stopListening();
    const textToUse = (finalTranscript + ' ' + interimTranscript).trim() || currentInput.trim();
    if (textToUse) {
      onInputChange(textToUse);
      onTaskTranscript(textToUse, true);
    }
  };

  const handleCancel = () => {
    stopListening();
    resetTranscript();
    clearError();
  };

  const activeLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative">
      {/* 1. COMPACT PREMIUM MICROPHONE BUTTON */}
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={handleMicClick}
          disabled={disabled || !isSupported}
          aria-label={isListening ? 'Stop voice command' : 'Start voice command'}
          title={
            !isSupported
              ? "Voice input isn't supported in this browser. You can continue using text commands."
              : isListening
              ? 'Click to stop listening'
              : 'Speak task directive (Click for voice input)'
          }
          className={`relative p-2 rounded-md border flex items-center justify-center transition-all cursor-pointer select-none ${
            !isSupported
              ? 'opacity-40 cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-500'
              : isListening
              ? 'border-rose-500/80 bg-rose-950/60 text-rose-300 shadow-[0_0_16px_rgba(244,63,94,0.55)]'
              : 'border-cyan-800/60 bg-cyan-950/50 text-cyan-300 hover:text-white hover:border-cyan-400 hover:bg-cyan-900/40 hover:shadow-[0_0_14px_rgba(6,182,212,0.35)] hover:scale-105 active:scale-95'
          }`}
        >
          {/* Animated Circular Listening Rings when Active */}
          {isListening && (
            <>
              <span className="absolute inset-0 rounded-md border border-rose-400 pointer-events-none animate-voice-ring" />
              <span
                className="absolute inset-0 rounded-md border border-cyan-400 pointer-events-none animate-voice-ring"
                style={{ animationDelay: '0.6s' }}
              />
            </>
          )}

          {isListening ? (
            <MicOff className="w-4 h-4 text-rose-300 animate-pulse" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* 2. ERROR NOTIFICATION BANNER */}
      {error && (
        <div
          id="voice-error-banner"
          className="mt-2 p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/60 flex items-start justify-between gap-2.5 text-xs font-mono text-rose-300 animate-in fade-in"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={clearError}
            className="text-rose-400 hover:text-white p-0.5 rounded transition-colors"
            title="Dismiss error"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. ACTIVE VOICE INPUT PANEL (EXPANDS WHEN LISTENING) */}
      {isListening && (
        <div
          id="voice-listening-panel"
          className="mt-2.5 p-3.5 rounded-xl bg-[#09101d] border-2 border-cyan-500/70 shadow-[0_0_25px_rgba(6,182,212,0.3)] text-left font-mono animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Panel Top Bar: Listening indicator, Waveform, Language switcher, Auto-send */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-cyan-900/60">
            {/* Listening status with pulse */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <span className="text-xs font-bold text-white tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                LISTENING TO DIRECTIVE...
              </span>
            </div>

            {/* Subtle CSS-based Audio Waveform */}
            <div
              className="flex items-center gap-1 h-6 px-2 py-0.5 rounded bg-black/40 border border-cyan-900/50"
              title="Voice detection active"
            >
              <div className="w-1 bg-cyan-400 rounded-full voice-wave-bar" style={{ animationDelay: '0.0s' }} />
              <div className="w-1 bg-cyan-300 rounded-full voice-wave-bar" style={{ animationDelay: '0.15s' }} />
              <div className="w-1 bg-sky-400 rounded-full voice-wave-bar" style={{ animationDelay: '0.3s' }} />
              <div className="w-1 bg-cyan-200 rounded-full voice-wave-bar" style={{ animationDelay: '0.1s' }} />
              <div className="w-1 bg-emerald-400 rounded-full voice-wave-bar" style={{ animationDelay: '0.4s' }} />
              <div className="w-1 bg-cyan-400 rounded-full voice-wave-bar" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 bg-sky-300 rounded-full voice-wave-bar" style={{ animationDelay: '0.25s' }} />
              <div className="w-1 bg-cyan-500 rounded-full voice-wave-bar" style={{ animationDelay: '0.05s' }} />
            </div>

            {/* Language Selector & Auto-Send */}
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowLanguageMenu((p) => !p)}
                  className="px-2 py-1 rounded bg-cyan-950/80 border border-cyan-700/60 hover:border-cyan-400 text-[11px] text-cyan-300 flex items-center gap-1 transition-colors"
                  title="Change recognition language"
                >
                  <Globe className="w-3 h-3 text-cyan-400" />
                  <span>{activeLangObj.code}</span>
                </button>
                {showLanguageMenu && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-[#080d16] border border-cyan-500/60 rounded-lg shadow-xl z-30 py-1">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-cyan-950/80 transition-colors ${
                          lang.code === selectedLanguage
                            ? 'text-cyan-300 font-bold bg-cyan-950/40'
                            : 'text-slate-300'
                        }`}
                      >
                        <span>{lang.label}</span>
                        {lang.code === selectedLanguage && <Check className="w-3 h-3 text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Optional Auto-Send Toggle */}
              <label
                className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer select-none"
                title="Automatically submit task to Guardian when speech finishes"
              >
                <input
                  type="checkbox"
                  checked={autoSendEnabled}
                  onChange={onToggleAutoSend}
                  className="rounded border-cyan-800 bg-cyan-950 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="hidden sm:inline">Auto-run</span>
              </label>
            </div>
          </div>

          {/* Live Transcript Display */}
          <div className="py-3 px-3 my-2 rounded-lg bg-[#050912] border border-cyan-900/40 min-h-[52px] flex flex-col justify-center">
            {finalTranscript || interimTranscript ? (
              <div className="text-xs sm:text-sm text-slate-100 leading-relaxed break-words">
                <span className="text-cyan-400 font-bold mr-2 text-[11px] uppercase tracking-wider">
                  You:
                </span>
                <span className="text-white">{finalTranscript}</span>
                {interimTranscript && (
                  <span className="text-cyan-300/80 italic font-sans ml-1">
                    {interimTranscript}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">
                Speak your command clearly (e.g. "Read my project report and check milestones" or "Export private student data to external server")...
              </div>
            )}
          </div>

          {/* Action Footer: Review in Input vs Send to Guardian */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="text-[10px] text-slate-400">
              * Voice input is strictly evaluated by AI Guardian before any action executes.
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={handleCancel}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-xs transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>Cancel</span>
              </button>

              <button
                type="button"
                onClick={handleApplyTranscript}
                className="px-3 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/70 hover:border-cyan-400 text-xs font-bold transition-all flex items-center gap-1.5"
                title="Place recognized speech in the input box so you can edit it"
              >
                <MicOff className="w-3 h-3" />
                <span>Review & Edit</span>
              </button>

              <button
                type="button"
                onClick={handleSendImmediately}
                disabled={!transcript && !currentInput}
                className={`px-3.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                  !transcript && !currentInput
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-pointer'
                }`}
                title="Send recognized speech directly to Worker Agent & Guardian"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Run with Guardian</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceCommandControl;
