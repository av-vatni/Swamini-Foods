/**
 * Google Drive links → usable image / download URLs.
 * The file must be shared as "Anyone with the link → Viewer".
 *
 * Accepts any of:
 *   https://drive.google.com/file/d/<ID>/view?usp=sharing
 *   https://drive.google.com/open?id=<ID>
 *   https://drive.google.com/uc?id=<ID>&export=download
 *   https://docs.google.com/uc?id=<ID>
 */
const ID_PATTERNS = [/\/file\/d\/([\w-]{10,})/, /[?&]id=([\w-]{10,})/, /\/d\/([\w-]{10,})/];

export function driveFileId(link?: string | null): string | null {
  if (!link) return null;
  try {
    const url = new URL(link.trim());
    if (!/(^|\.)google(usercontent)?\.com$/.test(url.hostname)) return null;
    for (const re of ID_PATTERNS) {
      const m = re.exec(url.pathname + url.search);
      if (m) return m[1];
    }
  } catch {
    /* not a URL */
  }
  return null;
}

export const isDriveLink = (link?: string | null) => driveFileId(link) !== null;

/** Image URL resized by Google (no need to upload huge phone photos anywhere else). */
export function imageSrc(link?: string | null, width = 1000): string | null {
  if (!link) return null;
  const id = driveFileId(link);
  if (id) return `https://lh3.googleusercontent.com/d/${id}=w${width}`;
  return /^https?:\/\//.test(link) || link.startsWith("/") ? link : null;
}

/** Direct-download URL (used for the brochure). */
export function downloadHref(link?: string | null): string | null {
  if (!link) return null;
  const id = driveFileId(link);
  if (id) return `https://drive.google.com/uc?export=download&id=${id}`;
  return /^https?:\/\//.test(link) || link.startsWith("/") ? link : null;
}
