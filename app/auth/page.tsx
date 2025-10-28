/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  UserCheck,
  Shield,
  Lock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [district, setDistrict] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      ...data,
      district: selectedDistrict,
      city: selectedCity,
    };

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const response = await axios.post(endpoint, payload, {
        withCredentials: true,
      });

      if (isLogin) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setSuccess("Login successful!");
        router.push("/");
      } else {
        setSuccess("Account created successfully!");
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedCity("");
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
  };

  async function getDistrict() {
    try {
      const response = await axios.get("/api/getDistrict");
      setDistrict(response.data.allDistrict || []);
    } catch (error) {
      console.log(error);
    }
  }
  async function getCities() {
    try {
      const response = await axios.post("/api/getCity", {
        district: selectedDistrict,
      });
      setCities(response.data.cities || []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getDistrict();
  }, []);

  useEffect(() => {
    if (selectedDistrict) getCities();
  }, [selectedDistrict]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#F8F9FA] via-[#FAFBFC] to-[#FFFFFF]">
      {/* Import fonts globally for this page */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap');
        html, body { font-family: 'Poppins', sans-serif; }
        h1,h2,h3,h4 { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-20 -top-10 w-72 h-72 bg-[#2979FF] opacity-[0.04] rounded-full blur-3xl animate-blob"></div>
        <div className="absolute right-0 top-24 w-96 h-96 bg-[#26A69A] opacity-[0.06] rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute left-1/4 bottom-0 w-80 h-80 bg-[#2979FF] opacity-[0.03] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-10 z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {/* Left side - Lifestyle Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 hidden md:block"
          >
            <div>
              <h1 className="text-4xl font-bold text-[#212121] font-inter">
                {isLogin ? "Welcome Back!" : "Join Sahayak"}
              </h1>
              <p className="text-lg text-[#616161] font-poppins mt-2 max-w-lg">
                {isLogin
                  ? "Sign in to access your personalized dashboard and manage your services with ease."
                  : "Create your account to explore premium services near you — trusted professionals at your doorstep."}
              </p>
            </div>

            <div className="grid gap-6">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center gap-4 p-5 rounded-xl shadow-sm hover:shadow-md transition-all bg-white border border-gray-100"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-[#2979FF]/10 to-[#2979FF]/5">
                  <UserCheck className="w-6 h-6 text-[#2979FF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#212121] font-poppins">Easy Booking</h3>
                  <p className="text-[#616161] font-poppins text-sm">Book services in a few taps.</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center gap-4 p-5 rounded-xl shadow-sm hover:shadow-md transition-all bg-white border border-gray-100"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-[#26A69A]/10 to-[#26A69A]/5">
                  <Shield className="w-6 h-6 text-[#26A69A]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#212121] font-poppins">Secure Platform</h3>
                  <p className="text-[#616161] font-poppins text-sm">Your data is protected and private.</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center gap-4 p-5 rounded-xl shadow-sm hover:shadow-md transition-all bg-white border border-gray-100"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-[#43A047]/10 to-[#43A047]/5">
                  <Lock className="w-6 h-6 text-[#43A047]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#212121] font-poppins">Verified Providers</h3>
                  <p className="text-[#616161] font-poppins text-sm">Trusted professionals at your doorstep.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="w-full max-w-md mx-auto rounded-2xl shadow-lg bg-white border border-gray-100">
              <CardHeader className="pt-8 px-8 pb-2">
                <CardTitle className="text-2xl text-center text-[#212121] font-inter font-bold">
                  {isLogin ? "Sign In to Your Account" : "Create Your Account"}
                </CardTitle>
                <CardDescription className="text-center text-[#616161] mt-1 font-poppins">
                  {isLogin
                    ? "Access your personalized dashboard"
                    : "Join us to explore premium services"}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-8 pb-8 pt-4">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-poppins font-medium text-sm text-[#212121]">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          required
                          placeholder="John Doe"
                          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:border-[#2979FF] focus:ring-2 focus:ring-[#2979FF]/20 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-poppins font-medium text-sm text-[#212121]">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="+91 9999999999"
                          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:border-[#2979FF] focus:ring-2 focus:ring-[#2979FF]/20 transition-all"
                        />
                      </div>

                      <div className="flex gap-4">
                        <div className="space-y-2 w-1/2">
                          <Label htmlFor="district" className="font-poppins font-medium text-sm text-[#212121]">
                            District
                          </Label>
                          <Select onValueChange={handleDistrictChange}>
                            <SelectTrigger className="w-full rounded-lg border border-gray-200 py-2.5 px-3 focus:border-[#2979FF] focus:ring-2 focus:ring-[#2979FF]/20 transition-all">
                              <SelectValue placeholder="Select District" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg shadow-lg">
                              {district?.length ? (
                                district.map((d: string, index: number) => (
                                  <SelectItem value={d} key={index}>
                                    {d}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="null">Loading...</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2 w-1/2">
                          <Label htmlFor="city" className="font-poppins font-medium text-sm text-[#212121]">
                            City
                          </Label>
                          <Select onValueChange={handleCityChange}>
                            <SelectTrigger className="w-full rounded-lg border border-gray-200 py-2.5 px-3 focus:border-[#2979FF] focus:ring-2 focus:ring-[#2979FF]/20 transition-all">
                              <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg shadow-lg">
                              {cities && cities.length > 0 ? (
                                cities.map((c: string, index: number) => (
                                  <SelectItem value={c} key={index}>
                                    {c}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="null">Select District First</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="font-poppins font-medium text-sm text-[#212121]">
                          Address
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          required
                          placeholder="123 Main St, City, State"
                          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:border-[#2979FF] focus:ring-2 focus:ring-[#2979FF]/20 transition-all"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-poppins font-medium text-sm text-[#212121]">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:border-[#2979FF] focus:ring-2 focus:ring-[#2979FF]/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-poppins font-medium text-sm text-[#212121]">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:border-[#2979FF] focus:ring-2 focus:ring-[#2979FF]/20 transition-all"
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 text-[#E53935] bg-[#E53935]/5 p-3 rounded-lg border border-[#E53935]/10"
                    >
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Error</p>
                        <p className="text-sm">{error}</p>
                      </div>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 text-[#43A047] bg-[#43A047]/5 p-3 rounded-lg border border-[#43A047]/10"
                    >
                      <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Success</p>
                        <p className="text-sm">{success}</p>
                      </div>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    className="w-full rounded-lg font-poppins font-medium bg-[#2979FF] hover:bg-gradient-to-r hover:from-[#2979FF] hover:to-[#1E5DD8] hover:scale-[1.02] transform py-2.5 shadow-sm hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed text-white"
                    disabled={loading}
                  >
                    {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
                  </Button>

                  <div className="mt-2 text-center">
                    <Link
                      href="/provider/auth"
                      className="text-sm font-poppins font-medium text-[#2979FF] hover:text-[#26A69A] transition-colors"
                    >
                      Join as Provider
                    </Link>
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError("");
                        setSuccess("");
                      }}
                      className="text-sm font-poppins text-[#616161] hover:text-[#2979FF] transition-colors"
                    >
                      {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* subtle wave divider bottom */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <svg className="w-full h-28" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,64L48,80C96,96,192,128,288,149.3C384,171,480,181,576,170.7C672,160,768,128,864,117.3C960,107,1056,117,1152,138.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="url(#gradAuthWave)"
          ></path>
          <defs>
            <linearGradient id="gradAuthWave" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#2979FF" stopOpacity="0.04" />
              <stop offset="1" stopColor="#26A69A" stopOpacity="0.06" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <style jsx>{`
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes blob {
          0% {
            transform: translateY(0px) scale(1);
          }
          33% {
            transform: translateY(-12px) scale(1.05);
          }
          66% {
            transform: translateY(6px) scale(0.98);
          }
          100% {
            transform: translateY(0px) scale(1);
          }
        }

        /* Focus rings for accessibility */
        :focus {
          outline: none;
        }
        :focus-visible {
          outline: 3px solid rgba(41,121,255,0.2);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
