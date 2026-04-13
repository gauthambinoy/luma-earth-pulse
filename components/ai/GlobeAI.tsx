"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** Voice command hook for globe navigation */
export function useVoiceCommand(onCommand: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setTranscript(text);
      if (event.results[0].isFinal) {
        onCommand(text);
        setIsListening(false);
      }
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, [onCommand]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, transcript, startListening, stopListening };
}

/** Parse voice commands to extract location */
export function parseVoiceCommand(text: string): { action: string; location?: string } | null {
  const lower = text.toLowerCase().trim();

  // "fly me to [location]" / "go to [location]" / "show me [location]" / "zoom to [location]"
  const flyMatch = lower.match(/(?:fly\s*(?:me\s*)?to|go\s*to|show\s*(?:me\s*)?|zoom\s*(?:in\s*)?(?:to|on)?)\s+(.+)/);
  if (flyMatch) return { action: "flyTo", location: flyMatch[1] };

  // "zoom out" / "zoom in"
  if (lower.includes("zoom out")) return { action: "zoomOut" };
  if (lower.includes("zoom in")) return { action: "zoomIn" };

  // "rotate" / "spin"
  if (lower.includes("rotate") || lower.includes("spin")) return { action: "rotate" };

  // "stop" / "pause"
  if (lower.includes("stop") || lower.includes("pause")) return { action: "stop" };

  return null;
}

// Common city coordinates for voice commands
export const CITY_COORDS: Record<string, { lat: number; lon: number; name: string }> = {
  "new york": { lat: 40.7128, lon: -74.006, name: "New York" },
  "tokyo": { lat: 35.6762, lon: 139.6503, name: "Tokyo" },
  "london": { lat: 51.5074, lon: -0.1278, name: "London" },
  "paris": { lat: 48.8566, lon: 2.3522, name: "Paris" },
  "dubai": { lat: 25.2048, lon: 55.2708, name: "Dubai" },
  "sydney": { lat: -33.8688, lon: 151.2093, name: "Sydney" },
  "singapore": { lat: 1.3521, lon: 103.8198, name: "Singapore" },
  "mumbai": { lat: 19.076, lon: 72.8777, name: "Mumbai" },
  "san francisco": { lat: 37.7749, lon: -122.4194, name: "San Francisco" },
  "berlin": { lat: 52.52, lon: 13.405, name: "Berlin" },
  "moscow": { lat: 55.7558, lon: 37.6173, name: "Moscow" },
  "beijing": { lat: 39.9042, lon: 116.4074, name: "Beijing" },
  "cairo": { lat: 30.0444, lon: 31.2357, name: "Cairo" },
  "rio": { lat: -22.9068, lon: -43.1729, name: "Rio de Janeiro" },
  "los angeles": { lat: 34.0522, lon: -118.2437, name: "Los Angeles" },
  "rome": { lat: 41.9028, lon: 12.4964, name: "Rome" },
  "seoul": { lat: 37.5665, lon: 126.978, name: "Seoul" },
  "istanbul": { lat: 41.0082, lon: 28.9784, name: "Istanbul" },
  "hong kong": { lat: 22.3193, lon: 114.1694, name: "Hong Kong" },
  "toronto": { lat: 43.6532, lon: -79.3832, name: "Toronto" },
};

export function findCity(query: string): { lat: number; lon: number; name: string } | null {
  const q = query.toLowerCase().trim();
  for (const [key, city] of Object.entries(CITY_COORDS)) {
    if (q.includes(key)) return city;
  }
  return null;
}

/** Globe Story Mode — narrated world tour */
export interface StoryStop {
  location: { lat: number; lon: number };
  name: string;
  narration: string;
  icon: string;
  duration: number; // seconds to stay
}

