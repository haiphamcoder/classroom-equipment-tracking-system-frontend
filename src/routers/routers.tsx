import { createBrowserRouter } from "react-router-dom";
import Devices from "../pages/Devices.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import Tickets from "../pages/Tickets.tsx";
import Login from "../pages/Login.tsx";
import { UserProvider } from "../context/useAuth.tsx";
import App from "../App.tsx";
import { ProtectedRouters } from "./ProtectedRouter.tsx";
import { ChangePassword } from "../pages/ChangePassword.tsx";
import StaffList from "../pages/StaffList.tsx";
import Profile from "../pages/Profile.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserProvider>
        <App />
      </UserProvider>
    ),
    children: [
      { path: "home" },
      {
        path: "",
        element: <Login />,
      },
      {
        path: "changepassword",
        element: <ChangePassword />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRouters>
            <Dashboard />
          </ProtectedRouters>
        ),
      },
      {
        path: "firstLogin",
        element: (
          <ProtectedRouters>
            <ChangePassword />
          </ProtectedRouters>

        ),
      },
      {
        path: "devices",
        element: (
          <ProtectedRouters>
            <Devices />
          </ProtectedRouters>

        ),
      },
      {
        path: "tickets",
        element: (
          <ProtectedRouters>
            <Tickets />
          </ProtectedRouters>
        ),
      },
      {
        path: "staff",
        element: (
          <ProtectedRouters>
            <StaffList />
          </ProtectedRouters>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRouters>
            <Profile />
          </ProtectedRouters>
        ),
      },
    ],
  },
]);
