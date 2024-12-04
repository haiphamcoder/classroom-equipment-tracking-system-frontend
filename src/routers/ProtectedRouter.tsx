import React from "react";
import { useAuth } from "../context/useAuth";
import { Login } from "../pages/Login";

type Props = { children: React.ReactNode };
export const ProtectedRouters = ({ children }: Props) => {
  const { isLogin } = useAuth();
  return isLogin() ? <>{children}</> : <Login />;
};
