import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============================================================================
// THEME CONFIGURATION TYPES
// ============================================================================

export type ThemePreset = 'midnight' | 'sunrise' | 'forest' | 'ocean' | 'neon';
export type Density = 'compact' | 'normal' | 'comfortable';
export type GlassBlur = 'none' | 'light' | 'heavy';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceHover: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  success: string;
  warning: string;
  error: string;
}

export interface ThemeConfig {
  preset: ThemePreset;
  density: Density;
  fontScale: number;
  glassBlur: GlassBlur;
  accentColor: string;
  colors: ThemeColors;
}

// ============================================================================
// THEME PRESETS
// ============================================================================

export const THEME_PRESETS: Record<ThemePreset, { name: string; emoji: string; colors: ThemeColors }> = {
  midnight: {
    name: 'Midnight',
    emoji: '🌙',
    colors: {
      background: '#000000',
      surface: '#050505',
      surfaceHover: '#0A0A0A',
      border: 'rgba(255,255,255,0.1)',
      text: '#FFFFFF',
      textMuted: 'rgba(255,255,255,0.6)',
      accent: '#6D00FF',
      accentHover: '#8B2FFF',
      success: '#00FF88',
      warning: '#FFB800',
      error: '#FF4444'
    }
  },
  sunrise: {
    name: 'Sunrise',
    emoji: '🌅',
    colors: {
      background: '#1A0F0A',
      surface: '#251510',
      surfaceHover: '#2F1D16',
      border: 'rgba(255,150,100,0.15)',
      text: '#FFF5F0',
      textMuted: 'rgba(255,245,240,0.6)',
      accent: '#FF6B35',
      accentHover: '#FF8555',
      success: '#7ED957',
      warning: '#FFB800',
      error: '#FF4444'
    }
  },
  forest: {
    name: 'Forest',
    emoji: '🌲',
    colors: {
      background: '#0A1410',
      surface: '#0F1F18',
      surfaceHover: '#142920',
      border: 'rgba(100,200,150,0.15)',
      text: '#E8FFF0',
      textMuted: 'rgba(232,255,240,0.6)',
      accent: '#00D68F',
      accentHover: '#00E8A0',
      success: '#00FF88',
      warning: '#FFD93D',
      error: '#FF6B6B'
    }
  },
  ocean: {
    name: 'Ocean',
    emoji: '🌊',
    colors: {
      background: '#0A0F14',
      surface: '#0F1820',
      surfaceHover: '#142230',
      border: 'rgba(100,180,255,0.15)',
      text: '#E8F4FF',
      textMuted: 'rgba(232,244,255,0.6)',
      accent: '#00B4D8',
      accentHover: '#00C8F0',
      success: '#4ECCA3',
      warning: '#FFB800',
      error: '#FF6B6B'
    }
  },
  neon: {
    name: 'Neon',
    emoji: '💜',
    colors: {
      background: '#0D0015',
      surface: '#150020',
      surfaceHover: '#1F002D',
      border: 'rgba(200,100,255,0.2)',
      text: '#F8E8FF',
      textMuted: 'rgba(248,232,255,0.6)',
      accent: '#FF00FF',
      accentHover: '#FF44FF',
      success: '#00FF88',
      warning: '#FFFF00',
      error: '#FF0055'
    }
  }
};

// ============================================================================
// DENSITY CONFIGURATIONS
// ============================================================================

export const DENSITY_CONFIG: Record<Density, { padding: string; gap: string; borderRadius: string }> = {
  compact: {
    padding: '0.5rem',
    gap: '0.25rem',
    borderRadius: '0.5rem'
  },
  normal: {
    padding: '0.75rem',
    gap: '0.5rem',
    borderRadius: '0.75rem'
  },
  comfortable: {
    padding: '1rem',
    gap: '0.75rem',
    borderRadius: '1rem'
  }
};

// ============================================================================
// GLASS BLUR CONFIGURATIONS
// ============================================================================

export const GLASS_BLUR_CONFIG: Record<GlassBlur, string> = {
  none: 'blur(0px)',
  light: 'blur(8px)',
  heavy: 'blur(20px)'
};

// ============================================================================
// DEFAULT THEME
// ============================================================================

const DEFAULT_THEME: ThemeConfig = {
  preset: 'midnight',
  density: 'normal',
  fontScale: 1,
  glassBlur: 'light',
  accentColor: '#6D00FF',
  colors: THEME_PRESETS.midnight.colors
};

// ============================================================================
// STORAGE KEY
// ============================================================================

const STORAGE_KEY = 'ngx-studio-theme';

// ============================================================================
// CONTEXT
// ============================================================================

interface ThemeContextValue {
  theme: ThemeConfig;
  setPreset: (preset: ThemePreset) => void;
  setDensity: (density: Density) => void;
  setFontScale: (scale: number) => void;
  setGlassBlur: (blur: GlassBlur) => void;
  setAccentColor: (color: string) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    // Load from localStorage on init
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Ensure colors are populated from preset
          return {
            ...DEFAULT_THEME,
            ...parsed,
            colors: THEME_PRESETS[parsed.preset as ThemePreset]?.colors || DEFAULT_THEME.colors
          };
        } catch {
          return DEFAULT_THEME;
        }
      }
    }
    return DEFAULT_THEME;
  });

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  }, [theme]);

  // Apply CSS variables to document
  useEffect(() => {
    const root = document.documentElement;
    const { colors, density, fontScale, glassBlur } = theme;
    const densityConfig = DENSITY_CONFIG[density];

    // Colors
    root.style.setProperty('--theme-bg', colors.background);
    root.style.setProperty('--theme-surface', colors.surface);
    root.style.setProperty('--theme-surface-hover', colors.surfaceHover);
    root.style.setProperty('--theme-border', colors.border);
    root.style.setProperty('--theme-text', colors.text);
    root.style.setProperty('--theme-text-muted', colors.textMuted);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-accent-hover', colors.accentHover);
    root.style.setProperty('--theme-success', colors.success);
    root.style.setProperty('--theme-warning', colors.warning);
    root.style.setProperty('--theme-error', colors.error);

    // Density
    root.style.setProperty('--theme-padding', densityConfig.padding);
    root.style.setProperty('--theme-gap', densityConfig.gap);
    root.style.setProperty('--theme-radius', densityConfig.borderRadius);

    // Font scale
    root.style.setProperty('--theme-font-scale', fontScale.toString());

    // Glass blur
    root.style.setProperty('--theme-glass-blur', GLASS_BLUR_CONFIG[glassBlur]);
  }, [theme]);

  const setPreset = (preset: ThemePreset) => {
    setTheme(prev => ({
      ...prev,
      preset,
      colors: THEME_PRESETS[preset].colors,
      accentColor: THEME_PRESETS[preset].colors.accent
    }));
  };

  const setDensity = (density: Density) => {
    setTheme(prev => ({ ...prev, density }));
  };

  const setFontScale = (fontScale: number) => {
    setTheme(prev => ({ ...prev, fontScale: Math.max(0.8, Math.min(1.2, fontScale)) }));
  };

  const setGlassBlur = (glassBlur: GlassBlur) => {
    setTheme(prev => ({ ...prev, glassBlur }));
  };

  const setAccentColor = (accentColor: string) => {
    setTheme(prev => ({
      ...prev,
      accentColor,
      colors: { ...prev.colors, accent: accentColor }
    }));
  };

  const resetTheme = () => {
    setTheme(DEFAULT_THEME);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setPreset,
      setDensity,
      setFontScale,
      setGlassBlur,
      setAccentColor,
      resetTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
