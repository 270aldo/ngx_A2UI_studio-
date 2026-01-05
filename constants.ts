import { TemplateCategory } from './types';

export const COLORS = {
  // 13 Official NGX Agents
  genesis: '#6D00FF',   // Central orchestrator
  blaze: '#FF4500',     // Training & workouts
  atlas: '#F59E0B',     // Body metrics & analysis
  tempo: '#8B5CF6',     // Time & planning
  wave: '#0EA5E9',      // Hydration & heart
  sage: '#10B981',      // Nutrition strategy
  macro: '#FF6347',     // Macro tracking
  metabol: '#14B8A6',   // Metabolism
  nova: '#D946EF',      // Supplements
  spark: '#FBBF24',     // Motivation & streaks
  stella: '#A855F7',    // Analytics & insights
  luna: '#6366F1',      // Sleep & recovery
  logos: '#6366F1',     // Education & science
  // Legacy aliases (for backwards compatibility)
  nexus: '#6D00FF',
  aqua: '#00D4FF',
  ascend: '#F59E0B',
  // UI Colors
  bg: '#050505',
  card: 'rgba(255, 255, 255, 0.03)',
  border: 'rgba(255, 255, 255, 0.08)'
};

export const SYSTEM_PROMPT = `
Eres el arquitecto de UI de NGX Genesis, potenciado por Gemini 3.0. Tu trabajo es generar configuraciones JSON para widgets de React basados en solicitudes en lenguaje natural.

Responde SIEMPRE con un objeto JSON valido que tenga esta estructura:
{
  "type": "nombre_del_widget",
  "props": { ...propiedades... },
  "thought": "Breve explicacion de tu decision de diseno"
}

Para MULTIPLES WIDGETS, usa un layout:
{
  "type": "stack",
  "direction": "vertical",
  "gap": 3,
  "widgets": [ { widget1 }, { widget2 } ]
}

CATALOGO DE WIDGETS DISPONIBLES (20 tipos):

--- DASHBOARD ---
1. 'progress-dashboard': { title, subtitle, progress, metrics: [{label, value, trend: 'up'|'down'}] }
2. 'metric-card': { label, value, unit, trend, change }
3. 'today-card': { greeting, date, mainSession: {title, time, type}, todos: [{label, done}] }
4. 'insight-card': { message }

--- ENTRENAMIENTO ---
5. 'workout-card': { title, category, duration, workoutId, exercises: [{name, sets, reps, load}], coachNote }
6. 'exercise-row': { name, currentSet, totalSets, load, reps }
7. 'rest-timer': { seconds, autoStart: boolean }
8. 'workout-history': { sessions: [{name, date, duration, completed}], weekSummary: {total} }

--- NUTRICION ---
9. 'meal-plan': { totalKcal, meals: [{time, name, kcal, highlight: boolean}] }

--- HABITOS ---
10. 'hydration-tracker': { current, goal }
11. 'supplement-stack': { items: [{name, dose, timing, taken: boolean}] }
12. 'streak-counter': { currentStreak, bestStreak }

--- BIOMETRICOS ---
13. 'heart-rate': { bpm, zone: 'rest'|'fat_burn'|'cardio'|'peak', trend: 'up'|'down' }
14. 'sleep-tracker': { hours, quality: 'excellent'|'good'|'fair'|'poor', stages: [{name, percent, color}] }
15. 'body-stats': { weight, bodyFat, muscle, weightChange, measurements: {waist, chest, arms} }

--- PLANIFICACION ---
16. 'season-timeline': { seasonName, weeksCompleted, totalWeeks, phases: [{name, active}] }

--- HERRAMIENTAS ---
17. 'max-rep-calculator': { weight, reps }
18. 'alert-banner': { type: 'warning'|'error'|'success', message }
19. 'coach-message': { coachName, timestamp, message }
20. 'achievement': { title, description, unlockedAt }

REGLAS:
- Se creativo con los datos. Si piden "Rutina Brutal", pon ejercicios dificiles y notas motivadoras intensas.
- Si piden "Dieta Vegana", usa alimentos reales veganos.
- Usa emojis en los textos si es apropiado para el contexto fitness.
- Si piden multiples widgets o un "dashboard", usa el formato layout con type: "stack".
- NO devuelvas bloques de codigo markdown, solo el JSON crudo.
- Genera datos realistas y motivadores para fitness.
`;

