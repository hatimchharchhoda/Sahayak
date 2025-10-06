/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Users,
  BarChart3,
  Sun,
  Moon,
} from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * AdminLoginPage — redesigned for Sahayak (dark neon theme)
 * - Keeps all existing logic (theme toggle, login, localStorage, routing)
 * - Updates visuals: dark navy gradient background, neon accents, glassmorphism,
 *   floating labels, glowing buttons, subtle animations
 */

const AdminLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Load theme from localStorage
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
    // trigger entrance animation
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // Toggle theme and store preference in localStorage
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.target);
    const data = Object.fromEntries((formData as any).entries());

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      localStorage.setItem("admin_token", result.token);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/admin/");
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden`
    }
      style={{
        background:
          "radial-gradient(1200px 600px at 10% 10%, rgba(58,12,163,0.18), transparent 12%), radial-gradient(1000px 500px at 90% 90%, rgba(27,38,59,0.18), transparent 12%), linear-gradient(135deg,#0D1B2A 0%, #1B263B 40%, #3A0CA3 100%)",
      }}
    >
      {/* decorative neon grid / glow */}
      <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-10 animate-pulse" />

      {/* Theme toggle (top-right) */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className="flex items-center gap-2 text-sm text-[#F8F9FA] bg-transparent border border-transparent hover:bg-white/5 transition-colors"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-300" /> Light
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-[#00F5D4]" /> Dark
            </>
          )}
        </Button>
      </div>

      <div
        className={`container mx-auto px-6 py-12 transition-transform duration-700 ease-out transform ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left: Hero / Features */}
          <div className="space-y-6 text-[#F8F9FA]">
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wider" style={{fontFamily:'Inter, sans-serif'}}>
              Admin Control Panel
            </h1>
            <p className="text-lg text-[#ADB5BD] max-w-xl" style={{fontFamily:'Poppins, sans-serif'}}>
              Manage your platform efficiently and securely — insights, user
              controls, and analytics in a single authoritative dashboard.
            </p>

            <div className="grid gap-4 mt-6">
              <FeatureCard
                Icon={ShieldCheck}
                title="Secure Access"
                description="Protected admin dashboard with role-based permissions"
                iconColor="[#00F5D4]"
              />
              <FeatureCard
                Icon={Users}
                title="User Management"
                description="Manage users and service providers effectively"
                iconColor="#9D4EDD"
              />
              <FeatureCard
                Icon={BarChart3}
                title="Analytics Dashboard"
                description="Comprehensive insights and reporting tools"
                iconColor="#00C2FF"
              />
            </div>
          </div>

          {/* Right: Login Card */}
          <Card className="w-full max-w-md mx-auto bg-gradient-to-b from-white/5 to-white/3 border border-transparent backdrop-blur-md shadow-[0_8px_40px_rgba(58,12,163,0.12)] rounded-2xl overflow-hidden">
            <div className="relative p-6">
              {/* Glowing top border */}
              <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-[#00F5D4] via-[#00C2FF] to-[#9D4EDD] shadow-[0_6px_30px_rgba(0,245,212,0.12)]" />

              <CardHeader className="pt-2">
                <CardTitle className="text-2xl text-center flex items-center justify-center gap-2 text-[#F8F9FA]" style={{fontFamily:'Inter, sans-serif'}}>
                  <Lock className="w-5 h-5 text-[#00F5D4] drop-shadow-[0_2px_10px_rgba(0,245,212,0.15)]" />
                  Admin Login
                </CardTitle>
                <CardDescription className="text-center text-sm text-[#ADB5BD]" style={{fontFamily:'Poppins, sans-serif'}}>
                  Access your administrative dashboard
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                  <FloatingInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                  />

                  <FloatingInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                  />

                  {error && <AlertMessage type="error" message={error} />}
                  {success && <AlertMessage type="success" message={success} />}

                  <Button
                    type="submit"
                    className={`w-full py-3 rounded-lg font-medium tracking-wide shadow-[0_8px_40px_rgba(0,245,212,0.08)] transform transition-all duration-250 ${
                      loading
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:scale-105"
                    }`}
                    style={{
                      background: "linear-gradient(90deg,#00F5D4 0%,#00C2FF 100%)",
                      color: "#071018",
                      boxShadow: "0 8px 30px rgba(0,245,212,0.12)"
                    }}
                    disabled={loading}
                  >
                    {loading ? "Authenticating..." : "Sign In"}
                  </Button>

                  <div className="text-center text-sm text-[#6C757D]" style={{fontFamily:'Poppins, sans-serif'}}>
                    Protected administrative access only
                  </div>
                </form>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ Icon, title, description, iconColor }: any) => (
  <div className="flex items-center gap-4 p-4 rounded-lg backdrop-blur-[4px] bg-white/3 border border-white/6 shadow-[0_6px_30px_rgba(157,78,221,0.03)] transition transform hover:scale-102 hover:shadow-[0_10px_50px_rgba(157,78,221,0.06)]">
    <div className="flex-shrink-0 p-3 rounded-full bg-gradient-to-tr from-white/4 to-white/2 shadow-[0_6px_30px_rgba(0,0,0,0.25)]">
      <Icon className="w-6 h-6" style={{ color: iconColor }} />
    </div>
    <div>
      <h3 className="font-semibold uppercase tracking-wide text-sm" style={{fontFamily:'Inter, sans-serif'}}>{title}</h3>
      <p className="text-sm text-[#ADB5BD] max-w-md" style={{fontFamily:'Poppins, sans-serif'}}>{description}</p>
    </div>
  </div>
);

// Floating Input Component (animated placeholder / floating label)
const FloatingInput = ({ label, name, type, placeholder }: any) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="relative">
      <Label
        htmlFor={name}
        className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none transition-all duration-200 ${
          focused || value
            ? "-translate-y-6 text-xs text-[#9D4EDD]"
            : "text-sm text-[#ADB5BD]"
        }`}
        style={{fontFamily:'Inter, sans-serif'}}
      >
        {label}
      </Label>

      <Input
        id={name}
        name={name}
        type={type}
        required
        placeholder={focused || value ? placeholder : " "}
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-lg py-3 pl-3 pr-3 bg-black/20 border border-transparent focus:border-[#00F5D4] focus:ring-0 text-[#F8F9FA] placeholder-transparent transition-all duration-200"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      />

      <div className="absolute right-3 top-3 text-xs text-[#6C757D]"> </div>
    </div>
  );
};

// Alert Message Component
const AlertMessage = ({ type, message }: any) => {
  const alertClasses =
    type === "error"
      ? "text-[#E74C3C] bg-[#2a0b0b]/10 border border-[#E74C3C]/10"
      : "text-[#2ECC71] bg-[#072a1a]/10 border border-[#2ECC71]/10";

  const Icon = type === "error" ? AlertCircle : CheckCircle2;

  return (
    <div className={`flex items-center gap-2 p-3 rounded ${alertClasses}`}>
      <Icon size={18} />
      <span className="text-sm" style={{fontFamily:'Poppins, sans-serif'}}>{message}</span>
    </div>
  );
};

export default AdminLoginPage;