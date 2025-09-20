import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    try {
      const res = await axios.post(
        "https://blog-app-sable-three.vercel.app/api/auth/login",
        inputs,
        {
          withCredentials: true,
        }
      );

      // console.log("Login response:", res.data); // Debug log

      // Store the COMPLETE user object including id, username, etc.
      const userData = res.data;

      // Store token in localStorage
      if (userData.token) {
        localStorage.setItem("token", userData.token);
      }

      // Store complete user data
      setCurrentUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "https://blog-app-sable-three.vercel.app/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setCurrentUser(null);
    }
  };

  // Check if user is still authenticated on page refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token && !currentUser) {
          // Try to verify token and get user info
          const res = await axios.get(
            "https://blog-app-sable-three.vercel.app/api/test-auth",
            {
              withCredentials: true,
            }
          );

          if (res.data.authenticated) {
            // If authenticated but no user data, try to get user info
            const userRes = await axios.get(
              "https://blog-app-sable-three.vercel.app/api/users/me",
              {
                withCredentials: true,
              }
            );
            setCurrentUser(userRes.data);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setCurrentUser(null);
      }
    };

    checkAuth();
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
