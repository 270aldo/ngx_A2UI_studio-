import { z } from 'zod';
import { widgetSchemaMap } from './widgetSchemas';

// Widget payload schema (single widget)
export const WidgetPayloadSchema = z.object({
  type: z.string().min(1, 'Widget type is required'),
  props: z.record(z.any()),
  thought: z.string().optional()
});

// Simple layout schema (non-recursive to avoid z.lazy issues)
export const SimpleLayoutSchema = z.object({
  type: z.enum(['stack', 'grid', 'single']),
  direction: z.enum(['vertical', 'horizontal']).optional(),
  gap: z.number().min(0).optional(),
  columns: z.number().min(1).max(12).optional(),
  widgets: z.array(z.any()) // We'll validate widgets manually
});

// Validation result interface
export interface ValidationError {
  path: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

/**
 * Validates a JSON payload against widget and layout schemas
 */
export const validatePayload = (payload: unknown): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  // First, check if it's valid JSON structure
  if (payload === null || payload === undefined) {
    return {
      valid: false,
      errors: [{ path: 'root', message: 'Payload cannot be null or undefined', code: 'INVALID_PAYLOAD' }],
      warnings: []
    };
  }

  if (typeof payload !== 'object') {
    return {
      valid: false,
      errors: [{ path: 'root', message: 'Payload must be an object', code: 'INVALID_TYPE' }],
      warnings: []
    };
  }

  const obj = payload as Record<string, unknown>;

  // Check if it's a layout or single widget
  const isLayout = 'widgets' in obj && Array.isArray(obj.widgets);

  if (isLayout) {
    // Validate layout structure
    const layoutResult = SimpleLayoutSchema.safeParse(payload);
    if (!layoutResult.success) {
      layoutResult.error.errors.forEach(err => {
        errors.push({
          path: err.path.join('.') || 'root',
          message: err.message,
          code: err.code
        });
      });
    }

    // Validate each widget in the layout
    const validateWidgets = (widgets: any[], parentPath: string) => {
      widgets.forEach((widget, index) => {
        const widgetPath = `${parentPath}[${index}]`;

        if (widget && typeof widget === 'object') {
          if ('widgets' in widget && Array.isArray(widget.widgets)) {
            // Nested layout - validate structure
            const nestedLayoutResult = SimpleLayoutSchema.safeParse(widget);
            if (!nestedLayoutResult.success) {
              nestedLayoutResult.error.errors.forEach(err => {
                errors.push({
                  path: `${widgetPath}.${err.path.join('.')}` || widgetPath,
                  message: err.message,
                  code: err.code
                });
              });
            }
            validateWidgets(widget.widgets, `${widgetPath}.widgets`);
          } else {
            // Single widget
            validateSingleWidget(widget, widgetPath, errors, warnings);
          }
        } else {
          errors.push({
            path: widgetPath,
            message: 'Widget must be an object',
            code: 'INVALID_WIDGET'
          });
        }
      });
    };

    if (Array.isArray(obj.widgets)) {
      validateWidgets(obj.widgets, 'widgets');
    }
  } else {
    // Validate single widget structure
    const widgetResult = WidgetPayloadSchema.safeParse(payload);
    if (!widgetResult.success) {
      widgetResult.error.errors.forEach(err => {
        errors.push({
          path: err.path.join('.') || 'root',
          message: err.message,
          code: err.code
        });
      });
    } else {
      validateSingleWidget(obj, 'root', errors, warnings);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validates a single widget's props against its specific schema
 */
const validateSingleWidget = (
  widget: Record<string, unknown>,
  path: string,
  errors: ValidationError[],
  warnings: string[]
) => {
  const widgetType = widget.type as string;
  const props = widget.props as Record<string, unknown>;

  // Check if widget type exists
  if (!widgetType) {
    errors.push({
      path: `${path}.type`,
      message: 'Widget type is required',
      code: 'MISSING_TYPE'
    });
    return;
  }

  // Check if we have a schema for this widget type
  const schema = widgetSchemaMap[widgetType];

  if (!schema) {
    warnings.push(`Unknown widget type: "${widgetType}" at ${path}. No validation available.`);
    return;
  }

  // Validate props against widget-specific schema
  if (!props) {
    errors.push({
      path: `${path}.props`,
      message: `Props are required for widget type "${widgetType}"`,
      code: 'MISSING_PROPS'
    });
    return;
  }

  const propsResult = schema.safeParse(props);
  if (!propsResult.success) {
    propsResult.error.errors.forEach(err => {
      errors.push({
        path: `${path}.props.${err.path.join('.')}`,
        message: err.message,
        code: err.code
      });
    });
  }
};

/**
 * Parses and validates JSON string
 */
export const parseAndValidate = (jsonString: string): {
  parsed: unknown | null;
  parseError: string | null;
  validation: ValidationResult | null;
} => {
  // Try to parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    const error = e as SyntaxError;
    // Extract line number from error message if possible
    const match = error.message.match(/position (\d+)/);
    const position = match ? parseInt(match[1]) : null;

    let lineInfo = '';
    if (position !== null) {
      const lines = jsonString.substring(0, position).split('\n');
      lineInfo = ` (line ${lines.length})`;
    }

    return {
      parsed: null,
      parseError: `JSON Parse Error${lineInfo}: ${error.message}`,
      validation: null
    };
  }

  // Validate the parsed JSON
  const validation = validatePayload(parsed);

  return {
    parsed,
    parseError: null,
    validation
  };
};

export default {
  WidgetPayloadSchema,
  SimpleLayoutSchema,
  validatePayload,
  parseAndValidate
};
