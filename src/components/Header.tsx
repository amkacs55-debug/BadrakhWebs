"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, MessageCircle, ShieldCheck } from "lucide-react";

export default function Header() {
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md border-b border-slate-800/50 transition-all duration-300 ${
        scrolled ? "bg-[#060B18]/90 shadow-lg shadow-black/20" : "bg-[#060B18]/80"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-100">
                Pubg Accounts MN
              </h1>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-800/40">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] font-semibold text-blue-300 uppercase tracking-wider">
                Verified
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a
              href="https://www.facebook.com/share/18zFCFvwCw/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 hover:bg-blue-600/25 hover:text-blue-300 transition-all duration-200"
              aria-label="Messenger"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
