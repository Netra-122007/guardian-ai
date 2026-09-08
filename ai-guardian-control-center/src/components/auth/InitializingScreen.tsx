import React, { useEffect, useState } from 'react';
import { AIGuardianLogo } from '../AIGuardianLogo';
import { ShieldCheck, Cpu, Lock, CheckCircle2 } from 'lucide-react';

interface InitializingScreenProps {
  onComplete: () => void;
  userEmail?: string;
}

export const InitializingScreen: React.FC<InitializingScreenProps> = ({
  onComplete,
  userEmail = 'operator@aiguardian.sec',
}) => {
  const [step, setStep] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('Initializing Guardian...');

  useEffect(() => {
    // Step 0: Initializing Guardian...
    const t1 = setTimeout(() => {
      setStep(1);
      setStatusMessage('Validating capability sandbox boundaries...');
    }, 500);

    // Step 1: Connecting to Gemini
    const t2 = setTimeout(() => {
      setStep(2);
      setStatusMessage('Connecting to Gemini 2.5 Flash reasoning core...');
    }, 1000);

    // Step 2: Guardian Online
    const t3 = setTimeout(() => {
      setStep(3);
      setStatusMessage('Guardian Online • Zero-Trust Active');
    }, 1500);

    // Step 3: Enter Control Center
    const t4 = setTimeout(() => {
      onComplete();
    }, 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#07090d] flex flex-col items-center justify-center p-6 z-50 text-slate-200">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Glowing Brand Mark */}
        <div className="relative mb-8">
          <AIGuardianLogo size="xl" withGlow animated />
          <div className="absolute -inset-4 rounded-full border border-cyan-500/20 animate-ping pointer-events-none" />
        </div>

        {/* Product Title */}
        <h2 className="font-display font-black text-2xl tracking-widest text-white uppercase mb-2">
          AI GUARDIAN
        </h2>
        <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-6">
          AI THAT GUARDS AI
        </div>

        {/* Current Status Message */}
        <div className="w-full bg-[#0c1322] border border-cyan-900/60 rounded-xl p-4 shadow-xl mb-4 font-mono">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-white mb-2">
            {step < 3 ? (
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span className={step === 3 ? 'text-emerald-300 font-extrabold' : 'text-cyan-200'}>
              {statusMessage}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                step === 3 ? 'bg-emerald-400' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}
              style={{ width: `${Math.min(100, (step + 1) * 28)}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
            <span>Operator: {userEmail}</span>
            <span className="text-cyan-400 font-semibold">SOC 2 TYPE II RUNTIME</span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-500">
          Enforcing Observe • Reason • Decide • Enforce
        </div>
      </div>
    </div>
  );
};
