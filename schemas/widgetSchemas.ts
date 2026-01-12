import { z } from 'zod';

// === BASE SCHEMAS ===
const TrendSchema = z.enum(['up', 'down', 'stable']);
const StatusSchema = z.enum(['good', 'warning', 'low']);
const RaritySchema = z.enum(['common', 'rare', 'epic', 'legendary']);

// === DASHBOARD WIDGETS ===
export const ProgressDashboardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  progress: z.number().min(0).max(100),
  metrics: z.array(z.object({
    label: z.string(),
    value: z.string(),
    trend: TrendSchema.optional()
  })).optional()
});

export const MetricCardSchema = z.object({
  label: z.string().min(1),
  value: z.union([z.string(), z.number()]),
  unit: z.string().optional(),
  trend: TrendSchema.optional(),
  change: z.string().optional()
});

export const TodayCardSchema = z.object({
  greeting: z.string(),
  date: z.string(),
  mainSession: z.object({
    title: z.string(),
    time: z.string(),
    type: z.string()
  }).optional(),
  todos: z.array(z.object({
    label: z.string(),
    done: z.boolean()
  })).optional()
});

export const InsightCardSchema = z.object({
  message: z.string().min(1)
});

// === TRAINING WIDGETS ===
export const WorkoutCardSchema = z.object({
  title: z.string().min(1),
  category: z.string(),
  duration: z.string(),
  workoutId: z.string().optional(),
  exercises: z.array(z.object({
    name: z.string(),
    sets: z.number().positive(),
    reps: z.union([z.string(), z.number()]),
    load: z.string().optional()
  })),
  coachNote: z.string().optional()
});

export const ExerciseRowSchema = z.object({
  name: z.string().min(1),
  currentSet: z.number().positive(),
  totalSets: z.number().positive(),
  load: z.string(),
  reps: z.union([z.string(), z.number()])
});

export const RestTimerSchema = z.object({
  seconds: z.number().min(1).max(600),
  autoStart: z.boolean().optional()
});

export const WorkoutHistorySchema = z.object({
  sessions: z.array(z.object({
    name: z.string(),
    date: z.string(),
    duration: z.string(),
    completed: z.boolean()
  })),
  weekSummary: z.object({
    total: z.number()
  }).optional()
});

export const LiveSessionSchema = z.object({
  exerciseName: z.string(),
  currentSet: z.number(),
  totalSets: z.number(),
  reps: z.union([z.string(), z.number()]),
  load: z.string(),
  timer: z.number().optional(),
  restMode: z.boolean().optional()
});

// === NUTRITION WIDGETS ===
export const MealPlanSchema = z.object({
  totalKcal: z.number().positive(),
  meals: z.array(z.object({
    time: z.string(),
    name: z.string(),
    kcal: z.number(),
    highlight: z.boolean().optional()
  }))
});

export const NutritionStrategySchema = z.object({
  goal: z.enum(['bulk', 'cut', 'maintain']),
  targetKcal: z.number().positive(),
  macroSplit: z.object({
    protein: z.number(),
    carbs: z.number(),
    fat: z.number()
  }),
  tips: z.array(z.string()).optional()
});

export const CalorieBalanceSchema = z.object({
  consumed: z.number(),
  burned: z.number(),
  target: z.number(),
  net: z.number()
});

export const MealSwapSchema = z.object({
  original: z.object({
    name: z.string(),
    kcal: z.number()
  }),
  alternative: z.object({
    name: z.string(),
    kcal: z.number(),
    benefit: z.string()
  })
});

export const MacroDialSchema = z.object({
  protein: z.object({ current: z.number(), goal: z.number() }),
  carbs: z.object({ current: z.number(), goal: z.number() }),
  fat: z.object({ current: z.number(), goal: z.number() })
});

// === HABITS WIDGETS ===
export const HydrationTrackerSchema = z.object({
  current: z.number().min(0),
  goal: z.number().positive()
});

export const SupplementStackSchema = z.object({
  items: z.array(z.object({
    name: z.string(),
    dose: z.string(),
    timing: z.string(),
    taken: z.boolean()
  }))
});

export const StreakCounterSchema = z.object({
  currentStreak: z.number().min(0),
  bestStreak: z.number().min(0)
});

