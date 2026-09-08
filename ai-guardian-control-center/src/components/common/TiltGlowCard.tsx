import React, { useRef, useState, useCallback } from 'react';

interface TiltGlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'blue' | 'purple';
  enableTilt?: boolean;
  enableHoverLift?: boolean;
  maxTiltDeg?: number;
  onClick?: () => void;
  id?: string;
}

/**
 * TiltGlowCard
 * Enterprise interactive card with mouse-follow radial glow and subtle 3D micro-tilt.
 * Respects prefers-reduced-motion and touch device constraints.
 */
export const TiltGlowCard: React.FC<TiltGlowCardProps> = ({
  children,
  className = '',
  glowColor = 'cyan',
  enableTilt = true,
  enableHoverLift = true,
  maxTiltDeg = 3.2,
  onClick,
  id,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState<{ rotateX: number; rotateY: number }>({ rotateX: 0, rotateY: 0 });

  const getGlowRgba = () => {
    switch (glowColor) {
      case 'emerald':
        return 'rgba(16, 185, 129, 0.16)';
      case 'amber':
        return 'rgba(245, 158, 11, 0.16)';
      case 'rose':
        return 'rgba(244, 63, 94, 0.16)';
      case 'purple':
        return 'rgba(168, 85, 247, 0.16)';
      case 'blue':
        return 'rgba(59, 130, 246, 0.16)';
      case 'cyan':
      default:
        return 'rgba(6, 182, 212, 0.16)';
    }
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      // Disable on touch / reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (window.innerWidth < 768) return;

      const rect = cardRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const xPercent = (clientX / rect.width) * 100;
      const yPercent = (clientY / rect.height) * 100;

      setCoords({ x: xPercent, y: yPercent });

      if (enableTilt) {
        // Calculate tilt between -maxTiltDeg and +maxTiltDeg
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const normX = (clientX - centerX) / centerX;
        const normY = (clientY - centerY) / centerY;

        // rotateX is driven by vertical movement (inverted), rotateY by horizontal
        const rotateX = -normY * maxTiltDeg;
        const rotateY = normX * maxTiltDeg;

        setTilt({ rotateX, rotateY });
      }
    },
    [enableTilt, maxTiltDeg]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
    setCoords({ x: 50, y: 50 });
  };

  const transformStyle = () => {
    if (!isHovered) {
      return 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    }
    const translateY = enableHoverLift ? -5 : 0;
    if (enableTilt) {
      return `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) translateY(${translateY}px)`;
    }
    return `translateY(${translateY}px)`;
  };

  return (
    <div
      id={id}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden transition-all duration-300 ease-out group ${className}`}
      style={{
        transform: transformStyle(),
        transformStyle: 'preserve-3d',
        willChange: isHovered ? 'transform' : 'auto',
      }}
    >
      {/* Mouse-follow interactive radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle 280px at ${coords.x}% ${coords.y}%, ${getGlowRgba()}, transparent 70%)`,
        }}
      />

      {/* Card Content with subtle 3D lift */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};
