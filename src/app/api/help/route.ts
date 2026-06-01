import { getEmailConfig, isAllowedRequestOrigin } from "@/lib/email-config";
import { parseHelpFormBody } from "@/lib/help-form-validation";
import { sendHelpEmail } from "@/lib/send-help-email";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!isAllowedRequestOrigin(origin)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const config = getEmailConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Help email is not configured. Please try again later." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parseHelpFormBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    await sendHelpEmail(config, parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[help] send failed:", error);
    return NextResponse.json(
      { error: "Unable to send your message right now. Please try again later." },
      { status: 500 }
    );
  }
}
