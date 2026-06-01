import nodemailer from "nodemailer";
import type { EmailConfig } from "@/lib/email-config";

export type HelpEmailInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendHelpEmail(
  config: EmailConfig,
  input: HelpEmailInput
): Promise<void> {
  const secure = config.port === 465;

  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  const subject = `[UltraFrame Help] ${input.subject}`;
  const text = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    "",
    input.message,
  ].join("\n");

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
    <hr />
    <p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>
  `;

  await transport.sendMail({
    from: `"UltraFrame Support" <${config.user}>`,
    to: config.toEmail,
    replyTo: input.email,
    subject,
    text,
    html,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
