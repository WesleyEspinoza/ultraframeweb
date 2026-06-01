import {
  INSTALLER_FILENAME,
  getVerifiedDownloadPath,
} from "@/lib/installer-download";
import { Download, KeyRound } from "lucide-react";
import Link from "next/link";

export default function LicenseActionButtons({
  sessionId,
  manageHref = "/license/manage",
}: {
  sessionId?: string | null;
  manageHref?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      {sessionId && (
        <a
          href={getVerifiedDownloadPath(sessionId)}
          className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-display text-xs font-bold tracking-widest uppercase text-black"
          style={{ background: "var(--neon-cyan, #00f5ff)" }}
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Download {INSTALLER_FILENAME}
        </a>
      )}
      <Link
        href={manageHref}
        className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg border border-cyan-400/40 text-cyan-300 font-display text-xs font-bold tracking-widest uppercase hover:bg-cyan-400/5 transition-colors"
      >
        <KeyRound className="w-4 h-4" aria-hidden="true" />
        Manage License
      </Link>
    </div>
  );
}
