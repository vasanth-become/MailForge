/**
 * Product Launch — 4 layout variants
 *
 * pl-hero      Hero Showcase     — Full hero image + stacked feature rows
 * pl-minimal   Clean Announce    — Typography-first, no hero, accent bar
 * pl-features  Feature Spotlight — Small header image + icon+text feature blocks
 * pl-dark      Dark Launch       — Full dark theme, high-contrast
 */

import type { BrandSettings, TemplateContent } from "@/lib/store/useMailStore";
import {
  escapeHtml, lighten, wrapDocument, openCard, closeCard,
  renderHeader, renderDarkHeader, renderFooter, renderDarkFooter,
  renderCta, renderHeroImage, renderInlineImage, renderColorBar,
  renderDivider, spacer,
} from "@/lib/engine/shared";

/* ── pl-hero ──────────────────────────────────────────────────────────────
   Layout: Header → Full hero image → Body copy → Stacked feature rows → CTA → Footer
   Use case: Major SaaS launch, new product reveal, feature announcement
─────────────────────────────────────────────────────────────────────────── */
export function renderPlHero(brand: BrandSettings, content: TemplateContent): string {
  const tint = lighten(brand.primaryColor, 0.94);

  const heroRow = content.imageUrl
    ? `<tr><td style="padding:0;line-height:0;font-size:0;">${renderHeroImage(content.imageUrl, content.imageAlt)}</td></tr>`
    : `<tr><td align="center" bgcolor="${tint}" style="background-color:${tint};padding:52px 40px;">
        <p style="margin:0;font-size:15px;font-weight:600;color:${brand.primaryColor};font-family:Arial,sans-serif;">Product Preview</p>
      </td></tr>`;

  const features = [
    { icon: "🚀", title: "Launches instantly", body: "Deploy in seconds with zero configuration required." },
    { icon: "🎯", title: "Built for precision", body: "Every detail crafted to match your exact specifications." },
    { icon: "💡", title: "Intelligent by design", body: "Smart defaults that learn and adapt to your workflow." },
  ];

  const featureRows = features.map(f => `
  <tr>
    <td style="padding:0 40px 4px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td width="44" valign="top" style="padding:16px 16px 16px 0;">
            <div style="width:44px;height:44px;background-color:${tint};border-radius:8px;text-align:center;line-height:44px;font-size:22px;">${f.icon}</div>
          </td>
          <td valign="middle" style="padding:16px 0;">
            <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#1a1a2e;font-family:Arial,sans-serif;">${f.title}</p>
            <p style="margin:0;font-size:14px;color:#666666;line-height:1.6;font-family:Arial,sans-serif;">${f.body}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`).join("");

  const body = `${openCard()}
  ${renderHeader(brand)}
  ${heroRow}
  <tr>
    <td class="content" bgcolor="#ffffff" style="background-color:#ffffff;padding:40px 40px 32px;">
      <h1 style="margin:0 0 16px;font-size:30px;font-weight:700;color:#1a1a2e;line-height:1.25;font-family:Arial,sans-serif;">${escapeHtml(content.heading)}</h1>
      <p style="margin:0 0 16px;font-size:16px;color:#444444;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.subtext)}</p>
      <p style="margin:0;font-size:15px;color:#666666;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.bodyText)}</p>
    </td>
  </tr>
  ${spacer(4)}
  ${featureRows}
  ${spacer(8)}
  <tr>
    <td align="center" bgcolor="#ffffff" style="background-color:#ffffff;padding:0 40px 40px;">
      ${renderCta(content.ctaText, content.ctaLink, brand.primaryColor)}
    </td>
  </tr>
  ${renderFooter(brand)}
  ${closeCard}`;

  return wrapDocument(body, brand);
}

