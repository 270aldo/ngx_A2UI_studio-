import { WidgetPayload } from "../types";

const STORAGE_KEY = 'ngx_studio_widgets';
const MAX_HISTORY = 50;

export interface SavedWidget {
  id: string;
  name: string;
  payload: WidgetPayload;
  createdAt: string;
  updatedAt: string;
  model: string;
}

// Generar ID único
const generateId = (): string => {
  return 'saved_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Generar nombre automático basado en tipo
const generateName = (payload: WidgetPayload): string => {
  const typeName = payload.type
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const title = payload.props?.title || payload.props?.name || '';
  return title ? `${typeName}: ${title}` : typeName;
};

export const StorageService = {
  /**
   * Guardar widget en historial
   */
  saveWidget: (payload: WidgetPayload, model: string = 'gemini-3-flash', customName?: string): SavedWidget => {
    const history = StorageService.getHistory();

    const savedWidget: SavedWidget = {
      id: generateId(),
      name: customName || generateName(payload),
      payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      model
    };

    // Agregar al inicio del historial
    history.unshift(savedWidget);

    // Limitar tamaño del historial
    if (history.length > MAX_HISTORY) {
      history.pop();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return savedWidget;
  },

  /**
   * Obtener historial completo
   */
  getHistory: (): SavedWidget[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading storage:', error);
      return [];
    }
  },

  /**
   * Obtener widget por ID
   */
  getWidget: (id: string): SavedWidget | null => {
    const history = StorageService.getHistory();
    return history.find(w => w.id === id) || null;
  },

  /**
   * Actualizar widget existente
   */
  updateWidget: (id: string, payload: WidgetPayload, customName?: string): SavedWidget | null => {
    const history = StorageService.getHistory();
    const index = history.findIndex(w => w.id === id);

    if (index === -1) return null;

    history[index] = {
      ...history[index],
      payload,
      name: customName || generateName(payload),
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return history[index];
  },

  /**
   * Eliminar widget
   */
  deleteWidget: (id: string): boolean => {
    const history = StorageService.getHistory();
    const filtered = history.filter(w => w.id !== id);

    if (filtered.length === history.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  /**
   * Limpiar todo el historial
   */
  clearHistory: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Buscar widgets por tipo
   */
  findByType: (type: string): SavedWidget[] => {
    const history = StorageService.getHistory();
    return history.filter(w => w.payload.type === type);
  },

  /**
   * Buscar widgets por texto
   */
  search: (query: string): SavedWidget[] => {
    const history = StorageService.getHistory();
    const lowerQuery = query.toLowerCase();

    return history.filter(w =>
      w.name.toLowerCase().includes(lowerQuery) ||
      w.payload.type.toLowerCase().includes(lowerQuery) ||
      JSON.stringify(w.payload.props).toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Obtener estadísticas del historial
   */
  getStats: (): { total: number; byType: Record<string, number> } => {
    const history = StorageService.getHistory();
    const byType: Record<string, number> = {};

    history.forEach(w => {
      byType[w.payload.type] = (byType[w.payload.type] || 0) + 1;
    });

    return { total: history.length, byType };
  }
};
