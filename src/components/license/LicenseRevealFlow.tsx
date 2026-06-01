"use client";

import { useLicenseReveal } from "@/hooks/useLicenseReveal";
import { useLicenseSession } from "@/hooks/useLicenseSession";
import { ClarityEvents } from "@/lib/clarity-events";
import { clarityUpgradeSession, trackClarityEvent } from "@/lib/clarity";
import Link from "next/link";
import { useEffect, useRef } from "react";
import ErrorAlert from "./ErrorAlert";
import LicenseActionButtons from "./LicenseActionButtons";
import LicenseKeyDisplay from "./LicenseKeyDisplay";
import Spinner from "./Spinner";

export default function LicenseRevealFlow({ sessionId }: { sessionId: string | null }) {
  const { state, revealToken, error: sessionError, retry: retrySession } =
    useLicenseSession(sessionId);
  const { license, loading: revealLoading, error: revealError, expired } =
    useLicenseReveal(state === "token_received" ? revealToken : null);

  const trackedRef = useRef<string | null>(null);

  useEffect(() => {
    if (license && trackedRef.current !== license.key) {
      trackedRef.current = license.key;
      trackClarityEvent(ClarityEvents.LICENSE_REVEALED);
      trackClarityEvent(ClarityEvents.PURCHASE_SUCCESS);
      clarityUpgradeSession("license_revealed");
    }
  }, [license]);

  useEffect(() => {
    if (state === "already_revealed") {
      trackClarityEvent(ClarityEvents.LICENSE_ALREADY_REVEALED);
    }
  }, [state]);

  useEffect(() => {
    if (revealError) {
      trackClarityEvent(ClarityEvents.LICENSE_REVEAL_ERROR);
    }
  }, [revealError]);

  if (!sessionId) {
    return (
      <ErrorAlert message="Missing checkout session. Complete checkout through Stripe to receive your license." />
    );
  }

  if (state === "loading") {
    return <Spinner label="Confirming your purchase" />;
  }

  if (state === "error" && sessionError) {
    return (
      <div className="space-y-4">
        <ErrorAlert message={sessionError} onRetry={retrySession} />
        <LicenseActionButtons sessionId={null} />
      </div>
    );
  }

  if (state === "pending") {
    return (
      <div className="space-y-4">
        <Spinner label="Generating your license" />
        <p className="text-slate-400 text-sm leading-relaxed">
          Payment confirmed. Generating your license…
        </p>
        <p className="text-xs text-slate-600 font-mono">This usually takes a few seconds.</p>
      </div>
    );
  }

  if (state === "already_revealed") {
    return (
      <div className="space-y-6">
        <p className="text-slate-300 leading-relaxed">
          This license has already been revealed. Use the email from your purchase to manage devices,
          or contact support if you need help recovering access.
        </p>
        <LicenseActionButtons sessionId={sessionId} />
      </div>
    );
  }

  if (state === "token_received") {
    if (revealLoading) {
      return <Spinner label="Revealing your license" />;
    }

    if (revealError) {
      return (
        <div className="space-y-4">
          <ErrorAlert
            message={
              expired
                ? `${revealError} Use Manage License if you saved your key earlier.`
                : revealError
            }
          />
          <LicenseActionButtons sessionId={sessionId} />
        </div>
      );
    }

    if (license) {
      return <LicenseKeyDisplay license={license} sessionId={sessionId} />;
    }
  }

  return (
    <p className="text-slate-500 text-sm">
      <Link href="/" className="text-cyan-400 hover:underline">
        Return to homepage
      </Link>
    </p>
  );
}
