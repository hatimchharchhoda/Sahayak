// @ts-nocheck

"use client"; // Needed for using hooks in Next.js App Router

import React from "react";
import { usePathname } from "next/navigation";
import ProviderFooter from "./ProviderFooter";
import Footer from "./Footer";

const DisplayFooter = () => {
  const pathname = usePathname();

  // Check if the current path starts with '/provider'
  const isProviderRoute = pathname.startsWith("/provider");

  return (
    <div>
      {isProviderRoute ? (
        <>
          <ProviderFooter />
        </>
      ) : (
        <>
          <Footer />
        </>
      )}
    </div>
  );
};

export default DisplayFooter;
