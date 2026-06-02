"use client";

import {
  LicenseApiError,
  type RevealedLicense,
  revealLicense,
} from "@/lib/license-api";
import { toUserError, UserErrors } from "@/lib/user-errors";
import { useEffect, useRef, useState } from "react";

export type UseLicenseRevealResult = {
  license: RevealedLicense | null;
  loading: boolean;
  error: string | null;
  expired: boolean;
};

/**
 * Reveals the license once when a token is available.
 * Token and key are kept in memory only — never persisted.
 */
export function useLicenseReveal(revealToken: string | null): UseLicenseRevealResult {
  const [license, setLicense] = useState<RevealedLicense | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const attemptedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!revealToken) return;
    if (attemptedRef.current === revealToken) return;
    attemptedRef.current = revealToken;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setExpired(false);
    setLicense(null);

    void revealLicense(revealToken)
      .then((data) => {
        if (!cancelled) setLicense(data);
      })
      .catch((e) => {
        if (cancelled) return;
        const message =
          e instanceof LicenseApiError
            ? toUserError(e.message, UserErrors.licenseReveal)
            : UserErrors.licenseReveal;
        const isExpired =
          e instanceof LicenseApiError &&
          (e.status === 401 ||
            e.status === 403 ||
            /expired|invalid token|already revealed/i.test(message));
        setExpired(isExpired);
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [revealToken]);

  return { license, loading, error, expired };
}
