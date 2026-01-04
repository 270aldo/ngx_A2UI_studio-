import { WidgetPayload, WidgetLayout, isWidgetLayout, RenderPayload } from "../types";

// Lista de tipos de widget válidos
const VALID_WIDGET_TYPES = [
  // Dashboard
  'progress-dashboard',
  'metric-card',
  'today-card',
  'insight-card',
  // Training
  'workout-card',
  'exercise-row',
  'rest-timer',
  'workout-history',
  // Nutrition
  'meal-plan',
  // Habits
  'hydration-tracker',
  'supplement-stack',
  'streak-counter',
  // Biometrics
  'heart-rate',
  'sleep-tracker',
  'body-stats',
  // Planning
  'season-timeline',
  // Tools
  'max-rep-calculator',
  'alert-banner',
  'coach-message',
  'achievement'
];

// Tipos de layout válidos
const VALID_LAYOUT_TYPES = ['stack', 'grid', 'single'];

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Valida si un string es un JSON válido
 */
export const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * Parsea JSON de forma segura
 */
export const safeParseJSON = <T>(str: string): T | null => {
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
};

/**
 * Valida un widget individual
 */
export const validateWidget = (widget: unknown): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!widget || typeof widget !== 'object') {
    errors.push('Widget debe ser un objeto');
    return { isValid: false, errors, warnings };
  }

  const w = widget as Record<string, unknown>;

  // Validar type
  if (!w.type) {
    errors.push('Widget debe tener un "type"');
  } else if (typeof w.type !== 'string') {
    errors.push('"type" debe ser un string');
  } else if (!VALID_WIDGET_TYPES.includes(w.type)) {
    warnings.push(`Tipo "${w.type}" no reconocido. Tipos validos: ${VALID_WIDGET_TYPES.join(', ')}`);
  }

  // Validar props
  if (!w.props) {
    warnings.push('Widget sin "props" - puede no renderizar correctamente');
  } else if (typeof w.props !== 'object') {
    errors.push('"props" debe ser un objeto');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Valida un layout
 */
export const validateLayout = (layout: unknown): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!layout || typeof layout !== 'object') {
    errors.push('Layout debe ser un objeto');
    return { isValid: false, errors, warnings };
  }

  const l = layout as Record<string, unknown>;

  // Validar type
  if (!l.type) {
    errors.push('Layout debe tener un "type"');
  } else if (!VALID_LAYOUT_TYPES.includes(l.type as string)) {
    errors.push(`Tipo de layout invalido. Debe ser: ${VALID_LAYOUT_TYPES.join(', ')}`);
  }

  // Validar widgets array
  if (!l.widgets) {
    errors.push('Layout debe tener un array "widgets"');
  } else if (!Array.isArray(l.widgets)) {
    errors.push('"widgets" debe ser un array');
  } else if (l.widgets.length === 0) {
    warnings.push('Layout tiene array "widgets" vacio');
  } else {
    // Validar cada widget del layout
    (l.widgets as unknown[]).forEach((widget, index) => {
      const widgetResult = validateWidget(widget);
      widgetResult.errors.forEach(e => errors.push(`Widget[${index}]: ${e}`));
      widgetResult.warnings.forEach(w => warnings.push(`Widget[${index}]: ${w}`));
    });
  }

  // Validar propiedades opcionales
  if (l.direction && !['vertical', 'horizontal'].includes(l.direction as string)) {
    warnings.push('"direction" debe ser "vertical" o "horizontal"');
  }

  if (l.gap !== undefined && (typeof l.gap !== 'number' || l.gap < 0)) {
    warnings.push('"gap" debe ser un numero positivo');
  }

  if (l.columns !== undefined && (typeof l.columns !== 'number' || l.columns < 1)) {
    warnings.push('"columns" debe ser un numero mayor a 0');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Valida un payload completo (widget o layout)
 */
export const validatePayload = (payload: unknown): ValidationResult => {
  if (!payload || typeof payload !== 'object') {
    return {
      isValid: false,
      errors: ['Payload debe ser un objeto valido'],
      warnings: []
    };
  }

  const p = payload as Record<string, unknown>;

  // Detectar si es layout o widget
  if ('widgets' in p && Array.isArray(p.widgets)) {
    return validateLayout(payload);
  }

  return validateWidget(payload);
};

/**
 * Valida un string JSON y retorna el resultado
 */
export const validateJSONString = (jsonString: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!jsonString.trim()) {
    return {
      isValid: false,
      errors: ['JSON vacio'],
      warnings: []
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    return {
      isValid: false,
      errors: [`JSON invalido: ${e instanceof Error ? e.message : 'Error de sintaxis'}`],
      warnings: []
    };
  }

  return validatePayload(parsed);
};

/**
 * Obtiene los tipos de widget disponibles
 */
export const getValidWidgetTypes = (): string[] => [...VALID_WIDGET_TYPES];

/**
 * Obtiene los tipos de layout disponibles
 */
export const getValidLayoutTypes = (): string[] => [...VALID_LAYOUT_TYPES];
