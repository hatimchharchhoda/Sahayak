"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, MapPin, Edit2, Save, X, Camera } from "lucide-react";
import { useAuth } from "@/context/userContext";
import Loading from "@/components/custom/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

const UserProfile = () => {
  const { user, setUser, isLoading } = useAuth();
  const [editUserData, setEditUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    city: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [district, setDistrict] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // --- Moved inside component ---
  const fields: {
    icon: React.ElementType;
    name: keyof typeof editUserData;
    placeholder: string;
    disabled: boolean;
  }[] = [
    { icon: User, name: "name", placeholder: "Full Name", disabled: false },
    { icon: Mail, name: "email", placeholder: "Email Address", disabled: true },
    { icon: Phone, name: "phone", placeholder: "Phone Number", disabled: true },
    { icon: MapPin, name: "address", placeholder: "Complete Address", disabled: false },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedCity(user.city);
    setSelectedDistrict(user.district);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updateData = {
      id: user.id,
      name: editUserData.name,
      email: editUserData.email,
      phone: editUserData.phone,
      address: editUserData.address,
      city: selectedCity,
      district: selectedDistrict,
    };
    try {
      const response = await axios.post("/api/auth/updateUser", updateData);
      setUser(response.data.updatedUser);
      localStorage.setItem("user", JSON.stringify(response.data.updatedUser));
      setIsEditing(false);
      toast.success("Profile updated successfully");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Error updating profile");
    }
  };

  const handleCityChange = (value: string) => setSelectedCity(value);
  const handleDistrictChange = (value: string) => setSelectedDistrict(value);

  const fetchCities = async () => {
    const districtToUse = selectedDistrict || user.district;
    if (!districtToUse) return;
    try {
      const response = await axios.post("/api/getCity", { district: districtToUse });
      setCities(response.data.cities);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserDistrict = async () => {
    try {
      const response = await axios.get("/api/getDistrict");
      setDistrict(response.data.allDistrict);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isEditing) {
      fetchUserDistrict();
      setEditUserData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        district: user.district || "",
        city: user.city || "",
      });
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) fetchCities();
  }, [selectedDistrict, isEditing]);

  if (isLoading) return <Loading />;

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FAFBFC] to-[#FFFFFF] py-12 px-4 font-poppins">
      {/* Import fonts globally */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&family=Nunito+Sans:wght@300;400&display=swap');
      `}</style>
      
      <div className="max-w-2xl mx-auto pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="font-inter font-semibold text-3xl text-[#111827] mb-2">
              Your Profile
            </h1>
            <p className="font-nunito text-[#374151]">
              Manage your personal information
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-500"
          >
            {/* Profile Header */}
            <div className="relative p-8 bg-gradient-to-br from-[#F8FAFC] to-[#FFFFFF] border-b border-gray-100">
              <div className="flex items-center gap-6">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative group cursor-pointer"
                >
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center shadow-md ring-4 ring-white transition-all duration-300 group-hover:shadow-lg">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 h-8 w-8 bg-[#14B8A6] rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform duration-300">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                </motion.div>

                <div className="flex-1">
                  <h2 className="text-2xl font-inter font-semibold text-[#111827] mb-1">
                    {user.name}
                  </h2>
                  <p className="text-[#374151] text-sm font-nunito">
                    Keep your information up to date
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-8 space-y-6">
              {isEditing ? (
                <motion.form 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit} 
                  className="space-y-4"
                >
                  {fields.map((field, index) => (
                    <motion.div 
                      key={field.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group"
                    >
                      <label className="block text-sm font-inter font-medium text-[#111827] mb-2">
                        {field.placeholder}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <field.icon className="h-5 w-5 text-[#9CA3AF] group-focus-within:text-[#14B8A6] transition-colors duration-300" />
                        </div>
                        <input
                          type={field.name === "email" ? "email" : "text"}
                          name={field.name}
                          value={editUserData[field.name]}
                          disabled={field.disabled}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className={`pl-12 pr-4 w-full py-3 bg-white border border-[#E5E7EB] rounded-lg 
                            focus:ring-2 focus:ring-[#14B8A6]/20 focus:border-[#14B8A6] focus:outline-none 
                            transition-all duration-300 font-poppins text-[#374151]
                            placeholder:text-[#9CA3AF]
                            ${field.disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'hover:border-gray-300'}`}
                        />
                      </div>
                    </motion.div>
                  ))}

                  {/* District and City Selects */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block text-sm font-inter font-medium text-[#111827] mb-2">
                        District
                      </label>
                      <Select onValueChange={handleDistrictChange} defaultValue={user.district}>
                        <SelectTrigger className="h-12 border border-[#E5E7EB] rounded-lg hover:border-gray-300 focus:ring-2 focus:ring-[#14B8A6]/20 focus:border-[#14B8A6] transition-all duration-300 font-poppins">
                          <SelectValue placeholder={user.district} />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg shadow-lg border border-[#E5E7EB]">
                          {district.length
                            ? district.map((d, i) => (
                                <SelectItem key={i} value={d} className="font-poppins hover:bg-[#F8FAFC] cursor-pointer transition-colors duration-200">
                                  {d}
                                </SelectItem>
                              ))
                            : <SelectItem value="null">Loading...</SelectItem>}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-inter font-medium text-[#111827] mb-2">
                        City
                      </label>
                      <Select onValueChange={handleCityChange} defaultValue={user.city}>
                        <SelectTrigger className="h-12 border border-[#E5E7EB] rounded-lg hover:border-gray-300 focus:ring-2 focus:ring-[#14B8A6]/20 focus:border-[#14B8A6] transition-all duration-300 font-poppins">
                          <SelectValue placeholder={user.city} />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg shadow-lg border border-[#E5E7EB]">
                          {cities.length
                            ? cities.map((c, i) => (
                                <SelectItem key={i} value={c} className="font-poppins hover:bg-[#F8FAFC] cursor-pointer transition-colors duration-200">
                                  {c}
                                </SelectItem>
                              ))
                            : <SelectItem value="null">Select District First</SelectItem>}
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.5 }} 
                    className="flex gap-4 pt-4"
                  >
                    <button 
                      type="submit" 
                      className="flex-1 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white px-6 py-3 rounded-lg font-inter font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 uppercase tracking-wide text-sm"
                    >
                      <Save className="h-5 w-5" />
                      <span>Save Changes</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={handleCancel} 
                      className="flex-1 border-2 border-[#14B8A6] text-[#14B8A6] px-6 py-3 rounded-lg font-inter font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#14B8A6]/5 hover:scale-[1.02] active:scale-95 uppercase tracking-wide text-sm"
                    >
                      <X className="h-5 w-5" />
                      <span>Cancel</span>
                    </button>
                  </motion.div>
                </motion.form>
              ) : (
                <div className="space-y-3">
                  {[
                    { icon: User, label: "Full Name", value: user.name },
                    { icon: Mail, label: "Email Address", value: user.email },
                    { icon: Phone, label: "Phone Number", value: user.phone },
                    { icon: MapPin, label: "Address", value: user.address },
                    { icon: MapPin, label: "City", value: user.city },
                    { icon: MapPin, label: "District", value: user.district },
                  ].map((item, index) => (
                    <motion.div 
                      key={item.label} 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: index * 0.08 }} 
                      className="p-4 flex items-center gap-4 bg-[#F8FAFC] rounded-lg hover:bg-[#F1F5F9] transition-all duration-300 cursor-pointer border border-transparent hover:border-[#14B8A6]/20 group"
                    >
                      <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        <item.icon className="h-5 w-5 text-[#2563EB]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[#9CA3AF] font-nunito uppercase tracking-wider mb-0.5">
                          {item.label}
                        </p>
                        <p className="font-poppins font-medium text-[#111827] text-sm">
                          {item.value}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    onClick={() => setIsEditing(true)} 
                    className="w-full mt-6 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white px-6 py-3 rounded-lg font-inter font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 uppercase tracking-wide text-sm"
                  >
                    <Edit2 className="h-5 w-5" />
                    <span>Edit Profile</span>
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.6 }} 
            className="text-center mt-6 text-sm text-[#9CA3AF] font-nunito"
          >
            Keep your profile updated for a personalized Sahayak experience
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default UserProfile;
