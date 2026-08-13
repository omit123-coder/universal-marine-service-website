# Universal Marine Service — Website

A complete, production-ready, mobile-first website for Universal Marine Service (marine engine & vessel systems service, Fort Myers, FL). Built with plain HTML5, CSS3, and vanilla JavaScript — no build step, no frameworks, no dependencies.

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Services | `services.html` |
| About Us | `about.html` |
| Gallery | `gallery.html` |
| Service Areas | `service-areas.html` |
| Reviews | `reviews.html` |
| Contact | `contact.html` |

## File structure

```
/
├── index.html
├── services.html
├── about.html
├── gallery.html
├── service-areas.html
├── reviews.html
├── contact.html
├── css/
│   └── style.css        (single global stylesheet — palette, layout, components)
├── js/
│   └── main.js           (mobile nav, form validation, smooth scroll, gallery filters/lightbox)
└── images/
    ├── logo/             (company logo — used in the header and footer on every page)
    ├── hero/             (homepage hero + service-area map images)
    ├── services/          (one image per service section)
    ├── about/             (team + technician photos)
    └── gallery/            (project photos)
```

## Logo

`images/logo/logo.jpg` is displayed in the header and footer of every page (inside the `.brand-mark` box, `css/style.css`). It's a small JPEG (130×208px) — good enough for the current icon-sized display, but if you have a higher-resolution version (ideally a transparent PNG or SVG), swap the file at that same path and it will update everywhere with no code changes. The browser tab favicon still uses a separate generic icon (an inline SVG in each page's `<head>`) — let me know if you'd like that replaced with a cropped/square version of the logo too.

## Before you launch — replace these placeholders

This site ships with realistic placeholder business details so every page is complete and functional. **Replace all of the following before going live:**

- **Phone**: `239-246-1618` — already updated site-wide.
- **Email**: `flyingyacht@aol.com` — already updated site-wide.
- **Address**: `4546 Orange Grove Blvd, North Fort Myers, FL 33903` — already updated site-wide, including the JSON-LD schema in `index.html`, `service-areas.html`, and `reviews.html`.
- **Business hours** — footer and contact page.
- **Google Maps embeds** — `contact.html` and `service-areas.html` currently embed a generic query-based map (`https://www.google.com/maps?q=...&output=embed`) for the placeholder address. Once you have a real address, update the `q=` parameter, or generate an exact embed code from Google Maps ("Share" → "Embed a map") for a precise pin.
- **Social links** (`#` placeholders in the footer) — point to your real Facebook/Instagram profiles, or remove the icons.
- **`https://www.universalmarineservice.com/`** — replace with your real domain in every `<link rel="canonical">` and `og:url` tag once you know your final domain.
- **Review content** — the testimonials and the `aggregateRating` (4.9 / 128 reviews) in `reviews.html` are illustrative placeholders. Replace with real customer reviews and your actual rating before launch (never publish fabricated reviews/ratings as genuine).
- **Legal pages** — the footer's "Privacy Policy" and "Terms of Service" links point to `#`. Add real pages before launch.

## Adding your photography

The design is built for **large, high-quality photography** and is ready for real images — every `<img>` tag already has the correct path, descriptive `alt` text, and `loading="lazy"`. Until real photos are added, each image slot gracefully displays a styled navy/ocean gradient placeholder with a text label (handled automatically by `js/main.js` + the `.img-fallback` CSS class), so the site looks intentional even before photos are uploaded.

To add real photos, simply drop correctly-named files into these folders (no code changes needed):

- `images/hero/hero-home.jpg`, `images/hero/service-area-map.jpg`
- `images/services/engine-service.jpg`, `generator-service.jpg`, `electrical-systems.jpg`, `marine-plumbing.jpg`, `sanitation-systems.jpg`, `hydraulic-steering.jpg`, `preventative-maintenance.jpg`
- `images/about/team-photo.jpg`, `technician-at-work.jpg`
- `images/gallery/engine-01.jpg` through `engine-04.jpg`, `generator-01.jpg`/`02.jpg`, `electrical-01.jpg`/`02.jpg`, `vessel-01.jpg`–`03.jpg`, `maintenance-01.jpg`

