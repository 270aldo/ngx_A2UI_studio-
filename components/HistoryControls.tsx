import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';

interface HistoryControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historyLength?: number;
  futureLength?: number;
  showCount?: boolean;
}

/**
 * HistoryControls - Undo/Redo buttons with visual feedback
 *
 * Features:
 * - Disabled state when undo/redo not available
 * - Optional history count indicator
 * - Keyboard shortcut hints in tooltips
 */
export const HistoryControls: React.FC<HistoryControlsProps> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  historyLength = 0,
  futureLength = 0,
  showCount = false,
}) => {
  return (
    <div className="flex items-center gap-1">
      {/* Undo Button */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`
          relative p-1.5 rounded-md transition-all
          ${canUndo
            ? 'text-white/70 hover:text-white hover:bg-white/10'
            : 'text-white/20 cursor-not-allowed'
          }
        `}
        title={`Undo (${navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Z)`}
      >
        <Undo2 size={16} />
        {showCount && historyLength > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#6D00FF] text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center">
            {historyLength}
          </span>
        )}
      </button>

      {/* Redo Button */}
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`
          relative p-1.5 rounded-md transition-all
          ${canRedo
            ? 'text-white/70 hover:text-white hover:bg-white/10'
            : 'text-white/20 cursor-not-allowed'
          }
        `}
        title={`Redo (${navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Y)`}
      >
        <Redo2 size={16} />
        {showCount && futureLength > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#6D00FF] text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center">
            {futureLength}
          </span>
        )}
      </button>
    </div>
  );
};

/**
 * HistoryIndicator - Shows current position in history stack
 * Useful for more advanced UIs that want to show history depth
 */
interface HistoryIndicatorProps {
  historyLength: number;
  futureLength: number;
  maxHistory?: number;
}

export const HistoryIndicator: React.FC<HistoryIndicatorProps> = ({
  historyLength,
  futureLength,
  maxHistory = 50,
}) => {
  const total = historyLength + futureLength + 1;
  const current = historyLength + 1;

  return (
    <div className="flex items-center gap-2 text-[10px] text-white/40">
      <div className="flex items-center gap-1">
        <span>History:</span>
        <span className="text-white/60 font-mono">{current}/{total}</span>
      </div>

      {/* Progress bar */}
      <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#6D00FF] transition-all"
          style={{ width: `${(historyLength / maxHistory) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default HistoryControls;
