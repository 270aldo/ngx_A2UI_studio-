// phantom-x/PhantomXWidgets.tsx
// All phantom_X widgets implementation

import React, { useState, useEffect } from 'react';
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
  Activity,
  Award,
  User,
  Users,
  Calendar,
  MessageCircle,
  BarChart3,
} from 'lucide-react';
import { PhantomCard, PhantomButton, PhantomLabel, PhantomHeadline, PhantomBadge, PhantomProgress, PHANTOM_TOKENS } from './PhantomCard';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type {
  HeroCardPhantomProps,
  WorkoutCardPhantomProps,
  ProgressDashboardPhantomProps,
  AchievementPhantomProps,
  GoalCommitmentPhantomProps,
  StatsGridPhantomProps,
  LeaderboardPhantomProps,
  ActivityFeedPhantomProps,
  CountdownTimerPhantomProps,
  ProfileCardPhantomProps,
} from './types';

// Widget wrapper interface (matches WidgetRenderer pattern)
interface WidgetActionProps<T = any> {
  data: T;
  onAction?: (action: string, payload?: any) => void;
}

// ============================================
// 1. HERO CARD PHANTOM - CTA with glow
// ============================================
export const HeroCardPhantom: React.FC<WidgetActionProps<HeroCardPhantomProps>> = ({ data, onAction }) => {
  const { title, subtitle, ctaText } = data;

  return (
    <PhantomCard glowIntensity="medium" className="text-center py-10">
      <div className="space-y-6">
        {/* Icon with glow ring */}
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2"
          style={{
            background: `${PHANTOM_TOKENS.primary}20`,
            border: `2px solid ${PHANTOM_TOKENS.primary}40`,
            boxShadow: `0 0 30px ${PHANTOM_TOKENS.glowMedium}`,
          }}
        >
          <Zap className="w-8 h-8" style={{ color: PHANTOM_TOKENS.primary }} />
        </div>

        <div className="space-y-2">
          <PhantomHeadline size="xl">{title}</PhantomHeadline>
          <p style={{ color: PHANTOM_TOKENS.textSecondary }} className="text-sm max-w-xs mx-auto">
            {subtitle}
          </p>
        </div>

        <PhantomButton onClick={() => onAction?.('CTA_CLICK')}>
          {ctaText}
        </PhantomButton>
      </div>
    </PhantomCard>
  );
};

// ============================================
// 2. WORKOUT CARD PHANTOM - Premium routine
// ============================================
export const WorkoutCardPhantom: React.FC<WidgetActionProps<WorkoutCardPhantomProps>> = ({ data, onAction }) => {
  const { title, category, duration, exercises, intensity } = data;

  const intensityConfig = {
    low: { label: 'Baja', glow: PHANTOM_TOKENS.glow },
    medium: { label: 'Media', glow: PHANTOM_TOKENS.glow },
    high: { label: 'Alta', glow: PHANTOM_TOKENS.glowMedium },
    extreme: { label: 'Extrema', glow: PHANTOM_TOKENS.glowIntense },
  };

  const config = intensityConfig[intensity];

  return (
    <PhantomCard>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <PhantomLabel>{category}</PhantomLabel>
            <PhantomHeadline size="md">{title}</PhantomHeadline>
          </div>
          <PhantomBadge variant="glow">
            <Flame className="w-3 h-3" />
            {config.label}
          </PhantomBadge>
        </div>

        {/* Metrics */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2" style={{ color: PHANTOM_TOKENS.textSecondary }}>
            <Clock className="w-4 h-4" style={{ color: PHANTOM_TOKENS.primary }} />
            <span className="text-sm font-mono">{duration} min</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: PHANTOM_TOKENS.textSecondary }}>
            <Dumbbell className="w-4 h-4" style={{ color: PHANTOM_TOKENS.primary }} />
            <span className="text-sm font-mono">{exercises.length} ejercicios</span>
          </div>
        </div>

        {/* Exercises List */}
        <div
          className="space-y-2 pt-4"
          style={{ borderTop: `1px solid ${PHANTOM_TOKENS.primary}20` }}
        >
          {exercises.slice(0, 4).map((ex, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span style={{ color: PHANTOM_TOKENS.textSecondary }}>{ex.name}</span>
              <span className="font-mono" style={{ color: PHANTOM_TOKENS.textMuted }}>
                {ex.sets}×{ex.reps}
              </span>
            </div>
          ))}
          {exercises.length > 4 && (
            <p className="text-xs" style={{ color: PHANTOM_TOKENS.textMuted }}>
              +{exercises.length - 4} más
            </p>
          )}
        </div>

        {/* CTA */}
        <PhantomButton onClick={() => onAction?.('START_WORKOUT')}>
          Iniciar Entrenamiento
        </PhantomButton>
      </div>
    </PhantomCard>
  );
};

