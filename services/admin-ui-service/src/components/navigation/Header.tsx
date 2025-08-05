import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'


export default function Header() {

  return (
    <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
      <div className="flex flex-1 justify-between px-4">
        <div className="flex flex-1">
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          <div className="relative ml-3">
            <Menu>
              <MenuButton className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4a10] focus:ring-offset-2">
                <span className="sr-only">Open user menu</span>
                <UserCircleIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
              </MenuButton>
              <MenuItems className="absolute right-0 top-full z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem>
                  <Link
                    to="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to="/logout"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </Link>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  )
} 