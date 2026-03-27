/**
 * Newsletter — 4 layout variants
 *
 * nl-editorial      Editorial         — Lead article + secondary article + CTA
 * nl-digest         Weekly Digest     — Numbered article list + brief excerpts
 * nl-announcement   Company Update    — Founder tone, key updates as table rows
 * nl-product-update Product Update    — "What's new" changelog with numbered items
 */

import type { BrandSettings, TemplateContent } from "@/lib/store/useMailStore";
import {
  escapeHtml, lighten, wrapDocument, openCard, closeCard,
  renderHeader, renderFooter, renderCta, renderHeroImage,
  renderInlineImage, renderDivider, renderColorBar, spacer,
} from "@/lib/engine/shared";

/* ── nl-editorial ─────────────────────────────────────────────────────────
   Layout: Header → Issue bar → Lead article (image stacked + text) → Divider
           → Secondary article → CTA → Footer
   Use case: Company newsletter, weekly roundup, brand storytelling
─────────────────────────────────────────────────────────────────────────── */
export function renderNlEditorial(brand: BrandSettings, content: TemplateContent): string {
  const tint = lighten(brand.primaryColor, 0.94);

  const body = `${openCard()}
  ${renderHeader(brand)}
  <tr>
    <td bgcolor="${tint}" style="background-color:${tint};padding:12px 40px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#888888;font-family:Arial,sans-serif;">Monthly Newsletter</p>
          </td>
          <td align="right">
            <p style="margin:0;font-size:11px;color:#aaaaaa;font-family:Arial,sans-serif;">Issue #12</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${renderColorBar(brand.primaryColor, brand.secondaryColor)}
  <tr>
    <td class="content" bgcolor="#ffffff" style="background-color:#ffffff;padding:36px 40px 28px;">
      <h1 style="margin:0 0 12px;font-size:28px;font-weight:700;color:#1a1a2e;line-height:1.25;font-family:Arial,sans-serif;">${escapeHtml(content.heading)}</h1>
      <p style="margin:0;font-size:16px;color:#555555;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.subtext)}</p>
    </td>
  </tr>
  ${content.imageUrl ? `
  <tr>
    <td bgcolor="#ffffff" style="background-color:#ffffff;padding:0 40px 28px;line-height:0;font-size:0;">
      ${renderInlineImage(content.imageUrl, content.imageAlt, 520)}
    </td>
  </tr>` : ""}
  <tr>
    <td class="content" bgcolor="#ffffff" style="background-color:#ffffff;padding:0 40px 36px;">
      <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.8;font-family:Arial,sans-serif;">${escapeHtml(content.bodyText)}</p>
      <a href="${escapeHtml(content.ctaLink || "#")}" style="font-size:14px;font-weight:700;color:${brand.primaryColor};text-decoration:none;font-family:Arial,sans-serif;">Read the full story &rarr;</a>
    </td>
  </tr>
  ${renderDivider()}
  ${content.articleHeading ? `
  <tr>
    <td bgcolor="${tint}" style="background-color:${tint};padding:32px 40px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#888888;font-family:Arial,sans-serif;">Also this month</p>
      <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#1a1a2e;font-family:Arial,sans-serif;">${escapeHtml(content.articleHeading)}</h2>
      ${content.articleImageUrl ? `
      <div style="margin-bottom:16px;line-height:0;font-size:0;">
        ${renderInlineImage(content.articleImageUrl, "Article image", 520)}
      </div>` : ""}
      <p style="margin:0 0 16px;font-size:15px;color:#555555;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.articleText || "")}</p>
      <a href="${escapeHtml(content.ctaLink || "#")}" style="font-size:14px;font-weight:700;color:${brand.primaryColor};text-decoration:none;font-family:Arial,sans-serif;">Continue reading &rarr;</a>
    </td>
  </tr>` : ""}
  <tr>
    <td align="center" bgcolor="#ffffff" style="background-color:#ffffff;padding:36px 40px 40px;">
      ${renderCta(content.ctaText, content.ctaLink, brand.primaryColor)}
    </td>
  </tr>
  ${renderFooter(brand)}
  ${closeCard}`;

  return wrapDocument(body, brand);
}

