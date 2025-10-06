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
  UserCheck,
  Shield,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [district, setDistrict] = useState();
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [cities, setCities] = useState();
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
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
  };

  async function getDistrict() {
    try {
      const response = await axios.get("/api/getDistrict");
      setDistrict(response.data.allDistrict);
    } catch (error) {
      console.log(error);
    }
  }
  async function getCities() {
    try {
      const response = await axios.post("/api/getCity", {
        district: selectedDistrict,
      });
      setCities(response.data.cities);
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
    <div className="min-h-screen flex justify-center items-center p-6 bg-gradient-to-br from-[#FFE0B2] via-[#FFAB91] to-[#E1BEE7] transition-all duration-700">
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto animate-fadeIn">
          {/* Left side - Lifestyle Benefits */}
          <div className="space-y-8 hidden md:block">
            <div>
              <h1 className="text-4xl font-bold font-['Nunito Sans'] text-[#212121]">
                {isLogin ? "Welcome Back!" : "Join Our Community"}
              </h1>
              <p className="text-lg text-[#757575] font-['Lato'] mt-2">
                {isLogin
                  ? "Access your personalized lifestyle dashboard and book trusted services."
                  : "Create your account to explore premium lifestyle services near you."}
              </p>
            </div>

            <div className="grid gap-6">
              <div className="flex items-center gap-4 p-5 rounded-2xl shadow-md bg-white/90 backdrop-blur-sm transition hover:scale-[1.02] hover:shadow-lg">
                <div className="p-3 bg-gradient-to-br from-[#FFAB91] to-[#E1BEE7] rounded-full">
                  <UserCheck className="w-6 h-6 text-[#FF7043]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#212121] font-['Nunito Sans']">
                    Easy Booking
                  </h3>
                  <p className="text-[#757575] font-['Lato']">
                    Book services with just a few taps.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-2xl shadow-md bg-white/90 backdrop-blur-sm transition hover:scale-[1.02] hover:shadow-lg">
                <div className="p-3 bg-gradient-to-br from-[#81C784] to-[#E1BEE7] rounded-full">
                  <Shield className="w-6 h-6 text-[#26A69A]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#212121] font-['Nunito Sans']">
                    Secure Platform
                  </h3>
                  <p className="text-[#757575] font-['Lato']">
                    Your data is always safe with us.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-2xl shadow-md bg-white/90 backdrop-blur-sm transition hover:scale-[1.02] hover:shadow-lg">
                <div className="p-3 bg-gradient-to-br from-[#FFD54F] to-[#FFAB91] rounded-full">
                  <Lock className="w-6 h-6 text-[#E57373]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#212121] font-['Nunito Sans']">
                    Verified Providers
                  </h3>
                  <p className="text-[#757575] font-['Lato']">
                    Trusted professionals at your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth Form */}
          <div>
            <Card className="w-full max-w-md mx-auto rounded-2xl shadow-lg bg-white/95 backdrop-blur-sm animate-slideUp">
              <CardHeader>
                <CardTitle className="text-2xl text-center font-['Nunito Sans'] text-[#212121]">
                  {isLogin ? "Sign In to Your Account" : "Create Your Account"}
                </CardTitle>
                <CardDescription className="text-center text-[#757575] font-['Lato']">
                  {isLogin
                    ? "Access your personalized dashboard"
                    : "Join us to explore lifestyle services"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-['Poppins']">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          required
                          placeholder="John Doe"
                          className="w-full bg-white border-b-2 border-[#FFAB91] focus:border-[#FF7043] transition"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-['Poppins']">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="+91 9999999999"
                          className="w-full bg-white border-b-2 border-[#FFAB91] focus:border-[#FF7043] transition"
                        />
                      </div>

                      <div className="flex gap-4">
                        <div className="space-y-2 w-1/2">
                          <Label htmlFor="district" className="font-['Poppins']">
                            District
                          </Label>
                          <Select onValueChange={handleDistrictChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="District" />
                            </SelectTrigger>
                            <SelectContent>
                              {district?.map((d, index) => (
                                <SelectItem value={d} key={index}>
                                  {d}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2 w-1/2">
                          <Label htmlFor="city" className="font-['Poppins']">
                            City
                          </Label>
                          <Select onValueChange={handleCityChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="City" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities && cities.length > 0 ? (
                                cities.map((c, index) => (
                                  <SelectItem value={c} key={index}>
                                    {c}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="null">
                                  Select District First
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="font-['Poppins']">
                          Address
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          required
                          placeholder="123 Main St, City, State"
                          className="w-full bg-white border-b-2 border-[#FFAB91] focus:border-[#FF7043] transition"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-['Poppins']">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full bg-white border-b-2 border-[#FFAB91] focus:border-[#FF7043] transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-['Poppins']">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-white border-b-2 border-[#FFAB91] focus:border-[#FF7043] transition"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-[#E57373] bg-[#FFEBEE] p-3 rounded-lg">
                      <AlertCircle size={18} />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center gap-2 text-[#81C784] bg-[#E8F5E9] p-3 rounded-lg">
                      <CheckCircle2 size={18} />
                      <span>{success}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full rounded-full font-['Poppins'] bg-gradient-to-r from-[#FF7043] to-pink-500 hover:scale-105 transition-all py-2 shadow-md"
                    disabled={loading}
                  >
                    {loading
                      ? "Please wait..."
                      : isLogin
                      ? "Sign In"
                      : "Create Account"}
                  </Button>

                  <div className="space-y-2 text-center">
                    <Link
                      href="/provider/auth"
                      className="text-sm font-['Poppins'] text-[#26A69A] hover:underline"
                    >
                      Join as Provider
                    </Link>
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="block mx-auto text-sm font-['Poppins'] text-[#26A69A] hover:underline"
                    >
                      {isLogin
                        ? "Don't have an account? Sign up"
                        : "Already have an account? Sign in"}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;