/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
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

const AdminLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  // Load theme from localStorage
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
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
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className="flex items-center gap-2"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-5 h-5 text-yellow-400" /> Light Mode
            </>
          ) : (
            <>
              <Moon className="w-5 h-5 text-gray-700" /> Dark Mode
            </>
          )}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Panel */}
          <div className="space-y-6 text-gray-900 dark:text-white">
            <h1 className="text-4xl font-bold">Admin Control Panel</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Manage your platform efficiently and securely
            </p>

            <div className="grid gap-4">
              <FeatureCard
                Icon={ShieldCheck}
                title="Secure Access"
                description="Protected admin dashboard with role-based permissions"
                iconBg="bg-blue-500/10"
                iconColor="text-blue-400"
              />
              <FeatureCard
                Icon={Users}
                title="User Management"
                description="Manage users and service providers effectively"
                iconBg="bg-green-500/10"
                iconColor="text-green-400"
              />
              <FeatureCard
                Icon={BarChart3}
                title="Analytics Dashboard"
                description="Comprehensive insights and reporting tools"
                iconBg="bg-purple-500/10"
                iconColor="text-purple-400"
              />
            </div>
          </div>

          {/* Right Panel */}
          <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/95 dark:bg-gray-800/90 dark:border-gray-700 transition-colors duration-500">
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-2 dark:text-white">
                <Lock className="w-5 h-5" />
                Admin Login
              </CardTitle>
              <CardDescription className="text-center dark:text-gray-300">
                Access your administrative dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                />
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                />

                {error && <AlertMessage type="error" message={error} />}
                {success && <AlertMessage type="success" message={success} />}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r dark:text-white from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black dark:from-gray-700 dark:to-gray-800"
                  disabled={loading}
                >
                  {loading ? "Authenticating..." : "Sign In"}
                </Button>

                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Protected administrative access only
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ Icon, title, description, iconBg, iconColor }: any) => (
  <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-300 dark:border-gray-700 transition-colors duration-500">
    <div className={`p-2 ${iconBg} rounded-full`}>
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

// Input Field Component
const InputField = ({ label, name, type, placeholder }: any) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="dark:text-gray-300">
      {label}
    </Label>
    <Input
      id={name}
      name={name}
      type={type}
      required
      placeholder={placeholder}
      className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
  </div>
);

// Alert Message Component
const AlertMessage = ({ type, message }: any) => {
  const alertClasses =
    type === "error"
      ? "text-red-600 bg-red-50 dark:bg-red-800/20 dark:text-red-400"
      : "text-green-600 bg-green-50 dark:bg-green-800/20 dark:text-green-400";

  const Icon = type === "error" ? AlertCircle : CheckCircle2;

  return (
    <div className={`flex items-center gap-2 p-3 rounded ${alertClasses}`}>
      <Icon size={18} />
      <span>{message}</span>
    </div>
  );
};

export default AdminLoginPage;
