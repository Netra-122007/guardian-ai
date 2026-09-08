import React, { useEffect, useRef, useState } from 'react';

type RevealAnimation = 'fade-up' | 'fade-in' | 'scale' | 'slide-left' | 'slide-right';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: RevealAnimation;
  delayMs?: number;
  durationMs?: number;
  threshold?: number;
  className?: string;
  as?: React.ElementType;
  id?: string;
}

/**
 * ScrollReveal
 * High-performance viewport entry animation component.
 * Uses IntersectionObserver with CSS transitions to avoid heavy JS loop costs.
 * Respects prefers-reduced-motion.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delayMs = 0,
  durationMs = 650,
  threshold = 0.12,
  className = '',
  as: Component = 'div',
  id,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const currentRef = ref.current;
    if (!currentRef) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold]);

  // Initial and visible styles based on chosen animation
  const getTransformStyles = () => {
    if (isVisible) {
      return 'opacity-100 translate-y-0 translate-x-0 scale-100';
    }

    switch (animation) {
      case 'fade-up':
        return 'opacity-0 translate-y-8';
      case 'fade-in':
        return 'opacity-0';
      case 'scale':
        return 'opacity-0 scale-95 translate-y-4';
      case 'slide-left':
        return 'opacity-0 translate-x-8';
      case 'slide-right':
        return 'opacity-0 -translate-x-8';
      default:
        return 'opacity-0 translate-y-8';
    }
  };

  return (
    <Component
      id={id}
      ref={ref as any}
      className={`transition-all ${getTransformStyles()} ${className}`}
      style={{
        transitionDuration: `${durationMs}ms`,
        transitionDelay: `${delayMs}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: isVisible ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </Component>
  );
};
