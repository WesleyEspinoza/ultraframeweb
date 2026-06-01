"use client";

import { ClarityEvents } from "@/lib/clarity-events";
import { trackClarityEvent } from "@/lib/clarity";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export default function HelpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          website: honeypot,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setState("error");
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setState("success");
      trackClarityEvent(ClarityEvents.HELP_FORM_SUBMIT);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setState("error");
      setErrorMessage("Network error. Check your connection and try again.");
    }
  }

  if (state === "success") {
    return (
      <div
        className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-6 text-center"
        role="status"
      >
        <p className="font-display text-sm font-bold uppercase tracking-widest text-white mb-2">
          Message sent
        </p>
        <p className="text-slate-400 text-sm leading-relaxed">
          Thanks for reaching out. We typically respond within one business day.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-6 text-xs font-mono text-cyan-400 hover:text-white transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4"
    >
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="help-website">Website</label>
        <input
          id="help-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="help-name" className="block text-xs font-mono text-slate-500 mb-1.5">
          Name
        </label>
        <input
          id="help-name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-slate-200 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="help-email" className="block text-xs font-mono text-slate-500 mb-1.5">
          Email
        </label>
        <input
          id="help-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-slate-200 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="help-subject" className="block text-xs font-mono text-slate-500 mb-1.5">
          Subject <span className="text-slate-600">(optional)</span>
        </label>
        <input
          id="help-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-slate-200 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          placeholder="License, install, billing…"
        />
      </div>

      <div>
        <label htmlFor="help-message" className="block text-xs font-mono text-slate-500 mb-1.5">
          Message
        </label>
        <textarea
          id="help-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-slate-200 text-sm resize-y min-h-[140px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          placeholder="Describe your issue or question…"
        />
      </div>

      {state === "error" && errorMessage && (
        <p className="text-sm text-red-400" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full py-3 rounded-lg font-display text-xs font-bold tracking-widest uppercase text-black disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ background: "var(--neon-cyan, #00f5ff)" }}
      >
        {state === "submitting" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );
}
