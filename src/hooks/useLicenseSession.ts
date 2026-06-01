"use client";

import {
  checkoutSessionValidationError,
  friendlyStripeSessionError,
} from "@/lib/checkout-session";
import {
  LicenseApiError,
  type LicenseSessionState,
  fetchLicenseSession,
} from "@/lib/license-api";
import { useCallback, useEffect, useRef, useState } from "react";

const POLL_MS = 2000;

export type UseLicenseSessionResult = {
  state: LicenseSessionState;
  revealToken: string | null;
  error: string | null;
  retry: () => void;
};

export function useLicenseSession(sessionId: string | null): UseLicenseSessionResult {
  const [state, setState] = useState<LicenseSessionState>("loading");
  const [revealToken, setRevealToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const tokenRef = useRef<string | null>(null);

  const retry = useCallback(() => {
    tokenRef.current = null;
    setRevealToken(null);
    setError(null);
    setState("loading");
    setTick((n) => n + 1);
  }, []);

  useEffect(() => {
    const validationError = checkoutSessionValidationError(sessionId);
    if (validationError || !sessionId) {
      setState("error");
      setError(validationError ?? "Missing checkout session.");
      return;
    }

    const checkoutSessionId = sessionId;
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const poll = async (): Promise<"stop" | "continue"> => {
      try {
        const result = await fetchLicenseSession(checkoutSessionId);
        if (cancelled) return "stop";

        if (result.state === "error") {
          setState("error");
          setError(result.message ?? "Unable to load license session.");
          return "stop";
        }

        if (result.state === "already_revealed") {
          setState("already_revealed");
          setRevealToken(null);
          tokenRef.current = null;
          return "stop";
        }

        if (result.state === "token_received" && result.revealToken) {
          setState("token_received");
          setRevealToken(result.revealToken);
          tokenRef.current = result.revealToken;
          return "stop";
        }

        setState("pending");
        setRevealToken(null);
        return "continue";
      } catch (e) {
        if (cancelled) return "stop";
        setState("error");
        const raw =
          e instanceof LicenseApiError
            ? e.message
            : "Network error while loading your license. Check your connection and try again.";
        setError(friendlyStripeSessionError(raw));
        return "stop";
      }
    };

    setState("loading");
    setError(null);
    void poll().then((action) => {
      if (cancelled || action === "stop") return;
      intervalId = setInterval(() => {
        void poll().then((next) => {
          if (next === "stop" && intervalId) clearInterval(intervalId);
        });
      }, POLL_MS);
    });

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [sessionId, tick]);

  return { state, revealToken, error, retry };
}
