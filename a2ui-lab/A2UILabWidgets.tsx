/**
 * A2UI Lab - Advanced Widgets
 *
 * Widgets sofisticados que demuestran las capacidades
 * del protocolo A2UI de Google:
 *
 * 1. LiveWorkoutSession - Multi-Surface
 * 2. ReactiveBiometrics - Data Binding
 * 3. ExerciseInputPanel - Two-Way Binding
 * 4. SupersetBuilder - Templates
 * 5. StreamingWorkoutGen - Progressive Rendering
 * 6. MultiAgentDashboard - Orchestration
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Activity, Edit3, GitMerge, Loader, Users,
  Heart, Flame, Zap, Timer, Play, Pause, RotateCcw,
  Plus, Minus, Check, ChevronRight, Dumbbell, Brain,
  Sparkles, TrendingUp, TrendingDown, Wind, Droplets
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  RadialBarChart, RadialBar, XAxis, YAxis
} from 'recharts';
import { GlassCard, AgentBadge, ProgressBar, ActionButton } from '../components/UIComponents';
import { COLORS } from '../constants';
import {
  LiveWorkoutSessionProps,
  ReactiveBiometricsProps,
  ExerciseInputPanelProps,
  SupersetBuilderProps,
  StreamingWorkoutGenProps,
  MultiAgentDashboardProps
} from './types';

interface WidgetActionProps<T = any> {
  data: T;
  onAction?: (action: string, payload?: any) => void;
}

// ============================================
// 1. LIVE WORKOUT SESSION (Multi-Surface)
// ============================================

export const LiveWorkoutSession: React.FC<WidgetActionProps<LiveWorkoutSessionProps>> = ({ data, onAction }) => {
  const [timerSeconds, setTimerSeconds] = useState(data.timer?.seconds || 0);
  const [isPaused, setIsPaused] = useState(data.timer?.isPaused || false);

  // Timer countdown
  useEffect(() => {
    if (isPaused || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, timerSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCoachTypeColor = (type: string) => {
    switch (type) {
      case 'tip': return '#00D4FF';
      case 'motivation': return '#FFB800';
      case 'warning': return '#FF6B35';
      case 'celebration': return '#00FF88';
      default: return '#6D00FF';
    }
  };

  return (
    <div className="space-y-3">
      {/* SURFACE: Main Header with Progress */}
      <div className="relative overflow-hidden rounded-2xl p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(255,107,53,0.2) 0%, rgba(255,107,53,0.05) 100%)',
          border: '1px solid rgba(255,107,53,0.3)'
        }}
      >
        <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-bold text-white/40 uppercase">
          <Layers size={10} /> Multi-Surface
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] text-white/40 uppercase">Ejercicio {data.currentExerciseIndex}/{data.totalExercises}</p>
            <h3 className="text-lg font-bold text-white">{data.currentExercise?.name}</h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">
              Set {data.currentExercise?.set}/{data.currentExercise?.totalSets}
            </p>
          </div>
        </div>

        <ProgressBar value={data.workoutProgress || 0} max={100} color="#FF6B35" />

        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-[9px] text-white/40">REPS</p>
            <p className="text-lg font-bold text-white">{data.currentExercise?.targetReps}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-[9px] text-white/40">PESO</p>
            <p className="text-lg font-bold text-white">{data.currentExercise?.targetWeight}kg</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-[9px] text-white/40">DESCANSO</p>
            <p className="text-lg font-bold text-white">{data.currentExercise?.restSeconds}s</p>
          </div>
        </div>
      </div>

      {/* SURFACE: Timer Overlay */}
      <motion.div
        className="relative overflow-hidden rounded-2xl p-5"
        style={{
          background: data.timer?.isRest
            ? 'linear-gradient(135deg, rgba(0,212,255,0.2) 0%, rgba(0,212,255,0.05) 100%)'
            : 'linear-gradient(135deg, rgba(0,255,136,0.2) 0%, rgba(0,255,136,0.05) 100%)',
          border: `1px solid ${data.timer?.isRest ? 'rgba(0,212,255,0.3)' : 'rgba(0,255,136,0.3)'}`
        }}
        animate={{ scale: timerSeconds <= 5 && timerSeconds > 0 ? [1, 1.02, 1] : 1 }}
        transition={{ repeat: timerSeconds <= 5 ? Infinity : 0, duration: 0.5 }}
      >
        <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-bold text-white/40 uppercase">
          <Timer size={10} /> Surface: Timer
        </div>

        <div className="text-center">
          <p className="text-[10px] text-white/40 uppercase mb-1">
            {data.timer?.isRest ? 'Descanso' : 'Tiempo de Trabajo'}
          </p>
          <motion.p
            className="text-5xl font-bold font-mono"
            style={{ color: data.timer?.isRest ? '#00D4FF' : '#00FF88' }}
            animate={{ scale: timerSeconds <= 5 && timerSeconds > 0 ? [1, 1.1, 1] : 1 }}
          >
            {formatTime(timerSeconds)}
          </motion.p>
        </div>

        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isPaused ? <Play size={20} className="text-white" /> : <Pause size={20} className="text-white" />}
          </button>
          <button
            onClick={() => setTimerSeconds(data.currentExercise?.restSeconds || 90)}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <RotateCcw size={20} className="text-white" />
          </button>
        </div>
      </motion.div>

      {/* SURFACE: Coach AI Sidebar */}
      <div className="relative overflow-hidden rounded-2xl p-4"
        style={{
          background: `linear-gradient(135deg, ${getCoachTypeColor(data.coachAdvice?.type || 'tip')}20 0%, ${getCoachTypeColor(data.coachAdvice?.type || 'tip')}05 100%)`,
          border: `1px solid ${getCoachTypeColor(data.coachAdvice?.type || 'tip')}30`
        }}
      >
        <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-bold text-white/40 uppercase">
          <Brain size={10} /> Surface: Coach
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Sparkles size={18} style={{ color: getCoachTypeColor(data.coachAdvice?.type || 'tip') }} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase mb-1"
              style={{ color: getCoachTypeColor(data.coachAdvice?.type || 'tip') }}>
              AI Coach
            </p>
            <p className="text-sm text-white/80">
              {data.coachAdvice?.message}
              {data.coachAdvice?.isStreaming && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block ml-1"
                >
                  ▊
                </motion.span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <ActionButton variant="secondary" onClick={() => onAction?.('SKIP_SET')}>
          Saltar Set
        </ActionButton>
        <ActionButton color="#FF6B35" onClick={() => onAction?.('COMPLETE_SET')}>
          Completar Set
        </ActionButton>
      </div>
    </div>
  );
};

