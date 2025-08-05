import React, { useState, useRef, useEffect } from 'react';

interface BoothTooltipProps {
  show: boolean;
  content: string;
  position: { x: number; y: number };
  type?: 'info' | 'warning' | 'error' | 'success';
}

const BoothTooltip: React.FC<BoothTooltipProps> = ({ 
  show, 
  content, 
  position,
  type = 'info' 
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  // Adjust position to ensure tooltip stays within viewport
  useEffect(() => {
    if (show && tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const padding = 10;
      let newX = position.x;
      let newY = position.y;

      // Check right edge
      if (rect.right > window.innerWidth - padding) {
        newX = position.x - rect.width - 20;
      }

      // Check bottom edge
      if (rect.bottom > window.innerHeight - padding) {
        newY = position.y - rect.height - 20;
      }

      // Check left edge
      if (newX < padding) {
        newX = padding;
      }

      // Check top edge
      if (newY < padding) {
        newY = position.y + 30;
      }

      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [position, show]);

  if (!show || !content) return null;

  const getTooltipStyles = () => {
    const baseClasses = "absolute z-50 px-3 py-2 text-sm rounded-lg shadow-lg pointer-events-none transition-opacity duration-200";
    
    switch (type) {
      case 'error':
        return `${baseClasses} bg-red-600 text-white`;
      case 'warning':
        return `${baseClasses} bg-amber-500 text-white`;
      case 'success':
        return `${baseClasses} bg-green-600 text-white`;
      default:
        return `${baseClasses} bg-gray-800 text-white`;
    }
  };

  return (
    <div
      ref={tooltipRef}
      className={getTooltipStyles()}
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        opacity: show ? 1 : 0,
        maxWidth: '250px',
      }}
    >
      {content}
      <div 
        className="absolute w-2 h-2 bg-inherit transform rotate-45"
        style={{
          top: '-4px',
          left: '20px',
        }}
      />
    </div>
  );
};

export default BoothTooltip;