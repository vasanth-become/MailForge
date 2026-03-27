import type { BrandSettings, TemplateContent, TemplateId } from "@/lib/store/useMailStore";

/* ─────────────────────────────────────────────
   Utilities
───────────────────────────────────────────── */

function lighten(hex: string, amount = 0.9): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const toHex = (n: number) =>
    Math.min(255, Math.round(n + (255 - n) * amount))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ─────────────────────────────────────────────
   Document wrapper
   - 600px container with fluid width fallback
   - Media queries are progressive enhancement only:
     the layout must already work at 375px without them.
   - No display:flex, display:grid anywhere in the body.
───────────────────────────────────────────── */

function wrapDocument(body: string, brand: BrandSettings): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${escapeHtml(brand.name)} Email</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style type="text/css">
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }

    /* Progressive enhancement only — layout works without these */
    @media only screen and (max-width: 620px) {
      .email-body-cell { padding: 24px 16px !important; }
      .content-cell    { padding: 28px 20px !important; }
      .narrow-pad      { padding: 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f0f0f5;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;">
<!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f0f0f5;"><tr><td><![endif]-->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f0f0f5">
  <tr>
    <td class="email-body-cell" align="center" style="padding:32px 16px;">
      ${body}
    </td>
  </tr>
</table>
<!--[if mso | IE]></td></tr></table><![endif]-->
</body>
</html>`;
}

/* ─────────────────────────────────────────────
   Shared blocks
───────────────────────────────────────────── */

function renderHeader(brand: BrandSettings): string {
  // Logo: cap at 140px wide, fluid below that
  const logo = brand.logoUrl
    ? `<img src="${escapeHtml(brand.logoUrl)}" alt="${escapeHtml(brand.name)}" width="140" style="display:block;width:auto;max-width:140px;height:auto;margin:0 auto;" />`
    : `<span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;font-family:Arial,sans-serif;">${escapeHtml(brand.name)}</span>`;

  return `
    <tr>
      <td align="center" bgcolor="${brand.primaryColor}" style="background-color:${brand.primaryColor};padding:24px 32px;text-align:center;border-radius:8px 8px 0 0;">
        ${logo}
      </td>
    </tr>`;
}

function renderFooter(brand: BrandSettings): string {
  return `
    <tr>
      <td align="center" bgcolor="#2d2d2d" style="background-color:#2d2d2d;padding:24px 32px;text-align:center;border-radius:0 0 8px 8px;">
        <p style="margin:0 0 8px 0;font-size:13px;color:#a0a0a0;font-family:Arial,sans-serif;line-height:1.5;">${escapeHtml(brand.footerText)}</p>
        <p style="margin:0;font-size:12px;color:#6b6b6b;font-family:Arial,sans-serif;">
          <a href="#" style="color:#6b6b6b;text-decoration:underline;">Unsubscribe</a>
          &nbsp;&middot;&nbsp;
          <a href="#" style="color:#6b6b6b;text-decoration:underline;">Privacy Policy</a>
        </p>
      </td>
    </tr>`;
}

/**
 * VML-safe CTA button.
 * Uses a nested table so width is determined by content (not a fixed % of parent).
 * Works in Outlook (VML path), Gmail, Apple Mail, and all mobile clients.
 */
function renderCta(text: string, link: string, color: string): string {
  const safeLink = escapeHtml(link || "#");
  const safeText = escapeHtml(text || "Click Here");
  return `<!--[if mso]>
  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
    href="${safeLink}" style="height:48px;v-text-anchor:middle;width:220px;" arcsize="12%"
    stroke="f" fillcolor="${color}">
    <w:anchorlock/>
    <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${safeText}</center>
  </v:roundrect>
  <![endif]--><!--[if !mso]><!-->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;">
    <tr>
      <td align="center" bgcolor="${color}" style="background-color:${color};border-radius:6px;padding:0;">
        <a href="${safeLink}" target="_blank"
          style="background-color:${color};border-radius:6px;color:#ffffff;display:inline-block;
                 font-family:Arial,sans-serif;font-size:15px;font-weight:700;line-height:1;
                 padding:14px 32px;text-align:center;text-decoration:none;
                 -webkit-text-size-adjust:none;mso-hide:all;">${safeText}</a>
      </td>
    </tr>
  </table>
  <!--<![endif]-->`;
}

/**
 * Full-width fluid image.
 * Uses width="600" attribute for Outlook, max-width:100% for everything else.
 * height:auto ensures it scales proportionally — no fixed pixel heights.
 */
function renderHeroImage(src: string, alt: string): string {
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"
    width="600"
    style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;text-decoration:none;" />`;
}

/**
 * Inline image for article layouts.
 * Renders full-width in a single-column layout so it works without media queries.
 */
function renderInlineImage(src: string, alt: string, maxPx: number): string {
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"
    width="${maxPx}"
    style="display:block;width:100%;max-width:${maxPx}px;height:auto;border:0;outline:none;text-decoration:none;border-radius:6px;" />`;
}

/* ─────────────────────────────────────────────
   Template 1: Product Launch
   Layout: fully single-column, fluid.
   Feature block: 3 rows (not 3 columns) so it
   renders correctly on narrow screens without
   any media query support.
───────────────────────────────────────────── */

function renderProductLaunch(brand: BrandSettings, content: TemplateContent): string {
  const tintBg = lighten(brand.primaryColor, 0.94);

  const heroRow = content.imageUrl
    ? `<tr><td style="padding:0;line-height:0;font-size:0;">${renderHeroImage(content.imageUrl, content.imageAlt)}</td></tr>`
    : `<tr><td align="center" bgcolor="${tintBg}"
        style="background-color:${tintBg};padding:48px 32px;text-align:center;">
        <p style="margin:0;font-size:16px;font-weight:600;color:${brand.primaryColor};font-family:Arial,sans-serif;">
          ${escapeHtml(brand.name)}
        </p>
      </td></tr>`;

  // 3-row feature list — renders identically at any width, no media queries needed
  const features = [
    { icon: "&#x1F680;", label: "Fast", desc: "Optimized for performance" },
    { icon: "&#x1F3AF;", label: "Precise", desc: "Built to your exact needs" },
    { icon: "&#x1F4A1;", label: "Smart", desc: "Intelligent by design" },
  ];

  const featureRows = features
    .map(
      (f) => `
    <tr>
      <td align="center" style="padding:12px 32px;border-bottom:1px solid rgba(0,0,0,0.06);">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td width="40" style="font-size:24px;padding-right:12px;vertical-align:middle;">${f.icon}</td>
            <td style="vertical-align:middle;">
              <p style="margin:0 0 2px 0;font-size:13px;font-weight:700;color:#1a1a2e;text-transform:uppercase;letter-spacing:0.5px;font-family:Arial,sans-serif;">${f.label}</p>
              <p style="margin:0;font-size:12px;color:#777777;font-family:Arial,sans-serif;">${f.desc}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
    )
    .join("");

  const body = `
  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"><tr><td style="width:600px;"><![endif]-->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"
    style="max-width:600px;width:100%;border-radius:8px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
    ${renderHeader(brand)}
    ${heroRow}
    <!-- Body copy -->
    <tr>
      <td class="content-cell" bgcolor="#ffffff"
        style="background-color:#ffffff;padding:36px 36px 28px 36px;">
        <h1 style="margin:0 0 14px 0;font-size:26px;font-weight:700;color:#1a1a2e;line-height:1.3;font-family:Arial,sans-serif;">${escapeHtml(content.heading)}</h1>
        <p style="margin:0 0 16px 0;font-size:16px;color:#555555;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.subtext)}</p>
        <p style="margin:0 0 28px 0;font-size:15px;color:#666666;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.bodyText)}</p>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr><td align="center">${renderCta(content.ctaText, content.ctaLink, brand.primaryColor)}</td></tr>
        </table>
      </td>
    </tr>
    <!-- Feature highlights: single-column rows, no media queries needed -->
    <tr>
      <td bgcolor="${tintBg}" style="background-color:${tintBg};padding:8px 0 0 0;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          ${featureRows}
          <tr><td style="padding-bottom:8px;"></td></tr>
        </table>
      </td>
    </tr>
    ${renderFooter(brand)}
  </table>
  <!--[if mso | IE]></td></tr></table><![endif]-->`;

  return wrapDocument(body, brand);
}

