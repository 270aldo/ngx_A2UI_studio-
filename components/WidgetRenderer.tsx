import React, { useState, useEffect } from 'react';
import {
  Cpu, Zap, Droplets, UtensilsCrossed, Pill, Activity,
  Calendar, Sun, Calculator, User, AlertTriangle, Lightbulb,
  Dumbbell, CheckCircle2, Heart, Moon, Scale, Timer, Trophy,
  History, Flame, TrendingUp, TrendingDown, Award
} from 'lucide-react';
import { COLORS } from '../constants';
import { GlassCard, AgentBadge, ProgressBar, ActionButton } from './UIComponents';
import { WidgetPayload, WidgetLayout, isWidgetLayout, RenderPayload } from '../types';

interface WidgetActionProps {
  data: any;
  onAction?: (action: string, payload?: any) => void;
}

// --- DASHBOARD ---
export const ProgressDashboard: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.genesis}>
    <AgentBadge name="GENESIS" color={COLORS.genesis} icon={Cpu} />
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-bold text-white text-sm">{data.title || 'Resumen'}</h3>
        <p className="text-[10px] text-white/40">{data.subtitle}</p>
      </div>
      <span className="text-xl font-bold text-white">{data.progress}%</span>
    </div>
    <ProgressBar value={data.progress} max={100} color={COLORS.genesis} />
    <div className="grid grid-cols-2 gap-2 mt-4">
      {data.metrics?.map((m: any, i: number) => (
        <div key={i} className="bg-white/5 p-2 rounded-lg border border-white/5">
          <p className="text-[9px] uppercase text-white/40">{m.label}</p>
          <span className="font-bold text-white">{m.value}</span>
        </div>
      ))}
    </div>
  </GlassCard>
);

export const MetricCard: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.stella}>
    <AgentBadge name="STELLA" color={COLORS.stella} icon={Activity} />
    <div className="flex justify-between items-center">
      <div>
        <p className="text-[10px] uppercase text-white/40 mb-1">{data.label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-white">{data.value}</span>
          <span className="text-xs text-white/40">{data.unit}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className={`text-[10px] ${data.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>{data.change}</span>
      </div>
    </div>
  </GlassCard>
);

// --- TRAINING ---
export const WorkoutCard: React.FC<WidgetActionProps> = ({ data, onAction }) => (
  <GlassCard borderColor={COLORS.blaze}>
    <AgentBadge name="BLAZE" color={COLORS.blaze} icon={Zap} />
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-bold text-white">{data.title}</h3>
        <p className="text-[10px] text-white/40">{data.category}</p>
      </div>
      <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-white/70">{data.duration}</span>
    </div>
    <div className="space-y-2 mb-4">
      {data.exercises?.slice(0, 4).map((ex: any, i: number) => (
        <div key={i} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
          <div className="w-6 h-6 rounded-full bg-[#FF4500]/20 text-[#FF4500] flex items-center justify-center text-[10px] font-bold">{i + 1}</div>
          <div className="flex-1">
            <p className="text-xs text-white">{ex.name}</p>
            <p className="text-[10px] text-white/40">{ex.sets}×{ex.reps} · {ex.load}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="bg-[#FF4500]/10 border border-[#FF4500]/20 p-3 rounded-lg mb-4">
      <p className="text-[10px] text-[#FF4500] font-bold">COACH NOTE</p>
      <p className="text-xs text-white/80">{data.coachNote}</p>
    </div>
    <ActionButton color={COLORS.blaze} onClick={() => onAction?.('START_WORKOUT', { id: data.workoutId })}>Iniciar Entrenamiento</ActionButton>
  </GlassCard>
);

export const ExerciseRow: React.FC<WidgetActionProps> = ({ data, onAction }) => (
  <GlassCard borderColor={COLORS.blaze}>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-[#FF4500]/20 flex items-center justify-center">
        <Dumbbell size={20} className="text-[#FF4500]" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-white text-sm">{data.name}</h4>
        <p className="text-[10px] text-white/40">Set {data.currentSet}/{data.totalSets}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-white">{data.load}</p>
        <p className="text-[10px] text-white/40">{data.reps} reps</p>
      </div>
    </div>
    <div className="flex gap-2 mt-3">
      <ActionButton variant="secondary" onClick={() => onAction?.('SKIP')}>Saltar</ActionButton>
      <ActionButton color={COLORS.blaze} onClick={() => onAction?.('COMPLETE')}>Completar</ActionButton>
    </div>
  </GlassCard>
);

// --- NUTRITION ---
export const MealPlan: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.macro}>
    <AgentBadge name="MACRO" color={COLORS.macro} icon={UtensilsCrossed} />
    <div className="flex justify-between items-center mb-3">
      <h3 className="font-bold text-white">Plan Nutricional</h3>
      <span className="text-xs text-white/40">{data.totalKcal} kcal</span>
    </div>
    <div className="space-y-2">
      {data.meals?.map((m: any, i: number) => (
        <div key={i} className={`flex justify-between items-center p-2 rounded-lg ${m.highlight ? 'bg-[#FFB800]/10 border border-[#FFB800]/20' : 'bg-white/5'}`}>
          <span className="text-[10px] font-bold text-white/50 w-12">{m.time}</span>
          <span className={`text-xs flex-1 ${m.highlight ? 'text-[#FFB800] font-bold' : 'text-white'}`}>{m.name}</span>
          <span className="text-[10px] text-white/30">{m.kcal}</span>
        </div>
      ))}
    </div>
  </GlassCard>
);

// --- HABITS ---
export const HydrationTracker: React.FC<WidgetActionProps> = ({ data, onAction }) => (
  <GlassCard borderColor={COLORS.wave}>
    <AgentBadge name="WAVE" color={COLORS.wave} icon={Droplets} />
    <div className="flex justify-between items-end mb-3">
      <span className="text-[10px] font-bold text-white/40 uppercase">Hidratación</span>
      <div className="text-right">
        <span className="text-2xl font-bold text-[#00D4FF]">{data.current}</span>
        <span className="text-xs text-white/30"> / {data.goal}ml</span>
      </div>
    </div>
    <ProgressBar value={data.current} max={data.goal} color={COLORS.aqua} />
    <div className="flex gap-2 mt-4">
      <ActionButton variant="secondary" onClick={() => onAction?.('ADD_WATER', 250)}>+250ml</ActionButton>
      <ActionButton color={COLORS.aqua} onClick={() => onAction?.('ADD_WATER', 500)}>+500ml</ActionButton>
    </div>
  </GlassCard>
);

export const SupplementStack: React.FC<WidgetActionProps> = ({ data, onAction }) => (
  <GlassCard borderColor={COLORS.nova}>
    <AgentBadge name="NOVA" color={COLORS.nova} icon={Pill} />
    <h3 className="font-bold text-white mb-3">Stack Diario</h3>
    <div className="space-y-2">
      {data.items?.map((item: any, i: number) => (
        <div key={i} onClick={() => onAction?.('TOGGLE_SUPP', { id: i })} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${item.taken ? 'bg-[#D946EF] border-[#D946EF]' : 'border-white/30'}`}>
            {item.taken && <CheckCircle2 size={12} className="text-white" />}
          </div>
          <div className="flex-1">
            <span className={`text-xs ${item.taken ? 'text-white/40 line-through' : 'text-white'}`}>{item.name}</span>
            <span className="text-[9px] text-white/30 ml-2">{item.dose}</span>
          </div>
          <span className="text-[9px] text-white/30">{item.timing}</span>
        </div>
      ))}
    </div>
  </GlassCard>
);

