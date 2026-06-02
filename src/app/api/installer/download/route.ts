import { INSTALLER_DOWNLOAD_URL } from "@/lib/installer-download";
import { verifyPaidCheckoutSession } from "@/lib/verify-purchase";
import { UserErrors, toUserError } from "@/lib/user-errors";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id")?.trim();

  if (!sessionId) {
    return NextResponse.json(
      { error: "A valid checkout session is required to download." },
      { status: 400 }
    );
  }

  try {
    const purchase = await verifyPaidCheckoutSession(sessionId);
    if (!purchase.paid) {
      return NextResponse.json(
        { error: UserErrors.licenseVerify },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("[installer] verify failed:", error);
    return NextResponse.json(
      { error: toUserError(error, UserErrors.downloadVerify) },
      { status: 403 }
    );
  }

  return NextResponse.redirect(INSTALLER_DOWNLOAD_URL, 302);
}
