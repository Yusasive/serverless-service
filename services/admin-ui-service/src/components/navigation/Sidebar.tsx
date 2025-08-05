import { Link, useLocation } from "react-router-dom";
import {
  ChartBarIcon,
  UsersIcon,
  UserGroupIcon,
  KeyIcon,
  BuildingStorefrontIcon,
  TableCellsIcon,
  IdentificationIcon,
  ClockIcon,
  ArrowRightStartOnRectangleIcon,
  UserIcon,
  XMarkIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  QuestionMarkCircleIcon,
  BanknotesIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

type IconComponent = typeof ChartBarIcon;

interface NavItem {
  name: string;
  href: string;
  icon: IconComponent;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navigation: [NavItem, ...NavGroup[]] = [
  { name: "Dashboard", href: "/dashboard", icon: ChartBarIcon },
  {
    group: "User Management",
    items: [
      { name: "Users", href: "/dashboard/users", icon: UsersIcon },
      { name: "Roles", href: "/dashboard/roles", icon: UserIcon },
      { name: "Permissions", href: "/dashboard/permissions", icon: KeyIcon },
    ],
  },
  {
    group: "Trade Fair Management",
    items: [
      { name: "Attendees", href: "/dashboard/attendees", icon: UserGroupIcon },
      {
        name: "Exhibitors",
        href: "/dashboard/exhibitors",
        icon: BuildingStorefrontIcon,
      },
      { name: "Booths", href: "/dashboard/booths", icon: TableCellsIcon },
      { name: "Staff", href: "/dashboard/staff", icon: IdentificationIcon },
      {
        name: "Transactions",
        href: "/dashboard/transactions",
        icon: BanknotesIcon,
      },
    ],
  },
  {
    group: "Content Management",
    items: [
      {
        name: "Website Content",
        href: "/dashboard/content/sections",
        icon: DocumentTextIcon,
      },
      {
        name: "Testimonials",
        href: "/dashboard/content/testimonials",
        icon: ChatBubbleLeftRightIcon,
      },
      {
        name: "FAQs",
        href: "/dashboard/content/faqs",
        icon: QuestionMarkCircleIcon,
      },
      {
        name: "About Us Page",
        href: "/dashboard/content/about",
        icon: InformationCircleIcon,
      },
      {
        name: "Events Page",
        href: "/dashboard/content/events",
        icon: CalendarDaysIcon,
      },
    ],
  },
  {
    group: "System",
    items: [
      {
        name: "Activity Logs",
        href: "/dashboard/activity-logs",
        icon: ClockIcon,
      },
      { name: "Logout", href: "/logout", icon: ArrowRightStartOnRectangleIcon },
    ],
  },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const location = useLocation();
  const DashboardIcon = navigation[0].icon;

  const NavLinks = () => (
    <div className="space-y-4">
      {/* Dashboard Link */}
      <Link
        to={navigation[0].href}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
          location.pathname === navigation[0].href
            ? "bg-[#2b6419] text-white"
            : "text-gray-100 hover:bg-[#2b6419] hover:text-white"
        }`}
      >
        <DashboardIcon className="mr-3 h-5 w-5" />
        {navigation[0].name}
      </Link>

      {/* Grouped Navigation Items */}
      {navigation.slice(1).map(
        (section) =>
          "group" in section && (
            <div key={section.group}>
              <h3 className="px-3 text-sm font-medium text-gray-300 mb-2">
                {section.group}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        location.pathname === item.href
                          ? "bg-[#2b6419] text-white"
                          : "text-gray-100 hover:bg-[#2b6419] hover:text-white"
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )
      )}
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "" : "hidden"}`}
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-[#1c4a10]">
          <div className="flex h-16 items-center justify-between px-4 bg-[#1c4a10]">
            <div className="text-white">
              <h5 className="font-medium">LCCI Admin</h5>
              <p className="text-sm text-gray-300">
                Lagos International Trade Fair
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md text-gray-300 hover:text-white hover:bg-[#2b6419]"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-3 py-4">
            <NavLinks />
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-[#1c4a10]">
        <div className="flex flex-col flex-grow pt-5">
          <div className="flex-shrink-0 px-4">
            <div className="text-white">
              <h5 className="font-medium">LCCI Admin</h5>
              <p className="text-sm text-gray-300">
                Lagos International Trade Fair
              </p>
            </div>
          </div>
          <nav className="flex-1 px-3 mt-6">
            <NavLinks />
          </nav>
        </div>
      </div>
    </>
  );
}
