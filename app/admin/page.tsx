"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Users, Grid, UserCog, LogOut, UserIcon } from "lucide-react";
import ServicesContent from "@/components/custom/ServiceContent";
import UsersContent from "@/components/custom/UserContent";
import ProvidersContent from "@/components/custom/ProviderContent";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AdminData {
  email: string;
  role: string;
  userId: string;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("services");
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [admin, setAdmin] = useState<AdminData>({
    email: "",
    role: "",
    userId: "",
  });
  console.log({ isAddServiceOpen, isEditServiceOpen, selectedService });
  const getMe = async () => {
    try {
      const response = await axios.get("/api/admin/auth/getMe");
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
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="mt-6 flex-grow">
            {navItems.map((item) => (
              <Button
                key={item.value}
                variant={activeTab === item.value ? "secondary" : "ghost"}
                className="w-full justify-start p-4 mb-2"
                onClick={() => setActiveTab(item.value)}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <Avatar className="h-10 w-10 flex justify-center items-center">
                <UserIcon />
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">{admin.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleAdminLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Card className="mb-8">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome, Admin
            </h1>
            <p className="text-gray-600">
              Manage your services, users, and providers from this dashboard.
            </p>
          </CardContent>
        </Card>

        <Tabs value={activeTab} className="space-y-4">
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
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
