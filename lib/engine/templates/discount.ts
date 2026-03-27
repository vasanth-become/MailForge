/**
 * Discount Promo — 4 layout variants
 *
 * dc-code      Promo Code Classic — Promo badge + dashed code box + product image
 * dc-flash     Flash Sale         — High-urgency banner, countdown feel, expiry bar
 * dc-welcome   Welcome Offer      — Warm onboarding discount with value props
 * dc-seasonal  Seasonal Sale      — Multi-section layout with product showcase
 */

import type { BrandSettings, TemplateContent } from "@/lib/store/useMailStore";
import {
  escapeHtml, lighten, wrapDocument, openCard, closeCard,
  renderHeader, renderFooter, renderCta, renderHeroImage,
  renderInlineImage, renderDivider, renderColorBar, spacer,
} from "@/lib/engine/shared";

/* ── dc-code ──────────────────────────────────────────────────────────────
   Layout: Header → Big discount badge → Dashed code box → Body → Image → CTA → Footer
   Use case: Standard newsletter discount, coupon campaign
─────────────────────────────────────────────────────────────────────────── */
export function renderDcCode(brand: BrandSettings, content: TemplateContent): string {
  const tint = lighten(brand.secondaryColor, 0.92);
  const discount = content.discountAmount || "20% OFF";
  const code = content.discountCode || "SAVE20";
  const expiry = content.expiryDate;

  const body = `${openCard()}
  ${renderHeader(brand)}
  <tr>
    <td align="center" bgcolor="${brand.secondaryColor}" style="background-color:${brand.secondaryColor};padding:36px 40px 28px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:rgba(0,0,0,0.5);text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif;">Limited Time Offer</p>
      <h1 style="margin:0;font-size:60px;font-weight:900;color:#ffffff;line-height:1;font-family:Arial,sans-serif;letter-spacing:-2px;">${escapeHtml(discount)}</h1>
      <p style="margin:10px 0 0;font-size:15px;color:rgba(255,255,255,0.85);font-family:Arial,sans-serif;">Enter code at checkout</p>
    </td>
  </tr>
  <tr>
    <td align="center" bgcolor="#1a1a2e" style="background-color:#1a1a2e;padding:20px 40px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="border:2px dashed rgba(255,255,255,0.25);border-radius:8px;padding:12px 36px;">
            <span style="font-family:'Courier New',Courier,monospace;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:6px;">${escapeHtml(code)}</span>
          </td>
        </tr>
      </table>
      ${expiry ? `<p style="margin:12px 0 0;font-size:12px;color:#666688;font-family:Arial,sans-serif;">Expires: ${escapeHtml(expiry)}</p>` : ""}
    </td>
  </tr>
  <tr>
    <td class="content" bgcolor="#ffffff" style="background-color:#ffffff;padding:36px 40px 24px;">
      <h2 style="margin:0 0 14px;font-size:24px;font-weight:700;color:#1a1a2e;font-family:Arial,sans-serif;">${escapeHtml(content.heading)}</h2>
      <p style="margin:0 0 12px;font-size:15px;color:#555555;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.subtext)}</p>
      <p style="margin:0;font-size:14px;color:#777777;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.bodyText)}</p>
    </td>
  </tr>
  ${content.imageUrl ? `
  <tr>
    <td bgcolor="#ffffff" style="background-color:#ffffff;padding:0 40px 28px;line-height:0;font-size:0;">
      ${renderInlineImage(content.imageUrl, content.imageAlt, 520)}
    </td>
  </tr>` : ""}
  <tr>
    <td align="center" bgcolor="#ffffff" style="background-color:#ffffff;padding:0 40px 40px;">
      ${renderCta(content.ctaText, content.ctaLink, brand.secondaryColor)}
    </td>
  </tr>
  <tr>
    <td align="center" bgcolor="${tint}" style="background-color:${tint};padding:14px 40px;">
      <p style="margin:0;font-size:13px;color:#555555;font-family:Arial,sans-serif;">&#9200;&nbsp; Don&rsquo;t wait — this offer expires soon!</p>
    </td>
  </tr>
  ${renderFooter(brand)}
  ${closeCard}`;

  return wrapDocument(body, brand);
}

