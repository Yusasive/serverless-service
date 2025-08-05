import { type ComponentType } from 'react'
import { type SVGProps } from 'react'

interface StatCardProps {
  name: string
  stat: string | number
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

export default function StatCard({ name, stat, icon: Icon }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
      <dt>
        <div className="absolute rounded-md bg-primary-600 p-3">
          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <p className="ml-16 truncate text-sm font-medium text-gray-500">{name}</p>
      </dt>
      <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
        <p className="text-2xl font-semibold text-gray-900">{stat}</p>
      </dd>
    </div>
  )
} 