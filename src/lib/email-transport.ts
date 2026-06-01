import type { EmailConfig } from "@/lib/email-config";
import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

export function createEmailTransport(config: EmailConfig) {
  const secure = config.port === 465;
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

export async function sendMailMessage(
  config: EmailConfig,
  message: Mail.Options
): Promise<void> {
  const transport = createEmailTransport(config);
  await transport.sendMail({
    from: `"UltraFrame" <${config.user}>`,
    ...message,
  });
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.length <= 2 ? local[0] ?? "*" : local.slice(0, 2);
  return `${visible}***@${domain}`;
}