// --- PLANNING ---
export const SeasonTimeline: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.tempo}>
    <AgentBadge name="TEMPO" color={COLORS.tempo} icon={Calendar} />
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-white">{data.seasonName}</h3>
      <span className="text-xs text-white/40">{data.weeksCompleted}/{data.totalWeeks} semanas</span>
    </div>
    <div className="space-y-2">
      {data.phases?.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${p.active ? 'bg-[#6D00FF] animate-pulse' : 'bg-white/20'}`} />
          <p className={`text-xs flex-1 ${p.active ? 'text-white font-bold' : 'text-white/60'}`}>{p.name}</p>
        </div>
      ))}
    </div>
  </GlassCard>
);

export const TodayCard: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.genesis}>
    <AgentBadge name="GENESIS" color={COLORS.genesis} icon={Sun} />
    <h3 className="text-lg font-bold text-white mb-1">{data.greeting}</h3>
    <p className="text-[10px] text-white/40 mb-4">{data.date}</p>
    {data.mainSession && (
      <div className="bg-white/5 p-3 rounded-xl mb-3 flex justify-between">
        <p className="text-xs font-bold text-white">{data.mainSession.title}</p>
        <span className="text-[9px] bg-[#FF4500]/20 text-[#FF4500] px-2 py-1 rounded">{data.mainSession.type}</span>
      </div>
    )}
    {data.todos && (
      <div className="space-y-1">
        {data.todos.map((t: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-[10px]">
            <div className={`w-3 h-3 rounded border ${t.done ? 'bg-[#00FF88] border-[#00FF88]' : 'border-white/30'}`} />
            <span className={t.done ? 'text-white/30 line-through' : 'text-white/60'}>{t.label}</span>
          </div>
        ))}
      </div>
    )}
  </GlassCard>
);

// --- TOOLS ---
export const MaxRepCalculator: React.FC<WidgetActionProps> = ({ data, onAction }) => (
  <GlassCard borderColor={COLORS.atlas}>
    <AgentBadge name="ATLAS" color={COLORS.atlas} icon={Calculator} />
    <h3 className="font-bold text-white mb-3">Calculadora 1RM</h3>
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-white/5 p-3 rounded-lg">
        <p className="text-[9px] text-white/40">Peso</p>
        <p className="text-lg font-bold text-white">{data.weight}</p>
      </div>
      <div className="bg-white/5 p-3 rounded-lg">
        <p className="text-[9px] text-white/40">Reps</p>
        <p className="text-lg font-bold text-white">{data.reps}</p>
      </div>
    </div>
    <div className="bg-[#EC4899]/10 border border-[#EC4899]/20 p-3 rounded-lg text-center mb-3">
      <p className="text-[9px] text-white/40">1RM Estimado</p>
      <p className="text-2xl font-bold text-[#EC4899]">{Math.round(data.weight * (1 + data.reps/30))} kg</p>
    </div>
    <ActionButton color={COLORS.atlas} onClick={() => onAction?.('SAVE_RM', {})}>Guardar Resultado</ActionButton>
  </GlassCard>
);

export const AlertBanner: React.FC<WidgetActionProps> = ({ data }) => (
  <div className={`p-3 rounded-xl border flex items-center gap-3 mb-2 ${data.type === 'warning' ? 'bg-[#FFB800]/10 border-[#FFB800]/20' : 'bg-[#00FF88]/10 border-[#00FF88]/20'}`}>
    <AlertTriangle size={18} className={data.type === 'warning' ? 'text-[#FFB800]' : 'text-[#00FF88]'} />
    <p className="text-xs text-white/80 flex-1">{data.message}</p>
  </div>
);

export const CoachMessage: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.spark}>
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFB800] to-[#F59E0B] flex items-center justify-center">
        <User size={18} className="text-white"/>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-white">{data.coachName}</span>
          <span className="text-[9px] text-white/30">{data.timestamp}</span>
        </div>
        <p className="text-xs text-white/80">{data.message}</p>
      </div>
    </div>
  </GlassCard>
);

export const InsightCard: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.stella}>
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#A855F7]/20 flex items-center justify-center">
        <Lightbulb size={16} className="text-[#A855F7]" />
      </div>
      <div>
        <p className="text-[9px] text-[#A855F7] font-bold uppercase mb-1">Insight</p>
        <p className="text-xs text-white/80">{data.message}</p>
      </div>
    </div>
  </GlassCard>
);

// --- NEW FITNESS WIDGETS ---

// Heart Rate Card
export const HeartRateCard: React.FC<WidgetActionProps> = ({ data }) => {
  const getZoneColor = (zone: string) => {
    const zones: Record<string, string> = {
      rest: '#00FF88',
      fat_burn: '#FFB800',
      cardio: '#FF6347',
      peak: '#FF4500',
      recovery: '#00D4FF'
    };
    return zones[zone] || COLORS.blaze;
  };

  return (
    <GlassCard borderColor={getZoneColor(data.zone)}>
      <AgentBadge name="WAVE" color={getZoneColor(data.zone)} icon={Heart} />
      <div className="flex justify-between items-end mb-3">
        <div>
          <p className="text-[10px] text-white/40 uppercase">Frecuencia Cardiaca</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold" style={{ color: getZoneColor(data.zone) }}>{data.bpm}</span>
            <span className="text-xs text-white/40">bpm</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] px-2 py-1 rounded-full uppercase font-bold" style={{ background: `${getZoneColor(data.zone)}20`, color: getZoneColor(data.zone) }}>
            {data.zone?.replace('_', ' ')}
          </span>
        </div>
      </div>
      {data.trend && (
        <div className="flex items-center gap-2 text-[10px] text-white/40">
          {data.trend === 'up' ? <TrendingUp size={12} className="text-red-400" /> : <TrendingDown size={12} className="text-green-400" />}
          <span>{data.trend === 'up' ? 'Subiendo' : 'Bajando'}</span>
        </div>
      )}
    </GlassCard>
  );
};

// Sleep Tracker
export const SleepTracker: React.FC<WidgetActionProps> = ({ data }) => {
  const qualityColors: Record<string, string> = {
    excellent: '#00FF88',
    good: '#00D4FF',
    fair: '#FFB800',
    poor: '#FF4500'
  };

  return (
    <GlassCard borderColor={COLORS.luna}>
      <AgentBadge name="LUNA" color={COLORS.luna} icon={Moon} />
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] text-white/40 uppercase">Sueno Anoche</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">{data.hours}</span>
            <span className="text-xs text-white/40">horas</span>
          </div>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full font-bold" style={{ background: `${qualityColors[data.quality] || COLORS.luna}20`, color: qualityColors[data.quality] || COLORS.luna }}>
          {data.quality}
        </span>
      </div>
      {data.stages && (
        <div className="space-y-2">
          {data.stages.map((stage: any, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-16 text-[9px] text-white/40">{stage.name}</div>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${stage.percent}%`, background: stage.color || COLORS.luna }} />
              </div>
              <span className="text-[9px] text-white/40 w-8">{stage.percent}%</span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