/* ── nl-digest ────────────────────────────────────────────────────────────
   Layout: Header → Intro → 4 article teasers (numbered) → CTA → Footer
   Use case: Weekly roundup, curated links, content digest
─────────────────────────────────────────────────────────────────────────── */
export function renderNlDigest(brand: BrandSettings, content: TemplateContent): string {
  const tint = lighten(brand.primaryColor, 0.94);

  const articles = [
    { num: 1, title: content.heading, excerpt: content.bodyText, tag: "Feature" },
    { num: 2, title: content.articleHeading || "Industry Trends Worth Watching", excerpt: content.articleText || "A deep-dive into the forces reshaping the market this quarter and what they mean for your business.", tag: "Analysis" },
    { num: 3, title: "The Tools Our Team Can't Live Without", excerpt: "We asked our top performers what software drives their workflow. The answers might surprise you.", tag: "Resources" },
    { num: 4, title: "Community Spotlight: Customer Stories", excerpt: "Real results from real customers — how three teams transformed their operations using our platform.", tag: "Stories" },
  ];

  const articleRows = articles.map(a => `
  <tr>
    <td bgcolor="#ffffff" style="background-color:#ffffff;padding:20px 40px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td width="40" valign="top" style="padding-right:16px;padding-top:2px;">
            <div style="width:36px;height:36px;background-color:${brand.primaryColor};border-radius:6px;text-align:center;line-height:36px;font-size:14px;font-weight:700;color:#ffffff;font-family:Arial,sans-serif;">${a.num}</div>
          </td>
          <td valign="top">
            <p style="margin:0 0 2px;">
              <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${brand.secondaryColor};font-family:Arial,sans-serif;">${a.tag}</span>
            </p>
            <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#1a1a2e;line-height:1.3;font-family:Arial,sans-serif;">${escapeHtml(a.title)}</p>
            <p style="margin:0 0 8px;font-size:13px;color:#777777;line-height:1.6;font-family:Arial,sans-serif;">${escapeHtml(a.excerpt)}</p>
            <a href="${escapeHtml(content.ctaLink || "#")}" style="font-size:13px;font-weight:600;color:${brand.primaryColor};text-decoration:none;font-family:Arial,sans-serif;">Read more &rarr;</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr><td bgcolor="#f7f7fa" style="background-color:#f7f7fa;height:1px;font-size:0;line-height:0;padding:0;">&nbsp;</td></tr>`).join("");

  const body = `${openCard()}
  ${renderHeader(brand)}
  <tr>
    <td class="content" bgcolor="#ffffff" style="background-color:#ffffff;padding:36px 40px 24px;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#888888;font-family:Arial,sans-serif;">Weekly Digest</p>
      <h1 style="margin:0 0 14px;font-size:26px;font-weight:700;color:#1a1a2e;font-family:Arial,sans-serif;line-height:1.25;">${escapeHtml(content.heading)}</h1>
      <p style="margin:0;font-size:15px;color:#555555;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.subtext)}</p>
    </td>
  </tr>
  <tr>
    <td bgcolor="${tint}" style="background-color:${tint};padding:10px 40px;">
      <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#888888;font-family:Arial,sans-serif;">This week&rsquo;s reads</p>
    </td>
  </tr>
  ${articleRows}
  <tr>
    <td align="center" bgcolor="${tint}" style="background-color:${tint};padding:32px 40px 36px;">
      <p style="margin:0 0 20px;font-size:14px;color:#666666;font-family:Arial,sans-serif;">Enjoying the digest? Share it with your team.</p>
      ${renderCta(content.ctaText || "Browse All Articles", content.ctaLink, brand.primaryColor)}
    </td>
  </tr>
  ${renderFooter(brand)}
  ${closeCard}`;

  return wrapDocument(body, brand);
}

