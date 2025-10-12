/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#EDE7F6] via-[#F8BBD0] to-[#FFF1F6]">
      {/* Import fonts globally for this page */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Lato:wght@300;400;700&family=Poppins:wght@500;600&family=Nunito+Sans:wght@300;400&display=swap');
        html, body { font-family: 'Lato', sans-serif; }
        h1,h2,h3,h4 { font-family: 'Montserrat', sans-serif; }
        .font-poppins { font-family: 'Poppins', sans-serif; }
        .font-nunito { font-family: 'Nunito Sans', sans-serif; }
      `}</style>

      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-20 -top-10 w-72 h-72 bg-[#FF6F61] opacity-10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute right-0 top-24 w-96 h-96 bg-[#26C6DA] opacity-8 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute left-1/4 bottom-0 w-80 h-80 bg-[#FF8A65] opacity-6 rounded-full blur-3xl"></div>
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
              <h1 className="text-4xl font-semibold text-[#212121] font-nunito">
                {isLogin ? "Welcome Back!" : "Join Our Community"}
              </h1>
              <p className="text-lg text-[#424242] font-lato mt-2 max-w-lg">
                {isLogin
                  ? "Sign in to access your personalized lifestyle dashboard and manage bookings with ease."
                  : "Create your account to explore premium lifestyle services near you — trusted professionals at your doorstep."}
              </p>
            </div>

            <div className="grid gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 220 }}
                className="flex items-center gap-4 p-5 rounded-2xl shadow-md bg-white/80 backdrop-blur-sm"
              >
                <div className="p-3 rounded-full bg-gradient-to-br from-[#FFAB91] to-[#F8BBD0]">
                  <UserCheck className="w-6 h-6 text-[#FF6F61]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#212121] font-nunito">Easy Booking</h3>
                  <p className="text-[#757575] font-lato">Book services in a few taps.</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 220 }}
                className="flex items-center gap-4 p-5 rounded-2xl shadow-md bg-white/80 backdrop-blur-sm"
              >
                <div className="p-3 rounded-full bg-gradient-to-br from-[#81C784] to-[#E0F7FA]">
                  <Shield className="w-6 h-6 text-[#26C6DA]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#212121] font-nunito">Secure Platform</h3>
                  <p className="text-[#757575] font-lato">Your data is protected and private.</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 220 }}
                className="flex items-center gap-4 p-5 rounded-2xl shadow-md bg-white/80 backdrop-blur-sm"
              >
                <div className="p-3 rounded-full bg-gradient-to-br from-[#FFD54F] to-[#FFAB91]">
                  <Lock className="w-6 h-6 text-[#E57373]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#212121] font-nunito">Verified Providers</h3>
                  <p className="text-[#757575] font-lato">Trusted professionals at your doorstep.</p>
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
            <Card className="w-full max-w-md mx-auto rounded-3xl shadow-2xl bg-white/70 backdrop-blur-md border border-white/30">
              <CardHeader className="pt-8 px-8 pb-2">
                <CardTitle className="text-2xl text-center text-[#212121] font-montserrat">
                  {isLogin ? "Sign In to Your Account" : "Create Your Account"}
                </CardTitle>
                <CardDescription className="text-center text-[#616161] mt-1 font-lato">
                  {isLogin
                    ? "Access your personalized dashboard"
                    : "Join us to explore premium lifestyle services"}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-8 pb-8 pt-4">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-poppins text-sm">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          required
                          placeholder="John Doe"
                          className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3 focus:border-[#26C6DA] focus:ring-2 focus:ring-[#26C6DA]/20 transition"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-poppins text-sm">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="+91 9999999999"
                          className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3 focus:border-[#26C6DA] focus:ring-2 focus:ring-[#26C6DA]/20 transition"
                        />
                      </div>

                      <div className="flex gap-4">
                        <div className="space-y-2 w-1/2">
                          <Label htmlFor="district" className="font-poppins text-sm">
                            District
                          </Label>
                          <Select onValueChange={handleDistrictChange}>
                            <SelectTrigger className="w-full rounded-2xl border border-gray-100 py-3 px-3 focus:border-[#26C6DA] focus:ring-2 focus:ring-[#26C6DA]/20 transition">
                              <SelectValue placeholder="Select District" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-lg">
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
                          <Label htmlFor="city" className="font-poppins text-sm">
                            City
                          </Label>
                          <Select onValueChange={handleCityChange}>
                            <SelectTrigger className="w-full rounded-2xl border border-gray-100 py-3 px-3 focus:border-[#26C6DA] focus:ring-2 focus:ring-[#26C6DA]/20 transition">
                              <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-lg">
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
                        <Label htmlFor="address" className="font-poppins text-sm">
                          Address
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          required
                          placeholder="123 Main St, City, State"
                          className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3 focus:border-[#26C6DA] focus:ring-2 focus:ring-[#26C6DA]/20 transition"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-poppins text-sm">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3 focus:border-[#26C6DA] focus:ring-2 focus:ring-[#26C6DA]/20 transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-poppins text-sm">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3 focus:border-[#26C6DA] focus:ring-2 focus:ring-[#26C6DA]/20 transition"
                    />
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 text-[#E57373] bg-[#FFF0F0] p-3 rounded-lg">
                      <AlertCircle size={18} className="shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Error</p>
                        <p className="text-sm text-[#E57373]">{error}</p>
                      </div>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-start gap-3 text-[#66BB6A] bg-[#F0FFF4] p-3 rounded-lg">
                      <CheckCircle2 size={18} className="shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Success</p>
                        <p className="text-sm text-[#2E7D32]">{success}</p>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full rounded-full font-poppins bg-gradient-to-r from-[#FF6F61] to-[#FF8A65] hover:scale-105 transform py-3 shadow-xl transition-all disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
                  </Button>

                  <div className="mt-2 text-center">
                    <Link
                      href="/provider/auth"
                      className="text-sm font-poppins text-[#26C6DA] hover:underline"
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
                      className="text-sm font-poppins text-[#26C6DA] hover:text-[#FF6F61] transition-colors"
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
              <stop offset="0" stopColor="#FF6F61" stopOpacity="0.12" />
              <stop offset="1" stopColor="#FF8A65" stopOpacity="0.08" />
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

        /* small accessibility helper to keep focus rings visible */
        :focus {
          outline: none;
        }
        :focus-visible {
          outline: 3px solid rgba(38,198,218,0.18);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