/* ─────────────────────────────────────────────
   Template 2: Discount Promotion
   Layout: single-column throughout.
   Promo code uses a table-border trick that
   renders in all clients including Outlook.
───────────────────────────────────────────── */

function renderDiscount(brand: BrandSettings, content: TemplateContent): string {
  const tintBg = lighten(brand.secondaryColor, 0.92);

  const imageRow = content.imageUrl
    ? `<tr>
        <td style="padding:0 36px 28px 36px;">
          ${renderInlineImage(content.imageUrl, content.imageAlt, 528)}
        </td>
      </tr>`
    : "";

  const body = `
  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"><tr><td style="width:600px;"><![endif]-->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"
    style="max-width:600px;width:100%;border-radius:8px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
    ${renderHeader(brand)}
    <!-- Discount banner -->
    <tr>
      <td class="narrow-pad" align="center" bgcolor="${brand.secondaryColor}"
        style="background-color:${brand.secondaryColor};padding:32px 32px;text-align:center;">
        <p style="margin:0 0 6px 0;font-size:13px;font-weight:600;color:rgba(0,0,0,0.55);text-transform:uppercase;letter-spacing:1.5px;font-family:Arial,sans-serif;">Limited Time Offer</p>
        <h1 style="margin:0;font-size:52px;font-weight:900;color:#ffffff;line-height:1;font-family:Arial,sans-serif;">${escapeHtml(content.discountAmount || "20% OFF")}</h1>
        <p style="margin:10px 0 0 0;font-size:14px;color:rgba(255,255,255,0.85);font-family:Arial,sans-serif;">Use code at checkout</p>
      </td>
    </tr>
    <!-- Promo code — dashed border via table outline, works in Outlook -->
    <tr>
      <td align="center" bgcolor="#1a1a2e" style="background-color:#1a1a2e;padding:20px 32px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center"
              style="border:2px dashed rgba(255,255,255,0.35);border-radius:6px;padding:12px 28px;">
              <span style="font-family:'Courier New',Courier,monospace;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:5px;">${escapeHtml(content.discountCode || "SAVE20")}</span>
            </td>
          </tr>
        </table>
        ${content.expiryDate ? `<p style="margin:10px 0 0 0;font-size:12px;color:#888888;font-family:Arial,sans-serif;">Expires: ${escapeHtml(content.expiryDate)}</p>` : ""}
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td class="content-cell" bgcolor="#ffffff" style="background-color:#ffffff;padding:36px 36px 28px 36px;">
        <h2 style="margin:0 0 14px 0;font-size:22px;font-weight:700;color:#1a1a2e;font-family:Arial,sans-serif;">${escapeHtml(content.heading)}</h2>
        <p style="margin:0 0 14px 0;font-size:15px;color:#555555;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.subtext)}</p>
        <p style="margin:0 0 28px 0;font-size:15px;color:#666666;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.bodyText)}</p>
        ${imageRow}
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr><td align="center">${renderCta(content.ctaText, content.ctaLink, brand.secondaryColor)}</td></tr>
        </table>
      </td>
    </tr>
    <!-- Urgency strip -->
    <tr>
      <td align="center" bgcolor="${tintBg}"
        style="background-color:${tintBg};padding:14px 32px;border-top:1px solid rgba(0,0,0,0.06);">
        <p style="margin:0;font-size:13px;color:#555555;font-family:Arial,sans-serif;">&#x23F0;&nbsp; This offer won't last long. Don't miss out!</p>
      </td>
    </tr>
    ${renderFooter(brand)}
  </table>
  <!--[if mso | IE]></td></tr></table><![endif]-->`;

  return wrapDocument(body, brand);
}

