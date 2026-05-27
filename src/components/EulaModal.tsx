"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface EulaModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EulaModal({ open, onClose }: EulaModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Focus the close button when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => closeRef.current?.focus(), 50);
    }
  }, [open]);

  // Trap focus within modal and close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      const modal = overlayRef.current;
      if (!modal) return;
      const focusable = modal.querySelectorAll<HTMLElement>(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const SECTIONS = [
    { title: "1. Parties and Software", body: "This End User License Agreement (the Agreement) is between you and SoftwareRefresh for use of the UltraFrame software, including installers, updates, scripts, and related documentation (collectively, the Software)." },
    { title: "2. License Grant", body: "Subject to your compliance with this Agreement, SoftwareRefresh grants you a limited, non-exclusive, non-transferable, revocable license to install and use the Software for lawful personal use on the number of devices covered by your purchased plan." },
    { title: "3. Restrictions", body: "You may not: reverse engineer, decompile, or disassemble the Software except where expressly permitted by law; remove or alter proprietary notices; use the Software for unlawful or harmful activities; or redistribute the Software without prior written permission from SoftwareRefresh." },
    { title: "4. System Modifications and Your Responsibility", body: "UltraFrame applies targeted Windows configuration changes at your instruction. While we design UltraFrame to create a restore point before making changes, system modifications carry inherent risk. You are responsible for maintaining your own backups and recovery readiness. Use the Software at your own risk. SoftwareRefresh is not responsible for data loss, system instability, compatibility issues, or other consequences from changes applied at your direction." },
    { title: "5. Third-Party Components", body: "The Software may rely on third-party software and services, each governed by its own terms. SoftwareRefresh is not responsible for third-party components or their behavior." },
    { title: "6. No Professional Advice", body: "UltraFrame is a system configuration tool. It does not provide legal, financial, medical, cybersecurity, or other professional advice." },
    { title: "7. Disclaimer of Warranties", body: "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SOFTWARE IS PROVIDED AS-IS AND AS-AVAILABLE, WITH ALL FAULTS AND WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. SOFTWAREREFRESH DOES NOT WARRANT THAT THE SOFTWARE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR COMPATIBLE WITH YOUR SPECIFIC SYSTEM." },
    { title: "8. Limitation of Liability", body: "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL SOFTWAREREFRESH BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF DATA, PROFITS, OR GOODWILL. TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS WILL NOT EXCEED THE GREATER OF (A) USD $50 OR (B) THE AMOUNT YOU PAID FOR THE SOFTWARE IN THE 12 MONTHS PRECEDING THE CLAIM." },
    { title: "9. Indemnification", body: "You agree to defend, indemnify, and hold harmless SoftwareRefresh and its officers, employees, and contractors from claims, liabilities, damages, and expenses (including reasonable attorneys fees) arising from your use or misuse of the Software or your violation of this Agreement." },
    { title: "10. Export and Compliance", body: "You agree to comply with all applicable export control, sanctions, and trade laws and regulations when using or distributing the Software." },
    { title: "11. Termination", body: "This Agreement remains in effect until terminated. It terminates automatically if you violate its terms. Upon termination, you must stop using and delete all copies of the Software." },
    { title: "12. Updates", body: "SoftwareRefresh may release updates or modify the Software at any time. Continued use after an update constitutes acceptance of any revised terms." },
    { title: "13. Governing Law and Venue", body: "This Agreement is governed by the laws of the State of Delaware, USA, excluding conflict-of-law rules. Any dispute will be resolved exclusively in state or federal courts in Delaware, and you consent to personal jurisdiction there." },
    { title: "14. Entire Agreement", body: "This Agreement is the entire agreement between you and SoftwareRefresh regarding the Software. If any provision is found unenforceable, the remaining provisions remain in full force. Failure to enforce any provision is not a waiver." },
    { title: "15. Contact", body: "For support or legal inquiries, contact SoftwareRefresh through official distribution channels listed on our website." },
  ];

  return (
    <AnimatePresence>
      {open && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="eula-title"
          aria-describedby="eula-description"
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-8"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border overflow-hidden"
            style={{ background: "var(--dark-900)", borderColor: "rgba(0,245,255,0.15)", boxShadow: "0 0 80px rgba(0,245,255,0.08), 0 25px 60px rgba(0,0,0,0.7)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div>
                <h2 id="eula-title" className="font-display text-sm font-bold uppercase tracking-widest text-white">
                  End User License Agreement
                </h2>
                <p id="eula-description" className="text-xs text-slate-600 font-mono mt-0.5">
                  UltraFrame Software · SoftwareRefresh
                </p>
              </div>
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close license agreement"
                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6" tabIndex={0} aria-label="License agreement text — scroll to read">
              <p className="text-xs font-mono text-slate-500 leading-relaxed p-3 rounded-lg border" style={{ borderColor: "rgba(0,245,255,0.1)", background: "rgba(0,245,255,0.03)" }}>
                <strong className="text-slate-300">IMPORTANT:</strong> By installing, copying, accessing, or using the Software, you agree to be bound by this Agreement. If you do not agree, do not install or use the Software.
              </p>

              {SECTIONS.map((s, i) => (
                <div key={i}>
                  <h3 className="font-display text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--neon-cyan)" }}>
                    {s.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{s.body}</p>
                </div>
              ))}

              <div className="pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <p className="text-xs text-slate-600 font-mono leading-relaxed">
                  BY CLICKING "I ACCEPT" OR CONTINUING INSTALLATION OR USE, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTOOD THIS AGREEMENT AND AGREE TO BE LEGALLY BOUND BY ITS TERMS.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex-shrink-0 flex items-center justify-between gap-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <p className="text-xs text-slate-600 font-mono">Last updated: 2025</p>
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-display font-bold tracking-widest uppercase text-black rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400"
                style={{ background: "var(--neon-cyan)" }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
