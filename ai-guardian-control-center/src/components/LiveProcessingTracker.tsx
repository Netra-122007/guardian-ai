import React from 'react';
import { Cpu, ShieldAlert, ShieldCheck, Lock, Activity, CheckCircle2, Clock, Mic } from 'lucide-react';
import type { DetailedProgressStage } from '../types';

interface LiveProcessingTrackerProps {
  currentStage: DetailedProgressStage;
  commandSource?: 'typed' | 'voice' | 'preset';
}

interface StageStep {
  key: DetailedProgressStage;
  label: string;
  sublabel: string;
  animText: string;
  icon: React.ElementType;
}

const DEFAULT_STAGES: StageStep[] = [
  {
    key: 'RECEIVING_COMMAND',
    label: 'WORKER AGENT',
    sublabel: 'Receiving command...',
    animText: 'Thinking...',
    icon: Cpu,
  },
  {
    key: 'PLANNING_TASK',
    label: 'WORKER AGENT',
    sublabel: 'Planning task...',
    animText: 'Planning...',
    icon: Activity,
  },
  {
    key: 'ACTION_DETECTED',
    label: 'ACTION DETECTED',
    sublabel: 'Guardian intercepting proposed action...',
    animText: 'Intercepting...',
    icon: ShieldAlert,
  },
  {
    key: 'CHECKING_PERMISSIONS',
    label: 'CAPABILITY CHECK',
    sublabel: 'Checking permissions...',
    animText: 'Checking...',
    icon: Lock,
  },
  {
    key: 'ANALYZING_RISK',
    label: 'GUARDIAN',
    sublabel: 'Analyzing risk...',
    animText: 'Analyzing...',
    icon: ShieldAlert,
  },
  {
    key: 'REASONING_INTENT',
    label: 'GEMINI',
    sublabel: 'Reasoning about intent...',
    animText: 'Reasoning...',
    icon: Cpu,
  },
  {
    key: 'DETERMINING_SAFETY',
    label: 'DECISION',
    sublabel: 'Determining safety...',
    animText: 'Deciding...',
    icon: ShieldCheck,
  },
];

export const LiveProcessingTracker: React.FC<LiveProcessingTrackerProps> = ({ currentStage, commandSource }) => {
  if (currentStage === 'IDLE') return null;

  const stages: StageStep[] = DEFAULT_STAGES.map((step) => {
    if (step.key === 'RECEIVING_COMMAND' && commandSource === 'voice') {
      return {
        ...step,
        label: 'VOICE RECEIVED',
        sublabel: 'Voice speech converted & received...',
        animText: 'Speech Input...',
        icon: Mic,
      };
    }
    return step;
  });

  // Find index of current stage
  const currentIndex = stages.findIndex((s) => s.key === currentStage);
  const activeStage = stages.find((s) => s.key === currentStage) || stages[stages.length - 1];

  return (
    <div
      id="live-processing-view"
      className="bg-[#080d16] border-2 border-cyan-500/60 rounded-xl p-4 sm:p-5 shadow-[0_0_35px_rgba(6,182,212,0.25)] my-4 relative overflow-hidden"
    >
      {/* Active Stage Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cyan-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest text-cyan-400 font-bold uppercase">
                LIVE GUARDIAN EVALUATION IN PROGRESS
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-800">
                {activeStage.animText}
              </span>
            </div>
            <h4 className="font-display font-extrabold text-base sm:text-lg text-white tracking-wide mt-0.5">
              ● {activeStage.label}: <span className="text-cyan-200">"{activeStage.sublabel}"</span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs text-slate-400">
          <Clock className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>REAL-TIME COGNITIVE FLOW</span>
        </div>
      </div>

      {/* Sequential Pipeline Stages (Horizontal / Responsive Grid) */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {stages.map((stage, idx) => {
          const isDone = currentIndex > idx || currentStage === 'FINAL_DECISION' || currentStage === 'COMPLETED';
          const isCurrent = currentIndex === idx && currentStage !== 'FINAL_DECISION' && currentStage !== 'COMPLETED';
          const isPending = currentIndex < idx && currentStage !== 'FINAL_DECISION' && currentStage !== 'COMPLETED';
          const Icon = stage.icon;

          return (
            <div
              key={stage.key}
              className={`p-2.5 rounded-lg border font-mono transition-all text-left ${
                isCurrent
                  ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] text-cyan-100 ring-1 ring-cyan-400/50'
                  : isDone
                  ? 'bg-[#0a101b] border-emerald-900/60 text-emerald-300'
                  : 'bg-[#06080d] border-slate-900 text-slate-600 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold tracking-wider uppercase text-slate-400">
                  STEP 0{idx + 1}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                )}
              </div>

              <div className="font-bold text-[11px] truncate flex items-center gap-1">
                <Icon className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{stage.label}</span>
              </div>
              <div className="text-[9px] text-slate-400 truncate mt-0.5" title={stage.sublabel}>
                {stage.sublabel}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
