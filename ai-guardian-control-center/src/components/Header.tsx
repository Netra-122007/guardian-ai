import React from 'react';
import { Cpu, Activity, Play, RotateCcw, AlertTriangle, Home, LogOut, User } from 'lucide-react';
import { AIGuardianLogo } from './AIGuardianLogo';

interface HeaderProps {
  systemOnline: boolean;
  componentsActive: number;
  isDemoRunning: boolean;
  onToggleDemo: () => void;
  onReset: () => void;
  failSafeSimulate: boolean;
  onToggleFailSafe: () => void;
  latencyMs: number;
  geminiReady: boolean;
  onNavigateLanding?: () => void;
  userEmail?: string;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  systemOnline,
  componentsActive,
  isDemoRunning,
  onToggleDemo,
  onReset,
  failSafeSimulate,
  onToggleFailSafe,
  latencyMs,
  geminiReady,
  onNavigateLanding,
  userEmail = 'operator@aiguardian.sec',
  onSignOut,
}) => {
  return (
    <header className="border-b border-cyan-950/60 bg-[#0a0d14]/90 backdrop-blur-md px-4 lg:px-8 py-3.5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Title and Badge */}
        <div className="flex items-center gap-3.5">
          <div
            className="relative cursor-pointer group"
            onClick={onNavigateLanding}
            title="Click to view AI Guardian landing page"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.25)] group-hover:border-cyan-400 transition-colors">
              <AIGuardianLogo size="sm" withGlow animated showScan status={systemOnline ? 'MONITORING' : 'IDLE'} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0a0d14] animate-ping" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0a0d14]" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1
                onClick={onNavigateLanding}
                className="font-display font-bold text-lg md:text-xl tracking-wider text-white flex items-center gap-2 cursor-pointer hover:text-cyan-200 transition-colors"
              >
                AI GUARDIAN
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono tracking-normal">
                  v2.4-SOC
                </span>
              </h1>
              {systemOnline && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-mono text-emerald-400 font-bold tracking-wider uppercase">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span>ACTIVE</span>
                </div>
              )}
            </div>
            <p className="text-[11px] md:text-xs font-mono tracking-widest text-cyan-400/80 uppercase">
              AI THAT GUARDS AI // REAL-TIME AGENT INTERCEPTION SYSTEM
            </p>
          </div>
        </div>

        {/* Status indicator & Control Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Landing Page link */}
          {onNavigateLanding && (
            <button
              onClick={onNavigateLanding}
              className="px-2.5 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 text-slate-300 bg-[#0f1522] border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 transition-all cursor-pointer"
              title="Return to public landing page"
            >
              <Home className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Landing Page</span>
            </button>
          )}

          {/* Live system indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0f1522] border border-cyan-900/40 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${systemOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-slate-300 font-semibold tracking-wide">
              {systemOnline ? 'ONLINE' : 'DEGRADED'}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400">{componentsActive} ACTIVE</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">{latencyMs}ms</span>
          </div>

          {/* Gemini engine status indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono border ${
              failSafeSimulate
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                : geminiReady
                ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>
              REASONING:{' '}
              {failSafeSimulate ? (
                <strong className="text-amber-400 font-bold">SIMULATED OUTAGE</strong>
              ) : geminiReady ? (
                <strong className="text-emerald-400">GEMINI ONLINE</strong>
              ) : (
                <strong className="text-cyan-400">STANDBY</strong>
              )}
            </span>
          </div>

          {/* Fail-Safe Toggle Button */}
          <button
            id="toggle-failsafe-btn"
            onClick={onToggleFailSafe}
            title="Toggle simulated Gemini outage to test fail-safe mode (Decision: REVIEW, Action Paused)"
            className={`px-2.5 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border ${
              failSafeSimulate
                ? 'bg-amber-500/20 text-amber-200 border-amber-500 hover:bg-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-[#141a29] text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Fail-Safe</span>
          </button>

          {/* Demo Mode Button */}
          <button
            id="demo-mode-btn"
            onClick={onToggleDemo}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 font-bold transition-all cursor-pointer border ${
              isDemoRunning
                ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/25 hover:border-cyan-400'
            }`}
          >
            {isDemoRunning ? (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                <span>STOP DEMO</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>START DEMO (60s)</span>
              </>
            )}
          </button>

          {/* Reset button */}
          <button
            id="reset-system-btn"
            onClick={onReset}
            title="Reset active agent and pipeline states"
            className="p-1.5 rounded bg-[#141a29] border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Operator Sign Out */}
          {onSignOut && (
            <button
              onClick={onSignOut}
              title={`Sign out (${userEmail})`}
              className="p-1.5 rounded bg-[#141a29] border border-slate-800 hover:border-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
