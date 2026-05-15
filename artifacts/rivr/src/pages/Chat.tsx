import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "wouter";
import { ArrowLeft, Send, Bot, User, Sparkles } from "lucide-react";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtItem,
  ChainOfThoughtStep,
  ChainOfThoughtTrigger,
} from "@/components/prompt-kit/chain-of-thought";
import {
  Source,
  SourceContent,
  SourceTrigger,
} from "@/components/prompt-kit/source";

interface ReasoningStep {
  title: string;
  items: string[];
}

interface SourceItem {
  href: string;
  title: string;
  description: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  reasoning?: ReasoningStep[];
  sources?: SourceItem[];
}

export default function Chat() {
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm RIVR AI — your DeFi guide. Ask me anything about smart vaults, staking, liquidity, or the RIVR ecosystem.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(
        `${import.meta.env.BASE_URL}api/chat`.replace(/\/\//g, "/"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        }
      );

      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message || "Sorry, I couldn't generate a response.",
          reasoning: data.reasoning || [],
          sources: data.sources || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-3 md:p-5 bg-[#f0f0f0]">
      <section className="relative w-full max-w-[1536px] h-full rounded-[1.5rem] md:rounded-[3rem] overflow-hidden flex flex-col bg-white/10">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-[65%] lg:object-center z-0"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4" />
        </video>

        <div className="relative z-10 flex flex-col h-full">
          {/* Navbar */}
          <nav className="flex items-center justify-between py-5 px-6 md:px-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-white/30 backdrop-blur-md border border-white/20 text-[rgba(30,50,90,0.9)] rounded-full px-4 py-2 hover:bg-white/50 transition-colors text-sm font-normal"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
            <div className="flex items-center gap-2 bg-white/30 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-[rgba(30,50,90,0.8)]" />
              <span className="text-sm font-normal text-[rgba(30,50,90,0.9)]">RIVR AI</span>
            </div>
            <div className="w-[72px]" />
          </nav>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-16 py-4 space-y-5 scrollbar-hide">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-[rgba(30,50,90,0.15)] backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-[rgba(30,50,90,0.8)]" />
                    </div>
                  )}

                  <div className={`flex flex-col gap-2 ${msg.role === "user" ? "items-end max-w-[70%]" : "items-start max-w-[75%]"}`}>
                    {/* Chain of thought — shown above assistant message */}
                    {msg.role === "assistant" && msg.reasoning && msg.reasoning.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                      >
                        <ChainOfThought>
                          {msg.reasoning.map((step, si) => (
                            <ChainOfThoughtStep key={si}>
                              <ChainOfThoughtTrigger>{step.title}</ChainOfThoughtTrigger>
                              <ChainOfThoughtContent>
                                {step.items.map((item, ii) => (
                                  <ChainOfThoughtItem key={ii}>{item}</ChainOfThoughtItem>
                                ))}
                              </ChainOfThoughtContent>
                            </ChainOfThoughtStep>
                          ))}
                        </ChainOfThought>
                      </motion.div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`px-4 py-3 rounded-[1.2rem] text-sm font-normal leading-relaxed backdrop-blur-md ${
                        msg.role === "user"
                          ? "bg-[rgba(30,50,90,0.75)] text-white rounded-br-sm"
                          : "bg-white/40 border border-white/20 text-[rgba(30,50,90,0.9)] rounded-bl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Sources — shown below assistant message */}
                    {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.15 }}
                        className="flex flex-wrap gap-1.5"
                      >
                        {msg.sources.map((src, si) => (
                          <Source key={si} href={src.href}>
                            <SourceTrigger showFavicon />
                            <SourceContent
                              title={src.title}
                              description={src.description}
                            />
                          </Source>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-[rgba(30,50,90,0.15)] backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-[rgba(30,50,90,0.8)]" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading: thinking indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-[rgba(30,50,90,0.15)] backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-[rgba(30,50,90,0.8)]" />
                  </div>
                  <div className="flex flex-col gap-2 max-w-[75%]">
                    <div className="rounded-xl border border-white/20 bg-white/20 backdrop-blur-sm px-3 py-2">
                      <div className="flex items-center gap-2 text-[12px] text-[rgba(30,50,90,0.55)]">
                        <span className="size-1.5 rounded-full bg-[rgba(30,50,90,0.35)] animate-pulse" />
                        <span>Thinking through your question…</span>
                      </div>
                    </div>
                    <div className="bg-white/40 border border-white/20 backdrop-blur-md px-4 py-3 rounded-[1.2rem] rounded-bl-sm flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 bg-[rgba(30,50,90,0.5)] rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="px-4 md:px-8 lg:px-16 pb-4 md:pb-6">
            <div className="relative bg-white/30 backdrop-blur-xl border border-white/25 rounded-[1.5rem] overflow-hidden">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about staking, vaults, yields, protocols…"
                rows={1}
                className="w-full bg-transparent px-5 py-4 pr-14 text-sm text-[rgba(30,50,90,0.9)] placeholder:text-[rgba(30,50,90,0.4)] font-normal resize-none focus:outline-none leading-relaxed"
                style={{ maxHeight: "120px" }}
              />
              <motion.button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-3 bottom-3 w-9 h-9 flex items-center justify-center rounded-full bg-[rgba(30,50,90,0.8)] hover:bg-[rgba(30,50,90,1)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 text-white" />
              </motion.button>
            </div>
            <p className="text-center text-[10px] text-[rgba(30,50,90,0.35)] mt-2 font-normal">
              Powered by Cerebras · Llama 3.1 8B
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