export const HabitStreakSchema = z.object({
  habits: z.array(z.object({
    name: z.string(),
    icon: z.string().optional(),
    streak: z.number(),
    completed: z.boolean()
  }))
});

// === BIOMETRICS WIDGETS ===
export const HeartRateSchema = z.object({
  bpm: z.number().min(30).max(220),
  zone: z.enum(['rest', 'fat_burn', 'cardio', 'peak']),
  trend: TrendSchema.optional()
});

export const SleepTrackerSchema = z.object({
  hours: z.number().min(0).max(24),
  quality: z.enum(['excellent', 'good', 'fair', 'poor']),
  stages: z.array(z.object({
    name: z.string(),
    percent: z.number(),
    color: z.string()
  })).optional()
});

export const BodyStatsSchema = z.object({
  weight: z.number().positive(),
  bodyFat: z.number().min(0).max(100).optional(),
  muscle: z.number().optional(),
  weightChange: z.number().optional(),
  measurements: z.object({
    waist: z.number().optional(),
    chest: z.number().optional(),
    arms: z.number().optional()
  }).optional()
});

export const PainMapSchema = z.object({
  areas: z.array(z.object({
    name: z.string(),
    severity: z.number().min(1).max(5),
    notes: z.string().optional()
  })),
  lastUpdated: z.string().optional()
});

// === METABOLISM WIDGETS ===
export const GlucoseTrackerSchema = z.object({
  current: z.number(),
  min: z.number(),
  max: z.number(),
  trend: z.enum(['stable', 'rising', 'falling']),
  lastMeal: z.string().optional()
});

export const MetabolicScoreSchema = z.object({
  score: z.number().min(0).max(100),
  factors: z.array(z.object({
    name: z.string(),
    value: z.number(),
    status: StatusSchema
  }))
});

export const EnergyCurveSchema = z.object({
  hours: z.array(z.object({
    hour: z.string(),
    level: z.number().min(1).max(10)
  })),
  peakHour: z.string(),
  lowHour: z.string()
});

// === PLANNING WIDGETS ===
export const SeasonTimelineSchema = z.object({
  seasonName: z.string(),
  weeksCompleted: z.number(),
  totalWeeks: z.number(),
  phases: z.array(z.object({
    name: z.string(),
    active: z.boolean()
  }))
});

export const SeasonContractSchema = z.object({
  seasonName: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  goals: z.array(z.string()),
  signature: z.boolean().optional()
});

export const ReadinessBatterySchema = z.object({
  overall: z.number().min(0).max(100),
  hrv: z.number().optional(),
  sleep: z.number().optional(),
  soreness: z.number().optional(),
  energy: z.number().optional(),
  recommendation: z.string().optional()
});

// === RECAP WIDGETS ===
export const DailyRecapSchema = z.object({
  date: z.string(),
  workoutCompleted: z.boolean(),
  nutrition: z.object({
    kcal: z.number(),
    protein: z.number()
  }),
  habits: z.array(z.object({
    name: z.string(),
    done: z.boolean()
  })),
  insight: z.string().optional()
});

export const WeeklyReviewSchema = z.object({
  weekNumber: z.number(),
  stats: z.object({
    workouts: z.number(),
    avgKcal: z.number(),
    streakDays: z.number()
  }),
  wins: z.array(z.string()),
  improvements: z.array(z.string())
});

export const SeasonRecapSchema = z.object({
  seasonName: z.string(),
  duration: z.string(),
  achievements: z.array(z.string()),
  stats: z.object({
    totalWorkouts: z.number(),
    avgWeight: z.number().optional()
  }),
  nextSteps: z.array(z.string())
});

// === EDUCATION WIDGETS ===
export const ExplanationCardSchema = z.object({
  term: z.string(),
  definition: z.string(),
  example: z.string().optional(),
  category: z.string().optional()
});

export const MythBusterSchema = z.object({
  myth: z.string(),
  reality: z.string(),
  source: z.string().optional()
});

export const LearnMoreSchema = z.object({
  topic: z.string(),
  summary: z.string(),
  benefits: z.array(z.string()),
  actionButton: z.string().optional()
});

export const SourceCardSchema = z.object({
  title: z.string(),
  authors: z.string(),
  year: z.string(),
  journal: z.string(),
  keyFinding: z.string(),
  url: z.string().optional()
});

// === TOOLS WIDGETS ===
export const MaxRepCalculatorSchema = z.object({
  weight: z.number().positive(),
  reps: z.number().positive()
});

