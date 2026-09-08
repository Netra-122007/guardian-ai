import React, { useState } from 'react';
import { AIGuardianLogo } from '../AIGuardianLogo';
import { ShieldCheck, ArrowRight, Lock, Mail, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface SignUpPageProps {
  onSuccess: (email: string) => void;
  onNavigateLogin: () => void;
  onNavigateHome: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onSuccess,
  onNavigateLogin,
  onNavigateHome,
}) => {
  const [name, setName] = useState('SecOps Lead');
  const [email, setEmail] = useState('lead@aiguardian.sec');
  const [password, setPassword] = useState('GuardianSec2026!');
  const [confirmPassword, setConfirmPassword] = useState('GuardianSec2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name or operator alias');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid operator email address');
      return;
    }
    if (password.length < 6) {
      setError('Workspace key must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Workspace passwords do not match');
      return;
    }
    setError(null);
    onSuccess(email.trim());
  };

  const handleSocialSignUp = (provider: 'Google' | 'GitHub') => {
    onSuccess(`${provider.toLowerCase()}-new@aiguardian.sec`);
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-slate-200 flex flex-col justify-center relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient background light */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* Top Bar with back link */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </button>
      </div>

      <div className="max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 my-auto relative z-10">
        <div className="rounded-2xl bg-[#090e18]/90 border border-cyan-950/80 shadow-[0_0_50px_rgba(6,182,212,0.1)] backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* LEFT COLUMN: Brand Identity & Security Tiering */}
          <div className="lg:col-span-5 p-8 sm:p-10 bg-gradient-to-b from-[#0b1324] to-[#070b16] border-b lg:border-b-0 lg:border-r border-cyan-950/80 flex flex-col justify-between relative">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <AIGuardianLogo size="md" withGlow animated />
                <div>
                  <h1 className="font-display font-extrabold text-xl text-white tracking-wider">
                    AI GUARDIAN
                  </h1>
                  <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
                    DEPLOY RUNTIME GUARD
                  </span>
                </div>
              </div>

              <div className="space-y-4 my-8">
                <div className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-semibold">
                  Zero-Trust Onboarding
                </div>
                <h2 className="font-display font-bold text-2xl text-white leading-tight">
                  Supervise autonomous agents with deterministic boundaries and cognitive reasoning.
                </h2>
                <ul className="space-y-2.5 pt-3 text-xs font-mono text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>Pre-execution interception engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>Gemini 2.5 Flash semantic intent reasoning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>Interactive human-in-the-loop escalation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>Automated SOC 2 immutable audit logging</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-slate-800/80">
              <div className="p-3 rounded-xl bg-[#070d18] border border-cyan-950 flex items-center gap-3 text-xs font-mono">
                <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <div>
                  <div className="text-slate-200 font-bold">Isolated Sandbox Runtime</div>
                  <div className="text-slate-500 text-[10px]">No credentials leaked to third parties</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sign Up Form */}
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto">
              <div className="mb-6">
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mb-1">
                  Create your Guardian workspace.
                </h3>
                <p className="text-slate-400 text-sm">
                  Deploy an intelligent runtime guard for autonomous agents.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-mono">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase tracking-wider">
                    Operator Name / Alias
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#070b14] border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm font-mono text-white placeholder-slate-600 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase tracking-wider">
                    Work Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@company.com"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#070b14] border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm font-mono text-white placeholder-slate-600 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase tracking-wider">
                    Workspace Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2 rounded-lg bg-[#070b14] border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm font-mono text-white placeholder-slate-600 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#070b14] border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm font-mono text-white placeholder-slate-600 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Submit Primary Button */}
                <button
                  id="submit-signup-btn"
                  type="submit"
                  className="w-full py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 font-mono text-sm font-extrabold text-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 cursor-pointer mt-3"
                >
                  <span>CREATE ACCOUNT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Social Options */}
              <div className="relative my-5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <span className="relative px-3 bg-[#090e18] text-[11px] font-mono text-slate-500 uppercase tracking-widest">
                  OR CONTINUE WITH
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSocialSignUp('Google')}
                  className="py-2.5 px-3 rounded-lg border border-slate-800 hover:border-slate-700 bg-[#0c1220] hover:bg-[#101728] text-xs font-mono text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  onClick={() => handleSocialSignUp('GitHub')}
                  className="py-2.5 px-3 rounded-lg border border-slate-800 hover:border-slate-700 bg-[#0c1220] hover:bg-[#101728] text-xs font-mono text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              {/* Bottom switch to Sign In */}
              <div className="mt-6 text-center text-xs font-mono text-slate-400">
                Already have an account?{' '}
                <button
                  onClick={onNavigateLogin}
                  className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer underline underline-offset-4"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
