import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // ✅ FIX: Don't store full user object with token in localStorage
  // Only store minimal non-sensitive display info
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (inputs) => {
    const res = await axios.post(
      "https://blog-app-sable-three.vercel.app/api/auth/login",
      inputs,
      { withCredentials: true },
    );

    const userData = res.data;

    // ✅ FIX: Do NOT store the JWT token in localStorage — it lives in the
    // httpOnly cookie set by the server. Only store safe display data.
    const safeUser = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      img: userData.img,
    };

    setCurrentUser(safeUser);
    localStorage.setItem("user", JSON.stringify(safeUser));

    return safeUser;
  };

  const logout = async () => {
    try {
      await axios.post(
        "https://blog-app-sable-three.vercel.app/api/auth/logout",
        {},
        { withCredentials: true },
      );
    } catch {
      // Silently fail — always clear local state
    } finally {
      localStorage.removeItem("user");
      // ✅ FIX: No localStorage token to remove anymore
      setCurrentUser(null);
    }
  };

  // ✅ FIX: Removed the /api/test-auth call (that endpoint is deleted).
  // Instead just verify user against /api/users/me using the httpOnly cookie.
  useEffect(() => {
    const checkAuth = async () => {
      if (!currentUser) return;
      try {
        // Silently verify cookie is still valid
        await axios.get(
          "https://blog-app-sable-three.vercel.app/api/users/me",
          { withCredentials: true },
        );
      } catch {
        // Cookie expired or invalid — log out cleanly
        localStorage.removeItem("user");
        setCurrentUser(null);
      }
    };

    checkAuth();
  }, []); // Only on mount

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
