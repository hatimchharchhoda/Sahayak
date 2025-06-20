// @ts-nocheck
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FooterLink {
  name: string;
  href: string;
}

interface SocialLink {
  icon: typeof Facebook;
  href: string;
  label: string;
}

const Footer = () => {
  const quickLinks: FooterLink[] = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Raise Ticket", href: "/raise-ticket" },
    { name: "Booked Servicea", href: "/booked-services" },
  ];

  const serviceLinks: FooterLink[] = [
    { name: "Cleaning", href: "/services/Cleaning" },
    { name: "Plumbing", href: "/services/Plumbing" },
    { name: "Electrical", href: "/services/Electrical" },
    { name: "Gardening", href: "/services/Gardening" },
  ];

  const socialLinks: SocialLink[] = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="relative">
      {/* Main Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 pt-32 pb-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Sayahak</h3>
                <p className="text-blue-100">
                  Your trusted service partner for all home and office needs.
                </p>
              </div>
              <div className="flex items-center gap-4">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-blue-100 hover:text-white flex items-center gap-2 transition-colors group"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">
                Our Services
              </h4>
              <ul className="space-y-3">
                {serviceLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-blue-100 hover:text-white flex items-center gap-2 transition-colors group"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-blue-400/30">
            <div className="grid md:grid-cols-2 gap-4 items-center">
              <p className="text-blue-100 text-sm text-center md:text-left">
                &copy; {new Date().getFullYear()} Sayahak. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
