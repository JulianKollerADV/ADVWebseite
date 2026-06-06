import { useCases, getUseCaseById } from './useCases';
import { deliverables, getDeliverableById } from './deliverables';

export type Recommendation = {
  deliverableId: string;
  defaultEnabled: boolean;
  reason: string; // 1 Satz: warum vorgeschlagen
};

export type UseCaseBundle = {
  useCaseId: string;
  recommendations: Recommendation[];
};

// Hard Overrides für MVP Use Cases
const hardOverrides: Record<string, Recommendation[]> = {
  // Sales Dashboard (Sales & Marketing)
  "sales-dashboard": [
    {
      deliverableId: "bi_setup",
      defaultEnabled: true,
      reason: "BI-System als Basis für Sales-Dashboards"
    },
    {
      deliverableId: "kpi_ws",
      defaultEnabled: true,
      reason: "Definition der wichtigsten Sales-KPIs"
    },
    {
      deliverableId: "mgmt_report_1",
      defaultEnabled: true,
      reason: "Erster Sales-Bericht für Management"
    },
    {
      deliverableId: "glossary_sprint",
      defaultEnabled: true,
      reason: "Gemeinsames Verständnis von Sales-Begriffen"
    },
    {
      deliverableId: "pbi_training_user",
      defaultEnabled: false,
      reason: "Schulung für Sales-Team (optional)"
    }
  ],

  // Management Dashboard (General Management)
  "management-dashboard": [
    {
      deliverableId: "bi_setup",
      defaultEnabled: true,
      reason: "Stabile BI-Basis fuer bereichsuebergreifende Management-Steuerung"
    },
    {
      deliverableId: "kpi_ws",
      defaultEnabled: true,
      reason: "Abgestimmte Management-KPIs als Grundlage fuer Entscheidungsfaehigkeit"
    },
    {
      deliverableId: "mgmt_report_1",
      defaultEnabled: true,
      reason: "Schneller Einstieg mit einem steuerungsrelevanten Management-Report"
    },
    {
      deliverableId: "reporting_standards",
      defaultEnabled: true,
      reason: "Einheitliche Darstellungs- und Interpretationslogik fuer Managementberichte"
    }
  ],

  // Controlling via BI (Finance)
  "controlling-via-bi": [
    {
      deliverableId: "kpi_ws",
      defaultEnabled: true,
      reason: "Definition der Controlling-KPIs"
    },
    {
      deliverableId: "reporting_standards",
      defaultEnabled: true,
      reason: "Einheitliche Reporting-Struktur für Finance"
    },
    {
      deliverableId: "dwh_starter",
      defaultEnabled: true,
      reason: "Zentrale Datenablage für Finanzdaten"
    },
    {
      deliverableId: "mgmt_report_1",
      defaultEnabled: true,
      reason: "Controlling-Bericht für Management"
    }
  ],

  // Setup BI (IT & Data)
  "setup-bi": [
    {
      deliverableId: "bi_setup",
      defaultEnabled: true,
      reason: "Komplettes BI-System Setup"
    },
    {
      deliverableId: "dwh_starter",
      defaultEnabled: true,
      reason: "Zentrale Datenablage als Basis"
    },
    {
      deliverableId: "source_integration_review",
      defaultEnabled: true,
      reason: "Analyse der Datenquellen für Integration"
    },
    {
      deliverableId: "reporting_standards",
      defaultEnabled: true,
      reason: "Standards für zukünftige Berichte"
    }
  ],

  // Sales Forecast (Sales & Marketing)
  "sales-forecast": [
    {
      deliverableId: "bi_setup",
      defaultEnabled: true,
      reason: "Belastbare BI-Basis fuer Forecasting-Dashboards"
    },
    {
      deliverableId: "kpi_ws",
      defaultEnabled: true,
      reason: "Saubere KPI-Definition als Grundlage fuer Prognosen"
    },
    {
      deliverableId: "mgmt_report_1",
      defaultEnabled: true,
      reason: "Management-Reporting fuer Forecast-Ergebnisse"
    },
    {
      deliverableId: "forecast_model",
      defaultEnabled: false,
      reason: "KI-gestuetztes Forecasting als naechster Ausbau (Coming Soon)"
    }
  ],

  // Churn Prevention (Sales & Marketing)
  "churn-prevention-algo": [
    {
      deliverableId: "bi_setup",
      defaultEnabled: true,
      reason: "Transparente Kunden- und Verhaltensdaten im BI-Layer"
    },
    {
      deliverableId: "glossary_sprint",
      defaultEnabled: true,
      reason: "Einheitliche Definition von Churn- und Risiko-KPIs"
    },
    {
      deliverableId: "churn_model",
      defaultEnabled: false,
      reason: "KI-Modell fuer Churn-Praevention als Ausbau (Coming Soon)"
    },
    {
      deliverableId: "pbi_training_user",
      defaultEnabled: false,
      reason: "Enablement fuer Teams zur Nutzung der Ergebnisse"
    }
  ],

  // Predictive Maintenance (Production)
  "predictive-maintenance": [
    {
      deliverableId: "source_integration_review",
      defaultEnabled: true,
      reason: "Bewertung und Anbindung von Maschinen- und Sensordaten"
    },
    {
      deliverableId: "dwh_starter",
      defaultEnabled: true,
      reason: "Zentrale Datenbasis fuer Wartungs- und Produktionsdaten"
    },
    {
      deliverableId: "predictive_maintenance",
      defaultEnabled: false,
      reason: "Praediktive Wartung als KI-Modul (Coming Soon)"
    },
    {
      deliverableId: "monitoring_ops",
      defaultEnabled: false,
      reason: "Betriebsstabilitaet und Monitoring im laufenden Betrieb (Coming Soon)"
    }
  ],

  // Anomaly Detection (IT & Data)
  "anomaly-detection": [
    {
      deliverableId: "source_integration_review",
      defaultEnabled: true,
      reason: "Fundierte Analyse der Datenquellen fuer Anomalie-Use-Cases"
    },
    {
      deliverableId: "dwh_starter",
      defaultEnabled: true,
      reason: "Zentrale Datenbasis fuer Erkennung und Nachverfolgung"
    },
    {
      deliverableId: "anomaly_detection",
      defaultEnabled: false,
      reason: "Automatisierte Anomalie-Erkennung als KI-Ausbau (Coming Soon)"
    },
    {
      deliverableId: "mgmt_report_1",
      defaultEnabled: true,
      reason: "Management-Sicht auf Auffaelligkeiten und Risiken"
    }
  ],

  // Datenstrategie (General Management)
  "datenstrategie": [
    {
      deliverableId: "strategy_sprint",
      defaultEnabled: false,
      reason: "Klarer strategischer Rahmen fuer Dateninitiativen (Coming Soon)"
    },
    {
      deliverableId: "roadmap",
      defaultEnabled: false,
      reason: "Priorisierte Umsetzungsplanung fuer die naechsten Schritte (Coming Soon)"
    },
    {
      deliverableId: "glossary_sprint",
      defaultEnabled: true,
      reason: "Schneller Einstieg mit gemeinsamen Begriffen und KPI-Verstaendnis"
    }
  ],

  // KI Strategie (General Management)
  "ki-strategie": [
    {
      deliverableId: "strategy_sprint",
      defaultEnabled: false,
      reason: "Strategischer Rahmen fuer KI-Ziele und Leitplanken (Coming Soon)"
    },
    {
      deliverableId: "roadmap",
      defaultEnabled: false,
      reason: "Roadmap fuer priorisierte KI-Use-Cases (Coming Soon)"
    },
    {
      deliverableId: "kpi_ws",
      defaultEnabled: true,
      reason: "Messbare Zielsetzung fuer KI-Initiativen"
    }
  ],

  // Maturity Assessment (General Management)
  "maturity-assessment": [
    {
      deliverableId: "source_integration_review",
      defaultEnabled: true,
      reason: "Objektive Bestandsaufnahme der Datenlandschaft"
    },
    {
      deliverableId: "kpi_ws",
      defaultEnabled: true,
      reason: "Bewertungsrahmen und Reifegradkriterien scharfstellen"
    },
    {
      deliverableId: "roadmap",
      defaultEnabled: false,
      reason: "Massnahmen priorisieren und zeitlich einordnen (Coming Soon)"
    }
  ],

  // Data Mesh Organisation (General Management)
  "data-mesh-organisation": [
    {
      deliverableId: "governance_starter",
      defaultEnabled: false,
      reason: "Rollen und Foederationsmodell aufbauen (Coming Soon)"
    },
    {
      deliverableId: "target_architecture",
      defaultEnabled: false,
      reason: "Architekturzielbild fuer Data Products definieren (Coming Soon)"
    },
    {
      deliverableId: "source_integration_review",
      defaultEnabled: true,
      reason: "Domänenfaehigkeit und Datenquellen analysieren"
    }
  ],

  // Data Catalog (General Management)
  "data-catalog": [
    {
      deliverableId: "glossary_sprint",
      defaultEnabled: true,
      reason: "Glossar als Kernbestandteil eines Data Catalogs"
    },
    {
      deliverableId: "governance_starter",
      defaultEnabled: false,
      reason: "Ownership und Governance-Strukturen fuer den Catalog (Coming Soon)"
    }
  ],

  // Data & AI Leadership (General Management)
  "data-ai-leadership": [
    {
      deliverableId: "kpi_ws",
      defaultEnabled: true,
      reason: "Fuehrungsrelevante KPI- und Steuerungslogik festlegen"
    },
    {
      deliverableId: "strategy_sprint",
      defaultEnabled: true,
      reason: "Leadership-Rahmen fuer Data & AI ausarbeiten"
    },
    {
      deliverableId: "roadmap",
      defaultEnabled: true,
      reason: "Transformation in klare Schritte uebersetzen"
    }
  ],

  // DWH (IT & Data)
  "dwh": [
    {
      deliverableId: "dwh_starter",
      defaultEnabled: true,
      reason: "Direkter Aufbau einer zentralen Datenablage"
    },
    {
      deliverableId: "source_integration_review",
      defaultEnabled: true,
      reason: "Integrationsfaehigkeit und Quellenqualitaet absichern"
    },
    {
      deliverableId: "reporting_standards",
      defaultEnabled: true,
      reason: "Reporting auf der neuen Datenbasis standardisieren"
    }
  ],

  // Data Lake (IT & Data)
  "data-lake": [
    {
      deliverableId: "source_integration_review",
      defaultEnabled: true,
      reason: "Quellenanalyse und Ingestion-Plan als Startpunkt"
    },
    {
      deliverableId: "dwh_starter",
      defaultEnabled: true,
      reason: "Lakehouse-nahe Basisarchitektur pragmatisch etablieren"
    },
    {
      deliverableId: "target_architecture",
      defaultEnabled: false,
      reason: "Zielbild fuer skalierbare Lake-Architektur ausarbeiten"
    }
  ],

  // Enterprise Architecture Management (IT & Data)
  "enterprise-architecture-management": [
    {
      deliverableId: "target_architecture",
      defaultEnabled: true,
      reason: "EAM-Zielbild und Prinzipien definieren"
    },
    {
      deliverableId: "source_integration_review",
      defaultEnabled: true,
      reason: "Ist-Landschaft als Basis fuer Architekturentscheidungen"
    },
    {
      deliverableId: "roadmap",
      defaultEnabled: false,
      reason: "EAM-Massnahmen priorisiert einplanen (Coming Soon)"
    }
  ],

  // AI Architektur & Infrastruktur (IT & Data)
  "ai-architektur-infrastruktur": [
    {
      deliverableId: "target_architecture",
      defaultEnabled: false,
      reason: "Skalierbares Architekturziel fuer AI-Workloads definieren (Coming Soon)"
    },
    {
      deliverableId: "dwh_starter",
      defaultEnabled: true,
      reason: "Datenfundament fuer KI-Modelle bereitstellen"
    },
    {
      deliverableId: "source_integration_review",
      defaultEnabled: true,
      reason: "Relevante Quellsysteme fuer AI identifizieren und bewerten"
    }
  ],

  // Souveraene KI Infrastruktur (IT & Data)
  "souveraene-ki-infrastruktur": [
    {
      deliverableId: "iam_concept",
      defaultEnabled: false,
      reason: "Zugriff und Identitaeten fuer souveraenen KI-Betrieb absichern (Coming Soon)"
    },
    {
      deliverableId: "target_architecture",
      defaultEnabled: false,
      reason: "Souveraenes Architekturzielbild festlegen (Coming Soon)"
    },
    {
      deliverableId: "source_integration_review",
      defaultEnabled: true,
      reason: "Daten- und Systemlandschaft fuer souveraene Umsetzung bewerten"
    }
  ],

  // Souveraene Datenarchitektur (IT & Data)
  "souveraene-datenarchitektur": [
    {
      deliverableId: "target_architecture",
      defaultEnabled: false,
      reason: "Souveraenes Zielbild fuer Datenplattformen ausarbeiten (Coming Soon)"
    },
    {
      deliverableId: "dwh_starter",
      defaultEnabled: true,
      reason: "Kontrollierbares Datenfundament fuer Kernprozesse schaffen"
    },
    {
      deliverableId: "iam_concept",
      defaultEnabled: false,
      reason: "Datenzugriffe governance-konform steuern (Coming Soon)"
    }
  ],

  // DataOps (IT & Data)
  "dataops": [
    {
      deliverableId: "monitoring_ops",
      defaultEnabled: false,
      reason: "Monitoring, Betrieb und Incident-Ablauf etablieren (Coming Soon)"
    },
    {
      deliverableId: "bi_factory",
      defaultEnabled: false,
      reason: "Standardisierte Build-Prozesse fuer Datenprodukte aufsetzen (Coming Soon)"
    },
    {
      deliverableId: "source_integration_review",
      defaultEnabled: true,
      reason: "Technische Voraussetzungen fuer DataOps bewerten"
    }
  ],

  // Wartung & Support (IT & Data)
  "wartung-support": [
    {
      deliverableId: "retainer",
      defaultEnabled: false,
      reason: "Laufendes Support-Modell fuer stabilen Betrieb (Coming Soon)"
    },
    {
      deliverableId: "monitoring_ops",
      defaultEnabled: false,
      reason: "Proaktives Monitoring als Wartungsbasis (Coming Soon)"
    },
    {
      deliverableId: "reporting_standards",
      defaultEnabled: true,
      reason: "Betriebsreporting und Transparenz standardisieren"
    }
  ],

  // Master Data Management (IT & Data)
  "master-data-management": [
    {
      deliverableId: "governance_starter",
      defaultEnabled: false,
      reason: "Stammdaten-Governance und Verantwortungen einrichten (Coming Soon)"
    },
    {
      deliverableId: "glossary_sprint",
      defaultEnabled: true,
      reason: "Einheitliche Begriffe und Kerndefinitionen schaffen"
    },
    {
      deliverableId: "source_integration_review",
      defaultEnabled: true,
      reason: "Stammdatenquellen und Qualitaetsluecken identifizieren"
    }
  ],

  // NIS2 (Risk & Compliance)
  "nis2": [
    {
      deliverableId: "governance_starter",
      defaultEnabled: false,
      reason: "Governance-Rahmen fuer NIS2-Anforderungen aufbauen (Coming Soon)"
    },
    {
      deliverableId: "iam_concept",
      defaultEnabled: false,
      reason: "Zugriffs- und Rollenmodell als Sicherheitsgrundlage (Coming Soon)"
    },
    {
      deliverableId: "kpi_ws",
      defaultEnabled: true,
      reason: "Messbare Security- und Compliance-Kennzahlen definieren"
    }
  ],

  // DSGVO (+ DSB) (Risk & Compliance)
  "dsgvo-dsb": [
    {
      deliverableId: "governance_starter",
      defaultEnabled: true,
      reason: "Datenschutz-Governance mit Rollen und Prozessen aufsetzen"
    },
    {
      deliverableId: "glossary_sprint",
      defaultEnabled: true,
      reason: "Begriffe und Datenobjekte fuer DSGVO-konforme Kommunikation standardisieren"
    },
    {
      deliverableId: "iam_concept",
      defaultEnabled: false,
      reason: "Zugriffssteuerung fuer personenbezogene Daten absichern"
    }
  ],

  // ISMS & ISB Bestellung (Risk & Compliance)
  "isms-isb-bestellung": [
    {
      deliverableId: "governance_starter",
      defaultEnabled: true,
      reason: "ISMS-nahe Governance-Struktur schaffen"
    },
    {
      deliverableId: "iam_concept",
      defaultEnabled: false,
      reason: "ISMS-relevante Zugriffskontrollen konzipieren"
    },
    {
      deliverableId: "kpi_ws",
      defaultEnabled: true,
      reason: "Sicherheitskennzahlen und Steuerungsmechanik definieren"
    }
  ],

  // IAM (Risk & Compliance)
  "iam": [
    {
      deliverableId: "iam_concept",
      defaultEnabled: true,
      reason: "IAM-Zielbild und Rollenmodell strukturieren"
    },
    {
      deliverableId: "roles_rights_impl",
      defaultEnabled: false,
      reason: "Technische Umsetzung von Rollen und Rechten vorbereiten"
    },
    {
      deliverableId: "source_integration_review",
      defaultEnabled: true,
      reason: "Systemlandschaft fuer IAM-Rollout analysieren"
    }
  ],

  // Block 2: Insights & Analytics
  "alarm-system": [
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Kritische Schwellenwerte und Fruehwarn-KPIs definieren" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "Management-Sicht auf kritische Abweichungen bereitstellen" },
    { deliverableId: "anomaly_detection", defaultEnabled: false, reason: "Automatisierte Erkennung auffaelliger Muster als Ausbau (Coming Soon)" }
  ],
  "liquiditaetsplanung-bi": [
    { deliverableId: "bi_setup", defaultEnabled: true, reason: "Liquiditaetssteuerung auf stabiler BI-Basis abbilden" },
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Cashflow-, Bestand- und Engpass-KPIs klar definieren" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "Steuerungsreport fuer Finanzleitung bereitstellen" }
  ],
  "budget-controlling": [
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Budget- und Abweichungskennzahlen konsistent festlegen" },
    { deliverableId: "reporting_standards", defaultEnabled: true, reason: "Einheitliche Budgetberichte ueber Bereiche sichern" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "Regelmaessiges Budget-Reporting fuer Management etablieren" }
  ],
  "deckungsbeitragsrechnung": [
    { deliverableId: "bi_setup", defaultEnabled: true, reason: "Margenanalysen transparent im BI-System abbilden" },
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "DB-Kennzahlen und Berechnungslogik sauber abstimmen" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "Deckungsbeitraege als Management-Entscheidungsgrundlage aufbereiten" }
  ],
  "working-capital-analyse": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Finanz- und Bestandsquellen fuer Working Capital zusammenfuehren" },
    { deliverableId: "dwh_starter", defaultEnabled: true, reason: "Zentrale Datenbasis fuer Forderungen, Verbindlichkeiten und Bestand schaffen" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "Working-Capital-Entwicklung fuer Management steuerbar machen" }
  ],
  "kostenstruktur-gemeinkosten-monitoring": [
    { deliverableId: "bi_setup", defaultEnabled: true, reason: "Kostenstrukturen in einem konsistenten BI-Cockpit visualisieren" },
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Kosten- und Gemeinkostenmetriken unternehmensweit vereinheitlichen" },
    { deliverableId: "reporting_standards", defaultEnabled: true, reason: "Vergleichbare Kostenberichte und Drilldowns etablieren" }
  ],
  "investitionscontrolling-capex": [
    { deliverableId: "bi_setup", defaultEnabled: true, reason: "CAPEX-Portfolios und Fortschritte transparent darstellen" },
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Investitionskennzahlen und Nutzenlogik definieren" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "Management-Reporting fuer Investitionsentscheidungen bereitstellen" }
  ],
  "customer-lifetime-value": [
    { deliverableId: "bi_setup", defaultEnabled: true, reason: "Kundenwertanalyse in zentrale Vertriebsdashboards integrieren" },
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "CLV-Definitionen und Segmentierung sauber abstimmen" },
    { deliverableId: "forecast_model", defaultEnabled: false, reason: "Prognose der Kundenwertentwicklung als naechster Schritt (Coming Soon)" }
  ],
  "lead-scoring": [
    { deliverableId: "bi_setup", defaultEnabled: true, reason: "Lead-Pipeline und Qualitaet transparent im BI abbilden" },
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Scoring-Kriterien und Conversion-KPIs klar definieren" },
    { deliverableId: "forecast_model", defaultEnabled: false, reason: "Praediktive Lead-Bewertung als Ausbau vorbereiten (Coming Soon)" }
  ],
  "data-driven-marketing": [
    { deliverableId: "bi_setup", defaultEnabled: true, reason: "Kanaluebergreifende Marketingdaten zentral auswerten" },
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Marketing-KPIs und Attribution einheitlich festlegen" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "Performance-Bericht fuer Marketing- und Vertriebssteuerung erzeugen" }
  ],
  "sales-funnel-analyse": [
    { deliverableId: "bi_setup", defaultEnabled: true, reason: "Funnel-Stufen und Conversion-Raten zentral visualisieren" },
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Einheitliche Definition der Funnel-Kennzahlen sichern" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "Massnahmenorientiertes Funnel-Reporting fuer Management erstellen" }
  ],
  "reklamations-analyse": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Service-, Qualitaets- und Kundendaten fuer Reklamationen verknuepfen" },
    { deliverableId: "bi_setup", defaultEnabled: true, reason: "Reklamationsursachen und Trends im Dashboard sichtbar machen" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "Regelbericht fuer Qualitaets- und Serviceverbesserung bereitstellen" }
  ],
  "einkaufs-forecast": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Bedarfs-, Bestands- und Lieferdaten fuer Forecasting zusammenfuehren" },
    { deliverableId: "dwh_starter", defaultEnabled: true, reason: "Zentrale Beschaffungsdatenbasis fuer Prognosen etablieren" },
    { deliverableId: "forecast_model", defaultEnabled: false, reason: "Bestellzeitpunktprognose als Ausbau vorbereiten (Coming Soon)" }
  ],
  "best-price-purchase": [
    { deliverableId: "bi_setup", defaultEnabled: true, reason: "Preisentwicklung und Abweichungen transparent monitoren" },
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Lieferanten- und Preisdaten fuer Vergleichbarkeit harmonisieren" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "Beschaffungskostenbericht fuer Steuerung und Verhandlung bereitstellen" }
  ],
  "lieferantenscoring": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Lieferantenleistung ueber Systeme hinweg konsolidieren" },
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Scoring-Logik fuer Preis, Qualitaet und Liefertreue festlegen" },
    { deliverableId: "reporting_standards", defaultEnabled: true, reason: "Einheitliche Scorecards fuer Einkauf und Management etablieren" }
  ],
  "lageroptimierung": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Lagerbewegungen und Materialflussdaten integrierbar machen" },
    { deliverableId: "bi_setup", defaultEnabled: true, reason: "Lagerplatzauslastung und Wege transparent darstellen" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "Regelreport fuer Lagerperformance und Effizienz erzeugen" }
  ],
  "quality-assurance-ai": [
    { deliverableId: "bi_setup", defaultEnabled: true, reason: "Qualitaets- und Ausschussdaten zentral visualisieren" },
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Fehler- und Ausschusskennzahlen einheitlich definieren" },
    { deliverableId: "qa_ai", defaultEnabled: false, reason: "Automatisierte Qualitaetspruefung als naechster Ausbauschritt (Coming Soon)" }
  ],
  "lagerbestandsverwaltung": [
    { deliverableId: "bi_setup", defaultEnabled: true, reason: "Lagerplaetze und Bestandsbewegungen digital sichtbar machen" },
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Kennzahlen fuer Bestand, Reichweite und Umschlag festlegen" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "Steuerungsreport fuer Lagerflaechen und Verfuegbarkeit bereitstellen" }
  ],
  "oee-analyse": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Maschinen-, Qualitaets- und Stillstandsdaten integrieren" },
    { deliverableId: "bi_setup", defaultEnabled: true, reason: "OEE-Treiber in interaktiven Dashboards abbilden" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "OEE-Reporting fuer operative und strategische Steuerung etablieren" }
  ],
  "durchlaufzeit-bottleneck-analyse": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Prozessketten- und Auftragsdaten fuer Engpassanalyse verknuepfen" },
    { deliverableId: "dwh_starter", defaultEnabled: true, reason: "Durchlaufzeitdaten stabil und historisiert bereitstellen" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "Regelreport fuer Engpaesse und Taktverbesserung bereitstellen" }
  ],
  "itsm-analytics": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Ticket- und Betriebsdaten aus ITSM-Systemen konsolidieren" },
    { deliverableId: "bi_setup", defaultEnabled: true, reason: "SLA-, Volumen- und Loesungszeitmetriken transparent auswerten" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "IT-Service-Reporting fuer Leitung und Operations bereitstellen" }
  ],
  "cloud-cost-observability": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Cloud-Billing- und Nutzungsdaten konsistent integrieren" },
    { deliverableId: "bi_setup", defaultEnabled: true, reason: "Kosten- und Verbrauchstreiber im Dashboard sichtbar machen" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "Regelreport fuer FinOps- und Architektursteuerung erzeugen" }
  ],
  "cybersicherheit-dashboard": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Security-Ereignisse aus SIEM, IAM und Endpoint-Systemen zusammenfuehren" },
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Sicherheitskennzahlen und Risikoschwellen verbindlich definieren" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "Managementfaehige Sicht auf Sicherheitslage und Trends bereitstellen" }
  ],
  "prozesseffizienz-analyse": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Prozess- und Aufwandsdaten ueber Systemgrenzen hinweg vereinheitlichen" },
    { deliverableId: "bi_setup", defaultEnabled: true, reason: "Effizienzkennzahlen und Durchlaufzeiten transparent monitoren" },
    { deliverableId: "reporting_standards", defaultEnabled: true, reason: "Vergleichbare Prozessberichte fuer kontinuierliche Verbesserung etablieren" }
  ],

  // Block 3: Automatisierung & KI
  "automatisierung-customer-success": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Support-, CRM- und Kommunikationsdaten fuer Automatisierung zusammenfuehren" },
    { deliverableId: "reporting_standards", defaultEnabled: true, reason: "Einheitliche Service-Automationsmetriken etablieren" },
    { deliverableId: "churn_model", defaultEnabled: false, reason: "KI-gestuetzte Priorisierung kritischer Kundenfaelle als Ausbau (Coming Soon)" }
  ],
  "automatisierung-bestelldaten": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Bestellkanaele und ERP-Schnittstellen fuer Automatisierung harmonisieren" },
    { deliverableId: "reporting_standards", defaultEnabled: true, reason: "Durchlaufzeiten und Fehlerquoten standardisiert steuerbar machen" },
    { deliverableId: "monitoring_ops", defaultEnabled: false, reason: "Operatives Monitoring fuer stabile Bestellprozesse vorbereiten (Coming Soon)" }
  ],
  "helpdesk-automation": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Ticket-, System- und Teamdaten fuer Routinglogik konsolidieren" },
    { deliverableId: "reporting_standards", defaultEnabled: true, reason: "SLA- und Routingkennzahlen transparent und vergleichbar abbilden" },
    { deliverableId: "monitoring_ops", defaultEnabled: false, reason: "Laufendes Monitoring der Routingqualitaet als Ausbau etablieren (Coming Soon)" }
  ],
  "financial-forecasting": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Zahlungs-, Forderungs- und Planungsdaten fuer Cashflow-Prognosen integrieren" },
    { deliverableId: "dwh_starter", defaultEnabled: true, reason: "Historisierte Datenbasis fuer belastbare Prognosemodelle schaffen" },
    { deliverableId: "forecast_model", defaultEnabled: false, reason: "KI-gestuetzte Cashflow-Prognose als Modellausbau vorbereiten (Coming Soon)" }
  ],
  "sales-chatbot-webseite": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Website-, CRM- und Kampagnendaten fuer Chatbot-Logik anbinden" },
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Lead- und Conversion-KPIs fuer Chatbot-Erfolg verbindlich definieren" },
    { deliverableId: "churn_model", defaultEnabled: false, reason: "Praediktive Dialogpriorisierung und Personalisierung als Ausbau (Coming Soon)" }
  ],
  "dynamic-pricing": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Preis-, Nachfrage- und Wettbewerbsdaten fuer Automatisierung konsolidieren" },
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Margen- und Preisleitplanken fuer dynamische Steuerung festlegen" },
    { deliverableId: "forecast_model", defaultEnabled: false, reason: "Prognosebasierte Preisanpassung als naechster Schritt vorbereiten (Coming Soon)" }
  ],
  "ausschreibungsautomatisierung": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Lieferanten-, Bedarfs- und Vergabedaten fuer Workflow-Automatisierung verbinden" },
    { deliverableId: "reporting_standards", defaultEnabled: true, reason: "Vergabeprozesse transparent und auditierbar dokumentieren" },
    { deliverableId: "governance_starter", defaultEnabled: false, reason: "Regelwerk und Verantwortlichkeiten fuer Ausschreibungen ausbauen (Coming Soon)" }
  ],
  "automatisierte-rechnungsverarbeitung": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Rechnungsquellen und ERP-Prozesse fuer End-to-End-Automation harmonisieren" },
    { deliverableId: "reporting_standards", defaultEnabled: true, reason: "Pruef- und Freigabekennzahlen fuer Finance standardisiert auswerten" },
    { deliverableId: "monitoring_ops", defaultEnabled: false, reason: "Fehler- und Ausnahmeprozesse fuer den laufenden Betrieb ueberwachen (Coming Soon)" }
  ],
  "ai-helpdeskassistent": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Wissensbasis und Ticketdaten fuer Assistenzfunktionen anbinden" },
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Qualitaets- und Loesungskennzahlen fuer Assistentenleistung definieren" },
    { deliverableId: "monitoring_ops", defaultEnabled: false, reason: "Nutzungs- und Antwortqualitaet im Betrieb kontinuierlich ueberwachen (Coming Soon)" }
  ],
  "agentic-coding": [
    { deliverableId: "reporting_standards", defaultEnabled: true, reason: "Metriken fuer Agentenleistung, Qualitaet und Durchsatz einheitlich festlegen" },
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Governance-KPIs fuer sichere Agentenautomation definieren" },
    { deliverableId: "retainer", defaultEnabled: false, reason: "Kontinuierliche Betriebs- und Verbesserungsunterstuetzung vorbereiten (Coming Soon)" }
  ],
  "self-service-helpdesk": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Servicekatalog, Wissensbasis und Ticketlogik konsistent verknuepfen" },
    { deliverableId: "reporting_standards", defaultEnabled: true, reason: "Self-Service-Nutzung und Ticketentlastung transparent messen" },
    { deliverableId: "monitoring_ops", defaultEnabled: false, reason: "Betriebsqualitaet und Deflection-Rate laufend ueberwachen (Coming Soon)" }
  ],
  "ki-preisueberwachung": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Preisquellen und Lieferantendaten fuer KI-Ueberwachung zusammenfuehren" },
    { deliverableId: "forecast_model", defaultEnabled: false, reason: "Praediktive Preistrends und Warnlogik als Ausbau vorbereiten (Coming Soon)" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "Managementsicht auf Preisrisiken und Handlungsbedarf bereitstellen" }
  ],
  "automatisierte-bestellverarbeitung": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Bestell-, Freigabe- und Lieferdaten fuer End-to-End-Prozessabwicklung verbinden" },
    { deliverableId: "reporting_standards", defaultEnabled: true, reason: "Prozesskennzahlen fuer Durchlauf und Fehlerquote standardisieren" },
    { deliverableId: "monitoring_ops", defaultEnabled: false, reason: "Stabilitaet des automatisierten Workflows laufend absichern (Coming Soon)" }
  ],
  "spendmanagement-automatisieren": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Ausgaben- und Lieferantendaten fuer automatisierte Spend-Klassifikation harmonisieren" },
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Spend-KPIs und Einsparziele fuer Automatisierung festlegen" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "Transparente Steuerung von Einsparhebeln fuer Management etablieren" }
  ],
  "kyc-automatisierung": [
    { deliverableId: "iam_concept", defaultEnabled: false, reason: "Identitaets- und Zugriffsanforderungen fuer KYC-Prozesse absichern (Coming Soon)" },
    { deliverableId: "governance_starter", defaultEnabled: false, reason: "Governance-Rahmen fuer regelkonforme KYC-Automatisierung aufbauen (Coming Soon)" },
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Risikoorientierte KYC-Kennzahlen fuer Priorisierung definieren" }
  ],
  "esg-datenerhebung-automatisiert": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "ESG-Datenquellen aus Fachbereichen und Systemen zusammenfuehren" },
    { deliverableId: "governance_starter", defaultEnabled: false, reason: "Verantwortungen und Datenqualitaetsregeln fuer ESG etablieren (Coming Soon)" },
    { deliverableId: "reporting_standards", defaultEnabled: true, reason: "Einheitliche ESG-Berichtslogik fuer Nachweisfaehigkeit absichern" }
  ],
  "ai-oberflaechenanalyse": [
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Usability- und Conversion-Kennzahlen fuer KI-Analysen verbindlich festlegen" },
    { deliverableId: "reporting_standards", defaultEnabled: true, reason: "Vergleichbare UI-Analyseberichte fuer Produktteams bereitstellen" },
    { deliverableId: "forecast_model", defaultEnabled: false, reason: "Prognosen zu UX-Effekten geplanter Aenderungen vorbereiten (Coming Soon)" }
  ],
  "ai-produktentwicklung": [
    { deliverableId: "kpi_ws", defaultEnabled: true, reason: "Innovations- und Time-to-Market-KPIs fuer KI-gestuetzte Entwicklung definieren" },
    { deliverableId: "roadmap", defaultEnabled: false, reason: "Skalierungsroadmap fuer KI in der Produktentwicklung strukturieren (Coming Soon)" },
    { deliverableId: "retainer", defaultEnabled: false, reason: "Kontinuierliche Begleitung fuer iterative KI-Produktentwicklung vorsehen (Coming Soon)" }
  ],
  "rag-literaturrecherche": [
    { deliverableId: "glossary_sprint", defaultEnabled: true, reason: "Fachbegriffe und Quellenstrukturen fuer RAG-Recherche standardisieren" },
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Dokumentenquellen und Retrieval-Qualitaet fuer belastbare Recherche bewerten" },
    { deliverableId: "target_architecture", defaultEnabled: false, reason: "Skalierbares Zielbild fuer RAG-Services als Ausbau definieren (Coming Soon)" }
  ],
  "ai-video-qualitaetsanalyse": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Video- und Produktionsdaten fuer KI-Qualitaetspruefung integrieren" },
    { deliverableId: "qa_ai", defaultEnabled: false, reason: "Automatisierte Fehlerklassifikation per KI als Ausbau einsetzen (Coming Soon)" },
    { deliverableId: "monitoring_ops", defaultEnabled: false, reason: "Laufendes Monitoring der Modellqualitaet vorbereiten (Coming Soon)" }
  ],
  "ki-warenausgangs-scanning": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Scan-, Auftrags- und Versanddaten fuer Warenausgangspruefung verknuepfen" },
    { deliverableId: "reporting_standards", defaultEnabled: true, reason: "Qualitaetskennzahlen fuer Versandpruefungen standardisieren" },
    { deliverableId: "anomaly_detection", defaultEnabled: false, reason: "Anomalieerkennung im Warenausgang als Ausbau vorbereiten (Coming Soon)" }
  ],
  "tourenplanung-automatisiert": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Routen-, Auftrags- und Telematikdaten fuer KI-Optimierung konsolidieren" },
    { deliverableId: "forecast_model", defaultEnabled: false, reason: "Dynamische Routenprognosen fuer adaptive Planung vorbereiten (Coming Soon)" },
    { deliverableId: "mgmt_report_1", defaultEnabled: true, reason: "Steuerung von Liefertreue und Transportkosten fuer Management absichern" }
  ],
  "objekterkennung": [
    { deliverableId: "source_integration_review", defaultEnabled: true, reason: "Bild- und Prozessdaten fuer robuste Objekterkennung zusammenfuehren" },
    { deliverableId: "qa_ai", defaultEnabled: false, reason: "KI-basierte Klassifikation und Qualitaetskontrolle als Ausbau aufsetzen (Coming Soon)" },
    { deliverableId: "monitoring_ops", defaultEnabled: false, reason: "Betriebsueberwachung fuer Modellguete und Drift vorbereiten (Coming Soon)" }
  ]
};

