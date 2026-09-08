import React, { useState, useEffect, useId } from 'react';

export type GuardianStatus = 'IDLE' | 'MONITORING' | 'ALLOW' | 'REVIEW' | 'BLOCK';

export interface AIGuardianLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | number;
  className?: string;
  withGlow?: boolean;
  monochrome?: boolean;
  animated?: boolean;
  showScan?: boolean;
  status?: GuardianStatus;
  variant?: 'default' | 'hero' | 'minimal';
  interactive?: boolean;
  id?: string;
}

/**
 * AI Guardian Signature Brand Mark & Scanning Identity
 *
 * Visual Concept:
 * - Geometric cyber shield = SECURITY
 * - Central neural synapse core = AI INTELLIGENCE
 * - Thin vertical scanning beam = CONTINUOUS MONITORING
 *
 * Lifecycle:
 * SCAN (top -> center -> bottom) -> ANALYZE (core reaction) -> PROTECT (wave & flash) -> IDLE
 */
export const AIGuardianLogo: React.FC<AIGuardianLogoProps> = ({
  size = 'md',
  className = '',
  withGlow = false,
  monochrome = false,
  animated = true,
  showScan = true,
  status = 'MONITORING',
  variant = 'default',
  interactive = true,
  id: customId,
}) => {
  const reactId = useId().replace(/:/g, '');
  const id = customId || reactId;

  const [hasEntered, setHasEntered] = useState(false);
  const [activeReaction, setActiveReaction] = useState<'ALLOW' | 'REVIEW' | 'BLOCK' | null>(null);

  // Logo entry animation trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasEntered(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Brief Guardian Status Reaction Handling (Requirement 6)
  // Triggers temporary informative reaction (1.8s) then smoothly returns to monitoring
  useEffect(() => {
    if (status === 'ALLOW' || status === 'REVIEW' || status === 'BLOCK') {
      setActiveReaction(status);
      const timer = setTimeout(() => {
        setActiveReaction(null);
      }, 1900);
      return () => clearTimeout(timer);
    } else {
      setActiveReaction(null);
    }
  }, [status]);

  // Dimension mapping
  let dimension = 36;
  if (typeof size === 'number') {
    dimension = size;
  } else {
    switch (size) {
      case 'xs':
        dimension = 18;
        break;
      case 'sm':
        dimension = 24;
        break;
      case 'md':
        dimension = 36;
        break;
      case 'lg':
        dimension = 52;
        break;
      case 'xl':
        dimension = 72;
        break;
      case 'hero':
        dimension = 96;
        break;
    }
  }

  const isHero = variant === 'hero' || size === 'hero';
  const isMinimal = variant === 'minimal' || size === 'xs';

  // Dynamic colors for states
  const primaryStroke = monochrome
    ? 'currentColor'
    : activeReaction === 'ALLOW'
    ? '#10b981'
    : activeReaction === 'REVIEW'
    ? '#f59e0b'
    : activeReaction === 'BLOCK'
    ? '#f43f5e'
    : '#06b6d4';

  const secondaryStroke = monochrome
    ? 'currentColor'
    : activeReaction === 'ALLOW'
    ? '#34d399'
    : activeReaction === 'REVIEW'
    ? '#fbbf24'
    : activeReaction === 'BLOCK'
    ? '#fb7185'
    : '#38bdf8';

  const coreFill = monochrome
    ? 'currentColor'
    : activeReaction === 'ALLOW'
    ? '#10b981'
    : activeReaction === 'REVIEW'
    ? '#f59e0b'
    : activeReaction === 'BLOCK'
    ? '#f43f5e'
    : '#22d3ee';

  // Active status flare class
  const reactionFlareClass =
    activeReaction === 'ALLOW'
      ? 'guardian-flare-allow'
      : activeReaction === 'REVIEW'
      ? 'guardian-flare-review'
      : activeReaction === 'BLOCK'
      ? 'guardian-flare-block'
      : '';

  // Whether the scanning beam is active
  const isScanningActive =
    animated &&
    showScan &&
    status !== 'IDLE' &&
    activeReaction !== 'BLOCK' &&
    !monochrome;

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 group select-none transition-transform duration-300 ${
        interactive ? 'hover:scale-[1.04] cursor-pointer' : ''
      } ${
        withGlow
          ? isHero
            ? 'filter drop-shadow-[0_0_24px_rgba(6,182,212,0.45)]'
            : 'filter drop-shadow-[0_0_14px_rgba(6,182,212,0.35)]'
          : ''
      } ${reactionFlareClass} ${className}`}
      style={{ width: dimension, height: dimension }}
      title={status ? `AI Guardian: ${status}` : 'AI Guardian'}
    >
      {/* HERO VARIANT EXTRAS: Background ambient glow & concentric monitoring ring */}
      {isHero && animated && (
        <>
          {/* Subtle ambient radial glow behind logo */}
          <div className="absolute inset-0 -m-5 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none animate-pulse" />

          {/* Faint outer circular monitoring radar ring */}
          <svg
            viewBox="0 0 120 120"
            className="absolute inset-0 -m-[12.5%] w-[125%] h-[125%] pointer-events-none animate-guardian-radar opacity-40"
            fill="none"
          >
            <circle
              cx="60"
              cy="60"
              r="56"
              stroke="#06b6d4"
              strokeWidth="0.75"
              strokeDasharray="4 8"
              opacity="0.6"
            />
            {/* 4 Cardinal Radar Tick Marks */}
            <line x1="60" y1="2" x2="60" y2="7" stroke="#38bdf8" strokeWidth="1.2" />
            <line x1="60" y1="113" x2="60" y2="118" stroke="#38bdf8" strokeWidth="1.2" />
            <line x1="2" y1="60" x2="7" y2="60" stroke="#38bdf8" strokeWidth="1.2" />
            <line x1="113" y1="60" x2="118" y2="60" stroke="#38bdf8" strokeWidth="1.2" />
          </svg>

          {/* Delicate floating constellation particles */}
          <div className="absolute -top-1 -right-1 w-1 h-1 rounded-full bg-cyan-300 animate-ping opacity-60" style={{ animationDuration: '3.5s' }} />
          <div className="absolute -bottom-1 -left-1 w-1 h-1 rounded-full bg-sky-400 animate-pulse opacity-50" />
        </>
      )}

      {/* MAIN GUARDIAN SHIELD & NEURAL CORE SVG */}
      <svg
        viewBox="0 0 100 100"
        width={dimension}
        height={dimension}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible transition-all duration-300 group-hover:drop-shadow-[0_0_18px_rgba(34,211,238,0.7)]"
      >
        <defs>
          {/* Shield Outer Cyber Gradient */}
          <linearGradient id={`shieldGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="45%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>

          {/* AI Neural Core Radial Aura */}
          <radialGradient id={`coreAura-${id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="35%" stopColor={coreFill} stopOpacity="0.85" />
            <stop offset="70%" stopColor="#0284c7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
          </radialGradient>

          {/* Thin Scanning Beam Gradient */}
          <linearGradient id={`beamGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>

          {/* Scanning Beam Diffuse Glow Ribbon */}
          <linearGradient id={`beamAura-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="30%" stopColor="#22d3ee" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#22d3ee" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>

          {/* Shield Clipping Boundary - Keeps scanning beam strictly inside the shield */}
          <clipPath id={`shieldClip-${id}`}>
            <path
              d="M50 8 
                 L86 23 
                 C86 23 88 56 76 74 
                 C68 86 54 94 50 96 
                 C46 94 32 86 24 74 
                 C12 56 14 23 14 23 
                 Z"
            />
          </clipPath>
        </defs>

        {/* 1. OUTER GEOMETRIC CYBER SHIELD */}
        <path
          d="M50 8 
             L86 23 
             C86 23 88 56 76 74 
             C68 86 54 94 50 96 
             C46 94 32 86 24 74 
             C12 56 14 23 14 23 
             Z"
          fill="#0a1220"
          stroke={
            monochrome
              ? 'currentColor'
              : activeReaction
              ? primaryStroke
              : `url(#shieldGrad-${id})`
          }
          strokeWidth="3"
          strokeLinejoin="round"
          strokeDasharray={280}
          className={`transition-all duration-300 ${
            !hasEntered ? 'animate-guardian-draw' : ''
          } ${animated && !activeReaction ? 'animate-guardian-shield-flash' : ''}`}
        />

        {/* 2. INNER GEOMETRIC INSET SHIELD (CIRCUIT SUBSTRATE) */}
        <path
          d="M50 17 
             L78 28 
             C78 28 80 54 70 68 
             C63 78 53 84 50 86 
             C47 84 37 78 30 68 
             C20 54 22 28 22 28 
             Z"
          fill="#060d18"
          stroke={monochrome ? 'currentColor' : '#0e3b5e'}
          strokeWidth="1.5"
          strokeDasharray="4 2"
          opacity="0.85"
        />

        {/* 3. PERIMETER CONDUIT TRACES RADIATING TOWARD NEURAL CORE */}
        {!isMinimal && (
          <g opacity="0.85">
            {/* Top vertical conduit */}
            <line x1="50" y1="17" x2="50" y2="31" stroke={primaryStroke} strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="50" cy="18" r="1.8" fill={primaryStroke} />

            {/* Upper Left Conduit */}
            <path
              d="M26 31 L38 41 L43 43"
              stroke={secondaryStroke}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="26" cy="31" r="1.6" fill={secondaryStroke} />

            {/* Upper Right Conduit */}
            <path
              d="M74 31 L62 41 L57 43"
              stroke={secondaryStroke}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="74" cy="31" r="1.6" fill={secondaryStroke} />

            {/* Lower Left Conduit */}
            <path
              d="M32 67 L42 61 L45 57"
              stroke={primaryStroke}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="32" cy="67" r="1.6" fill={primaryStroke} />

            {/* Lower Right Conduit */}
            <path
              d="M68 67 L58 61 L55 57"
              stroke={primaryStroke}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="68" cy="67" r="1.6" fill={primaryStroke} />

            {/* Bottom vertical drain trace */}
            <line x1="50" y1="69" x2="50" y2="84" stroke={secondaryStroke} strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="50" cy="84" r="1.8" fill={secondaryStroke} />
          </g>
        )}

        {/* 4. NEURAL NODES & SYNAPSE LINES (AI INTELLIGENCE) */}
        <g className={animated ? 'animate-guardian-nodes origin-center' : ''}>
          {/* Synapse Connection Lines from Nodes to Core */}
          <line x1="50" y1="31" x2="50" y2="42" stroke={secondaryStroke} strokeWidth="1.2" strokeDasharray="2 2" opacity="0.7" />
          <line x1="68" y1="50" x2="57" y2="50" stroke={secondaryStroke} strokeWidth="1.2" strokeDasharray="2 2" opacity="0.7" />
          <line x1="50" y1="69" x2="50" y2="58" stroke={secondaryStroke} strokeWidth="1.2" strokeDasharray="2 2" opacity="0.7" />
          <line x1="32" y1="50" x2="43" y2="50" stroke={secondaryStroke} strokeWidth="1.2" strokeDasharray="2 2" opacity="0.7" />

          {/* 4 Connected Neural Orbit Nodes */}
          <circle cx="50" cy="31" r="2.2" fill={coreFill} className="transition-all duration-300 group-hover:scale-110" />
          <circle cx="68" cy="50" r="2.2" fill={secondaryStroke} className="transition-all duration-300 group-hover:scale-110" />
          <circle cx="50" cy="69" r="2.2" fill={coreFill} className="transition-all duration-300 group-hover:scale-110" />
          <circle cx="32" cy="50" r="2.2" fill={secondaryStroke} className="transition-all duration-300 group-hover:scale-110" />

          {/* Node Inner Bright Core Sparks */}
          <circle cx="50" cy="31" r="0.9" fill="#ffffff" />
          <circle cx="68" cy="50" r="0.9" fill="#ffffff" />
          <circle cx="50" cy="69" r="0.9" fill="#ffffff" />
          <circle cx="32" cy="50" r="0.9" fill="#ffffff" />
        </g>

        {/* 5. CENTRAL AI NEURAL CORE / DIGITAL EYE (INTELLIGENCE) */}
        <g className={animated ? 'animate-guardian-core origin-center' : ''}>
          {/* Outer Ring Aperture */}
          <circle
            cx="50"
            cy="50"
            r="15"
            stroke={monochrome ? 'currentColor' : '#0284c7'}
            strokeWidth="1.8"
            strokeDasharray="6 3"
            opacity="0.8"
          />

          {/* Core Glowing Iris Aura */}
          <circle cx="50" cy="50" r="11" fill={`url(#coreAura-${id})`} />

          {/* Circular Protection Radar Wave Expanding on Scan Completion */}
          {animated && (
            <circle
              cx="50"
              cy="50"
              r="6"
              fill="none"
              stroke={coreFill}
              className="animate-guardian-protect pointer-events-none"
            />
          )}

          {/* Inner Geometric AI Hex-Eye */}
          <polygon
            points="50,42 57,46 57,54 50,58 43,54 43,46"
            fill="#041224"
            stroke={coreFill}
            strokeWidth="1.8"
            className="transition-colors duration-300"
          />

          {/* Central Singularity Pupil */}
          <circle cx="50" cy="50" r="3.2" fill={coreFill} />
          <circle cx="50" cy="50" r="1.4" fill="#ffffff" />

          {/* Subtle Horizontal Sensor Beam */}
          <line
            x1="39"
            y1="50"
            x2="61"
            y2="50"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>

        {/* 6. SIGNATURE GUARDIAN SCANNING BEAM (CONTINUOUS MONITORING) */}
        {/* Strictly clipped within the shield boundary */}
        {isScanningActive && (
          <g clipPath={`url(#shieldClip-${id})`} className="guardian-scan-beam-element pointer-events-none">
            <g className="animate-guardian-scan">
              {/* Soft scanning glow ribbon */}
              <rect
                x="14"
                y="-3.5"
                width="72"
                height="7"
                fill={`url(#beamAura-${id})`}
                rx="2"
              />
              {/* Primary razor-thin scan line */}
              <line
                x1="12"
                y1="0"
                x2="88"
                y2="0"
                stroke={`url(#beamGrad-${id})`}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              {/* Core scanning glint at center */}
              <circle cx="50" cy="0" r="1.5" fill="#ffffff" opacity="0.9" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

export const GuardianLogo = AIGuardianLogo;
export default AIGuardianLogo;
