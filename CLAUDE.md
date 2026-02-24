# 🤖 CLAUDE - Critical Context & Instructions

**Last Updated**: January 5, 2026
**Project**: Trip2Vegas - Las Vegas Travel Agency Website
**Repository**: https://github.com/yourusername/trip2vegas (to be created)
**Production**: https://trip2vegas.com
**Existing Site**: https://trip2vegas.com (being redesigned)

---

## ⚠️ CRITICAL - READ FIRST

### 1. Project Overview

**Business Type**: Premium Las Vegas travel agency
**Services**: 40+ curated tours, shows, and experiences
**Markets**: Turkish tourists (primary), International travelers
**Technology**: Static website (HTML/CSS/JS)
**Hosting**: GitHub Pages (FREE)

### 2. Design System - Vegas Luxury Theme

**Colors**:
- **Primary Gold**: `#FFD700` - Buttons, accents, highlights
- **Deep Black**: `#0A0A0A` - Backgrounds, headers
- **Vegas Red**: `#DC143C` - CTAs, urgent offers, "Book Now"
- **White**: `#FFFFFF` - Text on dark backgrounds
- **Dark Gray**: `#1A1A1A` - Text on light backgrounds

**Typography**:
- **Headings**: Playfair Display or Cinzel (elegant serif, luxury feel)
- **Body Text**: Montserrat or Lato (modern, readable sans-serif)
- **Font Sizes**:
  - H1: 48px (mobile: 32px)
  - H2: 36px (mobile: 28px)
  - H3: 24px (mobile: 20px)
  - Body: 16px (mobile: 14px)

**Design Style**:
- Elegant luxury (high-end casino aesthetic)
- Large hero images (Vegas Strip, Grand Canyon)
- Gold accents and borders
- Smooth animations (fade-in, parallax scrolling)
- Card-based tour listings with hover effects

### 3. Languages - CRITICAL

**Dual Language Support**: Turkish + English

**Implementation**:
- Language toggle in top-right corner (🇹🇷 Türkçe | 🇬🇧 English)
- Store preference in localStorage
- All content has both TR and EN versions
- Use data attributes: `data-lang-en` and `data-lang-tr`

**Example**:
```html
<h1>
  <span data-lang-en>Welcome to Trip2Vegas</span>
  <span data-lang-tr>Trip2Vegas'a Hoş Geldiniz</span>
</h1>
```

### 4. Content Structure

**Tours & Experiences** (40+ total):

**Categories**:
1. **Adventure**
   - Helicopter tours (Grand Canyon, Vegas Strip)
   - Exotic car rentals (Ferrari, Lamborghini)
   - Shooting range experiences
   - Tank driving

2. **Entertainment**
   - Cirque du Soleil shows
   - Magic shows
   - Concerts
   - Sporting events (UFC, NBA, NHL)

3. **Sightseeing**
   - Grand Canyon tours
   - Hoover Dam
   - Red Rock Canyon
   - Death Valley
   - Area 51

4. **Dining & Hospitality**
   - Fine dining experiences
   - Chef's table reservations
   - Food tours

**Tour Details** (Required fields):
- Tour name (EN + TR)
- Description (EN + TR)
- Duration
- Price (or "Request Quote")
- Included items
- Meeting point
- Photos (3-5 high-quality images)

### 5. Features - Phase 1 (Launch)

**✅ MUST HAVE**:
- Homepage with hero section
- Tours catalog page (filter by category)
- Individual tour detail pages (template-based)
- About Us page
- Contact form (Formspree or EmailJS)
- Turkish/English language toggle
- Mobile-responsive (mobile-first design)
- Fast loading (optimized images, lazy load)
- Google Analytics integration

**❌ NOT IN PHASE 1** (Future):
- Online booking/payment system
- User accounts/login
- Customer reviews
- Blog section
- Live chat

### 6. Contact Form

**Fields**:
- Name (required)
- Email (required)
- Phone (optional)
- Tour Interest (dropdown)
- Message (required)
- reCAPTCHA (spam protection)

**Form Service**: Formspree (free tier) or EmailJS
**Recipient**: info@trip2vegas.com

### 7. Deployment

**Hosting**: GitHub Pages (FREE)
**Domain**: trip2vegas.com (DNS configuration needed)
**CI/CD**: GitHub Actions (auto-deploy on push to main)

