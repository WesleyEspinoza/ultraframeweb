export type EmailConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  toEmail: string;
  allowedOrigin: string | null;
};

/** Read env at runtime — bracket access avoids Next.js inlining undefined at build time. */
function readRuntimeEnv(name: string): string {
  const raw = process.env[name] ?? "";
  let value = typeof raw === "string" ? raw.trim() : "";
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }
  return value;
}

function readFirstRuntimeEnv(names: string[]): string {
  for (const name of names) {
    const value = readRuntimeEnv(name);
    if (value) return value;
  }
  return "";
}

export function isHostedRuntime(): boolean {
  return Boolean(
    process.env.NETLIFY ||
      process.env.NETLIFY_DEV ||
      process.env.CONTEXT ||
      process.env.NETLIFY_SITE_ID ||
      process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME
  );
}

const EMAIL_ENV_KEYS = [
  { key: "EMAIL_HOST", aliases: ["SMTP_HOST"] },
  { key: "EMAIL_USER", aliases: ["SMTP_USER"] },
  { key: "EMAIL_PASS", aliases: ["SMTP_PASS", "SMTP_PASSWORD"] },
  { key: "TO_EMAIL", aliases: ["EMAIL_TO", "SMTP_TO"] },
] as const;

/** Names of required env vars that are missing (for diagnostics only). */
export function getMissingEmailEnvVars(): string[] {
  return EMAIL_ENV_KEYS.filter(({ key, aliases }) => !readFirstRuntimeEnv([key, ...aliases])).map(
    ({ key }) => key
  );
}

function resolveEmailPort(): number {
  const raw = readFirstRuntimeEnv(["EMAIL_PORT", "SMTP_PORT"]);
  if (!raw) return 465;
  const port = Number(raw);
  if (!Number.isFinite(port) || port <= 0) return 465;
  return port;
}

export function getEmailConfig(): EmailConfig | null {
  const host = readFirstRuntimeEnv(["EMAIL_HOST", "SMTP_HOST"]);
  const user = readFirstRuntimeEnv(["EMAIL_USER", "SMTP_USER"]);
  const pass = readFirstRuntimeEnv(["EMAIL_PASS", "SMTP_PASS", "SMTP_PASSWORD"]).replace(
    /\s+/g,
    ""
  );
  const toEmail = readFirstRuntimeEnv(["TO_EMAIL", "EMAIL_TO", "SMTP_TO"]);

  if (!host || !user || !pass || !toEmail) {
    return null;
  }

  return {
    host,
    port: resolveEmailPort(),
    user,
    pass,
    toEmail,
    allowedOrigin: readRuntimeEnv("ALLOWED_ORIGIN") || null,
  };
}

import { UserErrors } from "@/lib/user-errors";

export function getEmailConfigErrorMessage(context: "help" | "license" = "license"): string {
  return context === "help" ? UserErrors.helpUnavailable : UserErrors.licenseEmail;
}

export function isAllowedRequestOrigin(origin: string | null): boolean {
  const allowed = new Set<string>();

  const configured = readRuntimeEnv("ALLOWED_ORIGIN");
  const appUrl = readRuntimeEnv("NEXT_PUBLIC_APP_URL");

  if (configured) allowed.add(configured);
  if (appUrl) allowed.add(appUrl);

  if (process.env.NODE_ENV === "development") {
    allowed.add("http://localhost:3000");
    allowed.add("http://127.0.0.1:3000");
  }

  if (allowed.size === 0) return true;
  if (!origin) return true;

  return allowed.has(origin);
}
