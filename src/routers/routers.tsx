import { createBrowserRouter, Route, Routes } from "react-router-dom";
import Devices from "../pages/Devices.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import Login from "../pages/Login.tsx";
import { UserProvider } from "../context/useAuth.tsx";
import App from "../App.tsx";
import { ProtectedRouters } from "./ProtectedRouter.tsx";
import { ChangePassword } from "../pages/ChangePassword.tsx";
import { Register } from "../pages/Register.tsx";
import User from "../pages/User.tsx";
// const AppRouters = () => {
//   return (
//     <Routes>
//       <Route></Route>
//       <Route path="/tickets" element={<Dashboard />} />
//       <Route path="/devices" element={<Devices />} />
//       <Route path="/login" element={<Login />} />
//     </Routes>
//   )
// };

// export default AppRouters;

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
        path: "devices",
        element: (
          <ProtectedRouters>
            <Devices />
          </ProtectedRouters>
        ),
      },
      {
        path: "user",
        element: <User />,
      },
    ],
  },
]);
