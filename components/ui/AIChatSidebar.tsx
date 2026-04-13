"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

const AI_RESPONSES: Record<string, string> = {
  earthquake: "🌍 Based on USGS data, there have been several significant earthquakes recently. The Pacific Ring of Fire remains the most active zone. I'm tracking real-time seismic activity across all tectonic plates.",
  weather: "🌤️ Current global weather patterns show typical seasonal variations. Notable events include tropical activity in the Pacific and unusual temperature patterns in the Arctic region.",
  market: "📈 Global markets are showing mixed signals. Crypto markets have seen increased volatility, while traditional markets remain relatively stable. Key indicators suggest cautious optimism.",
  crypto: "₿ The cryptocurrency market cap is fluctuating. Bitcoin dominance remains strong, with altcoins showing varied performance. DeFi protocols continue to evolve rapidly.",
  space: "🚀 The ISS is currently orbiting at approximately 408 km altitude. Recent space missions include satellite deployments and ongoing Mars exploration data collection.",
  health: "🏥 Global health metrics show ongoing improvements in vaccination rates worldwide. Key areas of focus include pandemic preparedness and tropical disease prevention.",
  energy: "⚡ Global energy markets are transitioning. Renewable energy capacity continues to grow, with solar and wind leading the charge. Oil prices remain influenced by geopolitical factors.",
  climate: "🌡️ Climate data indicates continued warming trends. Arctic sea ice extent is being closely monitored, along with ocean temperature anomalies and atmospheric CO2 levels.",
  news: "📰 Today's major headlines span geopolitics, technology breakthroughs, and economic developments. I can provide detailed analysis on any specific topic.",
  default: "🧠 I'm Sapien Signal's AI assistant. I can help you understand world data, analyze trends, and provide insights across all data categories — weather, earthquakes, markets, health, space, energy, and more. What would you like to know?",
};

function getAIResponse(query: string): string {
  const q = query.toLowerCase();
  for (const [key, response] of Object.entries(AI_RESPONSES)) {
    if (key !== "default" && q.includes(key)) return response;
  }
  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    return "👋 Hello! I'm Sapien Signal AI. I can help you analyze world data, spot trends, and generate insights. Ask me anything about global metrics!";
  }
  if (q.includes("anomal") || q.includes("unusual") || q.includes("spike")) {
    return "⚡ Running anomaly detection across all data streams... I'm monitoring for unusual patterns in seismic activity, market movements, weather extremes, and more. Currently tracking several noteworthy deviations from baseline.";
  }
  if (q.includes("predict") || q.includes("forecast") || q.includes("future")) {
    return "📊 Based on current trends and historical patterns, I can provide predictive insights. Machine learning models suggest continued growth in renewable energy adoption, stable seismic patterns, and moderate market volatility in the near term.";
  }
  if (q.includes("summary") || q.includes("brief") || q.includes("overview")) {
    return "📋 **Today's Global Briefing:**\n• 🌍 3 significant earthquakes (M4.5+) in the past 24h\n• 📈 Markets showing moderate bullish sentiment\n• 🌡️ Above-average temperatures in 60% of monitored regions\n• 🚀 ISS completing 15.5 orbits daily\n• ⚡ Renewable energy hit new daily generation record";
  }
  return AI_RESPONSES.default;
}

const SUGGESTIONS = [
  "Give me today's summary",
  "Any earthquake anomalies?",
  "What's the market outlook?",
  "Predict tomorrow's trends",
  "Analyze climate data",
];

export default function AIChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: "welcome",
        role: "ai",
        content: "👋 Welcome to **Sapien Signal AI**! I can analyze real-time world data, detect anomalies, and provide intelligent insights. Ask me anything!",
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, messages.length]);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response with streaming effect
    setTimeout(() => {
      const response = getAIResponse(text);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(110,231,183,0.2), rgba(34,211,238,0.15))",
          border: "1px solid rgba(110,231,183,0.25)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(110,231,183,0.15)",
        }}
        whileHover={{ scale: 1.1, boxShadow: "0 12px 40px rgba(0,0,0,0.4), 0 0 30px rgba(110,231,183,0.25)" }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
      >
        <span className="text-2xl">🧠</span>
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-2xl" style={{ border: "2px solid rgba(110,231,183,0.3)", animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite" }} />
      </motion.button>

      {/* Chat sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col"
              style={{
                background: "rgba(10, 15, 26, 0.9)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                borderLeft: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
              }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, rgba(110,231,183,0.15), rgba(34,211,238,0.1))", border: "1px solid rgba(110,231,183,0.2)" }}>
                    <span className="text-lg">🧠</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-aurora">Sapien AI</div>
                    <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "rgba(110,231,183,0.7)" }}>
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px rgba(52,211,153,0.6)" }} />
                      Online · Analyzing data
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}
                >
                  ✕
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: "thin" }}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="max-w-[85%] rounded-2xl px-4 py-3"
                      style={msg.role === "user" ? {
                        background: "linear-gradient(135deg, rgba(110,231,183,0.15), rgba(34,211,238,0.1))",
                        border: "1px solid rgba(110,231,183,0.2)",
                      } : {
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div className="text-[13px] leading-relaxed whitespace-pre-line" style={{ color: msg.role === "user" ? "#f1f5f9" : "#cbd5e1" }}>
                        {msg.content}
                      </div>
                      <div className="mt-1.5 text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="mb-4 flex justify-start">
                    <div className="flex items-center gap-1.5 rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            background: "#6EE7B7",
                            animation: `skeletonDotBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 px-5 pb-3">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="rounded-xl px-3 py-1.5 text-[11px] font-medium transition-all hover:scale-105"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSubmit} className="border-t px-5 py-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Sapien AI anything..."
                    className="flex-1 bg-transparent text-sm focus:outline-none"
                    style={{ color: "#f1f5f9" }}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-110 disabled:opacity-30"
                    style={{ background: input.trim() ? "rgba(110,231,183,0.15)" : "transparent" }}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="#6EE7B7" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                  <span>Powered by Sapien Signal Intelligence</span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded px-1 py-0.5 font-mono" style={{ background: "rgba(255,255,255,0.06)" }}>⌘J</kbd>
                    toggle
                  </span>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
