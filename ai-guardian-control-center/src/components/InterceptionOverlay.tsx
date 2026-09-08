import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Cpu,
  UserCheck,
  UserX,
  X,
} from 'lucide-react';
import type { ProposedAction, GuardianEvaluation, GuardianStage } from '../types';

interface InterceptionOverlayProps {
  action: ProposedAction | null;
  evaluation: GuardianEvaluation | null;
  guardianStage: GuardianStage;
  onHumanDecision: (decision: 'APPROVE' | 'BLOCK') => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const InterceptionOverlay: React.FC<InterceptionOverlayProps> = ({
  action,
  evaluation,
  guardianStage,
  onHumanDecision,
  onClose,
  isModal = false,
}) => {
  if (!action) return null;

  const isAnalyzing =
    guardianStage === 'ACTION_DETECTED' ||
    guardianStage === 'CAPABILITY_CHECK' ||
    guardianStage === 'RULE_ANALYSIS' ||
    guardianStage === 'GEMINI_REASONING';

  return (
    <div
      id="interception-overlay"
      className={`${
        isModal
          ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto'
          : 'w-full my-6 bg-[#0c1018] rounded-xl border-2 border-cyan-500/50 p-5 md:p-6 shadow-[0_0_40px_rgba(6,182,212,0.2)]'
      }`}
    >
      <div
        className={`${
          isModal
            ? 'w-full max-w-4xl bg-[#0c1018] rounded-xl border-2 border-cyan-500/60 p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] relative max-h-[90vh] overflow-y-auto'
            : 'w-full'
        }`}
      >
        {/* Modal Close Button */}
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Top Detection Alert Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cyan-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                  ACTION DETECTED & INTERCEPTED
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              </div>
              <p className="text-xs font-mono text-slate-400">
                Agent: <strong className="text-slate-200">Worker Agent #01</strong> // Pipeline Bus: Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-xs font-mono text-cyan-300 font-bold">
              ID: {action.id}
            </span>
            <span className="px-3 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300">
              {action.timestamp || new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Action Signature Grid */}
        <div className="my-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#080b11] p-3.5 rounded-lg border border-slate-800 font-mono text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">TOOL</span>
            <span className="text-cyan-300 font-bold uppercase">{action.tool}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">ACTION</span>
            <span className="text-white font-bold uppercase">{action.action}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">TARGET</span>
            <span className="text-amber-300 font-bold truncate block" title={action.target}>
              {action.target}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">DESTINATION</span>
            <span
              className={`font-bold truncate block ${
                action.destination.includes('external') || action.destination.includes('unknown')
                  ? 'text-rose-400'
                  : 'text-emerald-300'
              }`}
              title={action.destination}
            >
              {action.destination}
            </span>
          </div>
        </div>

        {action.payloadSnippet && (
          <div className="mb-4 bg-[#07090e] p-3 rounded border border-slate-800/80 font-mono text-xs">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
              PAYLOAD SNIPPET / PARAMETERS
            </span>
            <code className="text-slate-300 break-all">{action.payloadSnippet}</code>
          </div>
        )}

        {/* Guardian Interception Banner */}
        <div className="my-4 p-4 rounded-lg bg-gradient-to-r from-cyan-950/40 via-cyan-900/20 to-transparent border-l-4 border-cyan-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center text-cyan-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm tracking-wider text-white">
                🛡 GUARDIAN INTERCEPTED ACTION
              </h3>
              <p className="text-xs font-mono text-cyan-300/80">
                Cognitive evaluation in progress. Execution paused pending policy verdict.
              </p>
            </div>
          </div>

          {evaluation && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  RISK SCORE
                </span>
                <span
                  className={`font-mono font-extrabold text-lg ${
                    evaluation.riskLevel === 'HIGH' || evaluation.riskLevel === 'CRITICAL'
                      ? 'text-rose-400'
                      : evaluation.riskLevel === 'MEDIUM'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {evaluation.riskScore} / 100
                </span>
              </div>
              <div
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold tracking-wider uppercase border ${
                  evaluation.riskLevel === 'HIGH' || evaluation.riskLevel === 'CRITICAL'
                    ? 'bg-rose-950/60 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                    : evaluation.riskLevel === 'MEDIUM'
                    ? 'bg-amber-950/60 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                    : 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                }`}
              >
                {evaluation.riskLevel}
              </div>
            </div>
          )}
        </div>

        {/* GUARDIAN ANALYSIS STAGES */}
        <div className="my-5">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            GUARDIAN ANALYSIS BREAKDOWN
          </div>

          {evaluation ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              {/* Data Sensitivity */}
              <div className="p-3.5 rounded-lg bg-[#080b11] border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    DATA SENSITIVITY
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      evaluation.dataSensitivity.status === 'critical'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                        : evaluation.dataSensitivity.status === 'warning'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                    }`}
                  >
                    {evaluation.dataSensitivity.label}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">{evaluation.dataSensitivity.detail}</p>
              </div>

              {/* Destination */}
              <div className="p-3.5 rounded-lg bg-[#080b11] border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    DESTINATION
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      evaluation.destinationCheck.status === 'critical'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                        : evaluation.destinationCheck.status === 'warning'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                    }`}
                  >
                    {evaluation.destinationCheck.label}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">{evaluation.destinationCheck.detail}</p>
              </div>

