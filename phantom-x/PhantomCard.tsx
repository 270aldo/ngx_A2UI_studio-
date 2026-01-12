// phantom-x/PhantomCard.tsx
// Base components and design tokens for phantom_X module

import React from 'react';
import type { PhantomCardProps } from './types';

// ============================================
// DESIGN TOKENS
// ============================================
export const PHANTOM_TOKENS = {
  // Core colors
  primary: '#6D00FF',
  accent: '#8B5CF6',

  // Backgrounds
  background: '#0A0A0B',
  surface: '#111113',

  // Borders
  border: '#1F1F23',
  borderHover: '#6D00FF',

  // Glow effects
  glow: 'rgba(109, 0, 255, 0.15)',
  glowMedium: 'rgba(109, 0, 255, 0.25)',
  glowIntense: 'rgba(109, 0, 255, 0.35)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
};

// ============================================
// PHANTOM CARD - Base wrapper component
// ============================================
export const PhantomCard: React.FC<PhantomCardProps> = ({
  children,
  className = '',
  hover = true,
  glowIntensity = 'subtle',
}) => {
  const glowMap = {
    subtle: `0 0 20px ${PHANTOM_TOKENS.glow}`,
    medium: `0 0 30px ${PHANTOM_TOKENS.glowMedium}`,
    intense: `0 0 40px ${PHANTOM_TOKENS.glowIntense}, inset 0 0 20px ${PHANTOM_TOKENS.glow}`,
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
        hover ? 'hover:scale-[1.01]' : ''
      } ${className}`}
      style={{
        background: PHANTOM_TOKENS.surface,
        border: `1px solid ${PHANTOM_TOKENS.border}`,
        boxShadow: glowMap[glowIntensity],
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.borderColor = PHANTOM_TOKENS.borderHover;
          e.currentTarget.style.boxShadow = glowMap.medium;
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.borderColor = PHANTOM_TOKENS.border;
          e.currentTarget.style.boxShadow = glowMap[glowIntensity];
        }
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top, ${PHANTOM_TOKENS.primary}10 0%, transparent 50%)`,
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// ============================================
// PHANTOM BUTTON - CTA with glow
// ============================================
interface PhantomButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
}

export const PhantomButton: React.FC<PhantomButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  className = '',
}) => {
  if (variant === 'primary') {
    return (
      <button
        onClick={onClick}
        className={`w-full py-3 px-6 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:scale-[1.02] ${className}`}
        style={{
          background: 'transparent',
          border: `2px solid ${PHANTOM_TOKENS.primary}`,
          color: PHANTOM_TOKENS.primary,
          boxShadow: `0 0 20px ${PHANTOM_TOKENS.glowMedium}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 0 30px ${PHANTOM_TOKENS.glowIntense}`;
          e.currentTarget.style.background = `${PHANTOM_TOKENS.primary}15`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `0 0 20px ${PHANTOM_TOKENS.glowMedium}`;
          e.currentTarget.style.background = 'transparent';
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full py-3 px-6 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 ${className}`}
      style={{
        background: `${PHANTOM_TOKENS.primary}15`,
        border: `1px solid ${PHANTOM_TOKENS.primary}40`,
        color: PHANTOM_TOKENS.textSecondary,
      }}
    >
      {children}
    </button>
  );
};

// ============================================
// PHANTOM LABEL - Small uppercase text
// ============================================
interface PhantomLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const PhantomLabel: React.FC<PhantomLabelProps> = ({ children, className = '' }) => (
  <span
    className={`text-[10px] uppercase tracking-widest font-bold ${className}`}
    style={{ color: PHANTOM_TOKENS.textMuted }}
  >
    {children}
  </span>
);

// ============================================
// PHANTOM HEADLINE - Bold italic titles
// ============================================
interface PhantomHeadlineProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PhantomHeadline: React.FC<PhantomHeadlineProps> = ({
  children,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <h3
      className={`font-black italic tracking-tighter ${sizeClasses[size]} ${className}`}
      style={{ color: PHANTOM_TOKENS.textPrimary }}
    >
      {children}
    </h3>
  );
};

// ============================================
// PHANTOM BADGE - Status badges with glow
// ============================================
interface PhantomBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'glow';
  color?: string;
  className?: string;
}

export const PhantomBadge: React.FC<PhantomBadgeProps> = ({
  children,
  variant = 'default',
  color = PHANTOM_TOKENS.primary,
  className = '',
}) => {
  const baseStyle = {
    backgroundColor: `${color}20`,
    color: color,
    boxShadow: variant === 'glow' ? `0 0 15px ${color}40` : 'none',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${className}`}
      style={baseStyle}
    >
      {children}
    </span>
  );
};

// ============================================
// PHANTOM PROGRESS - Progress bar with glow trail
// ============================================
interface PhantomProgressProps {
  value: number;
  showGlow?: boolean;
  className?: string;
}

export const PhantomProgress: React.FC<PhantomProgressProps> = ({
  value,
  showGlow = true,
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`h-2 rounded-full overflow-hidden ${className}`}
      style={{ background: PHANTOM_TOKENS.border }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${clampedValue}%`,
          background: `linear-gradient(90deg, ${PHANTOM_TOKENS.primary} 0%, ${PHANTOM_TOKENS.accent} 100%)`,
          boxShadow: showGlow ? `0 0 10px ${PHANTOM_TOKENS.primary}80` : 'none',
        }}
      />
    </div>
  );
};

export default PhantomCard;
