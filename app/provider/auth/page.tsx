// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle2,
  Briefcase,
  Star,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Category } from "@/lib/types";

const ProviderAuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    district: "",
    city: "",
  });

  const [districts, setDistricts] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecializationChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      specialization: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = isLogin
        ? "/api/provider/auth/login"
        : "/api/provider/auth/signup";

      const submitData = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : formData;

      const response = await axios.post(endpoint, submitData, {
        headers: { "Content-Type": "application/json" },
      });

      if (isLogin) {
        localStorage.setItem("provider_token", response.data.token);
        setSuccess("Login successful!");
        router.push("/provider");
      } else {
        setSuccess("Account created successfully!");
        router.push("/provider");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError("Failed to load categories");
    }
  };

  async function getDistrict() {
    try {
      const response = await axios.get("/api/getDistrict");
      setDistricts(response.data.allDistrict);
    } catch (error) {
      console.log(error);
    }
  }

  async function getCities() {
    try {
      const response = await axios.post("/api/getCity", {
        district: formData.district,
      });
      setCities(response.data.cities);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCategories();
    getDistrict();
  }, []);

  useEffect(() => {
    getCities();
  }, [formData.district]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FAFBFC] to-[#FFFFFF] flex justify-center items-center p-4 transition-all duration-500">
      {/* Import fonts globally */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&family=Nunito+Sans:wght@300;400&display=swap');
        html, body { font-family: 'Poppins', sans-serif; }
        h1,h2,h3,h4 { font-family: 'Inter', sans-serif; }
        .font-nunito { font-family: 'Nunito Sans', sans-serif; }
      `}</style>

      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
          {/* Motivational Cards Section */}
          <div className="space-y-6 md:block hidden animate-slideIn">
            <div className="space-y-3">
              <h1 className="text-4xl font-inter font-semibold text-[#111827] leading-tight">
                Join Our Professional Network
              </h1>
              <p className="text-lg font-poppins text-[#374151]">
                Become a part of the leading service platform and grow your business with trusted clients
              </p>
            </div>

            <div className="grid gap-4 mt-8">
              {/* Earnings */}
              <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="p-3 bg-gradient-to-br from-[#2563EB]/10 to-[#3B82F6]/5 rounded-xl">
                  <Briefcase className="w-6 h-6 text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="font-semibold font-inter text-[#111827]">Increased Earnings</h3>
                  <p className="text-sm font-nunito text-[#374151]">
                    Get regular clients and boost your income
                  </p>
                </div>
              </div>

              {/* Reputation */}
              <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="p-3 bg-gradient-to-br from-[#14B8A6]/10 to-[#14B8A6]/5 rounded-xl">
                  <Star className="w-6 h-6 text-[#14B8A6]" />
                </div>
                <div>
                  <h3 className="font-semibold font-inter text-[#111827]">Build Your Reputation</h3>
                  <p className="text-sm font-nunito text-[#374151]">
                    Earn reviews and grow your professional profile
                  </p>
                </div>
              </div>

              {/* Flexible Schedule */}
              <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="p-3 bg-gradient-to-br from-[#10B981]/10 to-[#10B981]/5 rounded-xl">
                  <Clock className="w-6 h-6 text-[#10B981]" />
                </div>
                <div>
                  <h3 className="font-semibold font-inter text-[#111827]">Flexible Schedule</h3>
                  <p className="text-sm font-nunito text-[#374151]">
                    Work on your own terms and timing
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Form Section */}
          <div className="animate-slideIn">
            <div className="md:hidden mb-6">
              <h1 className="text-2xl font-inter font-semibold text-[#111827]">
                Join Our Professional Network
              </h1>
              <p className="text-base font-poppins text-[#374151] mt-2">
                Become a part of the leading service platform
              </p>
            </div>

            <Card className="w-full max-w-md mx-auto rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 bg-white border border-gray-100">
              <CardHeader className="space-y-2 pt-8 px-8 pb-4">
                <CardTitle className="text-2xl text-center font-inter font-semibold text-[#111827]">
                  {isLogin ? "Welcome Back!" : "Create Professional Account"}
                </CardTitle>
                <CardDescription className="text-center font-poppins text-[#374151]">
                  {isLogin
                    ? "Access your service provider dashboard"
                    : "Start your journey with us today"}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-inter font-medium text-sm text-[#111827]">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Your professional name"
                          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 transition-all placeholder:text-[#9CA3AF]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-inter font-medium text-sm text-[#111827]">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="+91 98765 43210"
                          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 transition-all placeholder:text-[#9CA3AF]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialization" className="font-inter font-medium text-sm text-[#111827]">
                          Specialization
                        </Label>
                        <Select
                          value={formData.specialization}
                          onValueChange={handleSpecializationChange}
                        >
                          <SelectTrigger className="focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 transition-all border-[#E5E7EB] rounded-lg">
                            <SelectValue placeholder="Select your service category" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg shadow-lg border border-[#E5E7EB]">
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="district" className="font-inter font-medium text-sm text-[#111827]">
                            District
                          </Label>
                          <Select
                            value={formData.district}
                            onValueChange={(value) =>
                              setFormData((prev) => ({ ...prev, district: value }))
                            }
                          >
                            <SelectTrigger className="focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 transition-all border-[#E5E7EB] rounded-lg">
                              <SelectValue placeholder="Select District" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg shadow-lg border border-[#E5E7EB]">
                              {districts.map((d, i) => (
                                <SelectItem key={i} value={d}>{d}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="city" className="font-inter font-medium text-sm text-[#111827]">
                            City
                          </Label>
                          <Select
                            value={formData.city}
                            onValueChange={(value) =>
                              setFormData((prev) => ({ ...prev, city: value }))
                            }
                          >
                            <SelectTrigger className="focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 transition-all border-[#E5E7EB] rounded-lg">
                              <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg shadow-lg border border-[#E5E7EB]">
                              {cities.length > 0
                                ? cities.map((c, i) => (
                                    <SelectItem key={i} value={c}>
                                      {c}
                                    </SelectItem>
                                  ))
                                : <SelectItem value="null">Please select district first</SelectItem>
                              }
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-inter font-medium text-sm text-[#111827]">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="you@example.com"
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 transition-all placeholder:text-[#9CA3AF]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-inter font-medium text-sm text-[#111827]">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="••••••••"
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 transition-all placeholder:text-[#9CA3AF]"
                    />
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 text-[#EF4444] bg-[#EF4444]/5 p-3 rounded-lg border border-[#EF4444]/10 animate-fadeIn">
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <span className="text-sm font-poppins">{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-start gap-3 text-[#10B981] bg-[#10B981]/5 p-3 rounded-lg border border-[#10B981]/10 animate-fadeIn">
                      <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                      <span className="text-sm font-poppins">{success}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-inter font-medium rounded-lg py-2.5 hover:scale-[1.02] hover:shadow-lg transform transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[#E5E7EB] disabled:from-[#E5E7EB] disabled:to-[#E5E7EB]"
                    disabled={loading}
                  >
                    {loading ? "Please wait..." : isLogin ? "SIGN IN" : "JOIN AS PROVIDER"}
                  </Button>

                  <div className="text-center space-y-2 pt-2">
                    <div className="text-sm text-[#2563EB] hover:text-[#14B8A6] transition-colors font-poppins">
                      <Link href={"/auth"}>Join as User</Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError("");
                        setSuccess("");
                      }}
                      className="text-sm text-[#374151] hover:text-[#2563EB] transition-colors font-poppins"
                    >
                      {isLogin
                        ? "Don't have an account? Join now"
                        : "Already have an account? Sign in"}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.6s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* Focus rings for accessibility */
        :focus {
          outline: none;
        }
        :focus-visible {
          outline: 3px solid rgba(20, 184, 166, 0.2);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default ProviderAuthPage;