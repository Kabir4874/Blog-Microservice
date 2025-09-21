"use client";

import React, { createContext, ReactNode, useState } from "react";

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState(null);
  return <AppContext.Provider value={{ user }}>{children}</AppContext.Provider>;
};
