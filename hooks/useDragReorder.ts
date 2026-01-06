import { useState, useCallback, DragEvent } from 'react';

/**
 * useDragReorder - Hook for reordering items via HTML5 Drag and Drop API
 *
 * Features:
 * - No external dependencies (native HTML5 DnD)
 * - Touch support via drag handles
 * - Visual feedback during drag
 * - Smooth reorder with array manipulation
 *
 * @param items - Array of items to reorder
 * @param onReorder - Callback when items are reordered
 */
export const useDragReorder = <T>(
  items: T[],
  onReorder: (newItems: T[]) => void
) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Called when drag starts
  const handleDragStart = useCallback((index: number) => (e: DragEvent) => {
    setDraggedIndex(index);

    // Set drag data (required for Firefox)
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());

    // Add a slight delay to allow the drag image to be set
    requestAnimationFrame(() => {
      const target = e.target as HTMLElement;
      target.style.opacity = '0.5';
    });
  }, []);

  // Called when dragging over a valid drop target
  const handleDragOver = useCallback((index: number) => (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  }, [draggedIndex]);

  // Called when entering a drop zone
  const handleDragEnter = useCallback((index: number) => (e: DragEvent) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  }, [draggedIndex]);

  // Called when leaving a drop zone
  const handleDragLeave = useCallback((_index: number) => (e: DragEvent) => {
    e.preventDefault();
    // Only clear if we're leaving the container entirely
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDragOverIndex(null);
    }
  }, []);

  // Called when drag ends (whether successful or not)
  const handleDragEnd = useCallback((e: DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.opacity = '1';

    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  // Called when item is dropped
  const handleDrop = useCallback((targetIndex: number) => (e: DragEvent) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Reorder the items
    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    onReorder(newItems);

    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [draggedIndex, items, onReorder]);

  // Get drag handlers for a specific index
  const getDragHandlers = useCallback((index: number) => ({
    draggable: true,
    onDragStart: handleDragStart(index),
    onDragOver: handleDragOver(index),
    onDragEnter: handleDragEnter(index),
    onDragLeave: handleDragLeave(index),
    onDragEnd: handleDragEnd,
    onDrop: handleDrop(index),
  }), [handleDragStart, handleDragOver, handleDragEnter, handleDragLeave, handleDragEnd, handleDrop]);

  // Check if a specific index is being dragged over
  const isDraggedOver = useCallback((index: number) => {
    return dragOverIndex === index && draggedIndex !== index;
  }, [dragOverIndex, draggedIndex]);

  // Check if a specific index is being dragged
  const isDragging = useCallback((index: number) => {
    return draggedIndex === index;
  }, [draggedIndex]);

  return {
    getDragHandlers,
    isDragging,
    isDraggedOver,
    draggedIndex,
    dragOverIndex,
    isAnyDragging: draggedIndex !== null,
  };
};

export default useDragReorder;
