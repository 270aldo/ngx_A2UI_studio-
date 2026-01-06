// Widget display variants
export type WidgetVariant = 'compact' | 'detailed' | 'minimal';

// Widget color themes
export type WidgetTheme = 'dark' | 'light' | 'genesis' | 'blaze' | 'wave' | 'nova' | 'atlas';

export interface WidgetProps {
  [key: string]: any;
  variant?: WidgetVariant;
  theme?: WidgetTheme;
}

export interface WidgetPayload {
  type: string;
  props: WidgetProps;
  thought?: string;
}

// Layouts para composición de múltiples widgets
export interface WidgetLayout {
  type: 'stack' | 'grid' | 'single';
  direction?: 'vertical' | 'horizontal';
  gap?: number;
  columns?: number;
  widgets: WidgetPayload[];
}

// Union type para el mediador
export type RenderPayload = WidgetPayload | WidgetLayout;

// Función type guard para distinguir layouts
export const isWidgetLayout = (payload: RenderPayload): payload is WidgetLayout => {
  return 'widgets' in payload && Array.isArray((payload as WidgetLayout).widgets);
};

export interface Message {
  role: 'system' | 'user' | 'assistant';
  text: string;
  thought?: string;
}

export interface TemplateItem {
  name: string;
  type: string;
  props: WidgetProps;
}

export interface TemplateCategory {
  [category: string]: TemplateItem[];
}

// Para el historial de widgets guardados
export interface SavedWidgetMeta {
  id: string;
  name: string;
  type: string;
  createdAt: string;
}