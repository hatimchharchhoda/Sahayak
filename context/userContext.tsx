"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface IUser {
  id: string;
  email: string;
  name: string;
  role: string;
  city: string;
  phone: string;
  address?: string;
  district: string;
  status?: string; // Add status field
}

interface AuthContextType {
  user: IUser;
  setUser: (user: IUser) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<IUser>({
    city: "",
    id: "",
    email: "",
    name: "",
    role: "",
    phone: "",
    district: "",
  });
  const [isLoading, setLoading] = useState(true);

  // Function to handle blocked user logout
  const handleBlockedAccount = async () => {
    try {
      // Determine logout endpoint based on role
      const logoutEndpoint = pathname.includes("provider")
        ? "/api/provider/auth/logout"
        : "/api/auth/logout";

      // Call logout API to clear cookies
      await axios.get(logoutEndpoint);

      // Clear user state
      setUser({
        city: "",
        id: "",
        email: "",
        name: "",
        role: "",
        phone: "",
        district: "",
      });

      // Show toast notification
      toast.error(
        "Your account has been blocked by admin. Please contact support.",
        {
          duration: 5000,
        }
      );

      // Redirect to appropriate auth page
      const redirectPath = pathname.includes("provider")
        ? "/provider/auth"
        : "/auth";

      router.push(redirectPath);
      router.refresh();
    } catch (error) {
      console.error("Error logging out blocked user:", error);
      // Force redirect even if logout fails
      const redirectPath = pathname.includes("provider")
        ? "/provider/auth"
        : "/auth";
      router.push(redirectPath);
    }
  };

  useEffect(() => {
    // Skip auth check on auth pages
    if (
      pathname === "/auth" ||
      pathname === "/provider/auth" ||
      pathname === "/admin/auth"
    ) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        let res;
        if (!pathname.includes("admin")) {
          res = await axios.get("/api/getMe");

          const userData = res.data;

          // Check if account is blocked
          if (userData.status === "BLOCKED") {
            await handleBlockedAccount();
            return;
          }
          setUser(userData);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Error fetching user", err);

        // If 403 (blocked) or 401 (unauthorized), redirect to login
        if (err.response?.status === 403 || err.response?.status === 401) {
          const redirectPath = pathname.includes("provider")
            ? "/provider/auth"
            : pathname.includes("admin")
            ? "/admin/auth"
            : "/auth";
          router.push(redirectPath);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Poll for account status every 30 seconds (optional but recommended)
    const intervalId = setInterval(async () => {
      try {
        let res;
        if (pathname.includes("admin")) {
          res = await axios.get("/api/admin/auth/getMe");
        } else {
          res = await axios.get("/api/getMe");
        }

        const userData = res.data;

        // Check if account became blocked
        if (userData.status === "BLOCKED") {
          clearInterval(intervalId);
          await handleBlockedAccount();
        }
      } catch (err) {
        // Silently fail for polling
        console.error("Error polling user status", err);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
