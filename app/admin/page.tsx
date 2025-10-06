// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Users, Grid, UserCog, LogOut, UserIcon, Ticket } from "lucide-react";
import ServicesContent from "@/components/custom/ServiceContent";
import UsersContent from "@/components/custom/UserContent";
import ProvidersContent from "@/components/custom/ProviderContent";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import axios from "axios";
import { useRouter } from "next/navigation";
import TicketsContent from "@/components/custom/TicketsContent";
import ServiceCategoryContent from "@/components/custom/ServiceCategoryContent";

interface AdminData {
  email: string;
  role: string;
  userId: string;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [admin, setAdmin] = useState<AdminData>({
    email: "",
    role: "",
    userId: "",
  });

  const getMe = async () => {
    try {
      const response = await axios.get("/api/admin/auth/getMe", { withCredentials: true });
      setAdmin(response.data.user);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMe();
  }, []);

  const handleAdminLogout = async () => {
    try {
      const response = await axios.get("/api/admin/auth/logout");
      if (response.status === 200) {
        router.push("/auth");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navItems = [
    { icon: Grid, label: "Services", value: "services" },
    { icon: Users, label: "Users", value: "users" },
    { icon: UserCog, label: "Providers", value: "providers" },
    { icon: Ticket, label: "Tickets", value: "tickets" },
    { icon: Grid, label: "Service Categories", value: "categories" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#3A0CA3] flex text-[#F8F9FA] font-poppins animate-fade-in-up">
      {/* Sidebar */}
      <div className="w-64 bg-[#0D1B2A]/80 backdrop-blur-xl shadow-lg h-screen sticky top-0 flex flex-col border-r border-[#9D4EDD]/40 animate-slide-in-left">
        <div className="p-6 border-b border-[#9D4EDD]/40">
          <h2 className="text-2xl font-inter font-bold tracking-widest uppercase text-[#9D4EDD]">Admin Panel</h2>
        </div>
        <nav className="mt-6 flex-grow space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.value}
              variant="ghost"
              className={`w-full justify-start p-4 rounded-xl transition-all duration-300 ${
                activeTab === item.value
                  ? "bg-gradient-to-r from-[#00F5D4] to-cyan-400 text-[#0D1B2A] font-bold shadow-[0_0_12px_#00F5D4]"
                  : "text-[#ADB5BD] hover:bg-[#1B263B] hover:text-[#9D4EDD]"
              }`}
              onClick={() => setActiveTab(item.value)}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>
        <div className="p-4 border-t border-[#9D4EDD]/40">
          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10 flex justify-center items-center bg-[#1B263B] text-[#00F5D4]">
              <UserIcon />
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium font-inter">Admin User</p>
              <p className="text-xs text-[#ADB5BD]">{admin.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start border border-[#9D4EDD] hover:text-[#9D4EDD] bg-[#9D4EDD] text-white transition-all"
            onClick={handleAdminLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-6 overflow-y-auto">
        <Card className="bg-[#1B263B]/60 backdrop-blur-md shadow-lg border-t-4 border-[#00F5D4] hover:scale-[1.02] hover:shadow-[0_0_15px_#00F5D4] transition-all">
          <CardContent className="p-6">
            <h1 className="text-3xl font-inter font-bold uppercase tracking-widest text-[#9D4EDD] mb-2">
              Welcome, Admin
            </h1>
            <p className="text-[#ADB5BD] font-poppins">
              Manage your services, users, and providers from this dashboard.
            </p>
          </CardContent>
        </Card>

        <Tabs value={activeTab} className="space-y-6">
          <TabsContent value="services">
            <ServicesContent
              setIsAddServiceOpen={setIsAddServiceOpen}
              onEditService={(service) => {
                setSelectedService(service);
                setIsEditServiceOpen(true);
              }}
            />
          </TabsContent>

          <TabsContent value="users">
            <UsersContent />
          </TabsContent>

          <TabsContent value="providers">
            <ProvidersContent />
          </TabsContent>

          <TabsContent value="tickets">
            <TicketsContent />
          </TabsContent>

          <TabsContent value="categories">
            <ServiceCategoryContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;