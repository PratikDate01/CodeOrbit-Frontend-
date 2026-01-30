import React, { createContext, useState, useContext } from "react";
import API from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null
  );

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    setUserInfo(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
  };

  const register = async (name, email, password, phone, education) => {
    const { data } = await API.post("/auth/register", { name, email, password, phone, education });
    setUserInfo(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
