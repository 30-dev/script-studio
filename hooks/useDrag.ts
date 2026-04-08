// FILE: hooks/useDrag.ts
import { useState, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

export const useDrag = (initialPosition: Position, onDragEnd: (pos: Position) => void) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    e.stopPropagation();
  }, [position]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const newPos = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    };
    setPosition(newPos);
  }, [isDragging, dragOffset]);

  const onMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd(position);
    }
  }, [isDragging, position, onDragEnd]);

  return {
    position,
    isDragging,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
};
