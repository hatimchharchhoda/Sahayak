// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X, LogOut, MessageCircle } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/userContext";
import { useMessages } from "@/context/messagesContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { hasUnread } = useMessages();
  const [mounted, setMounted] = useState(false); // for client-side rendering

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    setMounted(true); // ensures unread badge only renders on client
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout");
      setUser({ name: "", email: "" });
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/auth");
    } catch (error) {
      console.log(error);
    }
  };

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Booked Services", href: "/booked-services" },
    { label: "Raise Ticket", href: "/raise-ticket" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 shadow-lg backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link
            href="/"
            className="text-2xl font-inter font-bold text-gray-900 hover:text-teal-600 transition-colors"
          >
            Sahayak
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 font-poppins font-medium text-gray-800">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-3 py-2 rounded-2xl transition-all ${
                  isActive(item.href)
                    ? "bg-teal-100 text-teal-800 shadow"
                    : "hover:bg-teal-50"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Chat Icon */}
            <Link href="/chat/unread" className="relative flex items-center">
              <MessageCircle className="w-6 h-6" />
              {mounted && hasUnread && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </Link>

            {user ? (
              <>
                <Link
                  href="/profile"
                  className="font-bold px-3 py-2 bg-teal-100 text-teal-800 rounded-full shadow-inner"
                >
                  {user.name.charAt(0).toUpperCase()}
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline" className="text-gray-700">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={toggleMenu}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden pb-4 bg-white/95 backdrop-blur-md rounded-b-3xl shadow-lg mt-2 overflow-hidden"
          >
            <div className="flex flex-col space-y-3 px-4 py-4">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={toggleMenu}
                  className={`w-full block px-4 py-2 rounded-2xl font-poppins font-medium transition-all ${
                    isActive(item.href)
                      ? "bg-teal-100 text-teal-800 shadow"
                      : "hover:bg-teal-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Chat Icon */}
              <Link
                href="/chat/unread"
                onClick={toggleMenu}
                className="relative w-full block px-4 py-2 rounded-2xl font-poppins font-medium transition-all hover:bg-teal-50"
              >
                💬 Chat / Messages
                {mounted && hasUnread && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </Link>

              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="w-full block px-4 py-2 rounded-2xl font-bold bg-teal-100 text-teal-800 shadow-inner text-center"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Link>
                  <Button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="w-full mt-2"
                    variant="outline"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <Button className="w-full mb-2" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;