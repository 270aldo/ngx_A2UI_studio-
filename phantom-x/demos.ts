// phantom-x/demos.ts
// Demo configurations for phantom_X module

import type { PhantomXDemo } from './types';

export const PHANTOM_X_DEMOS: PhantomXDemo[] = [
  // ============================================
  // ADAPTED WIDGETS (from Elite)
  // ============================================
  {
    id: 'hero-card-phantom',
    name: 'Hero Phantom',
    component: 'hero-card-phantom',
    description: 'CTA Principal con Glow Violeta',
    icon: 'Sparkles',
    color: '#6D00FF',
    defaultProps: {
      title: 'DESBLOQUEA TU POTENCIAL',
      subtitle: 'El sistema de entrenamiento que te llevará al siguiente nivel. Sin límites.',
      ctaText: 'ACTIVAR AHORA',
    },
  },
  {
    id: 'workout-card-phantom',
    name: 'Workout Phantom',
    component: 'workout-card-phantom',
    description: 'Rutina con Estética Oscura',
    icon: 'Dumbbell',
    color: '#6D00FF',
    defaultProps: {
      title: 'SHADOW PROTOCOL',
      category: 'FUERZA',
      duration: 45,
      intensity: 'high',
      exercises: [
        { name: 'Peso Muerto', sets: 5, reps: '5' },
        { name: 'Remo Barra', sets: 4, reps: '8-10' },
        { name: 'Pull-ups', sets: 4, reps: '8-12' },
        { name: 'Face Pulls', sets: 3, reps: '15' },
      ],
    },
  },
  {
    id: 'progress-dashboard-phantom',
    name: 'Progress Phantom',
    component: 'progress-dashboard-phantom',
    description: 'Dashboard Oscuro de Métricas',
    icon: 'BarChart3',
    color: '#6D00FF',
    defaultProps: {
      weekProgress: 65,
      streak: 21,
      level: 12,
      levelTitle: 'PHANTOM',
      metrics: [
        { label: 'Sesiones', value: 6, unit: '/sem', trend: 'up' as const },
        { label: 'Volumen', value: 18750, unit: 'kg', trend: 'up' as const },
        { label: 'Proteína', value: 165, unit: 'g', trend: 'stable' as const },
        { label: 'Descanso', value: 8.1, unit: 'hrs', trend: 'up' as const },
      ],
    },
  },
  {
    id: 'achievement-phantom',
    name: 'Achievement Phantom',
    component: 'achievement-phantom',
    description: 'Logro con Aura Mística',
    icon: 'Award',
    color: '#8B5CF6',
    defaultProps: {
      title: 'SHADOW MASTER',
      description: 'Completaste 50 entrenamientos nocturnos',
      rarity: 'epic',
      xpReward: 350,
    },
  },
  {
    id: 'goal-commitment-phantom',
    name: 'Goal Phantom',
    component: 'goal-commitment-phantom',
    description: 'Compromiso con Estilo Phantom',
    icon: 'Target',
    color: '#6D00FF',
    defaultProps: {
      goalText: 'Dominar el protocolo de fuerza',
      deadline: '30 Junio 2025',
      committed: true,
      milestones: [
        { text: 'Aprender técnica de los básicos', completed: true },
        { text: 'Alcanzar 1.5x BW en sentadilla', completed: true },
        { text: 'Alcanzar 2x BW en peso muerto', completed: false },
        { text: 'Completar programa de 16 semanas', completed: false },
      ],
    },
  },

  // ============================================
  // NEW WIDGETS
  // ============================================
  {
    id: 'stats-grid-phantom',
    name: 'Stats Grid',
    component: 'stats-grid-phantom',
    description: 'Grid de Métricas con Sparklines',
    icon: 'Grid3x3',
    color: '#6D00FF',
    defaultProps: {
      title: 'MÉTRICAS SEMANALES',
      stats: [
        {
          label: 'Peso Total',
          value: 24500,
          unit: 'kg',
          trend: 'up' as const,
          change: 12,
          sparkline: [18000, 19500, 21000, 22000, 23000, 24500],
        },
        {
          label: 'Calorías',
          value: 2200,
          unit: 'kcal',
          trend: 'stable' as const,
          change: 0,
          sparkline: [2150, 2180, 2200, 2190, 2200, 2200],
        },
        {
          label: 'Proteína',
          value: 175,
          unit: 'g',
          trend: 'up' as const,
          change: 8,
          sparkline: [155, 160, 165, 168, 172, 175],
        },
        {
          label: 'Sueño',
          value: 7.5,
          unit: 'hrs',
          trend: 'down' as const,
          change: -5,
          sparkline: [8, 7.8, 7.6, 7.4, 7.5, 7.5],
        },
      ],
      columns: 2,
    },
  },
  {
    id: 'leaderboard-phantom',
    name: 'Leaderboard',
    component: 'leaderboard-phantom',
    description: 'Ranking con Estilo Competitivo',
    icon: 'Crown',
    color: '#8B5CF6',
    defaultProps: {
      title: 'TOP LIFTERS',
      metric: 'Volumen Semanal',
      entries: [
        { rank: 1, name: 'Carlos M.', score: 28500, badge: 'Elite' },
        { rank: 2, name: 'Ana R.', score: 26200, badge: 'Pro' },
        { rank: 3, name: 'David L.', score: 24800 },
        { rank: 4, name: 'Tú', score: 24500, isCurrentUser: true },
        { rank: 5, name: 'María G.', score: 23100 },
      ],
    },
  },
  {
    id: 'activity-feed-phantom',
    name: 'Activity Feed',
    component: 'activity-feed-phantom',
    description: 'Feed de Actividad Reciente',
    icon: 'Activity',
    color: '#6D00FF',
    defaultProps: {
      activities: [
        {
          type: 'workout' as const,
          title: 'Entrenamiento Completado',
          description: 'Shadow Protocol - 45 min',
          timestamp: 'Hace 2 horas',
        },
        {
          type: 'achievement' as const,
          title: 'Nuevo Logro',
          description: 'Night Owl - 10 sesiones nocturnas',
          timestamp: 'Hace 5 horas',
        },
        {
          type: 'streak' as const,
          title: 'Racha Extendida',
          description: '21 días consecutivos',
          timestamp: 'Ayer',
        },
        {
          type: 'goal' as const,
          title: 'Milestone Alcanzado',
          description: '1.5x BW en sentadilla',
          timestamp: 'Hace 2 días',
        },
        {
          type: 'social' as const,
          title: 'Nuevo Seguidor',
          description: 'Carlos M. te sigue',
          timestamp: 'Hace 3 días',
        },
      ],
      maxItems: 5,
    },
  },
  {
    id: 'countdown-timer-phantom',
    name: 'Countdown',
    component: 'countdown-timer-phantom',
    description: 'Cuenta Regresiva para Eventos',
    icon: 'Clock',
    color: '#6D00FF',
    defaultProps: {
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      eventName: 'COMPETENCIA REGIONAL',
      description: 'Prepárate para el siguiente nivel',
    },
  },
  {
    id: 'profile-card-phantom',
    name: 'Profile Card',
    component: 'profile-card-phantom',
    description: 'Perfil de Usuario Completo',
    icon: 'User',
    color: '#8B5CF6',
    defaultProps: {
      name: 'Alex Phantom',
      level: 12,
      title: 'SHADOW MASTER',
      xp: {
        current: 4250,
        nextLevel: 5000,
      },
      stats: [
        { label: 'Entrenamientos', value: '156' },
        { label: 'Racha Máxima', value: '45 días' },
        { label: 'Volumen Total', value: '1.2M kg' },
      ],
      badges: ['Elite', 'Night Owl', 'Iron Will', 'Consistency King'],
    },
  },
];
