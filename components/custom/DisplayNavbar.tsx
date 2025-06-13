// @ts-nocheck
"use client";

import React from "react";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";
import { useCheckUserSession } from "@/hooks/useCheckUserSession";
import { useSocket } from "@/hooks/useSocket";

const DisplayNavbar = () => {
  const pathname = usePathname();

  // Always call hooks
  useSocket();
  // useCheckUserSession(); // Let this handle condition internally if needed

  // Determine visibility
  const shouldHideNavbar =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/provider") ||
    pathname.startsWith("/auth");

  return <>{!shouldHideNavbar && <Navbar />}</>;
};

export default DisplayNavbar;
