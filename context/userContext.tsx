"use client";

import { User } from "@/lib/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
interface UserContextType {
  userFromContext: User | null;
  setUserFromContext: (user: User) => void;
}

// Create the context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component to wrap the app
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userFromContext, setUserFromContext] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ userFromContext, setUserFromContext }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for accessing user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
