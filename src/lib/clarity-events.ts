/** Clarity custom event names — keep stable for dashboard filters. */
export const ClarityEvents = {
  CHECKOUT_BEGIN: "checkout_begin",
  CHECKOUT_ERROR: "checkout_error",
  CHECKOUT_CATALOG_VIEW: "checkout_catalog_view",
  PURCHASE_SUCCESS: "purchase_success",
  LICENSE_REVEALED: "license_revealed",
  LICENSE_ALREADY_REVEALED: "license_already_revealed",
  LICENSE_REVEAL_ERROR: "license_reveal_error",
  LICENSE_MANAGE_AUTH: "license_manage_authenticated",
  LICENSE_DEVICE_ACTIVATE: "license_device_activate",
  LICENSE_DEVICE_REMOVE: "license_device_remove",
  INSTALLER_DOWNLOAD: "installer_download",
  CTA_GET_NOW: "cta_get_now",
  CTA_MANAGE_DEVICES: "cta_manage_devices",
} as const;

export type ClarityEventName = (typeof ClarityEvents)[keyof typeof ClarityEvents];
