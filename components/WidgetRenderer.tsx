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
    // Training
    'workout-card': WorkoutCard,
    'exercise-row': ExerciseRow,
    // Nutrition
    'meal-plan': MealPlan,
    // Habits
    'hydration-tracker': HydrationTracker,
    'supplement-stack': SupplementStack,
    // Planning
    'season-timeline': SeasonTimeline,
    'today-card': TodayCard,
    // Tools
    'max-rep-calculator': MaxRepCalculator,
    'alert-banner': AlertBanner,
    'coach-message': CoachMessage,
    'insight-card': InsightCard,
    // NEW FITNESS WIDGETS
    'heart-rate': HeartRateCard,
    'sleep-tracker': SleepTracker,
    'body-stats': BodyStats,
    'rest-timer': RestTimer,
    'achievement': AchievementBadge,
    'workout-history': WorkoutHistory,
    'streak-counter': StreakCounter
  };

  const Widget = widgetMap[payload.type];
  return Widget ? <Widget data={payload.props} onAction={onAction} /> : <div className="text-red-500 text-xs">Widget {payload.type} no encontrado</div>;
};