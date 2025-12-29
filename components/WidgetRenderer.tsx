import React from 'react';
import { 
  Cpu, Zap, Droplets, UtensilsCrossed, Pill, Activity,
  Calendar, Sun, Calculator, User, AlertTriangle, Lightbulb,
  Dumbbell, CheckCircle2
} from 'lucide-react';
import { COLORS } from '../constants';
import { GlassCard, AgentBadge, ProgressBar, ActionButton } from './UIComponents';
import { WidgetPayload } from '../types';

interface WidgetActionProps {
  data: any;
  onAction?: (action: string, payload?: any) => void;
}

// --- DASHBOARD ---
export const ProgressDashboard: React.FC<WidgetActionProps> = ({ data }) => (
  <GlassCard borderColor={COLORS.nexus}>
    <AgentBadge name="NEXUS" color={COLORS.nexus} icon={Cpu} />
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-bold text-white text-sm">{data.title || 'Resumen'}</h3>
        <p className="text-[10px] text-white/40">{data.subtitle}</p>
      </div>
      <span className="text-xl font-bold text-white">{data.progress}%</span>
    </div>
    <ProgressBar value={data.progress} max={100} color={COLORS.nexus} />
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
  <GlassCard borderColor={COLORS.aqua}>
    <AgentBadge name="AQUA" color={COLORS.aqua} icon={Droplets} />
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
    <AgentBadge name="PHARMA" color={COLORS.nova} icon={Pill} />
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
  <GlassCard borderColor={COLORS.ascend}>
    <AgentBadge name="ASCEND" color={COLORS.ascend} icon={Calendar} />
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
  <GlassCard borderColor={COLORS.nexus}>
    <AgentBadge name="NEXUS" color={COLORS.nexus} icon={Sun} />
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

export const A2UIMediator: React.FC<{ payload: WidgetPayload | null; onAction: (id: string, val: any) => void }> = ({ payload, onAction }) => {
  if (!payload || !payload.type) return null;
  const widgetMap: { [key: string]: React.FC<WidgetActionProps> } = {
    'progress-dashboard': ProgressDashboard,
    'metric-card': MetricCard,
    'workout-card': WorkoutCard,
    'exercise-row': ExerciseRow,
    'meal-plan': MealPlan,
    'hydration-tracker': HydrationTracker,
    'supplement-stack': SupplementStack,
    'season-timeline': SeasonTimeline,
    'today-card': TodayCard,
    'max-rep-calculator': MaxRepCalculator,
    'alert-banner': AlertBanner,
    'coach-message': CoachMessage,
    'insight-card': InsightCard
  };
  const Widget = widgetMap[payload.type];
  return Widget ? <Widget data={payload.props} onAction={onAction} /> : <div className="text-red-500 text-xs">Widget {payload.type} no encontrado</div>;
};