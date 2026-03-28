"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
  source?: string;
  suggestion?: string;
}

const EXAMPLES = [
  "Bitcoin price",
  "Earthquakes today",
  "Weather in Tokyo",
  "Top countries by population",
  "ISS position",
  "GDP of India",
  "Trending repos",
  "How many APIs",
  "Currency exchange rates",
  "COVID global stats",
];

export default function AIQueryTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (query: string) => {
    if (!query.trim() || loading) return;
    const q = query.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || data.error || "No response",
          source: data.source,
          suggestion: data.suggestion,
        },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Failed to process query. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col">
      {/* Header */}
      <div className="mb-4 text-center">
        <div className="mb-2 text-3xl">🤖</div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Ask <span className="text-gradient">Anything</span>
        </h2>
        <p className="mt-1 text-base" style={{ color: "var(--text-tertiary)" }}>
          Natural language queries across all dashboard data sources
        </p>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-2xl border p-6"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6">
            <div className="text-lg font-semibold" style={{ color: "var(--text-tertiary)" }}>
              Try asking a question...
            </div>
            <div className="flex max-w-lg flex-wrap justify-center gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => send(ex)}
                  className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)", background: "var(--bg-secondary)" }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                      msg.role === "user" ? "rounded-br-md" : "rounded-bl-md"
                    }`}
                    style={{
                      background: msg.role === "user" ? "var(--accent)" : "var(--bg-secondary)",
                      color: msg.role === "user" ? "#fff" : "var(--text-primary)",
                    }}
                  >
                    <div className="whitespace-pre-wrap text-[15px] leading-relaxed">{msg.content}</div>
                    {msg.source && (
                      <div className="mt-2 rounded-xl px-3 py-1.5 text-xs font-medium"
                        style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
                        📡 Source: {msg.source}
                      </div>
                    )}
                    {msg.suggestion && (
                      <div className="mt-2 text-sm" style={{ color: msg.role === "user" ? "rgba(255,255,255,0.7)" : "var(--text-tertiary)" }}>
                        💡 {msg.suggestion}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md px-5 py-3" style={{ background: "var(--bg-secondary)" }}>
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-2.5 w-2.5 rounded-full animate-pulse-slow" style={{ background: "var(--accent)", animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask about weather, earthquakes, crypto, GDP, ISS, APIs..."
          className="flex-1 rounded-2xl border px-5 py-3.5 text-base focus:outline-none"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-primary)" }}
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          className="rounded-2xl px-6 py-3.5 text-base font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-50"
          style={{ background: "var(--accent)" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
