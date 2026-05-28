import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUserApi,
  loginUserApi,
  logoutUserApi,
  registerUserApi,
  updateUserProfileApi,
} from "../api/auth.api";

const AuthContext = createContext(null);

const getStoredToken = () => {
  return localStorage.getItem("hirenix_token");
};

const saveToken = (token) => {
  localStorage.setItem("hirenix_token", token);
};

const removeToken = () => {
  localStorage.removeItem("hirenix_token");
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(getStoredToken);
  const [loading, setLoading] = useState(true);

  const register = async (formData) => {
    const response = await registerUserApi(formData);

    const token = response.data.accessToken;
    const currentUser = response.data.user;

    saveToken(token);
    setAccessToken(token);
    setUser(currentUser);

    return response;
  };

  const login = async (formData) => {
    const response = await loginUserApi(formData);

    const token = response.data.accessToken;
    const currentUser = response.data.user;

    saveToken(token);
    setAccessToken(token);
    setUser(currentUser);

    return response;
  };

  const logout = async () => {
    try {
      await logoutUserApi();
    } catch (error) {
      console.log("Logout API error:", error.response?.data || error);
    } finally {
      removeToken();
      setAccessToken(null);
      setUser(null);
    }
  };

  const getCurrentUser = async () => {
    try {
      const token = getStoredToken();

      if (!token) {
        setAccessToken(null);
        setUser(null);
        return;
      }

      const response = await getCurrentUserApi();

      setAccessToken(token);
      setUser(response.data);
    } catch (error) {
      console.log("Get current user error:", error.response?.data || error);

      removeToken();
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    const response = await updateUserProfileApi(profileData);

    setUser(response.data);

    return response;
  };

  useEffect(() => {
    getCurrentUser();
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
    isAuthenticated: Boolean(user && accessToken),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};