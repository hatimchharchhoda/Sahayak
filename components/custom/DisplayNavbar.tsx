// @ts-nocheck
"use client";

import React from "react";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";
import { useCheckUserSession } from "@/hooks/useCheckUserSession";
import { useSocket } from "@/hooks/useSocket";
import { useAuthUser } from "@/hooks/useAuth";

const DisplayNavbar = () => {
  const pathname = usePathname();
  useAuthUser();
  // useCheckUserSession(); // Let this handle condition internally if needed

  // Determine visibility
  const shouldHideNavbar =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/provider") ||
    pathname.startsWith("/auth");

  return <>{!shouldHideNavbar && <Navbar />}</>;
};

export default DisplayNavbar;
