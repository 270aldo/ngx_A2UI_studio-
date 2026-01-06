import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, Zap, Droplets, UtensilsCrossed, Pill, Activity,
  Calendar, Sun, Calculator, User, AlertTriangle, Lightbulb,
  Dumbbell, CheckCircle2, Heart, Moon, Scale, Timer, Trophy,
  History, Flame, TrendingUp, TrendingDown, Award, Plus, Minus
} from 'lucide-react';
import { COLORS } from '../constants';
import { GlassCard, AgentBadge, ProgressBar, ActionButton } from './UIComponents';
import { WidgetPayload, WidgetLayout, isWidgetLayout, RenderPayload } from '../types';
import { playTimerComplete, playCountdownWarning, playIncrement, playDecrement, hapticFeedback } from '../utils/soundEffects';
import { NumpadModal } from './NumpadModal';
import { DragWrapper } from './DragHandle';
import { useDragReorder } from '../hooks/useDragReorder';
import { useReducedMotion } from '../hooks/useReducedMotion';
import confetti from 'canvas-confetti';

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
  const prefersReducedMotion = useReducedMotion();
  const bpm = data.bpm || 72;

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

  const zoneColor = getZoneColor(data.zone);

  // Calculate beat duration from BPM (convert to seconds between beats)
  const beatDuration = 60 / bpm;

  // Heartbeat animation - scale up quickly, scale down slowly
  const heartbeatVariants = {
    beat: {
      scale: [1, 1.15, 1, 1.05, 1],
      transition: {
        duration: 0.3,
        times: [0, 0.2, 0.4, 0.6, 1],
        repeat: Infinity,
        repeatDelay: beatDuration - 0.3,
        ease: 'easeOut'
      }
    }
  };

  // Pulse wave animation
  const pulseWaveVariants = {
    pulse: {
      scale: [1, 2.5],
      opacity: [0.6, 0],
      transition: {
        duration: beatDuration,
        repeat: Infinity,
        ease: 'easeOut'
      }
    }
  };

  return (
    <GlassCard borderColor={zoneColor}>
      <AgentBadge name="WAVE" color={zoneColor} icon={Heart} />

      <div className="flex items-center gap-4 mb-3">
        {/* Animated Heart with Pulse Waves */}
        <div className="relative flex items-center justify-center w-20 h-20">
          {/* Pulse waves */}
          {!prefersReducedMotion && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: zoneColor }}
                variants={pulseWaveVariants}
                animate="pulse"
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: zoneColor }}
                variants={pulseWaveVariants}
                animate="pulse"
                transition={{
                  duration: beatDuration,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: beatDuration / 3
                }}
              />
            </>
          )}

          {/* Heart icon */}
          <motion.div
            className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full"
            style={{ backgroundColor: `${zoneColor}30` }}
            variants={prefersReducedMotion ? {} : heartbeatVariants}
            animate={prefersReducedMotion ? {} : 'beat'}
          >
            <Heart
              size={28}
              fill={zoneColor}
              color={zoneColor}
              style={{ filter: `drop-shadow(0 0 8px ${zoneColor})` }}
            />
          </motion.div>
        </div>

        {/* BPM Display */}
        <div className="flex-1">
          <p className="text-[10px] text-white/40 uppercase mb-1">Frecuencia Cardiaca</p>
          <div className="flex items-baseline gap-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={bpm}
                className="text-4xl font-bold"
                style={{ color: zoneColor }}
                initial={prefersReducedMotion ? {} : { scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.15,
                  repeat: prefersReducedMotion ? 0 : Infinity,
                  repeatDelay: beatDuration - 0.15
                }}
              >
                {bpm}
              </motion.span>
            </AnimatePresence>
            <span className="text-xs text-white/40">bpm</span>
          </div>

          {/* Zone badge */}
          <motion.span
            className="inline-block mt-2 text-[10px] px-2 py-1 rounded-full uppercase font-bold"
            style={{ background: `${zoneColor}20`, color: zoneColor }}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {data.zone?.replace('_', ' ')}
          </motion.span>
        </div>
      </div>

      {/* Trend indicator */}
      {data.trend && (
        <motion.div
          className="flex items-center gap-2 text-[10px] text-white/40"
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {data.trend === 'up' ? (
            <motion.div
              animate={prefersReducedMotion ? {} : { y: [-1, 1, -1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <TrendingUp size={12} className="text-red-400" />
            </motion.div>
          ) : (
            <motion.div
              animate={prefersReducedMotion ? {} : { y: [1, -1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <TrendingDown size={12} className="text-green-400" />
            </motion.div>
          )}
          <span>{data.trend === 'up' ? 'Subiendo' : 'Bajando'}</span>
        </motion.div>
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

// Rest Timer - Interactive with sound
export const RestTimer: React.FC<WidgetActionProps> = ({ data, onAction }) => {
  const initialSeconds = data.seconds || 60;
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(data.autoStart || false);
  const [isComplete, setIsComplete] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // SVG Circle calculations
  const size = 160;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = seconds / initialSeconds;
  const strokeDashoffset = circumference * (1 - progress);

  // Color based on time remaining
  const getTimerColor = () => {
    const percentRemaining = seconds / initialSeconds;
    if (percentRemaining <= 0.1) return '#FF4500'; // Red - urgent
    if (percentRemaining <= 0.25) return '#FFA500'; // Orange - warning
    if (percentRemaining <= 0.5) return '#FFD700'; // Yellow - caution
    return COLORS.tempo; // Teal - normal
  };

  const timerColor = getTimerColor();
  const isUrgent = seconds <= 10 && isRunning;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s: number) => {
          const newSeconds = s - 1;
          if (newSeconds <= 3 && newSeconds > 0) {
            playCountdownWarning();
            hapticFeedback('tick');
          }
          return newSeconds;
        });
      }, 1000);
    } else if (seconds === 0 && isRunning) {
      playTimerComplete();
      hapticFeedback('complete');
      setIsComplete(true);
      setTimeout(() => setIsComplete(false), 500);
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

  const handleReset = () => {
    setSeconds(initialSeconds);
    setIsRunning(false);
    setIsComplete(false);
  };

  const handleToggle = () => {
    if (!isRunning && seconds === 0) {
      setSeconds(initialSeconds);
    }
    setIsRunning(!isRunning);
    hapticFeedback('tick');
  };

  const handleAddTime = (amount: number) => {
    setSeconds(s => Math.max(0, s + amount));
    playIncrement();
  };

  // Animation variants
  const shakeVariants = {
    shake: {
      x: [-10, 10, -10, 10, -5, 5, 0],
      transition: { duration: 0.5 }
    },
    still: { x: 0 }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.02, 1],
      transition: { duration: 0.5, repeat: Infinity }
    },
    still: { scale: 1 }
  };

  return (
    <GlassCard borderColor={timerColor}>
      <AgentBadge name="TEMPO" color={COLORS.tempo} icon={Timer} />

      <motion.div
        className="relative flex flex-col items-center py-4"
        variants={shakeVariants}
        animate={isComplete && !prefersReducedMotion ? 'shake' : 'still'}
      >
        {/* SVG Circle Timer */}
        <motion.div
          className="relative"
          variants={pulseVariants}
          animate={isUrgent && !prefersReducedMotion ? 'pulse' : 'still'}
        >
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={strokeWidth}
            />
            {/* Animated progress circle */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={timerColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: 0 }}
              animate={{
                strokeDashoffset,
                stroke: timerColor
              }}
              transition={{
                strokeDashoffset: { duration: 0.3, ease: 'linear' },
                stroke: { duration: 0.3 }
              }}
              style={{
                filter: isUrgent ? `drop-shadow(0 0 10px ${timerColor})` : 'none'
              }}
            />
          </svg>

          {/* Timer display in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[10px] text-white/40 uppercase mb-1">Descanso</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={seconds}
                className="text-4xl font-bold"
                style={{ color: isUrgent ? timerColor : 'white' }}
                initial={prefersReducedMotion ? {} : { scale: 1.1, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                {formatTime(seconds)}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Glow effect when urgent */}
        {isUrgent && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${timerColor}20 0%, transparent 70%)`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </motion.div>

      {/* Quick time adjustments */}
      <div className="flex justify-center gap-2 mb-3">
        <motion.button
          onClick={() => handleAddTime(-15)}
          className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 rounded-lg text-white/60"
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        >
          -15s
        </motion.button>
        <motion.button
          onClick={() => handleAddTime(15)}
          className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 rounded-lg text-white/60"
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        >
          +15s
        </motion.button>
        <motion.button
          onClick={() => handleAddTime(30)}
          className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 rounded-lg text-white/60"
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        >
          +30s
        </motion.button>
      </div>

      <div className="flex gap-2">
        <ActionButton variant="secondary" onClick={handleReset}>
          Reset
        </ActionButton>
        <ActionButton color={timerColor} onClick={handleToggle}>
          {isRunning ? 'Pausar' : seconds === 0 ? 'Reiniciar' : 'Iniciar'}
        </ActionButton>
      </div>
    </GlassCard>
  );
};

// Achievement Badge
export const AchievementBadge: React.FC<WidgetActionProps> = ({ data }) => {
  const prefersReducedMotion = useReducedMotion();

  // Dramatic entrance animation
  const containerVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300 }
    }
  };

  // Floating particle positions
  const particles = [
    { x: -30, y: -20, delay: 0 },
    { x: 30, y: -25, delay: 0.2 },
    { x: -25, y: 20, delay: 0.4 },
    { x: 35, y: 15, delay: 0.6 },
    { x: 0, y: -35, delay: 0.3 },
  ];

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={prefersReducedMotion ? {} : {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
    >
      <GlassCard borderColor={COLORS.spark}>
        <div className="text-center py-2 relative">
          {/* Floating golden particles */}
          {!prefersReducedMotion && particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#FFB800]"
              style={{
                left: '50%',
                top: '30%',
                marginLeft: -4,
              }}
              animate={{
                x: [0, p.x, 0],
                y: [0, p.y, 0],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2.5,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}

          {/* Trophy with glow */}
          <motion.div
            className="relative w-16 h-16 mx-auto mb-3"
            variants={itemVariants}
          >
            {/* Pulsing glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,184,0,0.4) 0%, transparent 70%)'
              }}
              animate={prefersReducedMotion ? {} : {
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />

            {/* Trophy badge */}
            <motion.div
              className="relative w-full h-full rounded-full bg-gradient-to-br from-[#FFB800] to-[#F59E0B] flex items-center justify-center shadow-lg"
              animate={prefersReducedMotion ? {} : {
                boxShadow: [
                  '0 0 20px rgba(255,184,0,0.4)',
                  '0 0 40px rgba(255,184,0,0.6)',
                  '0 0 20px rgba(255,184,0,0.4)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <motion.div
                animate={prefersReducedMotion ? {} : {
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <Trophy size={28} className="text-white drop-shadow-lg" />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.h3
            className="font-bold text-white text-lg mb-1"
            variants={itemVariants}
          >
            {data.title}
          </motion.h3>

          <motion.p
            className="text-[10px] text-white/40"
            variants={itemVariants}
          >
            {data.description}
          </motion.p>

          {data.unlockedAt && (
            <motion.div
              className="mt-3 flex items-center justify-center gap-1 text-[9px] text-[#FFB800]"
              variants={itemVariants}
            >
              <motion.div
                animate={prefersReducedMotion ? {} : { rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Award size={10} />
              </motion.div>
              <span>Desbloqueado: {data.unlockedAt}</span>
            </motion.div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};

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
export const StreakCounter: React.FC<WidgetActionProps> = ({ data }) => {
  const prefersReducedMotion = useReducedMotion();
  const streak = data.currentStreak || 0;

  // Flame intensity based on streak (0-1)
  const intensity = Math.min(streak / 30, 1);

  // Generate multiple flame layers for more realistic fire effect
  const flameColors = [
    { color: '#FF4500', scale: 1, delay: 0 },      // Orange-red (outer)
    { color: '#FF6B35', scale: 0.85, delay: 0.1 }, // Orange
    { color: '#FFB800', scale: 0.7, delay: 0.2 },  // Yellow-orange (middle)
    { color: '#FFD700', scale: 0.5, delay: 0.3 },  // Yellow (inner)
  ];

  // Spark particles
  const sparks = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 60,
    delay: Math.random() * 2,
    duration: 1.5 + Math.random(),
  }));

  return (
    <GlassCard borderColor={COLORS.spark}>
      <AgentBadge name="SPARK" color={COLORS.spark} icon={Flame} />
      <div className="text-center py-2">
        <div className="flex items-center justify-center gap-3 mb-2">
          {/* Animated Fire Container */}
          <div className="relative w-16 h-20">
            {/* Flame layers */}
            {!prefersReducedMotion && flameColors.map((flame, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                style={{
                  width: `${32 * flame.scale}px`,
                  height: `${48 * flame.scale * (0.8 + intensity * 0.4)}px`,
                  background: `linear-gradient(to top, ${flame.color}, ${flame.color}80, transparent)`,
                  filter: `blur(${2 - i * 0.3}px)`,
                  transformOrigin: 'bottom center',
                }}
                animate={{
                  scaleY: [1, 1.15 + intensity * 0.2, 0.95, 1.1, 1],
                  scaleX: [1, 0.95, 1.05, 0.98, 1],
                  rotate: [-3, 3, -2, 4, -3],
                }}
                transition={{
                  duration: 0.8 + flame.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: flame.delay,
                }}
              />
            ))}

            {/* Glow effect */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-16 rounded-full"
              style={{
                background: `radial-gradient(ellipse, rgba(255,184,0,${0.3 + intensity * 0.3}) 0%, transparent 70%)`,
              }}
              animate={prefersReducedMotion ? {} : {
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Sparks */}
            {!prefersReducedMotion && sparks.map((spark) => (
              <motion.div
                key={spark.id}
                className="absolute bottom-4 left-1/2 w-1 h-1 rounded-full bg-[#FFD700]"
                animate={{
                  y: [-10, -50 - Math.random() * 30],
                  x: [0, spark.x],
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: spark.duration,
                  repeat: Infinity,
                  delay: spark.delay,
                  ease: 'easeOut',
                }}
              />
            ))}

            {/* Main flame icon */}
            <motion.div
              className="absolute bottom-2 left-1/2 -translate-x-1/2"
              animate={prefersReducedMotion ? {} : {
                y: [-2, 2, -2],
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Flame
                size={36}
                className="text-[#FFB800]"
                style={{
                  filter: `drop-shadow(0 0 ${8 + intensity * 8}px rgba(255,184,0,0.8))`,
                }}
              />
            </motion.div>
          </div>

          {/* Counter with bounce */}
          <div>
            <AnimatePresence mode="wait">
              <motion.span
                key={streak}
                className="text-5xl font-black text-white block"
                initial={prefersReducedMotion ? {} : { scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={prefersReducedMotion ? {} : { scale: 1.5, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                style={{
                  textShadow: `0 0 ${10 + intensity * 20}px rgba(255,184,0,${0.3 + intensity * 0.5})`
                }}
              >
                {streak}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <motion.p
          className="text-xs text-white/60 mb-4"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {streak === 1 ? 'dia' : 'dias'} consecutivos
        </motion.p>

        {data.bestStreak && (
          <motion.div
            className="bg-white/5 p-2 rounded-lg inline-flex items-center gap-2"
            initial={prefersReducedMotion ? {} : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
          >
            <motion.div
              animate={prefersReducedMotion ? {} : { rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              <Trophy size={12} className="text-[#FFB800]" />
            </motion.div>
            <span className="text-[10px] text-white/60">
              Mejor racha: <span className="text-white font-bold">{data.bestStreak}</span> dias
            </span>
          </motion.div>
        )}
      </div>
    </GlassCard>
  );
};

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

// ============================================
// INTERACTIVE WIDGETS
// ============================================

// Rep Counter - Interactive with +/- buttons
export const RepCounter: React.FC<WidgetActionProps> = ({ data, onAction }) => {
  const [count, setCount] = useState(data.current || 0);
  const [prevCount, setPrevCount] = useState(data.current || 0);
  const [hasCompletedOnce, setHasCompletedOnce] = useState(false);
  const target = data.target || 10;
  const prefersReducedMotion = useReducedMotion();

  // SVG Progress Ring calculations
  const size = 140;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = count / target;
  const strokeDashoffset = circumference * (1 - progress);

  const isComplete = count >= target;

  // Fire confetti on completion
  const fireConfetti = useCallback(() => {
    if (prefersReducedMotion) return;

    const colors = ['#FF4500', '#FFD700', '#00FF88', '#FF6B6B', '#4ECDC4'];

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors,
      disableForReducedMotion: true,
    });

    // Second burst
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { y: 0.5, x: 0.3 },
        colors,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { y: 0.5, x: 0.7 },
        colors,
        disableForReducedMotion: true,
      });
    }, 200);
  }, [prefersReducedMotion]);

  const handleIncrement = () => {
    if (count < target) {
      setPrevCount(count);
      const newCount = count + 1;
      setCount(newCount);
      playIncrement();
      hapticFeedback('tick');

      // Celebrate when target reached
      if (newCount >= target && !hasCompletedOnce) {
        hapticFeedback('success');
        setHasCompletedOnce(true);
        fireConfetti();
        onAction?.('SET_COMPLETE', { reps: newCount });
      }
    }
  };

  const handleDecrement = () => {
    if (count > 0) {
      setPrevCount(count);
      setCount(c => c - 1);
      playDecrement();
      hapticFeedback('tick');
    }
  };

  const handleReset = () => {
    setPrevCount(count);
    setCount(0);
    setHasCompletedOnce(false);
    onAction?.('REP_RESET');
  };

  // Determine animation direction
  const direction = count > prevCount ? 1 : -1;

  // Flip animation variants for digits
  const flipVariants = {
    initial: (dir: number) => ({
      rotateX: dir > 0 ? -90 : 90,
      opacity: 0,
      y: dir > 0 ? -20 : 20,
    }),
    animate: {
      rotateX: 0,
      opacity: 1,
      y: 0,
    },
    exit: (dir: number) => ({
      rotateX: dir > 0 ? 90 : -90,
      opacity: 0,
      y: dir > 0 ? 20 : -20,
    }),
  };

  return (
    <GlassCard borderColor={isComplete ? '#00FF88' : COLORS.blaze}>
      <AgentBadge name="BLAZE" color={COLORS.blaze} icon={Dumbbell} />
      <div className="text-center py-2">
        <p className="text-[10px] text-white/40 uppercase mb-2">{data.exercise || 'Repeticiones'}</p>

        <div className="flex items-center justify-center gap-4 mb-4">
          {/* Decrement Button */}
          <motion.button
            onClick={handleDecrement}
            disabled={count <= 0}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              count <= 0
                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            whileHover={count > 0 && !prefersReducedMotion ? { scale: 1.1 } : {}}
            whileTap={count > 0 && !prefersReducedMotion ? { scale: 0.9 } : {}}
          >
            <Minus size={20} />
          </motion.button>

          {/* Counter with Progress Ring */}
          <div className="relative">
            {/* SVG Progress Ring */}
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={strokeWidth}
              />
              {/* Progress circle */}
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={isComplete ? '#00FF88' : COLORS.blaze}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{
                  strokeDashoffset,
                  stroke: isComplete ? '#00FF88' : COLORS.blaze
                }}
                transition={{
                  strokeDashoffset: { type: 'spring', stiffness: 100, damping: 15 },
                  stroke: { duration: 0.3 }
                }}
                style={{
                  filter: isComplete ? 'drop-shadow(0 0 8px #00FF88)' : 'none'
                }}
              />
            </svg>

            {/* Counter Display in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="h-16 overflow-hidden" style={{ perspective: '200px' }}>
                <AnimatePresence mode="popLayout" custom={direction}>
                  <motion.p
                    key={count}
                    custom={direction}
                    variants={prefersReducedMotion ? {} : flipVariants}
                    initial={prefersReducedMotion ? {} : 'initial'}
                    animate="animate"
                    exit={prefersReducedMotion ? {} : 'exit'}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                    }}
                    className={`text-5xl font-black ${isComplete ? 'text-[#00FF88]' : 'text-white'}`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {count}
                  </motion.p>
                </AnimatePresence>
              </div>
              <p className="text-xs text-white/40">/ {target}</p>
            </div>
          </div>

          {/* Increment Button */}
          <motion.button
            onClick={handleIncrement}
            disabled={count >= target}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              count >= target
                ? 'bg-[#00FF88]/20 text-[#00FF88] cursor-not-allowed'
                : 'bg-[#FF4500]/20 text-[#FF4500] hover:bg-[#FF4500]/30'
            }`}
            whileHover={count < target && !prefersReducedMotion ? { scale: 1.1 } : {}}
            whileTap={count < target && !prefersReducedMotion ? { scale: 0.9 } : {}}
          >
            <Plus size={20} />
          </motion.button>
        </div>

        {/* Completion celebration */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={prefersReducedMotion ? {} : { scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="flex items-center justify-center gap-2 text-[#00FF88] mb-2"
            >
              <motion.div
                animate={prefersReducedMotion ? {} : {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                <CheckCircle2 size={18} />
              </motion.div>
              <span className="text-sm font-bold">Set Completado!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleReset}
          className="text-[10px] text-white/40 hover:text-white transition-colors"
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        >
          Reiniciar
        </motion.button>
      </div>
    </GlassCard>
  );
};

// Weight Input - Interactive with numpad modal
export const WeightInput: React.FC<WidgetActionProps> = ({ data, onAction }) => {
  const [weight, setWeight] = useState(data.value || 0);
  const [showNumpad, setShowNumpad] = useState(false);

  const handleWeightChange = (newWeight: number) => {
    setWeight(newWeight);
    playIncrement();
    hapticFeedback('tick');
    onAction?.('WEIGHT_CHANGE', { value: newWeight });
  };

  const handleQuickAdjust = (amount: number) => {
    const newWeight = Math.max(0, weight + amount);
    setWeight(newWeight);
    if (amount > 0) playIncrement();
    else playDecrement();
    hapticFeedback('tick');
    onAction?.('WEIGHT_CHANGE', { value: newWeight });
  };

  return (
    <GlassCard borderColor={COLORS.atlas}>
      <AgentBadge name="ATLAS" color={COLORS.atlas} icon={Scale} />
      <p className="text-[10px] text-white/40 uppercase mb-3">{data.label || 'Peso'}</p>

      {/* Main Weight Display - Clickable */}
      <button
        onClick={() => setShowNumpad(true)}
        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 mb-3 transition-colors group"
      >
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-white group-hover:text-[#EC4899] transition-colors">
            {weight}
          </span>
          <span className="text-lg text-white/40">{data.unit || 'kg'}</span>
        </div>
        <p className="text-[9px] text-white/30 mt-1">Toca para editar</p>
      </button>

      {/* Quick Adjustment Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <button
          onClick={() => handleQuickAdjust(-5)}
          className="py-2 text-xs bg-white/5 hover:bg-white/10 rounded-lg text-white/60 transition-colors"
        >
          -5
        </button>
        <button
          onClick={() => handleQuickAdjust(-2.5)}
          className="py-2 text-xs bg-white/5 hover:bg-white/10 rounded-lg text-white/60 transition-colors"
        >
          -2.5
        </button>
        <button
          onClick={() => handleQuickAdjust(2.5)}
          className="py-2 text-xs bg-white/5 hover:bg-white/10 rounded-lg text-white/60 transition-colors"
        >
          +2.5
        </button>
        <button
          onClick={() => handleQuickAdjust(5)}
          className="py-2 text-xs bg-white/5 hover:bg-white/10 rounded-lg text-white/60 transition-colors"
        >
          +5
        </button>
      </div>

      {/* Previous Weight Reference */}
      {data.previous && (
        <div className="text-center text-[10px] text-white/40">
          Anterior: <span className="text-white/60">{data.previous} {data.unit || 'kg'}</span>
          {weight > data.previous && (
            <span className="text-[#00FF88] ml-2">+{(weight - data.previous).toFixed(1)}</span>
          )}
        </div>
      )}

      {/* Numpad Modal */}
      <NumpadModal
        isOpen={showNumpad}
        onClose={() => setShowNumpad(false)}
        onConfirm={handleWeightChange}
        initialValue={weight}
        title={data.label || 'Ingresa el Peso'}
        unit={data.unit || 'kg'}
        min={0}
        max={500}
        allowDecimal={true}
      />
    </GlassCard>
  );
};

// ============================================
// SPRINT 3: NEW WIDGETS (15 total)
// ============================================

// --- BLAZE WIDGETS (Training Intensity) ---

// Superset Card - Multiple exercises back-to-back
export const SupersetCard: React.FC<WidgetActionProps> = ({ data, onAction }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);

  const handleComplete = (index: number) => {
    if (index < (data.exercises?.length || 0) - 1) {
      setIsResting(true);
      setTimeout(() => {
        setIsResting(false);
        setActiveIndex(index + 1);
      }, (data.restBetween || 10) * 1000);
    } else {
      onAction?.('SUPERSET_COMPLETE', { id: data.id });
    }
  };

  return (
    <GlassCard borderColor={COLORS.blaze}>
      <AgentBadge name="BLAZE" color={COLORS.blaze} icon={Zap} />
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-white">{data.title || 'Superset'}</h3>
          <p className="text-[10px] text-white/40">{data.exercises?.length || 0} ejercicios sin descanso</p>
        </div>
        <span className="text-[10px] bg-[#FF4500]/20 text-[#FF4500] px-2 py-1 rounded font-bold">
          {data.restBetween || 10}s entre sets
        </span>
      </div>

      {isResting ? (
        <div className="text-center py-6 bg-[#FF4500]/10 rounded-xl">
          <p className="text-xs text-white/60 mb-2">Siguiente ejercicio en...</p>
          <p className="text-4xl font-bold text-[#FF4500]">{data.restBetween || 10}s</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.exercises?.map((ex: any, i: number) => (
            <div
              key={i}
              onClick={() => i === activeIndex && handleComplete(i)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                i === activeIndex
                  ? 'bg-[#FF4500]/20 border border-[#FF4500]/40'
                  : i < activeIndex
                  ? 'bg-white/5 opacity-50'
                  : 'bg-white/5'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                i < activeIndex ? 'bg-[#00FF88] text-black' :
                i === activeIndex ? 'bg-[#FF4500] text-white' : 'bg-white/20 text-white/60'
              }`}>
                {i < activeIndex ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${i < activeIndex ? 'line-through text-white/40' : 'text-white'}`}>{ex.name}</p>
                <p className="text-[10px] text-white/40">{ex.reps} reps @ {ex.load}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

// AMRAP Timer - As Many Rounds As Possible
export const AMRAPTimer: React.FC<WidgetActionProps> = ({ data, onAction }) => {
  const [timeLeft, setTimeLeft] = useState((data.duration || 10) * 60);
  const [rounds, setRounds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      playTimerComplete();
      hapticFeedback('complete');
      setIsRunning(false);
      onAction?.('AMRAP_COMPLETE', { rounds, duration: data.duration });
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, rounds, data.duration, onAction]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRoundComplete = () => {
    setRounds(r => r + 1);
    playIncrement();
    hapticFeedback('success');
  };

  return (
    <GlassCard borderColor={COLORS.blaze}>
      <AgentBadge name="BLAZE" color={COLORS.blaze} icon={Flame} />
      <div className="text-center">
        <p className="text-[10px] text-[#FF4500] font-bold uppercase mb-1">AMRAP</p>
        <h3 className="font-bold text-white mb-4">{data.title || `${data.duration || 10} Minutos`}</h3>

        <div className="flex justify-center gap-8 mb-4">
          <div>
            <p className="text-4xl font-bold text-white">{formatTime(timeLeft)}</p>
            <p className="text-[10px] text-white/40">Tiempo</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-[#FFB800]">{rounds}</p>
            <p className="text-[10px] text-white/40">Rondas</p>
          </div>
        </div>

        {data.exercises && (
          <div className="bg-white/5 p-3 rounded-lg mb-4 text-left">
            <p className="text-[9px] text-white/40 uppercase mb-2">Por ronda:</p>
            {data.exercises.map((ex: any, i: number) => (
              <p key={i} className="text-xs text-white/80">• {ex.reps} {ex.name}</p>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <ActionButton
            color={isRunning ? '#FF4500' : COLORS.blaze}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'Pausar' : 'Iniciar'}
          </ActionButton>
          {isRunning && (
            <ActionButton color="#00FF88" onClick={handleRoundComplete}>
              +1 Ronda
            </ActionButton>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

// EMOM Clock - Every Minute On the Minute
export const EMOMClock: React.FC<WidgetActionProps> = ({ data, onAction }) => {
  const [currentMinute, setCurrentMinute] = useState(0);
  const [secondsInMinute, setSecondsInMinute] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const totalMinutes = data.totalMinutes || 10;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && currentMinute < totalMinutes) {
      interval = setInterval(() => {
        setSecondsInMinute(s => {
          if (s >= 59) {
            setCurrentMinute(m => m + 1);
            playCountdownWarning();
            hapticFeedback('tick');
            return 0;
          }
          return s + 1;
        });
      }, 1000);
    } else if (currentMinute >= totalMinutes) {
      playTimerComplete();
      hapticFeedback('complete');
      setIsRunning(false);
      onAction?.('EMOM_COMPLETE', { totalMinutes });
    }
    return () => clearInterval(interval);
  }, [isRunning, currentMinute, totalMinutes, onAction]);

  const currentExercise = data.exercises?.[currentMinute % (data.exercises?.length || 1)];

  return (
    <GlassCard borderColor={COLORS.blaze}>
      <AgentBadge name="BLAZE" color={COLORS.blaze} icon={Timer} />
      <div className="text-center">
        <p className="text-[10px] text-[#FF4500] font-bold uppercase mb-1">EMOM</p>
        <h3 className="font-bold text-white mb-4">{totalMinutes} Minutos</h3>

        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle
              cx="64" cy="64" r="56" fill="none"
              stroke="#FF4500" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${(secondsInMinute / 60) * 352} 352`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{60 - secondsInMinute}</span>
            <span className="text-[10px] text-white/40">segundos</span>
          </div>
        </div>

        <div className="bg-[#FF4500]/10 border border-[#FF4500]/30 p-3 rounded-lg mb-4">
          <p className="text-[9px] text-white/40">Minuto {currentMinute + 1}/{totalMinutes}</p>
          <p className="text-sm font-bold text-white">{currentExercise?.name || 'Ejercicio'}</p>
          <p className="text-xs text-[#FF4500]">{currentExercise?.reps || '10 reps'}</p>
        </div>

        <ActionButton
          color={isRunning ? '#FF4500' : COLORS.blaze}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? 'Pausar' : 'Iniciar EMOM'}
        </ActionButton>
      </div>
    </GlassCard>
  );
};

// --- WAVE WIDGETS (Recovery & Biometrics) ---

// HRV Chart - Heart Rate Variability visualization
export const HRVChart: React.FC<WidgetActionProps> = ({ data }) => {
  const readings = data.readings || [65, 72, 68, 75, 70, 73, 69];
  const maxReading = Math.max(...readings);
  const minReading = Math.min(...readings);

  const getHRVColor = (score: number) => {
    if (score >= 70) return '#00FF88';
    if (score >= 50) return '#FFB800';
    return '#FF4500';
  };

  return (
    <GlassCard borderColor={COLORS.wave}>
      <AgentBadge name="WAVE" color={COLORS.wave} icon={Heart} />
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-white">HRV</h3>
          <p className="text-[10px] text-white/40">Variabilidad Cardíaca</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold" style={{ color: getHRVColor(data.score || 65) }}>
            {data.score || 65}
          </span>
          <span className="text-xs text-white/40 ml-1">ms</span>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="flex items-end justify-between h-20 mb-3 px-1">
        {readings.map((value: number, i: number) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div
              className="w-full mx-0.5 rounded-t transition-all"
              style={{
                height: `${((value - minReading) / (maxReading - minReading)) * 100}%`,
                minHeight: '10%',
                background: getHRVColor(value)
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between text-[9px] text-white/40">
        <span>7 días</span>
        <span className={data.trend === 'up' ? 'text-[#00FF88]' : 'text-[#FF4500]'}>
          {data.trend === 'up' ? '↑ Mejorando' : '↓ Bajando'}
        </span>
      </div>
    </GlassCard>
  );
};

// Recovery Score - Overall recovery assessment
export const RecoveryScore: React.FC<WidgetActionProps> = ({ data }) => {
  const score = data.score || 75;
  const factors = data.factors || { sleep: 80, hrv: 70, strain: 65, nutrition: 85 };

  const getScoreColor = (s: number) => {
    if (s >= 80) return '#00FF88';
    if (s >= 60) return '#FFB800';
    if (s >= 40) return '#FF6347';
    return '#FF4500';
  };

  const circumference = 2 * Math.PI * 45;

  return (
    <GlassCard borderColor={COLORS.wave}>
      <AgentBadge name="WAVE" color={COLORS.wave} icon={Activity} />
      <div className="text-center mb-4">
        <div className="relative w-28 h-28 mx-auto">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle cx="56" cy="56" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
            <circle
              cx="56" cy="56" r="45" fill="none"
              stroke={getScoreColor(score)} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (score / 100) * circumference}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{ color: getScoreColor(score) }}>{score}</span>
            <span className="text-[10px] text-white/40">Recovery</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {Object.entries(factors).map(([key, value]) => (
          <div key={key} className="bg-white/5 p-2 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] text-white/50 capitalize">{key}</span>
              <span className="text-[10px] font-bold" style={{ color: getScoreColor(value as number) }}>
                {value}%
              </span>
            </div>
            <div className="h-1 bg-white/10 rounded-full">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${value}%`, background: getScoreColor(value as number) }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// Stress Meter - Current stress level
export const StressMeter: React.FC<WidgetActionProps> = ({ data }) => {
  const level = data.level || 45;
  const recommendations = data.recommendations || ['Respiración profunda', 'Camina 10 minutos', 'Escucha música relajante'];

  const getStressColor = (l: number) => {
    if (l <= 30) return '#00FF88';
    if (l <= 50) return '#00D4FF';
    if (l <= 70) return '#FFB800';
    return '#FF4500';
  };

  const getStressLabel = (l: number) => {
    if (l <= 30) return 'Bajo';
    if (l <= 50) return 'Moderado';
    if (l <= 70) return 'Elevado';
    return 'Alto';
  };

  return (
    <GlassCard borderColor={COLORS.wave}>
      <AgentBadge name="WAVE" color={COLORS.wave} icon={Activity} />
      <h3 className="font-bold text-white mb-4">Nivel de Estrés</h3>

      <div className="text-center mb-4">
        <span className="text-5xl font-bold" style={{ color: getStressColor(level) }}>{level}</span>
        <span className="text-xl text-white/40">/100</span>
        <p className="text-sm mt-1" style={{ color: getStressColor(level) }}>{getStressLabel(level)}</p>
      </div>

      <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${level}%`, background: `linear-gradient(90deg, #00FF88, #FFB800, #FF4500)` }}
        />
      </div>

      {level > 50 && (
        <div className="bg-white/5 p-3 rounded-lg">
          <p className="text-[9px] text-white/40 uppercase mb-2">Recomendaciones</p>
          {recommendations.slice(0, 3).map((rec: string, i: number) => (
            <p key={i} className="text-xs text-white/70 mb-1">• {rec}</p>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

// --- METABOL WIDGETS (Metabolism) ---

// Fasting Timer - Intermittent fasting tracker
export const FastingTimer: React.FC<WidgetActionProps> = ({ data, onAction }) => {
  const targetHours = data.targetHours || 16;
  const startTime = data.startTime ? new Date(data.startTime) : new Date();
  const [elapsedHours, setElapsedHours] = useState(0);

  useEffect(() => {
    const updateElapsed = () => {
      const now = new Date();
      const diff = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      setElapsedHours(Math.min(diff, targetHours));
    };
    updateElapsed();
    const interval = setInterval(updateElapsed, 60000);
    return () => clearInterval(interval);
  }, [startTime, targetHours]);

  const progress = (elapsedHours / targetHours) * 100;
  const isComplete = elapsedHours >= targetHours;

  const getPhaseInfo = (hours: number) => {
    if (hours < 4) return { phase: 'Fed State', color: '#FFB800', icon: '🍽️' };
    if (hours < 8) return { phase: 'Early Fasting', color: '#00D4FF', icon: '⚡' };
    if (hours < 12) return { phase: 'Fat Burning', color: '#FF4500', icon: '🔥' };
    if (hours < 16) return { phase: 'Ketosis', color: '#D946EF', icon: '🧬' };
    return { phase: 'Deep Ketosis', color: '#00FF88', icon: '✨' };
  };

  const phaseInfo = getPhaseInfo(elapsedHours);

  return (
    <GlassCard borderColor={COLORS.metabol}>
      <AgentBadge name="METABOL" color={COLORS.metabol} icon={Timer} />
      <div className="text-center">
        <p className="text-[10px] text-white/40 uppercase mb-2">Ayuno Intermitente</p>

        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle
              cx="64" cy="64" r="56" fill="none"
              stroke={isComplete ? '#00FF88' : phaseInfo.color} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${progress * 3.52} 352`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl">{phaseInfo.icon}</span>
            <span className="text-2xl font-bold text-white">{elapsedHours.toFixed(1)}h</span>
            <span className="text-[10px] text-white/40">/ {targetHours}h</span>
          </div>
        </div>

        <div className="bg-white/5 p-3 rounded-lg mb-3" style={{ borderColor: phaseInfo.color, borderWidth: 1 }}>
          <p className="text-xs font-bold" style={{ color: phaseInfo.color }}>{phaseInfo.phase}</p>
        </div>

        <ActionButton
          color={isComplete ? '#00FF88' : COLORS.metabol}
          onClick={() => onAction?.(isComplete ? 'END_FAST' : 'BREAK_FAST')}
        >
          {isComplete ? 'Completar Ayuno' : 'Romper Ayuno'}
        </ActionButton>
      </div>
    </GlassCard>
  );
};

// Ketone Tracker - Blood ketone levels
export const KetoneTracker: React.FC<WidgetActionProps> = ({ data }) => {
  const reading = data.reading || 1.2;
  const trend = data.trend || 'stable';

  const getZoneInfo = (val: number) => {
    if (val < 0.5) return { zone: 'No Cetosis', color: '#FF4500', desc: 'Fuera del rango cetogénico' };
    if (val < 1.0) return { zone: 'Cetosis Leve', color: '#FFB800', desc: 'Iniciando cetosis' };
    if (val < 3.0) return { zone: 'Cetosis Óptima', color: '#00FF88', desc: 'Rango ideal para pérdida de grasa' };
    return { zone: 'Cetosis Alta', color: '#D946EF', desc: 'Considerar reducir' };
  };

  const zoneInfo = getZoneInfo(reading);

  return (
    <GlassCard borderColor={COLORS.metabol}>
      <AgentBadge name="METABOL" color={COLORS.metabol} icon={Activity} />
      <h3 className="font-bold text-white mb-4">Cetonas en Sangre</h3>

      <div className="text-center mb-4">
        <span className="text-5xl font-bold" style={{ color: zoneInfo.color }}>{reading}</span>
        <span className="text-xl text-white/40 ml-1">mmol/L</span>
      </div>

      <div className="bg-white/5 p-3 rounded-lg mb-3" style={{ borderColor: zoneInfo.color, borderWidth: 1 }}>
        <p className="text-sm font-bold" style={{ color: zoneInfo.color }}>{zoneInfo.zone}</p>
        <p className="text-[10px] text-white/60">{zoneInfo.desc}</p>
      </div>

      <div className="flex items-center justify-center gap-2 text-[10px]">
        {trend === 'up' && <TrendingUp size={14} className="text-[#00FF88]" />}
        {trend === 'down' && <TrendingDown size={14} className="text-[#FF4500]" />}
        {trend === 'stable' && <span className="text-white/40">→</span>}
        <span className="text-white/60">
          {trend === 'up' ? 'Subiendo' : trend === 'down' ? 'Bajando' : 'Estable'}
        </span>
      </div>
    </GlassCard>
  );
};

// TDEE Calculator - Total Daily Energy Expenditure
export const TDEECalculator: React.FC<WidgetActionProps> = ({ data }) => {
  const bmr = data.bmr || 1800;

  // Map string activity levels to multipliers
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extra: 1.9
  };

  // Handle both string and number activityLevel
  const activityMultiplier = typeof data.activityLevel === 'string'
    ? activityMultipliers[data.activityLevel] || 1.55
    : data.activityLevel || 1.55;

  // Use provided result or calculate from BMR
  const tdee = data.result || Math.round(bmr * activityMultiplier);

  const activityLabels: Record<number, string> = {
    1.2: 'Sedentario',
    1.375: 'Ligeramente activo',
    1.55: 'Moderadamente activo',
    1.725: 'Muy activo',
    1.9: 'Extra activo'
  };

  const activityStringLabels: Record<string, string> = {
    sedentary: 'Sedentario',
    light: 'Ligeramente activo',
    moderate: 'Moderadamente activo',
    active: 'Muy activo',
    extra: 'Extra activo'
  };

  // Use provided macroSplit or calculate
  const macros = data.macroSplit || {
    protein: Math.round(tdee * 0.3 / 4),
    carbs: Math.round(tdee * 0.4 / 4),
    fat: Math.round(tdee * 0.3 / 9)
  };

  return (
    <GlassCard borderColor={COLORS.metabol}>
      <AgentBadge name="METABOL" color={COLORS.metabol} icon={Calculator} />
      <h3 className="font-bold text-white mb-4">Calculadora TDEE</h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/5 p-3 rounded-lg text-center">
          <p className="text-[9px] text-white/40 uppercase">BMR</p>
          <p className="text-xl font-bold text-white">{bmr}</p>
          <p className="text-[9px] text-white/40">kcal/día</p>
        </div>
        <div className="bg-[#14B8A6]/10 border border-[#14B8A6]/30 p-3 rounded-lg text-center">
          <p className="text-[9px] text-[#14B8A6] uppercase">TDEE</p>
          <p className="text-xl font-bold text-[#14B8A6]">{tdee}</p>
          <p className="text-[9px] text-white/40">kcal/día</p>
        </div>
      </div>

      <div className="bg-white/5 p-2 rounded-lg mb-3 text-center">
        <span className="text-[10px] text-white/60">
          {typeof data.activityLevel === 'string'
            ? activityStringLabels[data.activityLevel] || 'Activo'
            : activityLabels[activityMultiplier] || 'Activo'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-lg font-bold text-[#FF6347]">{macros.protein}g</p>
          <p className="text-[8px] text-white/40">Proteína</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[#FFB800]">{macros.carbs}g</p>
          <p className="text-[8px] text-white/40">Carbos</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[#00D4FF]">{macros.fat}g</p>
          <p className="text-[8px] text-white/40">Grasa</p>
        </div>
      </div>
    </GlassCard>
  );
};

// --- ATLAS WIDGETS (Body Analysis) ---

// Body Scan 3D - Measurements visualization
export const BodyScan3D: React.FC<WidgetActionProps> = ({ data }) => {
  const measurements = data.measurements || {
    chest: 100, waist: 80, hips: 95, thighs: 55, arms: 35
  };
  const highlights = data.highlights || [];

  return (
    <GlassCard borderColor={COLORS.atlas}>
      <AgentBadge name="ATLAS" color={COLORS.atlas} icon={User} />
      <h3 className="font-bold text-white mb-4">Body Scan</h3>

      <div className="relative h-48 mb-4">
        {/* Stylized body silhouette */}
        <div className="absolute inset-0 flex justify-center">
          <div className="w-24 h-full bg-gradient-to-b from-[#EC4899]/10 to-transparent rounded-full" />
        </div>

        {/* Measurement points */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span className="text-[10px] text-white/60">Pecho</span>
          <span className="text-xs font-bold text-[#EC4899]">{measurements.chest}cm</span>
        </div>
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span className="text-[10px] text-white/60">Cintura</span>
          <span className="text-xs font-bold text-[#EC4899]">{measurements.waist}cm</span>
        </div>
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span className="text-[10px] text-white/60">Cadera</span>
          <span className="text-xs font-bold text-[#EC4899]">{measurements.hips}cm</span>
        </div>
        <div className="absolute top-[70%] left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span className="text-[10px] text-white/60">Muslo</span>
          <span className="text-xs font-bold text-[#EC4899]">{measurements.thighs}cm</span>
        </div>
      </div>

      {highlights.length > 0 && (
        <div className="space-y-1">
          {highlights.map((h: string, i: number) => (
            <p key={i} className="text-[10px] text-[#EC4899]">• {h}</p>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

// Posture Check - Posture assessment
export const PostureCheck: React.FC<WidgetActionProps> = ({ data, onAction }) => {
  const score = data.score || 72;
  const issues = data.issues || ['Hombros redondeados', 'Cuello adelantado'];
  const exercises = data.exercises || ['Chin tucks', 'Wall angels', 'Cat-cow stretch'];

  const getScoreColor = (s: number) => {
    if (s >= 80) return '#00FF88';
    if (s >= 60) return '#FFB800';
    return '#FF4500';
  };

  return (
    <GlassCard borderColor={COLORS.atlas}>
      <AgentBadge name="ATLAS" color={COLORS.atlas} icon={User} />
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-white">Postura</h3>
          <p className="text-[10px] text-white/40">Evaluación postural</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold" style={{ color: getScoreColor(score) }}>{score}</span>
          <span className="text-xs text-white/40">/100</span>
        </div>
      </div>

      {issues.length > 0 && (
        <div className="bg-[#FF4500]/10 border border-[#FF4500]/20 p-3 rounded-lg mb-3">
          <p className="text-[9px] text-[#FF4500] font-bold mb-1">PROBLEMAS DETECTADOS</p>
          {issues.map((issue: string, i: number) => (
            <p key={i} className="text-xs text-white/70">• {issue}</p>
          ))}
        </div>
      )}

      <div className="bg-white/5 p-3 rounded-lg mb-3">
        <p className="text-[9px] text-white/40 uppercase mb-2">Ejercicios correctivos</p>
        {exercises.slice(0, 3).map((ex: string, i: number) => (
          <p key={i} className="text-xs text-white/70 mb-1">• {ex}</p>
        ))}
      </div>

      <ActionButton color={COLORS.atlas} onClick={() => onAction?.('START_POSTURE_ROUTINE')}>
        Iniciar Rutina
      </ActionButton>
    </GlassCard>
  );
};

// Flexibility Score - Flexibility assessment by area
export const FlexibilityScore: React.FC<WidgetActionProps> = ({ data }) => {
  const overall = data.overall || 65;
  const byArea = data.byArea || {
    shoulders: 70, hips: 55, hamstrings: 60, spine: 75
  };

  const getColor = (s: number) => {
    if (s >= 80) return '#00FF88';
    if (s >= 60) return '#FFB800';
    return '#FF4500';
  };

  return (
    <GlassCard borderColor={COLORS.atlas}>
      <AgentBadge name="ATLAS" color={COLORS.atlas} icon={Activity} />
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-white">Flexibilidad</h3>
          <p className="text-[10px] text-white/40">Movilidad general</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold" style={{ color: getColor(overall) }}>{overall}%</span>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(byArea).map(([area, score]) => (
          <div key={area}>
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-white/60 capitalize">{area}</span>
              <span className="text-[10px] font-bold" style={{ color: getColor(score as number) }}>
                {score}%
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${score}%`, background: getColor(score as number) }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// --- NOVA WIDGETS (Strength Progress) ---

// PR Tracker - Personal Record tracking
export const PRTracker: React.FC<WidgetActionProps> = ({ data, onAction }) => {
  const exercise = data.exercise || 'Bench Press';
  const currentPR = data.currentPR || 100;
  const history = data.history || [
    { date: '2024-01', value: 80 },
    { date: '2024-02', value: 85 },
    { date: '2024-03', value: 90 },
    { date: '2024-04', value: 95 },
    { date: 'Ahora', value: 100 }
  ];

  const maxValue = Math.max(...history.map((h: any) => h.value));
  const improvement = history.length > 1 ? currentPR - history[0].value : 0;

  return (
    <GlassCard borderColor={COLORS.nova}>
      <AgentBadge name="NOVA" color={COLORS.nova} icon={Trophy} />
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-white">{exercise}</h3>
          <p className="text-[10px] text-white/40">Personal Record</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-[#D946EF]">{currentPR}</span>
          <span className="text-xs text-white/40 ml-1">kg</span>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="flex items-end justify-between h-16 mb-3 px-1">
        {history.map((h: any, i: number) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div
              className="w-full mx-0.5 rounded-t transition-all bg-[#D946EF]"
              style={{ height: `${(h.value / maxValue) * 100}%`, opacity: 0.3 + (i / history.length) * 0.7 }}
            />
            <span className="text-[8px] text-white/30 mt-1">{h.date}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
        <span className="text-[10px] text-white/60">Mejora total</span>
        <span className="text-sm font-bold text-[#00FF88]">+{improvement} kg</span>
      </div>

      <ActionButton color={COLORS.nova} onClick={() => onAction?.('LOG_NEW_PR')} className="mt-3">
        Registrar Nuevo PR
      </ActionButton>
    </GlassCard>
  );
};

// Volume Chart - Weekly training volume
export const VolumeChart: React.FC<WidgetActionProps> = ({ data }) => {
  const weeklyData = data.weeklyData || [12000, 15000, 18000, 14000, 20000, 16000, 22000];
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const maxVolume = Math.max(...weeklyData);
  const totalVolume = weeklyData.reduce((a: number, b: number) => a + b, 0);
  const trend = data.trend || 'up';

  return (
    <GlassCard borderColor={COLORS.nova}>
      <AgentBadge name="NOVA" color={COLORS.nova} icon={TrendingUp} />
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-white">Volumen Semanal</h3>
          <p className="text-[10px] text-white/40">kg × reps totales</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-[#D946EF]">{(totalVolume / 1000).toFixed(1)}k</span>
          {trend === 'up' && <TrendingUp size={14} className="inline ml-1 text-[#00FF88]" />}
          {trend === 'down' && <TrendingDown size={14} className="inline ml-1 text-[#FF4500]" />}
        </div>
      </div>

      <div className="flex items-end justify-between h-24 mb-2">
        {weeklyData.map((vol: number, i: number) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div
              className="w-full mx-0.5 rounded-t bg-gradient-to-t from-[#D946EF] to-[#EC4899]"
              style={{ height: `${(vol / maxVolume) * 100}%` }}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        {days.map((day, i) => (
          <span key={i} className="text-[9px] text-white/40 flex-1 text-center">{day}</span>
        ))}
      </div>
    </GlassCard>
  );
};

// Strength Curve - Exercise strength projection
export const StrengthCurve: React.FC<WidgetActionProps> = ({ data }) => {
  const exercise = data.exercise || 'Squat';
  const currentMax = data.data?.[data.data.length - 1]?.value || 120;
  const projection = data.projection || currentMax * 1.1;

  const chartData = data.data || [
    { week: 1, value: 100 },
    { week: 4, value: 105 },
    { week: 8, value: 112 },
    { week: 12, value: 120 }
  ];

  const maxValue = Math.max(projection, ...chartData.map((d: any) => d.value));

  return (
    <GlassCard borderColor={COLORS.nova}>
      <AgentBadge name="NOVA" color={COLORS.nova} icon={TrendingUp} />
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-white">{exercise}</h3>
          <p className="text-[10px] text-white/40">Curva de fuerza</p>
        </div>
      </div>

      {/* Progress visualization */}
      <div className="flex items-end justify-between h-24 mb-3">
        {chartData.map((d: any, i: number) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <span className="text-[9px] text-white/60 mb-1">{d.value}kg</span>
            <div
              className="w-full mx-1 rounded-t bg-[#D946EF]"
              style={{ height: `${(d.value / maxValue) * 100}%` }}
            />
            <span className="text-[8px] text-white/30 mt-1">S{d.week}</span>
          </div>
        ))}
        {/* Projection */}
        <div className="flex flex-col items-center flex-1">
          <span className="text-[9px] text-[#00FF88] mb-1">{Math.round(projection)}kg</span>
          <div
            className="w-full mx-1 rounded-t border-2 border-dashed border-[#00FF88]"
            style={{ height: `${(projection / maxValue) * 100}%` }}
          />
          <span className="text-[8px] text-[#00FF88] mt-1">Meta</span>
        </div>
      </div>

      <div className="bg-[#00FF88]/10 border border-[#00FF88]/30 p-2 rounded-lg text-center">
        <p className="text-[10px] text-white/60">Proyección próximas 4 semanas</p>
        <p className="text-lg font-bold text-[#00FF88]">+{Math.round(projection - currentMax)} kg</p>
      </div>
    </GlassCard>
  );
};

// Layout Renderer for multiple widgets (with optional drag support)
interface LayoutRendererProps {
  layout: WidgetLayout;
  onAction: (id: string, val: any) => void;
  editMode?: boolean;
  onReorder?: (newWidgets: WidgetPayload[]) => void;
}

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({ layout, onAction, editMode = false, onReorder }) => {
  // Drag and drop support
  const handleReorder = useCallback((newWidgets: WidgetPayload[]) => {
    if (onReorder) {
      onReorder(newWidgets);
    }
  }, [onReorder]);

  const { getDragHandlers, isDragging, isDraggedOver, isAnyDragging } = useDragReorder(
    layout.widgets,
    handleReorder
  );

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
    <div className={`${getLayoutClass()} ${isAnyDragging ? 'select-none' : ''}`}>
      {layout.widgets.map((widget, index) => (
        editMode ? (
          <DragWrapper
            key={index}
            index={index}
            editMode={editMode}
            isDragging={isDragging(index)}
            isDraggedOver={isDraggedOver(index)}
            dragHandlers={getDragHandlers(index)}
          >
            <A2UIMediator payload={widget} onAction={onAction} editMode={editMode} />
          </DragWrapper>
        ) : (
          <A2UIMediator key={index} payload={widget} onAction={onAction} editMode={editMode} />
        )
      ))}
    </div>
  );
};

interface A2UIMediatorProps {
  payload: RenderPayload | null;
  onAction: (id: string, val: any) => void;
  editMode?: boolean;
  onReorder?: (newWidgets: WidgetPayload[]) => void;
}

export const A2UIMediator: React.FC<A2UIMediatorProps> = ({ payload, onAction, editMode = false, onReorder }) => {
  if (!payload) return null;

  // Handle layouts
  if (isWidgetLayout(payload)) {
    return <LayoutRenderer layout={payload} onAction={onAction} editMode={editMode} onReorder={onReorder} />;
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
    'wind-down': WindDown,
    // Interactive Widgets
    'rep-counter': RepCounter,
    'weight-input': WeightInput,
    // BLAZE (Advanced Training)
    'superset-card': SupersetCard,
    'amrap-timer': AMRAPTimer,
    'emom-clock': EMOMClock,
    // WAVE (Recovery & HRV)
    'hrv-chart': HRVChart,
    'recovery-score': RecoveryScore,
    'stress-meter': StressMeter,
    // METABOL (Advanced Metabolism)
    'fasting-timer': FastingTimer,
    'ketone-tracker': KetoneTracker,
    'tdee-calculator': TDEECalculator,
    // ATLAS (Body Analysis)
    'body-scan-3d': BodyScan3D,
    'posture-check': PostureCheck,
    'flexibility-score': FlexibilityScore,
    // NOVA (Strength Analytics)
    'pr-tracker': PRTracker,
    'volume-chart': VolumeChart,
    'strength-curve': StrengthCurve
  };

  const Widget = widgetMap[payload.type];
  return Widget ? <Widget data={payload.props} onAction={onAction} /> : <div className="text-red-500 text-xs">Widget {payload.type} no encontrado</div>;
};