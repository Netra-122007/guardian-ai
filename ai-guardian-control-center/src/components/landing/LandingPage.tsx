import React, { useState, useEffect } from 'react';
import { AIGuardianLogo } from '../AIGuardianLogo';
import { HeroPipelineVisual } from './HeroPipelineVisual';
import { ScrollProgress } from '../common/ScrollProgress';
import { ScrollReveal } from '../common/ScrollReveal';
import { TiltGlowCard } from '../common/TiltGlowCard';
import {
  Shield,
  Bot,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Cpu,
  Lock,
  ArrowRight,
  Eye,
  Sliders,
  History,
  Terminal,
  Zap,
  Layers,
  ChevronRight,
  Sparkles,
  Server,
  Activity,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onDirectDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onSignIn,
  onDirectDemo,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-slate-200 selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Scroll Progress Bar at the top of the viewport */}
      <ScrollProgress />

      {/* Background ambient lighting with drifting orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Slowly drifting radial gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent blur-3xl animate-ambient-drift" />
        <div className="absolute top-[35%] right-[-8%] w-[600px] h-[600px] bg-cyan-600/10 blur-3xl animate-ambient-drift-reverse" />
        <div className="absolute bottom-[20%] left-[-10%] w-[550px] h-[550px] bg-blue-700/10 blur-3xl animate-ambient-drift" />
        
        {/* Moving Cyber Grid Background */}
        <div className="absolute inset-0 cyber-grid animate-grid-drift opacity-25" />

        {/* Ambient floating constellation particles */}
        <div className="hidden lg:block absolute inset-0 opacity-40">
          <span className="absolute top-28 left-[15%] w-1 h-1 rounded-full bg-cyan-400 animate-ping" style={{ animationDuration: '4s' }} />
          <span className="absolute top-44 right-[20%] w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="absolute top-[60%] left-[8%] w-1 h-1 rounded-full bg-cyan-300 animate-pulse" />
          <span className="absolute top-[75%] right-[12%] w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" style={{ animationDuration: '6s' }} />
        </div>
      </div>

      {/* TOP NAVIGATION */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 px-4 lg:px-8 ${
          isScrolled
            ? 'py-2.5 bg-[#07090d]/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_4px_25px_rgba(0,0,0,0.7)]'
            : 'py-4 bg-[#07090d]/80 backdrop-blur-md border-b border-slate-800/80'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Brand Mark */}
          <div
            id="nav-brand-logo"
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <AIGuardianLogo size="md" withGlow animated />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-lg tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                  AI GUARDIAN
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 font-mono">
                  SECURITY RUNTIME
                </span>
              </div>
              <p className="text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase hidden sm:block">
                AI THAT GUARDS AI
              </p>
            </div>
          </div>

          {/* Center Nav Links with Animated Underline Micro-interaction */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-mono text-slate-300">
            <button
              onClick={() => scrollToSection('problem-section')}
              className="nav-link-animated hover:text-cyan-300 transition-colors cursor-pointer py-1"
            >
              Problem
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="nav-link-animated hover:text-cyan-300 transition-colors cursor-pointer py-1"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('three-decisions')}
              className="nav-link-animated hover:text-cyan-300 transition-colors cursor-pointer py-1"
            >
              Decisions
            </button>
            <button
              onClick={() => scrollToSection('security-promise')}
              className="nav-link-animated hover:text-cyan-300 transition-colors cursor-pointer py-1"
            >
              Security
            </button>
            <button
              onClick={onDirectDemo}
              className="nav-link-animated text-cyan-400 hover:text-cyan-200 transition-colors flex items-center gap-1 cursor-pointer py-1 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Demo</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              id="nav-signin-btn"
              onClick={onSignIn}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 bg-slate-900/70 hover:bg-slate-800/80 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
            >
              Sign In
            </button>
            <button
              id="nav-getstarted-btn"
              onClick={onGetStarted}
              className="btn-glow-sweep px-4 py-1.5 rounded-lg text-xs font-mono font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_22px_rgba(6,182,212,0.55)] flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-12 md:pt-20 pb-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-14">
          {/* Hero Guardian Scan Identity Centerpiece (Requirement 8) */}
          <ScrollReveal animation="scale" delayMs={30}>
            <div className="mb-7 flex items-center justify-center">
              <AIGuardianLogo
                size="hero"
                variant="hero"
                withGlow={true}
                animated={true}
                showScan={true}
                status="MONITORING"
                className="hover:scale-105 transition-transform duration-300"
              />
            </div>
          </ScrollReveal>

          {/* Staggered Element 1: Operational Badge */}
          <ScrollReveal animation="fade-up" delayMs={80}>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/85 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-6 shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:border-cyan-400 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="tracking-widest font-semibold uppercase">AUTONOMOUS AI SECURITY GATEWAY</span>
            </div>
          </ScrollReveal>

          {/* Staggered Element 2: Main Heading */}
          <ScrollReveal animation="fade-up" delayMs={150}>
            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-[1.05] mb-6">
              AI THAT <br />
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(6,182,212,0.45)]">
                GUARDS AI.
              </span>
            </h1>
          </ScrollReveal>

          {/* Staggered Element 3: Supporting Subheading */}
          <ScrollReveal animation="fade-up" delayMs={250}>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mb-8">
              Your AI agents can plan, reason, and act. <br className="hidden sm:block" />
              <span className="text-cyan-200 font-semibold">AI Guardian</span> inspects, reasons, and approves every action before socket execution.
            </p>
          </ScrollReveal>

          {/* Staggered Element 4: CTA Buttons */}
          <ScrollReveal animation="fade-up" delayMs={350}>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-6">
              <button
                id="hero-getstarted-btn"
                onClick={onGetStarted}
                className="btn-glow-sweep w-full sm:w-auto px-7 py-3.5 rounded-xl font-mono text-sm font-extrabold text-black bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_35px_rgba(6,182,212,0.65)] flex items-center justify-center gap-2 cursor-pointer group hover:-translate-y-0.5 active:scale-95"
              >
                <span>ENTER CONTROL CENTER</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                id="hero-howitworks-btn"
                onClick={() => scrollToSection('how-it-works')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-mono text-sm font-semibold text-slate-200 border border-slate-700 hover:border-cyan-500/50 bg-[#0f1422]/90 hover:bg-[#141b2e] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5"
              >
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>EXPLORE ARCHITECTURE</span>
              </button>
            </div>
          </ScrollReveal>

          {/* Staggered Element 5: Architecture Subtext */}
          <ScrollReveal animation="fade-in" delayMs={450}>
            <div className="text-xs font-mono text-cyan-400/80 tracking-wider flex items-center gap-3">
              <span>Deterministic RBAC</span>
              <span className="text-slate-600">•</span>
              <span>Gemini Cognitive Audit</span>
              <span className="text-slate-600">•</span>
              <span>Pre-Execution Isolation</span>
            </div>
          </ScrollReveal>
        </div>

        {/* HERO INTERACTIVE VISUAL & LIVE DEMO EVENT */}
        <ScrollReveal animation="scale" delayMs={500} className="mt-2 max-w-5xl mx-auto">
          <HeroPipelineVisual />
        </ScrollReveal>
      </section>

      {/* SECTION 6: PROBLEM SECTION */}
      <section id="problem-section" className="relative z-10 py-20 px-4 lg:px-8 border-t border-slate-800/80 bg-[#06080d]/60">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-2">
                THE UNCHECKED AUTONOMY RISK
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-wide uppercase mb-4">
                AUTONOMOUS AI NEEDS A GUARDIAN.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Autonomous agentic architectures are evolving rapidly from conversational assistants into independent execution engines. Without deterministic guardrails, high-risk failures occur in milliseconds.
              </p>
            </div>
          </ScrollReveal>

          {/* Three Problems Grid with TiltGlowCard & Staggered Reveal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Problem 1 */}
            <ScrollReveal animation="fade-up" delayMs={100}>
              <TiltGlowCard
                id="problem-card-1"
                glowColor="blue"
                className="rounded-2xl bg-[#090e18] border border-slate-800/90 p-6 h-full transition-all duration-300 hover:border-cyan-500/40"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 font-mono font-bold shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                  01
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  AI CAN ACT
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Modern agents can independently execute tools, invoke bash terminals, query production databases, call Stripe refunds, and mutate external state without human oversight.
                </p>
              </TiltGlowCard>
            </ScrollReveal>

            {/* Problem 2 */}
            <ScrollReveal animation="fade-up" delayMs={200}>
              <TiltGlowCard
                id="problem-card-2"
                glowColor="amber"
                className="rounded-2xl bg-[#090e18] border border-slate-800/90 p-6 h-full transition-all duration-300 hover:border-amber-500/40"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-950/70 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 font-mono font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  02
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-amber-300 transition-colors">
                  AI CAN MISUNDERSTAND
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Plausible prompt instructions do not equal security authorization. Hallucinated step planning or prompt injection can subvert developer intention into severe perimeter violations.
                </p>
              </TiltGlowCard>
            </ScrollReveal>

            {/* Problem 3 */}
            <ScrollReveal animation="fade-up" delayMs={300}>
              <TiltGlowCard
                id="problem-card-3"
                glowColor="rose"
                className="rounded-2xl bg-[#090e18] border border-slate-800/90 p-6 h-full transition-all duration-300 hover:border-rose-500/40"
              >
                <div className="w-10 h-10 rounded-lg bg-rose-950/70 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 font-mono font-bold shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                  03
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-rose-300 transition-colors">
                  AI CAN CAUSE DAMAGE
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  A seemingly benign task ("organize customer tables") can accidentally trigger bulk record exports, destructive deletions, or data exfiltration to unauthorized remote endpoints.
                </p>
              </TiltGlowCard>
            </ScrollReveal>
          </div>

          {/* Visual Transition */}
          <ScrollReveal animation="fade-in" delayMs={400} className="text-center">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-950/80 via-blue-950/60 to-cyan-950/80 border border-cyan-500/40 text-cyan-200 font-mono text-sm shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <AIGuardianLogo size="xs" withGlow />
              <span className="font-semibold">That's where AI Guardian steps in.</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 7: HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 py-20 px-4 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal animation="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-2">
              ARCHITECTURE PIPELINE
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-wide uppercase mb-4">
              HOW AI GUARDIAN OPERATES
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Every proposed action passes through a dual-engine verification barrier: deterministic RBAC boundary filtering combined with deep cognitive intent reasoning by Gemini.
            </p>
          </div>
        </ScrollReveal>

        {/* 6-step large visual pipeline with TiltGlowCards & staggered entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Step 01 */}
          <ScrollReveal animation="fade-up" delayMs={50}>
            <TiltGlowCard
              id="arch-step-1"
              glowColor="cyan"
              className="rounded-2xl bg-[#090e18] border border-cyan-950 p-6 h-full hover:border-cyan-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-cyan-400">01</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                    AGENT RUNTIME
                  </span>
                </div>
                <h4 className="font-display font-bold text-lg text-white mb-2">WORKER AI</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  The autonomous agent receives a high-level task directive, decomposes it into discrete steps, and formulates tool execution parameters.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span>Output: Action Call</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </TiltGlowCard>
          </ScrollReveal>

          {/* Step 02 */}
          <ScrollReveal animation="fade-up" delayMs={150}>
            <TiltGlowCard
              id="arch-step-2"
              glowColor="blue"
              className="rounded-2xl bg-[#090e18] border border-cyan-950 p-6 h-full hover:border-cyan-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-cyan-400">02</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/70 border border-blue-500/30 text-blue-300">
                    BOUNDARY FILTER
                  </span>
                </div>
                <h4 className="font-display font-bold text-lg text-white mb-2">CAPABILITY CHECK</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Deterministic security policy validates declared agent capabilities, resource access boundaries, target file paths, and maximum budget thresholds.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span>Policy Evaluation</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </TiltGlowCard>
          </ScrollReveal>

          {/* Step 03: The Guardian Core */}
          <ScrollReveal animation="fade-up" delayMs={250}>
            <TiltGlowCard
              id="arch-step-3"
              glowColor="cyan"
              enableTilt={true}
              maxTiltDeg={3.5}
              className="rounded-2xl bg-[#091122] border-2 border-cyan-500/60 p-6 h-full shadow-[0_0_30px_rgba(6,182,212,0.2)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-cyan-300">03</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/60 border border-cyan-400 text-cyan-200 font-bold">
                    ZERO-TRUST CORE
                  </span>
                </div>
                <h4 className="font-display font-bold text-lg text-white mb-2 flex items-center gap-2">
                  <span>AI GUARDIAN</span>
                  <AIGuardianLogo size="xs" withGlow animated />
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Hard-intercepts the proposed tool invocation before socket transmission. The agent remains in a strict execution hold state pending verification.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-cyan-400 flex items-center justify-between font-bold">
                <span>Execution Suspended</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </TiltGlowCard>
          </ScrollReveal>

          {/* Step 04 */}
          <ScrollReveal animation="fade-up" delayMs={350}>
            <TiltGlowCard
              id="arch-step-4"
              glowColor="purple"
              className="rounded-2xl bg-[#090e18] border border-cyan-950 p-6 h-full hover:border-cyan-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-cyan-400">04</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/30 text-purple-300">
                    COGNITIVE REASONING
                  </span>
                </div>
                <h4 className="font-display font-bold text-lg text-white mb-2">GEMINI REASONING</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Gemini 2.5 Flash analyzes systemic context: Is the action proportionate to the user's intent? Does it leak PII? Could it cause cascading infrastructure harm?
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span>Risk & Intent Scoring</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </TiltGlowCard>
          </ScrollReveal>

          {/* Step 05 */}
          <ScrollReveal animation="fade-up" delayMs={450}>
            <TiltGlowCard
              id="arch-step-5"
              glowColor="cyan"
              className="rounded-2xl bg-[#090e18] border border-cyan-950 p-6 h-full hover:border-cyan-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-cyan-400">05</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                    POLICY ENFORCEMENT
                  </span>
                </div>
                <h4 className="font-display font-bold text-lg text-white mb-2">DECISION VERDICT</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Guardian assigns a tamper-evident verdict: ALLOW for verified actions, REVIEW for high-impact edge cases, or BLOCK for hazardous attempts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span>ALLOW / REVIEW / BLOCK</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </TiltGlowCard>
          </ScrollReveal>

          {/* Step 06 */}
          <ScrollReveal animation="fade-up" delayMs={550}>
            <TiltGlowCard
              id="arch-step-6"
              glowColor="emerald"
              className="rounded-2xl bg-[#090e18] border border-cyan-950 p-6 h-full hover:border-emerald-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-cyan-400">06</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-300">
                    SECURE DISPATCH
                  </span>
                </div>
                <h4 className="font-display font-bold text-lg text-white mb-2">EXECUTOR</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  The action is executed strictly inside an isolated container sandbox only when fully authorized. Blocked actions are contained with immediate incident audit logging.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center justify-between font-bold">
                <span>Secure Execution</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </TiltGlowCard>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 8: THREE DECISIONS */}
      <section id="three-decisions" className="relative z-10 py-20 px-4 lg:px-8 border-t border-slate-800/80 bg-[#06080d]/80">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-2">
                EXPLICIT RUNTIME ROUTING
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-wide uppercase mb-4">
                THREE DECISION PATHS
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Guardian guarantees that no autonomous action can execute without explicit routing through one of three deterministic verdicts.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {/* Decision 1: ALLOW */}
            <ScrollReveal animation="fade-up" delayMs={100}>
              <TiltGlowCard
                id="decision-allow-card"
                glowColor="emerald"
                enableTilt={true}
                className="rounded-2xl bg-[#0a1215] border border-emerald-900/60 p-7 shadow-lg relative overflow-hidden flex flex-col justify-between h-full hover:border-emerald-500/60 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-5 text-xl font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    ✓
                  </div>
                  <div className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
                    SAFE ACTION
                  </div>
                  <h3 className="font-display font-bold text-2xl text-white mb-3">ALLOW</h3>
                  <p className="text-slate-300 text-xs leading-relaxed mb-4">
                    The proposed action complies with all capability constraints and exhibits low contextual risk. Dispatched directly to the sandbox executor.
                  </p>
                </div>
                <div className="pt-4 border-t border-emerald-950 flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-400">Runtime Outcome:</span>
                  <span className="text-emerald-300 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 pulse-allow">
                    "Execute"
                  </span>
                </div>
              </TiltGlowCard>
            </ScrollReveal>

            {/* Decision 2: REVIEW */}
            <ScrollReveal animation="fade-up" delayMs={200}>
              <TiltGlowCard
                id="decision-review-card"
                glowColor="amber"
                enableTilt={true}
                className="rounded-2xl bg-[#14120a] border border-amber-900/60 p-7 shadow-lg relative overflow-hidden flex flex-col justify-between h-full hover:border-amber-500/60 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-5 text-xl font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                    ⚠
                  </div>
                  <div className="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
                    UNCERTAIN ACTION
                  </div>
                  <h3 className="font-display font-bold text-2xl text-white mb-3">REVIEW</h3>
                  <p className="text-slate-300 text-xs leading-relaxed mb-4">
                    The action touches sensitive scopes (e.g. monetary refund, configuration write, or cloud outage fail-safe). Intercepted for mandatory Human-in-the-Loop approval.
                  </p>
                </div>
                <div className="pt-4 border-t border-amber-950 flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-400">Runtime Outcome:</span>
                  <span className="text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-950 border border-amber-500/30 pulse-review">
                    "Ask Human"
                  </span>
                </div>
              </TiltGlowCard>
            </ScrollReveal>

            {/* Decision 3: BLOCK */}
            <ScrollReveal animation="fade-up" delayMs={300}>
              <TiltGlowCard
                id="decision-block-card"
                glowColor="rose"
                enableTilt={true}
                className="rounded-2xl bg-[#140a0e] border border-rose-900/60 p-7 shadow-lg relative overflow-hidden flex flex-col justify-between h-full hover:border-rose-500/60 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-rose-950 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-5 text-xl font-bold shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                    ✕
                  </div>
                  <div className="font-mono text-xs text-rose-400 font-bold uppercase tracking-wider mb-1">
                    UNSAFE ACTION
                  </div>
                  <h3 className="font-display font-bold text-2xl text-white mb-3">BLOCK</h3>
                  <p className="text-slate-300 text-xs leading-relaxed mb-4">
                    Violates hard capability bounds, attempts unauthorized remote exfiltration, or malicious data access. Immediate termination before execution.
                  </p>
                </div>
                <div className="pt-4 border-t border-rose-950 flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-400">Runtime Outcome:</span>
                  <span className="text-rose-300 font-bold px-2 py-0.5 rounded bg-rose-950 border border-rose-500/30 pulse-block">
                    "Prevent"
                  </span>
                </div>
              </TiltGlowCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 9: SECURITY PROMISE */}
      <section id="security-promise" className="relative z-10 py-20 px-4 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal animation="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-2">
              ENTERPRISE ARCHITECTURE
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-wide uppercase mb-4">
              BUILT TO CONTROL AUTONOMOUS ACTIONS.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Engineered from first principles for mission-critical agentic workloads. Never post-mortem log inspection—always active pre-execution containment.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-16">
          {/* Pillar 1 */}
          <ScrollReveal animation="fade-up" delayMs={50}>
            <TiltGlowCard glowColor="cyan" className="p-5 rounded-xl bg-[#090e18] border border-slate-800 h-full hover:border-cyan-500/40">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 mb-3" />
              <h4 className="font-mono text-sm font-bold text-white mb-1">Preventive Security</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Actions are analyzed and blocked BEFORE execution occurs, eliminating zero-day damage.
              </p>
            </TiltGlowCard>
          </ScrollReveal>

          {/* Pillar 2 */}
          <ScrollReveal animation="fade-up" delayMs={100}>
            <TiltGlowCard glowColor="cyan" className="p-5 rounded-xl bg-[#090e18] border border-slate-800 h-full hover:border-cyan-500/40">
              <Sliders className="w-5 h-5 text-cyan-400 mb-3" />
              <h4 className="font-mono text-sm font-bold text-white mb-1">Capability Boundaries</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Fine-grained RBAC scopes for database access, payment thresholds, and file directories.
              </p>
            </TiltGlowCard>
          </ScrollReveal>

          {/* Pillar 3 */}
          <ScrollReveal animation="fade-up" delayMs={150}>
            <TiltGlowCard glowColor="cyan" className="p-5 rounded-xl bg-[#090e18] border border-slate-800 h-full hover:border-cyan-500/40">
              <Lock className="w-5 h-5 text-cyan-400 mb-3" />
              <h4 className="font-mono text-sm font-bold text-white mb-1">Deterministic Policies</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Hard cryptographic and logical rule enforcement that models cannot hallucinate away.
              </p>
            </TiltGlowCard>
          </ScrollReveal>

          {/* Pillar 4 */}
          <ScrollReveal animation="fade-up" delayMs={200}>
            <TiltGlowCard glowColor="cyan" className="p-5 rounded-xl bg-[#090e18] border border-slate-800 h-full hover:border-cyan-500/40">
              <Cpu className="w-5 h-5 text-cyan-400 mb-3" />
              <h4 className="font-mono text-sm font-bold text-white mb-1">Gemini Reasoning</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Deep semantic comprehension of human intent, secondary repercussions, and context.
              </p>
            </TiltGlowCard>
          </ScrollReveal>

          {/* Pillar 5 */}
          <ScrollReveal animation="fade-up" delayMs={250}>
            <TiltGlowCard glowColor="cyan" className="p-5 rounded-xl bg-[#090e18] border border-slate-800 h-full hover:border-cyan-500/40">
              <Eye className="w-5 h-5 text-cyan-400 mb-3" />
              <h4 className="font-mono text-sm font-bold text-white mb-1">Human-in-the-Loop</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Direct operator escalation with interactive modal approve or reject controls.
              </p>
            </TiltGlowCard>
          </ScrollReveal>

          {/* Pillar 6 */}
          <ScrollReveal animation="fade-up" delayMs={300}>
            <TiltGlowCard glowColor="cyan" className="p-5 rounded-xl bg-[#090e18] border border-slate-800 h-full hover:border-cyan-500/40">
              <AlertTriangle className="w-5 h-5 text-cyan-400 mb-3" />
              <h4 className="font-mono text-sm font-bold text-white mb-1">Fail-Safe Decisions</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                If reasoning services experience network outages, Guardian safely defaults to containment.
              </p>
            </TiltGlowCard>
          </ScrollReveal>

          {/* Pillar 7 */}
          <ScrollReveal animation="fade-up" delayMs={350} className="sm:col-span-2">
            <TiltGlowCard glowColor="cyan" className="p-5 rounded-xl bg-[#090e18] border border-slate-800 h-full hover:border-cyan-500/40">
              <History className="w-5 h-5 text-cyan-400 mb-3" />
              <h4 className="font-mono text-sm font-bold text-white mb-1">Complete Audit Trail</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Every intercepted tool call, policy evaluation, risk metric, and human override is recorded with timestamps for SOC 2 compliance.
              </p>
            </TiltGlowCard>
          </ScrollReveal>
        </div>

        {/* BOTTOM CALL TO ACTION BANNER */}
        <ScrollReveal animation="scale" delayMs={200}>
          <div className="rounded-3xl bg-gradient-to-b from-[#0e1628] to-[#070b14] border border-cyan-500/40 p-8 md:p-12 text-center relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] group">
            <div className="absolute inset-0 cyber-grid animate-grid-drift opacity-25 pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <AIGuardianLogo size="lg" withGlow animated className="mb-6" />
              <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight mb-3">
                READY TO SECURE YOUR AUTONOMOUS AGENTS?
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                Experience real-time AI security orchestration. Observe autonomous agents as they plan, intercept dangerous commands, and enforce zero-trust boundaries.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
                <button
                  id="bottom-enter-ctrl-btn"
                  onClick={onGetStarted}
                  className="btn-glow-sweep w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono text-sm font-extrabold text-black bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_35px_rgba(6,182,212,0.65)] flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:scale-95"
                >
                  <span>ENTER GUARDIAN CONTROL CENTER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  id="bottom-demo-btn"
                  onClick={onDirectDemo}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-mono text-sm font-semibold text-cyan-300 border border-cyan-500/40 hover:bg-cyan-950/40 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Launch Interactive Demo</span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-[#05070a] py-10 px-4 lg:px-8 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AIGuardianLogo size="xs" />
            <span className="text-slate-300 font-bold font-display">AI GUARDIAN</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400/80">OBSERVE. REASON. DECIDE. ENFORCE.</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span>AI Guardian Runtime Architecture v2.4-SOC</span>
            <span>•</span>
            <span className="text-cyan-400">Powered by Gemini</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
