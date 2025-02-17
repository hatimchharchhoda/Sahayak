// @ts-nocheck

"use client";

import type React from "react";

import { useState, useEffect, type FormEvent } from "react";
import { MessageSquare, X, Send, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const ChatbotInterface: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages) as Message[]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: input,
          chatHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data: { response: string } = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: data.response,
          sender: "bot",
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "I apologize, but I'm having trouble connecting right now. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    localStorage.removeItem("chatHistory");
    setMessages([]);
  };

  const formatBotResponse = (text: string) => {
    // Remove all asterisks
    text = text.replace(/\*/g, "");

    const lines = text.split("\n");
    return lines
      .map((line, index) => {
        line = line.trim();
        if (!line) return null;

        if (line.startsWith("- ")) {
          return (
            <li key={index} className="ml-4 mb-2 text-gray-700">
              {line.substring(2)}
            </li>
          );
        }
        if (line.includes(":")) {
          const [title, content] = line.split(":");
          return (
            <p key={index} className="mb-2">
              <span className="font-semibold text-blue-700">{title}:</span>
              <span className="text-gray-700">{content}</span>
            </p>
          );
        }
        return (
          <p key={index} className="mb-2 text-gray-700">
            {line}
          </p>
        );
      })
      .filter(Boolean);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-600 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110"
          >
            <MessageSquare className="w-8 h-8 text-white" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-6 bottom-6 w-96 h-[600px] bg-white rounded-3xl shadow-2xl z-40 flex flex-col overflow-hidden border border-gray-200"
          >
            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">SAHAYAK</h3>
                  <p className="text-sm opacity-90">
                    Your Home Services Assistant
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 text-white rounded-full"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center text-gray-600 mt-8">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-blue-600 opacity-50" />
                  <p className="text-lg font-medium">
                    Namaste! How can I assist you today?
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    } shadow-md`}
                  >
                    {message.sender === "user" ? (
                      <p className="text-white">{message.text}</p>
                    ) : (
                      <div className="prose prose-sm max-w-full">
                        {formatBotResponse(message.text)}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex items-center justify-start space-x-2 p-4 bg-white rounded-2xl shadow-md">
                  <p className="text-gray-600 font-medium">
                    Sahayak is thinking
                  </p>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 focus:ring-2 focus:ring-blue-600"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-4"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>

            <Button
              onClick={handleClearChat}
              className="absolute top-20 right-6 bg-red-600 hover:bg-red-600 text-white rounded-full p-2"
              title="Clear chat history"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotInterface;
