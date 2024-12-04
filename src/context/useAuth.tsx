import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../data/mockData";

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
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
    setIsReady(true);
  }, []);

  const login = (data: LoginParams) => {
    console.log(data);

    const account = users.find(
      (user) =>
        user.username === data.username && user.password === data.password
    );

    console.log(account);
    if (!account) {
      alert("Invalid username or password");
      return;
    }
    const newToken = "token";
    localStorage.setItem("token", newToken);
    setToken(newToken);
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const isLogin = () => {
    return Boolean(token);
  };

  return (
    <UserContext.Provider value={{ isLogin, login, logout, token }}>
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
