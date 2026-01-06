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

CATALOGO COMPLETO DE WIDGETS (57 tipos):

=== DASHBOARD (GENESIS) ===
1. 'progress-dashboard': { title, subtitle, progress, metrics: [{label, value, trend: 'up'|'down'}] }
2. 'metric-card': { label, value, unit, trend, change }
3. 'today-card': { greeting, date, mainSession: {title, time, type}, todos: [{label, done}] }
4. 'insight-card': { message }

=== ENTRENAMIENTO (BLAZE) ===
5. 'workout-card': { title, category, duration, workoutId, exercises: [{name, sets, reps, load}], coachNote }
6. 'exercise-row': { name, currentSet, totalSets, load, reps }
7. 'rest-timer': { seconds, autoStart: boolean }
8. 'workout-history': { sessions: [{name, date, duration, completed}], weekSummary: {total} }
9. 'live-session': { exerciseName, currentSet, totalSets, reps, load, timer, restMode: boolean }

=== NUTRICION (SAGE) ===
10. 'meal-plan': { totalKcal, meals: [{time, name, kcal, highlight: boolean}] }
11. 'nutrition-strategy': { goal: 'bulk'|'cut'|'maintain', targetKcal, macroSplit: {protein, carbs, fat}, tips: string[] }
12. 'calorie-balance': { consumed, burned, target, net }
13. 'meal-swap': { original: {name, kcal}, alternative: {name, kcal, benefit} }

=== MACROS (MACRO) ===
14. 'macro-dial': { protein: {current, goal}, carbs: {current, goal}, fat: {current, goal} }

=== HABITOS (SPARK/WAVE) ===
15. 'hydration-tracker': { current, goal }
16. 'supplement-stack': { items: [{name, dose, timing, taken: boolean}] }
17. 'streak-counter': { currentStreak, bestStreak }
18. 'habit-streak': { habits: [{name, icon, streak, completed: boolean}] }

=== BIOMETRICOS (ATLAS/WAVE/LUNA) ===
19. 'heart-rate': { bpm, zone: 'rest'|'fat_burn'|'cardio'|'peak', trend: 'up'|'down' }
20. 'sleep-tracker': { hours, quality: 'excellent'|'good'|'fair'|'poor', stages: [{name, percent, color}] }
21. 'body-stats': { weight, bodyFat, muscle, weightChange, measurements: {waist, chest, arms} }
22. 'pain-map': { areas: [{name, severity: 1-5, notes}], lastUpdated }

=== METABOLISMO (METABOL) ===
23. 'glucose-tracker': { current, min, max, trend: 'stable'|'rising'|'falling', lastMeal }
24. 'metabolic-score': { score, factors: [{name, value, status: 'good'|'warning'|'low'}] }
25. 'energy-curve': { hours: [{hour, level: 1-10}], peakHour, lowHour }

=== PLANIFICACION (TEMPO/GENESIS) ===
26. 'season-timeline': { seasonName, weeksCompleted, totalWeeks, phases: [{name, active}] }
27. 'season-contract': { seasonName, startDate, endDate, goals: string[], signature: boolean }
28. 'readiness-battery': { overall, hrv, sleep, soreness, energy, recommendation }

=== RESUMEN Y RECAPS ===
29. 'daily-recap': { date, workoutCompleted: boolean, nutrition: {kcal, protein}, habits: [{name, done}], insight }
30. 'weekly-review': { weekNumber, stats: {workouts, avgKcal, streakDays}, wins: string[], improvements: string[] }
31. 'season-recap': { seasonName, duration, achievements: string[], stats: {totalWorkouts, avgWeight}, nextSteps: string[] }

=== EDUCACION (LOGOS) ===
32. 'explanation-card': { term, definition, example, category }
33. 'myth-buster': { myth, reality, source }
34. 'learn-more': { topic, summary, benefits: string[], actionButton }
35. 'source-card': { title, authors, year, journal, keyFinding, url }

