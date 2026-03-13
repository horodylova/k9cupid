import { NextResponse } from "next/server";
import { Pool } from "pg";
import {
  buildWeeklyNewsletterEmailHtml,
  buildUnsubscribeToken,
  getLatestPosts,
  getSiteUrl,
  sendBrevoEmail,
} from "@/lib/newsletter";

export const runtime = "nodejs";

let pool: Pool | null = null;

function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL");
  }
  if (!pool) {
    pool = new Pool({ connectionString });
  }
  return pool;
}

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

export async function POST(request: Request) {
  try {
    const expected = requireEnv("NEWSLETTER_CRON_SECRET");
    const provided = request.headers.get("x-cron-secret") || "";
    if (!provided || provided !== expected) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const limitRaw = url.searchParams.get("limit");
    const limit = Math.max(1, Math.min(500, Number(limitRaw || "200") || 200));

    const posts = await getLatestPosts(3);
    if (posts.length === 0) {
      return NextResponse.json({ ok: false, error: "No posts found" }, { status: 500 });
    }

    const db = getPool();
    const recipients = await db.query<{ email: string }>(
      `
        SELECT email
        FROM newsletter_subscribers
        WHERE status = 'active'
          AND (last_sent_at IS NULL OR last_sent_at < now() - interval '7 days')
        ORDER BY last_sent_at NULLS FIRST, created_at ASC
        LIMIT $1
      `,
      [limit]
    );

    const siteUrl = getSiteUrl();
    const subject = "Your weekly k9cupid updates";

    let sent = 0;
    let failed = 0;

    for (const row of recipients.rows) {
      const email = row.email;
      try {
        const token = buildUnsubscribeToken(email);
        const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
        const html = buildWeeklyNewsletterEmailHtml(posts, unsubscribeUrl);
        await sendBrevoEmail(email, subject, html);
        await db.query(
          `UPDATE newsletter_subscribers SET last_sent_at = now(), updated_at = now() WHERE email = $1`,
          [email]
        );
        sent += 1;
      } catch {
        failed += 1;
      }
    }

    return NextResponse.json(
      {
        ok: true,
        attempted: recipients.rowCount,
        sent,
        failed,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ ok: false, error: "Send failed" }, { status: 500 });
  }
}
