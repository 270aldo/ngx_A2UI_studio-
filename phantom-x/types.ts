// phantom-x/types.ts
// TypeScript interfaces for phantom_X module

// Base component props
export interface PhantomCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glowIntensity?: 'subtle' | 'medium' | 'intense';
}

// Demo interface for sidebar
export interface PhantomXDemo {
  id: string;
  name: string;
  component: string;
  description: string;
  icon: string;
  color: string;
  defaultProps: Record<string, any>;
}

// ============================================
// ADAPTED WIDGET PROPS (from Elite)
// ============================================

export interface HeroCardPhantomProps {
  title: string;
  subtitle: string;
  ctaText: string;
}

export interface WorkoutCardPhantomProps {
  title: string;
  category: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high' | 'extreme';
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
  }>;
}

export interface ProgressDashboardPhantomProps {
  weekProgress: number;
  streak: number;
  level: number;
  levelTitle: string;
  metrics: Array<{
    label: string;
    value: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
  }>;
}

export interface AchievementPhantomProps {
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  icon?: React.ReactNode;
}

export interface GoalCommitmentPhantomProps {
  goalText: string;
  deadline: string;
  committed: boolean;
  milestones: Array<{
    text: string;
    completed: boolean;
  }>;
}

// ============================================
// NEW WIDGET PROPS
// ============================================

export interface StatsGridPhantomProps {
  title: string;
  stats: Array<{
    label: string;
    value: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    change: number;
    sparkline: number[];
  }>;
  columns?: 2 | 3 | 4;
}

export interface LeaderboardPhantomProps {
  title: string;
  entries: Array<{
    rank: number;
    name: string;
    avatar?: string;
    score: number;
    badge?: string;
    isCurrentUser?: boolean;
  }>;
  metric: string;
}

export interface ActivityFeedPhantomProps {
  activities: Array<{
    type: 'workout' | 'achievement' | 'goal' | 'streak' | 'social';
    title: string;
    description: string;
    timestamp: string;
    icon?: React.ReactNode;
  }>;
  maxItems?: number;
}

export interface CountdownTimerPhantomProps {
  targetDate: string;
  eventName: string;
  description?: string;
}

export interface ProfileCardPhantomProps {
  name: string;
  avatar?: string;
  level: number;
  title: string;
  xp: {
    current: number;
    nextLevel: number;
  };
  stats: Array<{
    label: string;
    value: string;
  }>;
  badges: string[];
}
