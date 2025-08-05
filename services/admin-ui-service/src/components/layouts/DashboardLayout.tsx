import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Bars3Icon } from '@heroicons/react/24/outline'
import Sidebar from '../navigation/Sidebar'
import Header from '../navigation/Header'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-10 bg-white lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
            <div className="flex items-center">
              <button
                type="button"
                className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1c4a10]"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="ml-4 text-lg font-semibold text-gray-900">LCCI Admin</div>
            </div>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:block">
          <Header />
        </div>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
} 