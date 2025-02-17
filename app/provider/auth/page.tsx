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

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle specialization selection
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

      // Only include email and password for login
      const submitData = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : formData;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      if (isLogin) {
        localStorage.setItem("provider_token", result.token);
        setSuccess("Login successful!");
        router.push("/provider");
      } else {
        setSuccess("Account created successfully! Please login to continue.");
        router.push("/provider");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex justify-center items-center">
      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 md:block hidden">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 bg-clip-text text-transparent">
              Join Our Professional Service Provider Network
            </h1>
            <p className="text-lg text-gray-600">
              Become a part of the leading home services platform and grow your
              business
            </p>

            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Increased Earnings</h3>
                  <p className="text-sm text-gray-600">
                    Get regular clients and boost your income
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="p-2 bg-green-100 rounded-full">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Build Your Reputation</h3>
                  <p className="text-sm text-gray-600">
                    Earn reviews and grow your professional profile
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Flexible Schedule</h3>
                  <p className="text-sm text-gray-600">
                    Work on your own terms and timing
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="md:hidden mb-4">
              <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 bg-clip-text text-transparent">
                Join Our Professional Service Provider Network
              </h1>
              <p className="text-base text-muted-foreground">
                Become a part of the leading home services platform and grow
                your business
              </p>
            </div>
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  {isLogin
                    ? "Welcome Back, Professional!"
                    : "Create Your Professional Account"}
                </CardTitle>
                <CardDescription className="text-center">
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
                          className="w-full"
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
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Select
                          value={formData.specialization}
                          onValueChange={handleSpecializationChange}
                        >
                          <SelectTrigger>
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
                      className="w-full"
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
                      className="w-full"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded">
                      <AlertCircle size={18} />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded">
                      <CheckCircle2 size={18} />
                      <span>{success}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    disabled={loading}
                  >
                    {loading
                      ? "Please wait..."
                      : isLogin
                      ? "Sign In"
                      : "Join as Service Provider"}
                  </Button>

                  <div className="text-center">
                    <div className="text-sm text-blue-600 hover:underline">
                      <Link href={"/auth"}>Join as User</Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-sm text-blue-600 hover:underline"
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
