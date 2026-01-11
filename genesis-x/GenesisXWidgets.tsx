import React, { useState } from 'react';
import {
  Zap,
  Clock,
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
  Star,
  Target,
  CheckCircle2,
  Circle,
  Sparkles,
  Crown,
  Dumbbell,
} from 'lucide-react';
import { EliteCard, EliteButton, EliteLabel, EliteHeadline, EliteBadge, ELITE_TOKENS } from './EliteCard';
import type {
  HeroCardProps,
  WorkoutCardEliteProps,
  ProgressDashboardEliteProps,
  AchievementUnlockProps,
  GoalCommitmentProps,
} from './types';

// Widget wrapper interface (matches WidgetRenderer pattern)
interface WidgetActionProps<T = any> {
  data: T;
  onAction?: (action: string, payload?: any) => void;
}

// ============================================
// 1. HERO CARD - Main CTA with impact
// ============================================
export const HeroCard: React.FC<WidgetActionProps<HeroCardProps>> = ({ data, onAction }) => {
  const { title, subtitle, ctaText } = data;

  return (
    <EliteCard className="text-center py-10">
      <div className="space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-2">
          <Zap className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-2">
          <EliteHeadline size="xl">{title}</EliteHeadline>
          <p className="text-white/60 text-sm max-w-xs mx-auto">{subtitle}</p>
        </div>

        <EliteButton onClick={() => onAction?.('CTA_CLICK')}>
          {ctaText}
        </EliteButton>
      </div>
    </EliteCard>
  );
};

// ============================================
// 2. WORKOUT CARD ELITE - Premium routine card
// ============================================
export const WorkoutCardElite: React.FC<WidgetActionProps<WorkoutCardEliteProps>> = ({ data, onAction }) => {
  const { title, category, duration, exercises, intensity } = data;

  const intensityColors = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#EF4444',
    extreme: '#6D00FF',
  };

  const intensityLabels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    extreme: 'Extrema',
  };

  return (
    <EliteCard>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <EliteLabel>{category}</EliteLabel>
            <EliteHeadline size="md">{title}</EliteHeadline>
          </div>
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
            style={{
              backgroundColor: `${intensityColors[intensity]}20`,
              color: intensityColors[intensity],
            }}
          >
            <Flame className="w-3 h-3" />
            {intensityLabels[intensity]}
          </div>
        </div>

        {/* Metrics */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-white/70">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-mono">{duration} min</span>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <Dumbbell className="w-4 h-4" />
            <span className="text-sm font-mono">{exercises.length} ejercicios</span>
          </div>
        </div>

        {/* Exercises List */}
        <div className="space-y-2 border-t border-white/10 pt-4">
          {exercises.slice(0, 4).map((ex, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-white/80">{ex.name}</span>
              <span className="font-mono text-white/50">
                {ex.sets}×{ex.reps}
              </span>
            </div>
          ))}
          {exercises.length > 4 && (
            <p className="text-xs text-white/40">+{exercises.length - 4} más</p>
          )}
        </div>

        {/* CTA */}
        <EliteButton onClick={() => onAction?.('START_WORKOUT')}>
          Iniciar Entrenamiento
        </EliteButton>
      </div>
    </EliteCard>
  );
};

