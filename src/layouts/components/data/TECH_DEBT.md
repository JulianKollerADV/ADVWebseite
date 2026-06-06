# Produktkatalog – Technische Schulden & Readiness (Stand: technischer Produktivitäts-Check)

Scope: nur Produktkatalog. Keine Strapi-Live-Anbindung.

---

## 1. Struktur – Bewertung

| Bereich | Datei(en) | Bewertung |
|---------|-----------|-----------|
| UI-Orchestrierung | `ProductCatalogApp.tsx` | Sauber, ~310 Zeilen – akzeptabel |
| Produktdetail | `BundleView.tsx` | Fokussiert, klar getrennt |
| Bausteine | `DeliverableCard.tsx`, `DeliverableListView.tsx` | Kompakt, layout-fähig |
| Konfiguration | `ConfigView.tsx` | Groß (362 Z.), aber kohärent |
| Warenkorb/Anfrage | `CartSheet.tsx`, `lib/inquiry.ts` | Getrennt von UI-Navigation |
| Produktdaten | `useCases.ts` | **2046 Z.** – Wartungsrisiko |
| Empfehlungen | `recommendations.ts` | **1018 Z.** – Rule-Engine + Overrides |
| Baustein-Daten | `deliverables.ts` | **815 Z.** – Wartungsrisiko |
| State | `configStore.ts` | Enthält Legacy-Wizard-API (ungenutzt) |
| Preislogik | `lib/pricing.ts` | Korrekt im Code, nicht in CMS |

**Trennung Produkte / Bausteine / Empfehlungen / Anfrage / Konfiguration:** sauber umgesetzt.
Daten in `data/`, Logik in `lib/` + `stores/`, UI in `catalog/`.

---

## 2. Entfernte Altlasten (dieser Check)

Physisch gelöscht (kein Import im gesamten Repo):

**Katalog-Komponenten (alter Demo-/Configurator-Flow):**
`DemoApp`, `DemoShopApp`, `AdvConfiguratorApp`, `TopBar`, `FinderPanel`, `HeroEmptyState`,
`Breadcrumb`, `Stepper`, `SectionHeader`, `InfoBanner`, `ThemeToggle`, `PersistenceToggle`,
`DomainGrid`, `DomainList`, `UseCaseList`, `UseCaseGrid`, `UseCaseCard`, `UseCaseCardCompact`,
`UseCaseItem`, `UseCasePage`, `RecommendedBundle`, `RecommendedBundleStep`, `ProductConfigurator`,
`DeliverableConfigurator`, `CartSidebar`, `SummaryPage`, `ConfigurePage`, `DeliverablePricePreview`,
`MiniPriceTag`, `PriceBreakdown` (Komponente), `INTEGRATION.md`, `ui/tooltip.tsx`, `ui/tabs.tsx`.

**Daten-/Hilfsdateien:**
`seed.ts`, `types.ts`, `mappings.ts`, `catalogLabels.ts`, `domains.ts`, `MIGRATION.md`.

---

## 3. Dokumentierte Altlasten (bewusst behalten)

| Item | Grund |
|------|-------|
| `demo.astro` | Legacy-Route, identisch mit `produktkatalog.astro` – Redirect-Risiko bei Entfernung |
| `demo-v2.astro` | 301-Redirect auf `/produktkatalog/` – bewusst für Bookmarks |
| `PRODUCT_CATALOG_URL` in `config/products.ts` | Definiert, noch nicht überall importiert – für künftige CTAs/Links reserviert |
| `catalogSource.ts` + `productModel.ts` | Strapi-Vorbereitung, nicht in UI verdrahtet – Adapter bereit |
| `models.ts` Legacy-Interfaces (`Deliverable`, `UseCase`, `Configuration`) | Noch in Typen-Imports; schrittweise entfernen |
| `configStore`: `wizardStep`, `selectUseCase`, `setPersistEnabled`, `resetAll` | Legacy-API, nicht vom aktiven Flow genutzt |
| `useCases.ts` `@deprecated`-Felder | Physisch in ~100 Datensätzen – Entfernung beim Product-Migrationsschritt |
| `defaultBestForByDomain` | Duplikat in `useCases.ts` und `BundleView.tsx` – Inkonsistenz-Risiko |
| `getDeliverableById` | Import aus `deliverables.ts` vs. `pricing.ts` – funktional gleich, uneinheitlich |
| Große Monolit-Dateien (`useCases`, `recommendations`, `deliverables`) | Kein Massen-Split in diesem Check (Re-Architektur) |

