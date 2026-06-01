"use client";

import betaConfig from "@/config/beta.json";
import saleConfig from "@/config/sale.json";
import { clarityIdentifyPage, initClarity, setClarityTag } from "@/lib/clarity";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ClarityAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    initClarity();
  }, []);

  useEffect(() => {
    if (!pathname) return;
    clarityIdentifyPage(pathname);
    setClarityTag("page_path", pathname);
  }, [pathname]);

  useEffect(() => {
    setClarityTag("beta_enabled", betaConfig.enabled ? "true" : "false");
    const saleActive =
      saleConfig.enabled &&
      saleConfig.discountPercent > 0 &&
      saleConfig.discountPercent < 100;
    setClarityTag("sale_active", saleActive ? "true" : "false");
    if (saleActive) {
      setClarityTag("sale_discount_percent", String(saleConfig.discountPercent));
    }
  }, []);

  return null;
}