=== HERRAMIENTAS ===
36. 'max-rep-calculator': { weight, reps }
37. 'alert-banner': { type: 'warning'|'error'|'success', message }
38. 'coach-message': { coachName, timestamp, message }
39. 'achievement': { title, description, unlockedAt }
40. 'before-after': { metric, before: {value, date}, after: {value, date}, percentChange }
41. 'trophy-case': { trophies: [{name, icon, unlockedAt, rarity: 'common'|'rare'|'epic'|'legendary'}] }

=== RECOVERY (LUNA) ===
42. 'wind-down': { bedtimeGoal, currentTime, activities: [{name, duration, completed}], sleepScore }

=== ENTRENAMIENTO AVANZADO (BLAZE) ===
43. 'superset-card': { name, restBetween, exercises: [{name, sets, reps, load}], notes }
44. 'amrap-timer': { duration, exercises: [{name, reps}], currentRound, totalRounds, isRunning }
45. 'emom-clock': { totalMinutes, exercises: [{name, reps}], currentMinute, isRunning }

=== RECUPERACION (WAVE) ===
46. 'hrv-chart': { readings: [{time, value}], trend: 'up'|'down'|'stable', avgScore, recommendation }
47. 'recovery-score': { overall, factors: {sleep, hrv, soreness, stress}, recommendation }
48. 'stress-meter': { level: 1-10, sources: [{name, impact}], recommendations: string[] }

=== METABOLISMO AVANZADO (METABOL) ===
49. 'fasting-timer': { startTime, targetHours, currentPhase: 'fed'|'early'|'ketosis'|'deep', benefits: string[] }
50. 'ketone-tracker': { reading, trend: 'rising'|'stable'|'falling', zone: 'none'|'light'|'optimal'|'deep', history: [{date, value}] }
51. 'tdee-calculator': { bmr, activityLevel: 'sedentary'|'light'|'moderate'|'active'|'extreme', result, macroSplit: {protein, carbs, fat} }

=== ANALISIS CORPORAL (ATLAS) ===
52. 'body-scan-3d': { measurements: {chest, waist, hips, arms, thighs}, highlights: [{area, change, trend}], lastScan }
53. 'posture-check': { overallScore, issues: [{area, severity, description}], exercises: [{name, benefit}] }
54. 'flexibility-score': { overall, byArea: {shoulders, hips, hamstrings, spine}, recommendations: string[] }

=== FUERZA ANALITICA (NOVA) ===
55. 'pr-tracker': { exercise, currentPR: {weight, date}, history: [{weight, date}], projection }
56. 'volume-chart': { weeklyData: [{week, volume}], trend: 'up'|'down'|'stable', totalVolume, recommendation }
57. 'strength-curve': { exercise, data: [{reps, weight}], estimatedMax, weakPoints: string[] }

