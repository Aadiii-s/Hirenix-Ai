import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUserApi,
  loginUserApi,
  logoutUserApi,
  registerUserApi,
  updateUserProfileApi,
} from "../api/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("hirenix_token") || null
  );
  const [loading, setLoading] = useState(true);

  const register = async (formData) => {
    const data = await registerUserApi(formData);

    setUser(data.data.user);
    setAccessToken(data.data.accessToken);
    localStorage.setItem("hirenix_token", data.data.accessToken);

    return data;
  };

  const login = async (formData) => {
    const data = await loginUserApi(formData);

    setUser(data.data.user);
    setAccessToken(data.data.accessToken);
    localStorage.setItem("hirenix_token", data.data.accessToken);

    return data;
  };

  const logout = async () => {
    try {
      await logoutUserApi();
    } catch (error) {
      console.log("Logout API error:", error);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("hirenix_token");
    }
  };

  const getCurrentUser = async () => {
    try {
      const data = await getCurrentUserApi();
      setUser(data.data);
    } catch (error) {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("hirenix_token");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    const data = await updateUserProfileApi(profileData);
    setUser(data.data);
    return data;
  };

  useEffect(() => {
    if (accessToken) {
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    accessToken,
    loading,
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};