              {/* Authorization */}
              <div className="p-3.5 rounded-lg bg-[#080b11] border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    AUTHORIZATION
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      evaluation.authorization.status === 'missing'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                        : evaluation.authorization.status === 'elevated'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                    }`}
                  >
                    {evaluation.authorization.label}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">{evaluation.authorization.detail}</p>
              </div>

              {/* Capability */}
              <div className="p-3.5 rounded-lg bg-[#080b11] border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    CAPABILITY
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      evaluation.capabilityCheck.status === 'prohibited'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                        : evaluation.capabilityCheck.status === 'restricted'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                    }`}
                  >
                    {evaluation.capabilityCheck.label}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">{evaluation.capabilityCheck.detail}</p>
              </div>

              {/* Deterministic Policy */}
              <div className="p-3.5 rounded-lg bg-[#080b11] border border-slate-800 md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    DETERMINISTIC POLICY
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${
                      evaluation.deterministicPolicy.status === 'BLOCK'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/60'
                        : evaluation.deterministicPolicy.status === 'FLAG'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/60'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/60'
                    }`}
                  >
                    {evaluation.deterministicPolicy.status === 'BLOCK' ? '✕ BLOCK' : evaluation.deterministicPolicy.status === 'FLAG' ? '⚠ REVIEW' : '✓ ALLOW'} : {evaluation.deterministicPolicy.ruleTriggered}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">{evaluation.deterministicPolicy.detail}</p>
              </div>

              {/* GEMINI REASONING */}
              <div className="p-4 rounded-lg bg-cyan-950/20 border border-cyan-500/40 md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase">
                    <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
                    GEMINI COGNITIVE REASONING
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      evaluation.geminiReasoning.serviceStatus === 'ONLINE'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'bg-amber-950 text-amber-300 border border-amber-700'
                    }`}
                  >
                    STATUS: {evaluation.geminiReasoning.serviceStatus}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block font-semibold">AGENT INTENT ANALYSIS:</span>
                    <p className="text-slate-200 leading-relaxed font-mono">{evaluation.geminiReasoning.intent}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block font-semibold">CONTEXT & RISK EVALUATION:</span>
                    <p className="text-slate-300 leading-relaxed">{evaluation.geminiReasoning.contextEvaluation}</p>
                  </div>
                  <div className="pt-1 border-t border-cyan-900/40">
                    <span className="text-cyan-400 text-[11px] block font-semibold">POLICY VERDICT JUSTIFICATION:</span>
                    <p className="text-cyan-100 font-medium leading-relaxed">{evaluation.geminiReasoning.justification}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-lg bg-[#080b11] border border-slate-800 text-center font-mono text-xs text-cyan-300 animate-pulse">
              Analyzing intent, capability constraints, and context with Gemini engine...
            </div>
          )}
        </div>

        {/* ========================================================
            FINAL DECISION BANNER (VISUALLY DOMINANT)
        ======================================================== */}
        {evaluation && (
          <div className="mt-6">
            {/* For BLOCK */}
            {evaluation.decision === 'BLOCK' && (
              <div className="rounded-xl bg-gradient-to-b from-rose-950/80 to-rose-950/40 border-2 border-rose-500 p-6 text-center shadow-[0_0_40px_rgba(244,63,94,0.35)]">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/50 mb-3">
                  <ShieldX className="w-7 h-7" />
                </div>
                <h3 className="font-display font-extrabold text-xl md:text-2xl tracking-widest text-rose-300 mb-1">
                  ACTION BLOCKED
                </h3>
                <div className="my-2 inline-flex items-center gap-3 px-4 py-1 rounded-full bg-rose-900/60 border border-rose-500 text-rose-200 font-mono text-sm font-bold">
                  <span>RISK SCORE: {evaluation.riskScore} / 100</span>
                  <span>•</span>
                  <span>{evaluation.riskLevel} SEVERITY</span>
                </div>
                <p className="font-mono text-sm tracking-wide text-rose-200 font-bold mt-2">
                  ╔════════════════════════════════════════╗<br />
                  ║ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;EXECUTION PREVENTED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║<br />
                  ╚════════════════════════════════════════╝
                </p>
                <p className="text-xs font-mono text-rose-300/80 mt-2">
                  Autonomous sandbox lock retained. Action transmission terminated at Guardian boundary.
                </p>
              </div>
            )}

            {/* For REVIEW */}
            {evaluation.decision === 'REVIEW' && (
              <div className="rounded-xl bg-gradient-to-b from-amber-950/80 to-amber-950/40 border-2 border-amber-500 p-6 text-center shadow-[0_0_40px_rgba(251,191,36,0.35)]">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/50 mb-3">
                  <AlertTriangle className="w-7 h-7 animate-bounce" />
                </div>
                <h3 className="font-display font-extrabold text-xl md:text-2xl tracking-widest text-amber-300 mb-1">
                  ACTION PAUSED
                </h3>
                <div className="my-2 inline-flex items-center gap-3 px-4 py-1 rounded-full bg-amber-900/60 border border-amber-500 text-amber-200 font-mono text-sm font-bold">
                  <span>RISK SCORE: {evaluation.riskScore} / 100</span>
                  <span>•</span>
                  <span>HUMAN APPROVAL REQUIRED</span>
                </div>
                <p className="text-xs font-mono text-amber-200/90 mt-2 max-w-lg mx-auto">
                  Outbound boundary crossing or unverified destination detected. The agent cannot proceed without manual operator sign-off.
                </p>

                {/* Operator Review Controls */}
                <div className="mt-5 flex items-center justify-center gap-4">
                  <button
                    id="human-approve-btn"
                    onClick={() => onHumanDecision('APPROVE')}
                    className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-mono font-extrabold text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>APPROVE EXECUTION</span>
                  </button>
                  <button
                    id="human-block-btn"
                    onClick={() => onHumanDecision('BLOCK')}
                    className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono font-extrabold text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(244,63,94,0.4)] cursor-pointer"
                  >
                    <UserX className="w-4 h-4" />
                    <span>BLOCK ACTION</span>
                  </button>
                </div>
              </div>
            )}

            {/* For ALLOW */}
            {evaluation.decision === 'ALLOW' && (
              <div className="rounded-xl bg-gradient-to-b from-emerald-950/80 to-emerald-950/40 border-2 border-emerald-500 p-6 text-center shadow-[0_0_40px_rgba(16,185,129,0.35)]">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 mb-3">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="font-display font-extrabold text-xl md:text-2xl tracking-widest text-emerald-300 mb-1">
                  ACTION APPROVED
                </h3>
                <div className="my-2 inline-flex items-center gap-3 px-4 py-1 rounded-full bg-emerald-900/60 border border-emerald-500 text-emerald-200 font-mono text-sm font-bold">
                  <span>RISK SCORE: {evaluation.riskScore} / 100</span>
                  <span>•</span>
                  <span>LOW RISK ENCLAVE OPERATION</span>
                </div>
                <p className="font-mono text-sm tracking-wide text-emerald-300 font-bold mt-2">
                  {evaluation.executionStatus === 'Executed' ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ✓ EXECUTION COMPLETED
                    </span>
                  ) : (
                    'EXECUTING IN ISOLATED SANDBOX...'
                  )}
                </p>
                <p className="text-xs font-mono text-emerald-400/80 mt-2">
                  Action verified compliant with capability envelope. Tool dispatched.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
