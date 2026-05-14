import { useState, useRef, useEffect, useCallback } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { Send, Coffee, IceCream, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";

// --- Constants & Menu ---
const BRAND = "#C94B2A";
const CREAM = "#F5EFE6";
const CREAM2 = "#E8DDD1";
const DARK = "#1C1C1C";

const MENU = {
  "HOT BEVERAGES": [
    {item:"CAPPUCCINO",prices:{M:65,L:75}},{item:"CAFFE LATTE",prices:{M:65,L:75}},{item:"CAFFE LATTE SPANISH",prices:{M:65,L:90}},{item:"CINNAMON LATTE",prices:{M:65,L:75}},{item:"AMERICANO",prices:{M:55,L:60}},{item:"MOCHA",prices:{M:75,L:85}},{item:"WHITE CHOCOLATE MOCHA",prices:{M:75,L:85}},{item:"CARAMEL MACCHIATO",prices:{M:75,L:85}},{item:"HOT CHOCOLATE",prices:{M:65}},{item:"ESPRESSO",prices:{S:35,D:45}},{item:"RISTRETTO",prices:{S:40,D:45}},{item:"ESPRESSO MACCHIATO",prices:{S:45,D:50}},{item:"ESPRESSO MILK",prices:{S:40,D:50}},{item:"TURKISH COFFEE",prices:{S:35,D:45}},{item:"FRENCH COFFEE",price:50},{item:"HAZELNUT COFFEE",price:50},{item:"FLAT WHITE",price:80},{item:"HOT LOTUS",price:60},{item:"REGULAR TEA",price:30},{item:"FLAVOURED TEA",price:30},{item:"HERBS",price:30}
  ],
  "ICE BEVERAGES": [
    {item:"ICE CAPPUCCINO",price:75},{item:"ICE CAFFE LATTE",price:75},{item:"ICE LATTE SPANISH",price:80},{item:"ICE LATTE SPANISH SAUCE",price:90},{item:"ICE AMERICANO",price:65},{item:"ICE MOCHA",price:85},{item:"ICE WHITE CHOCOLATE MOCHA",price:85},{item:"ICE CHOCOLATE",price:75},{item:"ICE CARAMEL MACCHIATO",price:75}
  ],
  "FRAPPE": [
    {item:"ESPRESSO FRAPPE",price:80},{item:"CARAMEL ESPRESSO FRAPPE",price:85},{item:"MOCHA FRAPPE",price:85},{item:"WHITE CHOCOLATE MOCHA FRAPPE",price:85},{item:"COOKIES CARAMEL FRAPPE",price:100},{item:"VANILLA FRAPPE",price:70},{item:"CARAMEL FRAPPE",price:70},{item:"CHOCOLATE FRAPPE",price:70},{item:"PISTACHIO FRAPPE",price:95},{item:"LOTUS FRAPPE",price:75},{item:"KINDER FRAPPE",price:80},{item:"STRAWBERRY FRAPPE",price:75}
  ],
  "MILKSHAKE": [
    {item:"VANILLA MILKSHAKE",price:85},{item:"CARAMEL MILKSHAKE",price:85},{item:"CHOCOLATE MILKSHAKE",price:85},{item:"MANGO MILKSHAKE",price:85},{item:"STRAWBERRY MILKSHAKE",price:85},{item:"BLUEBERRY MILKSHAKE",price:85},{item:"OREO MILKSHAKE",price:85},{item:"LOTUS MILKSHAKE",price:85},{item:"PISTACHIO MILKSHAKE",price:100},{item:"KINDER MILKSHAKE",price:90},{item:"NUTELLA MILKSHAKE",price:85},{item:"COFFEE MILKSHAKE",price:85}
  ],
  "SMOOTHIE": [
    {item:"MANGO SMOOTHIE",price:65},{item:"MANGO PASSION SMOOTHIE",price:75},{item:"STRAWBERRY SMOOTHIE",price:65},{item:"PEACH SMOOTHIE",price:65},{item:"LEMON MINT SMOOTHIE",price:65},{item:"BLUEBERRY SMOOTHIE",price:65},{item:"WATERMELON SMOOTHIE",price:65},{item:"KIWI SMOOTHIE",price:65},{item:"TROPICAL SMOOTHIE",price:65}
  ],
  "BOBA": [
    {item:"BOBA TEA",price:80},{item:"BOBA BLUEBERRY",price:75},{item:"BOBA STRAWBERRY",price:75},{item:"BOBA OREO",price:80},{item:"BOBA MATCHA",price:75}
  ],
  "MATCHA": [
    {item:"MATCHA",price:50},{item:"MATCHA STRAWBERRY",price:55},{item:"MATCHA MANGO",price:55},{item:"MATCHA COCONUT",price:55},{item:"MATCHA LATTE",price:65}
  ],
  "MOJITO": [
    {item:"MOJITO CLASSIC",price:65},{item:"MOJITO RED BULL",price:70},{item:"MOJITO BLUEBERRY",price:65},{item:"MOJITO PASSION FRUIT",price:75},{item:"MOJITO KIWI",price:65},{item:"MOJITO PEACH",price:65},{item:"MOJITO STRAWBERRY",price:65}
  ],
  "PROTEIN SHAKE": [
    {item:"CHOCOLATE BANANA SHAKE",price:95},{item:"CHOCOLATE PEANUT BUTTER SHAKE",price:100},{item:"CHOCOLATE COFFEE SHAKE",price:100},{item:"CHOCOLATE COCONUT SHAKE",price:95}
  ],
  "WAFFLE": [
    {item:"CHOCOLATE WAFFLE",price:85},{item:"CARAMEL WAFFLE",price:85},{item:"LOTUS WAFFLE",price:85},{item:"PISTACHIO WAFFLE",price:120},{item:"NUTELLA WAFFLE",price:85},{item:"KINDER WAFFLE",price:90},{item:"FOUR SEASON WAFFLE",price:100}
  ],
  "PANCAKE": [
    {item:"CHOCOLATE PANCAKE",price:75},{item:"CARAMEL PANCAKE",price:75},{item:"NUTELLA PANCAKE",price:75},{item:"PISTACHIO PANCAKE",price:100},{item:"LOTUS PANCAKE",price:75},{item:"KINDER PANCAKE",price:90}
  ],
  "CROISSANT": [
    {item:"PLAIN CROISSANT",price:60},{item:"CHEESE CROISSANT",price:95},{item:"TRIPLE CHEESE CROISSANT",price:85},{item:"TURKEY CROISSANT",price:85},{item:"BEEF CROISSANT",price:80},{item:"NUTELLA CROISSANT",price:80},{item:"LOTUS CROISSANT",price:80},{item:"PISTACHIO CROISSANT",price:120},{item:"CHOCOLATE CROISSANT",price:80},{item:"CARAMEL CROISSANT",price:80},{item:"STRAWBERRY CROISSANT",price:80}
  ],
  "SANDWICH": [
    {item:"TURKEY WRAP",price:85},{item:"BEEF WRAP",price:95},{item:"CHICKEN WRAP",price:85},{item:"CURRY SANDWICH",price:95},{item:"BEEF SANDWICH",price:85},{item:"TURKEY SANDWICH",price:80},{item:"TUNA SANDWICH",price:85},{item:"TANDOORI SANDWICH",price:85},{item:"BARBECUE SANDWICH",price:85},{item:"CLUB SANDWICH",price:95},{item:"TRIPLE CHEESE SANDWICH",price:95}
  ],
  "SOFT DRINK": [
    {item:"SMALL WATER",price:10},{item:"MOUSY",price:45},{item:"RED BULL",price:65},{item:"MANGO JUICE",price:50},{item:"ORANGE JUICE",price:50},{item:"STRAWBERRY JUICE",price:50},{item:"GUAVA JUICE",price:50}
  ],
  "ADDITION": [
    {item:"SAUCE (CHOCOLATE - CARAMEL - STRAWBERRY - NUTELLA - LOTUS)",price:20},{item:"SAUCE (PISTACHIO - KINDER)",price:40},{item:"ESPRESSO",price:30},{item:"BOBA",price:35},{item:"TOPPING",price:20},{item:"FLAVOR",price:20},{item:"WHIPPED CREAM",price:10},{item:"ICE CREAM",price:15},{item:"MILK",price:15}
  ]
};

const SYS = `You are "Double Zero Barista AI", the official intelligent café assistant for a modern youth café brand called "Double Zero".

BRAND: Double Zero is a modern Gen Z café brand — energy, creativity, social vibes, trendy café culture.
SLOGAN: "Everything's better when it's Double"
CRITICAL: Always write the brand name as "Double Zero". Never "Double 0" or "00".

LANGUAGE: Auto-detect user language. Support English, Arabic (Egyptian dialect preferred — natural, not formal), and mixed. If Arabic, sound like a real barista not a textbook.

ROLE: You are NOT a chatbot. You are a real barista assistant delivering a premium digital café experience.

YOUR JOB:
- Understand customer taste
- Ask smart 1–2 questions at a time (sweet/bitter/balanced, hot/cold, coffee/refreshing/dessert, strong/light, mood)
- Recommend ONLY 2–3 items from the menu
- Always explain WHY based on user preference
- Keep it short and natural — never generic

UPSELLING: After a recommendation, suggest ONE complementary item. Must match flavor profile. Must feel natural, never pushy. If user declines → stop immediately.
Use phrases like: "This would go really well with..." / "لو حابب تكمل التجربة 👌"

MEMORY: Track taste preference, temperature, mood, drink type. Update dynamically and reference naturally: "Since you like strong coffee..." / "بما إنك بتحب الحاجات السويت..."

MENU RULES — CRITICAL:
- ONLY recommend items from the menu below
- NEVER invent items
- NEVER suggest external café items
- If something is not in menu: say it's not available and suggest the closest alternative FROM menu only

MENU:
${JSON.stringify(MENU)}`;

// --- Helpers ---
const hasArabic = (t: string) => /[\u0600-\u06FF]/.test(t);

function Logo({ h = 36 }) {
  const w = h * 1.55;
  return (
    <svg width={w} height={h} viewBox="0 0 93 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="34" height="52" rx="17" stroke={BRAND} strokeWidth="9"/>
      <rect x="55" y="4" width="34" height="52" rx="17" stroke={BRAND} strokeWidth="9"/>
    </svg>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.div
      animate={{ translateY: [0, -7, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, delay, ease: "easeInOut" }}
      style={{ width: 7, height: 7, borderRadius: "50%", background: BRAND }}
    />
  );
}

const CHIPS = [
  { label: "☕ Coffee",        msg: "I want coffee" },
  { label: "🧊 Iced",          msg: "I want something iced" },
  { label: "🧋 Boba",          msg: "I want boba" },
  { label: "🥤 Smoothie",      msg: "I want a smoothie" },
  { label: "🥞 Waffle/Pancake",msg: "I want a waffle or pancake" },
  { label: "🥐 Croissant",     msg: "I want a croissant" },
  { label: "🥪 Sandwich",      msg: "I want a sandwich" },
  { label: "💪 Protein",       msg: "I want a protein shake" },
  { label: "🫖 Matcha",        msg: "I want matcha" },
  { label: "🍹 Mojito",        msg: "I want a mojito" },
];

const WELCOME = "أهلاً بيك في Double Zero ☕\nمزاجك رايح لسويت، سترونج، ولا حاجة منعشة؟\n\nWelcome to Double Zero ☕\nSweet, strong, or refreshing? Let's find your perfect match.";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// --- Main Component ---
export default function App() {
  const [phase, setPhase]     = useState<"splash" | "chat">("splash");
  const [msgs,  setMsgs]      = useState<Message[]>([]);
  const [input, setInput]     = useState("");
  const [busy,  setBusy]      = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const endRef     = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  // Gemini AI Instance
  const ai = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    // Check if process.env.GEMINI_API_KEY is available
    const apiKey = typeof process.env !== 'undefined' ? process.env.GEMINI_API_KEY : undefined;
    
    if (!apiKey) {
      setError("Gemini API key is missing. If you're using Vercel, please add GEMINI_API_KEY to your Environment Variables.\n\nالمفتاح مش موجود. لو شغال على Vercel، اتأكد إنك ضفت GEMINI_API_KEY في الـ Settings.");
      return;
    }
    ai.current = new GoogleGenAI({ apiKey: apiKey });
  }, []);

  // Seed welcome message
  useEffect(() => {
    if (phase === "chat" && msgs.length === 0) {
      setMsgs([{ role: "assistant", content: WELCOME }]);
    }
  }, [phase, msgs.length]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy]);

  const send = useCallback(async (text?: string) => {
    const t = (text || input).trim();
    if (!t || busy) return;

    if (!ai.current) {
      setError("AI Service not initialized. Please ensure your GEMINI_API_KEY is correctly set in your environment variables.\n\nالخدمة مش جاهزة. اتأكد إن مفتاح الـ API مضاف صح في إعدادات المشروع.");
      return;
    }

    setError(null);
    const next: Message[] = [...msgs, { role: "user", content: t }];
    setMsgs(next);
    setInput("");
    setBusy(true);

    try {
      const response = await ai.current.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: next.map(m => ({ 
          role: m.role === "user" ? "user" : "model", 
          parts: [{ text: m.content }] 
        })),
        config: {
          systemInstruction: SYS,
          temperature: 0.7,
        }
      });

      const reply = response.text || "مفيش رد، جرب تاني 🙏\nNo response received, please try again.";
      setMsgs(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      console.error("AI Error:", err);
      const friendly = err.message?.includes("API_KEY_INVALID")
        ? "أوبس! في مشكلة في الـ API Key. تأكد إنه شغال في الإعدادات.\nCheck your API key in Settings > Secrets."
        : `حصل خطأ: ${err.message}\nError occurred. Please try again.`;
      setError(friendly);
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [busy, input, msgs]);

  // --- Splash Screen ---
  if (phase === "splash") return (
    <div className="h-screen bg-[var(--cream)] flex flex-col items-center justify-center gap-7 p-8 animate-[dz-splash_0.7s_ease] max-w-[520px] mx-auto overflow-hidden relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Logo h={88} />
      </motion.div>
      <div className="text-center leading-none">
        <h1 className="text-[42px] font-[900] text-[var(--dark)] tracking-[-1.5px]">Double Zero</h1>
        <p className="text-[12px] color-[var(--brand)] font-[700] tracking-[4px] uppercase mt-2">Barista AI</p>
      </div>
      <p className="text-[14px] text-[#999] italic text-center">
        "Everything's better when it's Double"
      </p>
      <div className="flex flex-col gap-2.5 mt-2 w-full max-w-[260px]">
        <motion.button
          whileHover={{ scale: 1.03, translateY: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setPhase("chat")}
          className="bg-[var(--brand)] text-white border-none rounded-[50px] py-[15px] px-0 text-[16px] font-[700] cursor-pointer shadow-[0_10px_30px_rgba(201,75,42,0.25)] transition-all w-full"
        >
          Start Order ☕
        </motion.button>
        <p className="text-center text-[12px] text-[#bbb]">🌍 English · العربية · Mixed</p>
      </div>

      {/* decoration */}
      <div className="fixed -top-14 -right-14 w-[200px] h-[200px] rounded-full bg-[rgba(201,75,42,0.04)] pointer-events-none" />
      <div className="fixed -bottom-20 -left-20 w-[280px] h-[280px] rounded-full bg-[rgba(201,75,42,0.03)] pointer-events-none" />
    </div>
  );

  // --- Chat Screen ---
  return (
    <div className="h-screen flex flex-col bg-[var(--cream)] max-w-[520px] mx-auto shadow-[0_0_60px_rgba(0,0,0,0.12)] relative overflow-hidden font-sans">
      
      {/* Header */}
      <header className="px-[18px] py-[12px] flex items-center gap-3 bg-white border-b border-[var(--cream-2)] shadow-[0_2px_12px_rgba(0,0,0,0.06)] z-10">
        <Logo h={30} />
        <div className="flex-1">
          <h2 className="font-[900] text-[15px] text-[var(--dark)] tracking-[-0.3px]">Double Zero</h2>
          <p className="text-[10px] text-[var(--brand)] font-[700] tracking-[2px] uppercase">Barista AI</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-[7px] h-[7px] rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-[11px] text-[#22c55e] font-[600]">Online</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-[18px_14px] flex flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {msgs.map((m, i) => {
            const arab = hasArabic(m.content);
            const isUser = m.role === "user";
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}
              >
                {!isUser && (
                  <div className="w-[30px] h-[30px] rounded-full bg-[var(--cream)] border-2 border-[var(--cream-2)] flex items-center justify-center shrink-0">
                    <Coffee size={14} color={BRAND} />
                  </div>
                )}
                <div 
                  className={`max-w-[74%] p-[11px_15px] ${isUser ? 'rounded-[18px_18px_4px_18px] bg-[var(--brand)] text-white shadow-[0_4px_16px_rgba(201,75,42,0.2)]' : 'rounded-[18px_18px_18px_4px] bg-white text-[var(--dark)] shadow-[0_2px_10px_rgba(0,0,0,0.07)]'} text-[14px] leading-[1.65] break-words whitespace-pre-wrap`}
                  style={{ 
                    direction: arab ? "rtl" : "ltr", 
                    textAlign: arab ? "right" : "left" 
                  }}
                >
                  {m.content}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {busy && (
          <div className="flex items-end gap-2 animate-[dz-in_0.3s_ease]">
            <div className="w-[30px] h-[30px] rounded-full bg-[var(--cream)] border-2 border-[var(--cream-2)] flex items-center justify-center shrink-0">
              <Coffee size={14} color={BRAND} />
            </div>
            <div className="p-[13px_18px] bg-white rounded-[18px_18px_18px_4px] shadow-[0_2px_10px_rgba(0,0,0,0.07)] flex gap-1 items-center">
              <Dot delay={0} /><Dot delay={0.18} /><Dot delay={0.36} />
            </div>
          </div>
        )}

        {error && (
          <div className="bg-[#fff0ee] border border-[rgba(201,75,42,0.2)] rounded-xl p-[10px_14px] text-[13px] text-[var(--brand)] flex items-center justify-between gap-2 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="bg-transparent border-none cursor-pointer text-[var(--brand)] font-bold text-sm"
            >✕</button>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Recommendations Chips */}
      <div className="dz-chips flex gap-[7px] overflow-x-auto p-[8px_14px] bg-white border-t border-[var(--cream-2)] scrollbar-hide">
        {CHIPS.map((c) => (
          <button
            key={c.label}
            onClick={() => send(c.msg)}
            disabled={busy}
            className="dz-chip shrink-0 px-[14px] py-[6px] rounded-full border-[1.5px] border-[var(--brand)] bg-transparent text-[var(--brand)] text-[12px] font-[600] cursor-pointer transition-all disabled:opacity-45 disabled:cursor-default whitespace-nowrap"
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex gap-[9px] p-[10px_14px_12px] bg-white border-t border-[var(--cream-2)]">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && !busy && send()}
          placeholder="What are you in the mood for? ☕"
          disabled={busy}
          className="flex-1 px-4 py-[11px] rounded-full border-[1.5px] border-[var(--cream-2)] bg-[var(--cream)] text-[13.5px] text-[var(--dark)] outline-none focus:border-[var(--brand)] transition-colors disabled:opacity-70"
        />
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => send()}
          disabled={busy || !input.trim()}
          className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center transition-all shadow-[0_4px_14px_rgba(201,75,42,0.2)] disabled:bg-[var(--cream-2)] disabled:shadow-none bg-[var(--brand)] text-white`}
        >
          {busy ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
        </motion.button>
      </div>

    </div>
  );
}
