const LIMITS = {
  name: 120,
  email: 254,
  subject: 200,
  message: 5000,
} as const;

export type HelpFormBody = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
};

export function parseHelpFormBody(
  body: unknown
): { ok: true; data: HelpFormBody } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const raw = body as Record<string, unknown>;

  if (typeof raw.website === "string" && raw.website.trim().length > 0) {
    return { ok: false, error: "Unable to send message." };
  }

  const name = trimString(raw.name);
  const email = trimString(raw.email);
  const subject = trimString(raw.subject) || "Support request";
  const message = trimString(raw.message);

  if (!name) return { ok: false, error: "Name is required." };
  if (!email) return { ok: false, error: "Email is required." };
  if (!message) return { ok: false, error: "Message is required." };

  if (name.length > LIMITS.name) return { ok: false, error: "Name is too long." };
  if (email.length > LIMITS.email) return { ok: false, error: "Email is too long." };
  if (subject.length > LIMITS.subject) return { ok: false, error: "Subject is too long." };
  if (message.length > LIMITS.message) return { ok: false, error: "Message is too long." };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  return {
    ok: true,
    data: { name, email, subject, message },
  };
}

function trimString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