// ============================================
// 2. REACTIVE BIOMETRICS (Data Binding)
// ============================================

export const ReactiveBiometrics: React.FC<WidgetActionProps<ReactiveBiometricsProps>> = ({ data }) => {
  const [currentHR, setCurrentHR] = useState(data.heartRate?.current || 0);
  const [hrTrend, setHrTrend] = useState(data.heartRate?.trend || []);

  // Simulate real-time updates (data binding simulation)
  useEffect(() => {
    if (!data.isLive) return;

    const interval = setInterval(() => {
      const variation = Math.floor(Math.random() * 6) - 3;
      const newHR = Math.max(60, Math.min(180, currentHR + variation));
      setCurrentHR(newHR);
      setHrTrend(prev => [...prev.slice(-9), newHR]);
    }, 1000);

    return () => clearInterval(interval);
  }, [data.isLive, currentHR]);

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'rest': return '#6B7280';
      case 'warmup': return '#10B981';
      case 'fat_burn': return '#F59E0B';
      case 'cardio': return '#EF4444';
      case 'peak': return '#DC2626';
      default: return '#6D00FF';
    }
  };

  const getZoneName = (zone: string) => {
    switch (zone) {
      case 'rest': return 'Reposo';
      case 'warmup': return 'Calentamiento';
      case 'fat_burn': return 'Quema Grasa';
      case 'cardio': return 'Cardio';
      case 'peak': return 'Máximo';
      default: return zone;
    }
  };

  const chartData = hrTrend.map((value, i) => ({ value, index: i }));

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-[#EF4444]" />
          <span className="text-xs font-bold text-white/60 uppercase">Biometrics</span>
        </div>
        {data.isLive && (
          <div className="flex items-center gap-1.5 bg-[#EF4444]/20 text-[#EF4444] px-2 py-1 rounded-full">
            <motion.span
              className="w-2 h-2 rounded-full bg-[#EF4444]"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
            <span className="text-[10px] font-bold uppercase">Live</span>
          </div>
        )}
      </div>

      {/* Heart Rate Card with Data Binding */}
      <div className="relative overflow-hidden rounded-2xl p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.05) 100%)',
          border: '1px solid rgba(239,68,68,0.3)'
        }}
      >
        <div className="absolute top-2 right-2 text-[9px] font-bold text-white/30 uppercase">
          path: /heartRate/current
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 60 / currentHR }}
            >
              <Heart size={24} className="text-[#EF4444]" fill="#EF4444" />
            </motion.div>
            <div>
              <motion.p
                className="text-3xl font-bold text-white"
                key={currentHR}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
              >
                {currentHR}
              </motion.p>
              <p className="text-[10px] text-white/40">BPM</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold" style={{ color: getZoneColor(data.heartRate?.zone || 'cardio') }}>
              {getZoneName(data.heartRate?.zone || 'cardio')}
            </p>
            <p className="text-[10px] text-white/40">Promedio: {data.heartRate?.average || 0}</p>
          </div>
        </div>

        {/* Mini Sparkline with reactive data */}
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#EF4444"
                fill="url(#hrGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Calories */}
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1 mb-1">
            <Flame size={12} className="text-[#F59E0B]" />
            <span className="text-[9px] text-white/40">KCAL</span>
          </div>
          <p className="text-lg font-bold text-white">{data.calories?.burned || 0}</p>
          <p className="text-[9px] text-white/30">{data.calories?.rate || 0} cal/min</p>
        </div>

        {/* HRV */}
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1 mb-1">
            <Activity size={12} className="text-[#8B5CF6]" />
            <span className="text-[9px] text-white/40">HRV</span>
          </div>
          <p className="text-lg font-bold text-white">{data.hrv?.score || 0}</p>
          <p className="text-[9px]"
            style={{ color: data.hrv?.status === 'optimal' ? '#10B981' : '#F59E0B' }}>
            {data.hrv?.status || 'N/A'}
          </p>
        </div>

        {/* SpO2 */}
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1 mb-1">
            <Wind size={12} className="text-[#00D4FF]" />
            <span className="text-[9px] text-white/40">SpO2</span>
          </div>
          <p className="text-lg font-bold text-white">{data.oxygen?.spo2 || 0}%</p>
          <div className="flex items-center gap-1">
            {data.oxygen?.trend === 'rising' && <TrendingUp size={10} className="text-[#10B981]" />}
            {data.oxygen?.trend === 'falling' && <TrendingDown size={10} className="text-[#EF4444]" />}
            <p className="text-[9px] text-white/30">{data.oxygen?.trend || 'stable'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 3. EXERCISE INPUT PANEL (Two-Way Binding)
// ============================================

export const ExerciseInputPanel: React.FC<WidgetActionProps<ExerciseInputPanelProps>> = ({ data, onAction }) => {
  // Two-way binding state
  const [weight, setWeight] = useState(data.currentSet?.weight || 0);
  const [reps, setReps] = useState(data.currentSet?.reps || 0);
  const [rpe, setRpe] = useState(data.currentSet?.rpe || 7);
  const [isEditing, setIsEditing] = useState(false);

  // Notify parent of changes (simulating two-way binding)
  useEffect(() => {
    if (onAction) {
      onAction('DATA_MODEL_UPDATE', {
        path: '/currentSet',
        value: { weight, reps, rpe }
      });
    }
  }, [weight, reps, rpe]);

  const adjustValue = (setter: React.Dispatch<React.SetStateAction<number>>, delta: number, min = 0, max = 999) => {
    setter(prev => Math.max(min, Math.min(max, prev + delta)));
  };

  const getRpeColor = (value: number) => {
    if (value <= 5) return '#10B981';
    if (value <= 7) return '#F59E0B';
    if (value <= 8) return '#FF6B35';
    return '#EF4444';
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{data.exercise?.name}</h3>
          <p className="text-[10px] text-white/40">
            {data.exercise?.muscleGroup} · {data.exercise?.equipment}
          </p>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-bold text-[#10B981] uppercase">
          <Edit3 size={10} /> Two-Way Binding
        </div>
      </div>

      {/* Current Set Input */}
      <div className="relative overflow-hidden rounded-2xl p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.05) 100%)',
          border: '1px solid rgba(16,185,129,0.3)'
        }}
      >
        <p className="text-[10px] text-white/40 uppercase mb-3">
          Set {data.currentSet?.number}/{data.targetSets} · Edición en Tiempo Real
        </p>

        <div className="grid grid-cols-3 gap-3">
          {/* Weight Input */}
          <div className="text-center">
            <p className="text-[9px] text-white/40 mb-2">PESO (kg)</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => adjustValue(setWeight, -2.5)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <Minus size={14} className="text-white" />
              </button>
              <motion.span
                key={weight}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-white min-w-[60px]"
              >
                {weight}
              </motion.span>
              <button
                onClick={() => adjustValue(setWeight, 2.5)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <Plus size={14} className="text-white" />
              </button>
            </div>
            <p className="text-[8px] text-white/20 mt-1">path: /currentSet/weight</p>
          </div>

          {/* Reps Input */}
          <div className="text-center">
            <p className="text-[9px] text-white/40 mb-2">REPS</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => adjustValue(setReps, -1, 1)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <Minus size={14} className="text-white" />
              </button>
              <motion.span
                key={reps}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-white min-w-[40px]"
              >
                {reps}
              </motion.span>
              <button
                onClick={() => adjustValue(setReps, 1, 1, 50)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <Plus size={14} className="text-white" />
              </button>
            </div>
            <p className="text-[8px] text-white/20 mt-1">path: /currentSet/reps</p>
          </div>

          {/* RPE Input */}
          <div className="text-center">
            <p className="text-[9px] text-white/40 mb-2">RPE</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => adjustValue(setRpe, -1, 1, 10)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <Minus size={14} className="text-white" />
              </button>
              <motion.span
                key={rpe}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold min-w-[40px]"
                style={{ color: getRpeColor(rpe) }}
              >
                {rpe}
              </motion.span>
              <button
                onClick={() => adjustValue(setRpe, 1, 1, 10)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <Plus size={14} className="text-white" />
              </button>
            </div>
            <p className="text-[8px] text-white/20 mt-1">path: /currentSet/rpe</p>
          </div>
        </div>
      </div>

      {/* Previous Sets */}
      {data.previousSets && data.previousSets.length > 0 && (
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <p className="text-[9px] text-white/40 uppercase mb-2">Sets Anteriores</p>
          <div className="space-y-1">
            {data.previousSets.map((set, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-white/40">Set {i + 1}</span>
                <span className="text-white">{set.weight}kg × {set.reps}</span>
                <span style={{ color: getRpeColor(set.rpe || 7) }}>RPE {set.rpe}</span>
                {set.completed && <Check size={12} className="text-[#10B981]" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <ActionButton color="#10B981" onClick={() => onAction?.('COMPLETE_SET', { weight, reps, rpe })}>
        Completar Set
      </ActionButton>
    </div>
  );
};

// ============================================
// 4. SUPERSET BUILDER (Templates)
// ============================================

export const SupersetBuilder: React.FC<WidgetActionProps<SupersetBuilderProps>> = ({ data, onAction }) => {
  const [supersets, setSupersets] = useState(data.supersets || []);

  const toggleSuperset = (id: string) => {
    setSupersets(prev => prev.map(ss =>
      ss.id === id ? { ...ss, completed: !ss.completed } : ss
    ));
  };

  const addSuperset = () => {
    const newSS = {
      id: `ss${Date.now()}`,
      exerciseA: { name: 'Exercise A', sets: 3, reps: '10', load: '0kg' },
      exerciseB: { name: 'Exercise B', sets: 3, reps: '10', load: '0kg' },
      restBetween: 60,
      completed: false
    };
    setSupersets(prev => [...prev, newSS]);
    onAction?.('ADD_SUPERSET', newSS);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{data.title}</h3>
          <p className="text-[10px] text-white/40">
            {supersets.length} supersets · ~{data.estimatedTime}min
          </p>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-bold text-[#8B5CF6] uppercase">
          <GitMerge size={10} /> Templates
        </div>
      </div>

      {/* Template Info */}
      <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-xl p-3">
        <p className="text-[9px] text-[#8B5CF6] font-bold uppercase mb-1">Template Binding</p>
        <p className="text-[10px] text-white/60">
          childrenProperty: path="/supersets" → Itera array y renderiza cada superset automáticamente
        </p>
      </div>

      {/* Supersets List (Template Rendered) */}
      <div className="space-y-2">
        <AnimatePresence>
          {supersets.map((ss, index) => (
            <motion.div
              key={ss.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-xl p-3 cursor-pointer transition-all ${
                ss.completed ? 'bg-white/5 opacity-60' : 'bg-white/10'
              }`}
              style={{ border: `1px solid ${ss.completed ? 'rgba(255,255,255,0.1)' : 'rgba(139,92,246,0.3)'}` }}
              onClick={() => toggleSuperset(ss.id)}
            >
              <div className="absolute top-2 right-2 text-[8px] text-white/20">
                template[{index}]
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  ss.completed ? 'bg-[#10B981]' : 'bg-[#8B5CF6]/30'
                }`}>
                  {ss.completed ? <Check size={14} className="text-white" /> : <span className="text-xs text-white font-bold">{index + 1}</span>}
                </div>
                <p className="text-xs font-bold text-white">Superset {index + 1}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Exercise A */}
                <div className="bg-black/20 rounded-lg p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
                    <p className="text-[9px] text-white/40">A</p>
                  </div>
                  <p className={`text-xs font-medium ${ss.completed ? 'line-through text-white/40' : 'text-white'}`}>
                    {ss.exerciseA.name}
                  </p>
                  <p className="text-[10px] text-white/30">
                    {ss.exerciseA.sets}×{ss.exerciseA.reps} · {ss.exerciseA.load}
                  </p>
                </div>

                {/* Exercise B */}
                <div className="bg-black/20 rounded-lg p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />
                    <p className="text-[9px] text-white/40">B</p>
                  </div>
                  <p className={`text-xs font-medium ${ss.completed ? 'line-through text-white/40' : 'text-white'}`}>
                    {ss.exerciseB.name}
                  </p>
                  <p className="text-[10px] text-white/30">
                    {ss.exerciseB.sets}×{ss.exerciseB.reps} · {ss.exerciseB.load}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 text-[9px] text-white/30">
                <span>Descanso: {ss.restBetween}s</span>
                <ChevronRight size={12} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Superset Button */}
      <button
        onClick={addSuperset}
        className="w-full p-3 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-white hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        <span className="text-xs">Agregar Superset</span>
      </button>

      {/* Volume Summary */}
      <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
        <span className="text-[10px] text-white/40">Volumen Total</span>
        <span className="text-lg font-bold text-white">{data.totalVolume?.toLocaleString()} kg</span>
      </div>
    </div>
  );
};

// ============================================
// 5. STREAMING WORKOUT GENERATOR
// ============================================

export const StreamingWorkoutGen: React.FC<WidgetActionProps<StreamingWorkoutGenProps>> = ({ data, onAction }) => {
  const [status, setStatus] = useState(data.status || 'idle');
  const [components, setComponents] = useState(data.generatedComponents || []);
  const [thought, setThought] = useState('');
  const [prompt, setPrompt] = useState(data.prompt || '');

  const simulateStreaming = async () => {
    if (!prompt.trim()) return;

    setStatus('thinking');
    setThought('Analizando solicitud...');
    setComponents([]);

    await new Promise(r => setTimeout(r, 800));
    setThought('Diseñando estructura del workout...');

    await new Promise(r => setTimeout(r, 600));
    setStatus('streaming');
    setThought('Generando ejercicios...');

    // Simulate progressive component generation
    const mockComponents = [
      { id: 'ex1', type: 'exercise-row', props: { name: 'Pull-ups', sets: 4, reps: '8-10', load: 'BW' }, streamedAt: 0 },
      { id: 'ex2', type: 'exercise-row', props: { name: 'Barbell Row', sets: 4, reps: '8', load: '70kg' }, streamedAt: 300 },
      { id: 'ex3', type: 'exercise-row', props: { name: 'Lat Pulldown', sets: 3, reps: '10-12', load: '60kg' }, streamedAt: 600 },
      { id: 'ex4', type: 'exercise-row', props: { name: 'Seated Cable Row', sets: 3, reps: '12', load: '50kg' }, streamedAt: 900 },
      { id: 'ex5', type: 'exercise-row', props: { name: 'Face Pulls', sets: 3, reps: '15', load: '20kg' }, streamedAt: 1200 }
    ];

    for (const comp of mockComponents) {
      await new Promise(r => setTimeout(r, 400));
      setComponents(prev => [...prev, comp]);
    }

    await new Promise(r => setTimeout(r, 300));
    setThought('¡Workout completo! 5 ejercicios enfocados en espalda.');
    setStatus('complete');
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'thinking':
        return <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Brain size={16} /></motion.div>;
      case 'streaming':
        return <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}><Loader size={16} /></motion.div>;
      case 'complete':
        return <Check size={16} className="text-[#10B981]" />;
      default:
        return <Sparkles size={16} />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Loader size={16} className="text-[#F59E0B]" />
          <span className="text-xs font-bold text-white/60 uppercase">Streaming Gen</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold uppercase"
          style={{
            backgroundColor: status === 'complete' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
            color: status === 'complete' ? '#10B981' : '#F59E0B'
          }}>
          {getStatusIcon()}
          <span className="ml-1">{status}</span>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe tu workout..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F59E0B]"
        />
        <button
          onClick={simulateStreaming}
          disabled={status === 'thinking' || status === 'streaming'}
          className="px-4 py-2 rounded-xl bg-[#F59E0B] text-black font-bold text-xs disabled:opacity-50"
        >
          Generar
        </button>
      </div>

      {/* Agent Thought (streaming) */}
      {thought && (
        <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-xl p-3">
          <p className="text-[9px] text-[#F59E0B] font-bold uppercase mb-1">AI Thought</p>
          <p className="text-xs text-white/70">
            {thought}
            {(status === 'thinking' || status === 'streaming') && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="inline-block ml-1"
              >
                ▊
              </motion.span>
            )}
          </p>
        </div>
      )}

      {/* Streamed Components */}
      <div className="space-y-2 min-h-[100px]">
        <AnimatePresence>
          {components.map((comp, index) => (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-xl p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#FF6B35]/20 flex items-center justify-center">
                    <Dumbbell size={12} className="text-[#FF6B35]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{comp.props.name}</p>
                    <p className="text-[10px] text-white/40">
                      {comp.props.sets}×{comp.props.reps} · {comp.props.load}
                    </p>
                  </div>
                </div>
                <span className="text-[8px] text-white/20">+{comp.streamedAt}ms</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {status === 'idle' && components.length === 0 && (
          <div className="text-center py-8 text-white/20 text-xs">
            Escribe un prompt y presiona "Generar" para ver el streaming
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// 6. MULTI-AGENT DASHBOARD (Orchestration)
// ============================================

export const MultiAgentDashboard: React.FC<WidgetActionProps<MultiAgentDashboardProps>> = ({ data, onAction }) => {
  const [agents, setAgents] = useState(data.agents || {});
  const [orchestratorStatus, setOrchestratorStatus] = useState(data.orchestratorStatus || 'coordinating');

  const agentConfig = {
    blaze: { name: 'BLAZE', color: '#FF6B35', icon: Zap, role: 'Training' },
    pulse: { name: 'PULSE', color: '#EF4444', icon: Heart, role: 'Biometrics' },
    spark: { name: 'SPARK', color: '#FBBF24', icon: Sparkles, role: 'Gamification' },
    sage: { name: 'SAGE', color: '#14B8A6', icon: Brain, role: 'Insights' }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return '#F59E0B';
      case 'done': return '#10B981';
      default: return '#6B7280';
    }
  };

  const simulateOrchestration = async () => {
    setOrchestratorStatus('coordinating');

    // Simulate agents working
    for (const agentKey of ['blaze', 'pulse', 'spark', 'sage']) {
      await new Promise(r => setTimeout(r, 800));
      setAgents(prev => ({
        ...prev,
        [agentKey]: { status: 'working' }
      }));

      await new Promise(r => setTimeout(r, 1200));
      setAgents(prev => ({
        ...prev,
        [agentKey]: { status: 'done', contribution: { type: `${agentKey}-result` } }
      }));
    }

    setOrchestratorStatus('merging');
    await new Promise(r => setTimeout(r, 600));
    setOrchestratorStatus('complete');
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-[#6366F1]" />
          <span className="text-xs font-bold text-white/60 uppercase">Multi-Agent</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold uppercase"
          style={{
            backgroundColor: orchestratorStatus === 'complete' ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)',
            color: orchestratorStatus === 'complete' ? '#10B981' : '#6366F1'
          }}>
          {orchestratorStatus}
        </div>
      </div>

      {/* Orchestrator Info */}
      <div className="bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-xl p-3">
        <p className="text-[9px] text-[#6366F1] font-bold uppercase mb-1">Orchestration</p>
        <p className="text-[10px] text-white/60">
          Múltiples agentes contribuyen a una única superficie. El orquestador coordina y fusiona las respuestas.
        </p>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(agentConfig).map(([key, config]) => {
          const agentState = agents[key as keyof typeof agents];
          const Icon = config.icon;

          return (
            <motion.div
              key={key}
              className="relative overflow-hidden rounded-xl p-3"
              style={{
                background: `linear-gradient(135deg, ${config.color}20 0%, ${config.color}05 100%)`,
                border: `1px solid ${config.color}30`
              }}
              animate={agentState?.status === 'working' ? { scale: [1, 1.02, 1] } : {}}
              transition={{ repeat: agentState?.status === 'working' ? Infinity : 0, duration: 1 }}
            >
              {/* Status Indicator */}
              <motion.div
                className="absolute top-2 right-2 w-2 h-2 rounded-full"
                style={{ backgroundColor: getStatusColor(agentState?.status || 'idle') }}
                animate={agentState?.status === 'working' ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : {}}
                transition={{ repeat: agentState?.status === 'working' ? Infinity : 0, duration: 0.6 }}
              />

              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${config.color}30` }}>
                  <Icon size={16} style={{ color: config.color }} />
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: config.color }}>{config.name}</p>
                  <p className="text-[9px] text-white/40">{config.role}</p>
                </div>
              </div>

              <p className="text-[10px] text-white/50">
                {agentState?.status === 'idle' && 'Esperando...'}
                {agentState?.status === 'working' && 'Procesando...'}
                {agentState?.status === 'done' && 'Completado ✓'}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Run Orchestration Button */}
      <button
        onClick={simulateOrchestration}
        disabled={orchestratorStatus === 'coordinating' || orchestratorStatus === 'merging'}
        className="w-full py-3 rounded-xl bg-[#6366F1] text-white font-bold text-xs disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Users size={14} />
        {orchestratorStatus === 'complete' ? 'Ejecutar de Nuevo' : 'Iniciar Orquestación'}
      </button>

      {/* Final Surface Preview */}
      {orchestratorStatus === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl p-3"
        >
          <p className="text-[9px] text-[#10B981] font-bold uppercase mb-1">Superficie Final</p>
          <p className="text-[10px] text-white/60">
            4 agentes han contribuido. Superficie unificada lista para renderizar.
          </p>
        </motion.div>
      )}
    </div>
  );
};

// ============================================
// WIDGET MAP EXPORT
// ============================================

export const A2UI_LAB_WIDGET_MAP: Record<string, React.FC<WidgetActionProps>> = {
  'live-workout-session': LiveWorkoutSession,
  'reactive-biometrics': ReactiveBiometrics,
  'exercise-input-panel': ExerciseInputPanel,
  'superset-builder': SupersetBuilder,
  'streaming-workout-gen': StreamingWorkoutGen,
  'multi-agent-dashboard': MultiAgentDashboard
};