export const AlertBannerSchema = z.object({
  type: z.enum(['warning', 'error', 'success']),
  message: z.string()
});

export const CoachMessageSchema = z.object({
  coachName: z.string(),
  timestamp: z.string(),
  message: z.string()
});

export const AchievementSchema = z.object({
  title: z.string(),
  description: z.string(),
  unlockedAt: z.string()
});

export const BeforeAfterSchema = z.object({
  metric: z.string(),
  before: z.object({ value: z.string(), date: z.string() }),
  after: z.object({ value: z.string(), date: z.string() }),
  percentChange: z.number()
});

export const TrophyCaseSchema = z.object({
  trophies: z.array(z.object({
    name: z.string(),
    icon: z.string(),
    unlockedAt: z.string(),
    rarity: RaritySchema
  }))
});

// === RECOVERY WIDGETS ===
export const WindDownSchema = z.object({
  bedtimeGoal: z.string(),
  currentTime: z.string(),
  activities: z.array(z.object({
    name: z.string(),
    duration: z.string(),
    completed: z.boolean()
  })),
  sleepScore: z.number().optional()
});

// === INTERACTIVE WIDGETS ===
export const RepCounterSchema = z.object({
  targetReps: z.number().positive(),
  currentReps: z.number().min(0).optional(),
  exerciseName: z.string().optional()
});

export const WeightInputSchema = z.object({
  value: z.number().min(0),
  unit: z.enum(['kg', 'lb']).optional(),
  label: z.string().optional()
});

// === BLAZE ADVANCED WIDGETS ===
export const SupersetCardSchema = z.object({
  name: z.string(),
  restBetween: z.number().min(0),
  exercises: z.array(z.object({
    name: z.string(),
    sets: z.number().positive(),
    reps: z.union([z.string(), z.number()]),
    load: z.string().optional()
  })),
  notes: z.string().optional()
});

export const AMRAPTimerSchema = z.object({
  duration: z.number().positive(),
  exercises: z.array(z.object({
    name: z.string(),
    reps: z.number()
  })),
  currentRound: z.number().min(0).optional(),
  totalRounds: z.number().min(0).optional(),
  isRunning: z.boolean().optional()
});

export const EMOMClockSchema = z.object({
  totalMinutes: z.number().positive(),
  exercises: z.array(z.object({
    name: z.string(),
    reps: z.number()
  })),
  currentMinute: z.number().min(0).optional(),
  isRunning: z.boolean().optional()
});

// === WAVE RECOVERY WIDGETS ===
export const HRVChartSchema = z.object({
  score: z.number().optional(),
  readings: z.array(z.number()).optional(),
  trend: TrendSchema.optional(),
  recommendation: z.string().optional()
});

export const RecoveryScoreSchema = z.object({
  overall: z.number().min(0).max(100),
  factors: z.object({
    sleep: z.number(),
    hrv: z.number(),
    soreness: z.number(),
    stress: z.number()
  }),
  recommendation: z.string().optional()
});

export const StressMeterSchema = z.object({
  level: z.number().min(1).max(10),
  sources: z.array(z.object({
    name: z.string(),
    impact: z.string()
  })).optional(),
  recommendations: z.array(z.string()).optional()
});

// === METABOL ADVANCED WIDGETS ===
export const FastingTimerSchema = z.object({
  startTime: z.string(),
  targetHours: z.number().positive(),
  currentPhase: z.enum(['fed', 'early', 'ketosis', 'deep']).optional(),
  benefits: z.array(z.string()).optional()
});

export const KetoneTrackerSchema = z.object({
  reading: z.number().min(0),
  trend: z.enum(['rising', 'stable', 'falling']),
  zone: z.enum(['none', 'light', 'optimal', 'deep']),
  history: z.array(z.object({
    date: z.string(),
    value: z.number()
  })).optional()
});

export const TDEECalculatorSchema = z.object({
  bmr: z.number().positive(),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'extreme']),
  result: z.number().positive(),
  macroSplit: z.object({
    protein: z.number(),
    carbs: z.number(),
    fat: z.number()
  }).optional()
});

