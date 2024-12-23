import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert } from "@mui/material";
import { getbaseurl } from "../util/BaseUrl";
export type LoginParams = {
  username: string;
  password: string;
};
type UserContextType = {
  login: (data: LoginParams) => void;
  logout: () => void;
  isLogin: () => boolean;
  token: string | null;
};

type Props = { children: React.ReactNode };
const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  // const getBaseUrl = () => {
  //   if (import.meta.env.DEV) {
  //     return '/api' // Uses Vite proxy in development
  //   }
  //   return import.meta.env.VITE_API_BACKEND_URL // Uses direct URL in production
  // }
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    // const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setToken("token");
    }
    setIsReady(true);
  }, []);

  const login = async (data: LoginParams) => {
    try {
      // Send login request to the API
      const baseUrl = getBaseUrl();
      const response = await axios.post(`${baseUrl}/staff/login`, data);
      if (response.status === 200) {
        const userData = response.data; // Entire response data
        localStorage.setItem("user", JSON.stringify(userData)); // Save data as a JSON string
        setToken("token"); // Update token in state (if applicable)
        navigate("/dashboard"); // Redirect to the dashboard
      }
    } catch (err) {
      console.error("Login failed:", err);

      setAlertOpen(true);
      setTimeout(() => {
        setAlertOpen(false);
      }, 1000);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    navigate("/");
  };

  const isLogin = () => {
    return Boolean(token);
  };

  return (
    <>
      {alertOpen ? <Alert severity="error">Sai mk</Alert> : ""}
      <UserContext.Provider value={{ isLogin, login, logout, token }}>
        {isReady ? children : null}
      </UserContext.Provider>
    </>
  );
};

export const useAuth = () => useContext(UserContext);
