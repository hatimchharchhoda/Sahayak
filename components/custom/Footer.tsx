// @ts-nocheck
"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Raise Ticket", href: "/raise-ticket" },
    { name: "Booked Services", href: "/booked-services" },
  ];

  const serviceLinks = [
    { name: "Cleaning", href: "/services/Cleaning" },
    { name: "Plumbing", href: "/services/Plumbing" },
    { name: "Electrical", href: "/services/Electrical" },
    { name: "Gardening", href: "/services/Gardening" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gradient-to-tr from-gray-100 to-white text-gray-800">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:text-center md:text-left">

          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent">
              Sahayak
            </h3>
            <p className="text-gray-600 max-w-sm mx-auto md:mx-0">
              Your trusted service partner for all home and office needs.
            </p>
            <div className="flex sm:justify-center md:justify-start gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="bg-gray-200 p-2 rounded-lg hover:bg-teal-100 transition-colors focus-visible:ring-2 focus-visible:ring-teal-400"
                >
                  <Icon className="w-5 h-5 text-gray-700" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-6 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-teal-600 flex items-center gap-2 transition-colors group focus-visible:ring-2 focus-visible:ring-teal-400 rounded"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-6 tracking-wide">
              Our Services
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((link, i) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-teal-600 flex items-center gap-2 transition-colors group focus-visible:ring-2 focus-visible:ring-teal-400 rounded"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-16 pt-8 border-t border-gray-300/40"
        >
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Sahayak. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;