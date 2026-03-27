import type { BrandSettings, TemplateContent, TemplateId } from "@/lib/store/useMailStore";

/* ─────────────────────────────────────────────
   Utility helpers
───────────────────────────────────────────── */

function hex2rgb(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

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

/* ─────────────────────────────────────────────
   Shared building blocks (table-based)
───────────────────────────────────────────── */

function wrapDocument(body: string, brand: BrandSettings): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${brand.name} Email</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .mobile-full { width: 100% !important; display: block !important; }
      .mobile-pad { padding: 16px !important; }
      .hero-img { height: 200px !important; }
      .cta-btn { width: 80% !important; }
      .discount-box { padding: 20px !important; }
      .article-col { width: 100% !important; display: block !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4f7;">
  <tr>
    <td align="center" style="padding:24px 16px;">
      ${body}
    </td>
  </tr>
</table>
</body>
</html>`;
}

function renderHeader(brand: BrandSettings): string {
  const logo = brand.logoUrl
    ? `<img src="${brand.logoUrl}" alt="${brand.name}" width="120" style="display:block;max-width:120px;height:auto;border:0;" />`
    : `<span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">${brand.name}</span>`;

  return `
    <tr>
      <td style="background-color:${brand.primaryColor};padding:24px 32px;text-align:center;border-radius:8px 8px 0 0;">
        ${logo}
      </td>
    </tr>`;
}

function renderFooter(brand: BrandSettings): string {
  return `
    <tr>
      <td style="background-color:#2d2d2d;padding:24px 32px;text-align:center;border-radius:0 0 8px 8px;">
        <p style="margin:0 0 8px 0;font-size:13px;color:#a0a0a0;">${brand.footerText}</p>
        <p style="margin:0;font-size:12px;color:#6b6b6b;">
          <a href="#" style="color:#6b6b6b;text-decoration:underline;">Unsubscribe</a>
          &nbsp;·&nbsp;
          <a href="#" style="color:#6b6b6b;text-decoration:underline;">Privacy Policy</a>
        </p>
      </td>
    </tr>`;
}

function renderCta(text: string, link: string, color: string): string {
  return `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="border-radius:6px;background-color:${color};">
          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${link}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="10%" stroke="f" fillcolor="${color}"><w:anchorlock/><center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${text}</center></v:roundrect><![endif]-->
          <!--[if !mso]><!-->
          <a href="${link}" class="cta-btn" target="_blank" style="background-color:${color};border-radius:6px;color:#ffffff;display:inline-block;font-family:Arial,sans-serif;font-size:15px;font-weight:700;line-height:48px;text-align:center;text-decoration:none;min-width:200px;padding:0 24px;-webkit-text-size-adjust:none;">${text}</a>
          <!--<![endif]-->
        </td>
      </tr>
    </table>`;
}

/* ─────────────────────────────────────────────
   Template: Product Launch
───────────────────────────────────────────── */

function renderProductLaunch(brand: BrandSettings, content: TemplateContent): string {
  const tintBg = lighten(brand.primaryColor, 0.94);

  const body = `
  <table role="presentation" class="email-container" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;border-radius:8px;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
    ${renderHeader(brand)}
    <!-- Hero Image -->
    <tr>
      <td style="padding:0;line-height:0;">
        ${
          content.imageUrl
            ? `<img src="${content.imageUrl}" alt="${content.imageAlt}" width="600" class="hero-img" style="display:block;width:100%;max-width:600px;height:280px;object-fit:cover;border:0;" />`
            : `<div style="background-color:${tintBg};height:280px;display:flex;align-items:center;justify-content:center;text-align:center;padding:40px;box-sizing:border-box;"><span style="color:${brand.primaryColor};font-size:18px;font-weight:600;">Product Image</span></div>`
        }
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="background-color:#ffffff;padding:40px 40px 32px 40px;" class="mobile-pad">
        <h1 style="margin:0 0 16px 0;font-size:28px;font-weight:700;color:#1a1a2e;line-height:1.3;">${content.heading}</h1>
        <p style="margin:0 0 20px 0;font-size:16px;color:#555555;line-height:1.7;">${content.subtext}</p>
        <p style="margin:0 0 32px 0;font-size:15px;color:#666666;line-height:1.7;">${content.bodyText}</p>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center">
              ${renderCta(content.ctaText, content.ctaLink, brand.primaryColor)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Feature highlights -->
    <tr>
      <td style="background-color:${tintBg};padding:32px 40px;" class="mobile-pad">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td width="33%" style="padding:0 8px 0 0;text-align:center;vertical-align:top;" class="article-col">
              <div style="font-size:28px;margin-bottom:8px;">🚀</div>
              <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;color:#1a1a2e;text-transform:uppercase;letter-spacing:0.5px;">Fast</p>
              <p style="margin:0;font-size:12px;color:#777777;">Optimized for performance</p>
            </td>
            <td width="33%" style="padding:0 4px;text-align:center;vertical-align:top;" class="article-col">
              <div style="font-size:28px;margin-bottom:8px;">🎯</div>
              <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;color:#1a1a2e;text-transform:uppercase;letter-spacing:0.5px;">Precise</p>
              <p style="margin:0;font-size:12px;color:#777777;">Built to your exact needs</p>
            </td>
            <td width="33%" style="padding:0 0 0 8px;text-align:center;vertical-align:top;" class="article-col">
              <div style="font-size:28px;margin-bottom:8px;">💡</div>
              <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;color:#1a1a2e;text-transform:uppercase;letter-spacing:0.5px;">Smart</p>
              <p style="margin:0;font-size:12px;color:#777777;">Intelligent by design</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${renderFooter(brand)}
  </table>`;

  return wrapDocument(body, brand);
}

/* ─────────────────────────────────────────────
   Template: Discount Promotion
───────────────────────────────────────────── */

function renderDiscount(brand: BrandSettings, content: TemplateContent): string {
  const tintBg = lighten(brand.secondaryColor, 0.92);

  const body = `
  <table role="presentation" class="email-container" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;border-radius:8px;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
    ${renderHeader(brand)}
    <!-- Promo Banner -->
    <tr>
      <td style="background-color:${brand.secondaryColor};padding:32px 40px;text-align:center;" class="mobile-pad">
        <p style="margin:0 0 4px 0;font-size:14px;font-weight:600;color:rgba(0,0,0,0.6);text-transform:uppercase;letter-spacing:1px;">Limited Time Offer</p>
        <h1 style="margin:0;font-size:56px;font-weight:900;color:#ffffff;line-height:1;">${content.discountAmount || "20% OFF"}</h1>
        <p style="margin:8px 0 0 0;font-size:15px;color:rgba(255,255,255,0.85);">Use code at checkout</p>
      </td>
    </tr>
    <!-- Discount Code -->
    <tr>
      <td style="background-color:#1a1a2e;padding:20px 40px;text-align:center;" class="mobile-pad">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;">
          <tr>
            <td style="border:2px dashed rgba(255,255,255,0.3);border-radius:6px;padding:12px 32px;">
              <span style="font-family:'Courier New',Courier,monospace;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:4px;">${content.discountCode || "SAVE20"}</span>
            </td>
          </tr>
        </table>
        ${content.expiryDate ? `<p style="margin:12px 0 0 0;font-size:12px;color:#888888;">Expires: ${content.expiryDate}</p>` : ""}
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="background-color:#ffffff;padding:40px;" class="mobile-pad">
        <h2 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:#1a1a2e;">${content.heading}</h2>
        <p style="margin:0 0 16px 0;font-size:15px;color:#555555;line-height:1.7;">${content.subtext}</p>
        <p style="margin:0 0 32px 0;font-size:15px;color:#666666;line-height:1.7;">${content.bodyText}</p>
        ${
          content.imageUrl
            ? `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
            <tr><td style="padding:0;line-height:0;">
              <img src="${content.imageUrl}" alt="${content.imageAlt}" width="520" style="display:block;width:100%;max-width:520px;height:220px;object-fit:cover;border-radius:6px;border:0;" />
            </td></tr>
          </table>`
            : ""
        }
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center">
              ${renderCta(content.ctaText, content.ctaLink, brand.secondaryColor)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Urgency bar -->
    <tr>
      <td style="background-color:${tintBg};padding:16px 40px;text-align:center;border-top:1px solid rgba(0,0,0,0.06);" class="mobile-pad">
        <p style="margin:0;font-size:13px;color:#555555;">⏰ &nbsp;This offer won't last long. Don't miss out!</p>
      </td>
    </tr>
    ${renderFooter(brand)}
  </table>`;

  return wrapDocument(body, brand);
}

/* ─────────────────────────────────────────────
   Template: Newsletter
───────────────────────────────────────────── */

function renderNewsletter(brand: BrandSettings, content: TemplateContent): string {
  const tintBg = lighten(brand.primaryColor, 0.94);

  const body = `
  <table role="presentation" class="email-container" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;border-radius:8px;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
    ${renderHeader(brand)}
    <!-- Date bar -->
    <tr>
      <td style="background-color:${tintBg};padding:12px 40px;border-bottom:1px solid rgba(0,0,0,0.06);">
        <p style="margin:0;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:1px;">Monthly Newsletter &nbsp;·&nbsp; ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
      </td>
    </tr>
    <!-- Hero -->
    <tr>
      <td style="background-color:#ffffff;padding:40px 40px 32px 40px;" class="mobile-pad">
        <h1 style="margin:0 0 12px 0;font-size:30px;font-weight:700;color:#1a1a2e;line-height:1.2;">${content.heading}</h1>
        <p style="margin:0;font-size:16px;color:#555555;line-height:1.7;">${content.subtext}</p>
      </td>
    </tr>
    <!-- Divider -->
    <tr>
      <td style="background-color:#ffffff;padding:0 40px;">
        <div style="height:2px;background:linear-gradient(to right,${brand.primaryColor},${brand.secondaryColor});border-radius:2px;"></div>
      </td>
    </tr>
    <!-- Main article -->
    <tr>
      <td style="background-color:#ffffff;padding:32px 40px;" class="mobile-pad">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            ${
              content.imageUrl
                ? `<td width="200" style="padding-right:24px;vertical-align:top;" class="article-col">
                <img src="${content.imageUrl}" alt="${content.imageAlt}" width="200" style="display:block;width:100%;max-width:200px;height:140px;object-fit:cover;border-radius:6px;border:0;" />
              </td>`
                : ""
            }
            <td style="vertical-align:top;" class="article-col">
              <h2 style="margin:0 0 12px 0;font-size:18px;font-weight:700;color:#1a1a2e;">${content.bodyText}</h2>
              <p style="margin:0 0 16px 0;font-size:14px;color:#666666;line-height:1.7;">${content.articleText || "Read on to discover what's new this month."}</p>
              <a href="${content.ctaLink}" style="font-size:14px;font-weight:600;color:${brand.primaryColor};text-decoration:none;">Read more →</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Secondary article -->
    ${
      content.articleHeading
        ? `<tr>
      <td style="background-color:${tintBg};padding:32px 40px;" class="mobile-pad">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="vertical-align:top;" class="article-col">
              <h2 style="margin:0 0 12px 0;font-size:18px;font-weight:700;color:#1a1a2e;">${content.articleHeading}</h2>
              <p style="margin:0 0 16px 0;font-size:14px;color:#666666;line-height:1.7;">${content.articleText || ""}</p>
            </td>
            ${
              content.articleImageUrl
                ? `<td width="180" style="padding-left:24px;vertical-align:top;" class="article-col">
              <img src="${content.articleImageUrl}" alt="Article image" width="180" style="display:block;width:100%;max-width:180px;height:120px;object-fit:cover;border-radius:6px;border:0;" />
            </td>`
                : ""
            }
          </tr>
        </table>
      </td>
    </tr>`
        : ""
    }
    <!-- CTA -->
    <tr>
      <td style="background-color:#ffffff;padding:32px 40px;text-align:center;" class="mobile-pad">
        <p style="margin:0 0 24px 0;font-size:15px;color:#666666;">${content.ctaText ? "Ready to learn more?" : ""}</p>
        ${renderCta(content.ctaText || "Read Issue", content.ctaLink, brand.primaryColor)}
      </td>
    </tr>
    ${renderFooter(brand)}
  </table>`;

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
