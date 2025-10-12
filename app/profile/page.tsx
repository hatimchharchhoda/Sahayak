"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, MapPin, Edit2, Save, X, Camera, Sparkles } from "lucide-react";
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
  const [cities, setCities] = useState([]);
  const [district, setDistrict] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

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
    <section className="min-h-screen bg-gradient-to-br from-[#f8dcdc] via-[#fadbe6] to-[#c5acb5] py-12 px-4 font-lato relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#26C6DA] opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#FF6F61] opacity-10 rounded-full blur-3xl"></div>
      
      <div className="max-w-2xl mx-auto pt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Welcome Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <Sparkles className="w-4 h-4 text-[#FF6F61]" />
              <span className="font-poppins text-sm font-medium text-[#212121] uppercase tracking-wide">
                Your Profile
              </span>
              <Sparkles className="w-4 h-4 text-[#26C6DA]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-[0_25px_60px_rgba(255,111,97,0.15)] transition-all duration-500"
          >
            {/* Profile Header with Avatar */}
            <div className="relative p-8  bg-gradient-to-br from-[#EDE7F6] via-[#F8BBD0] to-[#FCE4EC] bg-[length:200%_100%]">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative group cursor-pointer"
                >
                  <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center shadow-2xl ring-4 ring-white/30 transition-all duration-300 group-hover:ring-8">
                    <User className="h-12 w-12 text-[#FF6F61]" />
                  </div>
                  <div className="absolute bottom-0 right-0 h-8 w-8 bg-[#26C6DA] rounded-full flex items-center justify-center shadow-lg cursor-pointer group-hover:scale-110 transition-transform duration-300">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                </motion.div>

                {/* Header Text */}
                <div className="flex-1">
                  <h2 className="text-3xl font-montserrat font-semibold text-white mb-1">
                    {user.name}
                  </h2>
                  <p className="text-white/90 text-sm font-nunito">
                    Manage your personal information
                  </p>
                </div>
              </div>

              {/* Decorative Wave SVG */}
              <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
                  <path d="M0,0 C300,80 600,80 900,40 L1200,0 L1200,120 L0,120 Z" fill="white" opacity="0.3"></path>
                </svg>
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
                  className="space-y-5"
                >
                  {[ 
                    { icon: User, name: "name", placeholder: "Full Name", disabled: false },
                    { icon: Mail, name: "email", placeholder: "Email Address", disabled: true },
                    { icon: Phone, name: "phone", placeholder: "Phone Number", disabled: true },
                    { icon: MapPin, name: "address", placeholder: "Complete Address", disabled: false },
                  ].map((field, index) => (
                    <motion.div 
                      key={field.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group"
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <field.icon className="h-5 w-5 text-[#9E9E9E] group-focus-within:text-[#26C6DA] transition-colors duration-300" />
                      </div>
                      <input
                        type={field.name === "email" ? "email" : "text"}
                        name={field.name}
                        value={editUserData[field.name]}
                        disabled={field.disabled}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className={`pl-12 pr-4 w-full py-4 bg-white border-2 border-gray-100 rounded-2xl 
                          focus:ring-2 focus:ring-[#26C6DA]/30 focus:border-[#26C6DA] focus:outline-none 
                          shadow-sm hover:shadow-md transition-all duration-300 font-lato text-[#424242]
                          placeholder:text-[#9E9E9E]
                          ${field.disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'hover:border-gray-200'}`}
                      />
                    </motion.div>
                  ))}

                  {/* District and City Selects */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="relative">
                      <Select onValueChange={handleDistrictChange} defaultValue={user.district}>
                        <SelectTrigger className="h-14 border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 focus:ring-2 focus:ring-[#26C6DA]/30 focus:border-[#26C6DA] transition-all duration-300 font-lato">
                          <SelectValue placeholder={user.district} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl border-2">
                          {district.length
                            ? district.map((d, i) => (
                                <SelectItem 
                                  key={i} 
                                  value={d}
                                  className="font-lato hover:bg-[#EDE7F6] rounded-lg cursor-pointer transition-colors duration-200"
                                >
                                  {d}
                                </SelectItem>
                              ))
                            : <SelectItem value="null">Loading...</SelectItem>}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="relative">
                      <Select onValueChange={handleCityChange} defaultValue={user.city}>
                        <SelectTrigger className="h-14 border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 focus:ring-2 focus:ring-[#26C6DA]/30 focus:border-[#26C6DA] transition-all duration-300 font-lato">
                          <SelectValue placeholder={user.city} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl border-2">
                          {cities.length
                            ? cities.map((c, i) => (
                                <SelectItem 
                                  key={i} 
                                  value={c}
                                  className="font-lato hover:bg-[#EDE7F6] rounded-lg cursor-pointer transition-colors duration-200"
                                >
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
                      className="flex-1 bg-gradient-to-r from-[#FF6F61] to-[#FF8A65] text-white px-6 py-4 rounded-2xl 
                        font-poppins font-medium flex items-center justify-center gap-2 
                        transition-all duration-300 hover:scale-105 hover:shadow-[0_15px_35px_rgba(255,111,97,0.4)] 
                        active:scale-95 shadow-lg uppercase tracking-wide text-sm"
                    >
                      <Save className="h-5 w-5" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-gray-100 text-[#424242] px-6 py-4 rounded-2xl 
                        font-poppins font-medium flex items-center justify-center gap-2 
                        transition-all duration-300 hover:bg-gray-200 hover:scale-105 
                        active:scale-95 shadow-sm uppercase tracking-wide text-sm"
                    >
                      <X className="h-5 w-5" />
                      <span>Cancel</span>
                    </button>
                  </motion.div>
                </motion.form>
              ) : (
                <div className="space-y-4">
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
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="p-5 flex items-center gap-4 bg-gradient-to-r from-white to-gray-50 rounded-2xl 
                        shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer 
                        border-2 border-transparent hover:border-[#26C6DA]/20 group"
                    >
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#FF6F61]/10 to-[#FF8A65]/10 
                        flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="h-6 w-6 text-[#FF6F61]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[#9E9E9E] font-nunito uppercase tracking-wider mb-1">
                          {item.label}
                        </p>
                        <p className="font-lato font-medium text-[#212121] text-base">
                          {item.value}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Edit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(true)}
                    className="w-full mt-6 bg-gradient-to-r from-[#FF6F61] to-[#FF8A65] text-white 
                      px-6 py-4 rounded-2xl font-poppins font-medium flex items-center justify-center gap-2 
                      hover:shadow-[0_15px_35px_rgba(255,111,97,0.4)] transition-all duration-300 shadow-lg 
                      uppercase tracking-wide text-sm relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <Edit2 className="h-5 w-5 relative z-10" />
                    <span className="relative z-10">Edit Profile</span>
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Help Text */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6 text-sm text-[#9E9E9E] font-nunito"
          >
            Keep your profile updated for a personalized Sahayak experience ✨
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default UserProfile;