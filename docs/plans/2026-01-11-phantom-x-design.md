# phantom_X Design Document

**Sprint:** 11
**Date:** 2026-01-11
**Status:** Approved

---

## Overview

phantom_X is a thematic variant for the NGX Studio widget ecosystem. It combines the dark onyx aesthetic of GlassCard with violet accents and glow effects inspired by the Elite Protocol, creating a balanced premium look that's functional yet dramatic.

**Design Philosophy:** Functional elements highlighted with violet + subtle glows on a deep onyx background.

---

## Design Tokens

### Color Palette

```typescript
export const PHANTOM_TOKENS = {
  // Core colors
  primary: '#6D00FF',      // Violet (same as Elite)
  accent: '#8B5CF6',       // Lighter violet for hovers

  // Backgrounds
  background: '#0A0A0B',   // Deep onyx
  surface: '#111113',      // Card surface (slightly elevated)

  // Borders
  border: '#1F1F23',       // Subtle default border
  borderHover: '#6D00FF',  // Violet border on hover

  // Glow effects
  glow: 'rgba(109, 0, 255, 0.15)',        // Subtle (resting state)
  glowMedium: 'rgba(109, 0, 255, 0.25)',  // Interactive elements
  glowIntense: 'rgba(109, 0, 255, 0.35)', // CTAs and highlights

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
};
```

### Glow Effects

```css
/* Subtle - for cards at rest */
.phantom-glow-subtle {
  box-shadow: 0 0 20px rgba(109, 0, 255, 0.1);
}

/* Medium - for interactive elements */
.phantom-glow-medium {
  box-shadow: 0 0 30px rgba(109, 0, 255, 0.2);
}

/* Intense - for CTAs and highlights */
.phantom-glow-intense {
  box-shadow: 0 0 40px rgba(109, 0, 255, 0.3),
              inset 0 0 20px rgba(109, 0, 255, 0.1);
}

/* Hover state transition */
.phantom-glow-hover {
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}
```

### Typography

Same as Elite Protocol for consistency:

```css
/* Headlines */
.phantom-headline {
  font-weight: 900;      /* font-black */
  font-style: italic;
  letter-spacing: -0.05em; /* tracking-tighter */
}

/* Labels */
.phantom-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;  /* tracking-widest */
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
}

/* Body text */
.phantom-body {
  font-weight: 500;
}
```

---

## Key Visual Difference vs Elite

