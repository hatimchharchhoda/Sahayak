"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ProviderFooter from "./ProviderFooter";
import Footer from "./Footer";

const DisplayFooter = () => {
  const pathname = usePathname();

  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/provider/auth") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  if (pathname.startsWith("/provider")) {
    return <ProviderFooter />;
  }

  return <Footer />;
};

export default DisplayFooter;
