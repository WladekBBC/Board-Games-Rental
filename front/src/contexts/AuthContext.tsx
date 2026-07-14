'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { IUserApi, Method, request } from "@/interfaces/api";
import { Perms, toPerms } from "@/interfaces/perms";
import {
  AuthContextType,
  LoggedUserType,
  LoginDataType,
} from "@/types/authContext";
import { checkCookie, deleteCookie, getCookie, setCookie } from "@/app/actions";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<LoggedUserType | null>(null);
  const [JWT, setJWT] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Perms>(Perms.U);

  const router = useRouter();

  const clearLocalUser = useCallback(async () => {
    await deleteCookie("Authorization");
  }, []);

  const saveLocalUser = useCallback(async (token: string, exp: number) => {
    await setCookie("Authorization", token, exp);
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    await clearLocalUser();
    setUser(null);
    setJWT(null);
    setPermissions(Perms.U);
    setLoading(false);
    router.push("/");
  }, [clearLocalUser, router]);

  const handleAuthSuccess = useCallback(async (token: string) => {
    try {
      const loggedUser = jwtDecode<LoggedUserType>(token);
      const perms = toPerms(loggedUser.permissions);

      if (!loggedUser.exp || Date.now() > loggedUser.exp * 1000) {
        await signOut();
        return;
      }

      if (!(await checkCookie("Authorization"))) {
        await saveLocalUser(token, loggedUser.exp);
      }

      setUser(loggedUser);
      setJWT(token);
      setPermissions(perms);
    } catch {
      await signOut();
    }
  }, [saveLocalUser, signOut]);

  useEffect(() => {
    const bootstrapAuth = async () => {
      setLoading(true);
      try {
        if (await checkCookie("Authorization")) {
          const cookie = await getCookie("Authorization");
          if (cookie?.value) {
            await handleAuthSuccess(cookie.value);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    void bootstrapAuth();
  }, [handleAuthSuccess]);

  const register = async (data: LoginDataType) => {
    const { token } = await request<IUserApi>(
      "auth/register",
      Method.POST,
      JSON.stringify(data),
    );
    await handleAuthSuccess(token);
  };

  const signIn = async (data: LoginDataType) => {
    const { token } = await request<IUserApi>(
      "auth/login",
      Method.POST,
      JSON.stringify(data),
    );
    await handleAuthSuccess(token);
  };

  const contextValue = {
    loading,
    user,
    JWT,
    permissions,
    register,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
