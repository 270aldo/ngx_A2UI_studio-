# CLAUDE.md - NGX Studio

## Project Overview

NGX Studio is an AI-powered interface builder that generates React widgets via natural language using Google's Gemini 3.0 Flash/Pro API. The application provides a visual studio environment where users can describe widgets in natural language (Spanish) and see live previews of the generated components.

**Primary use case:** Creating fitness and health tracking UI widgets for the GENESIS app ecosystem (workout cards, meal plans, biometrics, habits, gamification, etc.)

**Key Features:**
- Natural language to UI generation with Gemini 3.0
- 69+ fitness-focused widget types across 13 agent categories
- Premium animations with Framer Motion and confetti effects
- Interactive charts with Recharts (radar, sparklines, heatmaps)
- Gamification system (XP, quests, badges, combos)
- 5 theme presets with customizable density, font scale, and glass effects
- Widget composition with layouts (stack, grid)
- Export to JSON, React component, or HTML
- Zod schema validation for all widgets
- Undo/Redo with keyboard shortcuts
- Responsive preview (Mobile/Tablet/Desktop)
- Drag & Drop widget reordering
- Local storage persistence for widgets and theme preferences

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS (via CDN)
- **Icons:** lucide-react
- **AI Integration:** Google Gemini 3.0 Flash/Pro (`@google/genai`)
- **Animations:** Framer Motion, canvas-confetti
- **Charts:** Recharts (AreaChart, RadarChart, LineChart)
- **Validation:** Zod schemas
- **Module System:** ES Modules with import maps
- **Storage:** localStorage for widget history and theme preferences

## Project Structure

```
ngx_A2UI_studio/
├── App.tsx                    # Main application with ThemeProvider
├── index.tsx                  # React entry point
├── index.html                 # HTML template with Tailwind CDN & import maps
├── types.ts                   # TypeScript type definitions
├── constants.ts               # Colors, system prompt, template library
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
├── metadata.json              # App metadata for AI Studio
├── components/
│   ├── WidgetRenderer.tsx     # 69+ widget components, LayoutRenderer, A2UIMediator
│   ├── UIComponents.tsx       # Shared UI primitives (GlassCard, AgentBadge, etc.)
│   ├── DeviceFrame.tsx        # Responsive device preview frames
│   ├── HistoryControls.tsx    # Undo/Redo UI controls
│   ├── ValidationErrors.tsx   # Validation error display
│   └── ThemePanel.tsx         # Theme configuration panel (Sprint 8)
├── contexts/
│   └── ThemeContext.tsx       # Theme system provider (Sprint 8)
├── hooks/
│   ├── useJSONHistory.ts      # Undo/Redo state management
│   ├── useReducedMotion.ts    # Accessibility motion preference (Sprint 5)
│   └── useAnimatedValue.ts    # Animated number transitions (Sprint 5)
├── schemas/
│   ├── widgetSchemas.ts       # Zod schemas for all widgets
│   └── layoutSchemas.ts       # Layout validation schemas
├── services/
│   ├── geminiService.ts       # Gemini 3.0 Flash/Pro API integration
│   ├── exportService.ts       # Export widgets (JSON, React, HTML)
│   └── storageService.ts      # localStorage persistence
└── utils/
    ├── validation.ts          # JSON schema validation
    └── templateBuilder.ts     # Goal-based template generation
```

