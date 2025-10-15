"use client";
import { useAuth } from "@/context/userContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle } from "lucide-react";

interface UnreadItem {
  senderId: string;
  senderName: string;
  senderRole: string;
  unreadCount: number;
}

const UnreadMessagesPage = () => {
  const { user } = useAuth();
  const [unread, setUnread] = useState<UnreadItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) return;

    const fetchUnread = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/getUnreadMessages?userId=${user.id}`);
        setUnread(res.data.unreadMessages);
      } catch (error) {
        console.error("Failed to fetch unread messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnread();
  }, [user?.id]);

  if (!user?.id || loading) {
    return (
      <div className="flex justify-center items-center h-screen gap-4">
        <Loader2 className="animate-spin w-8 h-8 text-teal-500" />
        <span>Loading unread messages...</span>
      </div>
    );
  }

  if (unread.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <MessageCircle className="w-12 h-12 text-teal-400" />
        <h3 className="text-lg font-bold">No Unread Messages</h3>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Unread Messages</h2>
      {unread.map((item) => (
        <div
          key={item.senderId}
          className="flex justify-between items-center p-4 bg-white rounded-xl shadow cursor-pointer hover:bg-teal-50 transition"
          onClick={() => router.push(`/chat/${item.senderId}`)}
        >
          <div>
            <p className="font-semibold">{item.senderName}</p>
            <p className="text-sm text-gray-500">{item.senderRole}</p>
          </div>
          <span className="bg-teal-400 text-white px-3 py-1 rounded-full text-sm">
            {item.unreadCount}
          </span>
        </div>
      ))}
    </div>
  );
};

export default UnreadMessagesPage;
