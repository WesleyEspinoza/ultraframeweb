"use client";

import {
  LicenseApiError,
  type LicenseDevice,
  activateLicenseDevice,
  listLicenseDevices,
  removeLicenseDevice,
} from "@/lib/license-api";
import { toUserError, UserErrors } from "@/lib/user-errors";
import { useCallback, useState } from "react";

export type UseLicenseManageResult = {
  devices: LicenseDevice[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  deviceLimitReached: boolean;
  loadDevices: () => Promise<boolean>;
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

  const loadDevices = useCallback(async (): Promise<boolean> => {
    if (!email.trim() || !licenseKey.trim()) {
      setError("Email and license key are required.");
      return false;
    }

    setLoading(true);
    setError(null);
    setDeviceLimitReached(false);

    try {
      const data = await listLicenseDevices(email.trim(), licenseKey.trim());
      setDevices(data.activeDevices ?? []);
      return true;
    } catch (e) {
      setDevices([]);
      setError(
        e instanceof LicenseApiError
          ? toUserError(e.message, UserErrors.licenseManage)
          : UserErrors.licenseManage
      );
      return false;
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
              ? toUserError(e.message, UserErrors.licenseActivate)
              : UserErrors.licenseActivate
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
            ? toUserError(e.message, UserErrors.licenseRemove)
            : UserErrors.licenseRemove
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