// Body Stats
export const BodyStats: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.atlas}>
    <AgentBadge name="ATLAS" color={COLORS.atlas} icon={Scale} />
    <h3 className="font-bold text-white mb-4">Composicion Corporal</h3>
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white/5 p-3 rounded-xl">
        <p className="text-[9px] text-white/40 uppercase">Peso</p>
        <p className="text-xl font-bold text-white">{data.weight}<span className="text-xs text-white/40 ml-1">kg</span></p>
        {data.weightChange && (
          <p className={`text-[9px] ${data.weightChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {data.weightChange > 0 ? '+' : ''}{data.weightChange}kg
          </p>
        )}
      </div>
      <div className="bg-white/5 p-3 rounded-xl">
        <p className="text-[9px] text-white/40 uppercase">% Grasa</p>
        <p className="text-xl font-bold text-[#EC4899]">{data.bodyFat}<span className="text-xs text-white/40 ml-1">%</span></p>
      </div>
      {data.muscle && (
        <div className="bg-white/5 p-3 rounded-xl">
          <p className="text-[9px] text-white/40 uppercase">Musculo</p>
          <p className="text-xl font-bold text-[#00FF88]">{data.muscle}<span className="text-xs text-white/40 ml-1">kg</span></p>
        </div>
      )}
      {data.measurements?.waist && (
        <div className="bg-white/5 p-3 rounded-xl">
          <p className="text-[9px] text-white/40 uppercase">Cintura</p>
          <p className="text-xl font-bold text-white">{data.measurements.waist}<span className="text-xs text-white/40 ml-1">cm</span></p>
        </div>
      )}
    </div>
  </GlassCard>
);

// Rest Timer
export const RestTimer: React.FC<WidgetActionProps> = ({ data, onAction }) => {
  const [seconds, setSeconds] = useState(data.seconds || 60);
  const [isRunning, setIsRunning] = useState(data.autoStart || false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => setSeconds((s: number) => s - 1), 1000);
    } else if (seconds === 0) {
      onAction?.('TIMER_COMPLETE');
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds, onAction]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((data.seconds - seconds) / data.seconds) * 100;

  return (
    <GlassCard borderColor={COLORS.tempo}>
      <AgentBadge name="TEMPO" color={COLORS.tempo} icon={Timer} />
      <div className="text-center py-4">
        <p className="text-[10px] text-white/40 uppercase mb-2">Descanso</p>
        <p className="text-5xl font-bold text-white mb-4">{formatTime(seconds)}</p>
        <ProgressBar value={progress} max={100} color={COLORS.tempo} height={4} />
      </div>
      <div className="flex gap-2 mt-4">
        <ActionButton
          variant="secondary"
          onClick={() => { setSeconds(data.seconds); setIsRunning(false); }}
        >
          Reset
        </ActionButton>
        <ActionButton
          color={COLORS.tempo}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? 'Pausar' : 'Iniciar'}
        </ActionButton>
      </div>
    </GlassCard>
  );
};

// Achievement Badge
export const AchievementBadge: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.spark}>
    <div className="text-center py-2">
      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#FFB800] to-[#F59E0B] flex items-center justify-center shadow-lg">
        <Trophy size={28} className="text-white" />
      </div>
      <h3 className="font-bold text-white text-lg mb-1">{data.title}</h3>
      <p className="text-[10px] text-white/40">{data.description}</p>
      {data.unlockedAt && (
        <div className="mt-3 flex items-center justify-center gap-1 text-[9px] text-[#FFB800]">
          <Award size={10} />
          <span>Desbloqueado: {data.unlockedAt}</span>
        </div>
      )}
    </div>
  </GlassCard>
);

// Workout History
export const WorkoutHistory: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.blaze}>
    <AgentBadge name="BLAZE" color={COLORS.blaze} icon={History} />
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-white">Historial</h3>
      {data.weekSummary && (
        <span className="text-[10px] text-white/40">{data.weekSummary.total} entrenamientos</span>
      )}
    </div>
    <div className="space-y-2">
      {data.sessions?.slice(0, 5).map((session: any, i: number) => (
        <div key={i} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
          <div className="w-10 h-10 rounded-lg bg-[#FF4500]/20 flex items-center justify-center">
            <Dumbbell size={16} className="text-[#FF4500]" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-white font-medium">{session.name}</p>
            <p className="text-[9px] text-white/40">{session.date} - {session.duration}</p>
          </div>
          {session.completed && <CheckCircle2 size={14} className="text-[#00FF88]" />}
        </div>
      ))}
    </div>
  </GlassCard>
);

// Streak Counter
export const StreakCounter: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.spark}>
    <AgentBadge name="SPARK" color={COLORS.spark} icon={Flame} />
    <div className="text-center py-2">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Flame size={32} className="text-[#FFB800]" />
        <span className="text-5xl font-black text-white">{data.currentStreak}</span>
      </div>
      <p className="text-xs text-white/60 mb-4">dias consecutivos</p>
      {data.bestStreak && (
        <div className="bg-white/5 p-2 rounded-lg inline-flex items-center gap-2">
          <Trophy size={12} className="text-[#FFB800]" />
          <span className="text-[10px] text-white/60">Mejor racha: <span className="text-white font-bold">{data.bestStreak}</span> dias</span>
        </div>
      )}
    </div>
  </GlassCard>
);

// ============================================
// USER JOURNEY WIDGETS
// ============================================

// Readiness Battery - Morning assessment
export const ReadinessBattery: React.FC<WidgetActionProps> = ({ data, onAction }) => {
  const getIndicatorColor = (value: number) => {
    if (value >= 80) return '#00FF88';
    if (value >= 60) return '#FFB800';
    if (value >= 40) return '#FF6347';
    return '#FF4500';
  };

  const indicators = [
    { key: 'hrv', label: 'HRV', value: data.hrv || 0, icon: Heart },
    { key: 'sleep', label: 'Sueño', value: data.sleep || 0, icon: Moon },
    { key: 'soreness', label: 'Dolor', value: data.soreness || 0, icon: Activity },
    { key: 'energy', label: 'Energía', value: data.energy || 0, icon: Zap }
  ];

  const avgScore = Math.round(indicators.reduce((acc, i) => acc + i.value, 0) / indicators.length);

  return (
    <GlassCard borderColor={COLORS.tempo}>
      <AgentBadge name="TEMPO" color={COLORS.tempo} icon={Activity} />
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-white">Readiness Score</h3>
          <p className="text-[10px] text-white/40">Evaluación matutina</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold" style={{ color: getIndicatorColor(avgScore) }}>{avgScore}</span>
          <span className="text-xs text-white/40">/100</span>
        </div>
      </div>
      <div className="space-y-3">
        {indicators.map((ind) => (
          <div key={ind.key} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <ind.icon size={14} style={{ color: getIndicatorColor(ind.value) }} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-white/60">{ind.label}</span>
                <span className="text-[10px] font-bold" style={{ color: getIndicatorColor(ind.value) }}>{ind.value}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${ind.value}%`, background: getIndicatorColor(ind.value) }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <ActionButton color={COLORS.tempo} onClick={() => onAction?.('START_DAY', { readiness: avgScore })} className="mt-4">
        {avgScore >= 70 ? 'Listo para Entrenar' : 'Día de Recuperación'}
      </ActionButton>
    </GlassCard>
  );
};

