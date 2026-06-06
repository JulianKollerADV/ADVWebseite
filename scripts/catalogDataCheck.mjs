/**
 * Einmaliger Datenqualitäts-Check für den Produktkatalog.
 * Liest die TS-Quelldateien per Regex (kein TS-Runtime nötig).
 *
 * Ausführung: node scripts/catalogDataCheck.mjs
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "../src/layouts/components/data");

function read(name) {
  return readFileSync(join(dataDir, name), "utf8");
}

// --- Use Cases parsen ---
const useCasesSrc = read("useCases.ts");
const useCaseBlocks = [...useCasesSrc.matchAll(/\{\s*id:\s*"([^"]+)"([\s\S]*?)\n  \}/g)];

const useCases = useCaseBlocks.map((m) => {
  const block = m[0];
  const id = m[1];
  const title = block.match(/title:\s*"([^"]*)"/)?.[1] ?? "";
  const short = block.match(/short:\s*"([^"]*)"/)?.[1] ?? "";
  const slug = block.match(/slug:\s*"([^"]*)"/)?.[1] ?? "";
  const domain = block.match(/domain:\s*"([^"]*)"/)?.[1] ?? "";
  return { id, title, short, slug, domain };
});

// --- Deliverables parsen ---
const deliverablesSrc = read("deliverables.ts");
const deliverableIds = [...deliverablesSrc.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
const deliverableSet = new Set(deliverableIds);

const deliverableBlocks = [...deliverablesSrc.matchAll(/\{\s*id:\s*"([^"]+)"([\s\S]*?)\n  \}/g)];
const deliverables = deliverableBlocks.map((m) => {
  const block = m[0];
  const id = m[1];
  const name = block.match(/name:\s*"([^"]*)"/)?.[1] ?? "";
  const shortDescription = block.match(/shortDescription:\s*"([^"]*)"/)?.[1] ?? "";
  const basePrice = block.match(/basePrice:\s*(\d+)/)?.[1] ?? "0";
  const active = block.includes("active: true");
  return { id, name, shortDescription, basePrice: Number(basePrice), active };
});

// --- Recommendations: deliverableId-Referenzen ---
const recSrc = read("recommendations.ts");
const recDeliverableIds = [...recSrc.matchAll(/deliverableId:\s*"([^"]+)"/g)].map((m) => m[1]);
const brokenRecs = [...new Set(recDeliverableIds)].filter((id) => !deliverableSet.has(id));

// --- requestModes ---
const reqSrc = read("requestModes.ts");
const requestModeIds = [...reqSrc.matchAll(/"([^"]+)":\s*"(standard|custom|hybrid)"/g)].map((m) => m[1]);

// --- getBundleForUseCase: Hard-Override-Keys ---
const hardOverrideIds = [...recSrc.matchAll(/^\s*"([^"]+)":\s*\[/gm)]
  .map((m) => m[1])
  .filter((id) => useCases.some((uc) => uc.id === id) || recSrc.includes(`"${id}":`));

const useCaseIds = new Set(useCases.map((u) => u.id));

const issues = {
  productsMissingTitle: useCases.filter((u) => !u.title.trim()),
  productsMissingShort: useCases.filter((u) => !u.short.trim()),
  // slug ist optional – Fallback ist `id` (siehe productModel.ts / useCaseToProduct)
  productsMissingExplicitSlug: useCases.filter((u) => !u.slug.trim()),
  productsMissingDomain: useCases.filter((u) => !u.domain.trim()),
  deliverablesMissingName: deliverables.filter((d) => !d.name.trim()),
  deliverablesMissingDesc: deliverables.filter((d) => !d.shortDescription.trim()),
  deliverablesMissingPrice: deliverables.filter((d) => d.active && d.basePrice <= 0),
  brokenRecommendations: brokenRecs,
  requestModeUnknownIds: requestModeIds.filter((id) => !useCaseIds.has(id)),
};

// Produkte ohne sinnvollen Pfad (vereinfacht: custom ohne Formular-Pfad = ok in UI;
// standard ohne aktive Empfehlungen = Warnung)
const productsWithoutActiveRecs = [];
for (const uc of useCases) {
  const modeMatch = reqSrc.match(new RegExp(`"${uc.id}":\\s*"(standard|custom|hybrid)"`));
  const mode = modeMatch?.[1] ?? "standard";
  const hasRecs = recSrc.includes(`"${uc.id}":`) || recSrc.includes(`generateRecommendationsFromRules("${uc.id}")`);
  // Prüfe ob Hard-Override existiert
  const hasHardOverride = recSrc.includes(`"${uc.id}": [`);
  if (mode === "standard" && !hasHardOverride) {
    // Rule-Engine-Fallback – nicht als Fehler werten
  }
  if (mode !== "custom") {
    const block = recSrc.match(new RegExp(`"${uc.id}":\\s*\\[([\\s\\S]*?)\\]`, "m"));
    const idsInBlock = block ? [...block[1].matchAll(/deliverableId:\s*"([^"]+)"/g)].map((x) => x[1]) : [];
    const activeInBlock = idsInBlock.filter((id) => {
      const d = deliverables.find((x) => x.id === id);
      return d?.active;
    });
    if (activeInBlock.length === 0 && mode === "standard") {
      productsWithoutActiveRecs.push({ id: uc.id, title: uc.title, mode, note: "Kein Hard-Override mit aktiven Bausteinen (Rule-Engine-Fallback)" });
    }
  }
}

console.log("=== Produktkatalog Datenqualitäts-Check ===\n");
console.log(`Produkte: ${useCases.length}`);
console.log(`Produktbausteine: ${deliverables.length} (${deliverables.filter((d) => d.active).length} aktiv)`);
console.log(`requestMode-Overrides: ${requestModeIds.length}`);
console.log("");

const sections = [
  ["Produkte ohne Titel", issues.productsMissingTitle],
  ["Produkte ohne Kurzbeschreibung", issues.productsMissingShort],
  ["Produkte ohne expliziten Slug (Info: Fallback = id)", issues.productsMissingExplicitSlug],
  ["Produkte ohne Domäne", issues.productsMissingDomain],
  ["Bausteine ohne Name", issues.deliverablesMissingName],
  ["Bausteine ohne Kurzbeschreibung", issues.deliverablesMissingDesc],
  ["Aktive Bausteine ohne basePrice", issues.deliverablesMissingPrice],
  ["Empfehlungen auf nicht existierende Bausteine", issues.brokenRecommendations.map((id) => ({ id }))],
  ["requestMode auf unbekannte Produkt-IDs", issues.requestModeUnknownIds.map((id) => ({ id }))],
];

let errorCount = 0;
for (const [label, items] of sections) {
  const isInfo = label.includes("(Info:");
  if (items.length === 0) {
    console.log(`✓ ${label}: 0`);
  } else if (isInfo) {
    console.log(`ℹ ${label}: ${items.length}`);
    items.slice(0, 5).forEach((item) => console.log(`    - ${item.id ?? item}${item.title ? ` (${item.title})` : ""}`));
    if (items.length > 5) console.log(`    … und ${items.length - 5} weitere`);
  } else {
    errorCount += items.length;
    console.log(`✗ ${label}: ${items.length}`);
    items.slice(0, 10).forEach((item) => console.log(`    - ${item.id ?? item}${item.title ? ` (${item.title})` : ""}`));
    if (items.length > 10) console.log(`    … und ${items.length - 10} weitere`);
  }
}

console.log(`\nStandard-Produkte ohne Hard-Override-Bausteine (Info, Rule-Engine-Fallback): ${productsWithoutActiveRecs.length}`);
console.log(`\nGesamt kritische Befunde: ${errorCount}`);
process.exit(errorCount > 0 ? 1 : 0);