/* ── pl-minimal ───────────────────────────────────────────────────────────
   Layout: Header → Color bar → Large heading → Body → Accent quote → CTA → Footer
   Use case: API release, SDK update, SaaS tier announcement — copy-focused
─────────────────────────────────────────────────────────────────────────── */
export function renderPlMinimal(brand: BrandSettings, content: TemplateContent): string {
  const tint = lighten(brand.primaryColor, 0.94);

  const body = `${openCard()}
  ${renderHeader(brand)}
  ${renderColorBar(brand.primaryColor, brand.secondaryColor)}
  <tr>
    <td class="content" bgcolor="#ffffff" style="background-color:#ffffff;padding:48px 40px 32px;">
      <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:${brand.primaryColor};text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif;">Announcement</p>
      <h1 style="margin:0 0 24px;font-size:34px;font-weight:700;color:#0f0f1a;line-height:1.2;font-family:Arial,sans-serif;">${escapeHtml(content.heading)}</h1>
      <p style="margin:0 0 20px;font-size:16px;color:#444444;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.subtext)}</p>
      <p style="margin:0;font-size:15px;color:#666666;line-height:1.8;font-family:Arial,sans-serif;">${escapeHtml(content.bodyText)}</p>
    </td>
  </tr>
  <tr>
    <td bgcolor="${tint}" style="background-color:${tint};padding:24px 40px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td width="4" bgcolor="${brand.primaryColor}" style="background-color:${brand.primaryColor};border-radius:2px;">&nbsp;</td>
          <td style="padding:4px 0 4px 16px;">
            <p style="margin:0;font-size:15px;font-style:italic;color:#333333;line-height:1.6;font-family:Arial,sans-serif;">"${escapeHtml(content.subtext)}"</p>
            <p style="margin:8px 0 0;font-size:13px;font-weight:700;color:${brand.primaryColor};font-family:Arial,sans-serif;">— ${escapeHtml(brand.name)} Team</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${content.imageUrl ? `<tr><td style="padding:0;line-height:0;font-size:0;">${renderHeroImage(content.imageUrl, content.imageAlt)}</td></tr>` : ""}
  <tr>
    <td align="center" bgcolor="#ffffff" style="background-color:#ffffff;padding:40px;">
      <p style="margin:0 0 24px;font-size:14px;color:#888888;font-family:Arial,sans-serif;">Ready to get started?</p>
      ${renderCta(content.ctaText, content.ctaLink, brand.primaryColor)}
    </td>
  </tr>
  ${renderFooter(brand)}
  ${closeCard}`;

  return wrapDocument(body, brand);
}

/* ── pl-features ──────────────────────────────────────────────────────────
   Layout: Header → Heading+subtext → Image → 4 feature rows (numbered) → CTA → Footer
   Use case: Feature-rich product, app update with multiple improvements
─────────────────────────────────────────────────────────────────────────── */
export function renderPlFeatures(brand: BrandSettings, content: TemplateContent): string {
  const tint = lighten(brand.primaryColor, 0.94);
  const sec = lighten(brand.secondaryColor, 0.92);

  const featureDefs = [
    { num: "01", title: "Lightning Performance", body: "Optimized from the ground up for speed. Your users will notice the difference immediately." },
    { num: "02", title: "Seamless Integration", body: "Connects with your existing stack in minutes — no heavy lifting required." },
    { num: "03", title: "Built-in Analytics", body: "Real-time dashboards give you the insights you need to make better decisions." },
    { num: "04", title: "Enterprise Security", body: "SOC 2 compliant, end-to-end encrypted, and audited by independent security firms." },
  ];

  const featureRows = featureDefs.map((f, i) => `
  <tr>
    <td bgcolor="${i % 2 === 0 ? "#ffffff" : tint}" style="background-color:${i % 2 === 0 ? "#ffffff" : tint};padding:20px 40px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td width="48" valign="top" style="padding-right:16px;padding-top:2px;">
            <div style="width:44px;height:44px;background-color:${brand.primaryColor};border-radius:50%;text-align:center;line-height:44px;font-size:13px;font-weight:700;color:#ffffff;font-family:Arial,sans-serif;">${f.num}</div>
          </td>
          <td valign="top">
            <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#1a1a2e;font-family:Arial,sans-serif;">${f.title}</p>
            <p style="margin:0;font-size:14px;color:#666666;line-height:1.65;font-family:Arial,sans-serif;">${f.body}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`).join("");

  const body = `${openCard()}
  ${renderHeader(brand)}
  <tr>
    <td class="content" bgcolor="#ffffff" style="background-color:#ffffff;padding:40px 40px 28px;">
      <h1 style="margin:0 0 14px;font-size:28px;font-weight:700;color:#1a1a2e;line-height:1.3;font-family:Arial,sans-serif;">${escapeHtml(content.heading)}</h1>
      <p style="margin:0;font-size:16px;color:#555555;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.subtext)}</p>
    </td>
  </tr>
  ${content.imageUrl ? `<tr><td style="padding:0 40px 28px;background-color:#ffffff;">${renderInlineImage(content.imageUrl, content.imageAlt, 520)}</td></tr>` : ""}
  <tr>
    <td bgcolor="${sec}" style="background-color:${sec};padding:16px 40px;">
      <p style="margin:0;font-size:13px;font-weight:700;color:#444444;text-transform:uppercase;letter-spacing:1.5px;font-family:Arial,sans-serif;">What&rsquo;s included</p>
    </td>
  </tr>
  ${featureRows}
  <tr>
    <td class="content" bgcolor="#ffffff" style="background-color:#ffffff;padding:32px 40px;">
      <p style="margin:0 0 16px;font-size:15px;color:#666666;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.bodyText)}</p>
    </td>
  </tr>
  <tr>
    <td align="center" bgcolor="#ffffff" style="background-color:#ffffff;padding:0 40px 40px;">
      ${renderCta(content.ctaText, content.ctaLink, brand.primaryColor)}
    </td>
  </tr>
  ${renderFooter(brand)}
  ${closeCard}`;

  return wrapDocument(body, brand, "#f0f0f5");
}

