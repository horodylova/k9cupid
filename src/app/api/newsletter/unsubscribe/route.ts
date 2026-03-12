import { NextResponse } from "next/server";
import { Pool } from "pg";
import crypto from "crypto";

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

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function htmlPage(title: string, body: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;color:#222;background:#f9f3ec;}
      .wrap{max-width:720px;margin:0 auto;padding:48px 20px;}
      .card{background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:16px;padding:28px;box-shadow:0 10px 30px rgba(0,0,0,.06);}
      h1{font-size:24px;margin:0 0 10px;}
      p{margin:0;color:#666;line-height:1.5}
      a{color:#222;text-decoration:underline}
      .actions{margin-top:16px}
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        ${body}
      </div>
      <div class="actions">
        <a href="https://k9cupid.fit/">Back to k9cupid</a>
      </div>
    </div>
  </body>
</html>`;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = (url.searchParams.get("token") || "").trim();

    if (!token) {
      return new NextResponse(
        htmlPage(
          "Unsubscribe",
          "<h1>Missing link</h1><p>This unsubscribe link is missing a token.</p>"
        ),
        { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    const tokenHash = hashToken(token);
    const db = getPool();

    const result = await db.query(
      `
        UPDATE newsletter_subscribers
        SET status = 'unsubscribed',
            unsubscribed_at = COALESCE(unsubscribed_at, now()),
            updated_at = now()
        WHERE unsubscribe_token_hash = $1
        RETURNING email
      `,
      [tokenHash]
    );

    if (result.rowCount === 0) {
      return new NextResponse(
        htmlPage(
          "Unsubscribe",
          "<h1>Link not found</h1><p>This unsubscribe link is invalid or expired.</p>"
        ),
        { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    return new NextResponse(
      htmlPage(
        "Unsubscribed",
        "<h1>You have been unsubscribed</h1><p>You will no longer receive newsletter emails from k9cupid.</p>"
      ),
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch {
    return new NextResponse(
      htmlPage(
        "Unsubscribe",
        "<h1>Something went wrong</h1><p>Please try again later.</p>"
      ),
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}