// ============================================
// 3. PROGRESS DASHBOARD PHANTOM - Metrics
// ============================================
export const ProgressDashboardPhantom: React.FC<WidgetActionProps<ProgressDashboardPhantomProps>> = ({ data }) => {
  const { weekProgress, metrics, streak, level, levelTitle } = data;

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3" style={{ color: PHANTOM_TOKENS.textMuted }} />;
  };

  return (
    <PhantomCard hover={false}>
      <div className="space-y-6">
        {/* Level Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-mono text-xl font-bold"
              style={{
                background: `${PHANTOM_TOKENS.primary}20`,
                border: `2px solid ${PHANTOM_TOKENS.primary}`,
                boxShadow: `0 0 20px ${PHANTOM_TOKENS.glowMedium}`,
                color: PHANTOM_TOKENS.primary,
              }}
            >
              {level}
            </div>
            <div>
              <PhantomLabel>Nivel Actual</PhantomLabel>
              <p className="font-bold" style={{ color: PHANTOM_TOKENS.textPrimary }}>{levelTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5" style={{ color: PHANTOM_TOKENS.primary }} />
            <span className="font-mono text-2xl font-bold" style={{ color: PHANTOM_TOKENS.textPrimary }}>{streak}</span>
            <PhantomLabel>días</PhantomLabel>
          </div>
        </div>

        {/* Week Progress Ring */}
        <div
          className="flex items-center gap-4 rounded-xl p-4"
          style={{ background: `${PHANTOM_TOKENS.primary}10` }}
        >
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke={PHANTOM_TOKENS.border}
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke={PHANTOM_TOKENS.primary}
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${(weekProgress / 100) * 226} 226`}
                strokeLinecap="round"
                style={{
                  filter: `drop-shadow(0 0 8px ${PHANTOM_TOKENS.primary})`,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-xl font-bold" style={{ color: PHANTOM_TOKENS.textPrimary }}>
                {weekProgress}%
              </span>
            </div>
          </div>
          <div>
            <PhantomLabel>Progreso Semanal</PhantomLabel>
            <p className="text-sm mt-1" style={{ color: PHANTOM_TOKENS.textSecondary }}>
              {weekProgress >= 80 ? '¡Excelente ritmo!' : weekProgress >= 50 ? 'Buen avance' : 'Sigue adelante'}
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric, i) => (
            <div
              key={i}
              className="rounded-lg p-3 transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: `${PHANTOM_TOKENS.primary}08`,
                border: `1px solid ${PHANTOM_TOKENS.border}`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <PhantomLabel>{metric.label}</PhantomLabel>
                <TrendIcon trend={metric.trend} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl font-bold" style={{ color: PHANTOM_TOKENS.textPrimary }}>
                  {metric.value}
                </span>
                <span className="text-sm" style={{ color: PHANTOM_TOKENS.textMuted }}>{metric.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhantomCard>
  );
};

// ============================================
// 4. ACHIEVEMENT PHANTOM - Dramatic reveal
// ============================================
export const AchievementPhantom: React.FC<WidgetActionProps<AchievementPhantomProps>> = ({ data, onAction }) => {
  const { title, description, rarity, xpReward, icon } = data;
  const [claimed, setClaimed] = useState(false);

  // Glow intensity based on rarity
  const rarityGlow = {
    common: PHANTOM_TOKENS.glow,
    rare: PHANTOM_TOKENS.glowMedium,
    epic: PHANTOM_TOKENS.glowMedium,
    legendary: PHANTOM_TOKENS.glowIntense,
  };

  const rarityLabels = {
    common: 'Común',
    rare: 'Raro',
    epic: 'Épico',
    legendary: 'Legendario',
  };

  const handleClaim = () => {
    setClaimed(true);
    onAction?.('CLAIM_ACHIEVEMENT');
  };

  return (
    <PhantomCard glowIntensity={rarity === 'legendary' ? 'intense' : 'medium'}>
      <div className="text-center space-y-4">
        {/* Glow Badge Icon */}
        <div className="relative inline-block">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
            style={{
              background: `${PHANTOM_TOKENS.primary}20`,
              boxShadow: `0 0 40px ${rarityGlow[rarity]}`,
              border: `2px solid ${PHANTOM_TOKENS.primary}60`,
            }}
          >
            {icon || <Trophy className="w-10 h-10" style={{ color: PHANTOM_TOKENS.primary }} />}
          </div>
          <Sparkles
            className="absolute -top-1 -right-1 w-6 h-6 animate-pulse"
            style={{ color: PHANTOM_TOKENS.accent }}
          />
        </div>

        {/* Rarity Badge */}
        <PhantomBadge variant="glow">
          {rarity === 'legendary' && <Crown className="w-3 h-3" />}
          {rarityLabels[rarity]}
        </PhantomBadge>

        {/* Title & Description */}
        <div className="space-y-1">
          <PhantomHeadline size="md">{title}</PhantomHeadline>
          <p className="text-sm" style={{ color: PHANTOM_TOKENS.textSecondary }}>{description}</p>
        </div>

        {/* XP Reward */}
        <div className="flex items-center justify-center gap-2">
          <Star className="w-5 h-5" style={{ color: PHANTOM_TOKENS.accent }} />
          <span className="font-mono font-bold text-lg" style={{ color: PHANTOM_TOKENS.textPrimary }}>
            +{xpReward} XP
          </span>
        </div>

        {/* Claim Button */}
        {!claimed ? (
          <PhantomButton onClick={handleClaim}>
            Reclamar Logro
          </PhantomButton>
        ) : (
          <div className="flex items-center justify-center gap-2 py-3" style={{ color: PHANTOM_TOKENS.primary }}>
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-xs">Reclamado</span>
          </div>
        )}
      </div>
    </PhantomCard>
  );
};

// ============================================
// 5. GOAL COMMITMENT PHANTOM - With milestones
// ============================================
export const GoalCommitmentPhantom: React.FC<WidgetActionProps<GoalCommitmentPhantomProps>> = ({ data, onAction }) => {
  const { goalText, deadline, milestones, committed: initialCommitted } = data;
  const [committed, setCommitted] = useState(initialCommitted);
  const completedCount = milestones.filter(m => m.completed).length;
  const progress = (completedCount / milestones.length) * 100;

  const handleCommit = () => {
    setCommitted(true);
    onAction?.('COMMIT_GOAL');
  };

  return (
    <PhantomCard>
      <div className="space-y-5">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" style={{ color: PHANTOM_TOKENS.primary }} />
            <PhantomLabel>Objetivo</PhantomLabel>
          </div>
          <PhantomHeadline size="lg">{goalText}</PhantomHeadline>
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-2 text-sm" style={{ color: PHANTOM_TOKENS.textSecondary }}>
          <Clock className="w-4 h-4" style={{ color: PHANTOM_TOKENS.primary }} />
          <span>Fecha límite: {deadline}</span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <PhantomLabel>Progreso</PhantomLabel>
            <span className="font-mono text-sm" style={{ color: PHANTOM_TOKENS.textSecondary }}>
              {completedCount}/{milestones.length}
            </span>
          </div>
          <PhantomProgress value={progress} />
        </div>

        {/* Milestones */}
        <div className="space-y-2">
          {milestones.map((milestone, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors`}
              style={{
                background: milestone.completed ? `${PHANTOM_TOKENS.primary}10` : 'transparent',
              }}
            >
              {milestone.completed ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: PHANTOM_TOKENS.primary }} />
              ) : (
                <Circle className="w-5 h-5 shrink-0" style={{ color: PHANTOM_TOKENS.border }} />
              )}
              <span
                className={`text-sm ${milestone.completed ? 'line-through' : ''}`}
                style={{ color: milestone.completed ? PHANTOM_TOKENS.textMuted : PHANTOM_TOKENS.textSecondary }}
              >
                {milestone.text}
              </span>
            </div>
          ))}
        </div>

        {/* Commitment Button */}
        {!committed ? (
          <PhantomButton onClick={handleCommit}>
            Me Comprometo
          </PhantomButton>
        ) : (
          <PhantomButton variant="secondary">
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Comprometido
            </span>
          </PhantomButton>
        )}
      </div>
    </PhantomCard>
  );
};

