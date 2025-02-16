"use client";

import React from "react";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";

const DisplayNavbar = () => {
  const pathname = usePathname();

  // Hide Navbar if the route starts with "/admin", "/provider", or "/auth"
  const shouldHideNavbar =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/provider") ||
    pathname.startsWith("/auth");

  return <>{!shouldHideNavbar && <Navbar />}</>;
};

export default DisplayNavbar;
