import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { refreshToken } from "../services/AuthService";
import { setMemoryToken } from "../services/api";
import {
  clearTokens,
  getRefreshToken,
  saveTokens,
} from "../storage/auth";

type AuthContextType = {
  isAdmin: boolean;
  adminMode: boolean;
  loading: boolean;
  loginAsAdmin: (access: string, refresh: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setAdminMode: (v: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const loginAsAdmin = async (access: string, refresh: string) => {
    setMemoryToken(access);
    setIsAdmin(true);

    await saveTokens(access, refresh);
  };

  const logout = async () => {
    setMemoryToken(null);
    setIsAdmin(false);

    await clearTokens();
  };

  const restoreSession = async () => {
    try {
      const refresh = await getRefreshToken();

      if (!refresh) {
        setLoading(false);
        return;
      }

      const data = await refreshToken(refresh);

      await saveTokens(data.accessToken, data.refreshToken);

      setMemoryToken(data.accessToken);
      setIsAdmin(true);
    } catch (e) {
      console.log("session invalid", e);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        adminMode,
        loading,
        loginAsAdmin,
        logout,
        restoreSession,
        setAdminMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
