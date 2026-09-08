import React, { useState, useEffect } from 'react';
import { AIGuardianLogo } from '../AIGuardianLogo';
import { Bot, Terminal, ShieldAlert, CheckCircle2, AlertTriangle, XCircle, ArrowRight, Play, RefreshCw, Zap } from 'lucide-react';
import { TiltGlowCard } from '../common/TiltGlowCard';

interface ScenarioEvent {
  agentName: string;
  actionDetected: string;
  target: string;
  riskScore: number;
  reasoning: string;
  decision: 'ALLOW' | 'REVIEW' | 'BLOCK';
  execution: 'EXECUTED' | 'PAUSED' | 'PREVENTED';
  stepPhase: 'PROPOSED' | 'ANALYZING' | 'DECIDED';
}

const SCENARIOS: ScenarioEvent[] = [
  {
    agentName: 'WORKER AGENT #01',
    actionDetected: 'database.export(student_records)',
    target: 'db.production/students',
    riskScore: 94,
    reasoning: 'Bulk export of PII to unauthorized destination violates Data Privacy Boundary.',
    decision: 'BLOCK',
    execution: 'PREVENTED',
    stepPhase: 'DECIDED',
  },
  {
    agentName: 'WORKER AGENT #03',
    actionDetected: 'payment.refund(order_id, $4,850)',
    target: 'stripe.api/refunds',
    riskScore: 68,
    reasoning: 'Transaction exceeds automatic autonomous threshold of $500. Operator confirmation required.',
    decision: 'REVIEW',
    execution: 'PAUSED',
    stepPhase: 'DECIDED',
  },
  {
    agentName: 'WORKER AGENT #02',
    actionDetected: 'code.format_and_lint(src/App.tsx)',
    target: 'local.repo/src/App.tsx',
    riskScore: 6,
    reasoning: 'Non-destructive static analysis within designated repository bounds. No network egress.',
    decision: 'ALLOW',
    execution: 'EXECUTED',
    stepPhase: 'DECIDED',
  },
];

