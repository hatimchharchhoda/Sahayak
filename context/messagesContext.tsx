// context/messagesContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./userContext";

interface MessagesContextType {
  hasUnread: boolean;
  refreshUnread: () => void;
}

const MessagesContext = createContext<MessagesContextType>({
  hasUnread: false,
  refreshUnread: () => {},
});

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [hasUnread, setHasUnread] = useState(false);

  const fetchUnread = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(`/api/getUnreadMessages?userId=${user.id}`);
      setHasUnread((res.data?.unreadMessages?.length || 0) > 0);
    } catch (err) {
      console.error("Failed to fetch unread messages", err);
      setHasUnread(false);
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // optional polling every 30s
    return () => clearInterval(interval);
  }, [user?.id]);

  return (
    <MessagesContext.Provider value={{ hasUnread, refreshUnread: fetchUnread }}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => useContext(MessagesContext);