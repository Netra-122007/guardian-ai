import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, ShieldX, Clock, Filter, Search, Terminal, ArrowUpDown } from 'lucide-react';
import type { AuditEvent } from '../types';

interface LiveActivityStreamProps {
  events: AuditEvent[];
  onSelectEvent: (event: AuditEvent) => void;
}

export const LiveActivityStream: React.FC<LiveActivityStreamProps> = ({
  events,
  onSelectEvent,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ALLOW' | 'REVIEW' | 'BLOCK'>('ALL');
  const [search, setSearch] = useState('');

  const filteredEvents = events.filter((ev) => {
    if (filter !== 'ALL' && ev.decision !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        ev.action.toLowerCase().includes(q) ||
        ev.tool.toLowerCase().includes(q) ||
        ev.target.toLowerCase().includes(q) ||
        ev.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div
      id="live-activity-stream"
      className="bg-[#0c1018] rounded-xl border border-cyan-900/50 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.5)] relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm tracking-wider text-white uppercase flex items-center gap-2">
              SOC SECURITY AUDIT STREAM
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                LIVE CAPTURE
              </span>
            </h3>
            <p className="text-[11px] font-mono text-cyan-400/80">
              IMMUTABLE REAL-TIME SECURITY INVESTIGATION TIMELINE
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail..."
              className="bg-[#07090f] border border-slate-800 focus:border-cyan-500 rounded text-xs font-mono text-slate-200 pl-8 pr-3 py-1.5 focus:outline-none w-36 sm:w-44"
            />
          </div>

          {/* Decision Filter Chips */}
          <div className="flex items-center rounded-md bg-[#080b11] border border-slate-800 p-0.5 text-xs font-mono">
            {(['ALL', 'ALLOW', 'REVIEW', 'BLOCK'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  filter === f
                    ? f === 'BLOCK'
                      ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                      : f === 'REVIEW'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : f === 'ALLOW'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Event Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-cyan-950/80 text-[10px] uppercase text-slate-500 tracking-wider">
              <th className="py-2 px-3">TIMESTAMP</th>
              <th className="py-2 px-3">AGENT</th>
              <th className="py-2 px-3">TOOL.ACTION</th>
              <th className="py-2 px-3">TARGET</th>
              <th className="py-2 px-3 text-center">RISK</th>
              <th className="py-2 px-3 text-center">DECISION</th>
              <th className="py-2 px-3">EXECUTION</th>
              <th className="py-2 px-3">POLICY REASON</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/80">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500 font-mono text-xs">
                  No security audit events recorded matching current filters.
                </td>
              </tr>
            ) : (
              filteredEvents.map((ev) => (
                <tr
                  key={ev.id}
                  onClick={() => onSelectEvent(ev)}
                  className="hover:bg-cyan-950/20 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                    {ev.timestamp}
                  </td>
                  <td className="py-2.5 px-3 text-slate-200 font-semibold whitespace-nowrap">
                    {ev.agent}
                  </td>
                  <td className="py-2.5 px-3 text-cyan-300 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                      {ev.tool}.{ev.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 max-w-[140px] truncate" title={ev.target}>
                    {ev.target}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ev.riskLevel === 'HIGH' || ev.riskLevel === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : ev.riskLevel === 'MEDIUM'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {ev.riskScore} ({ev.riskLevel})
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        ev.decision === 'BLOCK'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                          : ev.decision === 'REVIEW'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                      }`}
                    >
                      {ev.decision}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`text-[11px] font-semibold ${
                        ev.execution === 'Prevented'
                          ? 'text-rose-400'
                          : ev.execution === 'Paused'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {ev.execution === 'Prevented' ? '✕ Prevented' : ev.execution === 'Paused' ? '⏸ Paused' : '✓ Executed'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 max-w-[200px] truncate text-[11px]" title={ev.reason}>
                    {ev.reason}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
