import { useEffect, useState } from "react";
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

export const useAuthUser = () => {
  const pathname = usePathname();
  console.log(pathname);

  if (pathname === "/auth" || pathname === "/provider/auth") return;
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
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/getMe");
        console.log(res);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, setUser, isLoading };
};
