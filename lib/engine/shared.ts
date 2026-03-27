/**
 * Shared email rendering primitives.
 * All output is table-based, inline-CSS, compatible with Gmail, Outlook,
 * Apple Mail, and all mobile clients.
 *
 * Rules enforced here:
 * - No display:flex / display:grid in email HTML
 * - Width controlled via HTML `width` attribute AND inline style
 * - Images: width attr + max-width:100% + height:auto (never fixed height)
 * - bgcolor attribute on <td> as Outlook fallback for background-color
 * - VML for CTA buttons (Outlook)
 * - Media queries in <style> are progressive enhancement only
 */

import type { BrandSettings } from "@/lib/store/useMailStore";

/* ─── Utilities ─────────────────────────────────────────────────────────── */

export function lighten(hex: string, amount = 0.92): string {
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

export function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Outer HTML shell — sets background, MSO conditionals, reset CSS */
export function wrapDocument(body: string, brand: BrandSettings, bgColor = "#f0f0f5"): string {
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
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
    img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none;}
    /* Progressive enhancement — layout never depends on these */
    @media only screen and (max-width:620px){
      .wrap{padding:24px 16px!important;}
      .content{padding:28px 20px!important;}
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${bgColor};font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;">
<!--[if mso|IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="${bgColor}"><tr><td><![endif]-->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="${bgColor}">
  <tr>
    <td class="wrap" align="center" style="padding:32px 16px;">
      ${body}
    </td>
  </tr>
</table>
<!--[if mso|IE]></td></tr></table><![endif]-->
</body>
</html>`;
}

/* ─── Card container ─────────────────────────────────────────────────────── */

/** 600px fluid card that houses all template rows */
export function openCard(): string {
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;">`;
}
export const closeCard = `</table>`;

/* ─── Header variants ────────────────────────────────────────────────────── */

export function renderHeader(brand: BrandSettings): string {
  const logo = brand.logoUrl
    ? `<img src="${escapeHtml(brand.logoUrl)}" alt="${escapeHtml(brand.name)}" width="140"
        style="display:block;width:auto;max-width:140px;height:auto;margin:0 auto;" />`
    : `<span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;font-family:Arial,sans-serif;">${escapeHtml(brand.name)}</span>`;
  return `<tr>
    <td align="center" bgcolor="${brand.primaryColor}"
        style="background-color:${brand.primaryColor};padding:22px 32px;text-align:center;border-radius:8px 8px 0 0;">
      ${logo}
    </td>
  </tr>`;
}

export function renderDarkHeader(brand: BrandSettings): string {
  const logo = brand.logoUrl
    ? `<img src="${escapeHtml(brand.logoUrl)}" alt="${escapeHtml(brand.name)}" width="140"
        style="display:block;width:auto;max-width:140px;height:auto;margin:0 auto;" />`
    : `<span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;font-family:Arial,sans-serif;">${escapeHtml(brand.name)}</span>`;
  return `<tr>
    <td align="center" bgcolor="#0f0f1a"
        style="background-color:#0f0f1a;padding:22px 32px;text-align:center;border-radius:8px 8px 0 0;border-bottom:2px solid ${brand.primaryColor};">
      ${logo}
    </td>
  </tr>`;
}

/* ─── Footer variants ────────────────────────────────────────────────────── */

export function renderFooter(brand: BrandSettings): string {
  return `<tr>
    <td align="center" bgcolor="#2d2d2d"
        style="background-color:#2d2d2d;padding:24px 32px;text-align:center;border-radius:0 0 8px 8px;">
      <p style="margin:0 0 8px;font-size:13px;color:#a0a0a0;font-family:Arial,sans-serif;line-height:1.5;">${escapeHtml(brand.footerText)}</p>
      <p style="margin:0;font-size:12px;color:#6b6b6b;font-family:Arial,sans-serif;">
        <a href="#" style="color:#6b6b6b;text-decoration:underline;">Unsubscribe</a>
        &nbsp;&middot;&nbsp;
        <a href="#" style="color:#6b6b6b;text-decoration:underline;">Privacy Policy</a>
      </p>
    </td>
  </tr>`;
}

export function renderDarkFooter(brand: BrandSettings): string {
  return `<tr>
    <td align="center" bgcolor="#0f0f1a"
        style="background-color:#0f0f1a;padding:24px 32px;text-align:center;border-radius:0 0 8px 8px;border-top:1px solid #2a2a3a;">
      <p style="margin:0 0 8px;font-size:13px;color:#555577;font-family:Arial,sans-serif;line-height:1.5;">${escapeHtml(brand.footerText)}</p>
      <p style="margin:0;font-size:12px;color:#3a3a5a;font-family:Arial,sans-serif;">
        <a href="#" style="color:#3a3a5a;text-decoration:underline;">Unsubscribe</a>
        &nbsp;&middot;&nbsp;
        <a href="#" style="color:#3a3a5a;text-decoration:underline;">Privacy Policy</a>
      </p>
    </td>
  </tr>`;
}

/* ─── CTA button ─────────────────────────────────────────────────────────── */

/**
 * VML-safe button for Outlook + standard <a> for all other clients.
 * Always centered. Never uses fixed width that would break narrow viewports.
 */
export function renderCta(text: string, link: string, color: string, textColor = "#ffffff"): string {
  const sl = escapeHtml(link || "#");
  const st = escapeHtml(text || "Learn More");
  return `<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
  href="${sl}" style="height:48px;v-text-anchor:middle;width:220px;" arcsize="12%" stroke="f" fillcolor="${color}">
  <w:anchorlock/><center style="color:${textColor};font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${st}</center>
</v:roundrect>
<![endif]--><!--[if !mso]><!-->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;">
  <tr>
    <td align="center" bgcolor="${color}" style="background-color:${color};border-radius:6px;">
      <a href="${sl}" target="_blank"
         style="background-color:${color};border-radius:6px;color:${textColor};display:inline-block;
                font-family:Arial,sans-serif;font-size:15px;font-weight:700;line-height:1;
                padding:14px 32px;text-align:center;text-decoration:none;-webkit-text-size-adjust:none;mso-hide:all;">${st}</a>
    </td>
  </tr>
</table><!--<![endif]-->`;
}

/* ─── Images ─────────────────────────────────────────────────────────────── */

/** Full-width hero — scales from 600px down, always height:auto */
export function renderHeroImage(src: string, alt: string): string {
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"
    width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" />`;
}

/** Constrained inline image, always single-column */
export function renderInlineImage(src: string, alt: string, maxPx = 520): string {
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"
    width="${maxPx}" style="display:block;width:100%;max-width:${maxPx}px;height:auto;border:0;border-radius:6px;" />`;
}

/* ─── Dividers ───────────────────────────────────────────────────────────── */

export function renderDivider(color = "#e5e7eb"): string {
  return `<tr>
    <td style="padding:0 32px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr><td style="border-top:1px solid ${color};font-size:0;line-height:0;">&nbsp;</td></tr>
      </table>
    </td>
  </tr>`;
}

export function renderColorBar(color1: string, color2: string): string {
  // Solid fallback color (Outlook doesn't support CSS gradients)
  return `<tr>
    <td bgcolor="${color1}" style="background-color:${color1};height:3px;font-size:0;line-height:0;padding:0;">
      <!--[if !mso]><!-->
      <div style="height:3px;background:linear-gradient(to right,${color1},${color2});"></div>
      <!--<![endif]-->
    </td>
  </tr>`;
}

/* ─── Spacers ────────────────────────────────────────────────────────────── */

export function spacer(px: number): string {
  return `<tr><td style="height:${px}px;font-size:0;line-height:0;">&nbsp;</td></tr>`;
}
