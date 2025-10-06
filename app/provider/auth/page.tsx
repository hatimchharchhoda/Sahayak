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
    <div className="min-h-screen bg-gradient-to-br from-[#E0F7FA] to-[#80DEEA] flex justify-center items-center p-4 transition-all duration-500">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Motivational Cards Section */}
          <div className="space-y-6 md:block hidden animate-slideInRight">
            <h1 className="text-4xl font-poppins font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00C853] to-[#AEEA00]">
              Join Our Professional Service Provider Network
            </h1>
            <p className="text-lg font-nunito text-[#212121]">
              Become a part of the leading home services platform and grow your business
            </p>

            <div className="grid gap-4">
              {/* Earnings */}
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
                <div className="p-2 bg-green-100 rounded-full">
                  <Briefcase className="w-6 h-6 text-[#00C853]" />
                </div>
                <div>
                  <h3 className="font-semibold font-poppins text-[#212121]">Increased Earnings</h3>
                  <p className="text-sm font-nunito text-[#616161]">
                    Get regular clients and boost your income
                  </p>
                </div>
              </div>

              {/* Reputation */}
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
                <div className="p-2 bg-green-100 rounded-full">
                  <Star className="w-6 h-6 text-[#00C853]" />
                </div>
                <div>
                  <h3 className="font-semibold font-poppins text-[#212121]">Build Your Reputation</h3>
                  <p className="text-sm font-nunito text-[#616161]">
                    Earn reviews and grow your professional profile
                  </p>
                </div>
              </div>

              {/* Flexible Schedule */}
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
                <div className="p-2 bg-green-100 rounded-full">
                  <Clock className="w-6 h-6 text-[#00C853]" />
                </div>
                <div>
                  <h3 className="font-semibold font-poppins text-[#212121]">Flexible Schedule</h3>
                  <p className="text-sm font-nunito text-[#616161]">
                    Work on your own terms and timing
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Form Section */}
          <div className="animate-slideInRight">
            <div className="md:hidden mb-4">
              <h1 className="text-2xl font-poppins font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00C853] to-[#AEEA00]">
                Join Our Professional Service Provider Network
              </h1>
              <p className="text-base font-nunito text-[#212121]">
                Become a part of the leading home services platform and grow your business
              </p>
            </div>

            <Card className="w-full max-w-md mx-auto rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500">
              <CardHeader>
                <CardTitle className="text-2xl text-center font-poppins font-semibold">
                  {isLogin ? "Welcome Back, Professional!" : "Create Your Professional Account"}
                </CardTitle>
                <CardDescription className="text-center font-nunito text-[#616161]">
                  {isLogin
                    ? "Access your service provider dashboard"
                    : "Start your journey with us today"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Your professional name"
                          className="w-full focus:border-[#00C853] focus:ring-1 focus:ring-[#AEEA00] transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="+91 98765 43210"
                          className="w-full focus:border-[#00C853] focus:ring-1 focus:ring-[#AEEA00] transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Select
                          value={formData.specialization}
                          onValueChange={handleSpecializationChange}
                        >
                          <SelectTrigger className="focus:border-[#00C853] focus:ring-1 focus:ring-[#AEEA00] transition-all">
                            <SelectValue placeholder="Select your service category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="district">District</Label>
                        <Select
                          value={formData.district}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, district: value }))
                          }
                        >
                          <SelectTrigger className="focus:border-[#00C853] focus:ring-1 focus:ring-[#AEEA00] transition-all">
                            <SelectValue placeholder="Select District" />
                          </SelectTrigger>
                          <SelectContent>
                            {districts.map((d, i) => (
                              <SelectItem key={i} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Select
                          value={formData.city}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, city: value }))
                          }
                        >
                          <SelectTrigger className="focus:border-[#00C853] focus:ring-1 focus:ring-[#AEEA00] transition-all">
                            <SelectValue placeholder="Select City" />
                          </SelectTrigger>
                          <SelectContent>
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
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="you@example.com"
                      className="w-full focus:border-[#00C853] focus:ring-1 focus:ring-[#AEEA00] transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="••••••••"
                      className="w-full focus:border-[#00C853] focus:ring-1 focus:ring-[#AEEA00] transition-all"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-[#E53935] bg-red-50 p-3 rounded transition-all">
                      <AlertCircle size={18} />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center gap-2 text-[#43A047] bg-green-50 p-3 rounded transition-all">
                      <CheckCircle2 size={18} />
                      <span>{success}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#00C853] to-[#AEEA00] text-white font-poppins font-bold uppercase hover:scale-105 transform transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? "Please wait..." : isLogin ? "Sign In" : "Join as Service Provider"}
                  </Button>

                  <div className="text-center space-y-1">
                    <div className="text-sm text-[#2979FF] hover:underline font-nunito">
                      <Link href={"/auth"}>Join as User</Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-sm text-[#2979FF] hover:underline font-nunito"
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
    </div>
  );
};

export default ProviderAuthPage;