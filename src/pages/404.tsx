import Link from "next/link";

export default function Custom404() {
  return (
    <main style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
      <section style={{ textAlign: "center", padding: 24 }}>
        <h1 style={{ fontSize: 56, margin: 0 }}>404</h1>
        <p style={{ marginTop: 12, marginBottom: 24 }}>
          Sorry! Page that you are looking for is not available.
        </p>
        <Link href="/" style={{ textDecoration: "underline" }}>
          Go Back Home
        </Link>
      </section>
    </main>
  );
}

