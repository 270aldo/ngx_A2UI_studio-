import React, { useState } from 'react';
import { Palette, ChevronDown, ChevronRight, RotateCcw, Type, Maximize2, Droplets } from 'lucide-react';
import {
  useTheme,
  THEME_PRESETS,
  ThemePreset,
  Density,
  GlassBlur
} from '../contexts/ThemeContext';

// ============================================================================
// THEME PANEL COMPONENT
// ============================================================================

export const ThemePanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    theme,
    setPreset,
    setDensity,
    setFontScale,
    setGlassBlur,
    resetTheme
  } = useTheme();

  const presets = Object.entries(THEME_PRESETS) as [ThemePreset, typeof THEME_PRESETS[ThemePreset]][];
  const densities: { value: Density; label: string }[] = [
    { value: 'compact', label: 'Compacto' },
    { value: 'normal', label: 'Normal' },
    { value: 'comfortable', label: 'Espacioso' }
  ];
  const blurOptions: { value: GlassBlur; label: string }[] = [
    { value: 'none', label: 'Sin blur' },
    { value: 'light', label: 'Suave' },
    { value: 'heavy', label: 'Intenso' }
  ];

  return (
    <div className="border-b border-white/10">
      {/* Header - Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
      >
        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <Palette size={12} className="text-purple-400" />
        <span className="text-xs font-medium">Tema</span>
        <span className="ml-auto text-[10px] text-white/30">
          {THEME_PRESETS[theme.preset].emoji}
        </span>
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-4">
          {/* Theme Presets */}
          <div>
            <p className="text-[10px] text-white/40 uppercase mb-2 font-bold">Preset</p>
            <div className="grid grid-cols-5 gap-1">
              {presets.map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => setPreset(key)}
                  className={`relative p-2 rounded-lg transition-all ${
                    theme.preset === key
                      ? 'ring-2 ring-white/50 bg-white/10'
                      : 'hover:bg-white/5'
                  }`}
                  title={preset.name}
                >
                  {/* Color Preview */}
                  <div
                    className="w-full aspect-square rounded-md mb-1"
                    style={{
                      background: `linear-gradient(135deg, ${preset.colors.accent} 0%, ${preset.colors.background} 100%)`
                    }}
                  />
                  <span className="text-[9px] text-white/60 block text-center truncate">
                    {preset.emoji}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Density */}
          <div>
            <p className="text-[10px] text-white/40 uppercase mb-2 font-bold flex items-center gap-1">
              <Maximize2 size={10} /> Densidad
            </p>
            <div className="flex gap-1">
              {densities.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setDensity(value)}
                  className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] transition-all ${
                    theme.density === value
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Scale */}
          <div>
            <p className="text-[10px] text-white/40 uppercase mb-2 font-bold flex items-center gap-1">
              <Type size={10} /> Tamaño Texto
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontScale(theme.fontScale - 0.1)}
                disabled={theme.fontScale <= 0.8}
                className="px-2 py-1 rounded bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                A-
              </button>
              <div className="flex-1 relative h-1.5 bg-white/10 rounded-full">
                <div
                  className="absolute left-0 top-0 h-full bg-white/40 rounded-full transition-all"
                  style={{ width: `${((theme.fontScale - 0.8) / 0.4) * 100}%` }}
                />
              </div>
              <button
                onClick={() => setFontScale(theme.fontScale + 0.1)}
                disabled={theme.fontScale >= 1.2}
                className="px-2 py-1 rounded bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                A+
              </button>
              <span className="text-[10px] text-white/40 w-10 text-right">
                {Math.round(theme.fontScale * 100)}%
              </span>
            </div>
          </div>

          {/* Glass Blur */}
          <div>
            <p className="text-[10px] text-white/40 uppercase mb-2 font-bold flex items-center gap-1">
              <Droplets size={10} /> Efecto Glass
            </p>
            <div className="flex gap-1">
              {blurOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setGlassBlur(value)}
                  className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] transition-all ${
                    theme.glassBlur === value
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetTheme}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[10px] text-white/40 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
          >
            <RotateCcw size={10} />
            Restablecer
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemePanel;
