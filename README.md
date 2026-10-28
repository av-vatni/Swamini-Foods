# Swamini Gruh Udyog — website & admin (Next.js + Tailwind + Supabase)

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000  (redirects to /mr) · admin: /admin
npm run build    # production build check
```
`.env.local` needs:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

## One-time Supabase setup
1. Supabase Dashboard → **SQL Editor** → paste `supabase/migrations/0001_swamini_admin.sql` → **Run**.
   Creates `products`, `site_settings`, `admin_emails`, security rules, and the 2026 price list.
2. **Authentication → Users → Add user** (email + password, tick *Auto confirm user*).
3. SQL Editor: `insert into public.admin_emails (email) values ('that-email@example.com');` (lowercase).
4. Recommended: **Authentication → Sign In / Providers → turn off "Allow new users to sign up"**.

Only emails in `admin_emails` can change data (enforced by Row Level Security in the database).

## Admin (`/admin`)
- **उत्पादने / Products** — edit price inline, show/hide, ★ featured, reorder ↑↓, add/edit/delete.
- **सेटिंग्ज / Settings** — phone, UPI, FSSAI, years of service, order deadline, orders open/closed, brochure link.
- Saving refreshes the public site immediately (`updateTag`); as a safety net pages also re-check the database every minute.

### Photos & brochure via Google Drive
Upload to Drive → **Share → General access: “Anyone with the link” (Viewer) → Copy link** → paste in admin.
The admin shows a live preview; if it doesn't appear, the sharing setting is wrong.
Images are served resized from Google (`lh3.googleusercontent.com/d/<id>=w1000`), the brochure as a direct download.

## Where things live
| What | File |
| --- | --- |
| Data reads (cached) + DB → site mapping | `src/lib/data.ts` |
| Admin server actions (save/delete/reorder/settings/login) | `src/app/admin/actions.ts` |
| Admin access check | `src/lib/admin.ts` |
| Drive link helpers | `src/lib/drive.ts` |
| Fallback products / settings (used if DB is unreachable) | `src/lib/products.ts`, `src/lib/settings.ts` |
| Price calculator rules (250 g steps) | `QTY` in `src/lib/products.ts` |
| Website text (Marathi / English) | `src/lib/dictionaries.ts` |
| Colours, fonts, decorations | `src/app/globals.css` |
| DB schema + policies | `supabase/migrations/0001_swamini_admin.sql` |

## Hosting
Netlify or Cloudflare (free plans allow commercial use). Connect the Git repo, build command `npm run build`,
and add the two `NEXT_PUBLIC_SUPABASE_*` variables in the host's environment settings.
