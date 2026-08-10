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
- `images/services/engine-service.jpg`, `generator-service.jpg`, `electrical-systems.jpg`, `fuel-systems.jpg`, `marine-plumbing.jpg`, `sanitation-systems.jpg`, `hydraulic-steering.jpg`, `preventative-maintenance.jpg`
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
- **Client-side form validation** on the Contact page (name, phone, email format, and issue description) with inline error messages — no page reload required. The form currently shows a success message on valid submit; wire it to a real backend (see below) before launch.
- **Gallery filtering + lightbox** with no external libraries.
- **SEO**: unique `<title>`/meta description per page, targeted keywords, canonical tags, Open Graph tags, and JSON-LD structured data (`AutomotiveBusiness`, `AggregateRating`/`Review`, service-area cities).
- **Accessibility basics**: skip-to-content link, semantic headings, `aria-*` attributes on the nav toggle and current-page link, focus-visible states.
- **Performance**: no external font/JS/CSS requests (system font stack + vanilla JS), a single small stylesheet and script shared across all pages (cached after first page load), lazy-loaded images.

## Connecting the contact form to a real backend

`js/main.js` currently intercepts the form submit, validates it, and shows a success message — **it does not send data anywhere yet**. Pick one:

1. **Netlify Forms** (if hosting on Netlify): add `data-netlify="true"` and a hidden `form-name` input to the `<form id="service-request-form">` in `contact.html` — no JS changes needed.
2. **Formspree / similar form API**: point the form's `action` to your Formspree endpoint and let it submit natively, or replace the `fetch`-free stub in `main.js`'s submit handler with an actual `fetch(...)` call to your endpoint.
3. **Custom backend**: replace the comment block in `main.js` (search for "No backend is wired up yet") with a `fetch()` call to your API.

## Deployment instructions

### Option A — Netlify (recommended, free, fastest)
1. Create a free account at netlify.com.
2. Drag and drop this entire project folder onto the Netlify "Deploys" page, **or** connect it to a Git repository for automatic deploys.
3. Add your custom domain under Site settings → Domain management.
4. If using Netlify Forms for the contact form, add `data-netlify="true"` to the form tag as described above.

### Option B — GitHub Pages
1. Push this folder to a GitHub repository.
2. In the repo settings, enable GitHub Pages, serving from the `main` branch root.
3. Map your custom domain via a `CNAME` file if desired.

### Option C — Traditional web hosting (cPanel / FTP)
1. Upload the entire contents of this folder (all `.html` files, `css/`, `js/`, `images/`) to your host's `public_html` (or equivalent) directory via FTP/SFTP or the hosting file manager.
2. Ensure `index.html` is at the site root so it loads at your domain's homepage.
3. No server-side configuration, database, or build step is required — this is a fully static site.

### Before/after launch checklist
- [ ] Replace all placeholder contact details, address, and map embeds (see above)
- [ ] Add real photography to `images/`
- [ ] Replace placeholder testimonials/ratings with real reviews
- [ ] Connect the contact form to a real backend
- [ ] Update canonical/Open Graph URLs to your live domain
- [ ] Run [Google Lighthouse](https://pagespeed.web.dev/) and [Google's Rich Results Test](https://search.google.com/test/rich-results) against the live site
- [ ] Submit the site to Google Search Console and request indexing
- [ ] Set up Google Business Profile and link it to the site

## SEO keyword focus

The site is optimized for: Marine Service Fort Myers, Marine Engine Repair, Diesel Engine Service, Boat Repair, Generator Repair, Marine Maintenance — reflected in page titles, meta descriptions, headings, and structured data across all pages.
