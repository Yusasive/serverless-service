import { Navigate, RouteObject } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Authentication/Login'
import Register from '../pages/Authentication/Register'
import SelectRole from '../pages/Authentication/SelectRole'
import AttendeeDashboard from '../pages/Dashboard/attendee/AttendeeDashboard'
import ExhibitorDashboard from '../pages/Dashboard/exhibitor/ExhibitorDashboard'
import Bs from '../pages/Dashboard/exhibitor/shared/BoothManagement'
import StaffDashboard from '../pages/Dashboard/StaffDashboard'
import ExhibitorProfile from '../pages/Profile/exhibitor/ExhibitorProfile'
import AttendeeProfile from '../pages/Profile/attendee/AttendeeProfile'
import QRCodeDisplay from '../pages/QRCodeDisplay'
import { useUser } from '../context/UserContext'
import LoadingOverlay from '@/components/common/LoadingOverlay'
import Terms from '@/pages/Terms'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import ForgetPassword from '@/pages/Authentication/ForgetPassword'
import ResetPassword from '@/pages/Authentication/ResetPassword'
import Verification from '@/pages/Authentication/Verification'
import FAQ from "@/pages/FAQ";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  if (loading) {
    return <LoadingOverlay isLoading={true} />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

//attendee profile route
const attendeeProfileRoute: RouteObject[] = [
  {
    path: '/attendee/profile',
    element: (
      <ProtectedRoute>
        <AttendeeProfile />
      </ProtectedRoute>
    ),
  },
]

//exhibitor profile route
const exhibitorProfileRoute: RouteObject[] = [
  {
    path: '/exhibitor/profile',
    element: (
      <ProtectedRoute>
        <ExhibitorProfile />
      </ProtectedRoute>
    ),
  },
]


//attendee routes
const attendeeRoutes: RouteObject[] = [
  {
    path: '/attendee/dashboard',
    element: (
      <ProtectedRoute>
        <AttendeeDashboard />
      </ProtectedRoute>
    ),
  },
]

//exhibitor routes
const exhibitorRoutes: RouteObject[] = [
  {
    path: '/exhibitor/dashboard',
    element: (
      <ProtectedRoute>
        <ExhibitorDashboard />
      </ProtectedRoute>
    ),
  },
]

//bs routes
const bsRoutes: RouteObject[] = [
  {
    path: '/exhibitor/dashboard/bs',
    element: (
      <ProtectedRoute>
        <Bs />
      </ProtectedRoute>
    ),
  },
]
//staff routes
const staffRoutes: RouteObject[] = [
  {
    path: '/staff/dashboard',
    element: (
      <ProtectedRoute>
        <StaffDashboard />
      </ProtectedRoute>
    ),
  },
]

//checkout route
const checkoutRoute: RouteObject[] = [
  {
    path: '/payment-checkout',
    element: (
      <ProtectedRoute>
        <div>
          <LoadingOverlay isLoading={true} />
        </div>
      </ProtectedRoute>
    ),
  },
]


// Root route
export const rootRoute: RouteObject = {
  path: '/',
  element: <Home />,
}

//about route
export const aboutRoute: RouteObject = {
  path: '/about',
  element: <About />,
}

//contact route
export const contactRoute: RouteObject = {
  path: '/contact',
  element: <Contact />,
}

//faq route
export const faqRoute: RouteObject = {
  path: '/faq',
  element: <FAQ />,
}

// Login route
export const loginRoute: RouteObject = {
  path: '/login',
  element: <Login />,
}

// Forget Password route
export const forgetPasswordRoute: RouteObject = {
  path: '/forget-password',
  element: <ForgetPassword />,
}

// Reset Password route
export const resetPasswordRoute: RouteObject = {
  path: '/reset-password',
  element: <ResetPassword />,
}

// Verification route
export const verificationRoute: RouteObject = {
  path: '/verification',
  element: <Verification />,
}

// Register route
export const registerRoute: RouteObject = {
  path: '/register',
  element: <Register />,
}

// Terms route
export const termsRoute: RouteObject = {
  path: '/terms',
  element: <Terms />,
}


// Select Role route
export const selectRoleRoute: RouteObject = {
  path: '/select-role',
  element: <SelectRole />,
}

// QR Code Display route (public - no authentication required)
export const qrCodeDisplayRoute: RouteObject = {
  path: '/qr',
  element: <QRCodeDisplay />,
}

// Combine all routes
const routes: RouteObject[] = [
  rootRoute,
  loginRoute,
  forgetPasswordRoute,
  resetPasswordRoute,
  verificationRoute,
  aboutRoute,
  contactRoute,
  faqRoute,
  registerRoute,
  selectRoleRoute,
  qrCodeDisplayRoute,
  termsRoute,
  ...attendeeRoutes,
  ...exhibitorRoutes,
  ...staffRoutes,
  ...bsRoutes,
  ...exhibitorProfileRoute,
  ...attendeeProfileRoute,
  ...checkoutRoute,
];

export default routes 