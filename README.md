# MailForge — Email Template Builder

A production-ready email template builder for SaaS and e-commerce marketers. Build responsive, table-based HTML emails that render correctly across Gmail, Outlook, Apple Mail, and mobile clients.

## Features

- **Brand Setup** — Set brand name, colors (primary + accent), logo URL, and footer text. Applied globally across all templates.
- **3 Pre-built Templates** — Product Launch, Discount Promotion, Newsletter. Switch without losing content.
- **Form-based Editor** — Edit headings, subtext, body copy, images, CTA button text/link. Template-specific fields (promo code, expiry date, article sections).
- **Live Preview** — Real-time preview in Desktop, Mobile (phone frame), and Gmail (chrome mock) modes.
- **Dark Preview Background** — Toggle dark canvas to test email contrast.
- **Table-based HTML Output** — Clean inline CSS, Outlook VML fallbacks, mobile media queries — compatible with all major email clients.
- **Export** — Copy HTML to clipboard or download as `.html` file.
- **Save / Load** — Save up to unlimited named templates in `localStorage`. Load or delete them any time.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| State | Zustand (persisted to localStorage) |
| Email Rendering | Custom table-based HTML engine |
| Language | TypeScript |

## Project Structure

```
app/
  components/
    brand/        BrandPanel.tsx
    editor/       TemplatePicker, ContentEditor, SavedTemplates
    export/       ExportPanel.tsx
    layout/       Sidebar, Header
    preview/      PreviewPanel.tsx
    ui/           ColorPicker, Input, Textarea, SectionHeader
  globals.css
  layout.tsx
  page.tsx
lib/
  engine/
    renderEmail.ts   — table-based HTML generator for all 3 templates
  store/
    useMailStore.ts  — Zustand store (brand, content, preview mode, saved templates)
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Email Compatibility

The rendered HTML uses:
- **Table-based layouts** for Outlook and legacy clients
- **VML button fallbacks** for Outlook CTA buttons
- **Inline CSS** for all styles (no external stylesheets)
- **Media queries** for mobile responsiveness (progressive enhancement)
- `xmlns:v` and `xmlns:o` namespace declarations for Outlook
- `x-apple-disable-message-reformatting` meta tag for Apple Mail

## Build

```bash
npm run build
npm start
```