// Season Contract - Initial commitment
export const SeasonContract: React.FC<WidgetActionProps> = ({ data, onAction }) => (
  <GlassCard borderColor={COLORS.genesis}>
    <AgentBadge name="GENESIS" color={COLORS.genesis} icon={Cpu} />
    <div className="text-center py-4">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#6D00FF] to-[#A855F7] flex items-center justify-center">
        <Award size={28} className="text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{data.title || 'Nueva Temporada'}</h3>
      <p className="text-xs text-white/60 mb-4">{data.description || 'Compromiso de 12 semanas'}</p>

      <div className="bg-white/5 p-4 rounded-xl mb-4 text-left">
        <p className="text-[10px] text-white/40 uppercase mb-2">Objetivo Principal</p>
        <p className="text-sm font-bold text-white">{data.goal || 'Transformación física'}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/5 p-3 rounded-lg">
          <p className="text-[9px] text-white/40">Duración</p>
          <p className="text-sm font-bold text-white">{data.weeks || 12} semanas</p>
        </div>
        <div className="bg-white/5 p-3 rounded-lg">
          <p className="text-[9px] text-white/40">Inicio</p>
          <p className="text-sm font-bold text-white">{data.startDate || 'Hoy'}</p>
        </div>
      </div>

      <ActionButton color={COLORS.genesis} onClick={() => onAction?.('ACCEPT_CONTRACT', { seasonId: data.seasonId })}>
        Aceptar Compromiso
      </ActionButton>
    </div>
  </GlassCard>
);

// Live Session - Active workout
export const LiveSession: React.FC<WidgetActionProps> = ({ data, onAction }) => {
  const completedExercises = data.exercises?.filter((e: any) => e.completed)?.length || 0;
  const totalExercises = data.exercises?.length || 0;
  const progress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  return (
    <GlassCard borderColor={COLORS.blaze}>
      <div className="flex justify-between items-start mb-3">
        <AgentBadge name="BLAZE" color={COLORS.blaze} icon={Zap} />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FF4500] animate-pulse" />
          <span className="text-[10px] text-[#FF4500] font-bold">EN VIVO</span>
        </div>
      </div>

      <h3 className="font-bold text-white text-lg mb-1">{data.title}</h3>
      <p className="text-[10px] text-white/40 mb-4">{completedExercises}/{totalExercises} ejercicios completados</p>

      <ProgressBar value={progress} max={100} color={COLORS.blaze} />

      <div className="space-y-2 mt-4 max-h-48 overflow-y-auto">
        {data.exercises?.map((ex: any, i: number) => (
          <div
            key={i}
            onClick={() => !ex.completed && onAction?.('SELECT_EXERCISE', { index: i })}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
              ex.current ? 'bg-[#FF4500]/20 border border-[#FF4500]/40' :
              ex.completed ? 'bg-white/5 opacity-50' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
              ex.completed ? 'bg-[#00FF88] text-black' :
              ex.current ? 'bg-[#FF4500] text-white' : 'bg-white/20 text-white/60'
            }`}>
              {ex.completed ? <CheckCircle2 size={12} /> : i + 1}
            </div>
            <div className="flex-1">
              <p className={`text-xs ${ex.completed ? 'line-through text-white/40' : 'text-white'}`}>{ex.name}</p>
              <p className="text-[9px] text-white/40">{ex.sets}×{ex.reps} · {ex.load}</p>
            </div>
            {ex.current && <Zap size={14} className="text-[#FF4500]" />}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <ActionButton variant="secondary" onClick={() => onAction?.('PAUSE_SESSION')}>Pausar</ActionButton>
        <ActionButton color={COLORS.blaze} onClick={() => onAction?.('COMPLETE_SESSION')}>Finalizar</ActionButton>
      </div>
    </GlassCard>
  );
};

// Daily Recap - End of day summary
export const DailyRecap: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.genesis}>
    <AgentBadge name="GENESIS" color={COLORS.genesis} icon={Sun} />
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-bold text-white">Resumen del Día</h3>
        <p className="text-[10px] text-white/40">{data.date}</p>
      </div>
      <div className="text-right">
        <span className="text-2xl font-bold text-[#00FF88]">{data.score || 0}%</span>
        <p className="text-[9px] text-white/40">completado</p>
      </div>
    </div>

    <div className="space-y-3">
      {data.items?.map((item: any, i: number) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
            item.completed ? 'bg-[#00FF88]' : 'bg-white/10'
          }`}>
            {item.completed && <CheckCircle2 size={12} className="text-black" />}
          </div>
          <span className={`text-xs flex-1 ${item.completed ? 'text-white' : 'text-white/40'}`}>{item.label}</span>
          {item.value && <span className="text-[10px] text-white/60">{item.value}</span>}
        </div>
      ))}
    </div>

    {data.note && (
      <div className="mt-4 bg-[#6D00FF]/10 border border-[#6D00FF]/20 p-3 rounded-lg">
        <p className="text-[10px] text-[#6D00FF] font-bold mb-1">NOTA DEL DÍA</p>
        <p className="text-xs text-white/80">{data.note}</p>
      </div>
    )}
  </GlassCard>
);

