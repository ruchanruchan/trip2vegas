# Trip2Vegas — Project Context

**Last updated**: November 17, 2026
**What**: Premium Las Vegas travel agency website. Primary market: Turkish tourists; also international.
**Live**: https://trip2vegas.com (and www) · **Repo**: https://github.com/ruchanruchan/trip2vegas (branch `master`)
**Developer**: richard@raqballusa.com

---

## Rules (read first)

1. **Bilingual, no exceptions.** Every piece of visible text needs English and Turkish.
2. **Vegas luxury theme.** Gold / black / red; use the CSS variables in `vegas-theme.css`, never hard-coded colors.
3. **Mobile first.** About 60% of traffic is mobile. Check 320, 768, 1024 and 1920px.
4. **Static frontend, no frameworks, no build tools.** Plain HTML/CSS/JS. No React/Vue, no webpack/vite.
5. **Tour content lives in `data/tours.json`**, never hard-coded in HTML.
6. **No inline styles in new code.** Put CSS in the stylesheets. (Older markup still has some.)
7. **Images**: WebP, lazy-loaded, descriptive alt text, under 500KB each.
8. **Semantic, accessible HTML**: heading order, ARIA labels, keyboard navigation, contrast.
9. **Never commit secrets.** All credentials are in `C:\Users\rucha\.claude\credentials.md` (outside the repo).

## Deploying

Push to `master` → GitHub Actions → Azure Static Web Apps. Takes 1-2 minutes.
The owner reviews on the live site, so verify changes at https://trip2vegas.com after the run finishes.

| Thing | Value |
|---|---|
| Static Web App | `trip2vegas`, resource group `CoffeeFortuneAI-RG`, Free tier |
| Default hostname | purple-cliff-0bd29300f.4.azurestaticapps.net |
| DNS | Azure DNS zone in `trip2vegas-rg` |
| Workflow | `.github/workflows/azure-static-web-apps-purple-cliff-0bd29300f.yml` (`app_location: "/"`, `api_location: "api"`) |
| Routing / headers | `staticwebapp.config.json` (no SPA fallback; unknown URLs return `404.html`) |

## Structure

```
index.html                  Homepage
404.html                    Not-found page (root-relative asset paths)
pages/tours/index.html      Catalog (search + category filter)
pages/tours/detail.html     One template for all tours: detail.html?slug=<slug>
pages/about/index.html
pages/contact/index.html
components/header.html      Loaded into every page by components.js
components/footer.html
data/tours.json             42 tours, bilingual
assets/css/                 vegas-theme.css (tokens, language toggle), main.css, responsive.css
assets/js/                  language.js, components.js, main.js, tours.js, contact.js
assets/images/tours/        <slug>.webp (1280x800) and <slug>-sm.webp (640x400)
assets/images/hero/         Hero, category tiles, page header, CTA, About, og-image.jpg
assets/images/icons.svg     Line-icon sprite: <svg class="icon"><use href="/assets/images/icons.svg#i-name">
assets/images/logos/        favicon.svg, apple-touch-icon.png (favicon.ico is at the root)
api/                        C# Azure Functions (contact form)
scripts/generate-images.py  AI image generation
sitemap.xml, robots.txt
```

The site is always served from the domain root: `Components.getBasePath()` returns `/`, so use root-relative paths in JS.

## Design system

- **Colors**: gold `#FFD700`, black `#0A0A0A`, red `#DC143C`, white `#FFFFFF`, dark gray `#1A1A1A` (`--color-gold`, `--color-black`, `--color-red`, …).
- **Fonts**: Playfair Display (headings), Cinzel (accent/uppercase titles), Montserrat (body).
- **Sizes**: H1 48px (mobile 32), H2 36 (28), H3 24 (20), body 16 (14).
- **Style**: high-end casino look; full-width photo heroes with dark overlays, gold borders, card layouts with hover effects, fade-in animations.

## Languages (EN + TR)