**Deployment Workflow**:
```
Developer pushes to main
    ↓
GitHub Actions triggered
    ↓
Deploy to GitHub Pages
    ↓
Live at trip2vegas.com
```

---

## 🎯 Development Guidelines

### DO:
1. **Mobile-first design** - Start with mobile, scale up
2. **Optimize images** - WebP format, lazy loading, max 500KB per image
3. **Fast loading** - Minimize CSS/JS, use CDN for libraries
4. **SEO-friendly** - Semantic HTML, meta tags, alt text
5. **Accessibility** - ARIA labels, keyboard navigation, contrast ratios
6. **Clean code** - Comments, consistent formatting, DRY principles

### DON'T:
1. **Use heavy frameworks** - No React/Vue/Angular (static site only)
2. **Add backend features** - No databases, user auth (Phase 1)
3. **Ignore mobile** - 60% of traffic is mobile
4. **Use large images** - Optimize everything
5. **Hardcode content** - Use JSON for tour data
6. **Skip language support** - All content needs TR + EN

---

## 📁 File Structure

```
trip2vegas/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment
├── assets/
│   ├── css/
│   │   ├── main.css           # Core styles
│   │   ├── responsive.css     # Mobile breakpoints
│   │   └── vegas-theme.css    # Gold/Black/Red theme
│   ├── js/
│   │   ├── main.js            # Core functionality
│   │   ├── language.js        # TR/EN toggle
│   │   ├── tours.js           # Tour catalog functionality
│   │   └── contact.js         # Contact form handling
│   └── images/
│       ├── logos/             # Brand assets
│       ├── tours/             # Tour photos
│       └── hero/              # Hero banners
├── pages/
│   ├── tours/
│   │   ├── index.html         # Tours catalog
│   │   └── [tour-slug].html   # Individual tour pages
│   ├── about.html
│   └── contact.html
├── data/
│   └── tours.json             # All tour data (EN + TR)
├── index.html                 # Homepage
├── .gitignore
├── README.md
└── CLAUDE.md                  # This file
```

---

## 🚨 Common Mistakes - AVOID

### ❌ DON'T:
1. **Forget language toggle** - Every page needs TR/EN
2. **Use inline styles** - Keep CSS in separate files
3. **Ignore mobile breakpoints** - Test on 320px, 768px, 1024px, 1920px
4. **Skip image optimization** - Run through TinyPNG or similar
5. **Hardcode tour data** - Use tours.json for easy updates
6. **Use complex build tools** - Keep it simple (no webpack/vite needed)
7. **Forget reCAPTCHA** - Contact form needs spam protection
8. **Skip alt text** - Every image needs descriptive alt attribute

### ✅ DO:
1. **Test in multiple browsers** - Chrome, Firefox, Safari, Edge
2. **Validate HTML** - Use W3C validator
3. **Check performance** - Google PageSpeed Insights (aim for 90+)
4. **Preview on mobile** - Use real device, not just browser DevTools
5. **Use version control** - Commit frequently with clear messages
6. **Comment your code** - Especially language toggle logic
7. **Keep it simple** - Static site, no unnecessary complexity

---

## 🔄 Recent Updates

### February 24, 2026 — Phase 1 COMPLETE
✅ **Full website built and deployed**:
- CSS design system: vegas-theme.css, main.css, responsive.css (mobile-first)
- JS modules: language.js, components.js, main.js, tours.js, contact.js
- Shared components: header.html, footer.html (loaded via fetch)
- Homepage with hero, features, categories, featured tours, testimonials
- Tours catalog (search + filter) + detail page (42 tours, bilingual EN/TR)
- About page + Contact page with form
- staticwebapp.config.json (routing + security headers)
- sitemap.xml + robots.txt

✅ **Custom domain configured**:
- https://trip2vegas.com — LIVE (apex domain, alias A record + TXT validation)
- https://www.trip2vegas.com — LIVE (CNAME to Azure SWA)
- Azure DNS zone: trip2vegas-rg
- Azure SWA: CoffeeFortuneAI-RG / trip2vegas
- Default hostname: purple-cliff-0bd29300f.4.azurestaticapps.net

### January 5, 2026 (Initial Setup)
✅ **Project Initialization**:
1. Created D:\trip2vegas folder
2. Initialized Git repository
3. Set up folder structure (assets, pages, data)
4. Created .gitignore
5. Created GitHub Actions workflow for deployment
6. Created README.md and CLAUDE.md