// Habit Streak - Grid of habits
export const HabitStreak: React.FC<WidgetActionProps> = ({ data, onAction }) => {
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  return (
    <GlassCard borderColor={COLORS.spark}>
      <AgentBadge name="SPARK" color={COLORS.spark} icon={Flame} />
      <h3 className="font-bold text-white mb-4">Rachas de Hábitos</h3>

      <div className="space-y-3">
        {data.habits?.map((habit: any, i: number) => (
          <div key={i} className="bg-white/5 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-white">{habit.name}</span>
              <span className="text-[10px] text-[#FFB800] font-bold">{habit.streak} días</span>
            </div>
            <div className="flex gap-1">
              {days.map((day, j) => {
                const isCompleted = habit.week?.[j];
                return (
                  <div
                    key={j}
                    onClick={() => onAction?.('TOGGLE_HABIT', { habitId: i, day: j })}
                    className={`flex-1 aspect-square rounded flex items-center justify-center text-[8px] cursor-pointer transition-all ${
                      isCompleted ? 'bg-[#FFB800] text-black font-bold' : 'bg-white/10 text-white/40 hover:bg-white/20'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// Macro Dial - Circular macro trackers
export const MacroDial: React.FC<WidgetActionProps> = ({ data }) => {
  const macros = [
    { key: 'protein', label: 'Proteína', current: data.protein?.current || 0, goal: data.protein?.goal || 150, color: '#FF6347' },
    { key: 'carbs', label: 'Carbos', current: data.carbs?.current || 0, goal: data.carbs?.goal || 200, color: '#FFB800' },
    { key: 'fat', label: 'Grasa', current: data.fat?.current || 0, goal: data.fat?.goal || 60, color: '#00D4FF' }
  ];

  return (
    <GlassCard borderColor={COLORS.macro}>
      <AgentBadge name="MACRO" color={COLORS.macro} icon={UtensilsCrossed} />
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-white">Macros del Día</h3>
        <span className="text-xs text-white/40">{data.totalKcal || 0} kcal</span>
      </div>

      <div className="flex justify-around">
        {macros.map((macro) => {
          const percent = Math.min((macro.current / macro.goal) * 100, 100);
          const circumference = 2 * Math.PI * 36;
          const strokeDashoffset = circumference - (percent / 100) * circumference;

          return (
            <div key={macro.key} className="text-center">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  <circle
                    cx="40" cy="40" r="36" fill="none"
                    stroke={macro.color} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-white">{macro.current}</span>
                  <span className="text-[8px] text-white/40">/{macro.goal}g</span>
                </div>
              </div>
              <p className="text-[10px] text-white/60 mt-1">{macro.label}</p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

// Season Recap - Epic season summary
export const SeasonRecap: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.genesis}>
    <div className="text-center py-2">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#6D00FF] via-[#A855F7] to-[#EC4899] flex items-center justify-center">
        <Trophy size={36} className="text-white" />
      </div>
      <AgentBadge name="GENESIS" color={COLORS.genesis} icon={Award} />

      <h3 className="text-2xl font-black text-white mt-4 mb-2">{data.seasonName || 'Temporada Completada'}</h3>
      <p className="text-xs text-white/60 mb-6">{data.duration || '12 semanas de transformación'}</p>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-white/5 p-3 rounded-xl">
          <p className="text-2xl font-bold text-[#00FF88]">{data.workouts || 0}</p>
          <p className="text-[9px] text-white/40">Entrenamientos</p>
        </div>
        <div className="bg-white/5 p-3 rounded-xl">
          <p className="text-2xl font-bold text-[#FFB800]">{data.streak || 0}</p>
          <p className="text-[9px] text-white/40">Mejor Racha</p>
        </div>
        <div className="bg-white/5 p-3 rounded-xl">
          <p className="text-2xl font-bold text-[#00D4FF]">{data.achievements || 0}</p>
          <p className="text-[9px] text-white/40">Logros</p>
        </div>
      </div>

      {data.highlight && (
        <div className="bg-gradient-to-r from-[#6D00FF]/20 to-[#EC4899]/20 p-4 rounded-xl border border-[#6D00FF]/30">
          <p className="text-[10px] text-[#A855F7] font-bold mb-1">LOGRO DESTACADO</p>
          <p className="text-sm text-white font-bold">{data.highlight}</p>
        </div>
      )}
    </div>
  </GlassCard>
);

// Pain Map - Body pain tracker
export const PainMap: React.FC<WidgetActionProps> = ({ data, onAction }) => {
  const bodyParts = [
    { id: 'neck', label: 'Cuello', top: '12%', left: '50%' },
    { id: 'shoulders', label: 'Hombros', top: '18%', left: '50%' },
    { id: 'chest', label: 'Pecho', top: '28%', left: '50%' },
    { id: 'back', label: 'Espalda', top: '35%', left: '50%' },
    { id: 'arms', label: 'Brazos', top: '32%', left: '25%' },
    { id: 'core', label: 'Core', top: '45%', left: '50%' },
    { id: 'legs', label: 'Piernas', top: '65%', left: '50%' },
    { id: 'knees', label: 'Rodillas', top: '75%', left: '50%' }
  ];

  const getPainColor = (level: number) => {
    if (level === 0) return 'bg-white/10';
    if (level === 1) return 'bg-[#FFB800]';
    if (level === 2) return 'bg-[#FF6347]';
    return 'bg-[#FF4500]';
  };

  return (
    <GlassCard borderColor={COLORS.atlas}>
      <AgentBadge name="ATLAS" color={COLORS.atlas} icon={Activity} />
      <h3 className="font-bold text-white mb-2">Mapa de Dolor</h3>
      <p className="text-[10px] text-white/40 mb-4">Toca las zonas con molestias</p>

      <div className="relative h-64 bg-white/5 rounded-xl overflow-hidden">
        {/* Body silhouette representation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-56 bg-white/10 rounded-full" />
        </div>

        {bodyParts.map((part) => {
          const painLevel = data.pain?.[part.id] || 0;
          return (
            <div
              key={part.id}
              onClick={() => onAction?.('TOGGLE_PAIN', { part: part.id, level: (painLevel + 1) % 4 })}
              className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full cursor-pointer transition-all flex items-center justify-center ${getPainColor(painLevel)}`}
              style={{ top: part.top, left: part.left }}
            >
              {painLevel > 0 && <span className="text-[10px] font-bold text-white">{painLevel}</span>}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-4 mt-3 text-[9px]">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-white/10" /> Sin dolor</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#FFB800]" /> Leve</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#FF6347]" /> Moderado</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#FF4500]" /> Severo</div>
      </div>
    </GlassCard>
  );
};

// ============================================
// SAGE WIDGETS (Nutrition Strategy)
// ============================================

// Nutrition Strategy
export const NutritionStrategy: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.sage}>
    <AgentBadge name="SAGE" color={COLORS.sage} icon={Lightbulb} />
    <h3 className="font-bold text-white mb-2">{data.title || 'Estrategia Nutricional'}</h3>
    <p className="text-[10px] text-white/40 mb-4">{data.phase || 'Fase de definición'}</p>

    <div className="space-y-3">
      <div className="bg-white/5 p-3 rounded-lg">
        <p className="text-[9px] text-white/40 uppercase">Calorías Objetivo</p>
        <p className="text-xl font-bold text-white">{data.targetKcal || 2000} <span className="text-xs text-white/40">kcal/día</span></p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/5 p-2 rounded-lg text-center">
          <p className="text-lg font-bold text-[#FF6347]">{data.proteinRatio || 30}%</p>
          <p className="text-[8px] text-white/40">Proteína</p>
        </div>
        <div className="bg-white/5 p-2 rounded-lg text-center">
          <p className="text-lg font-bold text-[#FFB800]">{data.carbsRatio || 40}%</p>
          <p className="text-[8px] text-white/40">Carbos</p>
        </div>
        <div className="bg-white/5 p-2 rounded-lg text-center">
          <p className="text-lg font-bold text-[#00D4FF]">{data.fatRatio || 30}%</p>
          <p className="text-[8px] text-white/40">Grasa</p>
        </div>
      </div>

      {data.tips && (
        <div className="bg-[#10B981]/10 border border-[#10B981]/20 p-3 rounded-lg">
          <p className="text-[10px] text-[#10B981] font-bold mb-1">CONSEJO</p>
          <p className="text-xs text-white/80">{data.tips}</p>
        </div>
      )}
    </div>
  </GlassCard>
);

// Calorie Balance
export const CalorieBalance: React.FC<WidgetActionProps> = ({ data }) => {
  const consumed = data.consumed || 0;
  const burned = data.burned || 0;
  const goal = data.goal || 2000;
  const net = consumed - burned;
  const remaining = goal - net;

  return (
    <GlassCard borderColor={COLORS.sage}>
      <AgentBadge name="SAGE" color={COLORS.sage} icon={Activity} />
      <h3 className="font-bold text-white mb-4">Balance Calórico</h3>

      <div className="flex justify-between items-end mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#00FF88]">+{consumed}</p>
          <p className="text-[9px] text-white/40">Consumido</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#FF6347]">-{burned}</p>
          <p className="text-[9px] text-white/40">Quemado</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{net}</p>
          <p className="text-[9px] text-white/40">Neto</p>
        </div>
      </div>

      <div className="bg-white/5 p-3 rounded-xl text-center">
        <p className="text-[9px] text-white/40">Calorías Restantes</p>
        <p className={`text-3xl font-bold ${remaining >= 0 ? 'text-[#10B981]' : 'text-[#FF4500]'}`}>
          {remaining >= 0 ? remaining : `+${Math.abs(remaining)}`}
        </p>
      </div>
    </GlassCard>
  );
};

// Meal Swap
export const MealSwap: React.FC<WidgetActionProps> = ({ data, onAction }) => (
  <GlassCard borderColor={COLORS.sage}>
    <AgentBadge name="SAGE" color={COLORS.sage} icon={UtensilsCrossed} />
    <h3 className="font-bold text-white mb-2">Intercambio Sugerido</h3>
    <p className="text-[10px] text-white/40 mb-4">Alternativa más saludable</p>

    <div className="flex items-center gap-3 mb-4">
      <div className="flex-1 bg-[#FF6347]/10 border border-[#FF6347]/20 p-3 rounded-lg text-center">
        <p className="text-xs text-white mb-1">{data.original?.name || 'Comida Original'}</p>
        <p className="text-lg font-bold text-[#FF6347]">{data.original?.kcal || 0}</p>
        <p className="text-[9px] text-white/40">kcal</p>
      </div>
      <div className="text-white/40">→</div>
      <div className="flex-1 bg-[#10B981]/10 border border-[#10B981]/20 p-3 rounded-lg text-center">
        <p className="text-xs text-white mb-1">{data.alternative?.name || 'Alternativa'}</p>
        <p className="text-lg font-bold text-[#10B981]">{data.alternative?.kcal || 0}</p>
        <p className="text-[9px] text-white/40">kcal</p>
      </div>
    </div>

    <div className="bg-white/5 p-2 rounded-lg text-center mb-3">
      <span className="text-[10px] text-white/60">Ahorras </span>
      <span className="text-sm font-bold text-[#10B981]">{(data.original?.kcal || 0) - (data.alternative?.kcal || 0)} kcal</span>
    </div>

    <ActionButton color={COLORS.sage} onClick={() => onAction?.('ACCEPT_SWAP', data)}>Aceptar Cambio</ActionButton>
  </GlassCard>
);

// ============================================
// METABOL WIDGETS (Metabolism)
// ============================================

// Glucose Tracker
export const GlucoseTracker: React.FC<WidgetActionProps> = ({ data }) => {
  const getGlucoseColor = (value: number) => {
    if (value < 70) return '#00D4FF';
    if (value <= 100) return '#00FF88';
    if (value <= 140) return '#FFB800';
    return '#FF4500';
  };

  const value = data.current || 95;

  return (
    <GlassCard borderColor={COLORS.metabol}>
      <AgentBadge name="METABOL" color={COLORS.metabol} icon={Activity} />
      <h3 className="font-bold text-white mb-4">Glucosa en Sangre</h3>

      <div className="text-center mb-4">
        <span className="text-5xl font-bold" style={{ color: getGlucoseColor(value) }}>{value}</span>
        <span className="text-sm text-white/40 ml-1">mg/dL</span>
      </div>

      <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
        <div className="h-full rounded-full transition-all" style={{
          width: `${Math.min((value / 200) * 100, 100)}%`,
          background: getGlucoseColor(value)
        }} />
      </div>

      <div className="flex justify-between text-[9px] text-white/40">
        <span>Bajo</span>
        <span>Normal</span>
        <span>Elevado</span>
        <span>Alto</span>
      </div>

      {data.lastMeal && (
        <p className="text-[10px] text-white/40 text-center mt-3">Última comida: {data.lastMeal}</p>
      )}
    </GlassCard>
  );
};

// Metabolic Score
export const MetabolicScore: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.metabol}>
    <AgentBadge name="METABOL" color={COLORS.metabol} icon={Zap} />
    <div className="text-center py-2">
      <h3 className="font-bold text-white mb-4">Score Metabólico</h3>

      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
          <circle
            cx="64" cy="64" r="56" fill="none"
            stroke={COLORS.metabol} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${(data.score || 0) * 3.52} 352`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{data.score || 0}</span>
          <span className="text-[10px] text-white/40">/100</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/5 p-2 rounded-lg">
          <p className="text-xs font-bold text-[#00FF88]">{data.bmr || 1800}</p>
          <p className="text-[9px] text-white/40">BMR (kcal)</p>
        </div>
        <div className="bg-white/5 p-2 rounded-lg">
          <p className="text-xs font-bold text-[#FFB800]">{data.tdee || 2400}</p>
          <p className="text-[9px] text-white/40">TDEE (kcal)</p>
        </div>
      </div>
    </div>
  </GlassCard>
);

// Energy Curve
export const EnergyCurve: React.FC<WidgetActionProps> = ({ data }) => {
  const hours = ['6am', '9am', '12pm', '3pm', '6pm', '9pm'];
  const energyLevels = data.levels || [40, 80, 70, 50, 60, 30];
  const currentHour = data.currentHour || 2;

  return (
    <GlassCard borderColor={COLORS.metabol}>
      <AgentBadge name="METABOL" color={COLORS.metabol} icon={Activity} />
      <h3 className="font-bold text-white mb-4">Curva de Energía</h3>

      <div className="flex items-end justify-between h-32 mb-2">
        {energyLevels.map((level: number, i: number) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div
              className={`w-full mx-0.5 rounded-t transition-all ${i === currentHour ? 'bg-[#14B8A6]' : 'bg-white/20'}`}
              style={{ height: `${level}%` }}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        {hours.map((hour, i) => (
          <span key={i} className={`text-[9px] ${i === currentHour ? 'text-[#14B8A6] font-bold' : 'text-white/40'}`}>{hour}</span>
        ))}
      </div>

      {data.suggestion && (
        <div className="bg-[#14B8A6]/10 border border-[#14B8A6]/20 p-3 rounded-lg mt-4">
          <p className="text-xs text-white/80">{data.suggestion}</p>
        </div>
      )}
    </GlassCard>
  );
};

// ============================================
// LOGOS WIDGETS (Education)
// ============================================

// Explanation Card
export const ExplanationCard: React.FC<WidgetActionProps> = ({ data, onAction }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <GlassCard borderColor={COLORS.logos}>
      <AgentBadge name="LOGOS" color={COLORS.logos} icon={Lightbulb} />
      <h3 className="font-bold text-white mb-2">{data.title}</h3>

      <p className={`text-xs text-white/70 ${expanded ? '' : 'line-clamp-3'}`}>
        {data.explanation}
      </p>

      {data.explanation?.length > 150 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] text-[#6366F1] mt-2 hover:underline"
        >
          {expanded ? 'Ver menos' : 'Leer más'}
        </button>
      )}

      {data.relatedTopic && (
        <div
          onClick={() => onAction?.('EXPLORE_TOPIC', { topic: data.relatedTopic })}
          className="mt-3 bg-white/5 p-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/10"
        >
          <Lightbulb size={12} className="text-[#6366F1]" />
          <span className="text-[10px] text-white/60">Tema relacionado: {data.relatedTopic}</span>
        </div>
      )}
    </GlassCard>
  );
};

// Myth Buster
export const MythBuster: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.logos}>
    <AgentBadge name="LOGOS" color={COLORS.logos} icon={AlertTriangle} />

    <div className="bg-[#FF4500]/10 border border-[#FF4500]/20 p-3 rounded-lg mb-3">
      <p className="text-[10px] text-[#FF4500] font-bold mb-1">MITO</p>
      <p className="text-xs text-white">{data.myth}</p>
    </div>

    <div className="bg-[#00FF88]/10 border border-[#00FF88]/20 p-3 rounded-lg mb-3">
      <p className="text-[10px] text-[#00FF88] font-bold mb-1">REALIDAD</p>
      <p className="text-xs text-white">{data.reality}</p>
    </div>

    {data.source && (
      <p className="text-[9px] text-white/40 text-right">Fuente: {data.source}</p>
    )}
  </GlassCard>
);

// Learn More
export const LearnMore: React.FC<WidgetActionProps> = ({ data, onAction }) => (
  <GlassCard borderColor={COLORS.logos}>
    <AgentBadge name="LOGOS" color={COLORS.logos} icon={Lightbulb} />
    <h3 className="font-bold text-white mb-2">{data.title}</h3>
    <p className="text-xs text-white/60 mb-4">{data.summary}</p>

    {data.topics && (
      <div className="space-y-2 mb-4">
        {data.topics.map((topic: any, i: number) => (
          <div
            key={i}
            onClick={() => onAction?.('SELECT_TOPIC', { topic })}
            className="flex items-center gap-2 p-2 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10"
          >
            <div className="w-6 h-6 rounded bg-[#6366F1]/20 flex items-center justify-center">
              <span className="text-[10px] text-[#6366F1] font-bold">{i + 1}</span>
            </div>
            <span className="text-xs text-white">{topic.title}</span>
          </div>
        ))}
      </div>
    )}

    <ActionButton color={COLORS.logos} onClick={() => onAction?.('START_LEARNING', data)}>Comenzar a Aprender</ActionButton>
  </GlassCard>
);

// Source Card
export const SourceCard: React.FC<WidgetActionProps> = ({ data, onAction }) => (
  <GlassCard borderColor={COLORS.logos}>
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-[#6366F1]/20 flex items-center justify-center flex-shrink-0">
        <Lightbulb size={18} className="text-[#6366F1]" />
      </div>
      <div className="flex-1">
        <p className="text-[9px] text-[#6366F1] font-bold mb-1">FUENTE CIENTÍFICA</p>
        <h4 className="text-xs font-bold text-white mb-1">{data.title}</h4>
        <p className="text-[10px] text-white/60">{data.authors} ({data.year})</p>
        <p className="text-[10px] text-white/40 italic">{data.journal}</p>
      </div>
    </div>

    {data.keyFinding && (
      <div className="mt-3 bg-white/5 p-3 rounded-lg">
        <p className="text-[9px] text-white/40 mb-1">Hallazgo clave:</p>
        <p className="text-xs text-white/80">{data.keyFinding}</p>
      </div>
    )}

    <button
      onClick={() => onAction?.('VIEW_SOURCE', { url: data.url })}
      className="mt-3 text-[10px] text-[#6366F1] hover:underline"
    >
      Ver estudio completo →
    </button>
  </GlassCard>
);

// ============================================
// COMPLEMENTARY WIDGETS
// ============================================

// Weekly Review
export const WeeklyReview: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.stella}>
    <AgentBadge name="STELLA" color={COLORS.stella} icon={Activity} />
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-bold text-white">Análisis Semanal</h3>
        <p className="text-[10px] text-white/40">{data.weekRange || 'Esta semana'}</p>
      </div>
      <div className="text-right">
        <span className="text-2xl font-bold text-[#A855F7]">{data.score || 0}%</span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2 mb-4">
      <div className="bg-white/5 p-3 rounded-lg">
        <p className="text-lg font-bold text-[#00FF88]">{data.workoutsCompleted || 0}/{data.workoutsPlanned || 0}</p>
        <p className="text-[9px] text-white/40">Entrenamientos</p>
      </div>
      <div className="bg-white/5 p-3 rounded-lg">
        <p className="text-lg font-bold text-[#FFB800]">{data.habitsStreak || 0}</p>
        <p className="text-[9px] text-white/40">Días perfectos</p>
      </div>
    </div>

    {data.insights && data.insights.length > 0 && (
      <div className="space-y-2">
        <p className="text-[10px] text-white/40 uppercase">Insights</p>
        {data.insights.map((insight: string, i: number) => (
          <div key={i} className="flex items-start gap-2 text-xs text-white/70">
            <span className="text-[#A855F7]">•</span>
            <span>{insight}</span>
          </div>
        ))}
      </div>
    )}
  </GlassCard>
);

// Before After
export const BeforeAfter: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.stella}>
    <AgentBadge name="STELLA" color={COLORS.stella} icon={TrendingUp} />
    <h3 className="font-bold text-white mb-4">Tu Progreso</h3>

    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <p className="text-[10px] text-white/40 mb-2">ANTES</p>
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-2xl font-bold text-white/60">{data.before?.weight || 0}</p>
          <p className="text-[9px] text-white/40">kg</p>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] text-[#A855F7] mb-2">AHORA</p>
        <div className="bg-[#A855F7]/10 border border-[#A855F7]/30 rounded-xl p-4">
          <p className="text-2xl font-bold text-[#A855F7]">{data.after?.weight || 0}</p>
          <p className="text-[9px] text-white/40">kg</p>
        </div>
      </div>
    </div>

    <div className="mt-4 text-center">
      <span className="text-3xl font-black" style={{ color: (data.before?.weight - data.after?.weight) > 0 ? '#00FF88' : '#FF4500' }}>
        {data.before?.weight - data.after?.weight > 0 ? '-' : '+'}{Math.abs(data.before?.weight - data.after?.weight)} kg
      </span>
      <p className="text-[10px] text-white/40">en {data.duration || '12 semanas'}</p>
    </div>
  </GlassCard>
);

// Trophy Case
export const TrophyCase: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.spark}>
    <AgentBadge name="SPARK" color={COLORS.spark} icon={Trophy} />
    <h3 className="font-bold text-white mb-4">Mis Logros</h3>

    <div className="grid grid-cols-3 gap-2">
      {data.achievements?.slice(0, 6).map((achievement: any, i: number) => (
        <div
          key={i}
          className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 ${
            achievement.unlocked ? 'bg-gradient-to-br from-[#FFB800]/20 to-[#F59E0B]/20 border border-[#FFB800]/30' : 'bg-white/5'
          }`}
        >
          <Trophy size={20} className={achievement.unlocked ? 'text-[#FFB800]' : 'text-white/20'} />
          <p className={`text-[8px] text-center mt-1 ${achievement.unlocked ? 'text-white' : 'text-white/30'}`}>
            {achievement.name}
          </p>
        </div>
      ))}
    </div>

    <div className="mt-4 text-center">
      <span className="text-sm text-white/60">{data.unlockedCount || 0}/{data.totalCount || 0} desbloqueados</span>
    </div>
  </GlassCard>
);

