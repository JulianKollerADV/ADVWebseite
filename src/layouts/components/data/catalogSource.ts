/**
 * Katalog-Datenquelle (Adapter)
 * =============================
 *
 * Single Entry Point für Produktkatalog-Inhalte. Heute liefert die Funktion
 * ausschließlich lokale Daten. Die Struktur ist so vorbereitet, dass später
 * eine Strapi-Quelle ergänzt werden kann – ohne die konsumierenden
 * Komponenten hart umzustellen.
 *
 * Leitplanken (siehe MIGRATION_NOTES.md):
 *   - Lokale Daten sind IMMER der Default und der Fallback.
 *   - Strapi wird nur aktiv, wenn CATALOG_STRAPI_ENABLED === "true".
 *   - Kein API-Token im Client. Ein echter Fetch erfolgt später ausschließlich
 *     serverseitig (Astro-Frontmatter / Endpoint), nie im Browser-Bundle.
 *   - Schlägt eine spätere Strapi-Quelle fehl, wird transparent lokal gefallen.
 *
 * Benötigte ENV-Variablen (erst für die spätere Live-Anbindung relevant):
 *   - STRAPI_URL                Basis-URL der Strapi-Instanz (z. B. https://cms.example.com)
 *   - STRAPI_API_TOKEN          Read-Token, NUR serverseitig verwenden
 *   - CATALOG_STRAPI_ENABLED    "true" aktiviert die Strapi-Quelle (Default: lokal)
 *   - CATALOG_STRAPI_TIMEOUT_MS Timeout für den Fetch in ms (Default: 4000)
 *   - CATALOG_STRAPI_PREVIEW    "true" zieht auch Draft-Inhalte (Preview-Modus)
 */

import { useCases } from "./useCases";
import { deliverables } from "./deliverables";
import {
  getLocalProducts,
  getLocalTaxonomy,
  type Product,
  type TaxonomyCluster,
} from "./productModel";

export type CatalogSourceKind = "local" | "strapi";

export interface CatalogData {
  /** Aktuelles Produktmodell (UseCase) – von der UI konsumiert. */
  useCases: typeof useCases;
  /** Produktbausteine (bleiben lokal/Code, Preislogik separat). */
  deliverables: typeof deliverables;
  /** Strapi-fähiges Zielmodell (abgeleitet, noch nicht aktiv konsumiert). */
  products: Product[];
  /** Cluster-/Domänen-Taxonomie. */
  taxonomy: TaxonomyCluster[];
  /** Woher die Daten stammen – für Diagnostik/Logging. */
  source: CatalogSourceKind;
}

interface StrapiConfig {
  enabled: boolean;
  url?: string;
  token?: string;
  timeoutMs: number;
  preview: boolean;
}

/**
 * Liest die Strapi-Konfiguration aus den ENV-Variablen.
 * Tokens werden hier NICHT exponiert – diese Funktion ist nur für den
 * serverseitigen Gebrauch gedacht.
 */
export function getStrapiConfig(): StrapiConfig {
  const env = (typeof process !== "undefined" ? process.env : {}) as Record<
    string,
    string | undefined
  >;

  return {
    enabled: env.CATALOG_STRAPI_ENABLED === "true",
    url: env.STRAPI_URL,
    token: env.STRAPI_API_TOKEN,
    timeoutMs: Number(env.CATALOG_STRAPI_TIMEOUT_MS ?? 4000),
    preview: env.CATALOG_STRAPI_PREVIEW === "true",
  };
}

/** Baut das CatalogData-Objekt aus den lokalen Quellen. */
function getLocalCatalogData(): CatalogData {
  return {
    useCases,
    deliverables,
    products: getLocalProducts(),
    taxonomy: getLocalTaxonomy(),
    source: "local",
  };
}

/**
 * Liefert die Katalogdaten.
 *
 * Aktueller Stand: ausschließlich lokal. Async-Signatur ist bewusst gewählt,
 * damit ein späterer serverseitiger Strapi-Fetch ohne Signaturänderung an die
 * Aufrufer angedockt werden kann.
 *
 * TODO(strapi): Wenn `getStrapiConfig().enabled`, serverseitig fetchen,
 * Antwort auf `Product`/`Deliverable`/`TaxonomyCluster` mappen und bei
 * Fehler/Timeout auf `getLocalCatalogData()` zurückfallen.
 */
export async function getCatalogData(): Promise<CatalogData> {
  // Default + Fallback: lokal. Strapi-Pfad ist bewusst noch nicht verdrahtet,
  // damit kein Live-Call ohne Fallback existiert.
  return getLocalCatalogData();
}

/** Synchroner Zugriff auf die lokalen Daten (für rein lokale Konsumenten). */
export function getLocalCatalog(): CatalogData {
  return getLocalCatalogData();
}