// Prioritätsreihenfolge für Deduplizierung
const priorityOrder: string[] = [
  // Core BI & Analytics (höchste Priorität)
  "bi_setup",
  "kpi_ws",
  "mgmt_report_1",
  "reporting_standards",
  
  // Data Architecture
  "dwh_starter",
  "source_integration_review",
  
  // Data Knowledge
  "glossary_sprint",
  "pbi_training_user",
  "pbi_training_dev",
  
  // Coming Soon (niedrigste Priorität)
  "forecast_model",
  "churn_model",
  "anomaly_detection",
  "predictive_maintenance",
  "qa_ai",
  "governance_starter",
  "iam_concept",
  "roles_rights_impl",
  "strategy_sprint",
  "roadmap",
  "target_architecture",
  "bi_factory",
  "monitoring_ops",
  "retainer"
];

/**
 * Fallback Rule Engine
 * Generiert Recommendations basierend auf Use Case Tags
 */
function generateRecommendationsFromRules(useCaseId: string): Recommendation[] {
  const useCase = getUseCaseById(useCaseId);
  if (!useCase) return [];

  const recommendations: Recommendation[] = [];
  const seen = new Set<string>();

  // Rule 1: transparency → Core BI Setup
  if (useCase.tags.intent.includes("transparency")) {
    addIfNotSeen(recommendations, seen, {
      deliverableId: "bi_setup",
      defaultEnabled: true,
      reason: "BI-System für transparente Datenvisualisierung"
    });
    addIfNotSeen(recommendations, seen, {
      deliverableId: "kpi_ws",
      defaultEnabled: true,
      reason: "Definition der relevanten KPIs für Transparenz"
    });
    addIfNotSeen(recommendations, seen, {
      deliverableId: "mgmt_report_1",
      defaultEnabled: true,
      reason: "Management-Bericht für Transparenz"
    });
  }

  // Rule 2: automation → Reporting Standards
  if (useCase.tags.intent.includes("automation")) {
    addIfNotSeen(recommendations, seen, {
      deliverableId: "reporting_standards",
      defaultEnabled: true,
      reason: "Standards für automatisierte Berichte"
    });
  }

  // Rule 3: multi_source → Data Architecture
  if (useCase.tags.data_scope === "multi_source" || useCase.tags.data_scope === "enterprise_wide") {
    addIfNotSeen(recommendations, seen, {
      deliverableId: "source_integration_review",
      defaultEnabled: true,
      reason: "Analyse der Datenquellen für Integration"
    });
    addIfNotSeen(recommendations, seen, {
      deliverableId: "dwh_starter",
      defaultEnabled: true,
      reason: "Zentrale Datenablage für mehrere Quellen"
    });
  }

  // Rule 4: compliance → Governance
  if (useCase.tags.intent.includes("compliance")) {
    addIfNotSeen(recommendations, seen, {
      deliverableId: "glossary_sprint",
      defaultEnabled: true,
      reason: "Glossar für Compliance und Governance"
    });
    addIfNotSeen(recommendations, seen, {
      deliverableId: "governance_starter",
      defaultEnabled: false,
      reason: "Data Governance Konzept (Coming Soon)"
    });
  }

  // Rule 5: insights → Forecasting + Management Report
  if (useCase.tags.intent.includes("insights")) {
    addIfNotSeen(recommendations, seen, {
      deliverableId: "forecast_model",
      defaultEnabled: false,
      reason: "Forecasting-Modell für Insights (Coming Soon)"
    });
    addIfNotSeen(recommendations, seen, {
      deliverableId: "mgmt_report_1",
      defaultEnabled: true,
      reason: "Management-Bericht mit Insights"
    });
  }

  // Rule 6: Optional Upsell - Training
  if (useCase.tags.intent.includes("transparency") || useCase.tags.intent.includes("automation")) {
    addIfNotSeen(recommendations, seen, {
      deliverableId: "pbi_training_user",
      defaultEnabled: false,
      reason: "Schulung für selbstständige Berichtserstellung (optional)"
    });
  }

  return recommendations;
}