// ============================================
// 6. STATS GRID PHANTOM - Metrics with sparklines
// ============================================
export const StatsGridPhantom: React.FC<WidgetActionProps<StatsGridPhantomProps>> = ({ data }) => {
  const { title, stats, columns = 2 } = data;

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4" style={{ color: PHANTOM_TOKENS.textMuted }} />;
  };

  return (
    <PhantomCard hover={false}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" style={{ color: PHANTOM_TOKENS.primary }} />
          <PhantomHeadline size="sm">{title}</PhantomHeadline>
        </div>

        <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: PHANTOM_TOKENS.surface,
                border: `1px solid ${PHANTOM_TOKENS.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 20px ${PHANTOM_TOKENS.glow}`;
                e.currentTarget.style.borderColor = PHANTOM_TOKENS.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = PHANTOM_TOKENS.border;
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <PhantomLabel>{stat.label}</PhantomLabel>
                <div className="flex items-center gap-1">
                  <TrendIcon trend={stat.trend} />
                  <span
                    className="text-xs font-mono"
                    style={{ color: stat.trend === 'up' ? '#10B981' : stat.trend === 'down' ? '#EF4444' : PHANTOM_TOKENS.textMuted }}
                  >
                    {stat.change > 0 ? '+' : ''}{stat.change}%
                  </span>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-bold" style={{ color: PHANTOM_TOKENS.textPrimary }}>
                    {stat.value}
                  </span>
                  <span className="text-sm" style={{ color: PHANTOM_TOKENS.textMuted }}>{stat.unit}</span>
                </div>

                {/* Mini Sparkline */}
                <div className="w-16 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stat.sparkline.map((v, idx) => ({ value: v, idx }))}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={PHANTOM_TOKENS.primary}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhantomCard>
  );
};

