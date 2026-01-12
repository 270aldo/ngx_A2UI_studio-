// phantom-x/index.ts
// Main exports for phantom_X module

// Design tokens and base components
export {
  PHANTOM_TOKENS,
  PhantomCard,
  PhantomButton,
  PhantomLabel,
  PhantomHeadline,
  PhantomBadge,
  PhantomProgress,
} from './PhantomCard';

// Widget components and map
export {
  HeroCardPhantom,
  WorkoutCardPhantom,
  ProgressDashboardPhantom,
  AchievementPhantom,
  GoalCommitmentPhantom,
  StatsGridPhantom,
  LeaderboardPhantom,
  ActivityFeedPhantom,
  CountdownTimerPhantom,
  ProfileCardPhantom,
  PHANTOM_X_WIDGET_MAP,
} from './PhantomXWidgets';

// Demo configurations
export { PHANTOM_X_DEMOS } from './demos';

// Type exports
export type {
  PhantomCardProps,
  PhantomXDemo,
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