export const TEMPLATE_LIBRARY: TemplateCategory = {
  "Entrenamiento": [
    { name: "Rutina Fuerza", type: "workout-card", props: { title: "Upper Power", category: "Fuerza", duration: "60m", exercises: [{ name: "Press Banca", sets: 4, reps: "6", load: "80kg" }, { name: "Remo con Barra", sets: 4, reps: "8", load: "60kg" }], coachNote: "Enfocate en la tecnica, no en el peso" } },
    { name: "Live Exercise", type: "exercise-row", props: { name: "Sentadilla", currentSet: 1, totalSets: 4, load: "100kg", reps: "8" } },
    { name: "Timer Descanso", type: "rest-timer", props: { seconds: 90, autoStart: false } },
    { name: "Historial", type: "workout-history", props: { sessions: [{ name: "Push Day", date: "Hoy", duration: "55m", completed: true }, { name: "Pull Day", date: "Ayer", duration: "48m", completed: true }], weekSummary: { total: 5 } } }
  ],
  "Nutricion": [
    { name: "Plan Diario", type: "meal-plan", props: { totalKcal: 2500, meals: [{ time: "08:00", name: "Avena con frutas", kcal: 450 }, { time: "12:00", name: "Pollo con arroz", kcal: 650, highlight: true }, { time: "16:00", name: "Snack proteico", kcal: 300 }, { time: "20:00", name: "Salmon con verduras", kcal: 550 }] } }
  ],
  "Dashboard": [
    { name: "Resumen Semanal", type: "progress-dashboard", props: { title: "Estado Actual", subtitle: "Semana 8 de 12", progress: 65, metrics: [{ label: "Peso", value: "80kg", trend: "down" }, { label: "Grasa", value: "15%", trend: "down" }] } },
    { name: "Today View", type: "today-card", props: { greeting: "Hola Aldo", date: "Lun 12", mainSession: { title: "Legs Day", type: "strength", time: "18:00" }, todos: [{ label: "Tomar creatina", done: true }, { label: "Preparar pre-workout", done: false }] } },
    { name: "Racha Activa", type: "streak-counter", props: { currentStreak: 15, bestStreak: 21 } }
  ],
  "Biometricos": [
    { name: "Ritmo Cardiaco", type: "heart-rate", props: { bpm: 72, zone: "rest", trend: "down" } },
    { name: "Sueno Anoche", type: "sleep-tracker", props: { hours: 7.5, quality: "good", stages: [{ name: "Profundo", percent: 25, color: "#6366F1" }, { name: "Ligero", percent: 50, color: "#A855F7" }, { name: "REM", percent: 25, color: "#00D4FF" }] } },
    { name: "Composicion", type: "body-stats", props: { weight: 80, bodyFat: 15, muscle: 38, weightChange: -0.5, measurements: { waist: 82, chest: 102 } } }
  ],
  "Habitos": [
    { name: "Agua", type: "hydration-tracker", props: { current: 1500, goal: 3000 } },
    { name: "Suplementos", type: "supplement-stack", props: { items: [{ name: "Creatina", dose: "5g", timing: "Pre-work", taken: false }, { name: "Omega 3", dose: "2 caps", timing: "Con comida", taken: true }, { name: "Vitamina D", dose: "2000 IU", timing: "Manana", taken: true }] } }
  ],
  "Tools": [
    { name: "Calculadora RM", type: "max-rep-calculator", props: { weight: 100, reps: 5 } },
    { name: "Mensaje Coach", type: "coach-message", props: { coachName: "Alex", timestamp: "10m", message: "Excelente progreso esta semana. Sube el peso en sentadilla." } },
    { name: "Logro", type: "achievement", props: { title: "Iron Will", description: "Completaste 30 dias consecutivos de entrenamiento", unlockedAt: "Hace 2 dias" } }
  ]
};