import React from 'react';
import { GripVertical } from 'lucide-react';

interface DragHandleProps {
  className?: string;
  visible?: boolean;
}

/**
 * DragHandle - Visual grip icon for drag and drop
 *
 * Features:
 * - 6-dot grip pattern
 * - Only visible in edit mode
 * - Cursor change to indicate draggability
 */
export const DragHandle: React.FC<DragHandleProps> = ({
  className = '',
  visible = true,
}) => {
  if (!visible) return null;

  return (
    <div
      className={`
        flex items-center justify-center
        w-6 h-full
        cursor-grab active:cursor-grabbing
        text-white/30 hover:text-white/60
        transition-colors
        ${className}
      `}
      title="Drag to reorder"
    >
      <GripVertical size={16} />
    </div>
  );
};

interface DragWrapperProps {
  children: React.ReactNode;
  index: number;
  editMode: boolean;
  isDragging: boolean;
  isDraggedOver: boolean;
  dragHandlers: React.HTMLAttributes<HTMLDivElement>;
}

/**
 * DragWrapper - Wraps widgets with drag functionality
 *
 * Provides:
 * - Drag handle on left side
 * - Visual feedback for drag state
 * - Drop indicator line
 */
export const DragWrapper: React.FC<DragWrapperProps> = ({
  children,
  editMode,
  isDragging,
  isDraggedOver,
  dragHandlers,
}) => {
  if (!editMode) {
    return <>{children}</>;
  }

  return (
    <div
      className={`
        relative flex items-stretch
        rounded-lg transition-all duration-200
        ${isDragging ? 'opacity-50 scale-[0.98]' : ''}
        ${isDraggedOver ? 'ring-2 ring-[#6D00FF] ring-offset-2 ring-offset-[#0A0A0A]' : ''}
      `}
      {...dragHandlers}
    >
      {/* Drag Handle */}
      <div className="flex-shrink-0 bg-white/5 rounded-l-lg border-r border-white/10 hover:bg-white/10 transition-colors">
        <DragHandle visible={editMode} />
      </div>

      {/* Widget Content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>

      {/* Drop Indicator */}
      {isDraggedOver && (
        <div className="absolute -top-1 left-0 right-0 h-0.5 bg-[#6D00FF] rounded-full animate-pulse" />
      )}
    </div>
  );
};

/**
 * EditModeIndicator - Shows current edit mode status
 */
interface EditModeIndicatorProps {
  isEditMode: boolean;
}

export const EditModeIndicator: React.FC<EditModeIndicatorProps> = ({ isEditMode }) => {
  if (!isEditMode) return null;

  return (
    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-[#6D00FF]/20 text-[#6D00FF] px-2 py-1 rounded-full text-[10px] font-bold uppercase">
      <span className="w-1.5 h-1.5 bg-[#6D00FF] rounded-full animate-pulse" />
      Edit Mode
    </div>
  );
};

export default DragHandle;
