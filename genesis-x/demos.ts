// genesis_X Elite Protocol Demos

export interface GenesisXDemo {
  id: string;
  name: string;
  component: string;
  description: string;
  icon: string;
  color: string;
  defaultProps: Record<string, any>;
}

export const GENESIS_X_DEMOS: GenesisXDemo[] = [
  {
    id: 'hero-card-elite',
    name: 'Hero Card',
    component: 'hero-card-elite',
    description: 'CTA Principal de Alto Impacto',
    icon: 'Zap',
    color: '#6D00FF',
    defaultProps: {
      title: 'TRANSFORMA TU CUERPO',
      subtitle: 'El programa de 12 semanas que cambiará tu vida. Sin excusas.',
      ctaText: 'COMENZAR AHORA',
    },
  },
  {
    id: 'workout-card-elite',
    name: 'Workout Elite',
    component: 'workout-card-elite',
    description: 'Rutina Premium con Métricas',
    icon: 'Dumbbell',
    color: '#6D00FF',
    defaultProps: {
      title: 'CHEST DESTROYER',
      category: 'HIPERTROFIA',
      duration: 55,
      intensity: 'extreme',
      exercises: [
        { name: 'Press Banca', sets: 4, reps: '8-10' },
        { name: 'Press Inclinado', sets: 4, reps: '10-12' },
        { name: 'Aperturas Cable', sets: 3, reps: '12-15' },
        { name: 'Fondos', sets: 3, reps: 'Al fallo' },
        { name: 'Pullover', sets: 3, reps: '12' },
      ],
    },
  },
  {
    id: 'progress-dashboard-elite',
    name: 'Progress Elite',
    component: 'progress-dashboard-elite',
    description: 'Dashboard Cinematic de Métricas',
    icon: 'Trophy',
    color: '#6D00FF',
    defaultProps: {
      weekProgress: 78,
      streak: 14,
      level: 7,
      levelTitle: 'GLADIADOR',
      metrics: [
        { label: 'Entrenamientos', value: 5, unit: '/sem', trend: 'up' as const },
        { label: 'Volumen Total', value: 12450, unit: 'kg', trend: 'up' as const },
        { label: 'Calorías', value: 2150, unit: 'kcal', trend: 'stable' as const },
        { label: 'Sueño', value: 7.2, unit: 'hrs', trend: 'down' as const },
      ],
    },
  },
  {
    id: 'achievement-unlock',
    name: 'Achievement',
    component: 'achievement-unlock',
    description: 'Revelación Dramática de Logro',
    icon: 'Star',
    color: '#F59E0B',
    defaultProps: {
      title: 'IRON WARRIOR',
      description: 'Completaste 100 entrenamientos este año',
      rarity: 'legendary',
      xpReward: 500,
    },
  },
  {
    id: 'goal-commitment',
    name: 'Goal Commitment',
    component: 'goal-commitment',
    description: 'Card de Compromiso con Objetivo',
    icon: 'Target',
    color: '#6D00FF',
    defaultProps: {
      goalText: 'Bajar a 12% de grasa corporal',
      deadline: '31 Marzo 2025',
      committed: false,
      milestones: [
        { text: 'Definir plan de nutrición', completed: true },
        { text: 'Completar 4 semanas de déficit', completed: true },
        { text: 'Añadir 2 sesiones de cardio', completed: false },
        { text: 'Alcanzar 15% de grasa', completed: false },
        { text: 'Meta final: 12%', completed: false },
      ],
    },
  },
];