/* ── nl-announcement ──────────────────────────────────────────────────────
   Layout: Header → Personal intro → 3 key update rows → Closing → Signature → CTA
   Use case: Founder update, company milestone, investor letter, team memo
─────────────────────────────────────────────────────────────────────────── */
export function renderNlAnnouncement(brand: BrandSettings, content: TemplateContent): string {
  const tint = lighten(brand.primaryColor, 0.94);

  const updates = [
    { label: "Revenue Growth", detail: "We crossed a significant milestone this quarter, growing 40% month-over-month.", color: brand.primaryColor },
    { label: "New Partnerships", detail: "We've signed agreements with three enterprise partners that expand our reach globally.", color: brand.secondaryColor },
    { label: "Team Expansion", detail: "We're growing — 15 new roles opening this month across engineering, design, and GTM.", color: brand.primaryColor },
  ];

  const updateRows = updates.map(u => `
  <tr>
    <td style="padding:0 40px 12px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td width="4" bgcolor="${u.color}" style="background-color:${u.color};border-radius:2px;">&nbsp;</td>
          <td style="padding:12px 16px;">
            <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#1a1a2e;font-family:Arial,sans-serif;">${u.label}</p>
            <p style="margin:0;font-size:14px;color:#666666;line-height:1.6;font-family:Arial,sans-serif;">${u.detail}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`).join("");

  const body = `${openCard()}
  ${renderHeader(brand)}
  <tr>
    <td class="content" bgcolor="#ffffff" style="background-color:#ffffff;padding:40px 40px 20px;">
      <p style="margin:0 0 20px;font-size:14px;color:#888888;font-family:Arial,sans-serif;">From the desk of the founder</p>
      <h1 style="margin:0 0 20px;font-size:28px;font-weight:700;color:#1a1a2e;line-height:1.25;font-family:Arial,sans-serif;">${escapeHtml(content.heading)}</h1>
      <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.8;font-family:Arial,sans-serif;">${escapeHtml(content.subtext)}</p>
      <p style="margin:0;font-size:15px;color:#444444;line-height:1.8;font-family:Arial,sans-serif;">${escapeHtml(content.bodyText)}</p>
    </td>
  </tr>
  <tr>
    <td bgcolor="${tint}" style="background-color:${tint};padding:20px 40px 8px;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#888888;font-family:Arial,sans-serif;">Key updates</p>
    </td>
  </tr>
  ${updateRows}
  ${spacer(8)}
  <tr>
    <td class="content" bgcolor="#ffffff" style="background-color:#ffffff;padding:28px 40px 12px;">
      <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.8;font-family:Arial,sans-serif;">${escapeHtml(content.articleText || "As always, thank you for being part of this journey. We wouldn't be here without your continued trust and support. Exciting things are ahead — stay tuned.")}</p>
      <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#1a1a2e;font-family:Arial,sans-serif;">Warm regards,</p>
      <p style="margin:0;font-size:15px;color:#666666;font-family:Arial,sans-serif;">The ${escapeHtml(brand.name)} Team</p>
    </td>
  </tr>
  ${content.imageUrl ? `
  <tr>
    <td bgcolor="#ffffff" style="background-color:#ffffff;padding:20px 40px 0;line-height:0;font-size:0;">
      ${renderInlineImage(content.imageUrl, content.imageAlt, 520)}
    </td>
  </tr>` : ""}
  <tr>
    <td align="center" bgcolor="#ffffff" style="background-color:#ffffff;padding:32px 40px 40px;">
      ${renderCta(content.ctaText, content.ctaLink, brand.primaryColor)}
    </td>
  </tr>
  ${renderFooter(brand)}
  ${closeCard}`;

  return wrapDocument(body, brand);
}

