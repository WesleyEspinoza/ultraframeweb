import type { EmailConfig } from "@/lib/email-config";
import { escapeHtml, sendMailMessage } from "@/lib/email-transport";
import { getAppUrl } from "@/lib/stripe";
import { INSTALLER_FILENAME } from "@/lib/installer-download";
import type { RevealedLicense } from "@/lib/license-api";

export type LicenseEmailInput = {
  to: string;
  license: RevealedLicense;
  sessionId: string;
};

export async function sendLicenseEmail(
  config: EmailConfig,
  input: LicenseEmailInput
): Promise<void> {
  const appUrl = getAppUrl();
  const manageUrl = `${appUrl}/license/manage`;
  const helpUrl = `${appUrl}/help`;
  const downloadUrl = `${appUrl}/api/installer/download?session_id=${encodeURIComponent(input.sessionId)}`;

  const subject = `Your UltraFrame license key`;
  const text = buildLicenseEmailText(input, {
    manageUrl,
    helpUrl,
    downloadUrl,
  });
  const html = buildLicenseEmailHtml(input, {
    manageUrl,
    helpUrl,
    downloadUrl,
  });

  await sendMailMessage(config, {
    to: input.to,
    replyTo: config.toEmail,
    subject,
    text,
    html,
  });
}

function buildLicenseEmailText(
  input: LicenseEmailInput,
  links: { manageUrl: string; helpUrl: string; downloadUrl: string }
): string {
  return [
    "Thank you for purchasing UltraFrame.",
    "",
    `Product: ${input.license.product}`,
    `License key: ${input.license.key}`,
    "",
    "Save this key — it is shown once for security.",
    "",
    `Download installer: ${links.downloadUrl}`,
    `Manage devices (up to 3 PCs): ${links.manageUrl}`,
    `Help & support: ${links.helpUrl}`,
    "",
    "— UltraFrame · SoftwareRefresh",
  ].join("\n");
}

function buildLicenseEmailHtml(
  input: LicenseEmailInput,
  links: { manageUrl: string; helpUrl: string; downloadUrl: string }
): string {
  const key = escapeHtml(input.license.key);
  const product = escapeHtml(input.license.product);
  const tier = escapeHtml(input.license.tier);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your UltraFrame license</title>
</head>
<body style="margin:0;padding:0;background:#050d14;font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050d14;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#091824;border:1px solid rgba(0,245,255,0.2);border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px 20px;border-bottom:1px solid rgba(0,245,255,0.15);">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#00f5ff;">UltraFrame</p>
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">Your license is ready</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#94a3b8;">
                Thank you for your purchase. Below is your UltraFrame license key. We recommend saving it somewhere secure — for your protection, this key is only issued once.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;background:#020408;border:1px solid rgba(0,245,255,0.25);border-radius:8px;">
                <tr>
                  <td style="padding:20px 24px;text-align:center;">
                    <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#64748b;">License key</p>
                    <p style="margin:0;font-family:ui-monospace,'Cascadia Code','Consolas',monospace;font-size:18px;font-weight:600;color:#00f5ff;letter-spacing:0.04em;word-break:break-all;">${key}</p>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 28px;font-size:14px;color:#94a3b8;">
                <tr><td style="padding:6px 0;"><strong style="color:#cbd5e1;">Product</strong></td><td style="padding:6px 0;text-align:right;color:#e2e8f0;">${product}</td></tr>
                <tr><td style="padding:6px 0;"><strong style="color:#cbd5e1;">Plan</strong></td><td style="padding:6px 0;text-align:right;color:#e2e8f0;">${tier}</td></tr>
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 8px;">
                <tr>
                  <td style="border-radius:6px;background:#00f5ff;">
                    <a href="${escapeHtml(links.downloadUrl)}" style="display:inline-block;padding:14px 28px;font-size:13px;font-weight:700;color:#020408;text-decoration:none;letter-spacing:0.05em;text-transform:uppercase;">Download ${escapeHtml(INSTALLER_FILENAME)}</a>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#64748b;">
                <a href="${escapeHtml(links.manageUrl)}" style="color:#00f5ff;text-decoration:none;">Manage devices</a>
                &nbsp;·&nbsp;
                <a href="${escapeHtml(links.helpUrl)}" style="color:#00f5ff;text-decoration:none;">Help &amp; support</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background:#050d14;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#475569;text-align:center;">
                UltraFrame · SoftwareRefresh<br />
                This message was sent to the email address used at checkout.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
