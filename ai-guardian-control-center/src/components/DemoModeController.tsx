import React from 'react';
import { Play, Pause, SkipForward, Square, Radio, Sparkles } from 'lucide-react';

interface DemoModeControllerProps {
  currentScenarioIndex: number;
  totalScenarios: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onNextScenario: () => void;
  onStopDemo: () => void;
  scenarioTitle: string;
  scenarioNarration: string;
}

export const DemoModeController: React.FC<DemoModeControllerProps> = ({
  currentScenarioIndex,
  totalScenarios,
  isPaused,
  onTogglePause,
  onNextScenario,
  onStopDemo,
  scenarioTitle,
  scenarioNarration,
}) => {
  return (
    <div
      id="demo-mode-controller"
      className="my-4 bg-gradient-to-r from-cyan-950/80 via-[#0d1424] to-cyan-950/80 border-2 border-cyan-400 rounded-xl p-4 shadow-[0_0_30px_rgba(6,182,212,0.3)] animate-cyber-pulse"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Scenario Progress & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <Radio className="w-5 h-5 animate-pulse text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
                CINEMATIC SOC DEMO: SCENARIO {currentScenarioIndex + 1} OF {totalScenarios}
              </span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <h4 className="font-display font-bold text-sm text-white tracking-wide">
              {scenarioTitle}
            </h4>
            <p className="text-xs font-mono text-cyan-200/80 mt-0.5">
              {scenarioNarration}
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto font-mono text-xs">
          <button
            onClick={onTogglePause}
            className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>

          <button
            onClick={onNextScenario}
            disabled={currentScenarioIndex >= totalScenarios - 1}
            className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>NEXT</span>
          </button>

          <button
            onClick={onStopDemo}
            className="px-3 py-1.5 rounded-lg bg-rose-950 border border-rose-500/50 hover:border-rose-400 text-rose-200 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>EXIT DEMO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
