"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import toast, { Toaster } from "react-hot-toast";
export const user_service = process.env.NEXT_PUBLIC_USER_SERVICE;
export const author_service = process.env.NEXT_PUBLIC_AUTHOR_SERVICE;
export const blog_service = process.env.NEXT_PUBLIC_BLOG_SERVICE;

export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  bio: string;
}

export interface Blog {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  author: string;
  created_at: string;
}

interface AppContextType {
  user: User | null;
  loading: boolean;
  isAuth: boolean;

  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  logoutUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.get(`${user_service}/api/v1/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function logoutUser() {
    Cookies.remove("token");
    setUser(null);
    setIsAuth(false);
    toast.success("User logged out");
  }

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <AppContext.Provider
      value={{
        user,
        setIsAuth,
        isAuth,
        setLoading,
        loading,
        setUser,
        logoutUser,
      }}
    >
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        {children} <Toaster />
      </GoogleOAuthProvider>
    </AppContext.Provider>
  );
};

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("UseAppData must be used within AppProvider");
  }
  return context;
};
