# Produktkatalog – Migrationsnotizen (Phase 2)

Scope: ausschließlich Produktkatalog (`/produktkatalog`, `/demo`).
Nicht betroffen: globale Website-Struktur, Routing außerhalb des Katalogs.

Leitprinzip: **Lokale Daten bleiben Source of Truth.** Strapi wird vorbereitet,
aber nicht ohne Fallback live angebunden. Preislogik, Store, Cart/Inquiry und die
Rule-Engine bleiben im Code.

---

## 1. Feld-Klassifikation `UseCase` (useCases.ts)

| Feld | Kategorie | Aktiv genutzt von | Strapi | Entscheidung |
|------|-----------|-------------------|--------|--------------|
| `id` | ZWINGEND | überall (Lookup, Store, Empfehlung) | ja (uid/key) | behalten |
| `title` | ZWINGEND | Tiles, BundleView, Suche | ja | behalten |
| `short` | ZWINGEND | Tiles, BundleView, Suche | ja | behalten |
| `domain` | ZWINGEND | `getUiClusterForUseCase`, recommendations-Fallback | ja (Relation) | behalten |
| `solution_cluster` | ZWINGEND (faktisch) | `getUiClusterForUseCase` | ja (Relation) | behalten |
| `tags.intent` | ZWINGEND | Suche + Rule-Engine | ja | behalten |
| `tags.data_scope` | UX/LOGIK | Rule-Engine (Architektur-Bausteine) | ja | behalten |
| `outputs` | ZWINGEND | BundleView | ja | behalten |
| `details.problem` | UX-relevant | BundleView | ja (Component) | behalten |
| `details.typicalResult` | UX-relevant | BundleView | ja (Component) | behalten |
| `details.bestFor` | UX-relevant | BundleView | ja (Component) | behalten |
| `priority` | UX-relevant | ProductCatalogApp (Featured) | ja (boolean `featured`) | behalten |
| `slug` | Strapi/SEO | derzeit nicht gerendert | ja (uid) | behalten (für SEO/URLs) |
| `portfolio_area` | LEGACY | nur alter Flow (entfernt) | nein | `@deprecated`, kann später entfallen |
| `tags.complexity` | nur Badge/Legacy | nur alter Flow (entfernt) | optional Facette | `@deprecated`, kann später entfallen |
| `tags.tech_hint` | nur Badge/Legacy | nur alter Flow (entfernt) | optional Facette | `@deprecated`, kann später entfallen |
| `tags.maturity_hint` | Legacy | im aktiven Flow ungenutzt | nein | `@deprecated`, kann später entfallen |
| `details.typicalDeliverables` | redundant | Bausteine kommen aus recommendations.ts | nein | `@deprecated`, kann später entfallen |

**Warum nicht jetzt physisch entfernt?**
Die ~100 Datensätze in `useCases.ts` enthalten die Legacy-Felder. Ein Massen-Edit
über alle Einträge ist risikoreich (Tippfehler, Build-Bruch) bei geringem Nutzen.
Daher: im Interface als `@deprecated` markiert, beim Adapter `useCaseToProduct`
nicht übernommen. Physische Bereinigung erfolgt beim Schritt `UseCase -> Product`.

---

## 2. Product-Zielmodell (productModel.ts)

Kompatibel ergänzt, **noch nicht** in der UI verdrahtet. Adapter `useCaseToProduct`
leitet `Product` aus `UseCase` ab.

- **Product**: `id`, `slug`, `title`, `short`, `details`, `primaryCluster`, `tags`, `seo`, `status`, `featured`
- **TaxonomyCluster**: `id`, `label`, `sortOrder`
- **ProductRecommendation**: `productId`, `deliverableId`, `reason`, `defaultEnabled`, `sortOrder`
- **Deliverable**: bleibt in `deliverables.ts` (`basePrice`, `parameters`, scope-Felder)
- **Pricing**: bleibt vollständig im Code (`pricing.ts`)

---

## 3. Strapi Content Types (Zielbild)

> Nur Content gehört nach Strapi. Logik (Preis, Store, Rule-Engine, Fallback) bleibt im Code.

### Product (= Use Case)
| Feld | Typ | Pflicht | Ort |
|------|-----|---------|-----|
| `key` / uid | UID | ja | Strapi |
| `slug` | UID | ja | Strapi |
| `title` | String | ja | Strapi |
| `short` | Text | ja | Strapi |
| `details` | Component (problem, typicalResult, bestFor[]) | nein | Strapi |
| `primaryCluster` | Relation → Cluster | ja | Strapi |
| `tags` | Component/Relation (intent[], dataScope) | ja | Strapi |
| `seo` | Component (metaTitle, metaDescription) | nein | Strapi |
| `featured` | Boolean | nein | Strapi |
| `status` | Draft/Publish | ja | Strapi (nativ) |
| `recommendations` | Relation → Recommendation | nein | Strapi (kuratiert) |

