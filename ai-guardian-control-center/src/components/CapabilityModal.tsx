import React from 'react';
import { X, Shield, Lock, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';
import type { AgentCapabilityConfig } from '../types';

interface CapabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  capabilities: AgentCapabilityConfig[];
  onToggleCapability: (id: string) => void;
}

export const CapabilityModal: React.FC<CapabilityModalProps> = ({
  isOpen,
  onClose,
  capabilities,
  onToggleCapability,
}) => {
  if (!isOpen) return null;

  const deterministicRules = [
    {
      id: 'RULE-101',
      name: 'Local-Read-Permit',
      policy: 'ALLOW',
      description: 'Permits non-destructive file reads inside isolated project workspace perimeter.',
    },
    {
      id: 'RULE-205',
      name: 'Calendar-Schedule-Permit',
      policy: 'ALLOW',
      description: 'Permits scheduling internal team meetings and calendar synchronization.',
    },
    {
      id: 'RULE-402',
      name: 'External-Data-Egress-Review',
      policy: 'REVIEW',
      description: 'Intercepts outbound email transmissions to external destinations. Requires human approval.',
    },
    {
      id: 'RULE-904',
      name: 'FERPA-PII-Exfiltration-Block',
      policy: 'BLOCK',
      description: 'Immediate block on unauthorized export of student records, PII, SSN, or confidential dumps.',
    },
    {
      id: 'RULE-999',
      name: 'Immutable-Audit-Tamper-Block',
      policy: 'BLOCK',
      description: 'Strict immutable prevention of log purge, deletion, or modification of production audit tables.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#0c1018] rounded-xl border-2 border-cyan-500/50 p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] relative font-mono text-xs max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-cyan-950">
          <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm tracking-wider text-white uppercase">
              AGENT CAPABILITY & DETERMINISTIC POLICY MATRIX
            </h3>
            <p className="text-[11px] text-cyan-400/80">
              WORKER AGENT #01 AUTHORIZATION ENVELOPE
            </p>
          </div>
        </div>

        {/* Capabilities Toggle Matrix */}
        <div className="my-4">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">
            CONFIGURED CAPABILITY PERMISSIONS
          </div>
          <div className="space-y-2">
            {capabilities.map((cap) => (
              <div
                key={cap.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#080b11] border border-slate-800"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-100 font-bold">{cap.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 uppercase">
                      {cap.tool}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Prohibited actions: <span className="text-rose-400">{cap.prohibitedActions.join(', ') || 'None'}</span>
                  </p>
                </div>

                <button
                  onClick={() => onToggleCapability(cap.id)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer border ${
                    cap.enabled
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}
                >
                  {cap.enabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Deterministic Security Rules */}
        <div className="my-4">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">
            DETERMINISTIC SECURITY RULES ENFORCED BY GUARDIAN
          </div>
          <div className="space-y-2">
            {deterministicRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3 rounded-lg bg-[#080b11] border border-slate-800 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-300 font-bold">{rule.id}</span>
                    <span className="text-slate-200">{rule.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{rule.description}</p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase whitespace-nowrap ${
                    rule.policy === 'BLOCK'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : rule.policy === 'REVIEW'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {rule.policy}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
