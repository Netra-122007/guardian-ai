import React from 'react';
import { X, ShieldAlert, ShieldCheck, ShieldX, Terminal, Copy, Check } from 'lucide-react';
import type { AuditEvent } from '../types';

interface AuditEventModalProps {
  event: AuditEvent | null;
  onClose: () => void;
}

export const AuditEventModal: React.FC<AuditEventModalProps> = ({ event, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!event) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(`0x7f${event.id}${Date.now().toString(16)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#0c1018] rounded-xl border-2 border-cyan-500/50 p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] relative font-mono text-xs">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-cyan-950">
          <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm tracking-wider text-white uppercase">
              SECURITY AUDIT FORENSIC RECORD
            </h3>
            <p className="text-[11px] text-cyan-400/80">
              AUDIT ID: {event.id} // TIMESTAMP: {event.timestamp}
            </p>
          </div>
        </div>

        {/* Forensic Metadata Grid */}
        <div className="my-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#080b11] p-3 rounded-lg border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">AGENT</span>
            <span className="text-white font-bold">{event.agent}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">TOOL ACTION</span>
            <span className="text-cyan-300 font-bold">{event.tool}.{event.action}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">RISK SCORE</span>
            <span className={`font-bold ${
              event.riskScore >= 80 ? 'text-rose-400' : event.riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {event.riskScore}/100 ({event.riskLevel})
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">DECISION</span>
            <span className={`font-bold uppercase ${
              event.decision === 'BLOCK' ? 'text-rose-400' : event.decision === 'REVIEW' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {event.decision}
            </span>
          </div>
        </div>

        {/* Target & Destination */}
        <div className="space-y-2 mb-4 bg-[#080b11] p-3 rounded-lg border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">TARGET RESOURCE:</span>
            <span className="text-amber-200">{event.target}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">DESTINATION ENDPOINT:</span>
            <span className="text-slate-300">{event.destination}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">EXECUTION OUTCOME:</span>
            <span className={`font-bold ${
              event.execution === 'Prevented' ? 'text-rose-400' : event.execution === 'Paused' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {event.execution}
            </span>
          </div>
        </div>

        {/* Reason / Policy Trace */}
        <div className="mb-4 bg-cyan-950/20 border border-cyan-500/30 p-3 rounded-lg">
          <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">
            EVALUATED POLICY & REASONING SUMMARY
          </span>
          <p className="text-slate-200 leading-relaxed">{event.reason}</p>
        </div>

        {/* Cryptographic Hash */}
        <div className="flex items-center justify-between p-2 rounded bg-black/60 border border-slate-800 text-[11px] text-slate-400">
          <span className="truncate">SIG: 0x7f{event.id}c49e2b810f63a</span>
          <button
            onClick={handleCopyHash}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 ml-2 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED' : 'COPY HASH'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