### Deliverable (= Produktbaustein)
| Feld | Typ | Pflicht | Ort |
|------|-----|---------|-----|
| `key` | UID | ja | Strapi |
| `name`, `family`, `shortDescription`, `longDescription` | String/Text | ja | Strapi |
| `deliverablesOutput[]`, `assumptions[]`, `outOfScope[]` | Text-Listen | nein | Strapi |
| `basePrice` | Number | ja | **Code** (Strapi nur informativ optional) |
| `parameterKeys` | JSON/Relation | ja | **Code** (Preislogik) |
| `active` | Boolean | ja | Strapi |

### Cluster (= Domäne)
| Feld | Typ | Pflicht | Ort |
|------|-----|---------|-----|
| `key` | UID (`UiClusterId`) | ja | Strapi |
| `label` | String | ja | Strapi |
| `sortOrder` | Number | ja | Strapi |

### Recommendation (= Bundle-Eintrag)
| Feld | Typ | Pflicht | Ort |
|------|-----|---------|-----|
| `product` | Relation → Product | ja | Strapi |
| `deliverable` | Relation → Deliverable | ja | Strapi |
| `reason` | String | ja | Strapi |
| `defaultEnabled` | Boolean | ja | Strapi |
| `sortOrder` | Number | nein | Strapi |

> Nur die kuratierten Bundles (heutige Hard-Overrides) wandern nach Strapi.
> Die generische Rule-Engine (`generateRecommendationsFromRules`) bleibt im Code als Fallback.

### Product Catalog Settings (Single Type)
| Feld | Typ | Ort |
|------|-----|-----|
| `inquiryEmail` | String | Strapi (oder Code-Default) |
| `meetingUrl` | String | Strapi (oder Code-Default) |
| `catalogUrl` | String | **Code** (`config/products.ts`) |

---

## 4. ENV-Variablen (für spätere Live-Anbindung)

| Variable | Zweck | Default |
|----------|-------|---------|
| `STRAPI_URL` | Basis-URL der Strapi-Instanz | – |
| `STRAPI_API_TOKEN` | Read-Token, **nur serverseitig** | – |
| `CATALOG_STRAPI_ENABLED` | `"true"` aktiviert Strapi-Quelle | lokal |
| `CATALOG_STRAPI_TIMEOUT_MS` | Fetch-Timeout | `4000` |
| `CATALOG_STRAPI_PREVIEW` | `"true"` zieht Draft-Inhalte | `false` |

Implementierung: `catalogSource.ts` (`getStrapiConfig`, `getCatalogData`).
Der Strapi-Pfad ist bewusst noch nicht verdrahtet → kein Live-Call ohne Fallback.

---

## 5. Entfernte Altlasten (Phase 2 + technischer Produktivitäts-Check)

Selbst-enthaltener, toter Alt-Flow (von keiner Seite/aktiven Komponente importiert,
verifiziert per Referenzsuche). Aktiver Flow läuft ausschließlich über `ProductCatalogApp`
(vormals `DemoShopApp` – risikoarm umbenannt).

**Physisch entfernt (Komponenten):**
`DemoApp`, `DemoShopApp`, `AdvConfiguratorApp`, `TopBar`, `FinderPanel`, `HeroEmptyState`,
`Breadcrumb`, `Stepper`, `SectionHeader`, `InfoBanner`, `ThemeToggle`,
`PersistenceToggle`, `DomainGrid`, `DomainList`, `UseCaseList`, `UseCaseGrid`,
`UseCaseCard`, `UseCaseCardCompact`, `UseCaseItem`, `UseCasePage`,
`RecommendedBundle`, `RecommendedBundleStep`, `ProductConfigurator`,
`DeliverableConfigurator`, `CartSidebar`, `SummaryPage`, `ConfigurePage`,
`DeliverablePricePreview`, `MiniPriceTag`, `PriceBreakdown` (Komponente),
`INTEGRATION.md`, `ui/tooltip.tsx`, `ui/tabs.tsx`.

**Physisch entfernt (Daten/Hilfen):**
`seed.ts`, `types.ts`, `mappings.ts`, `catalogLabels.ts`, `domains.ts`,
`pricing.example.ts`, `MIGRATION.md` (ersetzt durch diese Datei + `TECH_DEBT.md`).

**Behalten (aktiv, im Code):**
`useCases.ts`, `deliverables.ts`, `recommendations.ts`, `parameters.ts`,
`models.ts` (Typen für Pricing/Store), `pricing.ts`, `configStore.ts`,
`lib/inquiry.ts`, `productModel.ts` (neu), `catalogSource.ts` (überarbeitet).

---

## 6. Bewusst NICHT nach Strapi verschoben

- `pricing.ts` – Preislogik bleibt Code.
- `configStore.ts` – Warenkorb/State bleibt Code.
- `lib/inquiry.ts` – Anfrage-/Mailto-Logik bleibt Code.
- `recommendations.ts` Rule-Engine – bleibt Code (nur Hard-Override-Bundles später datengetrieben).
- Technische Fallback-Regeln – bleiben Code.