/* ── dc-flash ─────────────────────────────────────────────────────────────
   Layout: Urgent red banner → Image → Heading → Bold stat row → Code → CTA → Timer bar
   Use case: 24-hour flash sale, Black Friday, holiday surge pricing
─────────────────────────────────────────────────────────────────────────── */
export function renderDcFlash(brand: BrandSettings, content: TemplateContent): string {
  const discount = content.discountAmount || "50% OFF";
  const code = content.discountCode || "FLASH50";
  const expiry = content.expiryDate || "Tonight at midnight";

  const statItems = [
    { value: discount, label: "Discount" },
    { value: code, label: "Use Code" },
    { value: "Today", label: "Expires" },
  ];

  const body = `${openCard()}
  <tr>
    <td align="center" bgcolor="#c0392b" style="background-color:#c0392b;padding:12px 40px;border-radius:8px 8px 0 0;">
      <p style="margin:0;font-size:13px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:3px;font-family:Arial,sans-serif;">&#9889; Flash Sale &mdash; Limited Time Only &#9889;</p>
    </td>
  </tr>
  <tr>
    <td align="center" bgcolor="${brand.primaryColor}" style="background-color:${brand.primaryColor};padding:28px 40px 20px;">
      <h1 style="margin:0 0 6px;font-size:52px;font-weight:900;color:#ffffff;line-height:1;font-family:Arial,sans-serif;letter-spacing:-2px;">${escapeHtml(discount)}</h1>
      <p style="margin:0;font-size:16px;color:rgba(255,255,255,0.85);font-family:Arial,sans-serif;">${escapeHtml(content.heading)}</p>
    </td>
  </tr>
  ${content.imageUrl ? `<tr><td style="padding:0;line-height:0;font-size:0;">${renderHeroImage(content.imageUrl, content.imageAlt)}</td></tr>` : ""}
  <tr>
    <td bgcolor="#1a1a2e" style="background-color:#1a1a2e;padding:0;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          ${statItems.map((s, i) => `
          <td width="200" align="center" style="padding:20px 8px;${i < statItems.length - 1 ? "border-right:1px solid #2a2a3e;" : ""}">
            <p style="margin:0 0 4px;font-size:${i === 0 ? "22px" : "16px"};font-weight:700;color:#ffffff;font-family:'Courier New',Courier,monospace;">${escapeHtml(s.value)}</p>
            <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#556677;font-family:Arial,sans-serif;">${s.label}</p>
          </td>`).join("")}
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td class="content" bgcolor="#ffffff" style="background-color:#ffffff;padding:32px 40px 24px;">
      <p style="margin:0 0 14px;font-size:15px;color:#555555;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.subtext)}</p>
      <p style="margin:0;font-size:14px;color:#777777;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.bodyText)}</p>
    </td>
  </tr>
  <tr>
    <td align="center" bgcolor="#ffffff" style="background-color:#ffffff;padding:0 40px 40px;">
      ${renderCta(content.ctaText, content.ctaLink, brand.primaryColor)}
    </td>
  </tr>
  <tr>
    <td align="center" bgcolor="#c0392b" style="background-color:#c0392b;padding:14px 40px;border-radius:0 0 8px 8px;">
      <p style="margin:0;font-size:13px;color:#ffffff;font-family:Arial,sans-serif;">&#128308; Offer expires: <strong>${escapeHtml(expiry)}</strong> &mdash; Don&rsquo;t miss out!</p>
    </td>
  </tr>
  ${renderFooter(brand)}
  ${closeCard}`;

  return wrapDocument(body, brand);
}

/* ── dc-welcome ───────────────────────────────────────────────────────────
   Layout: Header → Welcome message → 3 value props → Code box → CTA → Footer
   Use case: Welcome email series, first-purchase discount, new subscriber offer
─────────────────────────────────────────────────────────────────────────── */
export function renderDcWelcome(brand: BrandSettings, content: TemplateContent): string {
  const tint = lighten(brand.primaryColor, 0.94);
  const discount = content.discountAmount || "15% OFF";
  const code = content.discountCode || "WELCOME15";

  const valueProps = [
    { icon: "✓", text: "Free shipping on your first order" },
    { icon: "✓", text: "30-day hassle-free returns" },
    { icon: "✓", text: "Priority customer support" },
  ];

  const body = `${openCard()}
  ${renderHeader(brand)}
  <tr>
    <td class="content" bgcolor="#ffffff" style="background-color:#ffffff;padding:40px 40px 24px;">
      <h1 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#1a1a2e;font-family:Arial,sans-serif;line-height:1.3;">${escapeHtml(content.heading)}</h1>
      <p style="margin:0 0 20px;font-size:16px;color:#444444;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.subtext)}</p>
      <p style="margin:0;font-size:15px;color:#666666;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.bodyText)}</p>
    </td>
  </tr>
  <tr>
    <td bgcolor="${tint}" style="background-color:${tint};padding:24px 40px;">
      <p style="margin:0 0 16px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#555555;font-family:Arial,sans-serif;">Your membership includes:</p>
      ${valueProps.map(p => `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:10px;">
        <tr>
          <td width="28" valign="top">
            <span style="display:inline-block;width:22px;height:22px;background-color:${brand.primaryColor};border-radius:50%;text-align:center;line-height:22px;font-size:12px;font-weight:700;color:#ffffff;font-family:Arial,sans-serif;">${p.icon}</span>
          </td>
          <td valign="middle" style="padding-left:4px;">
            <span style="font-size:15px;color:#333333;font-family:Arial,sans-serif;">${p.text}</span>
          </td>
        </tr>
      </table>`).join("")}
    </td>
  </tr>
  <tr>
    <td align="center" bgcolor="#1a1a2e" style="background-color:#1a1a2e;padding:28px 40px 20px;">
      <p style="margin:0 0 8px;font-size:14px;color:#aaaacc;font-family:Arial,sans-serif;">Your exclusive discount:</p>
      <h2 style="margin:0 0 12px;font-size:42px;font-weight:900;color:#ffffff;letter-spacing:-1px;font-family:Arial,sans-serif;">${escapeHtml(discount)}</h2>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="border:2px dashed rgba(255,255,255,0.2);border-radius:8px;padding:10px 28px;">
            <span style="font-family:'Courier New',Courier,monospace;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:5px;">${escapeHtml(code)}</span>
          </td>
        </tr>
      </table>
      ${content.expiryDate ? `<p style="margin:10px 0 0;font-size:12px;color:#555577;font-family:Arial,sans-serif;">Valid until: ${escapeHtml(content.expiryDate)}</p>` : ""}
    </td>
  </tr>
  ${content.imageUrl ? `<tr><td style="padding:0;line-height:0;font-size:0;">${renderHeroImage(content.imageUrl, content.imageAlt)}</td></tr>` : ""}
  <tr>
    <td align="center" bgcolor="#ffffff" style="background-color:#ffffff;padding:36px 40px 40px;">
      ${renderCta(content.ctaText, content.ctaLink, brand.primaryColor)}
    </td>
  </tr>
  ${renderFooter(brand)}
  ${closeCard}`;

  return wrapDocument(body, brand);
}

