import { WidgetTheme, WidgetVariant } from '../types';

/**
 * Theme color definitions for widgets
 */
export interface ThemeColors {
  background: string;
  backgroundHover: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentMuted: string;
}

/**
 * Get theme colors based on theme name
 */
export const getThemeColors = (theme: WidgetTheme = 'dark'): ThemeColors => {
  const themes: Record<WidgetTheme, ThemeColors> = {
    dark: {
      background: 'rgba(255, 255, 255, 0.03)',
      backgroundHover: 'rgba(255, 255, 255, 0.08)',
      border: 'rgba(255, 255, 255, 0.1)',
      text: '#FFFFFF',
      textMuted: 'rgba(255, 255, 255, 0.5)',
      accent: '#6D00FF',
      accentMuted: 'rgba(109, 0, 255, 0.2)',
    },
    light: {
      background: 'rgba(255, 255, 255, 0.95)',
      backgroundHover: 'rgba(255, 255, 255, 1)',
      border: 'rgba(0, 0, 0, 0.1)',
      text: '#1A1A1A',
      textMuted: 'rgba(0, 0, 0, 0.5)',
      accent: '#6D00FF',
      accentMuted: 'rgba(109, 0, 255, 0.1)',
    },
    genesis: {
      background: 'rgba(109, 0, 255, 0.05)',
      backgroundHover: 'rgba(109, 0, 255, 0.1)',
      border: 'rgba(109, 0, 255, 0.2)',
      text: '#FFFFFF',
      textMuted: 'rgba(255, 255, 255, 0.6)',
      accent: '#6D00FF',
      accentMuted: 'rgba(109, 0, 255, 0.3)',
    },
    blaze: {
      background: 'rgba(255, 69, 0, 0.05)',
      backgroundHover: 'rgba(255, 69, 0, 0.1)',
      border: 'rgba(255, 69, 0, 0.2)',
      text: '#FFFFFF',
      textMuted: 'rgba(255, 255, 255, 0.6)',
      accent: '#FF4500',
      accentMuted: 'rgba(255, 69, 0, 0.3)',
    },
    wave: {
      background: 'rgba(0, 212, 255, 0.05)',
      backgroundHover: 'rgba(0, 212, 255, 0.1)',
      border: 'rgba(0, 212, 255, 0.2)',
      text: '#FFFFFF',
      textMuted: 'rgba(255, 255, 255, 0.6)',
      accent: '#00D4FF',
      accentMuted: 'rgba(0, 212, 255, 0.3)',
    },
    nova: {
      background: 'rgba(217, 70, 239, 0.05)',
      backgroundHover: 'rgba(217, 70, 239, 0.1)',
      border: 'rgba(217, 70, 239, 0.2)',
      text: '#FFFFFF',
      textMuted: 'rgba(255, 255, 255, 0.6)',
      accent: '#D946EF',
      accentMuted: 'rgba(217, 70, 239, 0.3)',
    },
    atlas: {
      background: 'rgba(236, 72, 153, 0.05)',
      backgroundHover: 'rgba(236, 72, 153, 0.1)',
      border: 'rgba(236, 72, 153, 0.2)',
      text: '#FFFFFF',
      textMuted: 'rgba(255, 255, 255, 0.6)',
      accent: '#EC4899',
      accentMuted: 'rgba(236, 72, 153, 0.3)',
    },
  };

  return themes[theme] || themes.dark;
};

/**
 * Get variant-specific styles
 */
export interface VariantStyles {
  padding: string;
  fontSize: string;
  iconSize: number;
  showDetails: boolean;
  showSecondary: boolean;
}

export const getVariantStyles = (variant: WidgetVariant = 'detailed'): VariantStyles => {
  const variants: Record<WidgetVariant, VariantStyles> = {
    compact: {
      padding: 'p-3',
      fontSize: 'text-xs',
      iconSize: 14,
      showDetails: false,
      showSecondary: false,
    },
    detailed: {
      padding: 'p-4',
      fontSize: 'text-sm',
      iconSize: 18,
      showDetails: true,
      showSecondary: true,
    },
    minimal: {
      padding: 'p-2',
      fontSize: 'text-xs',
      iconSize: 12,
      showDetails: false,
      showSecondary: false,
    },
  };

  return variants[variant] || variants.detailed;
};

/**
 * Get combined theme and variant classes for a widget
 */
export const getWidgetClasses = (
  theme: WidgetTheme = 'dark',
  variant: WidgetVariant = 'detailed'
): string => {
  const variantStyles = getVariantStyles(variant);
  return `${variantStyles.padding} ${variantStyles.fontSize}`;
};

/**
 * Utility to generate gradient backgrounds based on theme
 */
export const getGradientBackground = (theme: WidgetTheme = 'dark'): string => {
  const gradients: Record<WidgetTheme, string> = {
    dark: 'bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]',
    light: 'bg-gradient-to-br from-white to-gray-50',
    genesis: 'bg-gradient-to-br from-[#6D00FF]/10 to-[#A855F7]/10',
    blaze: 'bg-gradient-to-br from-[#FF4500]/10 to-[#FFB800]/10',
    wave: 'bg-gradient-to-br from-[#00D4FF]/10 to-[#00FF88]/10',
    nova: 'bg-gradient-to-br from-[#D946EF]/10 to-[#EC4899]/10',
    atlas: 'bg-gradient-to-br from-[#EC4899]/10 to-[#F472B6]/10',
  };

  return gradients[theme] || gradients.dark;
};

export default {
  getThemeColors,
  getVariantStyles,
  getWidgetClasses,
  getGradientBackground,
};
