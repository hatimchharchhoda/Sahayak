// hooks/useCheckUserSession.ts
"use client";

import { useUser } from "@/context/userContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useCheckUserSession = () => {
  const { setUserFromContext } = useUser();
  const router = useRouter();

  const checkUserSession = async () => {
    try {
      const response = await axios.get("/api/auth/getMe");
      const data = response.data;
      setUserFromContext(data.user);
    } catch (error: any) {
      console.error("Error checking user session:", error);
      router.push("/auth");
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  return null; // you can return loading state or similar if needed
};
