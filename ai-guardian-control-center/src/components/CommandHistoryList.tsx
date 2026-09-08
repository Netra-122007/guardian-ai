import React from 'react';
import { History, ShieldCheck, AlertTriangle, ShieldX, Terminal, ArrowRight, Mic } from 'lucide-react';
import type { CommandRecord } from '../types';

interface CommandHistoryListProps {
  history: CommandRecord[];
  activeRecordId: string | null;
  onSelectRecord: (record: CommandRecord) => void;
}

export const CommandHistoryList: React.FC<CommandHistoryListProps> = ({
  history,
  activeRecordId,
  onSelectRecord,
}) => {
  if (history.length === 0) return null;

  return (
    <div
      id="command-history-section"
      className="my-5 bg-[#090d16] border border-slate-800 rounded-xl p-4 font-mono shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
            OPERATIONAL COMMAND AUDIT TRAIL ({history.length} EXECUTIONS)
          </h4>
        </div>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest">
          RECENT RUNS &bull; CLICK TO RECALL
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {history.map((rec) => {
          const isActive = rec.id === activeRecordId;
          const isAllow = rec.decision === 'ALLOW';
          const isReview = rec.decision === 'REVIEW';
          const isBlock = rec.decision === 'BLOCK';

          return (
            <button
              key={rec.id}
              onClick={() => onSelectRecord(rec)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden ${
                isActive
                  ? 'bg-[#101827] border-cyan-400 ring-1 ring-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'bg-[#060910] border-slate-800 hover:border-slate-700 hover:bg-[#0b101c]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400">
                    COMMAND {rec.commandNumber < 10 ? `0${rec.commandNumber}` : rec.commandNumber}
                  </span>
                  {rec.source === 'voice' && (
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[8px] flex items-center gap-0.5" title="Voice command input">
                      <Mic className="w-2.5 h-2.5" />
                      <span>VOICE</span>
                    </span>
                  )}
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-bold border flex items-center gap-1 ${
                    isAllow
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : isReview
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : isBlock
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {isAllow && <ShieldCheck className="w-2.5 h-2.5" />}
                  {isReview && <AlertTriangle className="w-2.5 h-2.5" />}
                  {isBlock && <ShieldX className="w-2.5 h-2.5" />}
                  <span>
                    {isAllow ? '✓ ALLOW' : isReview ? '⚠ REVIEW' : isBlock ? '✕ BLOCK' : rec.decision}
                  </span>
                </span>
              </div>

              <p className="text-xs text-slate-200 font-semibold truncate" title={rec.commandText}>
                "{rec.commandText}"
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                <span>Status: {rec.executionStatus}</span>
                <span className="text-cyan-400 flex items-center gap-0.5 text-[9px]">
                  <span>View Details</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
