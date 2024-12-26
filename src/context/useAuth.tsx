import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomAlert from "../components/CustomAlert";

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
export var staff_id: number = 0;
export const UserProvider = ({ children }: Props) => {
  // const getBaseUrl = () => {
  //   if (import.meta.env.DEV) {
  //     return '/api' // Uses Vite proxy in development
  //   }
  //   return import.meta.env.VITE_API_BACKEND_URL // Uses direct URL in production
  // }
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setToken("token");
    }
    setIsReady(true);
  }, []);

  const login = async (data: LoginParams) => {
    try {
   
      const response = await axios.post("/api/staff/login", data);
      if (response.status === 200) {
        const userData = response.data;
        localStorage.setItem("user", JSON.stringify(userData));
        setToken("token");
        staff_id = response.data.id;
        console.log("staff id", staff_id);
        setAlert({ type: "success", message: "Đăng nhập thành công!" });


        setTimeout(() => {
          setAlert(null);
          navigate("/dashboard");
        }, 2000);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setAlert({
        type: "error",
        message: "Sai tài khoản hoặc mật khẩu, vui lòng thử lại.",
      });


      setTimeout(() => {
        setAlert(null);
      }, 2000);
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
      {alert && (
        <CustomAlert
          type={alert.type as "success" | "error"}
          title={alert.type === "success" ? "Thành công" : "Lỗi"}
          message={alert.message}
        />
      )}
      <UserContext.Provider value={{ isLogin, login, logout, token }}>
        {isReady ? children : null}
      </UserContext.Provider>
    </>
  );
};

export const useAuth = () => useContext(UserContext);
