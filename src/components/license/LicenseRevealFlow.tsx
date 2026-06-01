"use client";

import { useLicenseReveal } from "@/hooks/useLicenseReveal";
import { useLicenseSession } from "@/hooks/useLicenseSession";
import { ClarityEvents } from "@/lib/clarity-events";
import { clarityUpgradeSession, trackClarityEvent } from "@/lib/clarity";
import BackLink from "@/components/BackLink";
import { useEffect, useRef, useState } from "react";
import ErrorAlert from "./ErrorAlert";
import LicenseActionButtons from "./LicenseActionButtons";
import LicenseKeyDisplay from "./LicenseKeyDisplay";
import Spinner from "./Spinner";

type DeliveryStatus = {
  sent: boolean;
  maskedEmail: string | null;
};

export default function LicenseRevealFlow({ sessionId }: { sessionId: string | null }) {
  const { state, revealToken, error: sessionError, retry: retrySession } =
    useLicenseSession(sessionId);
  const { license, loading: revealLoading, error: revealError, expired } =
    useLicenseReveal(state === "token_received" ? revealToken : null);

  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus | null>(null);
  const [emailNotice, setEmailNotice] = useState<string | null>(null);

  const trackedRef = useRef<string | null>(null);
  const emailAttemptRef = useRef<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;
    void fetch(
      `/api/license/delivery-status?session_id=${encodeURIComponent(sessionId)}`,
      { cache: "no-store" }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          setDeliveryStatus({
            sent: Boolean(data.sent),
            maskedEmail: data.maskedEmail ?? null,
          });
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

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

  useEffect(() => {
    if (
      revealError &&
      sessionId &&
      (expired || /already revealed/i.test(revealError))
    ) {
      retrySession();
    }
  }, [revealError, expired, sessionId, retrySession]);

  useEffect(() => {
    if (!sessionId || !license) return;
    if (emailAttemptRef.current === license.key) return;
    emailAttemptRef.current = license.key;

    void fetch("/api/license/email-license", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, license }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.sent) {
          trackClarityEvent(ClarityEvents.LICENSE_EMAIL_SENT);
          setDeliveryStatus({
            sent: true,
            maskedEmail: data.maskedEmail ?? null,
          });
          setEmailNotice(
            data.maskedEmail
              ? `A copy of your license was sent to ${data.maskedEmail}.`
              : "A copy of your license was sent to your checkout email."
          );
        } else if (res.status === 202) {
          setEmailNotice("Your license will be emailed once it is ready.");
        }
      })
      .catch(() => {
        setEmailNotice(null);
      });
  }, [sessionId, license]);

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
        <p className="text-xs text-slate-600 font-mono">
          When your key is ready, we will email it to the address you used at checkout.
        </p>
      </div>
    );
  }

  if (state === "already_revealed") {
    const emailed = deliveryStatus?.sent && deliveryStatus.maskedEmail;
    return (
      <div className="space-y-6">
        <p className="text-slate-300 leading-relaxed">
          {emailed ? (
            <>
              Your license key was sent to{" "}
              <span className="text-cyan-400 font-mono">{deliveryStatus.maskedEmail}</span>. Check
              your inbox and spam folder.
            </>
          ) : (
            <>
              This license has already been revealed. Check the email you used at checkout, or{" "}
              <a href="/help" className="text-cyan-400 hover:text-cyan-300 underline">
                contact support
              </a>{" "}
              if you need help recovering access.
            </>
          )}
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
                ? `${revealError} If we emailed your key at checkout, check that inbox — otherwise use Manage License or Help.`
                : revealError
            }
          />
          <LicenseActionButtons sessionId={sessionId} />
        </div>
      );
    }

    if (license) {
      return (
        <div className="space-y-4">
          {emailNotice && (
            <p className="text-xs text-slate-500 font-mono text-center" role="status">
              {emailNotice}
            </p>
          )}
          <LicenseKeyDisplay license={license} sessionId={sessionId} />
        </div>
      );
    }
  }

  return <BackLink />;
}
