import { NextResponse } from "next/server";
import { Pool } from "pg";
import crypto from "crypto";
import {
  buildWelcomeEmailHtml,
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

function isValidEmail(email: string) {
  if (email.length < 3 || email.length > 254) return false;
  const normalized = email.trim();
  const basic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return basic.test(normalized);
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const email =
      typeof (body as { email?: unknown }).email === "string"
        ? (body as { email: string }).email.trim()
        : "";
    const source =
      typeof (body as { source?: unknown }).source === "string"
        ? (body as { source: string }).source.trim()
        : null;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const tokenHash = hashToken(buildUnsubscribeToken(email));

    const db = getPool();

    await db.query(
      `
        INSERT INTO newsletter_subscribers (email, status, unsubscribe_token_hash, source, unsubscribed_at, updated_at)
        VALUES ($1, 'active', $2, $3, NULL, now())
        ON CONFLICT (email)
        DO UPDATE SET
          status = 'active',
          unsubscribe_token_hash = EXCLUDED.unsubscribe_token_hash,
          source = COALESCE(EXCLUDED.source, newsletter_subscribers.source),
          unsubscribed_at = NULL,
          updated_at = now()
      `,
      [email, tokenHash, source]
    );

    try {
      const token = buildUnsubscribeToken(email);
      const unsubscribeUrl = `${getSiteUrl()}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
      const posts = await getLatestPosts(3);
      if (posts.length > 0) {
        const subject = "Welcome to k9cupid";
        const html = buildWelcomeEmailHtml(posts, unsubscribeUrl);
        await sendBrevoEmail(email, subject, html);
        await db.query(
          `UPDATE newsletter_subscribers SET last_sent_at = now(), updated_at = now() WHERE email = $1`,
          [email]
        );
      }
    } catch {
      null;
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Subscription failed." },
      { status: 500 }
    );
  }
}
