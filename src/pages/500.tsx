import Link from "next/link";

export default function Custom500() {
  return (
    <main style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
      <section style={{ textAlign: "center", padding: 24 }}>
        <h1 style={{ fontSize: 56, margin: 0 }}>500</h1>
        <p style={{ marginTop: 12, marginBottom: 24 }}>
          Sorry! Something went wrong.
        </p>
        <Link href="/" style={{ textDecoration: "underline" }}>
          Go Back Home
        </Link>
      </section>
    </main>
  );
}