## Key Commands

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env.local` file with:
```
GEMINI_API_KEY=your_api_key_here
```

## Architecture Overview

### Widget System

The application uses a mediator pattern for rendering widgets dynamically:

1. **WidgetPayload** - JSON structure with `type`, `props`, and optional `thought`
2. **WidgetLayout** - Composition structure with `type`, `widgets[]`, `direction`, `gap`
3. **A2UIMediator** (`components/WidgetRenderer.tsx`) - Maps widget type strings to React components
4. **LayoutRenderer** - Renders widget compositions (stack, grid)
5. **Zod Validation** - Real-time schema validation for all widgets

### Agent System (13 Agents)

NGX Studio uses 13 specialized agents for widget generation:

| Agent | Color | Focus Area |
|-------|-------|------------|
| NEXUS | #6D00FF | Dashboard, overview, main UI |
| BLAZE | #FF6B35 | Workouts, training, exercises |
| FUEL | #10B981 | Nutrition, meals, macros |
| PULSE | #EF4444 | Biometrics, heart rate, HRV |
| SERENITY | #8B5CF6 | Recovery, sleep, rest |
| SHIFT | #F59E0B | Body composition, measurements |
| FLOW | #06B6D4 | Planning, timelines, schedules |
| AURA | #EC4899 | Habits, streaks, routines |
| SAGE | #14B8A6 | Insights, AI analysis |
| TEMPO | #A855F7 | Timers, countdowns |
| CHORUS | #3B82F6 | Social, community |
| CATALYST | #F97316 | Motivation, challenges |
| SPARK | #FBBF24 | Gamification, achievements |

### Available Widget Types (69+ total)

#### Dashboard (4)
| Type | Description | Key Props |
|------|-------------|-----------|
| `progress-dashboard` | Metrics overview | `title`, `subtitle`, `progress`, `metrics[]` |
| `metric-card` | Single metric display | `label`, `value`, `unit`, `trend`, `change` |
| `today-card` | Daily summary | `greeting`, `date`, `mainSession`, `todos[]` |
| `insight-card` | AI insight display | `message` |

#### Training (6)
| Type | Description | Key Props |
|------|-------------|-----------|
| `workout-card` | Exercise routine display | `title`, `category`, `duration`, `exercises[]`, `coachNote` |
| `exercise-row` | Single exercise display | `name`, `currentSet`, `totalSets`, `load`, `reps` |
| `rest-timer` | Animated countdown timer | `seconds`, `autoStart` |
| `rep-counter` | Rep counter with confetti | `current`, `target`, `exercise` |
| `workout-history` | Session history | `sessions[]`, `weekSummary` |
| `live-exercise` | Real-time exercise tracking | `exercise`, `set`, `reps`, `weight` |

#### Nutrition (3)
| Type | Description | Key Props |
|------|-------------|-----------|
| `meal-plan` | Nutrition schedule | `totalKcal`, `meals[]` |
| `macro-radar` | Radar chart of macros | `protein`, `carbs`, `fat`, `fiber`, `goals` |
| `calorie-ring` | Animated calorie ring | `consumed`, `goal`, `burned` |

#### Habits (3)
| Type | Description | Key Props |
|------|-------------|-----------|
| `hydration-tracker` | Water intake tracker | `current`, `goal` |
| `supplement-stack` | Supplement checklist | `items[]` |
| `streak-counter` | Animated fire streaks | `currentStreak`, `bestStreak` |

#### Biometrics (5)
| Type | Description | Key Props |
|------|-------------|-----------|
| `heart-rate` | Animated heart rate | `bpm`, `zone`, `trend` |
| `hrv-chart` | HRV area chart | `score`, `readings[]`, `trend` |
| `sleep-tracker` | Sleep analysis | `hours`, `quality`, `stages[]` |
| `body-stats` | Body composition | `weight`, `bodyFat`, `muscle`, `measurements` |
| `body-heatmap` | Muscle group heatmap | `muscleGroups[]` |

#### Charts (Sprint 6)
| Type | Description | Key Props |
|------|-------------|-----------|
| `macro-radar` | Radar chart with animation | `protein`, `carbs`, `fat`, `fiber`, `goals` |
| `volume-sparkline` | Inline sparkline chart | `data[]`, `label`, `trend` |
| `body-heatmap` | Animated bar heatmap | `muscleGroups[]` |

#### Gamification (Sprint 7)
| Type | Description | Key Props |
|------|-------------|-----------|
| `xp-bar` | XP progress with levels | `currentXP`, `levelXP`, `level`, `title`, `nextReward` |
| `daily-quests` | Daily quest list | `quests[]` with `id`, `title`, `xp`, `completed`, `progress` |
| `badge-showcase` | Badge grid with rarities | `title`, `badges[]` with `rarity`, `unlocked`, `hint` |
| `combo-multiplier` | Combo counter with fire | `combo`, `multiplier`, `maxCombo`, `timeLeft` |
| `achievement` | Achievement badge | `title`, `description`, `unlockedAt` |

#### Planning (1)
| Type | Description | Key Props |
|------|-------------|-----------|
| `season-timeline` | Training phases | `seasonName`, `weeksCompleted`, `totalWeeks`, `phases[]` |

#### Tools (4)
| Type | Description | Key Props |
|------|-------------|-----------|
| `max-rep-calculator` | 1RM calculator | `weight`, `reps` |
| `alert-banner` | Notification banner | `type`, `message` |
| `coach-message` | Coach communication | `coachName`, `timestamp`, `message` |
| `quick-action` | Quick action buttons | `actions[]` |

### Layout System

Widgets can be composed using layouts:

```typescript
interface WidgetLayout {
  type: 'stack' | 'grid' | 'single';
  direction?: 'vertical' | 'horizontal';
  gap?: number;
  columns?: number;
  widgets: WidgetPayload[];
}
```

### Theme System (Sprint 8)

Located in `contexts/ThemeContext.tsx`:

```typescript
interface ThemeConfig {
  preset: 'midnight' | 'sunrise' | 'forest' | 'ocean' | 'neon';
  density: 'compact' | 'normal' | 'comfortable';
  fontScale: number; // 0.8 - 1.2
  glassBlur: 'none' | 'light' | 'heavy';
  accentColor: string;
  colors: ThemeColors;
}
```

**Theme Presets:**
| Preset | Emoji | Accent Color | Background |
|--------|-------|--------------|------------|
| Midnight | 🌙 | #6D00FF (Purple) | #000000 |
| Sunrise | 🌅 | #FF6B35 (Orange) | #1A0F0A |
| Forest | 🌲 | #00D68F (Green) | #0A1410 |
| Ocean | 🌊 | #00B4D8 (Cyan) | #0A0F14 |
| Neon | 💜 | #FF00FF (Magenta) | #0D0015 |

**Theme Features:**
- CSS variables applied dynamically
- Smooth 300ms transitions
- Persisted to localStorage
- Collapsible panel in sidebar

### Animation System (Sprint 5)

Located in `hooks/useReducedMotion.ts` and using Framer Motion:

**Hooks:**
- `useReducedMotion()` - Respects user's motion preferences
- `useAnimationConfig()` - Returns animation based on motion preference
- `useAnimationDuration()` - Adjusts duration for accessibility

**Premium Animations:**
| Widget | Animation |
|--------|-----------|
| `rest-timer` | SVG circle with stroke-dasharray, pulse, shake |
| `rep-counter` | Flip counter (odometer), confetti explosion |
| `heart-rate` | Synchronized heartbeat with BPM |
| `achievement` | Scale + rotate entrance, golden glow |
| `streak-counter` | CSS animated flames |

### Zod Validation System

Located in `schemas/widgetSchemas.ts`:

All 69+ widgets have corresponding Zod schemas for validation:
- Real-time validation in JSON editor
- Error and warning display
- Type-safe prop validation
- Layout structure validation

### Gemini 3.0 Integration

The `GeminiService` (`services/geminiService.ts`) supports dual models:

| Model | Use Case | Config |
|-------|----------|--------|
| `gemini-3-flash-preview` | Fast iteration | `thinkingLevel: "low"` |
| `gemini-3-pro-preview` | High quality | `thinkingLevel: "medium"` |

**Features:**
- Thinking configuration for complex layouts
- JSON response mode (`responseMimeType: "application/json"`)
- Fallback to mock responses when no API key

### Export System

The `ExportService` provides:

1. **JSON Export** - Enriched format with metadata for GENESIS
2. **React Component** - Standalone TypeScript component
3. **HTML Embed** - Complete widget with inline styles

### Storage System

The `StorageService` provides:
- Save/load widget history to localStorage
- Maximum 50 saved widgets
- Theme preferences persistence
- Search by name

## Shared UI Components

Located in `components/UIComponents.tsx`:
- **GlassCard** - Glassmorphism card with theme-aware colors
- **AgentBadge** - Widget attribution badge (e.g., "Generated by PULSE")
- **ProgressBar** - Animated progress indicator
- **ActionButton** - Primary/secondary action buttons

## Development Conventions

### Code Style
- TypeScript with explicit type annotations
- Functional React components with hooks
- Spanish UI text (prompts, labels, system messages)
- Tailwind utility classes for styling

### Component Patterns
- Props interfaces in `types.ts` or inline
- Widget components receive `data` and optional `onAction` callback
- Use `GlassCard` wrapper for consistent styling
- Use `AgentBadge` to show generation source
- Use `useReducedMotion` for accessibility

### Adding New Widgets

1. Add type definition to `SYSTEM_PROMPT` in `constants.ts`
2. Add Zod schema in `schemas/widgetSchemas.ts`
3. Create component in `components/WidgetRenderer.tsx`
4. Register in `WIDGET_MAP` object
5. Optionally add template in `TEMPLATE_LIBRARY`

## UI Layout

The app has a three-panel layout:
1. **Sidebar (left)** - Theme panel, spaces, templates, saved widgets
2. **Chat + Editor (center-left)** - Chat history, input, JSON editor with validation
3. **Preview (right)** - Live responsive device frame preview

**Header features:**
- Model selector (Flash/Pro toggle) with theme colors
- Device selector (Mobile/Tablet/Desktop)
- Edit mode toggle (Drag & Drop)
- Save widget button
- Export dropdown (JSON, React, HTML)

## Important Notes for AI Assistants

1. **Language:** UI text and system prompts are in Spanish
2. **No tests:** Project has no test setup - be careful with changes
3. **CDN dependencies:** Tailwind CSS is loaded via CDN, not npm
4. **Import maps:** Browser dependencies use ES modules import map in `index.html`
5. **Mock mode:** App works offline with mock responses when no API key
6. **Widget JSON:** Always validate JSON structure with Zod before rendering
7. **Type safety:** All widget props should match Zod schemas
8. **Layouts:** Support for widget composition with stack/grid layouts
9. **Accessibility:** Use `useReducedMotion` hook for animations
10. **Theming:** Use `theme.colors` from context for dynamic colors

## Recent Updates (January 2025)

### Phase 3: Premium Widgets Evolution

#### Sprint 5: Premium Animations
- Installed Framer Motion and canvas-confetti
- Created `useReducedMotion` hook for accessibility
- Upgraded `rest-timer` with SVG circle animation
- Upgraded `rep-counter` with flip counter and confetti
- Upgraded `heart-rate` with synchronized heartbeat
- Upgraded `achievement` with dramatic entrance
- Upgraded `streak-counter` with CSS flames

#### Sprint 6: Interactive Charts
- Installed Recharts library
- Created `MacroRadar` widget (RadarChart)
- Created `VolumeSpark` widget (LineChart sparkline)
- Created `BodyHeatmap` widget (animated bars)
- Upgraded `HRVChart` with AreaChart

#### Sprint 7: Gamification System
- Created `XPBar` widget with level system
- Created `DailyQuests` widget with quest tracking
- Created `BadgeShowcase` widget with rarity system
- Created `ComboMultiplier` widget with fire animation
- Added Zod schemas for all gamification widgets

#### Sprint 8: Theming System
- Created `ThemeContext` provider
- Created `ThemePanel` component
- Implemented 5 theme presets (Midnight, Sunrise, Forest, Ocean, Neon)
- Added density, font scale, and glass blur settings
- Persisted preferences to localStorage
- Applied dynamic CSS variables and inline styles

### Previous Updates
- Upgraded from Gemini 2.5 to Gemini 3.0 Flash/Pro
- Added Undo/Redo with keyboard shortcuts (Cmd+Z, Cmd+Shift+Z)
- Added responsive device preview (Mobile/Tablet/Desktop)
- Added Drag & Drop widget reordering
- Implemented Zod schema validation
- Added Goal Templates (5 categories, 13 templates)
- Implemented widget composition with LayoutRenderer
- Added export system (JSON, React, HTML)
- Added localStorage persistence

---

**Total Widgets:** 69+
**Total Agents:** 13
**Theme Presets:** 5
**Sprints Completed:** 8