export const HeroPipelineVisual: React.FC = () => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [pulsePhase, setPulsePhase] = useState<'flow' | 'analyze' | 'verdict'>('verdict');
  const [isAutoCycling, setIsAutoCycling] = useState(true);

  const activeScenario = SCENARIOS[scenarioIndex];

  useEffect(() => {
    if (!isAutoCycling) return;

    const interval = setInterval(() => {
      // 1. Flow phase
      setPulsePhase('flow');
      const t1 = setTimeout(() => {
        // 2. Analyze phase
        setPulsePhase('analyze');
        const t2 = setTimeout(() => {
          // 3. Verdict phase
          setPulsePhase('verdict');
          const t3 = setTimeout(() => {
            setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
          }, 3200);
          return () => clearTimeout(t3);
        }, 1100);
        return () => clearTimeout(t2);
      }, 900);
      return () => clearTimeout(t1);
    }, 5500);

    return () => clearInterval(interval);
  }, [isAutoCycling, scenarioIndex]);

  const selectScenario = (idx: number) => {
    setIsAutoCycling(false);
    setScenarioIndex(idx);
    setPulsePhase('flow');
    setTimeout(() => {
      setPulsePhase('analyze');
      setTimeout(() => {
        setPulsePhase('verdict');
      }, 800);
    }, 700);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. Main Visual Pipeline Diagram: WORKER AI -> ACTION -> GUARDIAN -> DECISION -> TOOL */}
      <TiltGlowCard
        id="hero-pipeline-card"
        glowColor="cyan"
        enableTilt={true}
        maxTiltDeg={2.2}
        className="rounded-2xl bg-[#080d17]/90 border border-cyan-900/50 p-5 md:p-7 shadow-[0_0_50px_rgba(6,182,212,0.12)] backdrop-blur-xl"
      >
        {/* Subtle cyber background grid */}
        <div className="absolute inset-0 cyber-grid animate-grid-drift opacity-30 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        {/* Pipeline Title & Live Indicator */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-6 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-300 flex items-center gap-2">
              <span>REAL-TIME INTERCEPTION RUNTIME</span>
              <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                ACTIVE MONITOR
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="hero-toggle-autocycle-btn"
              onClick={() => setIsAutoCycling(!isAutoCycling)}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 flex items-center gap-1.5 cursor-pointer transition-all duration-200"
              title="Toggle automatic scenario preview"
            >
              <RefreshCw className={`w-3 h-3 ${isAutoCycling ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
              <span>{isAutoCycling ? 'Auto-Cycle ON' : 'Cycle Paused'}</span>
            </button>
          </div>
        </div>

        {/* The 5-stage architectural flow */}
        <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-3 md:gap-2 relative z-10 my-2">
          {/* Node 1: Worker AI */}
          <div className="flex flex-col items-center text-center p-3.5 rounded-xl bg-[#0d1424] border border-cyan-950/80 shadow-sm relative transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1">
            <div className="w-11 h-11 rounded-lg bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-2 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
              <Bot className="w-6 h-6" />
            </div>
            <span className="font-mono text-xs font-bold text-slate-200">WORKER AI</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Plans & Dispatches</span>
            <div className="mt-1.5 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] font-mono text-cyan-400">
              Autonomous
            </div>
          </div>

          {/* Connector 1: Data flowing toward Guardian */}
          <div className="hidden lg:flex flex-col items-center justify-center relative px-1">
            <div className="w-full h-1 bg-slate-800 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-800" />
              {/* Pulsing signal packet */}
              <div
                className={`absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-cyan-400 to-white rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.8)] ${
                  pulsePhase === 'flow'
                    ? 'left-[80%] opacity-100'
                    : 'left-[20%] opacity-40'
                }`}
              />
            </div>
            <span className="text-[9px] font-mono text-slate-400 mt-1 uppercase tracking-wider flex items-center gap-1">
              <span>Action Call</span>
              <ArrowRight className="w-2.5 h-2.5 text-cyan-400" />
            </span>
          </div>

          {/* Node 2: Central AI Guardian (Core) */}
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#091122] border-2 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.35)] relative group transition-all duration-300 hover:scale-[1.02]">
            <div className="relative mb-2">
              <AIGuardianLogo
                size="lg"
                withGlow
                animated={true}
                showScan={true}
                status={pulsePhase === 'verdict' ? activeScenario.decision : 'MONITORING'}
              />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#091122] animate-pulse" />
            </div>
            <span className="font-mono text-sm font-extrabold text-white tracking-wider flex items-center gap-1.5">
              AI GUARDIAN
            </span>
            <span className="text-[11px] text-cyan-300 font-medium">Interception Core</span>
            <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-[10px] font-mono text-cyan-300 flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>{pulsePhase === 'analyze' ? 'Reasoning Intent...' : 'Zero-Trust Gate'}</span>
            </div>
          </div>

          {/* Connector 2: Routing decision to policy verdict */}
          <div className="hidden lg:flex flex-col items-center justify-center relative px-1">
            <div className="w-full h-1 bg-slate-800 rounded-full relative overflow-hidden">
              <div
                className={`absolute top-0 bottom-0 w-8 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.8)] ${
                  activeScenario.decision === 'ALLOW'
                    ? 'bg-gradient-to-r from-transparent via-emerald-400 to-white'
                    : activeScenario.decision === 'REVIEW'
                    ? 'bg-gradient-to-r from-transparent via-amber-400 to-white'
                    : 'bg-gradient-to-r from-transparent via-rose-400 to-white'
                } ${pulsePhase === 'verdict' ? 'left-[80%] opacity-100' : 'left-[10%] opacity-30'}`}
              />
            </div>
            <span className="text-[9px] font-mono text-slate-400 mt-1 uppercase tracking-wider flex items-center gap-1">
              <span>Verdict</span>
              <ArrowRight className="w-2.5 h-2.5 text-cyan-400" />
            </span>
          </div>

          {/* Node 3: Decision & Execution */}
          <div className="flex flex-col items-center text-center p-3.5 rounded-xl bg-[#0d1424] border border-slate-800 relative transition-all duration-300 hover:border-slate-700 hover:-translate-y-1">
            <div className="flex items-center gap-1.5 mb-2">
              <span
                className={`w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                  activeScenario.decision === 'ALLOW'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500 ring-2 ring-emerald-500/40 scale-110 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'bg-slate-900 text-slate-600'
                }`}
              >
                ✓
              </span>
              <span
                className={`w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                  activeScenario.decision === 'REVIEW'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500 ring-2 ring-amber-500/40 scale-110 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'bg-slate-900 text-slate-600'
                }`}
              >
                ⚠
              </span>
              <span
                className={`w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                  activeScenario.decision === 'BLOCK'
                    ? 'bg-rose-950 text-rose-300 border border-rose-500 ring-2 ring-rose-500/40 scale-110 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                    : 'bg-slate-900 text-slate-600'
                }`}
              >
                ✕
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-slate-200">ALLOW / REVIEW / BLOCK</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Isolated Tool Sandbox</span>
            <div
              className={`mt-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all duration-300 ${
                activeScenario.decision === 'ALLOW'
                  ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : activeScenario.decision === 'REVIEW'
                  ? 'bg-amber-950/90 text-amber-400 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-rose-950/90 text-rose-400 border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
              }`}
            >
              {activeScenario.execution}
            </div>
          </div>
        </div>

        {/* Interactive Scenario Buttons */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 relative z-10">
          <span className="text-xs font-mono text-slate-400">Select live simulation scenario:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {SCENARIOS.map((s, idx) => (
              <button
                key={s.actionDetected}
                onClick={() => selectScenario(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer border flex items-center gap-1.5 ${
                  scenarioIndex === idx
                    ? s.decision === 'BLOCK'
                      ? 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-[0_0_14px_rgba(244,63,94,0.3)] font-bold'
                      : s.decision === 'REVIEW'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.3)] font-bold'
                      : 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-[0_0_14px_rgba(16,185,129,0.3)] font-bold'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 hover:-translate-y-0.5'
                }`}
              >
                {s.decision === 'BLOCK' && '✕ Dangerous Exfiltration'}
                {s.decision === 'REVIEW' && '⚠ High-Value Refund'}
                {s.decision === 'ALLOW' && '✓ Benign Code Format'}
              </button>
            ))}
          </div>
        </div>
      </TiltGlowCard>

      {/* 2. Hero Live Guardian Event Floating Card */}
      <TiltGlowCard
        id="hero-live-event-card"
        glowColor={
          activeScenario.decision === 'ALLOW'
            ? 'emerald'
            : activeScenario.decision === 'REVIEW'
            ? 'amber'
            : 'rose'
        }
        enableTilt={true}
        maxTiltDeg={2.0}
        className="rounded-xl bg-[#090e18]/95 border border-cyan-900/50 p-4 md:p-5 shadow-xl font-mono"
      >
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <h4 className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider">
              LIVE GUARDIAN TELEMETRY EVENT
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            LATENCY: 42ms
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Col 1: Agent & Action */}
          <div className="bg-[#0c1322] p-2.5 rounded-lg border border-slate-800/80 transition-colors hover:border-cyan-500/30">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Origin Agent</div>
            <div className="text-cyan-400 font-bold mt-0.5">{activeScenario.agentName}</div>
            <div className="text-[10px] text-slate-400 mt-2 font-semibold uppercase">Action Detected</div>
            <div className="text-slate-200 font-bold truncate mt-0.5" title={activeScenario.actionDetected}>
              {activeScenario.actionDetected}
            </div>
          </div>

          {/* Col 2: Target & Status */}
          <div className="bg-[#0c1322] p-2.5 rounded-lg border border-slate-800/80 transition-colors hover:border-cyan-500/30">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Target Resource</div>
            <div className="text-slate-300 truncate mt-0.5">{activeScenario.target}</div>
            <div className="text-[10px] text-slate-400 mt-2 font-semibold uppercase">Guardian Analysis</div>
            <div className="text-cyan-300 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Cognitive Interception Active</span>
            </div>
          </div>

          {/* Col 3: Risk Score */}
          <div className="bg-[#0c1322] p-2.5 rounded-lg border border-slate-800/80 flex flex-col justify-between transition-colors hover:border-cyan-500/30">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Evaluated Risk</div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span
                  className={`text-2xl font-black transition-colors duration-300 ${
                    activeScenario.riskScore > 75
                      ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                      : activeScenario.riskScore > 35
                      ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                      : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                  }`}
                >
                  {activeScenario.riskScore}
                </span>
                <span className="text-slate-500 text-xs">/ 100</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mt-2">
              <div
                className={`h-full transition-all duration-700 rounded-full ${
                  activeScenario.riskScore > 75
                    ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                    : activeScenario.riskScore > 35
                    ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                    : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                }`}
                style={{ width: `${activeScenario.riskScore}%` }}
              />
            </div>
          </div>

          {/* Col 4: Decision & Execution */}
          <div
            className={`p-2.5 rounded-lg border flex flex-col justify-between transition-all duration-300 ${
              activeScenario.decision === 'BLOCK'
                ? 'bg-rose-950/40 border-rose-500/50 pulse-block'
                : activeScenario.decision === 'REVIEW'
                ? 'bg-amber-950/40 border-amber-500/50 pulse-review'
                : 'bg-emerald-950/40 border-emerald-500/50 pulse-allow'
            }`}
          >
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Decision Verdict</div>
              <div
                className={`text-base font-black flex items-center gap-1.5 mt-0.5 ${
                  activeScenario.decision === 'BLOCK'
                    ? 'text-rose-400'
                    : activeScenario.decision === 'REVIEW'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {activeScenario.decision === 'BLOCK' && <span>✕ BLOCKED</span>}
                {activeScenario.decision === 'REVIEW' && <span>⚠ REVIEW REQUIRED</span>}
                {activeScenario.decision === 'ALLOW' && <span>✓ ALLOWED</span>}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold mt-1">Execution Status</div>
              <div className="text-white font-bold">{activeScenario.execution}</div>
            </div>
          </div>
        </div>

        {/* Forensic reasoning footer */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-start gap-2 text-[11px] text-slate-400">
          <span className="text-cyan-400 font-bold flex-shrink-0">GUARDIAN LOG:</span>
          <span className="text-slate-300 italic">{activeScenario.reasoning}</span>
        </div>
      </TiltGlowCard>
    </div>
  );
};
