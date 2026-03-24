# Web Standards

## Performance & Optimization

- Lighthouse score: min. 90+ (mobile)
- LCP < 2.5s
- CLS < 0.1
- INP < 200 ms

### Optimization Rules
- Use modern image formats (AVIF/WebP when possible)
- Use font-display: swap
- Minimize render-blocking CSS/JS
- Preload key assets (fonts, hero image)
- Lazy load all below-the-fold images
- Optimize asset sizes and avoid unnecessary libraries

---

## UX & Navigation

- Sticky header on desktop
- Clear CTA above the fold
- Maximum 5–7 items in main navigation
- Mobile navigation with hamburger menu (right side)
- Logo always on the left
- Clickable areas min. 44px
- Active state for current page/section
- Visual hierarchy must guide user attention naturally

---

## Layout

- Max width: 1440px
- Content width: 85–90% of screen
- Clear separation of sections
- Consistent spacing system (8px grid recommended)
- Balanced white space
- Never justify text
- Max text width: ~70% of screen

---

## Analytics & Cookies

- Agent must ask whether analytics should be implemented
- If yes:
  - Implement analytics (GA4 / Plausible / other)
  - Respect consent requirements
- Cookie bar must be implemented if required
- Cookie bar must match website design

---

## SEO Basics

- Proper H1–H6 structure
- Meta title and description on every page
- Canonical URL defined
- Open Graph meta tags
- Internal linking between pages
- Alt text for all images

### Files
- sitemap.xml
- robots.txt
- llms.txt

---

## Security Basics

- CSP header defined
- Basic security headers included
- Forms must include honeypot protection
- Validate and sanitize user inputs

---

## Forms

- Honeypot field (hidden)
- Required fields clearly marked
- Accessible labels (not just placeholders)
- Spam protection required

---

## Visual & Typography Rules

- Use rem for body text
- Use clamp() for headings
- Line height: 1.5–1.8 for paragraphs
- Maintain strong contrast (min. 4.5:1)
- Use readable fonts with Czech diacritics
- Consistent button styles and UI components

---

## Images

- Use optimized formats (JPG/PNG or AVIF if available)
- Lazy load below-the-fold images
- Do not lazy load hero images
- Always include alt text

---

## Content Rules

- Clear, concise, and structured text
- No fluff
- Strong headings with clear information
- Logical content hierarchy (most important first)

---

## Consistency

- Unified design system (colors, spacing, components)
- Consistent border radius
- Subtle shadows only
- Consistent icon style
- Consistent padding/margins across similar elements

---

## Notes

- This is a universal baseline for all projects
- Specific project requirements may override these rules
