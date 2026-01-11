// genesis_X Elite Protocol Types

export interface EliteCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export interface HeroCardProps {
  title: string;
  subtitle: string;
  ctaText: string;
  onAction?: () => void;
}

export interface WorkoutCardEliteProps {
  title: string;
  category: string;
  duration: number;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
  }>;
  intensity: 'low' | 'medium' | 'high' | 'extreme';
  onStart?: () => void;
}

export interface ProgressDashboardEliteProps {
  weekProgress: number;
  metrics: Array<{
    label: string;
    value: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
  }>;
  streak: number;
  level: number;
  levelTitle: string;
}

export interface AchievementUnlockProps {
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  icon: React.ReactNode;
  onClaim?: () => void;
}

export interface GoalCommitmentProps {
  goalText: string;
  deadline: string;
  milestones: Array<{
    text: string;
    completed: boolean;
  }>;
  committed: boolean;
  onCommit?: () => void;
}
