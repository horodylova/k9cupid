import crypto from "crypto";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

export function getSiteUrl() {
  const url = process.env.SITE_URL || "https://k9cupid.fit";
  return url.replace(/\/+$/, "");
}

function getTokenSecret() {
  return process.env.NEWSLETTER_TOKEN_SECRET || process.env.NEWSLETTER_CRON_SECRET || "";
}

export function buildUnsubscribeToken(email: string) {
  const secret = getTokenSecret();
  if (!secret) throw new Error("Missing NEWSLETTER_TOKEN_SECRET");
  return crypto
    .createHmac("sha256", secret)
    .update(email.trim().toLowerCase())
    .digest("base64url");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

type SanityPost = {
  _id: string;
  title: string;
  slug: string;
  mainImage?: unknown;
  excerpt: string;
  publishedAt?: string;
  _createdAt: string;
};

export type LatestPost = {
  id: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  url: string;
  imageUrl?: string;
};

function truncateText(text: string, maxLen: number) {
  const normalized = (text || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLen) return normalized;
  return `${normalized.slice(0, maxLen - 1).trim()}…`;
}

export async function getLatestPosts(limit = 3): Promise<LatestPost[]> {
  const query = `*[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc)[0...${Math.max(
    1,
    Math.min(10, limit)
  )}] {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    excerpt,
    publishedAt,
    _createdAt
  }`;

  const siteUrl = getSiteUrl();
  const posts = await client.fetch<SanityPost[]>(query);

  return (posts || []).map((post) => {
    const dateSource = post.publishedAt || post._createdAt;
    const dateObj = new Date(dateSource);
    const dateLabel = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const imageUrl = post.mainImage
      ? urlFor(post.mainImage).width(1120).height(700).url()
      : undefined;

    return {
      id: post.slug,
      title: post.title,
      excerpt: truncateText(post.excerpt, 160),
      dateLabel,
      url: `${siteUrl}/blog/${post.slug}`,
      imageUrl,
    };
  });
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildPostsHtmlTextOnly(posts: LatestPost[]) {
  return posts
    .map((p) => {
      const title = escapeHtml(p.title);
      const excerpt = escapeHtml(p.excerpt);
      const url = p.url;
      const date = escapeHtml(p.dateLabel);

      return `
        <tr>
          <td style="padding: 14px 0;">
            <div style="font-size:12px;line-height:18px;color:#6b7280;">${date}</div>
            <div style="font-size:18px;line-height:24px;font-weight:700;margin:4px 0 6px;">
              <a href="${url}" style="color:#111827;text-decoration:none;">${title}</a>
            </div>
            <div style="font-size:14px;line-height:20px;color:#374151;margin:0 0 10px;">${excerpt}</div>
            <a href="${url}" style="display:inline-block;font-size:14px;line-height:20px;color:#111827;text-decoration:underline;">Read more</a>
          </td>
        </tr>
        <tr><td style="height:1px;background:rgba(17,24,39,0.08);"></td></tr>
      `;
    })
    .join("");
}

function buildPostsHtmlWithImages(posts: LatestPost[]) {
  return posts
    .map((p) => {
      const title = escapeHtml(p.title);
      const excerpt = escapeHtml(p.excerpt);
      const url = p.url;
      const date = escapeHtml(p.dateLabel);
      const img = p.imageUrl ? escapeHtml(p.imageUrl) : "";

      return `
        <tr>
          <td style="padding: 16px 0;">
            ${
              img
                ? `<a href="${url}" style="text-decoration:none;">
                     <img src="${img}" alt="${title}" width="552" style="display:block;width:100%;max-width:552px;height:auto;border-radius:12px;border:0;outline:none;text-decoration:none;background:#f3f4f6;" />
                   </a>
                   <div style="height:10px;line-height:10px;font-size:10px;">&nbsp;</div>`
                : ""
            }
            <div style="font-size:12px;line-height:18px;color:#6b7280;">${date}</div>
            <div style="font-size:18px;line-height:24px;font-weight:800;margin:4px 0 6px;">
              <a href="${url}" style="color:#111827;text-decoration:none;">${title}</a>
            </div>
            <div style="font-size:14px;line-height:20px;color:#374151;margin:0 0 10px;">${excerpt}</div>
            <a href="${url}" style="display:inline-block;font-size:14px;line-height:20px;color:#111827;text-decoration:underline;">Read more</a>
          </td>
        </tr>
        <tr><td style="height:1px;background:rgba(17,24,39,0.08);"></td></tr>
      `;
    })
    .join("");
}

function buildEmailShell({
  preheader,
  headline,
  intro,
  postsHtml,
  primaryCtaLabel,
  primaryCtaUrl,
  footerText,
  unsubscribeUrl,
}: {
  preheader?: string;
  headline: string;
  intro: string;
  postsHtml: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  footerText: string;
  unsubscribeUrl: string;
}) {
  const siteUrl = getSiteUrl();
  const logoUrl = `${siteUrl}/${encodeURI("Cupid and Dogs-Picsart-BackgroundRemover.png")}`;
  const safePreheader = preheader ? escapeHtml(preheader) : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>k9cupid Newsletter</title>
  </head>
  <body style="margin:0;background:#f9f3ec;">
    ${
      safePreheader
        ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;line-height:0;font-size:0;">${safePreheader}</div>`
        : ""
    }
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9f3ec;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid rgba(17,24,39,0.08);">
            <tr>
              <td style="padding:22px 24px;background:#ffffff;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img src="${logoUrl}" alt="k9cupid" width="120" style="display:block;border:0;outline:none;text-decoration:none;height:auto;" />
                    </td>
                    <td style="text-align:right;vertical-align:middle;">
                      <a href="${siteUrl}" style="font-size:14px;line-height:20px;color:#111827;text-decoration:underline;">Visit k9cupid</a>
                    </td>
                  </tr>
                </table>
                <div style="font-size:22px;line-height:28px;font-weight:800;color:#111827;margin:18px 0 6px;">
                  ${escapeHtml(headline)}
                </div>
                <div style="font-size:14px;line-height:20px;color:#374151;margin:0 0 12px;">
                  ${escapeHtml(intro)}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 6px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  ${postsHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 24px 6px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <div style="font-size:14px;line-height:20px;color:#374151;margin:0 0 14px;">
                        ${escapeHtml(footerText)}
                      </div>
                      <a href="${primaryCtaUrl}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 16px;border-radius:9999px;font-size:14px;line-height:20px;font-weight:700;">
                        ${escapeHtml(primaryCtaLabel)}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px 22px;background:#ffffff;">
                <div style="font-size:12px;line-height:18px;color:#6b7280;">
                  You received this email because you subscribed on k9cupid.
                  <a href="${unsubscribeUrl}" style="color:#111827;text-decoration:underline;margin-left:8px;">Unsubscribe</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildWelcomeEmailHtml(posts: LatestPost[], unsubscribeUrl: string) {
  const siteUrl = getSiteUrl();
  const postsHtml = buildPostsHtmlTextOnly(posts);

  return buildEmailShell({
    preheader: "Welcome to k9cupid — latest articles inside.",
    headline: "Welcome to k9cupid",
    intro:
      "Thanks for joining. Here’s what you’ll get: the latest blog posts, quick links, and new updates as we ship them. We’ll email no more than once a week, and you can unsubscribe anytime.",
    postsHtml,
    primaryCtaLabel: "Start exploring",
    primaryCtaUrl: `${siteUrl}/blog`,
    footerText:
      "Coming soon: shelter highlights and adoption leads in this newsletter—we’re already working on it.",
    unsubscribeUrl,
  });
}

export function buildWeeklyNewsletterEmailHtml(posts: LatestPost[], unsubscribeUrl: string) {
  const siteUrl = getSiteUrl();
  const postsHtml = buildPostsHtmlWithImages(posts);

  return buildEmailShell({
    preheader: "Your weekly k9cupid updates — new articles inside.",
    headline: "This week on k9cupid",
    intro: "Latest breed guides, adoption tips, and stories to help you find the right match.",
    postsHtml,
    primaryCtaLabel: "Explore more on k9cupid",
    primaryCtaUrl: siteUrl,
    footerText:
      "Soon we’ll also share shelter updates and adoption leads in this newsletter—we’re already working on it.",
    unsubscribeUrl,
  });
}

export async function sendBrevoEmail(toEmail: string, subject: string, htmlContent: string) {
  const apiKey = requireEnv("BREVO_API_KEY");
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@carcupid.fit";
  const senderName = process.env.BREVO_SENDER_NAME || "k9cupid";

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: toEmail }],
      subject,
      htmlContent,
    }),
  });

  if (!res.ok) {
    throw new Error(`Brevo send failed with status ${res.status}`);
  }
}
