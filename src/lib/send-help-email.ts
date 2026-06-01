import type { EmailConfig } from "@/lib/email-config";
import { escapeHtml, sendMailMessage } from "@/lib/email-transport";

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

  await sendMailMessage(config, {
    to: config.toEmail,
    replyTo: input.email,
    subject,
    text,
    html,
  });
}
