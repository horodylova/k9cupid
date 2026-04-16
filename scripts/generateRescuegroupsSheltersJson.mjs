import fs from "node:fs";
import path from "node:path";

function readApiKeyFromEnvLocal() {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (!fs.existsSync(envPath)) return "";
    const raw = fs.readFileSync(envPath, "utf8");
    const match = raw.match(/^RESCUEGROUPS_API_KEY=(.*)$/m);
    return match ? match[1].trim() : "";
  } catch {
    return "";
  }
}

const apiKey = ((process.env.RESCUEGROUPS_API_KEY || "").trim() || readApiKeyFromEnvLocal()).trim();
if (!apiKey) {
  console.error("Missing RESCUEGROUPS_API_KEY");
  process.exit(1);
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
      Authorization: apiKey,
    },
  });
  const json = await res.json();
  return { status: res.status, json };
}

async function main() {
  const limit = 250;
  let page = 1;
  let pages = 1;
  const orgs = new Map();

  while (page <= pages) {
    const u = new URL("https://api.rescuegroups.org/v5/public/animals/search/available/dogs/");
    u.searchParams.set("limit", String(limit));
    u.searchParams.set("page", String(page));
    u.searchParams.set("include", "orgs");
    u.searchParams.set("fields[animals]", "name");
    u.searchParams.set("fields[orgs]", "name,city,state,citystate");

    const { status, json } = await fetchJson(u.toString());
    if (status !== 200) {
      console.error("Upstream error (dogs)", status, JSON.stringify(json).slice(0, 400));
      process.exit(1);
    }

    const meta = json.meta || {};
    pages = Math.max(1, meta.pages || 1);

    const included = Array.isArray(json.included) ? json.included : [];
    for (const inc of included) {
      if (!inc || inc.type !== "orgs" || !inc.id) continue;
      const attrs = inc.attributes || {};
      const name = String(attrs.name || "").trim();
      if (!name) continue;
      const city = String(attrs.city || "").trim();
      const state = String(attrs.state || "").trim().toUpperCase();
      if (!orgs.has(inc.id)) orgs.set(inc.id, { id: String(inc.id), name, city, state });
    }

    if (page === 1 || page === pages || page % 10 === 0) {
      console.log(`dogs page ${page}/${pages} orgs=${orgs.size}`);
    }

    page += 1;
    if (page > 500) break;
  }

  const list = Array.from(orgs.values())
    .map((o) => ({ ...o, hasDogs: true }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const outDir = path.join(process.cwd(), "src", "data");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "rescuegroupsShelters.json");
  fs.writeFileSync(outPath, JSON.stringify(list, null, 2) + "\n", "utf8");
  console.log("Wrote", outPath, "count", list.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