/* ── pl-dark ──────────────────────────────────────────────────────────────
   Layout: Dark header → Dark hero → Dark body → Glowing CTA → Dark footer
   Use case: Gaming, dev tools, premium / exclusive product launch
─────────────────────────────────────────────────────────────────────────── */
export function renderPlDark(brand: BrandSettings, content: TemplateContent): string {
  const body = `${openCard()}
  ${renderDarkHeader(brand)}
  ${content.imageUrl ? `
  <tr>
    <td bgcolor="#0f0f1a" style="background-color:#0f0f1a;padding:0 32px 0;">
      <div style="border:2px solid ${brand.primaryColor};border-radius:8px;overflow:hidden;line-height:0;font-size:0;">
        ${renderHeroImage(content.imageUrl, content.imageAlt)}
      </div>
    </td>
  </tr>
  ${spacer(0)}` : ""}
  <tr>
    <td bgcolor="#0f0f1a" style="background-color:#0f0f1a;padding:40px 40px 8px;">
      <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:${brand.primaryColor};text-transform:uppercase;letter-spacing:2.5px;font-family:Arial,sans-serif;">Now Available</p>
      <h1 style="margin:0 0 18px;font-size:32px;font-weight:700;color:#ffffff;line-height:1.2;font-family:Arial,sans-serif;">${escapeHtml(content.heading)}</h1>
      <p style="margin:0;font-size:16px;color:#9999bb;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.subtext)}</p>
    </td>
  </tr>
  <tr>
    <td bgcolor="#0f0f1a" style="background-color:#0f0f1a;padding:24px 40px 0;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr><td bgcolor="#1e1e30" style="background-color:#1e1e30;border-radius:8px;border-left:3px solid ${brand.primaryColor};padding:20px 24px;">
          <p style="margin:0;font-size:15px;color:#ccccee;line-height:1.7;font-family:Arial,sans-serif;">${escapeHtml(content.bodyText)}</p>
        </td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td bgcolor="#0f0f1a" style="background-color:#0f0f1a;padding:20px 40px 0;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        ${[["⚡", "Instant Setup"], ["🔒", "Zero Lock-in"], ["🌐", "Global Scale"]].map(([icon, label]) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #1e1e30;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td width="28" style="font-size:18px;">${icon}</td>
                <td style="font-size:14px;font-weight:600;color:#aaaacc;font-family:Arial,sans-serif;">${label}</td>
              </tr>
            </table>
          </td>
        </tr>`).join("")}
      </table>
    </td>
  </tr>
  <tr>
    <td align="center" bgcolor="#0f0f1a" style="background-color:#0f0f1a;padding:36px 40px;">
      ${renderCta(content.ctaText, content.ctaLink, brand.primaryColor)}
    </td>
  </tr>
  ${renderDarkFooter(brand)}
  ${closeCard}`;

  return wrapDocument(body, brand, "#0a0a14");
}
