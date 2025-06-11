"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ProviderFooter from "./ProviderFooter";
import Footer from "./Footer";

const DisplayFooter = () => {
  const pathname = usePathname();

  // Hide footer if path starts with /auth or /provider/auth
  if (pathname.startsWith("/auth") || pathname.startsWith("/provider/auth")) {
    return null;
  }

  // Show ProviderFooter for /provider routes
  if (pathname.startsWith("/provider")) {
    return <ProviderFooter />;
  }

  // Show default Footer for all other routes
  return <Footer />;
};

export default DisplayFooter;