// ============================================
// 7. LEADERBOARD PHANTOM - Ranking
// ============================================
export const LeaderboardPhantom: React.FC<WidgetActionProps<LeaderboardPhantomProps>> = ({ data }) => {
  const { title, entries, metric } = data;

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  return (
    <PhantomCard hover={false}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" style={{ color: PHANTOM_TOKENS.primary }} />
          <PhantomHeadline size="sm">{title}</PhantomHeadline>
        </div>

        <div className="space-y-2">
          {entries.map((entry) => {
            const medal = getMedalEmoji(entry.rank);
            const isTop3 = entry.rank <= 3;

            return (
              <div
                key={entry.rank}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300"
                style={{
                  background: entry.isCurrentUser ? `${PHANTOM_TOKENS.primary}15` : `${PHANTOM_TOKENS.primary}05`,
                  border: entry.isCurrentUser ? `2px solid ${PHANTOM_TOKENS.primary}` : `1px solid ${PHANTOM_TOKENS.border}`,
                  boxShadow: isTop3 ? `0 0 15px ${PHANTOM_TOKENS.glow}` : 'none',
                }}
              >
                {/* Rank */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm"
                  style={{
                    background: isTop3 ? `${PHANTOM_TOKENS.primary}20` : PHANTOM_TOKENS.border,
                    color: isTop3 ? PHANTOM_TOKENS.primary : PHANTOM_TOKENS.textMuted,
                  }}
                >
                  {medal || entry.rank}
                </div>

                {/* Avatar & Name */}
                <div className="flex-1 flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: `${PHANTOM_TOKENS.primary}20`,
                      border: entry.isCurrentUser ? `2px solid ${PHANTOM_TOKENS.primary}` : 'none',
                      color: PHANTOM_TOKENS.primary,
                    }}
                  >
                    {entry.avatar || entry.name.charAt(0)}
                  </div>
                  <span
                    className="font-medium"
                    style={{ color: entry.isCurrentUser ? PHANTOM_TOKENS.textPrimary : PHANTOM_TOKENS.textSecondary }}
                  >
                    {entry.name}
                    {entry.isCurrentUser && <span className="text-xs ml-1" style={{ color: PHANTOM_TOKENS.primary }}>(Tú)</span>}
                  </span>
                </div>

                {/* Score */}
                <div className="text-right">
                  <span className="font-mono font-bold" style={{ color: PHANTOM_TOKENS.textPrimary }}>
                    {entry.score.toLocaleString()}
                  </span>
                  <span className="text-xs ml-1" style={{ color: PHANTOM_TOKENS.textMuted }}>{metric}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PhantomCard>
  );
};

// ============================================
// 8. ACTIVITY FEED PHANTOM - Timeline
// ============================================
export const ActivityFeedPhantom: React.FC<WidgetActionProps<ActivityFeedPhantomProps>> = ({ data }) => {
  const { activities, maxItems = 5 } = data;

  const typeIcons: Record<string, React.ReactNode> = {
    workout: <Dumbbell className="w-4 h-4" />,
    achievement: <Trophy className="w-4 h-4" />,
    goal: <Target className="w-4 h-4" />,
    streak: <Flame className="w-4 h-4" />,
    social: <MessageCircle className="w-4 h-4" />,
  };

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <PhantomCard hover={false}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5" style={{ color: PHANTOM_TOKENS.primary }} />
          <PhantomHeadline size="sm">Actividad Reciente</PhantomHeadline>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-4 top-0 bottom-0 w-0.5"
            style={{ background: `${PHANTOM_TOKENS.primary}30` }}
          />

          <div className="space-y-4">
            {displayedActivities.map((activity, i) => (
              <div key={i} className="flex gap-4 relative">
                {/* Icon */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10"
                  style={{
                    background: PHANTOM_TOKENS.surface,
                    border: `2px solid ${PHANTOM_TOKENS.primary}`,
                    color: PHANTOM_TOKENS.primary,
                    boxShadow: `0 0 10px ${PHANTOM_TOKENS.glow}`,
                  }}
                >
                  {activity.icon || typeIcons[activity.type]}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <p className="font-medium text-sm" style={{ color: PHANTOM_TOKENS.textPrimary }}>
                    {activity.title}
                  </p>
                  <p className="text-xs" style={{ color: PHANTOM_TOKENS.textMuted }}>
                    {activity.description}
                  </p>
                  <p className="text-[10px] mt-1" style={{ color: PHANTOM_TOKENS.textMuted }}>
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PhantomCard>
  );
};

// ============================================
// 9. COUNTDOWN TIMER PHANTOM - Event countdown
// ============================================
export const CountdownTimerPhantom: React.FC<WidgetActionProps<CountdownTimerPhantomProps>> = ({ data }) => {
  const { targetDate, eventName, description } = data;
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setIsUrgent(days === 0 && hours < 24);
      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="text-center">
      <div
        className="font-mono text-3xl font-bold px-3 py-2 rounded-xl"
        style={{
          background: `${PHANTOM_TOKENS.primary}15`,
          color: PHANTOM_TOKENS.textPrimary,
          boxShadow: isUrgent ? `0 0 20px ${PHANTOM_TOKENS.glowIntense}` : `0 0 10px ${PHANTOM_TOKENS.glow}`,
          border: `1px solid ${PHANTOM_TOKENS.primary}40`,
        }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <PhantomLabel className="mt-2 block">{label}</PhantomLabel>
    </div>
  );

  return (
    <PhantomCard glowIntensity={isUrgent ? 'intense' : 'subtle'}>
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" style={{ color: PHANTOM_TOKENS.primary }} />
            <PhantomLabel>Cuenta Regresiva</PhantomLabel>
          </div>
          <PhantomHeadline size="lg">{eventName}</PhantomHeadline>
          {description && (
            <p className="text-sm" style={{ color: PHANTOM_TOKENS.textSecondary }}>{description}</p>
          )}
        </div>

        <div className="flex items-center justify-center gap-2">
          <TimeUnit value={timeLeft.days} label="Días" />
          <span className="text-2xl font-bold animate-pulse" style={{ color: PHANTOM_TOKENS.primary }}>:</span>
          <TimeUnit value={timeLeft.hours} label="Hrs" />
          <span className="text-2xl font-bold animate-pulse" style={{ color: PHANTOM_TOKENS.primary }}>:</span>
          <TimeUnit value={timeLeft.minutes} label="Min" />
          <span className="text-2xl font-bold animate-pulse" style={{ color: PHANTOM_TOKENS.primary }}>:</span>
          <TimeUnit value={timeLeft.seconds} label="Seg" />
        </div>

        {isUrgent && (
          <PhantomBadge variant="glow">
            <Flame className="w-3 h-3" />
            ¡Tiempo limitado!
          </PhantomBadge>
        )}
      </div>
    </PhantomCard>
  );
};

// ============================================
// 10. PROFILE CARD PHANTOM - User profile
// ============================================
export const ProfileCardPhantom: React.FC<WidgetActionProps<ProfileCardPhantomProps>> = ({ data }) => {
  const { name, avatar, level, title, xp, stats, badges } = data;
  const xpProgress = (xp.current / xp.nextLevel) * 100;

  return (
    <PhantomCard>
      <div className="space-y-5">
        {/* Avatar & Info */}
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
            style={{
              background: `${PHANTOM_TOKENS.primary}20`,
              border: `3px solid ${PHANTOM_TOKENS.primary}`,
              boxShadow: `0 0 20px ${PHANTOM_TOKENS.glowMedium}`,
              color: PHANTOM_TOKENS.primary,
            }}
          >
            {avatar || <User className="w-8 h-8" />}
          </div>
          <div className="flex-1">
            <PhantomHeadline size="md">{name}</PhantomHeadline>
            <div className="flex items-center gap-2 mt-1">
              <PhantomBadge variant="glow">
                <Crown className="w-3 h-3" />
                Nivel {level}
              </PhantomBadge>
              <span className="text-sm" style={{ color: PHANTOM_TOKENS.textSecondary }}>{title}</span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <PhantomLabel>Experiencia</PhantomLabel>
            <span className="font-mono text-sm" style={{ color: PHANTOM_TOKENS.textSecondary }}>
              {xp.current.toLocaleString()} / {xp.nextLevel.toLocaleString()} XP
            </span>
          </div>
          <PhantomProgress value={xpProgress} />
        </div>

        {/* Stats Row */}
        <div className="flex justify-between">
          {stats.slice(0, 4).map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-mono font-bold" style={{ color: PHANTOM_TOKENS.textPrimary }}>{stat.value}</p>
              <PhantomLabel>{stat.label}</PhantomLabel>
            </div>
          ))}
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex items-center gap-2 pt-3" style={{ borderTop: `1px solid ${PHANTOM_TOKENS.border}` }}>
            <PhantomLabel>Badges</PhantomLabel>
            <div className="flex gap-1">
              {badges.slice(0, 3).map((badge, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{
                    background: `${PHANTOM_TOKENS.primary}20`,
                    border: `1px solid ${PHANTOM_TOKENS.primary}40`,
                  }}
                >
                  {badge}
                </div>
              ))}
              {badges.length > 3 && (
                <span className="text-xs ml-1" style={{ color: PHANTOM_TOKENS.textMuted }}>
                  +{badges.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </PhantomCard>
  );
};

// ============================================
// WIDGET MAP for registration
// ============================================
export const PHANTOM_X_WIDGET_MAP: Record<string, React.FC<any>> = {
  // Adapted from Elite
  'hero-card-phantom': HeroCardPhantom,
  'workout-card-phantom': WorkoutCardPhantom,
  'progress-dashboard-phantom': ProgressDashboardPhantom,
  'achievement-phantom': AchievementPhantom,
  'goal-commitment-phantom': GoalCommitmentPhantom,
  // New widgets
  'stats-grid-phantom': StatsGridPhantom,
  'leaderboard-phantom': LeaderboardPhantom,
  'activity-feed-phantom': ActivityFeedPhantom,
  'countdown-timer-phantom': CountdownTimerPhantom,
  'profile-card-phantom': ProfileCardPhantom,
};

export default PHANTOM_X_WIDGET_MAP;