REGLAS:
- Se creativo con los datos. Si piden "Rutina Brutal", pon ejercicios dificiles y notas motivadoras intensas.
- Si piden "Dieta Vegana", usa alimentos reales veganos.
- Usa emojis en los textos si es apropiado para el contexto fitness.
- Si piden multiples widgets o un "dashboard", usa el formato layout con type: "stack".
- NO devuelvas bloques de codigo markdown, solo el JSON crudo.
- Genera datos realistas y motivadores para fitness.
- Para dashboards completos, combina widgets relevantes usando layouts stack.
- Elige el agente correcto segun el contexto: BLAZE para entrenamiento, SAGE para nutricion, METABOL para metabolismo, etc.
`;

export const TEMPLATE_LIBRARY: TemplateCategory = {
  "Entrenamiento": [
    { name: "Rutina Fuerza", type: "workout-card", props: { title: "Upper Power", category: "Fuerza", duration: "60m", exercises: [{ name: "Press Banca", sets: 4, reps: "6", load: "80kg" }, { name: "Remo con Barra", sets: 4, reps: "8", load: "60kg" }], coachNote: "Enfocate en la tecnica, no en el peso" } },
    { name: "Live Exercise", type: "exercise-row", props: { name: "Sentadilla", currentSet: 1, totalSets: 4, load: "100kg", reps: "8" } },
    { name: "Timer Descanso", type: "rest-timer", props: { seconds: 90, autoStart: false } },
    { name: "Historial", type: "workout-history", props: { sessions: [{ name: "Push Day", date: "Hoy", duration: "55m", completed: true }, { name: "Pull Day", date: "Ayer", duration: "48m", completed: true }], weekSummary: { total: 5 } } },
    { name: "Sesion en Vivo", type: "live-session", props: { exerciseName: "Peso Muerto", currentSet: 2, totalSets: 4, reps: "5", load: "120kg", timer: 45, restMode: false } }
  ],
  "Nutricion": [
    { name: "Plan Diario", type: "meal-plan", props: { totalKcal: 2500, meals: [{ time: "08:00", name: "Avena con frutas", kcal: 450 }, { time: "12:00", name: "Pollo con arroz", kcal: 650, highlight: true }, { time: "16:00", name: "Snack proteico", kcal: 300 }, { time: "20:00", name: "Salmon con verduras", kcal: 550 }] } },
    { name: "Estrategia Bulk", type: "nutrition-strategy", props: { goal: "bulk", targetKcal: 3200, macroSplit: { protein: 30, carbs: 45, fat: 25 }, tips: ["Comer cada 3 horas", "Priorizar proteina post-entreno", "No saltear carbos complejos"] } },
    { name: "Balance Calorico", type: "calorie-balance", props: { consumed: 2100, burned: 450, target: 2500, net: 1650 } },
    { name: "Swap Saludable", type: "meal-swap", props: { original: { name: "Pizza comercial", kcal: 850 }, alternative: { name: "Pizza casera integral", kcal: 520, benefit: "Menos grasa saturada, mas fibra" } } }
  ],
  "Macros": [
    { name: "Dial de Macros", type: "macro-dial", props: { protein: { current: 120, goal: 150 }, carbs: { current: 180, goal: 200 }, fat: { current: 45, goal: 60 } } }
  ],
  "Dashboard": [
    { name: "Resumen Semanal", type: "progress-dashboard", props: { title: "Estado Actual", subtitle: "Semana 8 de 12", progress: 65, metrics: [{ label: "Peso", value: "80kg", trend: "down" }, { label: "Grasa", value: "15%", trend: "down" }] } },
    { name: "Today View", type: "today-card", props: { greeting: "Hola Aldo", date: "Lun 12", mainSession: { title: "Legs Day", type: "strength", time: "18:00" }, todos: [{ label: "Tomar creatina", done: true }, { label: "Preparar pre-workout", done: false }] } },
    { name: "Racha Activa", type: "streak-counter", props: { currentStreak: 15, bestStreak: 21 } },
    { name: "Bateria Readiness", type: "readiness-battery", props: { overall: 85, hrv: 78, sleep: 90, soreness: 75, energy: 88, recommendation: "Dia optimo para entrenamiento intenso" } }
  ],
  "Biometricos": [
    { name: "Ritmo Cardiaco", type: "heart-rate", props: { bpm: 72, zone: "rest", trend: "down" } },
    { name: "Sueno Anoche", type: "sleep-tracker", props: { hours: 7.5, quality: "good", stages: [{ name: "Profundo", percent: 25, color: "#6366F1" }, { name: "Ligero", percent: 50, color: "#A855F7" }, { name: "REM", percent: 25, color: "#00D4FF" }] } },
    { name: "Composicion", type: "body-stats", props: { weight: 80, bodyFat: 15, muscle: 38, weightChange: -0.5, measurements: { waist: 82, chest: 102 } } },
    { name: "Mapa de Dolor", type: "pain-map", props: { areas: [{ name: "Hombro derecho", severity: 3, notes: "Leve tension" }, { name: "Espalda baja", severity: 2, notes: "Post-deadlift" }], lastUpdated: "Hoy 8:00" } }
  ],
  "Metabolismo": [
    { name: "Glucosa", type: "glucose-tracker", props: { current: 95, min: 72, max: 140, trend: "stable", lastMeal: "Hace 2h" } },
    { name: "Score Metabolico", type: "metabolic-score", props: { score: 82, factors: [{ name: "Sensibilidad Insulina", value: 85, status: "good" }, { name: "Termogenesis", value: 70, status: "warning" }, { name: "Flexibilidad Metabolica", value: 78, status: "good" }] } },
    { name: "Curva Energia", type: "energy-curve", props: { hours: [{ hour: "6am", level: 5 }, { hour: "9am", level: 8 }, { hour: "12pm", level: 7 }, { hour: "3pm", level: 4 }, { hour: "6pm", level: 8 }, { hour: "9pm", level: 6 }], peakHour: "9am", lowHour: "3pm" } }
  ],
  "Planificacion": [
    { name: "Timeline Temporada", type: "season-timeline", props: { seasonName: "Volumen Otoño", weeksCompleted: 8, totalWeeks: 12, phases: [{ name: "Adaptacion", active: false }, { name: "Acumulacion", active: true }, { name: "Intensificacion", active: false }, { name: "Deload", active: false }] } },
    { name: "Contrato de Season", type: "season-contract", props: { seasonName: "Definicion Verano 2025", startDate: "15 Ene", endDate: "15 Abr", goals: ["Bajar a 12% grasa corporal", "Mantener 1RM en lifts principales", "Cardio 3x/semana"], signature: false } }
  ],
  "Recaps": [
    { name: "Recap Diario", type: "daily-recap", props: { date: "Hoy", workoutCompleted: true, nutrition: { kcal: 2450, protein: 165 }, habits: [{ name: "Agua", done: true }, { name: "Suplementos", done: true }, { name: "Sueno 7h+", done: false }], insight: "Buen dia de entrenamiento, mejora el sueno para optimizar recuperacion" } },
    { name: "Review Semanal", type: "weekly-review", props: { weekNumber: 8, stats: { workouts: 5, avgKcal: 2380, streakDays: 12 }, wins: ["PR en sentadilla: 140kg", "5 dias de entrenamiento consecutivos"], improvements: ["Mejorar consistencia de sueno", "Aumentar ingesta de vegetales"] } },
    { name: "Recap de Season", type: "season-recap", props: { seasonName: "Volumen Otoño", duration: "12 semanas", achievements: ["Ganaste 3kg masa magra", "Nuevo PR Bench: 100kg", "Streak de 45 dias"], stats: { totalWorkouts: 48, avgWeight: 82 }, nextSteps: ["Fase de definicion", "Mantener fuerza", "Ajustar calorias a deficit"] } }
  ],
  "Habitos": [
    { name: "Agua", type: "hydration-tracker", props: { current: 1500, goal: 3000 } },
    { name: "Suplementos", type: "supplement-stack", props: { items: [{ name: "Creatina", dose: "5g", timing: "Pre-work", taken: false }, { name: "Omega 3", dose: "2 caps", timing: "Con comida", taken: true }, { name: "Vitamina D", dose: "2000 IU", timing: "Manana", taken: true }] } },
    { name: "Mis Rachas", type: "habit-streak", props: { habits: [{ name: "Gym", icon: "dumbbell", streak: 15, completed: true }, { name: "Agua 3L", icon: "droplet", streak: 8, completed: false }, { name: "Sueno 7h", icon: "moon", streak: 3, completed: true }] } }
  ],
  "Educacion": [
    { name: "Explicacion RPE", type: "explanation-card", props: { term: "RPE (Rate of Perceived Exertion)", definition: "Escala del 1-10 que mide que tan dificil sientes un ejercicio. RPE 10 = maximo esfuerzo posible.", example: "Si puedes hacer 2 reps mas, estas en RPE 8", category: "Entrenamiento" } },
    { name: "Mito Proteina", type: "myth-buster", props: { myth: "Necesitas consumir proteina inmediatamente despues de entrenar", reality: "La 'ventana anabolica' es de 4-6 horas. Lo importante es el consumo diario total, no el timing exacto.", source: "Schoenfeld et al. 2013" } },
    { name: "Aprende: Creatina", type: "learn-more", props: { topic: "Creatina Monohidrato", summary: "El suplemento mas estudiado y efectivo para mejorar fuerza y masa muscular.", benefits: ["Aumenta ATP disponible", "Mejora rendimiento en series cortas", "Ayuda a recuperacion"], actionButton: "Ver guia completa" } },
    { name: "Estudio", type: "source-card", props: { title: "Effects of creatine supplementation on performance and training adaptations", authors: "Kreider et al.", year: "2017", journal: "Mol Cell Biochem", keyFinding: "5g/dia de creatina mejora fuerza y potencia en un 10-20%", url: "pubmed.gov/12345" } }
  ],
  "Tools": [
    { name: "Calculadora RM", type: "max-rep-calculator", props: { weight: 100, reps: 5 } },
    { name: "Mensaje Coach", type: "coach-message", props: { coachName: "Alex", timestamp: "10m", message: "Excelente progreso esta semana. Sube el peso en sentadilla." } },
    { name: "Logro", type: "achievement", props: { title: "Iron Will", description: "Completaste 30 dias consecutivos de entrenamiento", unlockedAt: "Hace 2 dias" } },
    { name: "Antes/Despues", type: "before-after", props: { metric: "Peso Corporal", before: { value: "85kg", date: "1 Ene" }, after: { value: "80kg", date: "1 Abr" }, percentChange: -5.9 } },
    { name: "Mis Trofeos", type: "trophy-case", props: { trophies: [{ name: "First Blood", icon: "trophy", unlockedAt: "Ene 2025", rarity: "common" }, { name: "Century Club", icon: "medal", unlockedAt: "Mar 2025", rarity: "rare" }, { name: "Iron Mind", icon: "star", unlockedAt: "Abr 2025", rarity: "epic" }] } }
  ],
  "Recovery": [
    { name: "Rutina Wind Down", type: "wind-down", props: { bedtimeGoal: "22:30", currentTime: "21:45", activities: [{ name: "Apagar pantallas", duration: "30 min antes", completed: true }, { name: "Stretching suave", duration: "10 min", completed: false }, { name: "Respiracion 4-7-8", duration: "5 min", completed: false }], sleepScore: 72 } }
  ],
  "BLAZE Avanzado": [
    { name: "Superset Pecho-Espalda", type: "superset-card", props: { name: "Push-Pull Superset", restBetween: 60, exercises: [{ name: "Press Banca", sets: 4, reps: "10", load: "70kg" }, { name: "Remo con Barra", sets: 4, reps: "10", load: "60kg" }], notes: "Minimo descanso entre ejercicios del superset" } },
    { name: "AMRAP 15min", type: "amrap-timer", props: { duration: 900, exercises: [{ name: "Burpees", reps: 10 }, { name: "Box Jumps", reps: 15 }, { name: "KB Swings", reps: 20 }], currentRound: 3, totalRounds: 0, isRunning: false } },
    { name: "EMOM 20min", type: "emom-clock", props: { totalMinutes: 20, exercises: [{ name: "Clean & Press", reps: 5 }, { name: "Front Squat", reps: 8 }], currentMinute: 7, isRunning: false } }
  ],
  "WAVE Recuperacion": [
    { name: "HRV Semanal", type: "hrv-chart", props: { readings: [{ time: "Lun", value: 65 }, { time: "Mar", value: 72 }, { time: "Mie", value: 68 }, { time: "Jue", value: 75 }, { time: "Vie", value: 70 }], trend: "up", avgScore: 70, recommendation: "Buena tendencia, mantén el descanso" } },
    { name: "Score Recuperacion", type: "recovery-score", props: { overall: 78, factors: { sleep: 85, hrv: 72, soreness: 65, stress: 80 }, recommendation: "Optimo para entrenamiento moderado" } },
    { name: "Nivel de Estres", type: "stress-meter", props: { level: 4, sources: [{ name: "Trabajo", impact: "alto" }, { name: "Sueno", impact: "bajo" }], recommendations: ["Respiracion profunda 5min", "Caminata al aire libre", "Reducir cafeina despues de 2pm"] } }
  ],
  "METABOL Avanzado": [
    { name: "Timer Ayuno", type: "fasting-timer", props: { startTime: "20:00", targetHours: 16, currentPhase: "ketosis", benefits: ["Autofagia activa", "Sensibilidad insulina mejorada", "Quema de grasa optimizada"] } },
    { name: "Cetonas", type: "ketone-tracker", props: { reading: 1.8, trend: "rising", zone: "optimal", history: [{ date: "Lun", value: 0.5 }, { date: "Mar", value: 1.2 }, { date: "Mie", value: 1.8 }] } },
    { name: "Calculadora TDEE", type: "tdee-calculator", props: { bmr: 1850, activityLevel: "active", result: 2775, macroSplit: { protein: 185, carbs: 277, fat: 92 } } }
  ],
  "ATLAS Corporal": [
    { name: "Escaneo 3D", type: "body-scan-3d", props: { measurements: { chest: 102, waist: 82, hips: 98, arms: 38, thighs: 58 }, highlights: [{ area: "Cintura", change: -2, trend: "down" }, { area: "Pecho", change: 1, trend: "up" }], lastScan: "Hace 7 dias" } },
    { name: "Chequeo Postura", type: "posture-check", props: { overallScore: 72, issues: [{ area: "Hombros", severity: 2, description: "Rotacion anterior leve" }, { area: "Cadera", severity: 1, description: "Inclinacion pelvica anterior" }], exercises: [{ name: "Face Pulls", benefit: "Corrige rotacion de hombros" }, { name: "Dead Bug", benefit: "Fortalece core y postura" }] } },
    { name: "Flexibilidad", type: "flexibility-score", props: { overall: 65, byArea: { shoulders: 70, hips: 55, hamstrings: 60, spine: 75 }, recommendations: ["Stretching de caderas 10min/dia", "Yoga 2x/semana para isquios"] } }
  ],
  "NOVA Fuerza": [
    { name: "PR Sentadilla", type: "pr-tracker", props: { exercise: "Sentadilla", currentPR: { weight: "140kg", date: "15 Dic" }, history: [{ weight: "120kg", date: "Oct" }, { weight: "130kg", date: "Nov" }, { weight: "140kg", date: "Dic" }], projection: "145kg en 4 semanas" } },
    { name: "Volumen Semanal", type: "volume-chart", props: { weeklyData: [{ week: "S1", volume: 45000 }, { week: "S2", volume: 48000 }, { week: "S3", volume: 52000 }, { week: "S4", volume: 55000 }], trend: "up", totalVolume: 200000, recommendation: "Progresion saludable, considera deload proxima semana" } },
    { name: "Curva Fuerza", type: "strength-curve", props: { exercise: "Press Banca", data: [{ reps: 1, weight: 100 }, { reps: 3, weight: 92 }, { reps: 5, weight: 85 }, { reps: 8, weight: 75 }, { reps: 10, weight: 70 }], estimatedMax: 100, weakPoints: ["Fuerza de arranque", "Triceps en lockout"] } }
  ]
};