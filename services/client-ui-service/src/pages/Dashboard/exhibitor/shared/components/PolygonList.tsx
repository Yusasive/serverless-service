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

interface PolygonListProps {
  polygons: PolygonData[];
  selectedPolygonId: string | null;
  onSelectPolygon: (id: string | null) => void;
  onDeletePolygon: (id: string) => void;
  onCopyCoordinates: (coordinates: string) => void;
  getPolygonString: (points: Point[]) => string;
}

const PolygonList: React.FC<PolygonListProps> = ({
  polygons,
  selectedPolygonId,
  onSelectPolygon,
  onDeletePolygon,
  onCopyCoordinates,
  getPolygonString
}) => {
  if (polygons.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 bg-white bg-opacity-95 border-2 border-gray-800 rounded-lg p-4 z-50 shadow-lg max-h-96 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-3">📐 Created Polygons</h3>
      
      <div className="space-y-2">
        {polygons.map((polygon) => {
          const coordString = getPolygonString(polygon.points);
          const isSelected = selectedPolygonId === polygon.id;
          
          return (
            <div
              key={polygon.id}
              className={`p-3 border rounded-lg transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{polygon.name}</h4>
                  <p className="text-xs text-gray-600">
                    Type: {polygon.type} | Points: {polygon.points.length}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onSelectPolygon(isSelected ? null : polygon.id)}
                    className="p-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
                    title="Select/Deselect"
                  >
                    {isSelected ? '✓' : '○'}
                  </button>
                  <button
                    onClick={() => onDeletePolygon(polygon.id)}
                    className="p-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
                {coordString}
              </div>
              
              <button
                onClick={() => onCopyCoordinates(coordString)}
                className="mt-2 w-full px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition-all"
              >
                📋 Copy Coordinates
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PolygonList;