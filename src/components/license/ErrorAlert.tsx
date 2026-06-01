import { AlertCircle } from "lucide-react";

export default function ErrorAlert({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="rounded-lg border border-red-400/30 bg-red-400/5 px-4 py-3 text-sm text-red-300 flex gap-3"
      role="alert"
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        <p>{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-xs font-semibold uppercase tracking-wider text-red-200 hover:text-white underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