/**
 * Hilfsfunktion: Fügt Recommendation hinzu, wenn noch nicht vorhanden
 */
function addIfNotSeen(
  recommendations: Recommendation[],
  seen: Set<string>,
  recommendation: Recommendation
) {
  if (!seen.has(recommendation.deliverableId)) {
    recommendations.push(recommendation);
    seen.add(recommendation.deliverableId);
  }
}

/**
 * Dedupliziert und priorisiert Recommendations
 */
function deduplicateAndPrioritize(recommendations: Recommendation[]): Recommendation[] {
  // Gruppiere nach deliverableId (behalte erste, wenn dupliziert)
  const unique = new Map<string, Recommendation>();
  for (const rec of recommendations) {
    if (!unique.has(rec.deliverableId)) {
      unique.set(rec.deliverableId, rec);
    }
  }

  // Sortiere nach Prioritätsreihenfolge
  const sorted = Array.from(unique.values()).sort((a, b) => {
    const indexA = priorityOrder.indexOf(a.deliverableId);
    const indexB = priorityOrder.indexOf(b.deliverableId);
    
    // Wenn nicht in priorityOrder, ans Ende
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    
    return indexA - indexB;
  });

  // Gruppiere nach Familie für bessere Lesbarkeit
  const grouped: Recommendation[] = [];
  
  // Core BI & Analytics zuerst
  const core = sorted.filter(r => 
    ["bi_setup", "kpi_ws", "mgmt_report_1", "reporting_standards"].includes(r.deliverableId)
  );
  grouped.push(...core);
  
  // Data Architecture
  const dataArch = sorted.filter(r => 
    ["dwh_starter", "source_integration_review"].includes(r.deliverableId)
  );
  grouped.push(...dataArch);
  
  // Data Knowledge
  const dataKnow = sorted.filter(r => 
    ["glossary_sprint", "pbi_training_user", "pbi_training_dev"].includes(r.deliverableId)
  );
  grouped.push(...dataKnow);
  
  // Coming Soon (alle anderen)
  const comingSoon = sorted.filter(r => 
    !core.includes(r) && !dataArch.includes(r) && !dataKnow.includes(r)
  );
  grouped.push(...comingSoon);

  return grouped;
}

