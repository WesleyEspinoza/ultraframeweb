"use client";

import {
  INSTALLER_DOWNLOAD_URL,
  INSTALLER_FILENAME,
  getVerifiedDownloadPath,
} from "@/lib/installer-download";
import { ClarityEvents } from "@/lib/clarity-events";
import { trackClarityEvent } from "@/lib/clarity";
import { Download, KeyRound } from "lucide-react";
import Link from "next/link";

export default function LicenseActionButtons({
  sessionId,
  manageHref = "/license/manage",
  useDirectInstallerUrl = false,
}: {
  sessionId?: string | null;
  manageHref?: string;
  /** Manage page uses public installer URL after auth. */
  useDirectInstallerUrl?: boolean;
}) {
  const downloadHref = useDirectInstallerUrl
    ? INSTALLER_DOWNLOAD_URL
    : sessionId
      ? getVerifiedDownloadPath(sessionId)
      : null;

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      {downloadHref && (
        <a
          href={downloadHref}
          onClick={() => trackClarityEvent(ClarityEvents.INSTALLER_DOWNLOAD)}
          className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-display text-xs font-bold tracking-widest uppercase text-black"
          style={{ background: "var(--neon-cyan, #00f5ff)" }}
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Download {INSTALLER_FILENAME}
        </a>
      )}
      <Link
        href={manageHref}
        onClick={() => trackClarityEvent(ClarityEvents.CTA_MANAGE_DEVICES)}
        className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg border border-cyan-400/40 text-cyan-300 font-display text-xs font-bold tracking-widest uppercase hover:bg-cyan-400/5 transition-colors"
      >
        <KeyRound className="w-4 h-4" aria-hidden="true" />
        Manage License
      </Link>
    </div>
  );
}
