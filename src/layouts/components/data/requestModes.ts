/**
 * Anfrage-Modus je Produkt (Produktkatalog)
 * =========================================
 *
 * Steuert, ob ein Produkt über konfigurierbare Produktbausteine ("standard"),
 * eine individuelle Anfrage ("custom") oder beides ("hybrid") angefragt wird.
 *
 * Bewusst als kleine Override-Map gehalten (nicht in den ~100 useCases-Einträgen),
 * damit kein Massen-Edit nötig ist und die Zuordnung später 1:1 als Strapi-Feld
 * `requestMode` übernommen werden kann. Default = "standard".
 */

export type RequestMode = "standard" | "custom" | "hybrid";

const requestModeById: Record<string, RequestMode> = {
  // custom – keine fachlich sinnvollen Standard-Bausteine vorhanden -> reine Anfrage
  "agentic-coding": "custom",

  // hybrid – passende Produktbausteine vorhanden + individueller Beratungsanteil.
  // Produktbausteine bleiben sichtbar, individuelle Anfrage nur ergänzend (einklappbar).
  "data-ai-leadership": "hybrid",
  "datenstrategie": "hybrid",
  "ki-strategie": "hybrid",
  "maturity-assessment": "hybrid",
  "nis2": "hybrid",
  "kyc-automatisierung": "hybrid",
  "data-mesh-organisation": "hybrid",
  "iam": "hybrid",
  "dsgvo-dsb": "hybrid",
  "ai-architektur-infrastruktur": "hybrid",
  "ai-video-qualitaetsanalyse": "hybrid",
  // Research & Advisory – Bausteine vorhanden, individuelle Anfrage ergänzend sinnvoll
  "rag-literaturrecherche": "hybrid",
  "innovationsresearch": "hybrid",
};

export function getRequestMode(useCaseId: string): RequestMode {
  return requestModeById[useCaseId] ?? "standard";
}