**Interne Benennung (risikoarm belassen):**
- `BundleView` – intern, UI sagt „Produktbausteine“
- `UseCase`-Typ in `useCases.ts` – Datenmodell, UI sagt „Produkt“
- `Deliverable`-Typ in `deliverables.ts` – Datenmodell, UI sagt „Produktbaustein“
- `setBundleFromUseCase`, `getBundleForUseCase` – interne Store/Recommendation-API

`DemoShopApp` wurde bereits zu `ProductCatalogApp` umbenannt (Phase 5).

---

## 4. Strapi-/Backend-Readiness

| Aspekt | Status |
|--------|--------|
| Produkte → Strapi `Product` | Vorbereitet via `productModel.ts` + `useCaseToProduct` |
| Bausteine → Strapi `Deliverable` | Datenstruktur passt; `basePrice`/Parameter bleiben im Code |
| Empfehlungen → Strapi `Recommendation` | Hard-Overrides modellierbar; Rule-Engine bleibt Code |
| `requestMode` | Sauber als CMS-Feld (`standard`/`custom`/`hybrid`) – Override-Map in `requestModes.ts` |
| `catalogSource.ts` | Adapter mit lokalem Default + dokumentiertem Strapi-Fallback |
| Preislogik / Store / Warenkorb | Bewusst im Code (`pricing.ts`, `configStore.ts`) |
| Tokens im Client | **Nein** – `STRAPI_API_TOKEN` nur serverseitig dokumentiert |
| Live-Strapi | **Nicht aktiv** – `getCatalogData()` liefert lokal |

**Bewertung Strapi-Fähigkeit: 8/10** (Dokumentation + Adapter da, Verdrahtung fehlt bewusst)

---

## 5. Performance / Wartbarkeit

| Thema | Befund |
|-------|--------|
| `fromPriceById` in `ProductCatalogApp` | `useMemo` über `filteredUseCases` – bei „Alle Produkte“ ~100× `getBundleForUseCase` – akzeptabel für SSG/Client, bei Wachstum cachen |
| Preisberechnung in `ConfigView` | Pro Render pro Baustein – nur bei aktiver Konfiguration, unkritisch |
| `CartSheet` Memos | `useMemo` für Cart/Total – korrekt |
| Zustand Kacheln/Liste/Sidebar | Stabil nach Navigation-Fix (`showDeliverables` bleibt erhalten) |
| localStorage | `configStore` persistiert mit `persistEnabled: true` (default), Key `adv-configurator` – funktional, kein UI-Toggle mehr |
| Re-Renders | Zustand-Selectors granular genug; keine offensichtlichen Hotspots |
| Große Daten-TS-Dateien | Build-Zeit + Wartbarkeit – mittelfristig externalisieren (JSON/CMS) |

---

## 6. Datenqualität

Siehe Ausgabe von `node scripts/catalogDataCheck.mjs` (wird bei Build/CI ergänzbar).

Bekannte inhaltliche Punkte (kein technischer Blocker):
- Mehrere Produkte sind fachlich Varianten/Bausteine (siehe `MIGRATION_NOTES.md` §8)
- `requestMode`-Zuordnung in MIGRATION_NOTES §8.5 teilweise veraltet – aktueller Stand in `requestModes.ts`

---

## 7. Empfohlene nächste Schritte (nicht in diesem Check)

1. `catalogSource.ts` in Astro-Page-Load verdrahten (serverseitig), UI bleibt unverändert
2. `useCases.ts` / `deliverables.ts` / `recommendations.ts` in JSON oder Strapi auslagern
3. `configStore` Legacy-API entfernen (`wizardStep`, Multi-UseCase)
4. `defaultBestForByDomain` zentralisieren
5. `demo.astro` → Redirect wie `demo-v2.astro` (nach Abstimmung)
