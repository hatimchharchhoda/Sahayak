// @ts-nocheck
"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Loader2 } from "lucide-react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    const newMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post<{ response?: string }>("/api/chatbot", {
        question: input,
      });
      const aiResponse =
        response.data.response || "I'm sorry, I couldn't understand that.";

      setMessages((prev) => [...prev, { text: aiResponse, sender: "bot" }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { text: "An error occurred. Please try again.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#E0F7FA] to-[#80DEEA] transition-all duration-300">
      {/* Chat Header */}
      <div className="bg-white shadow-md border-b border-gray-200 px-4 py-3 flex items-center justify-center">
        <h2 className="text-lg font-poppins font-semibold text-[#212121]">
          AI Chatbot
        </h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-2xl shadow-md transition-all duration-200 transform hover:scale-102 ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-teal-400 to-lime-400 text-white"
                  : "bg-white text-[#212121] border border-gray-200"
              }`}
            >
              <p className="font-nunito break-words">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-lime-50 border-2 border-lime-200 px-4 py-2 rounded-2xl shadow-md animate-pulse">
              <p className="font-nunito text-[#616161]">Typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0 shadow-lg">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1 p-3 border-2 border-gray-200 rounded-2xl font-nunito focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent placeholder-gray-500 transition-all duration-200"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className={`p-3 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-md font-poppins font-bold text-white ${
              input.trim()
                ? "bg-gradient-to-br from-teal-400 to-lime-400"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;