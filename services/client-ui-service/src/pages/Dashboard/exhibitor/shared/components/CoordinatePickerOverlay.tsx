import React from 'react';

interface Point {
  x: number;
  y: number;
}

interface PolygonData {
  id: string;
  points: Point[];
  name: string;
  type: string;
  completed: boolean;
}

interface CoordinatePickerOverlayProps {
  currentPoints: Point[];
  polygons: PolygonData[];
  selectedPolygonId: string | null;
  isPickerActive: boolean;
  getPointsString: (points: Point[]) => string;
}

const CoordinatePickerOverlay: React.FC<CoordinatePickerOverlayProps> = ({
  currentPoints,
  polygons,
  selectedPolygonId,
  isPickerActive,
  getPointsString
}) => {
  return (
    <>
      {/* Existing completed polygons */}
      {polygons.map((polygon) => {
        const isSelected = selectedPolygonId === polygon.id;
        return (
          <g key={polygon.id}>
            <polygon
              points={getPointsString(polygon.points)}
              className={`transition-all ${
                isSelected
                  ? 'fill-blue-300 fill-opacity-40 stroke-blue-600'
                  : 'fill-green-300 fill-opacity-30 stroke-green-600'
              }`}
              strokeWidth={isSelected ? '3' : '2'}
              strokeDasharray={isSelected ? '5,5' : '0'}
            />
            
            {/* Show points for selected polygon */}
            {isSelected && polygon.points.map((point, index) => (
              <g key={`${polygon.id}-point-${index}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="8"
                  className="fill-blue-600 stroke-white"
                  strokeWidth="2"
                />
                <text
                  x={point.x}
                  y={point.y}
                  className="text-xs font-bold fill-white pointer-events-none"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {index + 1}
                </text>
              </g>
            ))}
          </g>
        );
      })}

      {/* Current polygon being drawn */}
      {isPickerActive && currentPoints.length > 0 && (
        <g>
          {/* Lines connecting points */}
          {currentPoints.length > 1 && (
            <polyline
              points={getPointsString(currentPoints)}
              className="fill-none stroke-red-500"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
          
          {/* Closing line preview */}
          {currentPoints.length > 2 && (
            <line
              x1={currentPoints[currentPoints.length - 1].x}
              y1={currentPoints[currentPoints.length - 1].y}
              x2={currentPoints[0].x}
              y2={currentPoints[0].y}
              className="stroke-red-300"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
          
          {/* Points */}
          {currentPoints.map((point, index) => (
            <g key={`current-point-${index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                className="fill-red-500 stroke-white animate-pulse"
                strokeWidth="2"
              />
              <text
                x={point.x}
                y={point.y}
                className="text-xs font-bold fill-white pointer-events-none"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {index + 1}
              </text>
            </g>
          ))}
        </g>
      )}
    </>
  );
};

export default CoordinatePickerOverlay;