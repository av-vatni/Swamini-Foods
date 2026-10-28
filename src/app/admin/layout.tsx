import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | स्वामिनी Admin" },
  robots: { index: false, follow: false },
  // Stop Chrome auto-translate rewriting the admin forms (it breaks React updates).
  other: { google: "notranslate" },
};

/** Separate root layout for the admin (no toran/header/footer of the public site). */
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="mr" translate="no" data-scroll-behavior="smooth" className={`notranslate ${fontVariables}`}>
      <body className="bg-cream">{children}</body>
    </html>
  );
}
