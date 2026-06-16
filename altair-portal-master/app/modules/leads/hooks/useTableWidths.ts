/**
 * @file /app/modules/leads/hooks/useTableWidths.ts
 * @purpose Custom hook to handle dynamic column resizing for the tabular leads view.
 */

import { useState } from 'react';

export function useTableWidths() {
  const [widths, setWidths] = useState({
    name: 180, phone: 120, email: 180, value: 100, lang: 70, stage: 95, quality: 110, created: 100, action: 85,
  });

  const startResize = (column: keyof typeof widths, startEvent: React.MouseEvent) => {
    startEvent.preventDefault();
    startEvent.stopPropagation();
    const startWidth = widths[column];
    const startX = startEvent.clientX;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      setWidths((prev) => ({ ...prev, [column]: Math.max(50, startWidth + deltaX) }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return { widths, startResize };
}
