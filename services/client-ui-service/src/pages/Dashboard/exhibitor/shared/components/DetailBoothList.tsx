import React from 'react';

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

interface DetailBoothListProps {
  booths: BoothCoordinate[];
  selectedBoothId: string | null;
  onSelectBooth: (id: string | null) => void;
  onDeleteBooth: (id: string) => void;
  ratePerSqm: number;
}

const DetailBoothList: React.FC<DetailBoothListProps> = ({
  booths,
  selectedBoothId,
  onSelectBooth,
  onDeleteBooth,
  ratePerSqm
}) => {
  if (booths.length === 0) {
    return null;
  }

  const totalSqm = booths.reduce((sum, booth) => sum + booth.sqm, 0);
  const totalPrice = totalSqm * ratePerSqm;

  const standardBooths = booths.filter(b => b.category === 'Standard');
  const premiumBooths = booths.filter(b => b.category === 'Premium');

  return (
    <div className="bg-white bg-opacity-95 border-2 border-gray-800 rounded-lg p-4 shadow-lg mt-4">
      <h3 className="text-lg font-semibold mb-3">📋 Created Booths ({booths.length})</h3>
      
      {/* Summary Stats */}
      <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="font-medium">Total Booths: {booths.length}</p>
            <p className="text-xs text-gray-600">
              Standard: {standardBooths.length} | Premium: {premiumBooths.length}
            </p>
          </div>
          <div>
            <p className="font-medium">Total Area: {totalSqm}m²</p>
            <p className="font-medium text-green-600">
              Total Value: ₦{totalPrice.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      
      {/* Booth List */}
      <div className="max-h-64 overflow-y-auto space-y-2">
        {booths.map((booth) => {
          const isSelected = selectedBoothId === booth.id;
          
          return (
            <div
              key={booth.id}
              className={`p-2 border rounded transition-all text-sm ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <span className="font-medium">{booth.boothId}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                    booth.category === 'Premium' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {booth.category}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onSelectBooth(isSelected ? null : booth.id)}
                    className="p-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
                    title="Select/Deselect"
                  >
                    {isSelected ? '✓' : '○'}
                  </button>
                  <button
                    onClick={() => onDeleteBooth(booth.id)}
                    className="p-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-600">
                {booth.size} ({booth.sqm}m²) - ₦{booth.price.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailBoothList;