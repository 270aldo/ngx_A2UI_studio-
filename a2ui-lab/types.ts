/**
 * A2UI Lab - Types
 *
 * Tipos específicos para widgets avanzados que demuestran
 * las capacidades del protocolo A2UI de Google.
 *
 * Capacidades A2UI implementadas:
 * - Multi-Surface: Múltiples superficies UI independientes
 * - Data Binding: Bindings reactivos con JSON Pointers
 * - Two-Way Binding: Inputs que modifican el DataModel
 * - Templates: Iteración sobre arrays para listas dinámicas
 * - Streaming: Renderizado progresivo
 * - Actions: Eventos tipados de usuario
 */

// ============================================
// CORE A2UI TYPES
// ============================================

/**
 * Superficie A2UI - Contenedor de UI independiente
 */
export interface A2UISurface {
  surfaceId: string;
  catalogId?: string;
  components: A2UIComponent[];
  dataModel: Record<string, any>;
}

/**
 * Componente A2UI base
 */
export interface A2UIComponent {
  id: string;
  component: string;
  children?: string[];
  // Data binding con JSON Pointer
  path?: string;
  // Propiedades específicas del componente
  [key: string]: any;
}

/**
 * Acción de usuario A2UI
 */
export interface A2UIUserAction {
  name: string;
  surfaceId: string;
  timestamp: string;
  context: Record<string, any>;
}

/**
 * Mensaje A2UI para actualización de datos
 */
export interface A2UIDataModelUpdate {
  surfaceId: string;
  path?: string;
  op?: 'add' | 'replace' | 'remove';
  value: any;
}

// ============================================
// LIVE WORKOUT SESSION (Multi-Surface)
// ============================================

export interface LiveWorkoutSessionProps {
  // Surface principal: ejercicio actual
  currentExercise: {
    name: string;
    set: number;
    totalSets: number;
    targetReps: number;
    targetWeight: number;
    restSeconds: number;
  };
  // Surface overlay: timer
  timer: {
    seconds: number;
    isRest: boolean;
    isPaused: boolean;
  };
  // Surface sidebar: coach AI
  coachAdvice: {
    message: string;
    type: 'tip' | 'motivation' | 'warning' | 'celebration';
    isStreaming?: boolean;
  };
  // Estado general
  workoutProgress: number;
  totalExercises: number;
  currentExerciseIndex: number;
}

// ============================================
// REACTIVE BIOMETRICS (Data Binding)
// ============================================

export interface ReactiveBiometricsProps {
  // Datos bindeados reactivamente
  heartRate: {
    current: number;
    zone: 'rest' | 'warmup' | 'fat_burn' | 'cardio' | 'peak';
    trend: number[]; // Últimos 10 valores
    average: number;
  };
  calories: {
    burned: number;
    goal: number;
    rate: number; // cal/min
  };
  hrv: {
    score: number;
    status: 'optimal' | 'elevated' | 'stressed';
    readings: number[];
  };
  oxygen: {
    spo2: number;
    trend: 'stable' | 'rising' | 'falling';
  };
  // Simulación de streaming
  isLive?: boolean;
  lastUpdate?: string;
}

// ============================================
// EXERCISE INPUT PANEL (Two-Way Binding)
// ============================================

export interface ExerciseInputPanelProps {
  exercise: {
    name: string;
    muscleGroup: string;
    equipment: string;
  };
  currentSet: {
    number: number;
    weight: number;
    reps: number;
    rpe?: number; // Rating of Perceived Exertion 1-10
    notes?: string;
  };
  previousSets: Array<{
    weight: number;
    reps: number;
    rpe?: number;
    completed: boolean;
  }>;
  targetSets: number;
  restTimer: number;
  // Two-way binding state
  isEditing: boolean;
}

// ============================================
// SUPERSET BUILDER (Templates)
// ============================================

export interface SupersetBuilderProps {
  title: string;
  supersets: Array<{
    id: string;
    exerciseA: {
      name: string;
      sets: number;
      reps: string;
      load: string;
    };
    exerciseB: {
      name: string;
      sets: number;
      reps: string;
      load: string;
    };
    restBetween: number;
    completed: boolean;
  }>;
  // Template binding
  templateId?: string;
  totalVolume: number;
  estimatedTime: number;
}

// ============================================
// STREAMING WORKOUT GENERATOR (Progressive Rendering)
// ============================================

export interface StreamingWorkoutGenProps {
  prompt: string;
  status: 'idle' | 'thinking' | 'streaming' | 'complete' | 'error';
  // Componentes que se van agregando progresivamente
  generatedComponents: Array<{
    id: string;
    type: string;
    props: Record<string, any>;
    streamedAt: number;
  }>;
  // Pensamiento del agente (streaming)
  agentThought?: string;
  // Metadata
  model: string;
  tokensUsed?: number;
  generationTime?: number;
}

// ============================================
// MULTI-AGENT DASHBOARD (Orchestration)
// ============================================

