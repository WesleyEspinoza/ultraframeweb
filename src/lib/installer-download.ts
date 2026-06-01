export const INSTALLER_DOWNLOAD_URL =
  process.env.INSTALLER_DOWNLOAD_URL?.trim() ||
  "https://api.softwarerefresh.com/ultraframe/installer/download";

export const INSTALLER_FILENAME = "UltraFrame-Setup-1.0.0.exe";

/** Verified download entry point (checks Stripe payment before redirecting). */
export function getVerifiedDownloadPath(sessionId: string): string {
  return `/api/installer/download?session_id=${encodeURIComponent(sessionId)}`;
}
