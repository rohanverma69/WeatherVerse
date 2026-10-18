import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'amber' | 'blue' | 'emerald';
  onClick?: () => void;
  maxTilt?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  glowColor = 'cyan',
  onClick,
  maxTilt = 7,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [spotlightPos, setSpotlightPos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -maxTilt;
    const rotY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(`perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(6px)`);
    setSpotlightPos({ x, y });
  }, [maxTilt]);

  const handleMouseLeave = useCallback(() => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
    setSpotlightPos(null);
  }, []);

  const getGlowBorder = () => {
    switch (glowColor) {
      case 'amber':
        return 'group-hover:border-amber-400/40 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]';
      case 'purple':
        return 'group-hover:border-purple-400/40 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]';
      case 'blue':
        return 'group-hover:border-blue-400/40 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]';
      case 'emerald':
        return 'group-hover:border-emerald-400/40 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]';
      default:
        return 'group-hover:border-cyan-400/40 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]';
    }
  };

  const getSpotlightColor = () => {
    switch (glowColor) {
      case 'amber':
        return 'rgba(245, 158, 11, 0.15)';
      case 'purple':
        return 'rgba(139, 92, 246, 0.15)';
      case 'blue':
        return 'rgba(59, 130, 246, 0.15)';
      case 'emerald':
        return 'rgba(16, 185, 129, 0.15)';
      default:
        return 'rgba(6, 182, 212, 0.15)';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: transformStyle,
        transition: 'transform 0.18s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.25s ease',
        transformStyle: 'preserve-3d',
      }}
      className={`relative group rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08] p-5 shadow-glass overflow-hidden cursor-default transition-colors duration-300 ${getGlowBorder()} ${className}`}
    >
      {/* Dynamic Cursor Spotlight Highlight */}
      {spotlightPos && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-2xl"
          style={{
            background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${getSpotlightColor()}, transparent 60%)`,
          }}
        />
      )}

      {/* Subtle Top Edge Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