/* ── nl-product-update ────────────────────────────────────────────────────
   Layout: "What's New" header → Version row → 4 numbered updates → Screenshot → CTA
   Use case: SaaS changelog email, app release notes, feature ship announcement
─────────────────────────────────────────────────────────────────────────── */
export function renderNlProductUpdate(brand: BrandSettings, content: TemplateContent): string {
  const tint = lighten(brand.primaryColor, 0.94);
  const sec = lighten(brand.secondaryColor, 0.92);

  const updates = [
    { num: "01", tag: "New Feature", title: content.heading, body: content.bodyText },
    { num: "02", tag: "Improvement", title: content.articleHeading || "Faster Performance", body: "We've reduced load times by 60% across all dashboard views." },
    { num: "03", tag: "Fix", title: "Resolved Sync Issues", body: "Fixed an edge case where data could fall out of sync across team workspaces." },
    { num: "04", tag: "Coming Soon", title: "Roadmap Preview", body: "AI-powered suggestions and bulk export are landing next sprint." },
  ];

  const tagColors: Record<string, string> = {
    "New Feature": brand.primaryColor,
    "Improvement": brand.secondaryColor,
    "Fix": "#059669",
    "Coming Soon": "#7c3aed",
  };

  const updateRows = updates.map(u => `
  <tr>
    <td bgcolor="#ffffff" style="background-color:#ffffff;padding:20px 40px 12px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td width="48" valign="top" style="padding-right:16px;padding-top:2px;">
            <div style="width:44px;height:44px;border:2px solid ${tagColors[u.tag] || brand.primaryColor};border-radius:8px;text-align:center;line-height:40px;font-size:13px;font-weight:700;color:${tagColors[u.tag] || brand.primaryColor};font-family:Arial,sans-serif;">${u.num}</div>
          </td>
          <td valign="top">
            <span style="display:inline-block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#ffffff;background-color:${tagColors[u.tag] || brand.primaryColor};border-radius:3px;padding:2px 8px;margin-bottom:6px;font-family:Arial,sans-serif;">${u.tag}</span>
            <p style="margin:4px 0 6px;font-size:16px;font-weight:700;color:#1a1a2e;font-family:Arial,sans-serif;">${escapeHtml(u.title)}</p>
            <p style="margin:0;font-size:14px;color:#666666;line-height:1.65;font-family:Arial,sans-serif;">${escapeHtml(u.body)}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr><td bgcolor="#f5f5f8" style="background-color:#f5f5f8;height:1px;font-size:0;line-height:0;padding:0;">&nbsp;</td></tr>`).join("");

  const body = `${openCard()}
  <tr>
    <td align="center" bgcolor="${brand.primaryColor}" style="background-color:${brand.primaryColor};padding:18px 40px;border-radius:8px 8px 0 0;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            ${brand.logoUrl
              ? `<img src="${escapeHtml(brand.logoUrl)}" alt="${escapeHtml(brand.name)}" width="120" style="display:block;max-width:120px;height:auto;border:0;" />`
              : `<span style="font-size:20px;font-weight:700;color:#ffffff;font-family:Arial,sans-serif;">${escapeHtml(brand.name)}</span>`}
          </td>
          <td align="right">
            <span style="display:inline-block;font-size:11px;font-weight:700;color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.3);border-radius:20px;padding:4px 12px;font-family:Arial,sans-serif;">What&rsquo;s New</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td bgcolor="${tint}" style="background-color:${tint};padding:20px 40px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <h1 style="margin:0 0 4px;font-size:22px;font-weight:700;color:#1a1a2e;font-family:Arial,sans-serif;">${escapeHtml(content.heading)}</h1>
            <p style="margin:0;font-size:14px;color:#888888;font-family:Arial,sans-serif;">${escapeHtml(content.subtext)}</p>
          </td>
          <td align="right" valign="middle">
            <span style="font-size:12px;font-weight:700;color:${brand.primaryColor};background-color:#ffffff;border-radius:20px;padding:5px 14px;border:1px solid ${brand.primaryColor};font-family:Arial,sans-serif;white-space:nowrap;">v2.4.0 Released</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${updateRows}
  ${content.imageUrl ? `
  <tr>
    <td bgcolor="#ffffff" style="background-color:#ffffff;padding:20px 40px 0;line-height:0;font-size:0;">
      ${renderInlineImage(content.imageUrl, content.imageAlt, 520)}
    </td>
  </tr>` : ""}
  <tr>
    <td align="center" bgcolor="#ffffff" style="background-color:#ffffff;padding:32px 40px 40px;">
      <p style="margin:0 0 20px;font-size:14px;color:#888888;font-family:Arial,sans-serif;">Questions? Reply to this email — we read every message.</p>
      ${renderCta(content.ctaText || "See Full Changelog", content.ctaLink, brand.primaryColor)}
    </td>
  </tr>
  ${renderFooter(brand)}
  ${closeCard}`;

  return wrapDocument(body, brand);
}
