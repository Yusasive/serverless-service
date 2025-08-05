import { UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import StatCard from '@/components/cards/StatCard'

const stats = [
  { name: 'Total Users', stat: '71,897', icon: UserGroupIcon },
  { name: 'Exhibitors', stat: '100', icon: DocumentTextIcon },
  { name: 'Customers', stat: '100', icon: UserGroupIcon },
  { name: 'Staff', stat: '100', icon: UserGroupIcon },
]

export default function DashboardHome() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          An overview of your system's performance and key metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <StatCard
            key={item.name}
            name={item.name}
            stat={item.stat}
            icon={item.icon}
          />
        ))}
      </div>

      <div className="mt-8">
        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h2 className="text-base font-semibold leading-6 text-gray-900">Recent Activity</h2>
            <div className="mt-6">
              <p className="text-sm text-gray-500">No recent activity to display.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 