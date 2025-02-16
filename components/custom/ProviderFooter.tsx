// @ts-nocheck
import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
} from "lucide-react";

const ProviderFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/80 backdrop-blur-sm mt-8">
      <Card className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex justify-between flex-col md:flex-row gap-10">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Sahayak Provider Portal
              </h3>
              <p className="text-sm text-gray-600">
                Empowering service providers to deliver excellence and grow
                their business.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  <Youtube className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            {/* <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/provider"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/provider/profile"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/provider/services"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Available Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/provider/earnings"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    My Earnings
                  </Link>
                </li>
              </ul>
            </div> */}

            {/* Support */}
            {/* <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/provider/help"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/provider/faq"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/provider/contact"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/provider/terms"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div> */}

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Contact Us
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Mail className="h-5 w-5" />
                  <span>support@sahayakprovider.com</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Phone className="h-5 w-5" />
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600">
              © {currentYear} Sahayak Provider Portal. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <div className="text-sm text-gray-600 hover:text-gray-900">
                Privacy Policy
              </div>
              <div className="text-sm text-gray-600 hover:text-gray-900">
                Terms & Conditions
              </div>
              <div className="text-sm text-gray-600 hover:text-gray-900">
                Cookie Policy
              </div>
            </div>
          </div>
        </div>
      </Card>
    </footer>
  );
};

export default ProviderFooter;
