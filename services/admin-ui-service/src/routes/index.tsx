import { Navigate, RouteObject } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/Home";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
// import Roles from "@/pages/Dashboard/Roles/Roles";
// import CreateRole from "@/pages/Dashboard/Roles/CreateRole";
// import EditRole from "@/pages/Dashboard/Roles/EditRole";
// import Permissions from "@/pages/Dashboard/Permissions/Permissions";
// import Users from "@/pages/Dashboard/Users/Users";
import WebsiteContent from "@/pages/Dashboard/Content/WebsiteContent";
import TestimonialsManagement from "@/pages/Dashboard/Content/TestimonialsManagement";
import FAQsManagement from "@/pages/Dashboard/Content/FAQsManagement";
import AboutPageManagement from "@/pages/Dashboard/Content/AboutPageManagement";
import EventsManagement from "@/pages/Dashboard/Content/EventsManagement";
import Booths from "@/pages/Dashboard/Booths/Booths";
import Exhibitors from "@/pages/Dashboard/Exhibitors/Exhibitors";
import Transactions from "@/pages/Dashboard/Transactions/Transaction";
import { useUser } from "@/context/UserContext";
import LoadingOverlay from "@/components/common/LoadingOverlay";

// Protected Route wrapper
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  if (loading) {
    return <LoadingOverlay isLoading={true} message="Loading dashboard..." />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Public routes
export const publicRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
];

// Protected dashboard routes
export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      // User Management
      { path: "users", element: <div>Staff page coming soon...</div> },
      { path: "roles", element: <div>Staff page coming soon...</div> },
      { path: "roles/create", element: <div>Staff page coming soon...</div> },
      { path: "roles/edit/:id", element: <div>Staff page coming soon...</div> },
      { path: "permissions", element: <div>Staff page coming soon...</div> },
      // Trade Fair Management
      { path: "attendees", element: <div>Attendees page coming soon...</div> },
      {
        path: "exhibitors",
        element: <Exhibitors />,
      },
      { path: "booths", element: <Booths /> },
      { path: "transactions", element: <Transactions /> },
      { path: "staff", element: <div>Staff page coming soon...</div> },
      // Content Management
      { path: "content/sections", element: <WebsiteContent /> },
      { path: "content/testimonials", element: <TestimonialsManagement /> },
      { path: "content/faqs", element: <FAQsManagement /> },
      { path: "content/about", element: <AboutPageManagement /> },
      { path: "content/events", element: <EventsManagement /> },

      // System
      {
        path: "activity-logs",
        element: <div>Activity Logs page coming soon...</div>,
      },
    ],
  },
];

// Root route
export const rootRoute: RouteObject = {
  path: "/",
  element: <Navigate to="/dashboard" replace />,
};

// Logout route
export const logoutRoute: RouteObject = {
  path: "/logout",
  element: <Logout />,
};

// Combine all routes
const routes: RouteObject[] = [
  ...publicRoutes,
  ...dashboardRoutes,
  rootRoute,
  logoutRoute,
];

export default routes;
