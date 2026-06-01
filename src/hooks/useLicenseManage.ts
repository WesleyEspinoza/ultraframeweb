"use client";

import {
  LicenseApiError,
  type LicenseDevice,
  activateLicenseDevice,
  listLicenseDevices,
  removeLicenseDevice,
} from "@/lib/license-api";
import { useCallback, useState } from "react";

export type UseLicenseManageResult = {
  devices: LicenseDevice[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  deviceLimitReached: boolean;
  loadDevices: () => Promise<void>;
  activateDevice: (machineId: string) => Promise<boolean>;
  removeDevice: (machineId: string) => Promise<boolean>;
  clearError: () => void;
};

export function useLicenseManage(
  email: string,
  licenseKey: string
): UseLicenseManageResult {
  const [devices, setDevices] = useState<LicenseDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceLimitReached, setDeviceLimitReached] = useState(false);

  const clearError = useCallback(() => setError(null), []);

  const loadDevices = useCallback(async () => {
    if (!email.trim() || !licenseKey.trim()) {
      setError("Email and license key are required.");
      return;
    }

    setLoading(true);
    setError(null);
    setDeviceLimitReached(false);

    try {
      const data = await listLicenseDevices(email.trim(), licenseKey.trim());
      setDevices(data.activeDevices ?? []);
    } catch (e) {
      setDevices([]);
      setError(
        e instanceof LicenseApiError
          ? e.message
          : "Unable to load devices. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, [email, licenseKey]);

  const activateDevice = useCallback(
    async (machineId: string): Promise<boolean> => {
      if (!machineId.trim()) {
        setError("Machine ID is required.");
        return false;
      }

      setActionLoading(true);
      setError(null);
      setDeviceLimitReached(false);

      try {
        const data = await activateLicenseDevice(
          email.trim(),
          licenseKey.trim(),
          machineId.trim()
        );
        setDevices(data.activeDevices ?? []);
        return true;
      } catch (e) {
        if (e instanceof LicenseApiError && e.status === 403) {
          setDeviceLimitReached(true);
          setError("This license already has 3 active devices. Remove one to add another.");
        } else {
          setError(
            e instanceof LicenseApiError
              ? e.message
              : "Unable to activate device. Please try again."
          );
        }
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [email, licenseKey]
  );

  const removeDevice = useCallback(
    async (machineId: string): Promise<boolean> => {
      setActionLoading(true);
      setError(null);

      try {
        const data = await removeLicenseDevice(
          email.trim(),
          licenseKey.trim(),
          machineId
        );
        setDevices(data.activeDevices ?? []);
        return true;
      } catch (e) {
        setError(
          e instanceof LicenseApiError
            ? e.message
            : "Unable to remove device. Please try again."
        );
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [email, licenseKey]
  );

  return {
    devices,
    loading,
    actionLoading,
    error,
    deviceLimitReached,
    loadDevices,
    activateDevice,
    removeDevice,
    clearError,
  };
}
