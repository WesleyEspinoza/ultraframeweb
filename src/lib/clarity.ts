"use client";

import Clarity from "@microsoft/clarity";
import type { ClarityEventName } from "@/lib/clarity-events";

const PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim() || "x03s4itvv3";

let initialized = false;

function ensureClarity(): boolean {
  if (typeof window === "undefined" || !PROJECT_ID) return false;
  if (!initialized) {
    Clarity.init(PROJECT_ID);
    initialized = true;
  }
  return true;
}

export function getClarityProjectId(): string {
  return PROJECT_ID;
}

export function initClarity(): void {
  ensureClarity();
}

export function trackClarityEvent(eventName: ClarityEventName | string): void {
  if (!ensureClarity()) return;
  Clarity.event(eventName);
}

export function setClarityTag(key: string, value: string | string[]): void {
  if (!ensureClarity()) return;
  Clarity.setTag(key, value);
}

export function clarityIdentifyPage(pagePath: string): void {
  if (!ensureClarity()) return;
  Clarity.identify("visitor", undefined, pagePath, "UltraFrame visitor");
}

export function clarityUpgradeSession(reason: string): void {
  if (!ensureClarity()) return;
  Clarity.upgrade(reason);
}
