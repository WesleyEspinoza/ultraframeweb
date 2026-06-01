import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type BackLinkProps = {
  href?: string;
  label?: string;
  className?: string;
};

export default function BackLink({
  href = "/",
  label = "Back to homepage",
  className = "",
}: BackLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded ${className}`}
    >
      <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
      {label}
    </Link>
  );
}
