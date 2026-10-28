/**
 * Fixed business details. Phone, UPI, FSSAI, deadline etc. are edited in /admin → Settings
 * (see src/lib/settings.ts for the fallback values).
 */
export const BUSINESS = {
  logo: "/logo.png",
  /** Bundled brochure, used when no Drive link is set in admin */
  brochure: "/brochure/swamini-diwali-brochure-2026.jpg",
  brochureFileName: "Swamini-Gruh-Udyog-Diwali-Faral-2026.jpg",
  /** Google Maps listing "Swamini Gruha Udyog" (opens the app on phones) */
  mapUrl: "https://maps.app.goo.gl/cqM6ow781QDE2B9X8",
  /**
   * Embedded map of that listing (Google Maps → Share → Embed format). The place id
   * (0x3bdba…:0x9365…) makes the card and "Open in Maps" show the business, not bare coordinates.
   */
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d600!2d75.3615696!3d19.8814182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdba3675cd51f27%3A0x9365ddd4ba4f9105!2sSwamini%20Gruha%20Udyog!5e0!3m2!1sen!2sin!4v1730000000000!5m2!1sen!2sin",
};