// === ATLAS BODY WIDGETS ===
export const BodyScan3DSchema = z.object({
  measurements: z.object({
    chest: z.number().optional(),
    waist: z.number().optional(),
    hips: z.number().optional(),
    arms: z.number().optional(),
    thighs: z.number().optional()
  }),
  highlights: z.array(z.object({
    area: z.string(),
    change: z.number(),
    trend: TrendSchema
  })).optional(),
  lastScan: z.string().optional()
});

export const PostureCheckSchema = z.object({
  overallScore: z.number().min(0).max(100),
  issues: z.array(z.object({
    area: z.string(),
    severity: z.number().min(1).max(5),
    description: z.string()
  })),
  exercises: z.array(z.object({
    name: z.string(),
    benefit: z.string()
  })).optional()
});

export const FlexibilityScoreSchema = z.object({
  overall: z.number().min(0).max(100),
  byArea: z.object({
    shoulders: z.number().optional(),
    hips: z.number().optional(),
    hamstrings: z.number().optional(),
    spine: z.number().optional()
  }),
  recommendations: z.array(z.string()).optional()
});

// === NOVA STRENGTH WIDGETS ===
export const PRTrackerSchema = z.object({
  exercise: z.string(),
  currentPR: z.object({
    weight: z.string(),
    date: z.string()
  }),
  history: z.array(z.object({
    weight: z.string(),
    date: z.string()
  })).optional(),
  projection: z.string().optional()
});

export const VolumeChartSchema = z.object({
  weeklyData: z.array(z.object({
    week: z.string(),
    volume: z.number()
  })),
  trend: TrendSchema,
  totalVolume: z.number(),
  recommendation: z.string().optional()
});

export const StrengthCurveSchema = z.object({
  exercise: z.string(),
  data: z.array(z.object({
    reps: z.number(),
    weight: z.number()
  })),
  estimatedMax: z.number(),
  weakPoints: z.array(z.string()).optional()
});

// === SPRINT 6 - INTERACTIVE CHARTS ===
export const MacroRadarSchema = z.object({
  title: z.string().optional(),
  macros: z.array(z.object({
    name: z.string(),
    actual: z.number(),
    goal: z.number()
  })).optional()
});

export const VolumeSparkSchema = z.object({
  title: z.string().optional(),
  unit: z.string().optional(),
  values: z.array(z.number()).optional(),
  labels: z.array(z.string()).optional()
});

export const BodyHeatmapSchema = z.object({
  title: z.string().optional(),
  muscles: z.record(z.number().min(0).max(100)).optional()
});

// === SPRINT 7 - GAMIFICATION ===
export const XPBarSchema = z.object({
  currentXP: z.number().min(0).optional(),
  levelXP: z.number().min(1).optional(),
  level: z.number().min(1).optional(),
  title: z.string().optional(),
  nextReward: z.string().optional()
});

export const DailyQuestsSchema = z.object({
  quests: z.array(z.object({
    id: z.number(),
    title: z.string(),
    xp: z.number(),
    completed: z.boolean(),
    progress: z.number().optional(),
    goal: z.number().optional()
  })).optional()
});

export const BadgeShowcaseSchema = z.object({
  title: z.string().optional(),
  badges: z.array(z.object({
    id: z.number(),
    name: z.string(),
    icon: z.string(),
    unlocked: z.boolean(),
    rarity: z.enum(['common', 'rare', 'epic', 'legendary']),
    hint: z.string().optional()
  })).optional()
});

export const ComboMultiplierSchema = z.object({
  combo: z.number().min(0).optional(),
  multiplier: z.number().min(1).optional(),
  maxCombo: z.number().min(1).optional(),
  timeLeft: z.number().min(0).optional()
});

// === SPRINT 10 - GENESIS_X ELITE PROTOCOL ===
const IntensitySchema = z.enum(['low', 'medium', 'high', 'extreme']);

export const HeroCardEliteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  ctaText: z.string().min(1, 'CTA text is required')
});

export const WorkoutCardEliteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  intensity: IntensitySchema,
  exercises: z.array(z.object({
    name: z.string().min(1),
    sets: z.number().min(1),
    reps: z.string().min(1)
  })).min(1, 'At least one exercise is required')
});

export const ProgressDashboardEliteSchema = z.object({
  weekProgress: z.number().min(0).max(100),
  streak: z.number().min(0),
  level: z.number().min(1),
  levelTitle: z.string().min(1),
  metrics: z.array(z.object({
    label: z.string().min(1),
    value: z.number(),
    unit: z.string(),
    trend: TrendSchema
  })).min(1, 'At least one metric is required')
});

