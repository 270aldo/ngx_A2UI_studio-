import { WidgetLayout, WidgetPayload } from '../types';

export interface GoalTemplate {
  name: string;
  description: string;
  preview: string; // Emoji or icon identifier
  layout: WidgetLayout;
}

export interface GoalCategory {
  name: string;
  description: string;
  icon: string;
  color: string;
  templates: GoalTemplate[];
}

export const GOAL_TEMPLATES: Record<string, GoalCategory> = {
  weightLoss: {
    name: 'Perdida de Peso',
    description: 'Deficit calorico, cardio y tracking de progreso',
    icon: 'scale',
    color: '#00D4FF',
    templates: [
      {
        name: 'Dashboard Deficit',
        description: 'Monitorea tu deficit calorico diario',
        preview: '📉',
        layout: {
          type: 'stack',
          direction: 'vertical',
          gap: 3,
          widgets: [
            {
              type: 'calorie-balance',
              props: {
                consumed: 1800,
                burned: 400,
                target: 2000,
                net: 1400
              }
            },
            {
              type: 'macro-dial',
              props: {
                protein: { current: 140, goal: 160 },
                carbs: { current: 120, goal: 150 },
                fat: { current: 50, goal: 55 }
              }
            },
            {
              type: 'body-stats',
              props: {
                weight: 82,
                bodyFat: 22,
                muscle: 35,
                weightChange: -0.8,
                measurements: { waist: 88, chest: 100 }
              }
            }
          ]
        }
      },
      {
        name: 'Cardio Tracker',
        description: 'Seguimiento de sesiones cardio',
        preview: '🏃',
        layout: {
          type: 'stack',
          direction: 'vertical',
          gap: 3,
          widgets: [
            {
              type: 'workout-card',
              props: {
                title: 'HIIT Quema Grasa',
                category: 'Cardio',
                duration: '25m',
                exercises: [
                  { name: 'Burpees', sets: 4, reps: '30s', load: 'Bodyweight' },
                  { name: 'Mountain Climbers', sets: 4, reps: '30s', load: 'Bodyweight' },
                  { name: 'Jump Squats', sets: 4, reps: '30s', load: 'Bodyweight' }
                ],
                coachNote: 'Mantén el ritmo cardiaco entre 140-160 bpm'
              }
            },
            {
              type: 'heart-rate',
              props: { bpm: 145, zone: 'fat_burn', trend: 'stable' }
            },
            {
              type: 'energy-curve',
              props: {
                hours: [
                  { hour: '6am', level: 6 },
                  { hour: '9am', level: 8 },
                  { hour: '12pm', level: 5 },
                  { hour: '3pm', level: 4 },
                  { hour: '6pm', level: 7 }
                ],
                peakHour: '9am',
                lowHour: '3pm'
              }
            }
          ]
        }
      },
      {
        name: 'Fasting Protocol',
        description: 'Ayuno intermitente 16:8',
        preview: '⏱️',
        layout: {
          type: 'stack',
          direction: 'vertical',
          gap: 3,
          widgets: [
            {
              type: 'fasting-timer',
              props: {
                startTime: '20:00',
                targetHours: 16,
                currentPhase: 'ketosis',
                benefits: ['Autofagia activa', 'Quema de grasa optimizada', 'Sensibilidad insulina mejorada']
              }
            },
            {
              type: 'glucose-tracker',
              props: {
                current: 85,
                min: 70,
                max: 120,
                trend: 'falling',
                lastMeal: 'Hace 14h'
              }
            },
            {
              type: 'ketone-tracker',
              props: {
                reading: 1.2,
                trend: 'rising',
                zone: 'light',
                history: [
                  { date: 'Lun', value: 0.3 },
                  { date: 'Mar', value: 0.8 },
                  { date: 'Mie', value: 1.2 }
                ]
              }
            }
          ]
        }
      }
    ]
  },

  muscleGain: {
    name: 'Ganar Musculo',
    description: 'Superavit, fuerza progresiva y recovery',
    icon: 'dumbbell',
    color: '#FF4500',
    templates: [
      {
        name: 'Bulk Dashboard',
        description: 'Control de superavit y ganancia muscular',
        preview: '💪',
        layout: {
          type: 'stack',
          direction: 'vertical',
          gap: 3,
          widgets: [
            {
              type: 'nutrition-strategy',
              props: {
                goal: 'bulk',
                targetKcal: 3200,
                macroSplit: { protein: 30, carbs: 45, fat: 25 },
                tips: ['Comer cada 3 horas', 'Priorizar proteina post-entreno', '40g proteina por comida']
              }
            },
            {
              type: 'body-stats',
              props: {
                weight: 78,
                bodyFat: 14,
                muscle: 38,
                weightChange: 0.5,
                measurements: { waist: 80, chest: 105, arms: 38 }
              }
            },
            {
              type: 'tdee-calculator',
              props: {
                bmr: 1850,
                activityLevel: 'active',
                result: 3100,
                macroSplit: { protein: 195, carbs: 390, fat: 86 }
              }
            }
          ]
        }
      },
      {
        name: 'Strength Progress',
        description: 'Tracking de PRs y progresion',
        preview: '📈',
        layout: {
          type: 'stack',
          direction: 'vertical',
          gap: 3,
          widgets: [
            {
              type: 'pr-tracker',
              props: {
                exercise: 'Sentadilla',
                currentPR: { weight: '140kg', date: '15 Dic' },
                history: [
                  { weight: '120kg', date: 'Oct' },
                  { weight: '130kg', date: 'Nov' },
                  { weight: '140kg', date: 'Dic' }
                ],
                projection: '150kg en 6 semanas'
              }
            },
            {
              type: 'volume-chart',
              props: {
                weeklyData: [
                  { week: 'S1', volume: 48000 },
                  { week: 'S2', volume: 52000 },
                  { week: 'S3', volume: 55000 },
                  { week: 'S4', volume: 50000 }
                ],
                trend: 'up',
                totalVolume: 205000,
                recommendation: 'Buena progresion. Proxima semana: deload'
              }
            },
            {
              type: 'strength-curve',
              props: {
                exercise: 'Press Banca',
                data: [
                  { reps: 1, weight: 100 },
                  { reps: 3, weight: 92 },
                  { reps: 5, weight: 85 },
                  { reps: 8, weight: 75 }
                ],
                estimatedMax: 100,
                weakPoints: ['Fuerza de arranque', 'Triceps en lockout']
              }
            }
          ]
        }
      },
      {
        name: 'Push Day',
        description: 'Rutina de empuje con supersets',
        preview: '🏋️',
        layout: {
          type: 'stack',
          direction: 'vertical',
          gap: 3,
          widgets: [
            {
              type: 'workout-card',
              props: {
                title: 'Push Day - Hipertrofia',
                category: 'Upper',
                duration: '75m',
                exercises: [
                  { name: 'Press Banca', sets: 4, reps: '8-10', load: '80kg' },
                  { name: 'Press Inclinado', sets: 4, reps: '10-12', load: '60kg' },
                  { name: 'Press Militar', sets: 3, reps: '10', load: '50kg' },
                  { name: 'Triceps Fondos', sets: 3, reps: '12', load: '+20kg' }
                ],
                coachNote: 'RPE 8-9 en compuestos. Controla la excentrica.'
              }
            },
            {
              type: 'superset-card',
              props: {
                name: 'Finisher Chest-Shoulders',
                restBetween: 45,
                exercises: [
                  { name: 'Aperturas Cable', sets: 3, reps: '15', load: '15kg' },
                  { name: 'Elevaciones Laterales', sets: 3, reps: '15', load: '10kg' }
                ],
                notes: 'Sin descanso entre ejercicios del superset'
              }
            }
          ]
        }
      }
    ]
  },

  performance: {
    name: 'Rendimiento',
    description: 'Optimizar performance atletica',
    icon: 'trophy',
    color: '#D946EF',
    templates: [
      {
        name: 'Readiness Check',
        description: 'Evaluacion diaria de readiness',
        preview: '🔋',
        layout: {
          type: 'stack',
          direction: 'vertical',
          gap: 3,
          widgets: [
            {
              type: 'readiness-battery',
              props: {
                overall: 85,
                hrv: 78,
                sleep: 90,
                soreness: 75,
                energy: 88,
                recommendation: 'Dia optimo para entrenamiento intenso'
              }
            },
            {
              type: 'hrv-chart',
              props: {
                readings: [
                  { time: 'Lun', value: 65 },
                  { time: 'Mar', value: 72 },
                  { time: 'Mie', value: 68 },
                  { time: 'Jue', value: 75 },
                  { time: 'Vie', value: 78 }
                ],
                trend: 'up',
                avgScore: 72,
                recommendation: 'HRV en tendencia positiva. Mantén el descanso.'
              }
            },
            {
              type: 'recovery-score',
              props: {
                overall: 82,
                factors: { sleep: 88, hrv: 78, soreness: 75, stress: 85 },
                recommendation: 'Listo para entrenamiento de alta intensidad'
              }
            }
          ]
        }
      },
      {
        name: 'HIIT Session',
        description: 'Entrenamiento intervalos alta intensidad',
        preview: '⚡',
        layout: {
          type: 'stack',
          direction: 'vertical',
          gap: 3,
          widgets: [
            {
              type: 'amrap-timer',
              props: {
                duration: 900,
                exercises: [
                  { name: 'Thrusters', reps: 10 },
                  { name: 'Pull-ups', reps: 10 },
                  { name: 'Box Jumps', reps: 10 }
                ],
                currentRound: 0,
                totalRounds: 0,
                isRunning: false
              }
            },
            {
              type: 'emom-clock',
              props: {
                totalMinutes: 12,
                exercises: [
                  { name: 'Power Clean', reps: 3 },
                  { name: 'Push Press', reps: 5 }
                ],
                currentMinute: 0,
                isRunning: false
              }
            },
            {
              type: 'heart-rate',
              props: { bpm: 165, zone: 'cardio', trend: 'up' }
            }
          ]
        }
      },
      {
        name: 'Mobility Focus',
        description: 'Flexibilidad y postura',
        preview: '🧘',
        layout: {
          type: 'stack',
          direction: 'vertical',
          gap: 3,
          widgets: [
            {
              type: 'flexibility-score',
              props: {
                overall: 68,
                byArea: { shoulders: 75, hips: 55, hamstrings: 60, spine: 80 },
                recommendations: ['Hip flexor stretches 10min/dia', 'Yoga 2x/semana']
              }
            },
            {
              type: 'posture-check',
              props: {
                overallScore: 72,
                issues: [
                  { area: 'Hombros', severity: 2, description: 'Rotacion anterior' },
                  { area: 'Cadera', severity: 3, description: 'Inclinacion pelvica anterior' }
                ],
                exercises: [
                  { name: 'Face Pulls', benefit: 'Corrige rotacion de hombros' },
                  { name: 'Hip Flexor Stretch', benefit: 'Reduce inclinacion pelvica' }
                ]
              }
            },
            {
              type: 'body-scan-3d',
              props: {
                measurements: { chest: 102, waist: 82, hips: 98, arms: 38, thighs: 58 },
                highlights: [
                  { area: 'Hombros', change: 1, trend: 'up' },
                  { area: 'Cintura', change: -1, trend: 'down' }
                ],
                lastScan: 'Hace 7 dias'
              }
            }
          ]
        }
      }
    ]
  },

  recovery: {
    name: 'Recuperacion',
    description: 'Optimizar descanso y regeneracion',
    icon: 'moon',
    color: '#6366F1',
    templates: [
      {
        name: 'Sleep Optimization',
        description: 'Mejora tu calidad de sueno',
        preview: '😴',
        layout: {
          type: 'stack',
          direction: 'vertical',
          gap: 3,
          widgets: [
            {
              type: 'sleep-tracker',
              props: {
                hours: 7.5,
                quality: 'good',
                stages: [
                  { name: 'Profundo', percent: 22, color: '#6366F1' },
                  { name: 'Ligero', percent: 53, color: '#A855F7' },
                  { name: 'REM', percent: 25, color: '#00D4FF' }
                ]
              }
            },
            {
              type: 'wind-down',
              props: {
                bedtimeGoal: '22:30',
                currentTime: '21:45',
                activities: [
                  { name: 'Apagar pantallas', duration: '30 min', completed: true },
                  { name: 'Stretching suave', duration: '10 min', completed: false },
                  { name: 'Respiracion 4-7-8', duration: '5 min', completed: false }
                ],
                sleepScore: 72
              }
            },
            {
              type: 'stress-meter',
              props: {
                level: 4,
                sources: [
                  { name: 'Trabajo', impact: 'medio' },
                  { name: 'Entrenamiento', impact: 'bajo' }
                ],
                recommendations: ['Meditacion 10min', 'Caminar 20min', 'Journaling nocturno']
              }
            }
          ]
        }
      },
      {
        name: 'Active Recovery',
        description: 'Dia de recuperacion activa',
        preview: '🚶',
        layout: {
          type: 'stack',
          direction: 'vertical',
          gap: 3,
          widgets: [
            {
              type: 'recovery-score',
              props: {
                overall: 65,
                factors: { sleep: 70, hrv: 60, soreness: 55, stress: 75 },
                recommendation: 'Recuperacion activa recomendada. Evita alta intensidad.'
              }
            },
            {
              type: 'workout-card',
              props: {
                title: 'Recovery Flow',
                category: 'Movilidad',
                duration: '30m',
                exercises: [
                  { name: 'Foam Rolling', sets: 1, reps: '10min', load: '-' },
                  { name: 'Hip Circles', sets: 2, reps: '10/lado', load: '-' },
                  { name: 'Cat-Cow', sets: 2, reps: '10', load: '-' },
                  { name: 'World Greatest Stretch', sets: 2, reps: '5/lado', load: '-' }
                ],
                coachNote: 'Movimientos suaves. Respira profundo en cada posicion.'
              }
            },
            {
              type: 'hydration-tracker',
              props: { current: 2000, goal: 3500 }
            }
          ]
        }
      }
    ]
  },

  competition: {
    name: 'Competicion',
    description: 'Preparacion para eventos',
    icon: 'medal',
    color: '#F59E0B',
    templates: [
      {
        name: 'Peak Week',
        description: 'Semana previa a competencia',
        preview: '🏆',
        layout: {
          type: 'stack',
          direction: 'vertical',
          gap: 3,
          widgets: [
            {
              type: 'season-timeline',
              props: {
                seasonName: 'Peak Week',
                weeksCompleted: 11,
                totalWeeks: 12,
                phases: [
                  { name: 'Base', active: false },
                  { name: 'Build', active: false },
                  { name: 'Peak', active: true },
                  { name: 'Taper', active: false }
                ]
              }
            },
            {
              type: 'readiness-battery',
              props: {
                overall: 92,
                hrv: 85,
                sleep: 95,
                soreness: 90,
                energy: 95,
                recommendation: 'Estado optimo. Mantener actividad baja hasta competencia.'
              }
            },
            {
              type: 'nutrition-strategy',
              props: {
                goal: 'maintain',
                targetKcal: 2800,
                macroSplit: { protein: 25, carbs: 55, fat: 20 },
                tips: ['Carb loading ultimos 3 dias', 'Hidratacion extra', 'Evitar fibra dia antes']
              }
            }
          ]
        }
      },
      {
        name: 'Competition Day',
        description: 'Dashboard dia de competencia',
        preview: '🎯',
        layout: {
          type: 'stack',
          direction: 'vertical',
          gap: 3,
          widgets: [
            {
              type: 'today-card',
              props: {
                greeting: 'Dia de Competencia',
                date: 'Sab 15',
                mainSession: { title: 'Powerlifting Meet', type: 'competition', time: '09:00' },
                todos: [
                  { label: 'Desayuno 3h antes', done: true },
                  { label: 'Warm-up routine', done: false },
                  { label: 'Pesar equipo', done: true },
                  { label: 'Visualizacion', done: false }
                ]
              }
            },
            {
              type: 'coach-message',
              props: {
                coachName: 'Coach Alex',
                timestamp: '7:30am',
                message: 'Confía en tu preparación. Ejecuta como entrenamos. Primer intento conservador, segundo al PR, tercero a dejarlo todo. 💪'
              }
            },
            {
              type: 'pr-tracker',
              props: {
                exercise: 'Total Powerlifting',
                currentPR: { weight: '450kg', date: 'Oct' },
                history: [
                  { weight: '420kg', date: 'Abr' },
                  { weight: '435kg', date: 'Jul' },
                  { weight: '450kg', date: 'Oct' }
                ],
                projection: 'Target hoy: 465kg'
              }
            }
          ]
        }
      }
    ]
  }
};

/**
 * Get all goal categories
 */
export const getGoalCategories = (): GoalCategory[] => {
  return Object.values(GOAL_TEMPLATES);
};

/**
 * Get templates for a specific goal
 */
export const getTemplatesForGoal = (goalKey: string): GoalTemplate[] => {
  return GOAL_TEMPLATES[goalKey]?.templates || [];
};

/**
 * Get a specific template by goal and template name
 */
export const getTemplate = (goalKey: string, templateName: string): GoalTemplate | undefined => {
  const templates = GOAL_TEMPLATES[goalKey]?.templates || [];
  return templates.find(t => t.name === templateName);
};

/**
 * Convert a GoalTemplate layout to JSON string
 */
export const templateToJSON = (template: GoalTemplate): string => {
  return JSON.stringify(template.layout, null, 2);
};

export default {
  GOAL_TEMPLATES,
  getGoalCategories,
  getTemplatesForGoal,
  getTemplate,
  templateToJSON
};
