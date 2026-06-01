export type EmailConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  toEmail: string;
  allowedOrigin: string | null;
};

function readEnvValue(name: string): string {
  let value = process.env[name]?.trim() ?? "";
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }
  return value;
}

/** Names of required env vars that are missing (for diagnostics only). */
export function getMissingEmailEnvVars(): string[] {
  const required = ["EMAIL_HOST", "EMAIL_USER", "EMAIL_PASS", "TO_EMAIL"] as const;
  return required.filter((key) => !readEnvValue(key));
}

export function getEmailConfig(): EmailConfig | null {
  const host = readEnvValue("EMAIL_HOST");
  const user = readEnvValue("EMAIL_USER");
  const pass = readEnvValue("EMAIL_PASS").replace(/\s+/g, "");
  const toEmail = readEnvValue("TO_EMAIL");

  if (!host || !user || !pass || !toEmail) {
    return null;
  }

  const port = Number(process.env.EMAIL_PORT ?? "465");
  if (!Number.isFinite(port) || port <= 0) {
    return null;
  }

  return {
    host,
    port,
    user,
    pass,
    toEmail,
    allowedOrigin: process.env.ALLOWED_ORIGIN?.trim() || null,
  };
}

export function isAllowedRequestOrigin(origin: string | null): boolean {
  const allowed = new Set<string>();

  const configured = process.env.ALLOWED_ORIGIN?.trim();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

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
