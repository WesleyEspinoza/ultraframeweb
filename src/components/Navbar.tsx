"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrandIcon from "@/components/BrandIcon";
import BetaBadge from "@/components/BetaBadge";
import { ClarityEvents } from "@/lib/clarity-events";
import { trackClarityEvent } from "@/lib/clarity";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const links = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Manage Devices", href: "/license/manage" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass border-b border-cyan-500/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group" aria-label="UltraFrame — go to top">
          <div className="relative" aria-hidden="true">
            <BrandIcon size={28} className="rounded-md" />
            <div className="absolute inset-0 blur-md bg-cyan-400 opacity-50 group-hover:opacity-80 transition-opacity rounded-md" />
          </div>
          <span className="font-display text-sm font-bold tracking-widest text-white uppercase">
            Ultra<span style={{ color: "var(--neon-cyan)" }}>Frame</span>
          </span>
          <BetaBadge />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8" role="list">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              role="listitem"
              onClick={() => {
                if (l.href === "/license/manage") {
                  trackClarityEvent(ClarityEvents.CTA_MANAGE_DEVICES);
                }
              }}
              className="text-sm text-slate-400 hover:text-white focus:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded transition-colors duration-200 font-mono tracking-wide relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300" style={{ backgroundColor: "var(--neon-cyan)" }} aria-hidden="true" />
            </a>
          ))}
          <a
            href="/checkout"
            onClick={() => trackClarityEvent(ClarityEvents.CTA_GET_NOW)}
            className="px-5 py-2 text-sm font-display font-semibold tracking-widest uppercase text-black rounded border transition-all duration-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400"
            style={{ background: "var(--neon-cyan)", borderColor: "var(--neon-cyan)", boxShadow: "0 0 20px rgba(0,245,255,0.3)" }}
          >
            Get Now
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-cyan-500/10 px-6 py-4 flex flex-col gap-4"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-slate-300 font-mono text-sm py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                onClick={() => {
                  if (l.href === "/license/manage") {
                    trackClarityEvent(ClarityEvents.CTA_MANAGE_DEVICES);
                  }
                  setOpen(false);
                }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="/checkout"
              className="px-5 py-2 text-sm font-display font-semibold tracking-widest uppercase text-black rounded text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400"
              style={{ background: "var(--neon-cyan)" }}
              onClick={() => {
                trackClarityEvent(ClarityEvents.CTA_GET_NOW);
                setOpen(false);
              }}
            >
              Get Now
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
