// @ts-nocheck

"use client";

import { useUser } from "@/context/userContext";
import { useSocket } from "@/hooks/useSocket";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ChatService = () => {
  const { receiverId } = useParams();
  const [messages, setMessages] = useState<{ from: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState();
  const { setUserFromContext } = useUser();
  const socket = useSocket();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("User from localStorage:", parsedUser);
      setUser(parsedUser);
      setUserFromContext(parsedUser);
    } else {
      console.log("No user found in localStorage");
    }
  }, []);

  // Fetch messages when receiver changes - FIXED: Added receiverId dependency
  useEffect(() => {
    if (!user?.id || !receiverId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        console.log(`Fetching messages with ${receiverId}`);
        const res = await axios.post("/api/getMessages", {
          senderId: user.id,
          receiverId,
        });

        const formatted = res.data.messages.map((m: any) => ({
          from: m.senderId,
          content: m.content,
        }));

        setMessages(formatted);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [receiverId, user?.id]);

  useEffect(() => {
    if (!socket || !user?.id || !receiverId) return;
    console.log("first");
    const handleMessage = (messageData: any) => {
      console.log("New message received:", messageData);

      setMessages((prev) => [...prev, messageData]);
    };
    // console.log("message received");
    socket.on("new-message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket, user?.id, receiverId]);
  console.log(messages);
  const sendMessage = async () => {
    if (!user || !user.id || !input.trim() || !receiverId) return;

    const messageContent = input.trim();

    try {
      const response = await axios.post("/api/sendMessage", {
        senderId: user.id,
        receiverId,
        content: messageContent,
      });

      // Add message immediately for better UX (optimistic update)
      const newMessage = { from: user.id, content: messageContent };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Show loading state if user data isn't ready
  if (!user?.id) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Chat with {receiverId}</h1>
          <button
            onClick={() => window.history.back()}
            className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <div className="text-center text-gray-500 py-8">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((m, i) => (
                <div
                  key={`${m.from}-${i}-${m.content}`}
                  className={`flex ${
                    m.from === user?.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[70%] ${
                      m.from === user?.id
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-white text-black border rounded-bl-md shadow-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Container */}
      <div className="bg-white border-t p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3">
            <input
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatService;
