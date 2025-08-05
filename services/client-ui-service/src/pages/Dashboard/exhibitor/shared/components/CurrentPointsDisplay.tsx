import React from 'react';

interface Point {
  x: number;
  y: number;
}

interface CurrentPointsDisplayProps {
  points: Point[];
  isActive: boolean;
  onCopyCoordinates: (coordinates: string) => void;
  getPolygonString: (points: Point[]) => string;
}

const CurrentPointsDisplay: React.FC<CurrentPointsDisplayProps> = ({
  points,
  isActive,
  onCopyCoordinates,
  getPolygonString
}) => {
  if (!isActive || points.length === 0) {
    return null;
  }

  const coordString = getPolygonString(points);

  return (
    <div className="fixed bottom-5 left-5 bg-white bg-opacity-95 border-2 border-gray-800 rounded-lg p-4 z-50 shadow-lg max-w-md">
      <h3 className="text-lg font-semibold mb-3">📍 Current Points</h3>
      
      <div className="space-y-2">
        <div className="max-h-32 overflow-y-auto">
          {points.map((point, index) => (
            <div key={index} className="flex items-center text-sm">
              <span className="font-bold text-red-500 mr-2">{index + 1}.</span>
              <span className="font-mono">X: {point.x}, Y: {point.y}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-2">
          <p className="text-xs text-gray-600 mb-2">Coordinates string:</p>
          <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
            {coordString}
          </div>
          
          <button
            onClick={() => onCopyCoordinates(coordString)}
            className="mt-2 w-full px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition-all"
          >
            📋 Copy Current Coordinates
          </button>
        </div>
        
        {points.length < 3 && (
          <p className="text-xs text-yellow-600 text-center">
            Need at least {3 - points.length} more point{3 - points.length > 1 ? 's' : ''} to create a polygon
          </p>
        )}
      </div>
    </div>
  );
};

export default CurrentPointsDisplay;