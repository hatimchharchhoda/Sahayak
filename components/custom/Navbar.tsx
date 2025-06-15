// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X, User, LogOut } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/userContext";

interface User {
  name: string;
  email: string;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useAuth();

  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Added getMe to dependencies

  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout");
      setUser({ name: "", email: "" });
      router.push("/auth");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full top-0 z-40 transition-all duration-300 mb-10 ${
        scrolled ? "bg-white shadow-md" : "md:bg-transparent bg-white"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Sayahak
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {[
              "Home",
              "Services",
              "About",
              "Booked Services",
              "Raise Ticket",
            ].map((item) => {
              const formattedHref =
                item === "Home"
                  ? "/"
                  : `/${item.toLowerCase().replace(/\s+/g, "-")}`;

              return (
                <Link
                  key={item}
                  href={formattedHref}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {item}
                </Link>
              );
            })}
          </div>

          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link href={"/profile"}>
                <span className="font-bold text-gray-900 border rounded-full px-3 py-2 bg-blue-100">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </Link>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/auth">
                <Button variant="ghost" className="text-gray-700">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          <div className="md:hidden">
            <Button variant="ghost" onClick={toggleMenu}>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden pb-4"
          >
            <div className="flex flex-col space-y-4 pt-2 pb-3">
              {["Home", "Services", "About", "Booked Services"].map((item) => {
                const formattedHref =
                  item === "Home"
                    ? "/"
                    : `/${item.toLowerCase().replace(/\s+/g, "-")}`;
                return (
                  <Link
                    key={item}
                    href={formattedHref}
                    className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
                    onClick={toggleMenu}
                  >
                    {item}
                  </Link>
                );
              })}
              {user ? (
                <div>
                  <Button
                    onClick={handleLogout}
                    className="w-full mb-2"
                    variant="outline"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4">
                  <Link href="/auth">
                    <Button className="w-full mb-2" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
