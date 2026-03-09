# CLAUDE.md — Empowered Muslimah (EMMA Foundation) Website

## Project Overview

**Organization:** EMMA Foundation — Empowered Muslim Association (Empowered Muslimah)
**Type:** Non-profit / charity
**Primary Goal:** Fundraising & donations
**Tech Stack:** Custom code — HTML, CSS, JavaScript (no CMS framework)

---

## Domains

- **Primary:** `empoweredmuslimah.org` (preferred) / `empoweredmuslimah.com`
- **Sniped (monitor):** `emmafoundation.com` / `emmafoundation.org` — check periodically in case they become available
- **Instagram:** [@emma.foundation](https://www.instagram.com/emma.foundation/)

---

## Audience

- **Primary:** Muslim women generally
- **Secondary (implicit):** Donors and supporters of Muslim women's causes
- Content should feel welcoming and relevant to Muslim women of all ages and backgrounds.

---

## Tone & Feel

**Peaceful and spiritual.** The site should feel calm, sincere, and grounded in faith — not loud or sales-driven. Think quiet confidence, warmth, and purpose. Avoid overly corporate or clinical language.

### Content Sensitivities
- **Modesty is key.** All imagery, illustrations, and visual assets must reflect Islamic values of modesty. Avoid images of women without hijab, revealing clothing, or anything that could be considered immodest.
- Use Islamic greetings and terminology naturally and correctly (e.g., *Assalamu Alaikum*, *InshaAllah*, *JazakAllahu Khairan*) where contextually appropriate — but don't force them.
- No Arabic language support required on the site at this time.

---

## Pages (MVP Scope)

1. **Home** — Hero, mission statement, donation CTA, brief org overview
2. **About / Mission** — Who we are, what EMMA stands for, our values
3. **Donate** — Donation form / call to action, impact messaging

---

## Branding

### Logo & Assets
- Canva project: https://www.canva.com/design/DAFu21kCKfs/YV7a32lpAdBS7LEgpM-CpQ/edit

### Color Palette

| Role         | Name         | Hex       |
|--------------|--------------|-----------|
| Primary      | Blush/Terra  | `#E09380` |
| Highlight    | Soft Sage    | `#EABFB7` |
| Dark         | Deep Brown   | `#6E4E41` |
| Contrast     | Muted Green  | `#7F9272` |

> **Note:** An orange/chocolate color was considered and rejected. Do not introduce orange tones.

### Typography

| Role         | Font              | Notes                          |
|--------------|-------------------|--------------------------------|
| Headings     | **Alike** (Regular) | Serif, elegant, used for H1–H3 |
| Subheadings  | **Source Sans Pro** | Clean sans-serif for H4–H5     |
| Body         | **Muli**          | Lightweight, readable body copy |

All three fonts are available via Google Fonts.

```html
<link href="https://fonts.googleapis.com/css2?family=Alike&family=Source+Sans+Pro:wght@300;400;600&family=Muli:wght@300;400;600&display=swap" rel="stylesheet">
```

---

## Design Inspiration

**Reference site:** [ilhamcollective.org](https://ilhamcollective.org/)

Key takeaways from Ilham Collective's design approach:
- Clean, uncluttered layouts with generous whitespace
- Warm, community-focused copywriting
- Simple nav with a prominent **Donate** CTA button in the header
- Section-based homepage (hero → mission → what we do → founder story)
- Testimonials section to build trust
- Newsletter signup in footer
- Footer includes quick links and social icons

Replicate this general structure and warmth — but use EMMA's own palette, fonts, and identity.

---

## CSS Conventions

```css
:root {
  --color-primary:   #E09380;
  --color-highlight: #EABFB7;
  --color-dark:      #6E4E41;
  --color-contrast:  #7F9272;
  --color-bg:        #FDFAF9; /* suggested off-white background */

  --font-heading:    'Alike', serif;
  --font-subheading: 'Source Sans Pro', sans-serif;
  --font-body:       'Muli', sans-serif;
}
```

---

## Page Structure

### Home (`index.html`)

```
┌─────────────────────────────────────────┐
│  NAV                                    │
│  Logo (left) | Links + Donate CTA (right│
├─────────────────────────────────────────┤
│  HERO                                   │
│  Headline, subheading, primary CTA      │
├─────────────────────────────────────────┤
│  EVENTS — RETREATS (full-width)         │
│  Image/bg left, text + CTA right        │
│  Description of what retreats are       │
├─────────────────────────────────────────┤
│  EVENTS — COMMUNITY MEETUPS (full-width)│
│  Text left, image/bg right (alternating)│
│  Description of what meetups are        │
├─────────────────────────────────────────┤
│  DONATE STRIP                           │
│  Short impact sentence + Donate button  │
├─────────────────────────────────────────┤
│  EMAIL CTA                              │
│  "Stay updated on events"               │
│  Name + Email input + Submit button     │
├─────────────────────────────────────────┤
│  FOOTER                                 │
│  Logo | Sitemap links | Donate link     │
│  Email collection input                 │
│  Copyright line                         │
└─────────────────────────────────────────┘
```

### Section Details

**Nav**
- Logo (left)
- Links: Home, About, Retreats, Events, Donate (styled as button using `--color-primary`)

**Hero**
- Full-width, with a modest background image or soft gradient using palette colors
- H1 in Alike, subheading in Source Sans Pro, CTA button to Donate page

**Retreats Section** (full-width, stacked)
- Layout: image/visual on one side, text on the other
- Content: what retreats are, who they're for, how to get involved
- Soft background using `--color-highlight` (`#EABFB7`)

**Community Meetups Section** (full-width, stacked)
- Layout: alternates side (text left, visual right)
- Content: what meetups are, upcoming or recurring info
- Background: white or `--color-bg`

**Donate Strip**
- Simple centered band using `--color-dark` (`#6E4E41`) as background, light text
- One line of impact copy + a single "Donate Now" button

**Email CTA**
- Background: `--color-contrast` (`#7F9272`) or soft neutral
- Heading: "Stay updated on our events"
- Fields: Email address input + Submit
- Keep it minimal — no distractions

**Footer**
- Logo top-left
- Sitemap: Home, About, Retreats, Events, Donate
- Donate link (text link or small button)
- Email collection (single input + subscribe button)
- Copyright line: `© [year] EMMA Foundation. All rights reserved.`

---

## Notes for Future Meetings

- [ ] Confirm final domain selection with client team
- [ ] Monitor `emmafoundation.com` / `.org` for availability
- [ ] Finalize body font (Muli confirmed — but verify client approval)
- [ ] Obtain final logo export from Canva
- [ ] Confirm donation platform/processor (e.g., Stripe, PayPal, Give Lively)
- [ ] Gather copy for About/Mission page from client
- [ ] Next meeting: **Thursday @ 11am**