---

## 7. Risiken / offene Punkte

- Legacy-Felder sind nur als `@deprecated` markiert, physisch noch in den Daten.
  Echte Entfernung beim Umstieg auf `Product`.
- `productModel.ts` ist noch nicht verdrahtet – Adapter ist getestet nur via Build/Typecheck.
- Strapi-Mapping (`Product`/`Deliverable`/`Recommendation`) ist dokumentiert,
  aber noch nicht implementiert; bei Anbindung sind Pflichtfeld-Validierung und
  Timeout-Fallback zwingend.
- `slug` ist derzeit nicht für Routing aktiv; falls künftig Detail-URLs gewünscht
  sind, muss Eindeutigkeit der Slugs sichergestellt werden.

---

## 8. UX-Iteration: Produkt/Baustein/Varianten-Klassifikation (nur markiert, NICHT gelöscht)

Befund: Mehrere „Produkte" (Use Cases) sind fachlich eher **Produktbausteine**
(decken sich 1:1 mit einem Deliverable) oder **Varianten** eines Leitprodukts.
Bewusst noch **nichts entfernt/zusammengeführt** – nur zur späteren Bereinigung dokumentiert.

### 8.1 Produkte, die eigentlich Produktbausteine sind (Kandidaten)
| Produkt (Use Case) | Deckt sich mit Baustein |
|---|---|
| `iam` | `iam_concept` (+ `roles_rights_impl`) |
| `dwh` | `dwh_starter` |
| `data-lake` | `dwh_starter` / `target_architecture` |
| `enterprise-architecture-management` | `target_architecture` |
| `master-data-management` | `governance_starter` |
| `data-catalog` | `governance_starter` / `glossary_sprint` |
| `datenstrategie`, `ki-strategie`, `maturity-assessment` | `strategy_sprint` / `roadmap` |

→ Empfehlung mittelfristig: entweder als Baustein führen oder unter wenige
Architektur-/Governance-/Strategie-Produkte bündeln.

### 8.2 Varianten desselben Leitprodukts (Merge-Kandidaten)
| Leitprodukt (Ziel) | Varianten (heute eigene Use Cases) |
|---|---|
| IT-Support-Automatisierung | `helpdesk-automation`, `ai-helpdeskassistent`, `self-service-helpdesk`, `intelligentes-ticket-routing` |
| KI-Qualitätskontrolle | `ai-video-qualitaetsanalyse`, `objekterkennung`, `quality-assurance-ai`, Ausschuss-/Qualitätscontrolling |
| Daten-/KI-Strategie (Advisory) | `datenstrategie`, `ki-strategie`, `maturity-assessment`, `data-ai-leadership` |

### 8.3 Domänen-/IA-Anmerkungen
- `General Management` (Cluster) ist faktisch leer (0 Produkte) → Routing landet in
  „Orientierung & Priorisierung"/„Insights". Cluster ausblenden oder Routing anpassen.
- `Insights & Analytics` (Cluster) hat nur ~2 Produkte, obwohl Analytics in jeder
  Funktionsdomäne vorkommt → als Querschnittsthema/Tag statt eigener Domäne erwägen.
- Domänenliste mischt zwei Achsen (Funktion vs. Capability) → mittelfristig auf eine
  Achse vereinheitlichen.

### 8.5 Anfrage-Modus (`requestMode`, `data/requestModes.ts`)
Steuert Produktdetail-Ansicht: `standard` (Bausteine), `custom` (individuelle Anfrage),
`hybrid` (Bausteine + individuelle Ergänzung). Default = `standard`.
**Aktueller Stand siehe `requestModes.ts`** (Source of Truth).

- **custom:** `agentic-coding` (keine passenden Standard-Bausteine)
- **hybrid:** `data-ai-leadership`, `datenstrategie`, `ki-strategie`, `maturity-assessment`,
  `nis2`, `kyc-automatisierung`, `data-mesh-organisation`, `iam`, `dsgvo-dsb`,
  `ai-architektur-infrastruktur`, `ai-video-qualitaetsanalyse`,
  `rag-literaturrecherche`, `innovationsresearch`
- **standard (Default):** alle übrigen

### 8.4 Bundle-Defaults (in dieser Iteration korrigiert)
Bei diesen Produkten war der namensgebende Kern-Baustein fälschlich `defaultEnabled: false`;
korrigiert auf `true`: `iam` (→ `iam_concept`), `data-ai-leadership` (→ `strategy_sprint`,
`roadmap`), `dsgvo-dsb` (→ `governance_starter`), `isms-isb-bestellung` (→ `governance_starter`),
`enterprise-architecture-management` (→ `target_architecture`). „(Coming Soon)"-Reste dort entfernt.
Restliche Bundles ungeprüft → siehe offene Bereinigungen.
