"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Navbar from "../../../components/navbar";
import SidebarMenu from "../../../components/sidebarmenu";

export default function Home() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input } as const;
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: input,
      });

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.reply } as const;
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage = {
        sender: "bot",
        text: "Bir hata oluştu. Lütfen tekrar deneyin.",
      } as const;
      setMessages((prev) => [...prev, botMessage]);
    }

    setInput("");
  };

  return (
    <div className="bg-gradient-to-br from-[#1f1c2c] via-[#302b63] to-[#24243e] text-white min-h-screen flex">
      {/* Sidebar */}
      <SidebarMenu isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-gray-900 bg-opacity-95 fixed top-0 left-0 w-full z-50">
          <Navbar toggleSidebar={toggleSidebar} />
        </div>

        {/* Chat Container */}
        <div className="flex flex-col items-center justify-start w-full max-w-5xl mx-auto mt-20 px-6 pb-10 pt-6 z-0">
          <div className="w-full flex-1 bg-gray-800 bg-opacity-90 rounded-lg shadow-2xl border border-gray-600 p-6">
            {/* Chat Area */}
            <div className="flex-1 flex flex-col space-y-4 h-[400px] w-full px-4 overflow-y-auto bg-gray-700 bg-opacity-50 text-white border border-gray-600 rounded-md scroll-smooth">
              {!messages.length && (
                <div className="m-auto text-gray-400 text-center">
                  <p className="text-lg font-semibold">Merhaba! Size nasıl yardımcı olabilirim?</p>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} w-full`}
                >
                  <div
                    className={`max-w-sm px-4 py-2 rounded-lg shadow-md ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white border border-blue-500 hover:bg-blue-500"
                        : "bg-purple-600 text-white border border-purple-500 hover:bg-purple-500"
                    } transition-all`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input + Send */}
            <div className="mt-6 flex items-center space-x-4">
              <input
                type="text"
                className="flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="Mesajınızı yazın..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg border border-blue-700 hover:bg-blue-500 hover:shadow-lg transition-all"
                onClick={handleSend}
              >
                Gönder
              </button>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-center space-x-6">
              <button
                className="px-6 py-3 bg-[#660066] text-white rounded-md shadow-md hover:bg-purple-800 transition-all"
                onClick={() => router.replace("/document")}
              >
                Belge Oluştur
              </button>
              <button
                className="px-6 py-3 bg-[#191970] text-white rounded-md shadow-md hover:bg-blue-800 transition-all"
              >
                Belge İncele
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}