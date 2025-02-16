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
    { name: "About Us", href: "/about-us" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Terms", href: "/terms" },
  ];

  const serviceLinks: FooterLink[] = [
    { name: "Cleaning", href: "/services/cleaning" },
    { name: "Plumbing", href: "/services/plumbing" },
    { name: "Electrical", href: "/services/electrical" },
    { name: "Painting", href: "/services/painting" },
  ];

  const socialLinks: SocialLink[] = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="relative">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 -mb-24 relative z-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Stay Updated
                </h3>
                <p className="text-gray-600">
                  Subscribe to our newsletter for the latest services and
                  offers.
                </p>
              </div>
              <div className="flex gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 pt-32 pb-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
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

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">
                Contact Us
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-200 mt-1" />
                  <div className="text-blue-100">
                    <p>123 Service Street</p>
                    <p>City, State 12345</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-200" />
                  <a
                    href="tel:(123)456-7890"
                    className="text-blue-100 hover:text-white transition-colors"
                  >
                    (123) 456-7890
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-200" />
                  <a
                    href="mailto:info@sayahak.com"
                    className="text-blue-100 hover:text-white transition-colors"
                  >
                    info@sayahak.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-200" />
                  <p className="text-blue-100">Mon - Fri: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-blue-400/30">
            <div className="grid md:grid-cols-2 gap-4 items-center">
              <p className="text-blue-100 text-sm text-center md:text-left">
                &copy; {new Date().getFullYear()} Sayahak. All rights reserved.
              </p>
              <div className="flex justify-center md:justify-end gap-6">
                <Link
                  href="/privacy"
                  className="text-blue-100 hover:text-white text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-blue-100 hover:text-white text-sm transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