/**
 * Nur aktive Bausteine; „Coming Soon“ aus Begründungstext entfernen.
 */
function toActiveRecommendations(recommendations: Recommendation[]): Recommendation[] {
  return recommendations
    .filter((rec) => Boolean(getDeliverableById(rec.deliverableId)?.active))
    .map((rec) => ({
      ...rec,
      reason: rec.reason.replace(/\s*\(Coming Soon\)/gi, "").trim(),
    }));
}

/**
 * Hauptfunktion: Gibt Bundle für Use Case zurück
 */
export function getBundleForUseCase(useCaseId: string): Recommendation[] {
  const fallbackBundle: Recommendation[] = [
    {
      deliverableId: "bi_setup",
      defaultEnabled: true,
      reason: "Schneller Einstieg mit einem direkt konfigurierbaren BI-Baustein",
    },
    {
      deliverableId: "kpi_ws",
      defaultEnabled: true,
      reason: "Messbare KPIs als belastbare Entscheidungsgrundlage",
    },
    {
      deliverableId: "mgmt_report_1",
      defaultEnabled: true,
      reason: "Konkreter Bericht für schnelle Management-Transparenz",
    },
  ];

  // Prüfe Hard Override
  if (hardOverrides[useCaseId]) {
    const recommendations = toActiveRecommendations(
      deduplicateAndPrioritize(hardOverrides[useCaseId])
    ).slice(0, 6);
    return recommendations.length > 0 ? recommendations : toActiveRecommendations(fallbackBundle);
  }

  // Fallback: Rule Engine
  const recommendations = toActiveRecommendations(
    deduplicateAndPrioritize(generateRecommendationsFromRules(useCaseId))
  ).slice(0, 6);
  return recommendations.length > 0 ? recommendations : toActiveRecommendations(fallbackBundle);
}

/**
 * Gibt alle Hard Override Bundles zurück
 */
export function getHardOverrideBundles(): UseCaseBundle[] {
  return Object.entries(hardOverrides).map(([useCaseId, recommendations]) => ({
    useCaseId,
    recommendations: deduplicateAndPrioritize(recommendations)
  }));
}

/**
 * Prüft, ob Use Case einen Hard Override hat
 */
export function hasHardOverride(useCaseId: string): boolean {
  return useCaseId in hardOverrides;
}