export const AchievementUnlockSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  rarity: RaritySchema,
  xpReward: z.number().min(1, 'XP reward must be at least 1'),
  icon: z.any().optional()
});

export const GoalCommitmentSchema = z.object({
  goalText: z.string().min(1, 'Goal text is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  committed: z.boolean(),
  milestones: z.array(z.object({
    text: z.string().min(1),
    completed: z.boolean()
  })).min(1, 'At least one milestone is required')
});

// === SPRINT 11 - PHANTOM_X SCHEMAS ===

export const HeroCardPhantomSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  ctaText: z.string().min(1, 'CTA text is required')
});

export const WorkoutCardPhantomSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  intensity: IntensitySchema,
  exercises: z.array(z.object({
    name: z.string().min(1),
    sets: z.number().min(1),
    reps: z.string().min(1)
  })).min(1, 'At least one exercise is required')
});

export const ProgressDashboardPhantomSchema = z.object({
  weekProgress: z.number().min(0).max(100),
  streak: z.number().min(0),
  level: z.number().min(1),
  levelTitle: z.string().min(1),
  metrics: z.array(z.object({
    label: z.string().min(1),
    value: z.number(),
    unit: z.string(),
    trend: TrendSchema
  })).min(1, 'At least one metric is required')
});

export const AchievementPhantomSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  rarity: RaritySchema,
  xpReward: z.number().min(1, 'XP reward must be at least 1'),
  icon: z.any().optional()
});

export const GoalCommitmentPhantomSchema = z.object({
  goalText: z.string().min(1, 'Goal text is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  committed: z.boolean(),
  milestones: z.array(z.object({
    text: z.string().min(1),
    completed: z.boolean()
  })).min(1, 'At least one milestone is required')
});

export const StatsGridPhantomSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  stats: z.array(z.object({
    label: z.string().min(1),
    value: z.number(),
    unit: z.string(),
    trend: TrendSchema,
    change: z.number(),
    sparkline: z.array(z.number()).min(2, 'At least 2 data points required')
  })).min(1, 'At least one stat is required'),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional()
});

export const LeaderboardPhantomSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  metric: z.string().min(1, 'Metric is required'),
  entries: z.array(z.object({
    rank: z.number().min(1),
    name: z.string().min(1),
    avatar: z.string().optional(),
    score: z.number(),
    badge: z.string().optional(),
    isCurrentUser: z.boolean().optional()
  })).min(1, 'At least one entry is required')
});

const ActivityTypeSchema = z.enum(['workout', 'achievement', 'goal', 'streak', 'social']);

export const ActivityFeedPhantomSchema = z.object({
  activities: z.array(z.object({
    type: ActivityTypeSchema,
    title: z.string().min(1),
    description: z.string().min(1),
    timestamp: z.string().min(1),
    icon: z.any().optional()
  })).min(1, 'At least one activity is required'),
  maxItems: z.number().min(1).optional()
});

export const CountdownTimerPhantomSchema = z.object({
  targetDate: z.string().min(1, 'Target date is required'),
  eventName: z.string().min(1, 'Event name is required'),
  description: z.string().optional()
});

export const ProfileCardPhantomSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  avatar: z.string().optional(),
  level: z.number().min(1),
  title: z.string().min(1, 'Title is required'),
  xp: z.object({
    current: z.number().min(0),
    nextLevel: z.number().min(1)
  }),
  stats: z.array(z.object({
    label: z.string().min(1),
    value: z.string().min(1)
  })).min(1, 'At least one stat is required'),
  badges: z.array(z.string()).min(1, 'At least one badge is required')
});

