import { TemplateCategory } from './types';

export const COLORS = {
  nexus: '#6D00FF',
  blaze: '#FF4500',
  aqua: '#00D4FF',
  macro: '#FF6347',
  sage: '#10B981',
  tempo: '#8B5CF6',
  spark: '#FBBF24',
  logos: '#6366F1',
  stella: '#A855F7',
  atlas: '#EC4899',
  ascend: '#F59E0B',
  luna: '#6366F1',
  wave: '#0EA5E9',
  metabol: '#14B8A6',
  nova: '#D946EF',
  bg: '#050505',
  card: 'rgba(255, 255, 255, 0.03)',
  border: 'rgba(255, 255, 255, 0.08)'
};

export const SYSTEM_PROMPT = `
Eres el arquitecto de UI de NGX Genesis. Tu trabajo es generar configuraciones JSON para widgets de React basados en solicitudes en lenguaje natural.
Responde SIEMPRE con un objeto JSON válido que tenga esta estructura:
{
  "type": "nombre_del_widget",
  "props": { ...propiedades... },
  "thought": "Breve explicación de tu decisión de diseño"
}

CATÁLOGO DE WIDGETS DISPONIBLES:
1. 'workout-card': { title, category, duration, workoutId, exercises: [{name, sets, reps, load}], coachNote }
2. 'meal-plan': { totalKcal, meals: [{time, name, kcal, highlight: boolean}] }
3. 'hydration-tracker': { current, goal }
4. 'progress-dashboard': { title, subtitle, progress, metrics: [{label, value, trend: 'up'|'down'}] }
5. 'today-card': { greeting, date, mainSession: {title, time, type} }
6. 'supplement-stack': { items: [{name, dose, timing, taken: boolean}] }
7. 'max-rep-calculator': { weight, reps }
8. 'alert-banner': { type: 'warning'|'error'|'success', message }
9. 'coach-message': { coachName, timestamp, message }

REGLAS:
- Sé creativo con los datos. Si piden "Rutina Brutal", pon ejercicios difíciles y notas motivadoras intensas.
- Si piden "Dieta Vegana", usa alimentos reales veganos.
- Usa emojis en los textos si es apropiado para el contexto fitness.
- NO devuelvas bloques de código markdown (\`\`\`), solo el JSON crudo.
`;

export const TEMPLATE_LIBRARY: TemplateCategory = {
  "Entrenamiento": [
    { name: "Rutina Fuerza", type: "workout-card", props: { title: "Upper Power", category: "Fuerza", duration: "60m", exercises: [{ name: "Press Banca", sets: 4, reps: "6", load: "80kg" }] } },
    { name: "Live Exercise", type: "exercise-row", props: { name: "Sentadilla", currentSet: 1, totalSets: 4, load: "100kg", reps: "8" } }
  ],
  "Nutrición": [
    { name: "Plan Diario", type: "meal-plan", props: { totalKcal: 2500, meals: [{ time: "08:00", name: "Desayuno", kcal: 600 }] } }
  ],
  "Dashboard": [
    { name: "Resumen Semanal", type: "progress-dashboard", props: { title: "Estado Actual", progress: 65, metrics: [{ label: "Peso", value: "80kg" }] } },
    { name: "Today View", type: "today-card", props: { greeting: "Hola Aldo", date: "Lun 12", mainSession: { title: "Legs", type: "strength", time: "18:00" } } }
  ],
  "Hábitos": [
    { name: "Agua", type: "hydration-tracker", props: { current: 1500, goal: 3000 } },
    { name: "Suplementos", type: "supplement-stack", props: { items: [{ name: "Creatina", dose: "5g", timing: "Pre-work", taken: false }] } }
  ],
  "Tools": [
    { name: "Calculadora RM", type: "max-rep-calculator", props: { weight: 100, reps: 5 } },
    { name: "Mensaje Coach", type: "coach-message", props: { coachName: "Alex", timestamp: "10m", message: "Sube el peso hoy." } }
  ]
};