// ============================================
// 3. PROGRESS DASHBOARD ELITE - Cinematic metrics
// ============================================
export const ProgressDashboardElite: React.FC<WidgetActionProps<ProgressDashboardEliteProps>> = ({ data }) => {
  const { weekProgress, metrics, streak, level, levelTitle } = data;

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-white/40" />;
  };

  return (
    <EliteCard hover={false}>
      <div className="space-y-6">
        {/* Level Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-mono text-xl font-bold"
              style={{ background: ELITE_TOKENS.gradient }}
            >
              {level}
            </div>
            <div>
              <EliteLabel>Nivel Actual</EliteLabel>
              <p className="text-white font-bold">{levelTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="font-mono text-2xl font-bold text-white">{streak}</span>
            <EliteLabel>días</EliteLabel>
          </div>
        </div>

        {/* Week Progress Ring */}
        <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke={ELITE_TOKENS.primary}
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${(weekProgress / 100) * 226} 226`}
                strokeLinecap="round"
                style={{
                  filter: `drop-shadow(0 0 6px ${ELITE_TOKENS.primary})`,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-xl font-bold text-white">{weekProgress}%</span>
            </div>
          </div>
          <div>
            <EliteLabel>Progreso Semanal</EliteLabel>
            <p className="text-white/70 text-sm mt-1">
              {weekProgress >= 80 ? '¡Excelente ritmo!' : weekProgress >= 50 ? 'Buen avance' : 'Sigue adelante'}
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <EliteLabel>{metric.label}</EliteLabel>
                <TrendIcon trend={metric.trend} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl font-bold text-white">{metric.value}</span>
                <span className="text-white/50 text-sm">{metric.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EliteCard>
  );
};

// ============================================
// 4. ACHIEVEMENT UNLOCK - Dramatic reveal
// ============================================
export const AchievementUnlock: React.FC<WidgetActionProps<AchievementUnlockProps>> = ({ data, onAction }) => {
  const { title, description, rarity, xpReward, icon } = data;
  const [claimed, setClaimed] = useState(false);

  const rarityConfig = {
    common: { label: 'Común', color: '#9CA3AF', glow: 'rgba(156, 163, 175, 0.3)' },
    rare: { label: 'Raro', color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.3)' },
    epic: { label: 'Épico', color: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.3)' },
    legendary: { label: 'Legendario', color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.5)' },
  };

  const config = rarityConfig[rarity];

  const handleClaim = () => {
    setClaimed(true);
    onAction?.('CLAIM_ACHIEVEMENT');
  };

  return (
    <EliteCard>
      <div className="text-center space-y-4">
        {/* Glow Badge Icon */}
        <div className="relative inline-block">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
            style={{
              background: `linear-gradient(135deg, ${config.color}40 0%, ${config.color}10 100%)`,
              boxShadow: `0 0 40px ${config.glow}`,
              border: `2px solid ${config.color}60`,
            }}
          >
            {icon || <Trophy className="w-10 h-10" style={{ color: config.color }} />}
          </div>
          <Sparkles
            className="absolute -top-1 -right-1 w-6 h-6 animate-pulse"
            style={{ color: config.color }}
          />
        </div>

        {/* Rarity Badge */}
        <div
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold"
          style={{
            backgroundColor: `${config.color}20`,
            color: config.color,
          }}
        >
          {rarity === 'legendary' && <Crown className="w-3 h-3" />}
          {config.label}
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <EliteHeadline size="md">{title}</EliteHeadline>
          <p className="text-white/60 text-sm">{description}</p>
        </div>

        {/* XP Reward */}
        <div className="flex items-center justify-center gap-2 text-white/80">
          <Star className="w-5 h-5 text-yellow-400" />
          <span className="font-mono font-bold text-lg">+{xpReward} XP</span>
        </div>

        {/* Claim Button */}
        {!claimed ? (
          <EliteButton onClick={handleClaim}>
            Reclamar Logro
          </EliteButton>
        ) : (
          <div className="flex items-center justify-center gap-2 text-green-400 py-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-xs">Reclamado</span>
          </div>
        )}
      </div>
    </EliteCard>
  );
};

// ============================================
// 5. GOAL COMMITMENT - Commitment card
// ============================================
export const GoalCommitment: React.FC<WidgetActionProps<GoalCommitmentProps>> = ({ data, onAction }) => {
  const { goalText, deadline, milestones, committed: initialCommitted } = data;
  const [committed, setCommitted] = useState(initialCommitted);
  const completedCount = milestones.filter(m => m.completed).length;
  const progress = (completedCount / milestones.length) * 100;

  const handleCommit = () => {
    setCommitted(true);
    onAction?.('COMMIT_GOAL');
  };

  return (
    <EliteCard>
      <div className="space-y-5">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" style={{ color: ELITE_TOKENS.primary }} />
            <EliteLabel>Objetivo</EliteLabel>
          </div>
          <EliteHeadline size="lg">{goalText}</EliteHeadline>
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Clock className="w-4 h-4" />
          <span>Fecha límite: {deadline}</span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <EliteLabel>Progreso</EliteLabel>
            <span className="font-mono text-sm text-white/80">
              {completedCount}/{milestones.length}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: ELITE_TOKENS.gradient,
                boxShadow: `0 0 10px ${ELITE_TOKENS.primary}80`,
              }}
            />
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-2">
          {milestones.map((milestone, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                milestone.completed ? 'bg-white/5' : 'bg-transparent'
              }`}
            >
              {milestone.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-white/30 shrink-0" />
              )}
              <span className={`text-sm ${milestone.completed ? 'text-white/60 line-through' : 'text-white/80'}`}>
                {milestone.text}
              </span>
            </div>
          ))}
        </div>

        {/* Commitment Button */}
        {!committed ? (
          <EliteButton onClick={handleCommit}>
            Me Comprometo
          </EliteButton>
        ) : (
          <EliteButton variant="secondary" onClick={() => {}}>
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Comprometido
            </span>
          </EliteButton>
        )}
      </div>
    </EliteCard>
  );
};

// Widget Map for registration
export const GENESIS_X_WIDGET_MAP: Record<string, React.FC<any>> = {
  'hero-card-elite': HeroCard,
  'workout-card-elite': WorkoutCardElite,
  'progress-dashboard-elite': ProgressDashboardElite,
  'achievement-unlock': AchievementUnlock,
  'goal-commitment': GoalCommitment,
};

export default GENESIS_X_WIDGET_MAP;