/* ─────────────────────────────────────────────
   Template 3: Newsletter
   Layout: single-column throughout.
   Articles use image-above-text stacking so
   they are readable at any width with no media
   queries. The gradient divider falls back to a
   solid border in Outlook (gradients unsupported).
───────────────────────────────────────────── */

function renderNewsletter(brand: BrandSettings, content: TemplateContent): string {
  const tintBg = lighten(brand.primaryColor, 0.94);
  // Compute month string outside the HTML string so it's part of the JS bundle,
  // not evaluated independently on server vs. client (avoids locale mismatch).
  const now = new Date();
  const month = now.toLocaleString("en-US", { month: "long", year: "numeric" });

  // Article 1: image stacked above text (single column, no side-by-side)
  const article1Image = content.imageUrl
    ? `<tr>
        <td style="padding:0 0 16px 0;line-height:0;font-size:0;">
          ${renderInlineImage(content.imageUrl, content.imageAlt, 520)}
        </td>
      </tr>`
    : "";

  // Article 2 image
  const article2Image = content.articleImageUrl
    ? `<tr>
        <td style="padding:0 0 14px 0;line-height:0;font-size:0;">
          ${renderInlineImage(content.articleImageUrl, "Article image", 520)}
        </td>
      </tr>`
    : "";

  // Secondary article section
  const article2 = content.articleHeading
    ? `<tr>
        <td class="content-cell" bgcolor="${tintBg}"
          style="background-color:${tintBg};padding:28px 36px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            ${article2Image}
            <tr>
              <td>
                <h2 style="margin:0 0 10px 0;font-size:18px;font-weight:700;color:#1a1a2e;font-family:Arial,sans-serif;">${escapeHtml(content.articleHeading)}</h2>
                <p style="margin:0;font-size:14px;color:#555555;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.articleText || "")}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : "";

  const body = `
  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"><tr><td style="width:600px;"><![endif]-->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"
    style="max-width:600px;width:100%;border-radius:8px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
    ${renderHeader(brand)}
    <!-- Issue label -->
    <tr>
      <td bgcolor="${tintBg}" style="background-color:${tintBg};padding:10px 36px;border-bottom:1px solid rgba(0,0,0,0.07);">
        <p style="margin:0;font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:1.2px;font-family:Arial,sans-serif;">Monthly Newsletter &nbsp;&middot;&nbsp; ${month}</p>
      </td>
    </tr>
    <!-- Intro -->
    <tr>
      <td class="content-cell" bgcolor="#ffffff" style="background-color:#ffffff;padding:36px 36px 24px 36px;">
        <h1 style="margin:0 0 12px 0;font-size:28px;font-weight:700;color:#1a1a2e;line-height:1.25;font-family:Arial,sans-serif;">${escapeHtml(content.heading)}</h1>
        <p style="margin:0;font-size:15px;color:#555555;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.subtext)}</p>
      </td>
    </tr>
    <!-- Gradient divider — solid fallback in Outlook -->
    <tr>
      <td bgcolor="#ffffff" style="background-color:#ffffff;padding:0 36px;">
        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-top:3px solid ${brand.primaryColor};font-size:0;line-height:0;">&nbsp;</td></tr></table><![endif]-->
        <!--[if !mso]><!-->
        <div style="height:3px;background:linear-gradient(to right,${brand.primaryColor},${brand.secondaryColor});border-radius:2px;font-size:0;line-height:0;">&nbsp;</div>
        <!--<![endif]-->
      </td>
    </tr>
    <!-- Article 1: image on top, text below -->
    <tr>
      <td class="content-cell" bgcolor="#ffffff" style="background-color:#ffffff;padding:28px 36px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          ${article1Image}
          <tr>
            <td>
              <h2 style="margin:0 0 10px 0;font-size:18px;font-weight:700;color:#1a1a2e;font-family:Arial,sans-serif;">${escapeHtml(content.bodyText)}</h2>
              <p style="margin:0 0 14px 0;font-size:14px;color:#555555;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.articleText || "Read on to discover what's new this month.")}</p>
              <a href="${escapeHtml(content.ctaLink || "#")}"
                style="font-size:14px;font-weight:700;color:${brand.primaryColor};text-decoration:none;font-family:Arial,sans-serif;">Read more &#x2192;</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${article2}
    <!-- CTA -->
    <tr>
      <td align="center" bgcolor="#ffffff" style="background-color:#ffffff;padding:20px 36px 36px 36px;">
        ${renderCta(content.ctaText || "Read Full Issue", content.ctaLink, brand.primaryColor)}
      </td>
    </tr>
    ${renderFooter(brand)}
  </table>
  <!--[if mso | IE]></td></tr></table><![endif]-->`;

  return wrapDocument(body, brand);
}

/* ─────────────────────────────────────────────
   Main export
───────────────────────────────────────────── */

export function renderEmail(
  templateId: TemplateId,
  brand: BrandSettings,
  content: TemplateContent
): string {
  switch (templateId) {
    case "product-launch":
      return renderProductLaunch(brand, content);
    case "discount":
      return renderDiscount(brand, content);
    case "newsletter":
      return renderNewsletter(brand, content);
    default:
      return renderProductLaunch(brand, content);
  }
}