- Both versions are in the page; CSS hides the inactive one via `html[data-lang]`:
  ```html
  <span data-lang-en>Welcome</span><span data-lang-tr>Hoş Geldiniz</span>
  ```
- `tours.json` fields are `{ "en": "...", "tr": "..." }`.
- `language.js` stores the choice in localStorage (`trip2vegas_lang`) and assumes exactly two languages.
- Adding a third language means touching every text pair. If that is ever needed, first move page text into per-language JSON files.

## Tours (`data/tours.json`)

- Categories: `adventure` (11), `entertainment` (11), `sightseeing` (11), `dining` (9, includes hospitality/VIP).
- Fields: `slug`, `name`, `description`, `longDescription`, `category`, `price` (null = "Request Quote"), `priceUnit` (optional: `person` default, `couple`, `vehicle`), `duration`, `groupSize`, `icon`, `featured`, `meetingPoint`, `included[]`, `highlights[]`.
- Images are found by slug; an optional `image` field overrides the filename.
- When adding or removing a tour: add its prompt to `scripts/generate-images.py`, generate the image, and update `sitemap.xml` and the category counts on the homepage.
- Prices are market estimates, not supplier quotes.
- The NBA tour stays: Las Vegas has no NBA team, so it is worded as Summer League / preseason / special events.

## Images (AI-generated)

- FAL AI, FLUX schnell for tour photos, FLUX dev for hero-level images. Roughly $0.003-0.025 per image.
- `set FAL_KEY=<key>` then `python scripts/generate-images.py` (only missing images) or `--force <slug-or-name>` to redo one.
- Tours named after real brands or performers (Cirque, Copperfield, Gordon Ramsay, UFC, NBA…) deliberately use generic scenes: no likenesses, no logos. Keep it that way.
- Look at every generated image before shipping; reject garbled text and odd anatomy.
- Owner preference for people in photos: seen from behind, no faces.

## Contact form

- `assets/js/contact.js` posts JSON to `POST /api/contact` (`api/ContactFunction.cs`, C# .NET 8 isolated worker).
- Email goes through the shared Azure Communication Services (`comservice1` + `comemailservice1`, resource group `resourcegroup`; trip2vegas.com is a verified sender domain).
- From `DoNotReply@trip2vegas.com` to `pa@trip2vegas.com`; Reply-To is the customer.
- SWA app settings: `ACS_CONNECTION_STRING`, `CONTACT_TO`, `CONTACT_FROM`.
- Spam protection: hidden honeypot field `website`, 3-second minimum fill time, server-side validation. Bots receive a fake success. No reCAPTCHA.

## Business details on the site

- WhatsApp: +1 (702) 534-9884 (`wa.me/17025349884`)
- Email: pa@trip2vegas.com (info@ also works; use pa@)
- No social media accounts; do not add Instagram/Facebook links.
- Google Analytics: Google tag `GTM-PMJW2PP7` → GA4 property `G-8VE2XZC9N1`, in the `<head>` of every page.
- **Unconfirmed placeholder content**: "5000+ happy guests", "4.9 rating", the three homepage testimonials, office hours on the contact page.

## Roadmap

- **Phase 1 (done)**: static bilingual site, 42 tours, custom domain.
- **Phase 2 (in progress)**: C# Azure Functions API. Done: `api/` project, contact form. To do: Hotelbeds auth client (SHA256 signatures; owner has Bedsonline credentials and needs an API key from developer.hotelbeds.com), pricing/markup engine.
- **Phase 3**: Hotelbeds integration — hotel search and detail pages, activities in the tours page, transfers, Turkish translation of API content.
- **Phase 4**: AI chatbot widget and chat API; smart search suggestions.
- **Phase 5**: Stripe Checkout and webhooks, Hotelbeds booking confirmation, PostgreSQL (on the GPU VM) for bookings.
- **Phase 6**: real tour photos from the client, Lighthouse 90+, structured data.

**Still needed from the client**: real tour photos, a logo (PNG, transparent), confirmed pricing, the company story, and the placeholder items listed above.