export const WORLD_TOUR_STOPS: StoryStop[] = [
  { location: { lat: 40.7128, lon: -74.006 }, name: "New York City", narration: "The financial capital of the world. Wall Street drives global markets, with $22.3 trillion in traded value daily.", icon: "🗽", duration: 6 },
  { location: { lat: 35.6762, lon: 139.6503 }, name: "Tokyo", narration: "The world's most populous metropolitan area with 37.4 million people. Japan leads in robotics and technological innovation.", icon: "🗼", duration: 6 },
  { location: { lat: -33.8688, lon: 151.2093 }, name: "Sydney", narration: "Gateway to the Pacific. Australia's economy is driven by mining, services, and agriculture, contributing significantly to global commodities.", icon: "🦘", duration: 6 },
  { location: { lat: 25.2048, lon: 55.2708 }, name: "Dubai", narration: "From desert to megalopolis in 50 years. The UAE is a global hub for trade, tourism, and renewable energy investment.", icon: "🏙️", duration: 6 },
  { location: { lat: 51.5074, lon: -0.1278 }, name: "London", narration: "A global financial center and cultural hub. The UK's economy is the 6th largest, with London processing $2.7 trillion in forex daily.", icon: "🇬🇧", duration: 6 },
  { location: { lat: -22.9068, lon: -43.1729 }, name: "Rio de Janeiro", narration: "Heart of South America. Brazil is the world's largest producer of coffee, sugarcane, and a major crude oil exporter.", icon: "🌴", duration: 6 },
  { location: { lat: 1.3521, lon: 103.8198 }, name: "Singapore", narration: "The Lion City — world's busiest transshipment port. A tech hub with one of the highest GDP per capita globally.", icon: "🦁", duration: 6 },
  { location: { lat: 30.0444, lon: 31.2357 }, name: "Cairo", narration: "Where ancient meets modern. Egypt's strategic position at the Suez Canal makes it vital for global trade, handling 12% of world trade.", icon: "🏛️", duration: 6 },
];

export function useStoryMode() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStop, setCurrentStop] = useState(0);
  const [narrationText, setNarrationText] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const play = useCallback(() => {
    setIsPlaying(true);
    setCurrentStop(0);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentStop(0);
    setNarrationText("");
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const nextStop = useCallback(() => {
    setCurrentStop((prev) => {
      const next = prev + 1;
      if (next >= WORLD_TOUR_STOPS.length) {
        setIsPlaying(false);
        return 0;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const stopData = WORLD_TOUR_STOPS[currentStop];
    if (!stopData) { setIsPlaying(false); return; }

    setNarrationText(stopData.narration);
    timerRef.current = setTimeout(nextStop, stopData.duration * 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, currentStop, nextStop]);

  return {
    isPlaying,
    currentStop: WORLD_TOUR_STOPS[currentStop],
    narrationText,
    progress: currentStop / WORLD_TOUR_STOPS.length,
    play,
    stop,
    nextStop,
  };
}

/** Voice command floating button */
export function VoiceCommandButton({ onCommand }: { onCommand: (text: string) => void }) {
  const { isListening, transcript, startListening, stopListening } = useVoiceCommand(onCommand);

  return (
    <div className="relative">
      <motion.button
        onClick={isListening ? stopListening : startListening}
        className="flex h-10 w-10 items-center justify-center rounded-xl transition-all"
        style={{
          background: isListening ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${isListening ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)"}`,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Voice Command (say 'Fly me to Tokyo')"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke={isListening ? "#EF4444" : "#cbd5e1"} strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        {isListening && (
          <div className="absolute inset-0 rounded-xl" style={{ border: "2px solid rgba(239,68,68,0.4)", animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
        )}
      </motion.button>

      {/* Transcript overlay */}
      <AnimatePresence>
        {isListening && transcript && (
          <motion.div
            className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-xl px-4 py-2"
            style={{
              background: "rgba(10,15,26,0.9)",
              border: "1px solid rgba(239,68,68,0.2)",
              backdropFilter: "blur(20px)",
            }}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span className="text-xs font-medium" style={{ color: "#f1f5f9" }}>{transcript}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Story mode narration overlay */
export function StoryNarrationOverlay({ stop, narration, progress, onStop }: { stop: StoryStop; narration: string; progress: number; onStop: () => void }) {
  return (
    <motion.div
      className="fixed bottom-6 left-1/2 z-40 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl"
      style={{
        background: "rgba(10, 15, 26, 0.9)",
        backdropFilter: "blur(30px)",
        border: "1px solid rgba(110,231,183,0.15)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.5), 0 0 30px rgba(110,231,183,0.08)",
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      {/* Progress bar */}
      <div className="h-0.5 w-full" style={{ background: "rgba(255,255,255,0.05)" }}>
        <motion.div
          className="h-full"
          style={{ background: "linear-gradient(90deg, #6EE7B7, #22D3EE)" }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="px-5 py-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{stop.icon}</span>
            <span className="text-sm font-bold text-aurora">{stop.name}</span>
          </div>
          <button
            onClick={onStop}
            className="rounded-lg px-3 py-1 text-[10px] font-semibold transition-all hover:scale-105"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Stop Tour
          </button>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "#cbd5e1" }}>{narration}</p>
      </div>
    </motion.div>
  );
}
