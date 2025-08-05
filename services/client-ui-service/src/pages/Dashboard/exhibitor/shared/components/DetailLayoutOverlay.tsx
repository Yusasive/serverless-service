interface GridSettings {
  enabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

interface Point {
  x: number;
  y: number;
}

interface BoothCoordinate {
  id: string;
  boothId: string;
  points: Point[];
  size: string;
  category: 'Standard' | 'Premium';
  price: number;
  sqm: number;
  hallName: string;
  completed: boolean;
}

const DetailLayoutOverlay: React.FC<{
  currentPoints: Point[];
  booths: BoothCoordinate[];
  selectedBoothId: string | null;
  isPickerActive: boolean;
  drawMode: 'polygon' | 'rectangle';
  gridSettings: GridSettings;
  getPointsString: (points: Point[]) => string;
  viewBoxWidth: number;
  viewBoxHeight: number;
}> = ({
  currentPoints,
  booths,
  selectedBoothId,
  isPickerActive,
  drawMode,
  gridSettings,
  getPointsString,
  viewBoxWidth,
  viewBoxHeight
}) => {
  // Generate grid lines
  const gridLines = [];
  if (gridSettings.enabled) {
    // Vertical lines
    for (let x = 0; x <= viewBoxWidth; x += gridSettings.gridSize) {
      gridLines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={viewBoxHeight}
          className="stroke-gray-300"
          strokeWidth="1"
          opacity="0.2"
        />
      );
    }
    // Horizontal lines
    for (let y = 0; y <= viewBoxHeight; y += gridSettings.gridSize) {
      gridLines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={viewBoxWidth}
          y2={y}
          className="stroke-gray-300"
          strokeWidth="1"
          opacity="0.2"
        />
      );
    }
  }

  return (
    <>
      {/* Grid */}
      {gridSettings.enabled && (
        <g className="pointer-events-none">
          {gridLines}
        </g>
      )}

      {/* Existing booths */}
      {booths.map((booth) => {
        const isSelected = selectedBoothId === booth.id;
        const fillColor = booth.category === 'Premium' 
          ? 'fill-purple-300' 
          : 'fill-blue-300';
        
        return (
          <g key={booth.id}>
            <polygon
              points={getPointsString(booth.points)}
              className={`transition-all cursor-pointer ${
                isSelected
                  ? `${fillColor} fill-opacity-60 stroke-blue-600`
                  : `${fillColor} fill-opacity-40 stroke-gray-600`
              }`}
              strokeWidth={isSelected ? '3' : '2'}
              strokeDasharray={isSelected ? '5,5' : '0'}
            />
            
            {/* Booth label */}
            {booth.points.length > 0 && (
              <text
                x={booth.points.reduce((sum, p) => sum + p.x, 0) / booth.points.length}
                y={booth.points.reduce((sum, p) => sum + p.y, 0) / booth.points.length}
                className="text-sm font-bold fill-gray-800 pointer-events-none"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {booth.boothId}
              </text>
            )}
            
            {/* Show size for selected booth */}
            {isSelected && (
              <text
                x={booth.points.reduce((sum, p) => sum + p.x, 0) / booth.points.length}
                y={booth.points.reduce((sum, p) => sum + p.y, 0) / booth.points.length + 20}
                className="text-xs fill-gray-600 pointer-events-none"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {booth.size} ({booth.sqm}m²)
              </text>
            )}
          </g>
        );
      })}

      {/* Current drawing */}
      {isPickerActive && currentPoints.length > 0 && (
        <g>
          {/* Preview rectangle if in rectangle mode with 1 point */}
          {drawMode === 'rectangle' && currentPoints.length === 1 && (
            <rect
              x={Math.min(currentPoints[0].x, currentPoints[0].x)}
              y={Math.min(currentPoints[0].y, currentPoints[0].y)}
              width={0}
              height={0}
              className="fill-none stroke-red-500"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.5"
            />
          )}
          
          {/* Lines for polygon mode or completed rectangle */}
          {(drawMode === 'polygon' || currentPoints.length > 1) && (
            <>
              {currentPoints.length > 1 && (
                <polyline
                  points={getPointsString(currentPoints)}
                  className="fill-none stroke-red-500"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              )}
              
              {/* Closing line for polygon */}
              {drawMode === 'polygon' && currentPoints.length > 2 && (
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
              
              {/* Preview of completed rectangle */}
              {drawMode === 'rectangle' && currentPoints.length === 4 && (
                <polygon
                  points={getPointsString(currentPoints)}
                  className="fill-red-200 fill-opacity-30 stroke-red-500"
                  strokeWidth="2"
                />
              )}
            </>
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

export default DetailLayoutOverlay;