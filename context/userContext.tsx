"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import { usePathname } from "next/navigation";

interface IUser {
  id: string;
  email: string;
  name: string;
  role: string;
  city: string;
  phone: string;
  address?: string;
}

interface AuthContextType {
  user: IUser;
  setUser: (user: IUser) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [user, setUser] = useState<IUser>({
    city: "",
    id: "",
    email: "",
    name: "",
    role: "",
    phone: "",
  });
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === "/auth" || pathname === "/provider/auth") {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/getMe");
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [pathname]);

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
