import { useState } from 'react';
import NavigationHeader from '../../../components/navigation/NavigationHeader';
import { SlCalender } from "react-icons/sl";
import { 
  FiMenu,
  FiX,
  FiHome,
  FiGrid,
  FiTag,
  FiCalendar as FiCalendarAlt,
  FiUserCheck,
  FiInfo,
  FiChevronRight
} from "react-icons/fi";
import { useUser } from '../../../context/UserContext';
import { Navigate, useNavigate } from 'react-router-dom';
import CompleteProfile from '../../Profile/components/CompleteProfile';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import BoothManagement from './shared/BoothManagement';
import OverviewTab from './OverviewTab';
import CompanyRepresentative from './CompanyRepresentative';
import { getCountdownDays } from '@/utils/calculateCountdown';

const menuItems = [
  { id: 'Overview', label: 'Overview', icon: FiHome },
  { id: 'Booking', label: 'Booking', icon: FiGrid },
  { id: 'Company Representatives', label: 'Company Representatives', icon: FiTag },
  { id: 'Events', label: 'Events', icon: FiCalendarAlt },
  { id: 'Exhibitors', label: 'Exhibitors', icon: FiUserCheck },
  { id: 'Information Center', label: 'Information Center', icon: FiInfo }
];

export default function ExhibitorDashboard() {
    const { user, loading } = useUser();
    const [activeTab, setActiveTab] = useState('Overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    if (loading) {
      return <LoadingOverlay isLoading={true} message="Loading your dashboard"/>;
    }

    if (!user) {
      return <Navigate to="/login" replace state={{ message: "Session expired. Please log in again." }} />;
    }


    const handleCompleteProfile = () => {
      navigate('/exhibitor/dashboard');
    }

    if (!user?.firstName || !user?.lastName) {
      return (
          <div className="pt-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
              <NavigationHeader isAuthenticated={true} />
              <CompleteProfile onComplete={handleCompleteProfile} isExhibitor={true} />
          </div>
      );
    }

    const handleManageBooths = () => {
      // change the active tab to Booking
      setActiveTab('Booking');
    }


    
  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <NavigationHeader isAuthenticated={true} />

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-16 z-30`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                {sidebarOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="p-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors duration-200 mb-1 ${
                    activeTab === item.id
                      ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {activeTab === item.id && <FiChevronRight className="h-4 w-4" />}
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
          {/* Welcome Header */}
          <div className="p-6 bg-white shadow-sm border-b">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              {/* Left: Welcome Text */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName} {user?.lastName}</h1>
                  <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white text-sm font-medium rounded-lg shadow-sm">
                    <SlCalender className="mr-2 h-4 w-4" />
                    {getCountdownDays()} days until trade fair
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      🌍 <span className="font-medium">{user?.company || 'Company Not specified'}</span>
                    </span>
                    <span>•</span>
                    <span>
                      {user.address && user.address.length > 0 ? (
                        <> {user.address.find(addr => addr.is_primary)?.city || 'Not specified'}, {user.address.find(addr => addr.is_primary)?.country || 'Not specified'}</>
                      ) : (
                          'Location not specified'
                      )}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {user?.userType}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user?.boothType}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => navigate('/exhibitor/profile')}
                      className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors duration-200">
                      Edit Profile
                    </button>
                    <button 
                      onClick={handleManageBooths}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors duration-200 shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M12 4v16m8-8H4" />
                      </svg>
                      Manage Booths
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>       
          {/* Tab Content */}
          <div className="">
            {activeTab === 'Overview' && <OverviewTab />}
            {activeTab === 'Booking' && (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                {/* <p>Manage your booth reservations, layouts, and configurations.</p> */}
                <div><BoothManagement /></div>
              </div>
            )}
            {activeTab === 'Company Representatives' && (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                <div><CompanyRepresentative /></div>
              </div>
            )}
            {activeTab === 'Events' && (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                <FiCalendarAlt className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Events</h3>
                <p>View and register for trade fair events and sessions.</p>
              </div>
            )}
            {activeTab === 'Exhibitors' && (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                <FiUserCheck className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Exhibitors</h3>
                <p>Connect with other exhibitors and view the exhibitor directory.</p>
              </div>
            )}
            {activeTab === 'Information Center' && (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                <FiInfo className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Information Center</h3>
                <p>Access important announcements, guidelines, and support resources.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// function SetupCard({ title, percent, status, icon, color, progressType }: { 
//   title: string; 
//   percent: number; 
//   status: string; 
//   icon: string;
//   color: string;
//   progressType: 'linear' | 'circular' | 'stepped';
// }) {
//   const getIconComponent = () => {
//     switch (icon) {
//       case 'check':
//         return <FiCheckCircle className="h-5 w-5 text-green-600" />;
//       case 'profile':
//         return <FiAlertCircle className="h-5 w-5 text-yellow-600" />;
//       default:
//         return <FiCheckCircle className="h-5 w-5 text-green-600" />;
//     }
//   };

//   const getColorClasses = () => {
//     switch (color) {
//       case 'green':
//         return 'bg-green-50 text-green-700 border-green-200';
//       case 'yellow':
//         return 'bg-yellow-50 text-yellow-700 border-yellow-200';
//       default:
//         return 'bg-green-50 text-green-700 border-green-200';
//     }
//   };

//   const renderProgress = () => {
//     switch (progressType) {
//       case 'circular':
//         const radius = 20;
//         const circumference = 2 * Math.PI * radius;
//         const strokeDasharray = circumference;
//         const strokeDashoffset = circumference - (percent / 100) * circumference;
        
//         return (
//           <div className="relative w-12 h-12">
//             <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
//               <circle
//                 cx="24"
//                 cy="24"
//                 r={radius}
//                 stroke="currentColor"
//                 strokeWidth="4"
//                 fill="transparent"
//                 className="text-gray-200"
//               />
//               <circle
//                 cx="24"
//                 cy="24"
//                 r={radius}
//                 stroke="currentColor"
//                 strokeWidth="4"
//                 fill="transparent"
//                 strokeDasharray={strokeDasharray}
//                 strokeDashoffset={strokeDashoffset}
//                 className={color === 'green' ? 'text-green-500' : 'text-yellow-500'}
//                 strokeLinecap="round"
//               />
//             </svg>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <span className="text-xs font-semibold text-gray-700">{percent}%</span>
//             </div>
//           </div>
//         );

//       case 'stepped':
//         const steps = 4;
//         const completedSteps = Math.floor((percent / 100) * steps);
        
//         return (
//           <div className="flex gap-1">
//             {Array.from({ length: steps }, (_, i) => (
//               <div
//                 key={i}
//                 className={`h-2 w-6 rounded-full ${
//                   i < completedSteps
//                     ? color === 'green' ? 'bg-green-500' : 'bg-yellow-500'
//                     : 'bg-gray-200'
//                 }`}
//               />
//             ))}
//           </div>
//         );

//       default: // linear
//         return (
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div 
//               className={`h-2 rounded-full transition-all duration-500 ${
//                 color === 'green' ? 'bg-green-500' : 'bg-yellow-500'
//               }`}
//               style={{ width: `${percent}%` }}
//             ></div>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-3">
//           {getIconComponent()}
//           <h3 className="font-semibold text-gray-900">{title}</h3>
//         </div>
//         {progressType !== 'circular' && (
//           <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getColorClasses()}`}>
//             {percent}%
//           </span>
//         )}
//       </div>
//       <p className="text-sm text-gray-600 mb-3">{status}</p>
//       <div className="flex items-center justify-between">
//         {renderProgress()}
//         {progressType === 'circular' && (
//           <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getColorClasses()}`}>
//             Complete
//           </span>
//         )}
//       </div>
//     </div>
//   );
// }

// function MyReservation() {
//   return (
//     <div className="space-y-8">
//       {/* Key Metrics */}
      

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       

//         {/* Upcoming Deadlines & Booth Reservations */}
//         <div className="lg:col-span-2 space-y-8">
         

//           {/* Booth Reservations */}
//           <div className="bg-white rounded-xl border border-gray-200 p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold text-gray-900">Your Booth Reservations</h3>
//               <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
//                 Add Booth
//               </button>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="text-left py-3 px-4 font-medium text-gray-900">Booth #</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-900">Size</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   <BoothRow booth="15" size="3x3" price="₦8,000" status="Paid" />
//                   <BoothRow booth="16" size="3x3" price="₦8,000" status="Paid" />
//                   <BoothRow booth="17" size="3x3" price="₦8,000" status="Paid" />
//                   <BoothRow booth="18" size="3x3" price="₦8,000" status="Paid" />
//                   <BoothRow booth="19" size="3x3" price="₦8,000" status="Paid" />
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Need Assistance Section */}
//       <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 p-6">
//         <div className="flex items-start gap-4">
//           <div className="p-2 bg-green-200 rounded-lg">
//             <svg className="h-6 w-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <div className="flex-1">
//             <h4 className="font-semibold text-green-900 mb-2">Need Assistance?</h4>
//             <p className="text-sm text-green-800 mb-4">
//               Our support team is available to assist you with any questions regarding your booth setup, staff registration, or event details.
//             </p>
//             <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
//               Contact Support
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function MetricCard({ title, value, subtitle, icon, color }: {
//   title: string;
//   value: string;
//   subtitle: string;
//   icon: React.ReactNode;
//   color: string;
// }) {
//   const getColorClasses = () => {
//     switch (color) {
//       case 'blue': return 'from-blue-500 to-blue-600';
//       case 'green': return 'from-green-500 to-green-600';
//       case 'purple': return 'from-purple-500 to-purple-600';
//       case 'red': return 'from-red-500 to-red-600';
//       default: return 'from-green-500 to-green-600';
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
//       <div className="flex items-center justify-between mb-4">
//         <div className={`p-3 rounded-lg bg-gradient-to-r ${getColorClasses()}`}>
//           {icon}
//         </div>
//       </div>
//       <div>
//         <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
//         <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
//         <p className="text-sm text-gray-500">{subtitle}</p>
//       </div>
//     </div>
//   );
// }

// function ActivityItem({ title, description, time, type }: {
//   title: string;
//   description: string;
//   time: string;
//   type: 'success' | 'info' | 'warning';
// }) {
//   const getIconColor = () => {
//     switch (type) {
//       case 'success': return 'text-green-600 bg-green-100';
//       case 'info': return 'text-blue-600 bg-blue-100';
//       case 'warning': return 'text-yellow-600 bg-yellow-100';
//       default: return 'text-green-600 bg-green-100';
//     }
//   };

//   return (
//     <div className="flex gap-3">
//       <div className={`p-1.5 rounded-full ${getIconColor()}`}>
//         <FiClock className="h-3 w-3" />
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-medium text-gray-900">{title}</p>
//         <p className="text-xs text-gray-600 mt-1">{description}</p>
//         <p className="text-xs text-gray-400 mt-1">{time}</p>
//       </div>
//     </div>
//   );
// }

// function DeadlineItem({ title, description, date, priority }: {
//   title: string;
//   description: string;
//   date: string;
//   priority: 'high' | 'medium' | 'low';
// }) {
//   const getPriorityColor = () => {
//     switch (priority) {
//       case 'high': return 'bg-red-100 text-red-800 border-red-200';
//       case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'low': return 'bg-green-100 text-green-800 border-green-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   return (
//     <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//       <div className="flex-1">
//         <div className="flex items-center gap-2 mb-1">
//           <h4 className="font-medium text-gray-900">{title}</h4>
//           <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor()}`}>
//             {priority}
//           </span>
//         </div>
//         <p className="text-sm text-gray-600 mb-2">{description}</p>
//         <p className="text-xs text-gray-500">Due: {date}</p>
//       </div>
//     </div>
//   );
// }

// function BoothRow({ booth, size, price, status }: {
//   booth: string;
//   size: string;
//   price: string;
//   status: string;
// }) {
//   return (
//     <tr className="hover:bg-gray-50">
//       <td className="py-3 px-4 text-sm text-gray-900">{booth}</td>
//       <td className="py-3 px-4 text-sm text-gray-600">{size}</td>
//       <td className="py-3 px-4 text-sm text-gray-900 font-medium">{price}</td>
//       <td className="py-3 px-4">
//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//           {status}
//         </span>
//       </td>
//       <td className="py-3 px-4">
//         <button className="text-sm text-green-600 hover:text-green-700 font-medium">
//           View Details
//         </button>
//       </td>
//     </tr>
//   );
// }