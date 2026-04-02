import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshToken } from "../services/AuthService";

type AuthContextType = {
  isAdmin: boolean;
  adminMode: boolean;
  loading: boolean;
  accessToken: string | null;
  loginAsAdmin: (access: string, refresh: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setAdminMode: (v: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loginAsAdmin = async (access: string, refresh: string) => {
    setAccessToken(access);
    setIsAdmin(true);

    await AsyncStorage.setItem("accessToken", access);
    await AsyncStorage.setItem("refreshToken", refresh);
  };

  const logout = async () => {
    setAccessToken(null);
    setIsAdmin(false);

    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
  };

  const restoreSession = async () => {
    try {
      const refresh = await AsyncStorage.getItem("refreshToken");

      if (!refresh) {
        setLoading(false);
        return;
      }

      const data = await refreshToken(refresh);

      await AsyncStorage.setItem("accessToken", data.accessToken);
      await AsyncStorage.setItem("refreshToken", data.refreshToken);

      setAccessToken(data.accessToken);
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
        accessToken,
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