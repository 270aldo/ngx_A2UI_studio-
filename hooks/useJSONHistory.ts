import { useReducer, useCallback, useEffect, useRef } from 'react';

// Maximum number of history entries to keep
const MAX_HISTORY_SIZE = 50;

// Debounce delay in milliseconds to avoid saving every keystroke
const DEBOUNCE_DELAY = 300;

// History state structure
interface HistoryState {
  past: string[];
  present: string;
  future: string[];
}

// Action types
type HistoryAction =
  | { type: 'SET'; payload: string; saveToHistory: boolean }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR_HISTORY' };

// Reducer function
const historyReducer = (state: HistoryState, action: HistoryAction): HistoryState => {
  switch (action.type) {
    case 'SET': {
      // If the new value is the same as current, no change
      if (action.payload === state.present) {
        return state;
      }

      // If we shouldn't save to history (intermediate typing), just update present
      if (!action.saveToHistory) {
        return {
          ...state,
          present: action.payload,
        };
      }

      // Save to history with limit
      const newPast = [...state.past, state.present].slice(-MAX_HISTORY_SIZE);

      return {
        past: newPast,
        present: action.payload,
        future: [], // Clear future when new change is made
      };
    }

    case 'UNDO': {
      if (state.past.length === 0) {
        return state;
      }

      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };
    }

    case 'REDO': {
      if (state.future.length === 0) {
        return state;
      }

      const next = state.future[0];
      const newFuture = state.future.slice(1);

      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      };
    }

    case 'CLEAR_HISTORY': {
      return {
        past: [],
        present: state.present,
        future: [],
      };
    }

    default:
      return state;
  }
};

// Hook return type
interface UseJSONHistoryReturn {
  json: string;
  setJSON: (value: string) => void;
  setJSONImmediate: (value: string) => void; // For template loading - saves to history immediately
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
  historyLength: number;
  futureLength: number;
}

/**
 * useJSONHistory - A custom hook for managing JSON editor state with undo/redo
 *
 * Features:
 * - Undo/Redo support with keyboard shortcuts
 * - Debounced history saving (won't save every keystroke)
 * - Maximum history limit to prevent memory issues
 * - Clear history function
 *
 * @param initialValue - Initial JSON string value
 * @returns Object with json state and history controls
 */
export const useJSONHistory = (initialValue: string): UseJSONHistoryReturn => {
  const [state, dispatch] = useReducer(historyReducer, {
    past: [],
    present: initialValue,
    future: [],
  });

  // Ref to track debounce timeout
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Ref to track last saved value (for debounce comparison)
  const lastSavedRef = useRef<string>(initialValue);

  // Set JSON with debounced history saving (for typing in textarea)
  const setJSON = useCallback((value: string) => {
    // Clear existing debounce timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Immediately update present value (for responsive UI)
    dispatch({ type: 'SET', payload: value, saveToHistory: false });

    // Debounce the history save
    debounceRef.current = setTimeout(() => {
      // Only save to history if value is different from last saved
      if (value !== lastSavedRef.current) {
        dispatch({ type: 'SET', payload: value, saveToHistory: true });
        lastSavedRef.current = value;
      }
    }, DEBOUNCE_DELAY);
  }, []);

  // Set JSON immediately without debounce (for template loading, AI generation, etc.)
  const setJSONImmediate = useCallback((value: string) => {
    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Save to history immediately
    if (value !== lastSavedRef.current) {
      dispatch({ type: 'SET', payload: value, saveToHistory: true });
      lastSavedRef.current = value;
    }
  }, []);

  // Undo action
  const undo = useCallback(() => {
    // Clear any pending debounce to avoid conflicts
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    dispatch({ type: 'UNDO' });
    // Update last saved ref to prevent re-saving on next change
    lastSavedRef.current = state.past[state.past.length - 1] || state.present;
  }, [state.past, state.present]);

  // Redo action
  const redo = useCallback(() => {
    // Clear any pending debounce to avoid conflicts
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    dispatch({ type: 'REDO' });
    // Update last saved ref
    lastSavedRef.current = state.future[0] || state.present;
  }, [state.future, state.present]);

  // Clear history
  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_HISTORY' });
    lastSavedRef.current = state.present;
  }, [state.present]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    json: state.present,
    setJSON,
    setJSONImmediate,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    clearHistory,
    historyLength: state.past.length,
    futureLength: state.future.length,
  };
};

/**
 * useKeyboardShortcuts - Hook to add keyboard shortcuts for undo/redo
 *
 * @param undo - Undo function
 * @param redo - Redo function
 * @param canUndo - Whether undo is available
 * @param canRedo - Whether redo is available
 */
export const useKeyboardShortcuts = (
  undo: () => void,
  redo: () => void,
  canUndo: boolean,
  canRedo: boolean
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl/Cmd key
      const isMod = e.ctrlKey || e.metaKey;

      if (!isMod) return;

      // Ctrl/Cmd + Z = Undo
      if (e.key === 'z' && !e.shiftKey && canUndo) {
        e.preventDefault();
        undo();
      }

      // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z = Redo
      if ((e.key === 'y' || (e.key === 'z' && e.shiftKey)) && canRedo) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);
};

export default useJSONHistory;
