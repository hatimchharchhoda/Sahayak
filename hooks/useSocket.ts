import { useUser } from "@/context/userContext";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (): Socket | null => {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { userFromContext: user } = useUser();

  useEffect(() => {
    if (!user || !user.id) return;
    const s = io("https://sahayak-socket.onrender.com", {
      withCredentials: true,
      auth: {
        userId: user.id,
      },
    });

    socketRef.current = s;
    setSocket(s);

    s.on("connect", () => {
      console.log("✅ Connected to socket server with ID:", s.id);
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [user, user?.id]);

  return socket;
};
