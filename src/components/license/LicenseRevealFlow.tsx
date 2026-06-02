"use client";

import { useLicenseReveal } from "@/hooks/useLicenseReveal";
import { useLicenseSession } from "@/hooks/useLicenseSession";
import { ClarityEvents } from "@/lib/clarity-events";
import { clarityUpgradeSession, trackClarityEvent } from "@/lib/clarity";
import type { RevealedLicense } from "@/lib/license-api";
import { UserErrors } from "@/lib/user-errors";
import BackLink from "@/components/BackLink";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSending, setEmailSending] = useState(false);

  const trackedRef = useRef<string | null>(null);
  const emailSentRef = useRef(false);

  const requestLicenseEmail = useCallback(
    async (licensePayload?: RevealedLicense) => {
      if (!sessionId || emailSentRef.current) return;

      setEmailSending(true);
      setEmailError(null);

      try {
        const res = await fetch("/api/license/email-license", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            ...(licensePayload ? { license: licensePayload } : {}),
          }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          sent?: boolean;
          maskedEmail?: string;
          error?: string;
          message?: string;
          pending?: boolean;
        };

        if (res.ok && data.sent) {
          emailSentRef.current = true;
          trackClarityEvent(ClarityEvents.LICENSE_EMAIL_SENT);
          setDeliveryStatus({
            sent: true,
            maskedEmail: data.maskedEmail ?? null,
          });
          setEmailNotice(
            data.maskedEmail
              ? `Your license was emailed to ${data.maskedEmail}.`
              : "Your license was emailed to your checkout address."
          );
          return;
        }

        if (res.status === 202 || data.pending) {
          setEmailNotice("Generating your license — we will email it shortly…");
          return;
        }

        setEmailError(data.error ?? data.message ?? UserErrors.licenseEmail);
      } catch {
        setEmailError("Unable to send your license email. Please try again in a few minutes.");
      } finally {
        setEmailSending(false);
      }
    },
    [sessionId]
  );

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
          const sent = Boolean(data.sent);
          setDeliveryStatus({
            sent,
            maskedEmail: data.maskedEmail ?? null,
          });
          if (sent) {
            emailSentRef.current = true;
            setEmailNotice(
              data.maskedEmail
                ? `Your license was emailed to ${data.maskedEmail}.`
                : "Your license was emailed to your checkout address."
            );
          }
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
    if (
      revealError &&
      sessionId &&
      (expired || /already revealed/i.test(revealError))
    ) {
      retrySession();
    }
  }, [revealError, expired, sessionId, retrySession]);

  useEffect(() => {
    if (!sessionId || emailSentRef.current) return;

    if (state === "pending") {
      void requestLicenseEmail();
      const intervalId = setInterval(() => {
        if (!emailSentRef.current) void requestLicenseEmail();
      }, 4000);
      return () => clearInterval(intervalId);
    }

    if (license) {
      void requestLicenseEmail(license);
    }
  }, [sessionId, state, license, requestLicenseEmail]);

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
          We will email your key to the address you used at checkout.
          {emailSending ? " Sending…" : ""}
        </p>
        {emailNotice && (
          <p className="text-xs text-slate-500 font-mono text-center" role="status">
            {emailNotice}
          </p>
        )}
        {emailError && (
          <div className="space-y-2">
            <p className="text-xs text-red-400" role="alert">
              {emailError}
            </p>
            <button
              type="button"
              onClick={() => void requestLicenseEmail()}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
            >
              Retry email
            </button>
          </div>
        )}
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
        {emailError && (
          <p className="text-xs text-red-400" role="alert">
            {emailError}
          </p>
        )}
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
          {emailError && (
            <div className="text-center space-y-2">
              <p className="text-xs text-red-400" role="alert">
                {emailError}
              </p>
              <button
                type="button"
                onClick={() => void requestLicenseEmail(license)}
                disabled={emailSending}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline disabled:opacity-50"
              >
                {emailSending ? "Sending…" : "Resend license email"}
              </button>
            </div>
          )}
          <LicenseKeyDisplay license={license} sessionId={sessionId} />
        </div>
      );
    }
  }

  return <BackLink />;
}