---

## 🚀 NEXT STEPS (Phase 2+)

### Phase 2 — C# Azure Functions API Layer
**Tech stack**: C# (.NET 8), Azure Functions v4, PostgreSQL
- [ ] Set up `api/` folder with C# Azure Functions isolated worker project
- [ ] Contact form function (replace Formspree)
- [ ] Hotelbeds auth client (SHA256 signatures) — **Owner has Bedsonline credentials, needs to get API key from https://developer.hotelbeds.com**
- [ ] Pricing/markup engine
- [ ] Update GitHub Actions workflow: `api_location: "api"`
- [ ] Set environment variables in Azure Portal (API keys, connection strings)

### Phase 3 — Hotelbeds Integration
**Prerequisite**: API keys from developer.hotelbeds.com
- [ ] Hotel search page + API function
- [ ] Hotel detail page
- [ ] Activities integration into tours page
- [ ] Transfer search page
- [ ] Turkish translation for API content

### Phase 4 — AI Chatbot
- [ ] AI chatbot widget (floating chat)
- [ ] Chat API function (OpenAI/Claude)
- [ ] Smart search bar with suggestions

### Phase 5 — Online Booking & Payments
- [ ] Stripe Checkout integration
- [ ] Stripe webhooks
- [ ] Hotelbeds booking confirmation
- [ ] PostgreSQL for booking storage
- [ ] Success/cancel pages

### Phase 6 — Polish & Launch
- [ ] Real tour images (WebP, lazy loading)
- [ ] Lighthouse 90+ score
- [ ] Final SEO (structured data, hreflang, keywords)

---

## 🏗️ Architecture Decisions

- **Frontend**: Static HTML/CSS/JS (no framework) — modular, mobile-first
- **Backend (Phase 2+)**: C# Azure Functions (free with Azure SWA)
- **Database (Phase 5+)**: PostgreSQL
- **Hosting**: Azure Static Web Apps (free tier)
- **Payments**: Stripe
- **AI**: TBD (OpenAI or Claude API)
- **Language**: Bilingual EN/TR via `html[data-lang]` CSS-driven toggle

---

## 📝 Content TODO

**Needed from Client**:
- [ ] High-quality tour photos (3-5 per tour)
- [ ] Turkish translations for all tours
- [ ] Company logo (PNG, transparent background)
- [ ] Contact information (email, phone, address)
- [ ] Social media links (Instagram, Facebook, WhatsApp)
- [ ] Pricing information (or "Request Quote")
- [ ] Company story (About Us content)

---

## 🎨 Design Inspiration

**Style References**:
- Luxury casino websites (Bellagio, Wynn)
- Premium travel agencies (Viator, GetYourGuide)
- Vegas hotel sites (Caesars, MGM Grand)

**Key Elements**:
- Full-width hero images
- Gold accents and elegant typography
- Smooth scroll animations
- Card-based layouts
- Dark backgrounds with bright CTAs

---

## 📞 Project Contact

**Developer**: richard@raqballusa.com
**Business Owner**: [Add contact]
**Domain DNS**: Azure DNS (zone: trip2vegas-rg, nameservers: ns1-03.azure-dns.com)

---

## 🤖 AI Assistant Instructions

When working on this project:

1. **Always check this file first** at the start of each session
2. **Maintain Vegas Luxury theme** - Gold/Black/Red color scheme
3. **Every feature needs TR + EN** - No exceptions
4. **Mobile-first approach** - Design for 320px first
5. **Keep it static** - No backend features in Phase 1
6. **Optimize everything** - Images, CSS, JS (aim for <100KB per page)
7. **Use semantic HTML** - Proper heading hierarchy, alt text
8. **Comment your code** - Especially language toggle and tour loading
9. **Test on mobile** - Responsive design is critical

**Remember**:
- Phase 1 is static (Phase 2+ adds C# Azure Functions + PostgreSQL)
- Azure Static Web Apps deployment (free hosting)
- Turkish + English support (dual language, CSS-driven toggle)
- Vegas Luxury aesthetic (gold, black, red)
- 42 tours in data/tours.json (bilingual)
- GitHub repo: https://github.com/ruchanruchan/trip2vegas

---

**END OF CRITICAL INFORMATION**
