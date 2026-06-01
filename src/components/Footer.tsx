"use client";
import { useState } from "react";
import BrandIcon from "@/components/BrandIcon";
import EulaModal from "./EulaModal";

export default function Footer() {
  const [eulaOpen, setEulaOpen] = useState(false);

  const links: { label: string; action?: () => void; href?: string }[] = [
    { label: "Manage Devices", href: "/license/manage" },
    { label: "Privacy", href: "#" },
    { label: "Terms", action: () => setEulaOpen(true) },
    { label: "Contact", href: "#" },
  ];

  return (
    <>
      <EulaModal open={eulaOpen} onClose={() => setEulaOpen(false)} />

      <footer className="border-t border-slate-900 py-10 px-6" role="contentinfo">
        {/* Main footer row */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          {/* Wordmark */}
          <div className="flex items-center gap-2">
            <BrandIcon size={20} className="rounded-sm" />
            <span className="font-display text-xs tracking-widest uppercase text-white">
              Ultra<span style={{ color: "var(--neon-cyan)" }}>Frame</span>
            </span>
          </div>

          {/* Copyright */}
          <p className="text-slate-700 text-xs font-mono text-center">
            © {new Date().getFullYear()} UltraFrame · SoftwareRefresh · All rights reserved
          </p>

          {/* Legal nav */}
          <nav aria-label="Legal links">
            <ul className="flex gap-6 list-none p-0 m-0">
              {links.map((l) => (
                <li key={l.label}>
                  {l.action ? (
                    <button
                      onClick={l.action}
                      className="text-slate-700 hover:text-slate-400 focus:text-slate-400 text-xs font-mono transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                    >
                      {l.label}
                    </button>
                  ) : (
                    <a
                      href={l.href}
                      className="text-slate-700 hover:text-slate-400 text-xs font-mono transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                    >
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Legal disclaimer */}
        <div className="max-w-7xl mx-auto border-t border-slate-900 pt-5">
          <p className="text-slate-800 text-xs font-mono leading-relaxed text-center max-w-4xl mx-auto">
            UltraFrame is a Windows configuration tool currently in public beta; features and behavior may change as updates ship.
            Results vary by system hardware, software configuration, and usage. Individual results are not guaranteed.
            Use at your own risk. Always maintain backups before applying system changes.
            UltraFrame is not affiliated with or endorsed by Microsoft Corporation.
            Windows is a registered trademark of Microsoft Corporation.
          </p>
        </div>

        {/* Powered by row */}
        <div className="max-w-7xl mx-auto mt-6 flex justify-end">
          <a
            href="https://softwarerefresh.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-slate-800 hover:text-slate-500 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded group"
            aria-label="Powered by SoftwareRefresh — opens in a new tab"
          >
            <span className="text-xs font-mono tracking-widest">Powered by</span>
            <span className="text-xs font-display font-bold tracking-widest uppercase group-hover:text-slate-400 transition-colors" style={{ color: "inherit" }}>
              SoftwareRefresh
            </span>
          </a>
        </div>
      </footer>
    </>
  );
}