**Recommended image specs:**
- Format: WebP preferred (with JPEG fallback), or high-quality JPEG
- Hero images: 1920×1080px, under 300KB
- Service/gallery images: 1200×900px, under 200KB
- Compress with [Squoosh](https://squoosh.app) or similar before uploading — this is essential for the 90+ Lighthouse performance target.

## Technical features

- **Responsive, mobile-first design** with a slide-in mobile menu and a sticky mobile call/request bar (hidden on desktop).
- **Smooth scrolling** to in-page anchors (e.g. `services.html#engine`).
- **Request Service**: every "Request Service" button/link sitewide goes to the Contact page's online form (name, phone, email, boat make/model, engine type, description of issue). On submit, `send-request.php` emails the details to you automatically — no PDF, no manual step for the customer.
- **Gallery filtering + lightbox** with no external libraries.
- **SEO**: unique `<title>`/meta description per page, targeted keywords, canonical tags, Open Graph tags, and JSON-LD structured data (`AutomotiveBusiness`, `AggregateRating`/`Review`, service-area cities).
- **Accessibility basics**: skip-to-content link, semantic headings, `aria-*` attributes on the nav toggle and current-page link, focus-visible states.
- **Performance**: no external font/JS/CSS requests (system font stack + vanilla JS), a single small stylesheet and script shared across all pages (cached after first page load), lazy-loaded images.

## The Request Service form (GoDaddy hosting + PHP)

The Contact page form (`contact.html`, `id="service-request-form"`) submits to **`send-request.php`** at the site root, which validates the fields server-side and emails the submission using PHP's built-in `mail()` function — no third-party service, no Netlify-specific features, works because GoDaddy's standard hosting plans include PHP.

- **Destination email**: set at the top of `send-request.php` — `$to = "flyingyacht@aol.com";`. To change it later, edit that one line (no other files need touching).
- **Spam protection**: a hidden "website" field acts as a honeypot — real visitors never see or fill it (it's positioned off-screen), so if it arrives filled in, the script silently discards the submission as a bot.
- **Validation**: happens twice — in the browser (`js/main.js`, for instant feedback) and again in `send-request.php` (since client-side checks can always be bypassed), so a submission is only emailed if it passes both.

**Testing after deploy**: submit the form once yourself on the live site and confirm the email arrives. If it doesn't:
- Check your GoDaddy hosting plan's spam/junk folder for the destination inbox first — `mail()` sends from `no-reply@universalmarineservice.com`, and depending on your plan's mail configuration this may need to be an address GoDaddy recognizes as belonging to your hosting account/domain for reliable delivery.
- If delivery is inconsistent, GoDaddy hosting support can confirm whether your plan needs SMTP authentication instead of the plain `mail()` function — if so, `send-request.php` would need to be updated to use PHPMailer or a similar SMTP library instead of `mail()`.

## Deployment instructions

### GoDaddy Web Hosting (cPanel / FTP)
1. Log into your GoDaddy hosting account and open the **File Manager** (or connect via FTP/SFTP using the credentials in your hosting dashboard).
2. Upload the entire contents of this folder — all `.html` files, `send-request.php`, `css/`, `js/`, `images/` — into your hosting account's web root (commonly `public_html`).
3. Ensure `index.html` ends up directly in the web root (not nested in a subfolder) so it loads at `universalmarineservice.com`.
4. No build step or database is needed — everything here is static files plus the one PHP script, which GoDaddy's standard hosting runs automatically.
5. Since your domain is already registered and hosted at GoDaddy, no separate DNS/domain-connection step is needed — once the files are uploaded, the live domain should serve the new site directly.

### Before/after launch checklist
- [ ] Replace all placeholder contact details, address, and map embeds (see above)
- [ ] Add real photography to `images/`
- [ ] Replace placeholder testimonials/ratings with real reviews
- [ ] Upload `send-request.php` along with the rest of the site, and confirm `$to` in that file has the correct destination email
- [ ] Submit a real test request on the live site and confirm the email arrives (see testing notes above)
- [ ] Update canonical/Open Graph URLs to your live domain
- [ ] Run [Google Lighthouse](https://pagespeed.web.dev/) and [Google's Rich Results Test](https://search.google.com/test/rich-results) against the live site
- [ ] Submit the site to Google Search Console and request indexing
- [ ] Set up Google Business Profile and link it to the site

## SEO keyword focus

The site is optimized for: Marine Service Fort Myers, Marine Engine Repair, Diesel Engine Service, Boat Repair, Generator Repair, Marine Maintenance — reflected in page titles, meta descriptions, headings, and structured data across all pages.