/* ── dc-seasonal ──────────────────────────────────────────────────────────
   Layout: Seasonal header → Split stat row → Two product sections → CTA → Footer
   Use case: Black Friday, Holiday Sale, Summer/Winter campaign
─────────────────────────────────────────────────────────────────────────── */
export function renderDcSeasonal(brand: BrandSettings, content: TemplateContent): string {
  const sec = lighten(brand.secondaryColor, 0.92);
  const discount = content.discountAmount || "Up to 40% OFF";
  const code = content.discountCode || "SEASON40";

  const body = `${openCard()}
  <tr>
    <td align="center" bgcolor="${brand.secondaryColor}" style="background-color:${brand.secondaryColor};padding:32px 40px 24px;border-radius:8px 8px 0 0;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:rgba(0,0,0,0.45);text-transform:uppercase;letter-spacing:3px;font-family:Arial,sans-serif;">Seasonal Sale</p>
      <h1 style="margin:0 0 8px;font-size:38px;font-weight:900;color:#ffffff;line-height:1.15;font-family:Arial,sans-serif;">${escapeHtml(discount)}</h1>
      <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.8);font-family:Arial,sans-serif;">${escapeHtml(content.subtext)}</p>
    </td>
  </tr>
  <tr>
    <td bgcolor="#1a1a2e" style="background-color:#1a1a2e;padding:16px 40px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td width="240" align="center" style="border-right:1px solid #2a2a3e;">
            <p style="margin:0 0 2px;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#556677;font-family:Arial,sans-serif;">Discount Code</p>
            <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:3px;font-family:'Courier New',monospace;">${escapeHtml(code)}</p>
          </td>
          <td align="center">
            <p style="margin:0 0 2px;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#556677;font-family:Arial,sans-serif;">Valid Through</p>
            <p style="margin:0;font-size:15px;font-weight:700;color:#ffffff;font-family:Arial,sans-serif;">${escapeHtml(content.expiryDate || "End of Season")}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td class="content" bgcolor="#ffffff" style="background-color:#ffffff;padding:32px 40px 20px;">
      <h2 style="margin:0 0 14px;font-size:22px;font-weight:700;color:#1a1a2e;font-family:Arial,sans-serif;">${escapeHtml(content.heading)}</h2>
      <p style="margin:0;font-size:15px;color:#555555;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.bodyText)}</p>
    </td>
  </tr>
  ${content.imageUrl ? `
  <tr>
    <td bgcolor="#ffffff" style="background-color:#ffffff;padding:0 40px 28px;">
      ${renderInlineImage(content.imageUrl, content.imageAlt, 520)}
    </td>
  </tr>` : ""}
  <tr>
    <td bgcolor="${sec}" style="background-color:${sec};padding:24px 40px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td valign="top">
            <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1a1a2e;font-family:Arial,sans-serif;">${escapeHtml(content.articleHeading || "More to explore")}</p>
            <p style="margin:0;font-size:14px;color:#666666;line-height:1.6;font-family:Arial,sans-serif;">${escapeHtml(content.articleText || "Browse our full collection and discover even more deals this season.")}</p>
          </td>
          ${content.articleImageUrl ? `
          <td width="120" valign="top" style="padding-left:20px;">
            <img src="${escapeHtml(content.articleImageUrl)}" alt="Sale" width="120"
              style="display:block;width:100%;max-width:120px;height:auto;border-radius:6px;border:0;" />
          </td>` : ""}
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td align="center" bgcolor="#ffffff" style="background-color:#ffffff;padding:32px 40px 40px;">
      ${renderCta(content.ctaText, content.ctaLink, brand.secondaryColor)}
    </td>
  </tr>
  ${renderFooter(brand)}
  ${closeCard}`;

  return wrapDocument(body, brand);
}
