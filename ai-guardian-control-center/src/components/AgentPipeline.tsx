import React from 'react';
import { AIGuardianLogo } from './AIGuardianLogo';
import {
  Bot,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  FileText,
  Mail,
  Database,
  Calendar,
  Globe,
  Radio,
  Clock,
  ArrowRight,
  Eye,
  Search,
  Brain,
  Gavel,
  ShieldAlert,
} from 'lucide-react';
import type {
  AgentState,
  GuardianStage,
  PlanStep,
  ProposedAction,
  GuardianEvaluation,
} from '../types';

interface AgentPipelineProps {
  agentState: AgentState;
  guardianStage: GuardianStage;
  activeTask: string | null;
  plan: PlanStep[];
  currentStepIndex: number;
  activeAction: ProposedAction | null;
  evaluation: GuardianEvaluation | null;
  executorStatusText: string;
  executorLocked: boolean;
  onOpenInterceptionDetail: () => void;
}

export const AgentPipeline: React.FC<AgentPipelineProps> = ({
  agentState,
  guardianStage,
  activeTask,
  plan,
  currentStepIndex,
  activeAction,
  evaluation,
  executorStatusText,
  executorLocked,
  onOpenInterceptionDetail,
}) => {
  // Map agent status for visual styling
  const getAgentStatusBadge = () => {
    switch (agentState) {
      case 'IDLE':
        return { text: 'ONLINE // IDLE', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 'RECEIVING_TASK':
        return { text: 'RECEIVING TASK', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse' };
      case 'PLANNING':
        return { text: 'PLANNING ACTIONS', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 animate-pulse' };
      case 'PROPOSING_ACTION':
        return { text: 'ACTION PROPOSED', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' };
      case 'WAITING_FOR_GUARDIAN':
        return { text: 'WAITING FOR GUARDIAN', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse' };
      case 'ACTION_ALLOWED':
        return { text: 'ACTION APPROVED', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'ACTION_REVIEW':
        return { text: 'ACTION PAUSED (REVIEW)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' };
      case 'ACTION_BLOCKED':
        return { text: 'ACTION BLOCKED', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'EXECUTING':
        return { text: 'EXECUTING IN SANDBOX', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse' };
      case 'COMPLETED':
        return { text: 'TASK COMPLETED', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      default:
        return { text: 'ONLINE', color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const getGuardianStatusBadge = () => {
    switch (guardianStage) {
      case 'MONITORING':
        return { text: 'MONITORING BUS', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 'ACTION_DETECTED':
        return { text: 'ACTION DETECTED', color: 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse' };
      case 'CAPABILITY_CHECK':
        return { text: 'CHECKING CAPABILITIES', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 animate-pulse' };
      case 'RULE_ANALYSIS':
        return { text: 'RULE ANALYSIS ACTIVE', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 animate-pulse' };
      case 'GEMINI_REASONING':
        return { text: 'GEMINI REASONING', color: 'bg-cyan-400/25 text-cyan-200 border-cyan-400/60 animate-pulse' };
      case 'DECISION':
        return {
          text: evaluation?.decision ? `DECISION: ${evaluation.decision}` : 'DECISION ENFORCEMENT',
          color:
            evaluation?.decision === 'BLOCK'
              ? 'bg-rose-500/25 text-rose-300 border-rose-500'
              : evaluation?.decision === 'REVIEW'
              ? 'bg-amber-500/25 text-amber-300 border-amber-500'
              : 'bg-emerald-500/25 text-emerald-300 border-emerald-500',
        };
      case 'ENFORCEMENT':
        return { text: 'ENFORCEMENT ACTIVE', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' };
      default:
        return { text: 'MONITORING', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
    }
  };

  const agentBadge = getAgentStatusBadge();
  const guardianBadge = getGuardianStatusBadge();

  // Internal Guardian stages
  const guardianSubStages = [
    { key: 'OBSERVE', label: 'OBSERVE', icon: Eye, active: guardianStage === 'ACTION_DETECTED' || guardianStage === 'CAPABILITY_CHECK' || guardianStage === 'RULE_ANALYSIS' || guardianStage === 'GEMINI_REASONING' || guardianStage === 'DECISION' },
    { key: 'ANALYZE', label: 'ANALYZE', icon: Search, active: guardianStage === 'CAPABILITY_CHECK' || guardianStage === 'RULE_ANALYSIS' || guardianStage === 'GEMINI_REASONING' || guardianStage === 'DECISION' },
    { key: 'REASON', label: 'REASON', icon: Brain, active: guardianStage === 'GEMINI_REASONING' || guardianStage === 'DECISION' },
    { key: 'DECIDE', label: 'DECIDE', icon: Gavel, active: guardianStage === 'DECISION' || guardianStage === 'ENFORCEMENT' },
  ];

  const toolsList = [
    { name: 'File', icon: FileText, key: 'file' },
    { name: 'Email', icon: Mail, key: 'email' },
    { name: 'Database', icon: Database, key: 'database' },
    { name: 'Calendar', icon: Calendar, key: 'calendar' },
    { name: 'Web', icon: Globe, key: 'web' },
  ];

  return (
    <div className="w-full relative">
      {/* Central Grid Pipeline Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch relative">
        {/* ========================================================
            LEFT COLUMN: WORKER AGENT #01
        ======================================================== */}
        <div
          id="worker-agent-panel"
          className="lg:col-span-4 bg-[#0d121c]/90 rounded-xl border border-cyan-900/40 p-4.5 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.5)] relative overflow-hidden group"
        >
          {/* Subtle top indicator line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-600 via-cyan-400 to-transparent" />

          <div>
            {/* Header / Identity */}
            <div className="flex items-start justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-bold text-sm tracking-wide text-white uppercase">
                      WORKER AGENT #01
                    </h2>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 tracking-wider">
                    AUTONOMOUS WORKER RUNTIME
                  </span>
                </div>
              </div>

              <div className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider border ${agentBadge.color}`}>
                {agentBadge.text}
              </div>
            </div>

            {/* Current Task */}
            <div className="mb-4 bg-[#090d14] rounded-lg p-3 border border-slate-800/80">
              <div className="text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase mb-1 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-cyan-400" />
                CURRENT TASK
              </div>
              <p className="text-xs text-slate-200 font-mono leading-relaxed line-clamp-2">
                {activeTask ? `"${activeTask}"` : 'Waiting for a task...'}
              </p>
            </div>

            {/* Capabilities */}
            <div className="mb-4">
              <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-2">
                ACTIVE CAPABILITIES
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Planning', 'File access', 'Email', 'Calendar', 'Web'].map((cap) => (
                  <span
                    key={cap}
                    className="px-2 py-0.5 rounded bg-cyan-950/30 border border-cyan-800/40 text-[10px] font-mono text-cyan-300"
                  >
                    ● {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Plan Breakdown */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                  EXECUTION PLAN
                </div>
                {plan.length > 0 && (
                  <span className="text-[10px] font-mono text-cyan-400">
                    STEP {Math.min(currentStepIndex + 1, plan.length)} / {plan.length}
                  </span>
                )}
              </div>

              {plan.length === 0 ? (
                <div className="p-5 rounded-lg bg-[#070a12] border border-slate-800 text-center font-mono">
                  <div className="w-8 h-8 rounded-full bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-2">
                    <Bot className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="text-xs font-bold text-slate-200">Your Worker Agent is waiting.</div>
                  <div className="text-[11px] text-cyan-400/80 mt-0.5">Enter a task to begin.</div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {plan.map((step, idx) => {
                    const isActive = idx === currentStepIndex;
                    const isDone = idx < currentStepIndex || step.status === 'completed';
                    const isBlocked = step.status === 'blocked';
                    const isPaused = step.status === 'paused';

                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-md font-mono text-xs transition-all border ${
                          isActive
                            ? 'bg-cyan-950/50 border-cyan-400 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/40'
                            : isDone
                            ? 'bg-[#090d14] border-emerald-900/40 text-slate-400'
                            : isBlocked
                            ? 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                            : isPaused
                            ? 'bg-amber-950/30 border-amber-800/50 text-amber-300'
                            : 'bg-[#090d14]/60 border-slate-900 text-slate-500'
                        }`}
                      >
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isActive
                              ? 'bg-cyan-500 text-black font-extrabold'
                              : isDone
                              ? 'bg-emerald-950 text-emerald-400'
                              : isBlocked
                              ? 'bg-rose-950 text-rose-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {step.id}
                        </span>
                        <span className="flex-1 truncate font-medium">{step.title}</span>

                        {isDone && (
                          <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                            <span>✓</span>
                          </span>
                        )}
                        {isActive && (
                          <span className="text-cyan-400 font-bold text-xs flex items-center gap-1">
                            <span className="animate-ping">◉</span>
                          </span>
                        )}
                        {isBlocked && (
                          <span className="text-rose-400 font-bold text-xs flex items-center gap-1">
                            <span>✕</span>
                          </span>
                        )}
                        {!isDone && !isActive && !isBlocked && (
                          <span className="text-slate-600 font-bold text-xs">○</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Action proposed preview callout */}
          {activeAction && (
            <div className="mt-3.5 p-2.5 rounded bg-amber-950/25 border border-amber-500/40 text-[11px] font-mono">
              <div className="flex items-center justify-between text-amber-300 font-bold mb-1">
                <span>⚡ PROPOSED TOOL ACTION</span>
                <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200">
                  {activeAction.tool}.{activeAction.action}
                </span>
              </div>
              <div className="text-slate-300 truncate">Target: {activeAction.target}</div>
              <div className="text-slate-400 truncate">Dest: {activeAction.destination}</div>
            </div>
          )}
        </div>

        {/* ========================================================
            CENTER COLUMN: AI GUARDIAN (SHIELD & REASONING ENGINE)
        ======================================================== */}
        <div
          id="guardian-central-panel"
          className="lg:col-span-5 bg-[#0d121c]/95 rounded-xl border-2 border-cyan-500/40 p-4.5 flex flex-col justify-between shadow-[0_0_35px_rgba(6,182,212,0.15)] relative overflow-hidden"
        >
          {/* Top radar scanning line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

          {/* Background grid + radar glow */}
          <div className="absolute inset-0 pointer-events-none opacity-20 cyber-grid" />

          <div>
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <AIGuardianLogo
                    size="xs"
                    withGlow
                    animated
                    showScan
                    status={evaluation?.decision || 'MONITORING'}
                  />
                </div>
                <div>
                  <h2 className="font-display font-bold text-sm tracking-wide text-white uppercase flex items-center gap-2">
                    AI GUARDIAN
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500 text-black font-mono font-bold">
                      INSPECTION CORE
                    </span>
                  </h2>
                  <span className="text-[11px] font-mono text-cyan-400/90 tracking-wider">
                    AUTONOMOUS COGNITIVE SUPERVISOR
                  </span>
                </div>
              </div>

              <div className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider border ${guardianBadge.color}`}>
                {guardianBadge.text}
              </div>
            </div>

            {/* Central Shield Visualization */}
            <div className="my-3 py-3 flex flex-col items-center justify-center relative">
              {/* Radar Rings */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border border-cyan-500/25 border-dashed" />
                {/* Mid Ring */}
                <div className="absolute inset-3 rounded-full border border-cyan-500/40" />
                {/* Inner Ring */}
                <div className="absolute inset-7 rounded-full border border-cyan-400/60 bg-[#090e18]/80 shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]" />
                
                {/* Radar Sweep Line */}
                <div className="absolute inset-3 rounded-full overflow-hidden pointer-events-none animate-radar">
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/30 to-transparent origin-bottom-right" />
                </div>

                {/* Central Shield Brand Graphic */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                  <div className={`transition-all duration-300 ${
                    evaluation?.decision === 'BLOCK'
                      ? 'filter drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]'
                      : evaluation?.decision === 'REVIEW'
                      ? 'filter drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]'
                      : evaluation?.decision === 'ALLOW'
                      ? 'filter drop-shadow-[0_0_20px_rgba(52,211,153,0.8)]'
                      : 'filter drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]'
                  }`}>
                    <AIGuardianLogo
                      size="lg"
                      withGlow
                      animated
                      showScan
                      status={evaluation?.decision || 'MONITORING'}
                    />
                  </div>

                  {/* Intercept Alert Badge */}
                  {activeAction && (
                    <div className="mt-1 px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-400/50 text-[10px] font-mono text-cyan-300 font-bold tracking-wider">
                      INTERCEPTING
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Risk Gauge */}
              {evaluation && (
                <div className="mt-2 flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#090d14] border border-slate-800 text-xs font-mono">
                  <span className="text-slate-400">EVALUATED RISK:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      evaluation.riskLevel === 'HIGH' || evaluation.riskLevel === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : evaluation.riskLevel === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {evaluation.riskScore} / 100 ({evaluation.riskLevel})
                  </span>
                </div>
              )}
            </div>

            {/* Four Internal Stages Visualization */}
            <div className="mb-2">
              <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1.5 text-center">
                INTERNAL EVALUATION PIPELINE
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {guardianSubStages.map((stg) => {
                  const Icon = stg.icon;
                  return (
                    <div
                      key={stg.key}
                      className={`flex flex-col items-center justify-center p-2 rounded-md font-mono transition-all border ${
                        stg.active
                          ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                          : 'bg-[#090d14] border-slate-800/80 text-slate-500'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 mb-1 ${stg.active ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`} />
                      <span className="text-[9px] font-bold tracking-wider">{stg.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Inspection Action Bar */}
          {evaluation && (
            <button
              id="inspect-interception-btn"
              onClick={onOpenInterceptionDetail}
              className="mt-3 w-full py-2 px-3 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-500/50 text-cyan-200 font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-300" />
              <span>VIEW DETAILED INTERCEPTION REASONING</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* ========================================================
            RIGHT COLUMN: TOOL EXECUTOR
        ======================================================== */}
        <div
          id="tool-executor-panel"
          className="lg:col-span-3 bg-[#0d121c]/90 rounded-xl border border-cyan-900/40 p-4.5 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          {/* Subtle top indicator line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-600 to-cyan-400" />

          <div>
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${
                  executorLocked
                    ? 'bg-slate-900 border-slate-700 text-slate-400'
                    : 'bg-emerald-950 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                }`}>
                  {executorLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="font-display font-bold text-sm tracking-wide text-white uppercase">
                    TOOL EXECUTOR
                  </h2>
                  <span className="text-[11px] font-mono text-slate-400 tracking-wider">
                    ISOLATED RUNTIME SANDBOX
                  </span>
                </div>
              </div>

              <span className={`w-2 h-2 rounded-full ${executorLocked ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
            </div>

            {/* Status Banner */}
            <div className={`mb-4 p-3 rounded-lg border font-mono text-xs leading-relaxed transition-all ${
              executorLocked
                ? 'bg-[#090d14] border-amber-900/40 text-amber-200/90'
                : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
            }`}>
              <div className="text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5 text-slate-400">
                {executorLocked ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3 text-emerald-400" />}
                EXECUTION STATUS
              </div>
              <p className="font-semibold">{executorStatusText}</p>
            </div>

            {/* Available Sandbox Tools */}
            <div className="mb-4">
              <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-2">
                CONNECTED TOOLS
              </div>
              <div className="space-y-1.5">
                {toolsList.map((t) => {
                  const Icon = t.icon;
                  const isCurrentTool = activeAction?.tool === t.key;
                  return (
                    <div
                      key={t.name}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-md font-mono text-xs border transition-all ${
                        isCurrentTool
                          ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                          : 'bg-[#090d14] border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${isCurrentTool ? 'text-cyan-300' : 'text-slate-500'}`} />
                        <span>{t.name}</span>
                      </div>
                      <span className={`text-[10px] ${
                        isCurrentTool
                          ? 'text-cyan-300 font-bold'
                          : 'text-slate-600'
                      }`}>
                        {isCurrentTool ? 'ACTIVE' : 'LOCKED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sandbox Security Guarantee */}
          <div className="p-2.5 rounded bg-[#090d14] border border-slate-800 text-[10px] font-mono text-slate-500 space-y-1">
            <div className="flex items-center justify-between">
              <span>SANDBOX ISOLATION</span>
              <span className="text-emerald-400 font-bold">ENFORCED</span>
            </div>
            <div className="flex items-center justify-between">
              <span>GUARDIAN INTERCEPTOR</span>
              <span className="text-cyan-400 font-bold">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