// === SCHEMA MAP ===
export const widgetSchemaMap: Record<string, z.ZodSchema> = {
  // Dashboard
  'progress-dashboard': ProgressDashboardSchema,
  'metric-card': MetricCardSchema,
  'today-card': TodayCardSchema,
  'insight-card': InsightCardSchema,
  // Training
  'workout-card': WorkoutCardSchema,
  'exercise-row': ExerciseRowSchema,
  'rest-timer': RestTimerSchema,
  'workout-history': WorkoutHistorySchema,
  'live-session': LiveSessionSchema,
  // Nutrition
  'meal-plan': MealPlanSchema,
  'nutrition-strategy': NutritionStrategySchema,
  'calorie-balance': CalorieBalanceSchema,
  'meal-swap': MealSwapSchema,
  'macro-dial': MacroDialSchema,
  // Habits
  'hydration-tracker': HydrationTrackerSchema,
  'supplement-stack': SupplementStackSchema,
  'streak-counter': StreakCounterSchema,
  'habit-streak': HabitStreakSchema,
  // Biometrics
  'heart-rate': HeartRateSchema,
  'sleep-tracker': SleepTrackerSchema,
  'body-stats': BodyStatsSchema,
  'pain-map': PainMapSchema,
  // Metabolism
  'glucose-tracker': GlucoseTrackerSchema,
  'metabolic-score': MetabolicScoreSchema,
  'energy-curve': EnergyCurveSchema,
  // Planning
  'season-timeline': SeasonTimelineSchema,
  'season-contract': SeasonContractSchema,
  'readiness-battery': ReadinessBatterySchema,
  // Recaps
  'daily-recap': DailyRecapSchema,
  'weekly-review': WeeklyReviewSchema,
  'season-recap': SeasonRecapSchema,
  // Education
  'explanation-card': ExplanationCardSchema,
  'myth-buster': MythBusterSchema,
  'learn-more': LearnMoreSchema,
  'source-card': SourceCardSchema,
  // Tools
  'max-rep-calculator': MaxRepCalculatorSchema,
  'alert-banner': AlertBannerSchema,
  'coach-message': CoachMessageSchema,
  'achievement': AchievementSchema,
  'before-after': BeforeAfterSchema,
  'trophy-case': TrophyCaseSchema,
  // Recovery
  'wind-down': WindDownSchema,
  // Interactive
  'rep-counter': RepCounterSchema,
  'weight-input': WeightInputSchema,
  // BLAZE Advanced
  'superset-card': SupersetCardSchema,
  'amrap-timer': AMRAPTimerSchema,
  'emom-clock': EMOMClockSchema,
  // WAVE Recovery
  'hrv-chart': HRVChartSchema,
  'recovery-score': RecoveryScoreSchema,
  'stress-meter': StressMeterSchema,
  // METABOL Advanced
  'fasting-timer': FastingTimerSchema,
  'ketone-tracker': KetoneTrackerSchema,
  'tdee-calculator': TDEECalculatorSchema,
  // ATLAS Body
  'body-scan-3d': BodyScan3DSchema,
  'posture-check': PostureCheckSchema,
  'flexibility-score': FlexibilityScoreSchema,
  // NOVA Strength
  'pr-tracker': PRTrackerSchema,
  'volume-chart': VolumeChartSchema,
  'strength-curve': StrengthCurveSchema,
  // Sprint 6 - Interactive Charts
  'macro-radar': MacroRadarSchema,
  'volume-sparkline': VolumeSparkSchema,
  'body-heatmap': BodyHeatmapSchema,
  // Sprint 7 - Gamification
  'xp-bar': XPBarSchema,
  'daily-quests': DailyQuestsSchema,
  'badge-showcase': BadgeShowcaseSchema,
  'combo-multiplier': ComboMultiplierSchema,
  // Sprint 10 - Genesis_X Elite Protocol
  'hero-card-elite': HeroCardEliteSchema,
  'workout-card-elite': WorkoutCardEliteSchema,
  'progress-dashboard-elite': ProgressDashboardEliteSchema,
  'achievement-unlock': AchievementUnlockSchema,
  'goal-commitment': GoalCommitmentSchema,
  // Sprint 11 - Phantom_X
  'hero-card-phantom': HeroCardPhantomSchema,
  'workout-card-phantom': WorkoutCardPhantomSchema,
  'progress-dashboard-phantom': ProgressDashboardPhantomSchema,
  'achievement-phantom': AchievementPhantomSchema,
  'goal-commitment-phantom': GoalCommitmentPhantomSchema,
  'stats-grid-phantom': StatsGridPhantomSchema,
  'leaderboard-phantom': LeaderboardPhantomSchema,
  'activity-feed-phantom': ActivityFeedPhantomSchema,
  'countdown-timer-phantom': CountdownTimerPhantomSchema,
  'profile-card-phantom': ProfileCardPhantomSchema
};

export type WidgetType = keyof typeof widgetSchemaMap;