| Aspect | Elite Protocol | phantom_X |
|--------|---------------|-----------|
| Card Background | Violet gradient | Solid onyx (#111113) |
| Primary Elements | White | Violet with glow |
| CTA Buttons | Solid white | Outline violet + glow |
| Accent Color | White/gold | Violet shades |
| Overall Feel | Bold, attention-grabbing | Sophisticated, mysterious |

---

## Base Components

### PhantomCard

```typescript
interface PhantomCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;        // Enable hover glow effect
  glowIntensity?: 'subtle' | 'medium' | 'intense';
}
```

**Styles:**
- Background: `#111113`
- Border: `1px solid #1F1F23`
- Border-radius: `16px` (rounded-2xl)
- Padding: `24px`
- Hover: Border turns violet, glow intensifies

### PhantomButton

```typescript
interface PhantomButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}
```

**Primary variant:**
- Background: transparent
- Border: `2px solid #6D00FF`
- Text: `#6D00FF`
- Glow: Medium intensity
- Hover: Glow intense, scale 1.02

**Secondary variant:**
- Background: `rgba(109, 0, 255, 0.1)`
- Border: `1px solid rgba(109, 0, 255, 0.3)`
- Text: `#A1A1AA`

### PhantomBadge

```typescript
interface PhantomBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'highlight';
}
```

- Background: `rgba(109, 0, 255, 0.2)`
- Text: `#8B5CF6`
- Border-radius: `9999px` (full)
- Padding: `4px 12px`

### PhantomProgress

```typescript
interface PhantomProgressProps {
  value: number;      // 0-100
  showGlow?: boolean; // Animated glow trail
}
```

- Track: `#1F1F23`
- Fill: `#6D00FF`
- Glow trail: Animated gradient following progress

---

## Widgets (10 Total)

### Adapted from Elite (5)

#### 1. HeroCardPhantom

```typescript
interface HeroCardPhantomProps {
  title: string;
  subtitle: string;
  ctaText: string;
}
```

- Zap icon with violet circular glow
- Bold italic white title
- Outline CTA button with glow

#### 2. WorkoutCardPhantom

```typescript
interface WorkoutCardPhantomProps {
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
```

- Category badge with violet tint
- Intensity badge with glow intensity matching level
- Exercise list with violet separators

#### 3. ProgressDashboardPhantom

```typescript
interface ProgressDashboardPhantomProps {
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
```

- Level badge with violet border + glow
- Progress ring with violet stroke and drop-shadow
- Metrics grid with individual hover glow
- Violet flame icon for streak

#### 4. AchievementPhantom

```typescript
interface AchievementPhantomProps {
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  icon?: React.ReactNode;
}
```

- Trophy with violet glow (intensity = rarity)
- Rarity badge always violet, glow indicates tier
- Violet star for XP reward

#### 5. GoalCommitmentPhantom

```typescript
interface GoalCommitmentPhantomProps {
  goalText: string;
  deadline: string;
  committed: boolean;
  milestones: Array<{
    text: string;
    completed: boolean;
  }>;
}
```

- Violet Target icon with glow
- Progress bar with animated glow trail
- Violet checkmarks for completed milestones

---

### New Widgets (5)

#### 6. StatsGridPhantom

```typescript
interface StatsGridPhantomProps {
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
```

**Features:**
- Responsive grid (2-4 columns)
- Each stat card: large value, mini sparkline (Recharts LineChart)
- Trend arrow with matching glow (green up, red down, neutral stable)
- Individual card hover glow

#### 7. LeaderboardPhantom

```typescript
interface LeaderboardPhantomProps {
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
```

**Features:**
- Top 3 with medal icons (gold, silver, bronze) + special glow
- Current user row highlighted with violet border
- Score in font-mono
- Avatar with violet ring for current user

#### 8. ActivityFeedPhantom

```typescript
interface ActivityFeedPhantomProps {
  activities: Array<{
    type: 'workout' | 'achievement' | 'goal' | 'streak' | 'social';
    title: string;
    description: string;
    timestamp: string;
    icon?: React.ReactNode;
  }>;
  maxItems?: number;
}
```

**Features:**
- Vertical timeline with violet connector line
- Type-specific icons with glow
- Relative timestamps ("2h ago", "yesterday")
- Hover reveals full timestamp

#### 9. CountdownTimerPhantom

```typescript
interface CountdownTimerPhantomProps {
  targetDate: string;
  eventName: string;
  description?: string;
  onComplete?: () => void;
}
```

**Features:**
- Large font-mono digits with individual glow
- Pulsing ":" separators
- Labels below (days/hrs/min/sec)
- Urgency mode: glow intensifies when < 24h remaining
- Optional confetti on complete

#### 10. ProfileCardPhantom

```typescript
interface ProfileCardPhantomProps {
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
```

**Features:**
- Avatar with violet ring + glow
- Prominent level badge
- XP progress bar with glow trail
- Compact stats row (3-4 items)
- Mini badge showcase (last 3 earned)

---

## File Structure

```
phantom-x/
├── index.ts              # Main exports
├── types.ts              # TypeScript interfaces
├── PhantomCard.tsx       # Base component + PHANTOM_TOKENS
├── PhantomWidgets.tsx    # All 10 widgets
└── demos.ts              # Demo data for sidebar
```

---

## Zod Schemas

All 10 widgets will have corresponding Zod schemas in `schemas/widgetSchemas.ts`:

- `HeroCardPhantomSchema`
- `WorkoutCardPhantomSchema`
- `ProgressDashboardPhantomSchema`
- `AchievementPhantomSchema`
- `GoalCommitmentPhantomSchema`
- `StatsGridPhantomSchema`
- `LeaderboardPhantomSchema`
- `ActivityFeedPhantomSchema`
- `CountdownTimerPhantomSchema`
- `ProfileCardPhantomSchema`

---

## Integration Points

1. **App.tsx** - Add phantom_X section to sidebar with "PHANTOM" badge
2. **WidgetRenderer.tsx** - Register PHANTOM_X_WIDGET_MAP
3. **schemas/widgetSchemas.ts** - Add 10 Phantom schemas
4. **CLAUDE.md** - Update documentation (90+ widgets, Sprint 11)

---

## Success Criteria

- [ ] All 10 widgets render correctly
- [ ] Glow effects animate smoothly (60fps)
- [ ] Hover states feel responsive
- [ ] Zod validation works for all widgets
- [ ] Consistent visual language across all widgets
- [ ] Clear differentiation from Elite and GlassCard styles

---

## Design Rationale

**Why onyx + violet glow?**
- Creates a sophisticated, premium feel without being overwhelming
- Violet glows draw attention to interactive elements naturally
- Dark background improves contrast and readability
- Maintains brand consistency with Elite Protocol's violet palette
- Offers variety for different app contexts in the GENESIS ecosystem
