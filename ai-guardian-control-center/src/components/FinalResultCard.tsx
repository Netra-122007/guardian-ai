import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  ShieldX,
  UserCheck,
  UserX,
  CheckCircle2,
  Clock,
  Cpu,
  Target,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import type { ProposedAction, GuardianEvaluation, DecisionType } from '../types';

interface FinalResultCardProps {
  evaluation: GuardianEvaluation | null;
  action: ProposedAction | null;
  errorMessage?: string | null;
  onHumanDecision: (decision: 'APPROVE' | 'BLOCK') => void;
  commandText?: string | null;
}

export const FinalResultCard: React.FC<FinalResultCardProps> = ({
  evaluation,
  action,
  errorMessage,
  onHumanDecision,
  commandText,
}) => {
  // If backend error was encountered
  if (errorMessage) {
    return (
      <div
        id="final-result-section"
        className="w-full my-6 bg-[#0c1018] rounded-xl border-2 border-amber-500/70 p-6 shadow-[0_0_40px_rgba(245,158,11,0.25)] font-mono"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-amber-900/60">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg text-amber-300 tracking-wider">
              ⚠ GUARDIAN SERVICE UNAVAILABLE
            </h3>
            <p className="text-xs text-amber-200/90 mt-0.5">
              The Guardian could not reach its reasoning service. The action was not executed.
            </p>
          </div>
        </div>

        <div className="my-4 p-4 rounded-lg bg-[#07090e] border border-amber-950 text-xs text-slate-300">
          <div className="text-[10px] uppercase text-slate-500 mb-1">SYSTEM NOTICE</div>
          <p>{errorMessage}</p>
          <p className="mt-2 text-amber-300 font-semibold">
            FAIL-SAFE PROTOCOL ENGAGED: Action held safely unexecuted in sandbox boundary.
          </p>
        </div>
      </div>
    );
  }

  if (!evaluation || !action) return null;

  const decision = evaluation.decision;
  const isAllow = decision === 'ALLOW';
  const isReview = decision === 'REVIEW';
  const isBlock = decision === 'BLOCK';

  return (
    <div
      id="final-result-section"
      className={`w-full my-6 rounded-xl border-2 p-6 transition-all font-mono ${
        isAllow
          ? 'bg-gradient-to-b from-[#061412] to-[#040a09] border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.3)]'
          : isReview
          ? 'bg-gradient-to-b from-[#181206] to-[#0d0903] border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.3)]'
          : 'bg-gradient-to-b from-[#18080c] to-[#0d0406] border-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.35)]'
      }`}
    >
      {/* Visual Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
              isAllow
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : isReview
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-rose-500/20 border-rose-400 text-rose-300'
            }`}
          >
            {isAllow ? (
              <ShieldCheck className="w-7 h-7" />
            ) : isReview ? (
              <AlertTriangle className="w-7 h-7 animate-bounce" />
            ) : (
              <ShieldX className="w-7 h-7" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-widest ${
                  isAllow ? 'text-emerald-400' : isReview ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                FINAL GUARDIAN POLICY VERDICT
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  isAllow
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : isReview
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : 'bg-rose-950 text-rose-300 border-rose-700'
                }`}
              >
                {decision}
              </span>
            </div>

            <h3 className="font-display font-extrabold text-xl sm:text-2xl tracking-wider text-white mt-0.5">
              {isAllow && '✓ ACTION ALLOWED'}
              {isReview && '⚠ HUMAN REVIEW REQUIRED'}
              {isBlock && '✕ ACTION BLOCKED'}
            </h3>

            {commandText && (
              <p className="text-xs text-slate-400 mt-1 truncate max-w-xl">
                Directive: <span className="text-slate-200 font-semibold">"{commandText}"</span>
              </p>
            )}
          </div>
        </div>

        {/* Risk and Execution Status Badges */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">RISK SCORE</span>
            <span
              className={`font-extrabold text-lg sm:text-xl ${
                isAllow ? 'text-emerald-400' : isReview ? 'text-amber-400' : 'text-rose-400'
              }`}
            >
              {evaluation.riskScore} / 100
            </span>
          </div>

          <div
            className={`px-3 py-1.5 rounded-lg border text-xs font-extrabold uppercase ${
              isAllow
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                : isReview
                ? 'bg-amber-950 border-amber-500 text-amber-300'
                : 'bg-rose-950 border-rose-500 text-rose-300'
            }`}
          >
            <div>{evaluation.riskLevel} RISK</div>
            <div className="text-[10px] font-medium text-slate-300">
              STATUS: {evaluation.executionStatus.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Action Attributes Grid */}
      <div className="my-5 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#07090e] p-3.5 rounded-lg border border-slate-800 text-xs">
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">TOOL</span>
          <span className="text-cyan-300 font-bold uppercase">{action.tool}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">ACTION</span>
          <span className="text-white font-bold uppercase">{action.action}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">TARGET</span>
          <span className="text-amber-300 font-bold truncate block" title={action.target}>
            {action.target}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">DESTINATION</span>
          <span className="text-slate-200 font-bold truncate block" title={action.destination}>
            {action.destination}
          </span>
        </div>
      </div>

      {/* Policy and Gemini Reasoning Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Guardian Deterministic Policy Reasons */}
        <div className="p-4 rounded-lg bg-[#070a12] border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase mb-2">
            <ShieldAlert className="w-4 h-4" />
            GUARDIAN REASONS &amp; POLICY
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">RULE TRIGGERED:</span>
              <span className="text-white font-bold">{evaluation.deterministicPolicy.ruleTriggered}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">POLICY VERDICT:</span>
              <p className="text-slate-200">{evaluation.deterministicPolicy.detail}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">DATA SENSITIVITY:</span>
              <span className="text-amber-300 font-semibold">{evaluation.dataSensitivity.label}</span>
            </div>
          </div>
        </div>

        {/* Gemini Cognitive Reasoning */}
        <div className="p-4 rounded-lg bg-[#070a12] border border-cyan-900/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase">
              <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
              GEMINI INTENT &amp; CONTEXT REASONING
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              {evaluation.geminiReasoning.serviceStatus}
            </span>
          </div>

          <div className="space-y-1.5 text-slate-300">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">AGENT INTENT:</span>
              <p className="text-slate-200">{evaluation.geminiReasoning.intent}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">SUPERVISOR JUSTIFICATION:</span>
              <p className="text-cyan-100 font-medium">{evaluation.geminiReasoning.justification}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Human Operator Action Controls (For REVIEW) */}
      {isReview && (
        <div className="mt-5 p-4 rounded-lg bg-amber-950/40 border border-amber-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-sm text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              OPERATOR AUTHORIZATION REQUIRED
            </div>
            <p className="text-xs text-amber-200/80 mt-0.5">
              Action paused pending manual clearance. Authorize or terminate tool execution below.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="result-human-approve-btn"
              onClick={() => onHumanDecision('APPROVE')}
              className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>APPROVE</span>
            </button>
            <button
              id="result-human-block-btn"
              onClick={() => onHumanDecision('BLOCK')}
              className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)] cursor-pointer"
            >
              <UserX className="w-4 h-4" />
              <span>BLOCK</span>
            </button>
          </div>
        </div>
      )}

      {/* Allow completion status */}
      {isAllow && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Action was authorized and execution completed successfully in the isolated sandbox.</span>
        </div>
      )}

      {/* Block prevention status */}
      {isBlock && (
        <div className="mt-4 p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 flex items-center gap-2 text-xs text-rose-300">
          <ShieldX className="w-4 h-4 text-rose-400" />
          <span>Execution was strictly prevented by Guardian boundary policy. System state remains untouched.</span>
        </div>
      )}
    </div>
  );
};
