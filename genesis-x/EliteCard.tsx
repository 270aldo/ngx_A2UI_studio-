import React from 'react';
import type { EliteCardProps } from './types';

// Elite Protocol Design Tokens
export const ELITE_TOKENS = {
  primary: '#6D00FF',
  accent: '#4C00B0',
  bg: '#050505',
  white: '#FFFFFF',
  gradient: 'linear-gradient(135deg, #6D00FF 0%, #4C00B0 50%, #000000 100%)',
  glow: '0 0 30px rgba(109, 0, 255, 0.15)',
  glowIntense: '0 0 50px rgba(109, 0, 255, 0.3)',
};

export const EliteCard: React.FC<EliteCardProps> = ({
  children,
  className = '',
  hover = true
}) => {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl
        border border-[#6D00FF]/50
        p-6
        ${hover ? 'transition-all duration-300 hover:scale-[1.02] hover:border-[#6D00FF]/80' : ''}
        ${className}
      `}
      style={{
        background: ELITE_TOKENS.gradient,
        boxShadow: ELITE_TOKENS.glow,
      }}
    >
      {/* Grainy Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.2,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Elite Button - High contrast CTA
export const EliteButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}> = ({ children, onClick, variant = 'primary', className = '' }) => {
  if (variant === 'secondary') {
    return (
      <button
        onClick={onClick}
        className={`
          w-full py-3
          bg-transparent border border-white/30
          text-white font-bold text-xs uppercase tracking-widest
          rounded-lg
          hover:bg-white/10 hover:border-white/50
          active:scale-95 transition-all
          ${className}
        `}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`
        w-full py-3
        bg-white text-black
        font-bold text-xs uppercase tracking-widest
        rounded-lg
        hover:scale-105 active:scale-95 transition-all
        ${className}
      `}
      style={{
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
      }}
    >
      {children}
    </button>
  );
};

// Elite Label - Tactical uppercase
export const EliteLabel: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <span className={`text-[10px] uppercase tracking-widest font-bold text-white/60 ${className}`}>
    {children}
  </span>
);

// Elite Headline - Italic bold
export const EliteHeadline: React.FC<{
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ children, size = 'lg', className = '' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <h2 className={`font-black italic tracking-tighter text-white ${sizeClasses[size]} ${className}`}>
      {children}
    </h2>
  );
};

// Elite Badge - For rarity/status
export const EliteBadge: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'glow';
}> = ({ children, variant = 'default' }) => (
  <span
    className={`
      inline-flex items-center px-2 py-1
      text-[10px] uppercase tracking-widest font-bold
      rounded-full border border-[#6D00FF]/50
      ${variant === 'glow' ? 'bg-[#6D00FF]/20 text-[#6D00FF]' : 'bg-white/5 text-white/80'}
    `}
  >
    {children}
  </span>
);

export default EliteCard;