// Wind Down
export const WindDown: React.FC<WidgetActionProps> = ({ data, onAction }) => (
  <GlassCard borderColor={COLORS.luna}>
    <AgentBadge name="LUNA" color={COLORS.luna} icon={Moon} />
    <h3 className="font-bold text-white mb-2">Protocolo Nocturno</h3>
    <p className="text-[10px] text-white/40 mb-4">Prepárate para descansar</p>

    <div className="space-y-2">
      {data.steps?.map((step: any, i: number) => (
        <div
          key={i}
          onClick={() => onAction?.('COMPLETE_STEP', { stepId: i })}
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
            step.completed ? 'bg-[#6366F1]/20' : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            step.completed ? 'bg-[#6366F1]' : 'bg-white/10'
          }`}>
            {step.completed ? <CheckCircle2 size={12} className="text-white" /> : <span className="text-[10px] text-white/40">{i + 1}</span>}
          </div>
          <div className="flex-1">
            <p className={`text-xs ${step.completed ? 'text-white/60 line-through' : 'text-white'}`}>{step.title}</p>
            {step.duration && <p className="text-[9px] text-white/40">{step.duration}</p>}
          </div>
        </div>
      ))}
    </div>

    {data.bedtime && (
      <div className="mt-4 bg-[#6366F1]/10 border border-[#6366F1]/20 p-3 rounded-lg text-center">
        <p className="text-[9px] text-white/40">Hora de dormir sugerida</p>
        <p className="text-xl font-bold text-[#6366F1]">{data.bedtime}</p>
      </div>
    )}
  </GlassCard>
);

// Layout Renderer for multiple widgets
export const LayoutRenderer: React.FC<{ layout: WidgetLayout; onAction: (id: string, val: any) => void }> = ({ layout, onAction }) => {
  const getLayoutClass = () => {
    if (layout.type === 'grid') {
      return `grid grid-cols-${layout.columns || 2} gap-${layout.gap || 3}`;
    }
    if (layout.type === 'stack') {
      return layout.direction === 'horizontal'
        ? `flex flex-row gap-${layout.gap || 3}`
        : `flex flex-col gap-${layout.gap || 3}`;
    }
    return '';
  };

  return (
    <div className={getLayoutClass()}>
      {layout.widgets.map((widget, index) => (
        <A2UIMediator key={index} payload={widget} onAction={onAction} />
      ))}
    </div>
  );
};

export const A2UIMediator: React.FC<{ payload: RenderPayload | null; onAction: (id: string, val: any) => void }> = ({ payload, onAction }) => {
  if (!payload) return null;

  // Handle layouts
  if (isWidgetLayout(payload)) {
    return <LayoutRenderer layout={payload} onAction={onAction} />;
  }

  // Handle single widget
  if (!payload.type) return null;

  const widgetMap: { [key: string]: React.FC<WidgetActionProps> } = {
    // Dashboard
    'progress-dashboard': ProgressDashboard,
    'metric-card': MetricCard,
    'today-card': TodayCard,
    'insight-card': InsightCard,
    // Training
    'workout-card': WorkoutCard,
    'exercise-row': ExerciseRow,
    'rest-timer': RestTimer,
    'workout-history': WorkoutHistory,
    'live-session': LiveSession,
    // Nutrition
    'meal-plan': MealPlan,
    // Habits
    'hydration-tracker': HydrationTracker,
    'supplement-stack': SupplementStack,
    'streak-counter': StreakCounter,
    'habit-streak': HabitStreak,
    // Biometrics
    'heart-rate': HeartRateCard,
    'sleep-tracker': SleepTracker,
    'body-stats': BodyStats,
    // Planning
    'season-timeline': SeasonTimeline,
    'season-contract': SeasonContract,
    'season-recap': SeasonRecap,
    // Tools
    'max-rep-calculator': MaxRepCalculator,
    'alert-banner': AlertBanner,
    'coach-message': CoachMessage,
    'achievement': AchievementBadge,
    'pain-map': PainMap,
    // User Journey
    'readiness-battery': ReadinessBattery,
    'daily-recap': DailyRecap,
    // SAGE (Nutrition Strategy)
    'nutrition-strategy': NutritionStrategy,
    'calorie-balance': CalorieBalance,
    'meal-swap': MealSwap,
    'macro-dial': MacroDial,
    // METABOL (Metabolism)
    'glucose-tracker': GlucoseTracker,
    'metabolic-score': MetabolicScore,
    'energy-curve': EnergyCurve,
    // LOGOS (Education)
    'explanation-card': ExplanationCard,
    'myth-buster': MythBuster,
    'learn-more': LearnMore,
    'source-card': SourceCard,
    // Complementary
    'weekly-review': WeeklyReview,
    'before-after': BeforeAfter,
    'trophy-case': TrophyCase,
    'wind-down': WindDown
  };

  const Widget = widgetMap[payload.type];
  return Widget ? <Widget data={payload.props} onAction={onAction} /> : <div className="text-red-500 text-xs">Widget {payload.type} no encontrado</div>;
};