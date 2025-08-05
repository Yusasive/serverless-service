interface StatCardProps {
  title: string;
  value: string;
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-gray-600">{title}</div>
      <div className="font-bold text-xl text-green-700">{value}</div>
    </div>
  );
} 