export interface MultiAgentDashboardProps {
  // Cada agente contribuye a su sección
  agents: {
    blaze?: {
      status: 'idle' | 'working' | 'done';
      contribution?: any;
    };
    pulse?: {
      status: 'idle' | 'working' | 'done';
      contribution?: any;
    };
    spark?: {
      status: 'idle' | 'working' | 'done';
      contribution?: any;
    };
    sage?: {
      status: 'idle' | 'working' | 'done';
      contribution?: any;
    };
  };
  orchestratorStatus: 'coordinating' | 'merging' | 'complete';
  finalSurface?: A2UISurface;
}

// ============================================
// A2UI LAB DEMO TYPES
// ============================================

export interface A2UILabDemo {
  id: string;
  name: string;
  description: string;
  capability: 'multi-surface' | 'data-binding' | 'two-way-binding' | 'templates' | 'streaming' | 'orchestration';
  icon: string;
  color: string;
  component: string;
  defaultProps: Record<string, any>;
}

export const A2UI_LAB_DEMOS: A2UILabDemo[] = [
  {
    id: 'live-workout-session',
    name: 'Live Workout Session',
    description: 'Multi-Surface: Timer overlay + Coach sidebar + Exercise main',
    capability: 'multi-surface',
    icon: 'Layers',
    color: '#FF6B35',
    component: 'live-workout-session',
    defaultProps: {
      currentExercise: {
        name: 'Bench Press',
        set: 2,
        totalSets: 4,
        targetReps: 8,
        targetWeight: 80,
        restSeconds: 90
      },
      timer: { seconds: 45, isRest: true, isPaused: false },
      coachAdvice: { message: 'Mantén la espalda pegada al banco. ¡Buen ritmo!', type: 'tip' },
      workoutProgress: 35,
      totalExercises: 6,
      currentExerciseIndex: 2
    }
  },
  {
    id: 'reactive-biometrics',
    name: 'Reactive Biometrics',
    description: 'Data Binding: HR, HRV, Calories actualizados en tiempo real',
    capability: 'data-binding',
    icon: 'Activity',
    color: '#EF4444',
    component: 'reactive-biometrics',
    defaultProps: {
      heartRate: { current: 142, zone: 'cardio', trend: [135, 138, 140, 142, 145, 143, 141, 142, 144, 142], average: 141 },
      calories: { burned: 234, goal: 500, rate: 8.5 },
      hrv: { score: 65, status: 'optimal', readings: [62, 65, 63, 68, 65, 64, 67, 65] },
      oxygen: { spo2: 98, trend: 'stable' },
      isLive: true
    }
  },
  {
    id: 'exercise-input-panel',
    name: 'Exercise Input Panel',
    description: 'Two-Way Binding: Ajusta peso/reps en tiempo real',
    capability: 'two-way-binding',
    icon: 'Edit3',
    color: '#10B981',
    component: 'exercise-input-panel',
    defaultProps: {
      exercise: { name: 'Squat', muscleGroup: 'Legs', equipment: 'Barbell' },
      currentSet: { number: 3, weight: 100, reps: 8, rpe: 7 },
      previousSets: [
        { weight: 100, reps: 8, rpe: 6, completed: true },
        { weight: 100, reps: 8, rpe: 7, completed: true }
      ],
      targetSets: 4,
      restTimer: 0,
      isEditing: false
    }
  },
  {
    id: 'superset-builder',
    name: 'Superset Builder',
    description: 'Templates: Lista dinámica de supersets con binding',
    capability: 'templates',
    icon: 'GitMerge',
    color: '#8B5CF6',
    component: 'superset-builder',
    defaultProps: {
      title: 'Upper Body Superset',
      supersets: [
        {
          id: 'ss1',
          exerciseA: { name: 'Bench Press', sets: 4, reps: '8-10', load: '80kg' },
          exerciseB: { name: 'Bent Over Row', sets: 4, reps: '8-10', load: '70kg' },
          restBetween: 60,
          completed: false
        },
        {
          id: 'ss2',
          exerciseA: { name: 'Incline DB Press', sets: 3, reps: '10-12', load: '30kg' },
          exerciseB: { name: 'Cable Row', sets: 3, reps: '10-12', load: '50kg' },
          restBetween: 45,
          completed: false
        }
      ],
      totalVolume: 8400,
      estimatedTime: 35
    }
  },
  {
    id: 'streaming-workout-gen',
    name: 'Streaming Workout Gen',
    description: 'Streaming: UI se construye progresivamente',
    capability: 'streaming',
    icon: 'Loader',
    color: '#F59E0B',
    component: 'streaming-workout-gen',
    defaultProps: {
      prompt: 'Rutina de espalda intensa',
      status: 'idle',
      generatedComponents: [],
      model: 'gemini-3-flash'
    }
  },
  {
    id: 'multi-agent-dashboard',
    name: 'Multi-Agent Dashboard',
    description: 'Orchestration: BLAZE + PULSE + SPARK colaborando',
    capability: 'orchestration',
    icon: 'Users',
    color: '#6366F1',
    component: 'multi-agent-dashboard',
    defaultProps: {
      agents: {
        blaze: { status: 'done', contribution: { type: 'workout-summary' } },
        pulse: { status: 'working' },
        spark: { status: 'idle' }
      },
      orchestratorStatus: 'coordinating'
    }
  }
];
