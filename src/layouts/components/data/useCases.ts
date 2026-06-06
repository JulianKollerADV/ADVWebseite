export type UseCaseDomain = 
  | "general_mgmt"
  | "it_data"
  | "finance"
  | "sales_marketing"
  | "procurement"
  | "production"
  | "logistics"
  | "hr"
  | "rnd"
  | "risk_compliance";

export type IntentTag = "transparency" | "automation" | "insights" | "compliance" | "scale";
export type DataScopeTag = "single_source" | "multi_source" | "enterprise_wide";
export type ComplexityTag = "xs" | "s" | "m" | "l";
export type MaturityHintTag = "start" | "stabilize" | "scale";
export type TechHintTag = "bi" | "dwh" | "integration" | "ai" | "governance";
export type PortfolioAreaTag = "solutions" | "automation_ai";
export type SolutionClusterTag =
  | "orientation_prioritization"
  | "data_mgmt_architecture"
  | "insights_general_mgmt"
  | "insights_finance"
  | "insights_sales_marketing"
  | "insights_procurement"
  | "insights_production_logistics"
  | "insights_it_ops"
  | "automation_sales_marketing"
  | "automation_finance"
  | "automation_it_ops"
  | "automation_procurement"
  | "automation_risk_compliance"
  | "automation_cross_domain"
  | "automation_rnd"
  | "automation_production_logistics";

/**
 * UseCase = aktuelles Produktmodell des Produktkatalogs.
 *
 * Feld-Klassifikation (Stand Phase 2, siehe MIGRATION_NOTES.md):
 *  - ZWINGEND:      id, domain, title, short, solution_cluster, outputs, tags.intent
 *  - UX-RELEVANT:   priority, tags.data_scope, details.problem/typicalResult/bestFor
 *  - STRAPI/SEO:    slug
 *  - REDUNDANT/LEGACY (nur von entferntem Alt-Flow genutzt -> kann später entfallen):
 *                   portfolio_area, tags.complexity, tags.tech_hint,
 *                   tags.maturity_hint, details.typicalDeliverables
 *
 * Hinweis: Legacy-Felder bleiben vorerst im Interface (optional bzw. tolerant),
 * damit die ~100 bestehenden Datensätze ohne riskanten Massen-Edit weiter valide sind.
 * Beim Schritt UseCase -> Product (productModel.ts) werden sie nicht übernommen.
 */
export interface UseCase {
  /** ZWINGEND – stabiler Schlüssel / künftige Product.id */
  id: string;
  /** STRAPI/SEO – optionaler URL-Slug, derzeit nicht aktiv gerendert */
  slug?: string;
  /** ZWINGEND – Fachdomäne, steuert UI-Cluster-Zuordnung */
  domain: UseCaseDomain;
  /** ZWINGEND – Anzeigetitel */
  title: string;
  /** ZWINGEND – Kurzbeschreibung (1–2 Zeilen, kundenverständlich) */
  short: string;
  /** @deprecated LEGACY – nur vom alten Portfolio-Flow genutzt, kann später entfallen */
  portfolio_area?: PortfolioAreaTag;
  /** ZWINGEND (faktisch) – primäres Cluster für Navigation/Empfehlung */
  solution_cluster?: SolutionClusterTag;
  /** UX-RELEVANT – hebt Fokus-/Featured-Use-Cases hervor */
  priority?: "green" | "normal";
  tags: {
    /** ZWINGEND – treibt Suche + Rule-Engine */
    intent: IntentTag[];
    /** UX-/LOGIK-RELEVANT – treibt Architektur-Empfehlungen */
    data_scope: DataScopeTag;
    /** @deprecated LEGACY – nur Badge im alten Flow, kann später entfallen */
    complexity: ComplexityTag;
    /** @deprecated LEGACY – im aktiven Flow ungenutzt, kann später entfallen */
    maturity_hint: MaturityHintTag;
    /** @deprecated LEGACY – nur Badge im alten Flow, kann später entfallen */
    tech_hint: TechHintTag[];
  };
  /** ZWINGEND – Ergebnis-Bullets (im Paket-View gerendert) */
  outputs: string[];
  details?: {
    /** UX-RELEVANT */
    problem: string;
    /** UX-RELEVANT */
    typicalResult: string;
    /** @deprecated LEGACY – im aktiven Flow ungenutzt (Bausteine kommen aus recommendations.ts) */
    typicalDeliverables: string[];
    /** UX-RELEVANT */
    bestFor: string[];
  };
}

const rawUseCases: UseCase[] = [
  // General Management
  {
    id: "datenstrategie",
    domain: "general_mgmt",
    title: "Datenstrategie",
    short: "Entwicklung einer klaren Datenstrategie mit Prioritäten, Rollen und Roadmap für die nächsten 12-24 Monate.",
    portfolio_area: "solutions",
    solution_cluster: "orientation_prioritization",
    priority: "green",
    tags: {
      intent: ["scale"],
      data_scope: "enterprise_wide",
      complexity: "m",
      maturity_hint: "start",
      tech_hint: ["governance"]
    },
    outputs: [
      "Strategiedokument mit Zielbild",
      "Priorisierte Umsetzungsroadmap",
      "Rollen- und Governance-Rahmen"
    ]
  },
  {
    id: "ki-strategie",
    domain: "general_mgmt",
    title: "KI Strategie",
    short: "Definition einer pragmatischen KI-Strategie mit priorisierten Anwendungsfällen, Risiken und klarer Umsetzungsplanung.",
    portfolio_area: "solutions",
    solution_cluster: "orientation_prioritization",
    priority: "green",
    tags: {
      intent: ["scale", "insights"],
      data_scope: "enterprise_wide",
      complexity: "m",
      maturity_hint: "start",
      tech_hint: ["ai", "governance"]
    },
    outputs: [
      "KI-Zielbild und Leitplanken",
      "Priorisierte KI-Use-Case-Liste",
      "Roadmap mit Quick Wins"
    ]
  },
  {
    id: "maturity-assessment",
    domain: "general_mgmt",
    title: "Maturity Assessment",
    short: "Bewertung des aktuellen Reifegrads von Daten, Analytics und KI als Grundlage für eine belastbare Priorisierung.",
    portfolio_area: "solutions",
    solution_cluster: "orientation_prioritization",
    priority: "green",
    tags: {
      intent: ["transparency"],
      data_scope: "enterprise_wide",
      complexity: "s",
      maturity_hint: "start",
      tech_hint: ["governance", "bi"]
    },
    outputs: [
      "Reifegradbericht je Handlungsfeld",
      "Gap-Analyse mit Handlungsbedarf",
      "Priorisierte Maßnahmenliste"
    ]
  },
  {
    id: "data-mesh-organisation",
    domain: "general_mgmt",
    title: "Data Mesh Organisation",
    short: "Aufbau einer Data-Mesh-Organisation mit klaren Verantwortungen in Domänen und Governance auf Unternehmensebene.",
    portfolio_area: "solutions",
    solution_cluster: "orientation_prioritization",
    priority: "green",
    tags: {
      intent: ["scale"],
      data_scope: "enterprise_wide",
      complexity: "l",
      maturity_hint: "scale",
      tech_hint: ["governance", "dwh"]
    },
    outputs: [
      "Organisationsmodell für Data Mesh",
      "Rollen- und Verantwortungsmodell",
      "Einführungsplan je Domäne"
    ]
  },
  {
    id: "data-catalog",
    slug: "data-catalog",
    domain: "general_mgmt",
    title: "Data Catalog",
    short: "Einführung eines Data Catalogs für Transparenz über Datenobjekte, Verantwortliche und Definitionen.",
    portfolio_area: "solutions",
    solution_cluster: "orientation_prioritization",
    priority: "green",
    tags: {
      intent: ["transparency", "compliance"],
      data_scope: "enterprise_wide",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["governance"]
    },
    outputs: [
      "Strukturierter Data Catalog",
      "Business Glossar mit Kernbegriffen",
      "Data-Owner-Zuordnung"
    ],
    details: {
      problem: "Begriffe, Datenobjekte und Verantwortlichkeiten sind verteilt oder uneinheitlich dokumentiert.",
      typicalResult: "Ein zentraler, gepflegter Katalog mit klaren Definitionen und eindeutigen Verantwortlichkeiten.",
      typicalDeliverables: ["KPI & Daten-Glossar Sprint", "Datenquellen- & Integrationsanalyse"],
      bestFor: ["Führungsteams mit Governance-Fokus", "Fachbereiche mit Abstimmungsbedarf", "Organisationen mit Compliance-Anforderungen"]
    }
  },
  {
    id: "data-ai-leadership",
    domain: "general_mgmt",
    title: "Data & AI Leadership",
    short: "Stärkung von Führung, Entscheidungsstrukturen und Steuerung für daten- und KI-getriebene Transformation.",
    portfolio_area: "solutions",
    solution_cluster: "orientation_prioritization",
    priority: "green",
    tags: {
      intent: ["scale"],
      data_scope: "enterprise_wide",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["governance", "ai"]
    },
    outputs: [
      "Leadership-Leitbild für Data & AI",
      "Steuerungscadence mit KPIs",
      "Entscheidungs- und Eskalationsmodell"
    ]
  },
  {
    id: "management-dashboard",
    slug: "management-dashboard",
    domain: "general_mgmt",
    title: "Management Dashboard",
    short: "Zentrale Übersicht aller wichtigen Kennzahlen für die Geschäftsführung. Schnelle Entscheidungen basierend auf aktuellen Daten.",
    portfolio_area: "solutions",
    solution_cluster: "insights_general_mgmt",
    priority: "green",
    tags: {
      intent: ["transparency"],
      data_scope: "enterprise_wide",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["bi"]
    },
    outputs: [
      "Interaktives Management-Dashboard mit allen KPIs",
      "Automatisierte Datenaktualisierung (täglich/wöchentlich)",
      "PDF-Export für Präsentationen"
    ],
    details: {
      problem: "Management-Entscheidungen basieren auf verstreuten Reports und verspäteten Kennzahlen.",
      typicalResult: "Ein zentrales Steuerungsdashboard mit konsistenten KPIs und schneller Entscheidungsgrundlage.",
      typicalDeliverables: ["BI Fix & Fertig Setup", "KPI Definition Workshop", "Erster Management-Bericht"],
      bestFor: ["Geschäftsführung", "Bereichsleitungen", "Organisationen mit mehreren Steuerungsbereichen"]
    }
  },
  {
    id: "bereichs-reports",
    domain: "general_mgmt",
    title: "Bereichs-Reports",
    short: "Einheitliche Berichte für alle Abteilungen. Konsistente Datenbasis und vergleichbare Kennzahlen.",
    tags: {
      intent: ["transparency"],
      data_scope: "multi_source",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["bi"]
    },
    outputs: [
      "Standardisierte Report-Vorlagen für alle Bereiche",
      "Zentrale Datenquelle für konsistente Berichte",
      "Automatisierte Verteilung an Verantwortliche"
    ]
  },
  {
    id: "alarm-system",
    domain: "general_mgmt",
    title: "Frühwarnsystem",
    short: "Früherkennung kritischer KPI-Abweichungen mit automatischen Warnungen für Management und Fachbereiche.",
    portfolio_area: "solutions",
    solution_cluster: "insights_general_mgmt",
    priority: "green",
    tags: {
      intent: ["automation", "transparency"],
      data_scope: "multi_source",
      complexity: "s",
      maturity_hint: "stabilize",
      tech_hint: ["bi", "integration"]
    },
    outputs: [
      "Konfigurierbare Schwellenwerte für Alarme",
      "E-Mail- und App-Benachrichtigungen",
      "Dashboard mit aktuellen Alarmen"
    ]
  },
  {
    id: "governance-schulungen",
    domain: "general_mgmt",
    title: "Governance Schulungen",
    short: "Schulungen für den verantwortungsvollen Umgang mit Daten. Sicherstellung von Qualität und Compliance.",
    tags: {
      intent: ["compliance"],
      data_scope: "enterprise_wide",
      complexity: "xs",
      maturity_hint: "start",
      tech_hint: ["governance"]
    },
    outputs: [
      "Schulungsunterlagen zu Datenqualität und -sicherheit",
      "Praktische Übungen und Best Practices",
      "Zertifikat für Teilnehmer"
    ]
  },
  {
    id: "change-begleitung",
    domain: "general_mgmt",
    title: "Change-Begleitung",
    short: "Professionelle Unterstützung bei der Einführung neuer Datenprozesse. Geringere Widerstände, höhere Akzeptanz.",
    tags: {
      intent: ["scale"],
      data_scope: "enterprise_wide",
      complexity: "l",
      maturity_hint: "scale",
      tech_hint: ["governance"]
    },
    outputs: [
      "Change-Management-Plan für Datenprojekte",
      "Schulungen und Workshops für betroffene Teams",
      "Begleitung während der Einführungsphase"
    ]
  },
  {
    id: "datenstrategie-erstellung",
    domain: "general_mgmt",
    title: "Datenstrategie Erstellung",
    short: "Datenstrategie mit stärkerem Fokus auf initiale Dokumentation und strategische Grundsatzarbeit.",
    tags: {
      intent: ["scale"],
      data_scope: "enterprise_wide",
      complexity: "l",
      maturity_hint: "start",
      tech_hint: ["governance"]
    },
    outputs: [
      "Dokumentierte Datenstrategie mit Zielen und Maßnahmen",
      "Roadmap für die Umsetzung",
      "Empfehlungen für Technologie und Prozesse"
    ]
  },
  {
    id: "data-mesh-einfuehrung",
    domain: "general_mgmt",
    title: "Data Mesh Einführung",
    short: "Einführung einer dezentralen Datenarchitektur. Datenverantwortung liegt bei den Fachbereichen.",
    tags: {
      intent: ["scale"],
      data_scope: "enterprise_wide",
      complexity: "l",
      maturity_hint: "start",
      tech_hint: ["governance", "dwh"]
    },
    outputs: [
      "Konzept für Data Mesh Architektur",
      "Pilot-Implementierung in einem Bereich",
      "Leitfaden für die Skalierung"
    ]
  },
  {
    id: "data-mesh-skalierung",
    domain: "general_mgmt",
    title: "Data Mesh Skalierung",
    short: "Ausweitung der Data Mesh Architektur auf das gesamte Unternehmen. Konsistente Standards und Prozesse.",
    tags: {
      intent: ["scale"],
      data_scope: "enterprise_wide",
      complexity: "l",
      maturity_hint: "scale",
      tech_hint: ["governance", "dwh", "integration"]
    },
    outputs: [
      "Skalierungsplan für alle Bereiche",
      "Zentrale Governance-Struktur",
      "Schulungen für Data Product Owner"
    ]
  },

  // IT & Data
  {
    id: "dwh",
    domain: "it_data",
    title: "DWH",
    short: "Konzeption und Umsetzung eines Data Warehouses als verlässliche Grundlage für Reporting und Analytics.",
    portfolio_area: "solutions",
    solution_cluster: "data_mgmt_architecture",
    priority: "green",
    tags: {
      intent: ["scale", "transparency"],
      data_scope: "enterprise_wide",
      complexity: "l",
      maturity_hint: "start",
      tech_hint: ["dwh", "integration"]
    },
    outputs: [
      "DWH-Architektur und Datenmodell",
      "Angebundene Kernquellen",
      "Betriebsfähige Datenpipelines"
    ]
  },
  {
    id: "data-lake",
    domain: "it_data",
    title: "Data Lake",
    short: "Aufbau eines Data Lakes für flexible Speicherung und Verarbeitung strukturierter und unstrukturierter Daten.",
    portfolio_area: "solutions",
    solution_cluster: "data_mgmt_architecture",
    priority: "green",
    tags: {
      intent: ["scale"],
      data_scope: "enterprise_wide",
      complexity: "l",
      maturity_hint: "start",
      tech_hint: ["dwh", "integration"]
    },
    outputs: [
      "Data-Lake-Zielarchitektur",
      "Ingestion- und Governance-Konzept",
      "Pilotanbindungen kritischer Quellen"
    ]
  },
  {
    id: "enterprise-architecture-management",
    domain: "it_data",
    title: "Enterprise Architecture Management",
    short: "Etablierung eines EAM-Rahmens zur Ausrichtung von Daten-, Applikations- und Technologiearchitektur.",
    portfolio_area: "solutions",
    solution_cluster: "data_mgmt_architecture",
    priority: "green",
    tags: {
      intent: ["scale", "compliance"],
      data_scope: "enterprise_wide",
      complexity: "l",
      maturity_hint: "stabilize",
      tech_hint: ["governance", "integration"]
    },
    outputs: [
      "Architekturprinzipien und Zielbild",
      "Capability- und Systemlandkarte",
      "Roadmap für Architekturmaßnahmen"
    ]
  },
  {
    id: "ai-architektur-infrastruktur",
    domain: "it_data",
    title: "AI Architektur & Infrastruktur",
    short: "Aufbau einer tragfähigen AI-Architektur inklusive Daten-, Modell- und Betriebsinfrastruktur.",
    portfolio_area: "solutions",
    solution_cluster: "data_mgmt_architecture",
    priority: "green",
    tags: {
      intent: ["scale"],
      data_scope: "enterprise_wide",
      complexity: "l",
      maturity_hint: "start",
      tech_hint: ["ai", "dwh", "integration"]
    },
    outputs: [
      "AI-Referenzarchitektur",
      "Betriebsmodell für Modelle",
      "Implementierungsfahrplan"
    ]
  },
  {
    id: "souveraene-ki-infrastruktur",
    domain: "it_data",
    title: "Souveräne KI Infrastruktur",
    short: "Konzeption einer souveränen KI-Infrastruktur mit Fokus auf Kontrolle, Sicherheit und regulatorische Anforderungen.",
    portfolio_area: "solutions",
    solution_cluster: "data_mgmt_architecture",
    priority: "green",
    tags: {
      intent: ["compliance", "scale"],
      data_scope: "enterprise_wide",
      complexity: "l",
      maturity_hint: "stabilize",
      tech_hint: ["ai", "governance"]
    },
    outputs: [
      "Sicherheits- und Betriebskonzept",
      "Architektur für souveräne KI",
      "Risiko- und Maßnahmenkatalog"
    ]
  },
  {
    id: "souveraene-datenarchitektur",
    domain: "it_data",
    title: "Souveräne Datenarchitektur",
    short: "Aufbau einer souveränen Datenarchitektur für kontrollierte Datenhaltung, Zugriff und Verarbeitung.",
    portfolio_area: "solutions",
    solution_cluster: "data_mgmt_architecture",
    priority: "green",
    tags: {
      intent: ["compliance", "scale"],
      data_scope: "enterprise_wide",
      complexity: "l",
      maturity_hint: "stabilize",
      tech_hint: ["governance", "dwh"]
    },
    outputs: [
      "Architekturprinzipien für Datensouveränität",
      "Datenzugriffs- und Schutzkonzept",
      "Umsetzungsroadmap"
    ]
  },
  {
    id: "dataops",
    domain: "it_data",
    title: "DataOps",
    short: "Einführung von DataOps-Prozessen für schnellere, stabilere und nachvollziehbare Datenbereitstellung.",
    portfolio_area: "solutions",
    solution_cluster: "data_mgmt_architecture",
    priority: "green",
    tags: {
      intent: ["automation", "scale"],
      data_scope: "multi_source",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["integration", "governance"]
    },
    outputs: [
      "DataOps-Prozessmodell",
      "Qualitäts- und Release-Gates",
      "Monitoring- und Incident-Ablauf"
    ]
  },
  {
    id: "wartung-support",
    domain: "it_data",
    title: "Wartung & Support",
    short: "Strukturierter Betrieb mit Wartung und Support für stabile Datenplattformen und BI-Lösungen.",
    portfolio_area: "solutions",
    solution_cluster: "data_mgmt_architecture",
    priority: "green",
    tags: {
      intent: ["automation", "scale"],
      data_scope: "enterprise_wide",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["integration", "governance"]
    },
    outputs: [
      "Support- und Wartungsmodell",
      "SLA-/SLO-Definition",
      "Runbooks für kritische Abläufe"
    ]
  },
  {
    id: "master-data-management",
    domain: "it_data",
    title: "Master Data Management",
    short: "Einführung von MDM zur Sicherstellung konsistenter, verlässlicher Stamm- und Referenzdaten.",
    portfolio_area: "solutions",
    solution_cluster: "data_mgmt_architecture",
    priority: "green",
    tags: {
      intent: ["compliance", "transparency"],
      data_scope: "enterprise_wide",
      complexity: "l",
      maturity_hint: "stabilize",
      tech_hint: ["governance", "integration"]
    },
    outputs: [
      "MDM-Zielbild und Domänenmodell",
      "Governance für Stammdaten",
      "Einführungsplan mit Prioritäten"
    ]
  },
  {
    id: "setup-data-infrastructure",
    domain: "it_data",
    title: "Setup Data Infrastructure",
    short: "Initiales Plattform-Setup und technische Inbetriebnahme der Dateninfrastruktur.",
    tags: {
      intent: ["scale"],
      data_scope: "multi_source",
      complexity: "l",
      maturity_hint: "start",
      tech_hint: ["dwh", "integration"]
    },
    outputs: [
      "Installierte und konfigurierte Dateninfrastruktur",
      "Anbindung an wichtige Datenquellen",
      "Dokumentation und Schulung für Administratoren"
    ]
  },
  {
    id: "setup-bi",
    domain: "it_data",
    title: "Setup BI",
    short: "Komplettes Business Intelligence Setup mit Dashboards und erster Datenanbindung. Sofort einsatzbereit.",
    portfolio_area: "solutions",
    solution_cluster: "data_mgmt_architecture",
    priority: "green",
    tags: {
      intent: ["transparency"],
      data_scope: "multi_source",
      complexity: "m",
      maturity_hint: "start",
      tech_hint: ["bi"]
    },
    outputs: [
      "Installiertes und konfiguriertes BI-System",
      "Anbindung an 1-3 Datenquellen",
      "3-5 Basis-Dashboards nach Ihren Anforderungen"
    ]
  },
  {
    id: "helpdesk-automation",
    domain: "it_data",
    title: "Intelligentes Ticket-Routing",
    short: "Automatische Priorisierung und Verteilung von Tickets auf passende Teams.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_it_ops",
    priority: "green",
    tags: {
      intent: ["automation"],
      data_scope: "single_source",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["integration", "ai"]
    },
    outputs: [
      "Automatisierte Ticket-Kategorisierung",
      "Workflow-Automatisierung für Standardfälle",
      "Dashboard für Helpdesk-Metriken"
    ]
  },
  {
    id: "anomaly-detection",
    domain: "it_data",
    title: "Anomaly Detection",
    short: "Automatische Erkennung von Anomalien in Daten. Früherkennung von Problemen und Betrug.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_cross_domain",
    priority: "green",
    tags: {
      intent: ["insights", "automation"],
      data_scope: "multi_source",
      complexity: "l",
      maturity_hint: "scale",
      tech_hint: ["ai", "bi"]
    },
    outputs: [
      "ML-Modell für Anomalie-Erkennung",
      "Dashboard mit erkannten Anomalien",
      "Automatische Benachrichtigungen bei Auffälligkeiten"
    ]
  },
  {
    id: "api-management",
    domain: "it_data",
    title: "API-Management",
    short: "Zentrale Verwaltung aller APIs. Sicherer und kontrollierter Datenzugriff.",
    tags: {
      intent: ["scale"],
      data_scope: "multi_source",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["integration", "governance"]
    },
    outputs: [
      "API-Gateway mit Authentifizierung",
      "Dokumentation aller verfügbaren APIs",
      "Monitoring und Logging-System"
    ]
  },
  {
    id: "data-warehouse-implementierung",
    domain: "it_data",
    title: "Data Warehouse Implementierung",
    short: "Technische DWH-Implementierung inkl. ETL und operativer Datenbereitstellung.",
    tags: {
      intent: ["scale"],
      data_scope: "enterprise_wide",
      complexity: "l",
      maturity_hint: "start",
      tech_hint: ["dwh", "integration"]
    },
    outputs: [
      "Implementiertes Data Warehouse",
      "ETL-Prozesse für regelmäßige Datenaktualisierung",
      "Datenmodell für Kernbereiche"
    ]
  },
  {
    id: "adf-aufsetzen",
    domain: "it_data",
    title: "ADF Aufsetzen",
    short: "Einrichtung von Azure Data Factory für Datenintegration. Automatisierte Datenflüsse zwischen Systemen.",
    tags: {
      intent: ["automation", "scale"],
      data_scope: "multi_source",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["integration", "dwh"]
    },
    outputs: [
      "Konfigurierte Azure Data Factory",
      "Erste Datenpipelines für wichtige Quellen",
      "Monitoring und Fehlerbehandlung"
    ]
  },

  // Finance
  {
    id: "excel-to-bi-migration",
    domain: "finance",
    title: "Excel to BI Migration",
    short: "Umstellung von Excel-Berichten auf moderne BI-Lösungen. Weniger Fehler, mehr Automatisierung.",
    tags: {
      intent: ["automation", "transparency"],
      data_scope: "multi_source",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["bi"]
    },
    outputs: [
      "Migrierte Berichte in BI-System",
      "Automatisierte Datenaktualisierung",
      "Schulung für Finanzteam"
    ]
  },
  {
    id: "financial-forecasting",
    domain: "finance",
    title: "KI-basierte Cash-Flow-Prognose",
    short: "KI-gestützte Prognose von Ein- und Auszahlungen für belastbare Liquiditätsplanung und Frühwarnung.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_finance",
    priority: "green",
    tags: {
      intent: ["insights", "automation"],
      data_scope: "multi_source",
      complexity: "l",
      maturity_hint: "scale",
      tech_hint: ["ai", "bi"]
    },
    outputs: [
      "Forecasting-Modell für Finanzergebnisse",
      "Dashboard mit Prognosen und Szenarien",
      "Automatisierte Aktualisierung der Vorhersagen"
    ]
  },
  {
    id: "controlling-via-bi",
    slug: "controlling-via-bi",
    domain: "finance",
    title: "Controlling via BI",
    short: "Moderne Controlling-Berichte in BI. Echtzeit-Übersicht über Kosten, Budgets und Abweichungen.",
    portfolio_area: "solutions",
    solution_cluster: "insights_finance",
    priority: "green",
    tags: {
      intent: ["transparency"],
      data_scope: "multi_source",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["bi"]
    },
    outputs: [
      "Controlling-Dashboard mit allen Kennzahlen",
      "Budget- vs. Ist-Vergleiche",
      "Automatisierte Abweichungsanalysen"
    ],
    details: {
      problem: "Controlling benötigt zu viel manuelle Aufbereitung und liefert keine aktuelle Sicht auf Abweichungen.",
      typicalResult: "Transparente BI-Controlling-Sicht mit automatisierten Budget-Ist-Vergleichen.",
      typicalDeliverables: ["KPI Definition Workshop", "Reporting-Struktur (Templates & Standards)", "Erster Management-Bericht"],
      bestFor: ["Finance-Teams", "Controlling-Leitung", "Unternehmen mit mehreren Kostenstellen"]
    }
  },
  {
    id: "financial-planning",
    domain: "finance",
    title: "Financial Planning",
    short: "Unterstützung bei der Finanzplanung mit Datenanalysen. Realistischere Prognosen und bessere Entscheidungen.",
    tags: {
      intent: ["insights"],
      data_scope: "multi_source",
      complexity: "l",
      maturity_hint: "scale",
      tech_hint: ["bi", "ai"]
    },
    outputs: [
      "Planungsmodelle basierend auf historischen Daten",
      "Szenario-Analysen für verschiedene Planungsvarianten",
      "Dashboard für Plan-Ist-Vergleiche"
    ]
  },

  // Sales & Marketing
  {
    id: "sales-dashboard",
    slug: "sales-dashboard",
    domain: "sales_marketing",
    title: "Sales Dashboard",
    short: "Echtzeit-Übersicht über Verkäufe, Pipeline und Performance. Schnelle Entscheidungen basierend auf aktuellen Daten.",
    portfolio_area: "solutions",
    solution_cluster: "insights_sales_marketing",
    priority: "green",
    tags: {
      intent: ["transparency"],
      data_scope: "single_source",
      complexity: "s",
      maturity_hint: "start",
      tech_hint: ["bi"]
    },
    outputs: [
      "Interaktives Sales-Dashboard",
      "Pipeline-Übersicht mit Wahrscheinlichkeiten",
      "Automatisierte Aktualisierung aus CRM"
    ],
    details: {
      problem: "Vertrieb und Management haben keine einheitliche, aktuelle Sicht auf Pipeline und Performance.",
      typicalResult: "Ein Sales-Dashboard mit klaren KPIs, Pipeline-Transparenz und automatischen Updates.",
      typicalDeliverables: ["BI Fix & Fertig Setup", "KPI Definition Workshop", "KPI & Daten-Glossar Sprint"],
      bestFor: ["Sales-Leitung", "Vertriebsteams", "Unternehmen mit CRM-basierter Pipeline-Steuerung"]
    }
  },
  {
    id: "sales-reporting",
    domain: "sales_marketing",
    title: "Sales Reporting",
    short: "Automatisierte Sales-Reports für Management und Vertrieb. Konsistente Datenbasis, weniger manuelle Arbeit.",
    tags: {
      intent: ["automation", "transparency"],
      data_scope: "single_source",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["bi"]
    },
    outputs: [
      "Standardisierte Sales-Reports",
      "Automatisierte Verteilung an Verantwortliche",
      "Vergleichsanalysen (Monat, Quartal, Jahr)"
    ]
  },
  {
    id: "sales-forecast",
    domain: "sales_marketing",
    title: "Sales Forecast",
    short: "Vorhersage von Verkaufsergebnissen mit KI. Realistischere Prognosen für Planung und Budgetierung.",
    portfolio_area: "solutions",
    solution_cluster: "insights_sales_marketing",
    priority: "green",
    tags: {
      intent: ["insights"],
      data_scope: "single_source",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["ai", "bi"]
    },
    outputs: [
      "Forecasting-Modell für Verkäufe",
      "Dashboard mit Prognosen und Konfidenzintervallen",
      "Automatisierte Aktualisierung basierend auf Pipeline"
    ]
  },
  {
    id: "potentialanalyse",
    domain: "sales_marketing",
    title: "Potentialanalyse",
    short: "Identifikation von Verkaufspotenzialen mit Datenanalysen. Fokus auf die vielversprechendsten Kunden und Märkte.",
    tags: {
      intent: ["insights"],
      data_scope: "multi_source",
      complexity: "m",
      maturity_hint: "scale",
      tech_hint: ["ai", "bi"]
    },
    outputs: [
      "Analyse-Modell für Verkaufspotenziale",
      "Dashboard mit identifizierten Chancen",
      "Priorisierte Liste für Vertriebsteam"
    ]
  },
  {
    id: "churn-prevention-algo",
    domain: "sales_marketing",
    title: "Churn Prevention Algo",
    short: "Früherkennung von Kunden mit Abwanderungsrisiko. Rechtzeitige Maßnahmen zur Kundenbindung.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_sales_marketing",
    priority: "green",
    tags: {
      intent: ["insights", "automation"],
      data_scope: "multi_source",
      complexity: "l",
      maturity_hint: "scale",
      tech_hint: ["ai", "bi"]
    },
    outputs: [
      "ML-Modell zur Churn-Vorhersage",
      "Dashboard mit Risiko-Kunden",
      "Automatische Benachrichtigungen bei hohem Risiko"
    ]
  },
  {
    id: "data-driven-marketing",
    domain: "sales_marketing",
    title: "Data Driven Marketing Dashboard",
    short: "Zentrale Marketing-Steuerung über kanalübergreifende Performance-, Budget- und Conversion-Kennzahlen.",
    portfolio_area: "solutions",
    solution_cluster: "insights_sales_marketing",
    priority: "green",
    tags: {
      intent: ["insights"],
      data_scope: "multi_source",
      complexity: "m",
      maturity_hint: "scale",
      tech_hint: ["ai", "bi"]
    },
    outputs: [
      "Analyse-Tools für Marketing-Performance",
      "Segmentierungsmodelle für Zielgruppen",
      "Dashboard für Kampagnen-Erfolg"
    ]
  },
  {
    id: "automatisierung-customer-success",
    domain: "sales_marketing",
    title: "Customer Support Automatisierung",
    short: "Automatisierte Service- und Supportprozesse für schnellere Reaktionszeiten und konsistente Kundenkommunikation.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_sales_marketing",
    priority: "green",
    tags: {
      intent: ["automation"],
      data_scope: "single_source",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["integration", "ai"]
    },
    outputs: [
      "Automatisierte Workflows für Customer Success",
      "Dashboard mit Kunden-Gesundheits-Score",
      "Automatische Benachrichtigungen bei Auffälligkeiten"
    ]
  },

  // Procurement
  {
    id: "einkaufs-forecast",
    domain: "procurement",
    title: "Bestellzeitpunkt-Forecast",
    short: "Vorhersage optimaler Bestellzeitpunkte auf Basis von Verbrauch, Lieferzeit und Bestandsentwicklung.",
    portfolio_area: "solutions",
    solution_cluster: "insights_procurement",
    priority: "green",
    tags: {
      intent: ["insights"],
      data_scope: "multi_source",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["ai", "bi"]
    },
    outputs: [
      "Forecasting-Modell für Einkaufsbedarfe",
      "Dashboard mit Prognosen und Bestellvorschlägen",
      "Automatisierte Aktualisierung basierend auf Verbrauch"
    ]
  },
  {
    id: "best-price-purchase",
    domain: "procurement",
    title: "Preisentwicklungsanalyse",
    short: "Analyse von Preisverläufen und Beschaffungskosten zur frühzeitigen Erkennung von Kostenrisiken.",
    portfolio_area: "solutions",
    solution_cluster: "insights_procurement",
    priority: "green",
    tags: {
      intent: ["insights", "automation"],
      data_scope: "multi_source",
      complexity: "m",
      maturity_hint: "scale",
      tech_hint: ["ai", "bi"]
    },
    outputs: [
      "Analyse-Tool für Lieferanten-Preise",
      "Dashboard mit Preisvergleichen",
      "Automatische Empfehlungen für Bestellungen"
    ]
  },
  {
    id: "bedarfsanalyse",
    domain: "procurement",
    title: "Bedarfsanalyse",
    short: "Systematische Analyse von Einkaufsbedarfen. Identifikation von Einsparpotenzialen und Optimierungen.",
    tags: {
      intent: ["insights"],
      data_scope: "multi_source",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["bi"]
    },
    outputs: [
      "Analyse-Dashboard für Einkaufsbedarfe",
      "Identifikation von Einsparpotenzialen",
      "Empfehlungen für Bestelloptimierung"
    ]
  },
  {
    id: "automatisierung-bestelldaten",
    domain: "procurement",
    title: "Bestelleingangsbearbeitung",
    short: "Automatisierte Erfassung und Validierung eingehender Bestellungen zur Reduktion manueller Aufwände.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_procurement",
    priority: "green",
    tags: {
      intent: ["automation"],
      data_scope: "single_source",
      complexity: "s",
      maturity_hint: "stabilize",
      tech_hint: ["integration"]
    },
    outputs: [
      "Automatisierte Erfassung von Bestelldaten",
      "Integration mit Einkaufssystemen",
      "Dashboard für Bestellübersicht"
    ]
  },

  // Production
  {
    id: "produktionsplanung",
    domain: "production",
    title: "Produktionsplanung",
    short: "Optimierte Produktionsplanung basierend auf Datenanalysen. Höhere Auslastung, weniger Stillstände.",
    tags: {
      intent: ["insights", "automation"],
      data_scope: "multi_source",
      complexity: "l",
      maturity_hint: "scale",
      tech_hint: ["ai", "bi"]
    },
    outputs: [
      "Optimierungsmodell für Produktionsplanung",
      "Dashboard mit aktueller Auslastung",
      "Automatische Planungsvorschläge"
    ]
  },
  {
    id: "digital-twin",
    domain: "production",
    title: "Digital Twin",
    short: "Digitaler Zwilling Ihrer Produktionsanlagen. Simulation und Optimierung vor der Umsetzung.",
    tags: {
      intent: ["insights", "scale"],
      data_scope: "multi_source",
      complexity: "l",
      maturity_hint: "scale",
      tech_hint: ["ai", "integration"]
    },
    outputs: [
      "Digitales Modell der Produktionsanlagen",
      "Simulations-Tool für Szenarien",
      "Dashboard mit Echtzeit-Daten und Prognosen"
    ]
  },
  {
    id: "predictive-maintenance",
    domain: "production",
    title: "Predictive Maintenance",
    short: "Vorhersage von Wartungsbedarfen mit KI. Wartung genau dann, wenn nötig – nicht zu früh, nicht zu spät.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_production_logistics",
    priority: "green",
    tags: {
      intent: ["insights", "automation"],
      data_scope: "multi_source",
      complexity: "l",
      maturity_hint: "scale",
      tech_hint: ["ai", "bi"]
    },
    outputs: [
      "ML-Modell für Wartungsvorhersage",
      "Dashboard mit Wartungsempfehlungen",
      "Automatische Benachrichtigungen bei Bedarf"
    ]
  },
  {
    id: "quality-assurance-ai",
    domain: "production",
    title: "Ausschuss- und Qualitätscontrolling",
    short: "KI-gestützte Qualitätsautomatisierung mit Fokus auf Ausschussreduktion im Produktionsablauf.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_production_logistics",
    priority: "green",
    tags: {
      intent: ["automation", "insights"],
      data_scope: "single_source",
      complexity: "l",
      maturity_hint: "scale",
      tech_hint: ["ai"]
    },
    outputs: [
      "KI-Modell für Qualitätsprüfung",
      "Dashboard mit Qualitätsmetriken",
      "Automatische Alarme bei Qualitätsproblemen"
    ]
  },

  // Logistics
  {
    id: "lagerbestandsverwaltung",
    domain: "logistics",
    title: "Digitale Lagerplatzverwaltung",
    short: "Digitale Transparenz über Lagerplätze, Bestände und Bewegungen für eine effizientere Flächensteuerung.",
    portfolio_area: "solutions",
    solution_cluster: "insights_production_logistics",
    priority: "green",
    tags: {
      intent: ["transparency"],
      data_scope: "single_source",
      complexity: "s",
      maturity_hint: "stabilize",
      tech_hint: ["bi"]
    },
    outputs: [
      "Dashboard mit aktuellen Lagerbeständen",
      "Automatische Bestellvorschläge",
      "Warnungen bei niedrigen Beständen"
    ]
  },
  {
    id: "lageroptimierung",
    domain: "logistics",
    title: "Lagerplatzoptimierung",
    short: "Datenbasierte Optimierung von Lagerzonen und Wegeführung zur Reduktion von Such- und Greifzeiten.",
    portfolio_area: "solutions",
    solution_cluster: "insights_production_logistics",
    priority: "green",
    tags: {
      intent: ["insights"],
      data_scope: "multi_source",
      complexity: "m",
      maturity_hint: "scale",
      tech_hint: ["ai", "bi"]
    },
    outputs: [
      "Optimierungsmodell für Lagerstruktur",
      "Dashboard mit Lager-Metriken",
      "Empfehlungen für Prozessverbesserungen"
    ]
  },
  {
    id: "tourenplanung-automatisiert",
    domain: "logistics",
    title: "KI-Routenoptimierung",
    short: "KI-basierte Optimierung von Touren in Echtzeit zur Senkung von Transportkosten und Verspätungen.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_production_logistics",
    priority: "green",
    tags: {
      intent: ["automation", "insights"],
      data_scope: "multi_source",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["ai", "integration"]
    },
    outputs: [
      "Optimierungsmodell für Tourenplanung",
      "Dashboard mit geplanten Routen",
      "Automatische Anpassung bei Änderungen"
    ]
  },

  // HR
  {
    id: "personal-controlling",
    domain: "hr",
    title: "Personal-Controlling",
    short: "Übersicht über Personalkosten, Auslastung und Performance. Datenbasierte Entscheidungen im HR-Bereich.",
    tags: {
      intent: ["transparency"],
      data_scope: "multi_source",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["bi"]
    },
    outputs: [
      "Dashboard mit Personalkennzahlen",
      "Kostenanalysen nach Abteilungen",
      "Automatisierte Reports für Management"
    ]
  },
  {
    id: "strategische-personalplanung",
    domain: "hr",
    title: "Strategische Personalplanung",
    short: "Langfristige Personalplanung basierend auf Datenanalysen. Rechtzeitige Reaktion auf Bedarfsänderungen.",
    tags: {
      intent: ["insights"],
      data_scope: "multi_source",
      complexity: "l",
      maturity_hint: "scale",
      tech_hint: ["ai", "bi"]
    },
    outputs: [
      "Planungsmodell für Personalbedarf",
      "Dashboard mit Prognosen und Szenarien",
      "Empfehlungen für Personalentwicklung"
    ]
  },
  {
    id: "operative-personaleinsatzplanung",
    domain: "hr",
    title: "Operative Personaleinsatzplanung",
    short: "Optimierte Schicht- und Einsatzplanung. Höhere Auslastung, zufriedenere Mitarbeiter.",
    tags: {
      intent: ["automation", "insights"],
      data_scope: "single_source",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["ai", "bi"]
    },
    outputs: [
      "Optimierungsmodell für Einsatzplanung",
      "Dashboard mit aktuellen Plänen",
      "Automatische Vorschläge für Schichtpläne"
    ]
  },

  // Research & Development
  {
    id: "simulierung-experimente",
    domain: "rnd",
    title: "Simulierung von Experimenten",
    short: "Virtuelle Durchführung von Experimenten vor der Realität. Schnellere Entwicklung, weniger Kosten.",
    tags: {
      intent: ["insights", "scale"],
      data_scope: "multi_source",
      complexity: "l",
      maturity_hint: "scale",
      tech_hint: ["ai"]
    },
    outputs: [
      "Simulationsmodell für Experimente",
      "Dashboard mit Simulationsergebnissen",
      "Empfehlungen für reale Experimente"
    ]
  },
  {
    id: "innovationsresearch",
    domain: "rnd",
    title: "Innovationsresearch",
    short: "Datenbasierte Identifikation von Innovationschancen. Fokus auf vielversprechende Technologien und Trends.",
    tags: {
      intent: ["insights"],
      data_scope: "multi_source",
      complexity: "l",
      maturity_hint: "scale",
      tech_hint: ["ai", "bi"]
    },
    outputs: [
      "Analyse-Tool für Innovationschancen",
      "Dashboard mit identifizierten Trends",
      "Priorisierte Liste für Forschungsteam"
    ]
  },

  // Risk & Compliance
  {
    id: "nis2",
    domain: "risk_compliance",
    title: "NIS2",
    short: "Unterstützung bei der NIS2-Umsetzung mit strukturiertem Maßnahmenplan für Governance, Prozesse und Nachweisfähigkeit.",
    portfolio_area: "solutions",
    solution_cluster: "orientation_prioritization",
    priority: "green",
    tags: {
      intent: ["compliance"],
      data_scope: "enterprise_wide",
      complexity: "m",
      maturity_hint: "start",
      tech_hint: ["governance"]
    },
    outputs: [
      "NIS2-Gap-Analyse",
      "Maßnahmen- und Priorisierungsplan",
      "Nachweisfähige Dokumentationsstruktur"
    ]
  },
  {
    id: "dsgvo-dsb",
    domain: "risk_compliance",
    title: "DSGVO (+ DSB)",
    short: "Praxisnahe Umsetzung von DSGVO-Anforderungen inklusive Datenschutzorganisation und DSB-Einbindung.",
    portfolio_area: "solutions",
    solution_cluster: "orientation_prioritization",
    priority: "green",
    tags: {
      intent: ["compliance"],
      data_scope: "enterprise_wide",
      complexity: "m",
      maturity_hint: "start",
      tech_hint: ["governance"]
    },
    outputs: [
      "DSGVO-Umsetzungsfahrplan",
      "Rollenmodell inkl. DSB-Schnittstellen",
      "Verzeichnis- und Nachweiskonzept"
    ]
  },
  {
    id: "isms-isb-bestellung",
    domain: "risk_compliance",
    title: "ISMS & ISB Bestellung",
    short: "Aufbau eines ISMS-Rahmens inklusive Vorbereitung und Etablierung der ISB-Rolle im Unternehmen.",
    portfolio_area: "solutions",
    solution_cluster: "orientation_prioritization",
    priority: "green",
    tags: {
      intent: ["compliance", "scale"],
      data_scope: "enterprise_wide",
      complexity: "m",
      maturity_hint: "start",
      tech_hint: ["governance"]
    },
    outputs: [
      "ISMS-Grundstruktur und Leitlinien",
      "ISB-Rollen- und Verantwortungsmodell",
      "Umsetzungsplan für Governance-Prozesse"
    ]
  },
  {
    id: "iam",
    domain: "risk_compliance",
    title: "IAM",
    short: "Konzeption eines IAM-Zielbilds für rollenbasierten, sicheren und auditierbaren Zugriff auf Systeme und Daten.",
    portfolio_area: "solutions",
    solution_cluster: "orientation_prioritization",
    priority: "green",
    tags: {
      intent: ["compliance"],
      data_scope: "enterprise_wide",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["governance", "integration"]
    },
    outputs: [
      "IAM-Zielkonzept",
      "Rollen- und Rechtemodell",
      "Einführungs- und Migrationsplan"
    ]
  },
  {
    id: "data-governance-konzept",
    domain: "risk_compliance",
    title: "Data Governance Konzept",
    short: "Entwicklung eines Konzepts für den verantwortungsvollen Umgang mit Daten. Sicherstellung von Qualität und Compliance.",
    tags: {
      intent: ["compliance", "scale"],
      data_scope: "enterprise_wide",
      complexity: "l",
      maturity_hint: "start",
      tech_hint: ["governance"]
    },
    outputs: [
      "Dokumentiertes Data Governance Konzept",
      "Rollen und Verantwortlichkeiten",
      "Prozesse für Datenqualität und -sicherheit"
    ]
  },
  {
    id: "iam-konzept",
    domain: "risk_compliance",
    title: "IAM Konzept",
    short: "Konzept für Identity und Access Management. Sicherer und kontrollierter Zugriff auf Daten und Systeme.",
    tags: {
      intent: ["compliance"],
      data_scope: "enterprise_wide",
      complexity: "m",
      maturity_hint: "start",
      tech_hint: ["governance"]
    },
    outputs: [
      "Dokumentiertes IAM-Konzept",
      "Rollen- und Rechte-Modell",
      "Empfehlungen für technische Umsetzung"
    ]
  },
  {
    id: "umsetzung-rechte-rollenkonzepte",
    domain: "risk_compliance",
    title: "Umsetzung von Rechte- & Rollenkonzepten",
    short: "Technische Umsetzung von Zugriffsrechten und Rollen. Sicherer Datenzugriff nach dem Prinzip der geringsten Rechte.",
    tags: {
      intent: ["compliance"],
      data_scope: "enterprise_wide",
      complexity: "m",
      maturity_hint: "stabilize",
      tech_hint: ["governance", "integration"]
    },
    outputs: [
      "Implementiertes Rechte- und Rollensystem",
      "Zugriffskontrollen für alle Systeme",
      "Dokumentation und Schulung"
    ]
  },

  // Block 2: Insights & Analytics Fokus-Use-Cases
  {
    id: "liquiditaetsplanung-bi",
    domain: "finance",
    title: "Liquiditätsplanung mit BI",
    short: "Vorausschauende Steuerung von Zahlungsströmen und Liquiditätsengpässen auf Basis integrierter Finanzdaten.",
    portfolio_area: "solutions",
    solution_cluster: "insights_finance",
    priority: "green",
    tags: { intent: ["insights", "transparency"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["bi"] },
    outputs: ["Liquiditätsdashboard mit Forecast", "Cash-In/Cash-Out Transparenz", "Frühwarnindikatoren für Engpässe"]
  },
  {
    id: "budget-controlling",
    domain: "finance",
    title: "Budget-Controlling",
    short: "Transparente Steuerung von Budget, Ist-Kosten und Abweichungen über Bereiche und Zeiträume hinweg.",
    portfolio_area: "solutions",
    solution_cluster: "insights_finance",
    priority: "green",
    tags: { intent: ["transparency"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["bi"] },
    outputs: ["Budget-vs-Ist Cockpit", "Abweichungsanalyse je Kostenstelle", "Monatliche Steuerungsberichte"]
  },
  {
    id: "deckungsbeitragsrechnung",
    domain: "finance",
    title: "Deckungsbeitragsrechnung",
    short: "Analyse von Margen und Deckungsbeiträgen nach Produkten, Kunden und Segmenten für bessere Steuerungsentscheidungen.",
    portfolio_area: "solutions",
    solution_cluster: "insights_finance",
    priority: "green",
    tags: { intent: ["insights"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["bi"] },
    outputs: ["Deckungsbeitragsreport nach Dimension", "Margentransparenz je Segment", "Identifikation unprofitabler Bereiche"]
  },
  {
    id: "working-capital-analyse",
    domain: "finance",
    title: "Working Capital Analyse",
    short: "Analyse von Forderungen, Verbindlichkeiten und Vorräten zur gezielten Reduktion der Kapitalbindung.",
    portfolio_area: "solutions",
    solution_cluster: "insights_finance",
    priority: "green",
    tags: { intent: ["insights", "transparency"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["bi"] },
    outputs: ["Working-Capital-Cockpit", "Treiberanalyse je Kennzahl", "Maßnahmenliste zur Kapitalfreisetzung"]
  },
  {
    id: "kostenstruktur-gemeinkosten-monitoring",
    domain: "finance",
    title: "Kostenstruktur- und Gemeinkosten-Monitoring",
    short: "Kontinuierliches Monitoring von Fix-, Variabel- und Gemeinkosten zur frühzeitigen Erkennung von Kostentreibern.",
    portfolio_area: "solutions",
    solution_cluster: "insights_finance",
    priority: "green",
    tags: { intent: ["transparency", "insights"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["bi"] },
    outputs: ["Kostenstruktur-Dashboard", "Gemeinkosten-Entwicklungsanalyse", "Treiberbasierte Kostenwarnungen"]
  },
  {
    id: "investitionscontrolling-capex",
    domain: "finance",
    title: "Investitionscontrolling / CAPEX",
    short: "Steuerung von CAPEX-Projekten mit transparenter Budget-, Fortschritts- und Nutzenkontrolle.",
    portfolio_area: "solutions",
    solution_cluster: "insights_finance",
    priority: "green",
    tags: { intent: ["transparency", "insights"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["bi"] },
    outputs: ["CAPEX-Portfolioübersicht", "Budget- und Fortschrittskontrolle", "Soll-Ist-Nutzenbewertung"]
  },
  {
    id: "customer-lifetime-value",
    domain: "sales_marketing",
    title: "Customer Lifetime Value",
    short: "Berechnung und Visualisierung des Kundenwerts zur besseren Priorisierung von Vertriebs- und Marketingmaßnahmen.",
    portfolio_area: "solutions",
    solution_cluster: "insights_sales_marketing",
    priority: "green",
    tags: { intent: ["insights"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["bi", "ai"] },
    outputs: ["CLV-Modell je Kundensegment", "Wertbeitragsdashboard", "Priorisierte Kundenlisten"]
  },
  {
    id: "lead-scoring",
    domain: "sales_marketing",
    title: "Lead Scoring",
    short: "Bewertung eingehender Leads nach Abschlusswahrscheinlichkeit für effizientere Vertriebssteuerung.",
    portfolio_area: "solutions",
    solution_cluster: "insights_sales_marketing",
    priority: "green",
    tags: { intent: ["insights", "automation"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["ai", "bi"] },
    outputs: ["Lead-Score-Modell", "Priorisierte Lead-Pipeline", "Conversion-Treiberanalyse"]
  },
  {
    id: "sales-funnel-analyse",
    domain: "sales_marketing",
    title: "Sales Funnel Analyse",
    short: "Analyse von Funnel-Stufen und Conversion-Raten zur gezielten Optimierung von Vertrieb und Marketing.",
    portfolio_area: "solutions",
    solution_cluster: "insights_sales_marketing",
    priority: "green",
    tags: { intent: ["insights", "transparency"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["bi"] },
    outputs: ["Funnel-Dashboard mit Conversion-Stufen", "Drop-off-Analyse", "Optimierungsempfehlungen je Stufe"]
  },
  {
    id: "reklamations-analyse",
    domain: "sales_marketing",
    title: "Reklamations-Analyse",
    short: "Transparenz über Reklamationsursachen, Häufigkeiten und Kosten zur nachhaltigen Qualitätsverbesserung.",
    portfolio_area: "solutions",
    solution_cluster: "insights_sales_marketing",
    priority: "green",
    tags: { intent: ["insights", "transparency"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["bi"] },
    outputs: ["Reklamationscockpit nach Ursache", "Kosten- und Häufigkeitsanalyse", "Priorisierte Verbesserungsfelder"]
  },
  {
    id: "lieferantenscoring",
    domain: "procurement",
    title: "Lieferantenscoring",
    short: "Bewertung von Lieferanten nach Preis, Qualität und Lieferperformance für bessere Beschaffungsentscheidungen.",
    portfolio_area: "solutions",
    solution_cluster: "insights_procurement",
    priority: "green",
    tags: { intent: ["insights", "transparency"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["bi"] },
    outputs: ["Lieferantenranking mit Scorecards", "Performancevergleich nach Kriterien", "Risikohinweise je Lieferant"]
  },
  {
    id: "oee-analyse",
    domain: "production",
    title: "OEE-Analyse",
    short: "Auswertung von Verfügbarkeit, Leistung und Qualität zur transparenten Steuerung der Gesamtanlageneffektivität.",
    portfolio_area: "solutions",
    solution_cluster: "insights_production_logistics",
    priority: "green",
    tags: { intent: ["insights", "transparency"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["bi"] },
    outputs: ["OEE-Dashboard pro Anlage", "Verlustanalyse nach Ursache", "Priorisierte Verbesserungsmaßnahmen"]
  },
  {
    id: "durchlaufzeit-bottleneck-analyse",
    domain: "production",
    title: "Durchlaufzeit- und Bottleneck-Analyse",
    short: "Identifikation von Engpässen und Verzögerungen entlang der Prozesskette zur Steigerung des Materialflusses.",
    portfolio_area: "solutions",
    solution_cluster: "insights_production_logistics",
    priority: "green",
    tags: { intent: ["insights"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["bi", "integration"] },
    outputs: ["Durchlaufzeit-Analyse je Prozessschritt", "Bottleneck-Heatmap", "Maßnahmenplan zur Taktverbesserung"]
  },
  {
    id: "itsm-analytics",
    domain: "it_data",
    title: "ITSM Analytics",
    short: "Analyse von Tickets, SLA-Einhaltung und Servicequalität zur datenbasierten Steuerung des IT-Betriebs.",
    portfolio_area: "solutions",
    solution_cluster: "insights_it_ops",
    priority: "green",
    tags: { intent: ["insights", "transparency"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["bi", "integration"] },
    outputs: ["ITSM-Dashboard mit SLA-Metriken", "Ticket- und Ursachenanalyse", "Optimierungsvorschläge für Serviceprozesse"]
  },
  {
    id: "cloud-cost-observability",
    domain: "it_data",
    title: "Cloud-Cost-Observability",
    short: "Transparenz über Cloud-Kosten und Ressourcennutzung zur kontinuierlichen Kosten- und Effizienzoptimierung.",
    portfolio_area: "solutions",
    solution_cluster: "insights_it_ops",
    priority: "green",
    tags: { intent: ["transparency", "insights"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["bi", "integration"] },
    outputs: ["Cloud-Kosten-Dashboard", "Nutzungs- und Kostentreiberanalyse", "Optimierungspotenziale je Service"]
  },
  {
    id: "cybersicherheit-dashboard",
    domain: "it_data",
    title: "Cybersicherheit-Dashboard",
    short: "Zentrale Sicht auf Sicherheitslage, Vorfälle und Reaktionsfähigkeit für ein belastbares Security-Controlling.",
    portfolio_area: "solutions",
    solution_cluster: "insights_it_ops",
    priority: "green",
    tags: { intent: ["transparency", "compliance"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["bi", "governance"] },
    outputs: ["Security-Posture-Dashboard", "Incident- und Trendanalyse", "Management-Reporting für Sicherheitslage"]
  },
  {
    id: "prozesseffizienz-analyse",
    domain: "it_data",
    title: "Prozesseffizienz-Analyse",
    short: "Messung und Vergleich von Prozesslaufzeiten, Aufwänden und Qualitätskennzahlen zur gezielten Effizienzsteigerung.",
    portfolio_area: "solutions",
    solution_cluster: "insights_it_ops",
    priority: "green",
    tags: { intent: ["insights", "automation"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["bi", "integration"] },
    outputs: ["Prozessleistungs-Dashboard", "Engpass- und Aufwandstreiberanalyse", "Priorisierte Effizienzhebel"]
  },

  // Block 3: Automatisierung & KI Fokus-Use-Cases
  {
    id: "sales-chatbot-webseite",
    domain: "sales_marketing",
    title: "Sales-Chatbot Webseite",
    short: "Automatisierter Web-Chatbot zur Lead-Qualifizierung und Übergabe qualifizierter Anfragen an den Vertrieb.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_sales_marketing",
    priority: "green",
    tags: { intent: ["automation", "insights"], data_scope: "single_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["ai", "integration"] },
    outputs: ["Chatbot für Website-Dialoge", "Lead-Qualifizierung in Echtzeit", "CRM-Übergabe qualifizierter Kontakte"]
  },
  {
    id: "dynamic-pricing",
    domain: "sales_marketing",
    title: "Dynamic Pricing",
    short: "Dynamische Preissteuerung auf Basis von Nachfrage, Wettbewerb und Margenzielen.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_sales_marketing",
    priority: "green",
    tags: { intent: ["automation", "insights"], data_scope: "multi_source", complexity: "l", maturity_hint: "scale", tech_hint: ["ai", "bi"] },
    outputs: ["Regelwerk für Preissteuerung", "Preisempfehlungen nach Segment", "Monitoring der Margenwirkung"]
  },
  {
    id: "ausschreibungsautomatisierung",
    domain: "procurement",
    title: "Ausschreibungsautomatisierung",
    short: "Automatisierte Erstellung, Auswertung und Dokumentation von Ausschreibungen für schnellere Beschaffungszyklen.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_procurement",
    priority: "green",
    tags: { intent: ["automation"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["integration", "ai"] },
    outputs: ["Automatisierte Ausschreibungsabläufe", "Vergleichbare Angebotsauswertung", "Dokumentierte Vergabeentscheidungen"]
  },
  {
    id: "automatisierte-rechnungsverarbeitung",
    domain: "finance",
    title: "Automatisierte Rechnungsverarbeitung",
    short: "Automatische Extraktion, Prüfung und Verbuchung von Eingangsrechnungen zur Beschleunigung des Finanzprozesses.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_finance",
    priority: "green",
    tags: { intent: ["automation"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["ai", "integration"] },
    outputs: ["Automatisierte Rechnungsprüfung", "Workflow für Freigaben", "Transparenz über Bearbeitungsstatus"]
  },
  {
    id: "ai-helpdeskassistent",
    domain: "it_data",
    title: "AI-Helpdeskassistent",
    short: "KI-Assistenz im Agentenarbeitsplatz mit Lösungsvorschlägen für wiederkehrende IT-Anfragen.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_it_ops",
    priority: "green",
    tags: { intent: ["automation", "insights"], data_scope: "single_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["ai"] },
    outputs: ["Assistenz für Ticketantworten", "Vorschläge aus Wissensbasis", "Schnellere Erstlösungsquote"]
  },
  {
    id: "agentic-coding",
    domain: "it_data",
    title: "Agentic-Coding",
    short: "Einsatz autonomer Coding-Agents zur Beschleunigung von Entwicklungsaufgaben mit kontrollierten Qualitätsleitplanken.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_it_ops",
    priority: "green",
    tags: { intent: ["automation", "scale"], data_scope: "single_source", complexity: "l", maturity_hint: "scale", tech_hint: ["ai"] },
    outputs: ["Agenten-Workflows für Entwicklungsaufgaben", "Qualitäts- und Review-Leitplanken", "Messbares Delivery-Monitoring"]
  },
  {
    id: "self-service-helpdesk",
    domain: "it_data",
    title: "Self-Service Helpdesk",
    short: "Nutzerseitige Selbsthilfe über Portal und automatisierte Lösungspfade.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_it_ops",
    priority: "green",
    tags: { intent: ["automation"], data_scope: "single_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["integration", "ai"] },
    outputs: ["Self-Service-Wissensportal", "Automatisierte Lösungsdialoge", "Messung der Ticketvermeidung"]
  },
  {
    id: "ki-preisueberwachung",
    domain: "procurement",
    title: "KI-Preisüberwachung",
    short: "Kontinuierliche KI-gestützte Überwachung von Preisänderungen und Beschaffungsrisiken über Lieferanten hinweg.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_procurement",
    priority: "green",
    tags: { intent: ["automation", "insights"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["ai", "bi"] },
    outputs: ["Preis-Monitoring mit Warnlogik", "Anomalieerkennung bei Preisentwicklung", "Handlungsempfehlungen für Einkauf"]
  },
  {
    id: "automatisierte-bestellverarbeitung",
    domain: "procurement",
    title: "Automatisierte Bestellverarbeitung",
    short: "Durchgängige Automatisierung von Bestellprozessen von der Anlage bis zur Statusrückmeldung.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_procurement",
    priority: "green",
    tags: { intent: ["automation"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["integration"] },
    outputs: ["Automatisierter Bestellworkflow", "Regelbasierte Freigaben", "Transparente Prozessdurchlaufzeiten"]
  },
  {
    id: "spendmanagement-automatisieren",
    domain: "procurement",
    title: "Spendmanagement automatisieren",
    short: "Automatisierte Auswertung von Ausgabenstrukturen zur Identifikation von Einsparpotenzialen und Maverick Buying.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_procurement",
    priority: "green",
    tags: { intent: ["automation", "insights"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["bi", "ai"] },
    outputs: ["Automatisierte Spend-Klassifikation", "Erkennung von Ausreißern", "Priorisierte Einsparhebel"]
  },
  {
    id: "kyc-automatisierung",
    domain: "risk_compliance",
    title: "KYC-Automatisierung",
    short: "Automatisierte KYC-Prüfprozesse mit risikobasierter Priorisierung für schnellere und sichere Onboarding-Abläufe.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_risk_compliance",
    priority: "green",
    tags: { intent: ["automation", "compliance"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["ai", "governance"] },
    outputs: ["Automatisierter KYC-Workflow", "Risikobasierte Fallpriorisierung", "Nachvollziehbare Prüfprotokolle"]
  },
  {
    id: "esg-datenerhebung-automatisiert",
    domain: "risk_compliance",
    title: "Automatisierte ESG-Datenerhebung",
    short: "Automatisierte Sammlung und Aufbereitung von ESG-Daten für konsistente Nachhaltigkeitsberichterstattung.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_risk_compliance",
    priority: "green",
    tags: { intent: ["automation", "compliance"], data_scope: "enterprise_wide", complexity: "m", maturity_hint: "stabilize", tech_hint: ["integration", "governance"] },
    outputs: ["ESG-Datenpipeline", "Automatisierte Plausibilisierung", "Berichtsfähige ESG-Kennzahlen"]
  },
  {
    id: "ai-oberflaechenanalyse",
    domain: "it_data",
    title: "AI-Oberflächenanalyse",
    short: "KI-gestützte Analyse digitaler Oberflächen zur Erkennung von Usability-Hürden und Optimierungspotenzialen.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_it_ops",
    priority: "green",
    tags: { intent: ["automation", "insights"], data_scope: "single_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["ai"] },
    outputs: ["Analyse kritischer UI-Muster", "Priorisierte UX-Hotspots", "Empfehlungen für Oberflächenverbesserung"]
  },
  {
    id: "ai-produktentwicklung",
    domain: "rnd",
    title: "AI-Produktentwicklung",
    short: "Beschleunigte Produktentwicklung durch KI-gestützte Ideation, Prototyping und Validierung.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_rnd",
    priority: "green",
    tags: { intent: ["automation", "scale"], data_scope: "multi_source", complexity: "l", maturity_hint: "scale", tech_hint: ["ai"] },
    outputs: ["KI-unterstützte Produktkonzepte", "Schnelle Prototypzyklen", "Messbare Validierungsmetriken"]
  },
  {
    id: "rag-literaturrecherche",
    domain: "rnd",
    title: "RAG-Literaturrecherche",
    short: "Recherche-Assistenz mit Retrieval-Augmented Generation für schnellere Auswertung wissenschaftlicher Quellen.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_rnd",
    priority: "green",
    tags: { intent: ["automation", "insights"], data_scope: "multi_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["ai"] },
    outputs: ["RAG-basierter Rechercheassistent", "Quellenverweise mit Nachvollziehbarkeit", "Zusammenfassungen nach Fragestellung"]
  },
  {
    id: "ai-video-qualitaetsanalyse",
    domain: "production",
    title: "AI-Video-Qualitätsanalyse",
    short: "Qualitätsautomatisierung mit Schwerpunkt auf visueller Inspektion per Video- und Bilddaten.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_production_logistics",
    priority: "green",
    tags: { intent: ["automation", "insights"], data_scope: "single_source", complexity: "l", maturity_hint: "scale", tech_hint: ["ai"] },
    outputs: ["Videoanalytik für Qualitätsprüfung", "Automatische Fehlerklassifikation", "Echtzeit-Warnungen bei Abweichungen"]
  },
  {
    id: "ki-warenausgangs-scanning",
    domain: "logistics",
    title: "KI-Warenausgangs-Scanning",
    short: "KI-gestütztes Scanning im Warenausgang zur automatischen Vollständigkeits- und Qualitätskontrolle vor Versand.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_production_logistics",
    priority: "green",
    tags: { intent: ["automation"], data_scope: "single_source", complexity: "m", maturity_hint: "stabilize", tech_hint: ["ai", "integration"] },
    outputs: ["Automatische Versandprüfung", "Erkennung von Fehl- und Falschkommissionierung", "Auditfähige Scan-Protokolle"]
  },
  {
    id: "objekterkennung",
    domain: "production",
    title: "Objekterkennung",
    short: "Generische Computer-Vision-Erkennung als Baustein für Qualitäts- und Logistikprozesse.",
    portfolio_area: "automation_ai",
    solution_cluster: "automation_production_logistics",
    priority: "green",
    tags: { intent: ["automation", "insights"], data_scope: "single_source", complexity: "l", maturity_hint: "scale", tech_hint: ["ai"] },
    outputs: ["Trainiertes Erkennungsmodell", "Klassifikationsergebnisse in Echtzeit", "Qualitäts- und Prozesskennzahlen"]
  }
];

const defaultClusterByDomain: Record<UseCaseDomain, SolutionClusterTag> = {
  general_mgmt: "orientation_prioritization",
  it_data: "data_mgmt_architecture",
  finance: "insights_finance",
  sales_marketing: "insights_sales_marketing",
  procurement: "insights_procurement",
  production: "insights_production_logistics",
  logistics: "insights_production_logistics",
  hr: "automation_cross_domain",
  rnd: "automation_rnd",
  risk_compliance: "automation_risk_compliance",
};

const defaultBestForByDomain: Record<UseCaseDomain, string[]> = {
  general_mgmt: ["Geschäftsführung", "Bereichsleitungen"],
  it_data: ["IT-Leitung", "Data-Teams"],
  finance: ["Finance", "Controlling"],
  sales_marketing: ["Sales", "Marketing"],
  procurement: ["Beschaffung", "Einkauf"],
  production: ["Produktion", "Operations"],
  logistics: ["Logistik", "Operations"],
  hr: ["HR", "People & Culture"],
  rnd: ["R&D", "Innovationsteams"],
  risk_compliance: ["Risk", "Compliance"],
};

const curatedUseCaseData: Record<string, { slug: string; details: NonNullable<UseCase["details"]> }> = {
  "data-ai-leadership": {
    slug: "data-ai-leadership",
    details: {
      problem: "Führungsteams treiben Data- und KI-Initiativen ohne einheitliche Steuerungslogik und klare Verantwortungen.",
      typicalResult: "Ein belastbares Führungsmodell mit klaren Entscheidungswegen, KPIs und Verantwortlichkeiten.",
      typicalDeliverables: ["KPI Definition Workshop", "Datenstrategie Sprint", "Management Reporting Setup"],
      bestFor: ["Geschäftsführung", "Transformation Office", "Bereichsleitungen"],
    },
  },
  "data-catalog": {
    slug: "data-catalog",
    details: {
      problem: "Begriffe, Datenobjekte und Verantwortlichkeiten sind verteilt oder uneinheitlich dokumentiert.",
      typicalResult: "Ein zentraler, gepflegter Katalog mit klaren Definitionen und eindeutigen Verantwortlichkeiten.",
      typicalDeliverables: ["KPI & Daten-Glossar Sprint", "Datenquellen- & Integrationsanalyse", "Governance Starter"],
      bestFor: ["Führungsteams mit Governance-Fokus", "Fachbereiche mit Abstimmungsbedarf", "Organisationen mit Compliance-Anforderungen"],
    },
  },
  "data-mesh-organisation": {
    slug: "data-mesh-organisation",
    details: {
      problem: "Domänen arbeiten mit Daten, aber Ownership, Standards und Verantwortung sind nicht klar geregelt.",
      typicalResult: "Ein Data-Mesh-Betriebsmodell mit klaren Rollen, Verantwortungen und Umsetzungsfahrplan.",
      typicalDeliverables: ["Data Governance Starter", "Target Architecture", "Domain Enablement Plan"],
      bestFor: ["Data-Leads", "Domänenverantwortliche", "IT-Architektur"],
    },
  },
  "datenstrategie": {
    slug: "datenstrategie",
    details: {
      problem: "Es fehlen priorisierte Dateninitiativen, ein klares Zielbild und eine umsetzbare Reihenfolge.",
      typicalResult: "Eine abgestimmte Datenstrategie mit priorisierter Roadmap und messbaren Business-Zielen.",
      typicalDeliverables: ["Datenstrategie Sprint", "Roadmap", "KPI Definition Workshop"],
      bestFor: ["Geschäftsführung", "Strategieteams", "Data-Verantwortliche"],
    },
  },
  "dsgvo-dsb": {
    slug: "dsgvo-dsb",
    details: {
      problem: "Datenschutzanforderungen sind verteilt umgesetzt und im Alltag schwer auditierbar nachweisbar.",
      typicalResult: "Ein praktikables DSGVO-Setup mit klaren Rollen, Nachweisen und definierten Prozessen.",
      typicalDeliverables: ["Data Governance Starter", "KPI & Daten-Glossar Sprint", "IAM Konzept"],
      bestFor: ["Datenschutzbeauftragte", "Compliance", "Fachbereiche mit personenbezogenen Daten"],
    },
  },
  iam: {
    slug: "iam",
    details: {
      problem: "Zugriffsrechte sind historisch gewachsen, inkonsistent und nur eingeschränkt auditierbar.",
      typicalResult: "Ein strukturiertes IAM-Zielbild mit rollenbasierten Rechten und klaren Governance-Prozessen.",
      typicalDeliverables: ["IAM Konzept", "Rollen- und Rechte-Blueprint", "Integrationsanalyse"],
      bestFor: ["IT-Security", "Compliance", "IT-Operations"],
    },
  },
  dwh: {
    slug: "dwh",
    details: {
      problem: "Reporting basiert auf fragmentierten Quellen, manuellen Extracts und uneinheitlicher Datenlogik.",
      typicalResult: "Ein stabiles Data-Warehouse-Fundament als Single Source of Truth für Analytics und Reporting.",
      typicalDeliverables: ["DWH Starter", "Source Integration Review", "Reporting Standards"],
      bestFor: ["Data Engineering", "BI-Teams", "Finance & Controlling"],
    },
  },
  "data-lake": {
    slug: "data-lake",
    details: {
      problem: "Unstrukturierte und strukturierte Daten sind nicht zentral nutzbar und schwer governbar.",
      typicalResult: "Ein skalierbares Data-Lake/Lakehouse-Fundament mit klaren Ingestion- und Governance-Regeln.",
      typicalDeliverables: ["Source Integration Review", "DWH/Lakehouse Starter", "Target Architecture"],
      bestFor: ["Data Platform Teams", "IT-Architektur", "Analytics-Teams"],
    },
  },
  "management-dashboard": {
    slug: "management-dashboard",
    details: {
      problem: "Management-Entscheidungen basieren auf verstreuten Reports und verspäteten Kennzahlen.",
      typicalResult: "Ein zentrales Steuerungsdashboard mit konsistenten KPIs und schneller Entscheidungsgrundlage.",
      typicalDeliverables: ["BI Fix & Fertig Setup", "KPI Definition Workshop", "Erster Management-Bericht"],
      bestFor: ["Geschäftsführung", "Bereichsleitungen", "Organisationen mit mehreren Steuerungsbereichen"],
    },
  },
  "sales-dashboard": {
    slug: "sales-dashboard",
    details: {
      problem: "Vertrieb und Management haben keine einheitliche, aktuelle Sicht auf Pipeline und Performance.",
      typicalResult: "Ein Sales-Dashboard mit klaren KPIs, Pipeline-Transparenz und automatischen Updates.",
      typicalDeliverables: ["BI Fix & Fertig Setup", "KPI Definition Workshop", "KPI & Daten-Glossar Sprint"],
      bestFor: ["Sales-Leitung", "Vertriebsteams", "Unternehmen mit CRM-basierter Pipeline-Steuerung"],
    },
  },
  "itsm-analytics": {
    slug: "itsm-analytics",
    details: {
      problem: "Servicequalität und SLA-Erfüllung werden mit isolierten Reports statt übergreifender Transparenz gesteuert.",
      typicalResult: "Ein ITSM-Cockpit mit Ticket-, SLA- und Ursachenanalysen für datenbasierte Steuerung.",
      typicalDeliverables: ["Source Integration Review", "BI Setup", "Management Bericht ITSM"],
      bestFor: ["IT-Operations", "Service Management", "IT-Leitung"],
    },
  },
  "ai-helpdeskassistent": {
    slug: "ai-helpdeskassistent",
    details: {
      problem: "Support-Teams bearbeiten wiederkehrende Anfragen manuell und verlieren Zeit bei Erstlösungen.",
      typicalResult: "Ein KI-Assistent unterstützt Agenten mit Lösungsvorschlägen und reduziert Bearbeitungszeiten.",
      typicalDeliverables: ["Integrationsanalyse Ticket-/Wissensdaten", "KPI-Set für Assistenzqualität", "Betriebsmonitoring"],
      bestFor: ["Helpdesk-Teams", "IT-Operations", "Service-Owner"],
    },
  },
  "helpdesk-automation": {
    slug: "intelligentes-ticket-routing",
    details: {
      problem: "Tickets landen häufig im falschen Team und verursachen unnötige Weiterleitungen und SLA-Risiken.",
      typicalResult: "Automatisiertes Routing mit klarer Priorisierung und transparenter SLA-Steuerung.",
      typicalDeliverables: ["Ticketdaten-Integrationsanalyse", "Routing-Regelwerk", "Service-Reporting-Standards"],
      bestFor: ["IT-Operations", "Service Desk", "Prozessverantwortliche"],
    },
  },
  "automatisierte-rechnungsverarbeitung": {
    slug: "automatisierte-rechnungsverarbeitung",
    details: {
      problem: "Rechnungsprüfung und Freigaben sind manuell, fehleranfällig und verursachen lange Durchlaufzeiten.",
      typicalResult: "Ein automatisierter Rechnungseingangsprozess mit transparentem Status und kürzeren Bearbeitungszeiten.",
      typicalDeliverables: ["Source Integration Review", "Workflow-/Freigabe-Design", "Prozess-KPI-Reporting"],
      bestFor: ["Finance", "Shared Services", "Accounting Operations"],
    },
  },
  "ki-preisueberwachung": {
    slug: "ki-preisueberwachung",
    details: {
      problem: "Preisänderungen und Beschaffungsrisiken werden zu spät erkannt und nur manuell ausgewertet.",
      typicalResult: "Kontinuierliche Preisüberwachung mit Frühwarnungen und klaren Handlungsempfehlungen.",
      typicalDeliverables: ["Preis- und Lieferantendatenanalyse", "Warnlogik für Abweichungen", "Management-Report"],
      bestFor: ["Einkauf", "Category Management", "Finanzsteuerung"],
    },
  },
  "ai-video-qualitaetsanalyse": {
    slug: "ai-video-qualitaetsanalyse",
    details: {
      problem: "Visuelle Qualitätsprüfungen sind personalintensiv und Inkonsistenzen werden zu spät erkannt.",
      typicalResult: "KI-gestützte Videoanalyse erkennt Qualitätsabweichungen frühzeitig und reduziert Ausschuss.",
      typicalDeliverables: ["Integrationsanalyse für Bild-/Videodaten", "KI-Qualitätsmodell (Pilot)", "Monitoring der Modellgüte"],
      bestFor: ["Produktion", "Qualitätssicherung", "Werksleitung"],
    },
  },
};

export const useCases: UseCase[] = rawUseCases.map((useCase) => {
  const resolvedCluster = useCase.solution_cluster ?? defaultClusterByDomain[useCase.domain];
  const resolvedPortfolio =
    useCase.portfolio_area ?? (resolvedCluster.startsWith("automation_") ? "automation_ai" : "solutions");
  const details = useCase.details ?? {
    problem: useCase.short,
    typicalResult: useCase.outputs[0] ?? "Messbarer Mehrwert durch ein klar priorisiertes Produkt.",
    typicalDeliverables: useCase.outputs.slice(0, 3),
    bestFor: defaultBestForByDomain[useCase.domain],
  };

  const curated = curatedUseCaseData[useCase.id];
  return {
    ...useCase,
    slug: curated?.slug ?? useCase.slug ?? useCase.id,
    solution_cluster: resolvedCluster,
    portfolio_area: resolvedPortfolio,
    priority: useCase.priority ?? "normal",
    details: curated?.details ?? details,
  };
});

export type UiClusterId =
  | "orientation_prioritization"
  | "data_mgmt_architecture"
  | "insights_analytics"
  | "general_management"
  | "finance"
  | "sales_marketing"
  | "procurement"
  | "it_ops"
  | "production_logistics"
  | "risk_compliance"
  | "rnd"
  | "cross_domain_automation";

export const uiClusterOrder: UiClusterId[] = [
  "orientation_prioritization",
  "data_mgmt_architecture",
  "insights_analytics",
  "general_management",
  "finance",
  "sales_marketing",
  "procurement",
  "it_ops",
  "production_logistics",
  "risk_compliance",
  "rnd",
  "cross_domain_automation",
];

export const uiClusterLabels: Record<UiClusterId, string> = {
  orientation_prioritization: "Orientierung & Priorisierung",
  data_mgmt_architecture: "Datenmanagement & Architektur",
  insights_analytics: "Insights & Analytics",
  general_management: "General Management",
  finance: "Finance",
  sales_marketing: "Sales & Marketing",
  procurement: "Beschaffung",
  it_ops: "IT & Operations",
  production_logistics: "Produktion & Logistik",
  risk_compliance: "Risiko & Compliance",
  rnd: "Research & Development",
  cross_domain_automation: "Bereichsübergreifende Automatisierung",
};

export function getUiClusterForUseCase(useCase: UseCase): UiClusterId {
  if (useCase.solution_cluster === "orientation_prioritization") return "orientation_prioritization";
  if (useCase.solution_cluster === "data_mgmt_architecture") return "data_mgmt_architecture";

  if (useCase.solution_cluster === "insights_general_mgmt") return "insights_analytics";

  if (useCase.domain === "finance") return "finance";
  if (useCase.domain === "sales_marketing") return "sales_marketing";
  if (useCase.domain === "procurement") return "procurement";
  if (useCase.domain === "it_data") return "it_ops";
  if (useCase.domain === "production" || useCase.domain === "logistics") return "production_logistics";
  if (useCase.domain === "risk_compliance") return "risk_compliance";
  if (useCase.domain === "rnd") return "rnd";
  if (useCase.domain === "hr" || useCase.solution_cluster === "automation_cross_domain") return "cross_domain_automation";
  if (useCase.domain === "general_mgmt") return "general_management";

  return "insights_analytics";
}

export function getUseCasesForUiCluster(clusterId: UiClusterId): UseCase[] {
  return useCases.filter((uc) => getUiClusterForUseCase(uc) === clusterId);
}

// Helper-Funktionen
export function getUseCaseById(id: string): UseCase | undefined {
  return useCases.find(uc => uc.id === id);
}

export function getUseCasesByDomain(domain: UseCaseDomain): UseCase[] {
  return useCases.filter(uc => uc.domain === domain);
}

export function getAllDomains(): UseCaseDomain[] {
  return Array.from(new Set(useCases.map(uc => uc.domain)));
}
