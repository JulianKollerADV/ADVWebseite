import { formatPrice } from "./pricing";

export interface InquiryDeliverableItem {
  name: string;
  price: number;
  selectedParameters: Array<{ label: string; value: string }>;
}

export interface InquiryPayload {
  useCaseTitle: string;
  deliverables: InquiryDeliverableItem[];
  estimatedTotalPrice?: number;
}

export function buildInquirySubject(useCaseTitle: string): string {
  return `Anfrage Produktkatalog – ${useCaseTitle}`;
}

export function buildInquiryText(payload: InquiryPayload): string {
  const lines: string[] = [];
  lines.push("Guten Tag,");
  lines.push("");
  lines.push("ich möchte eine Anfrage zu folgender Konfiguration aus dem Produktkatalog stellen:");
  lines.push("");
  lines.push(`Produkt: ${payload.useCaseTitle}`);
  lines.push("");
  lines.push("Ausgewählte Produktbausteine:");

  payload.deliverables.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name} (${formatPrice(item.price)})`);
    if (item.selectedParameters.length > 0) {
      lines.push("   Konfigurationsparameter:");
      item.selectedParameters.forEach((param) => {
        lines.push(`   - ${param.label}: ${param.value}`);
      });
    } else {
      lines.push("   Konfigurationsparameter: Standard");
    }
  });

  lines.push("");
  if (typeof payload.estimatedTotalPrice === "number" && payload.estimatedTotalPrice > 0) {
    lines.push(`Geschätzter Gesamtpreis (aktuelle Konfiguration): ${formatPrice(payload.estimatedTotalPrice)}`);
  } else {
    lines.push("Geschätzter Gesamtpreis: aktuell nicht verfügbar");
  }
  lines.push("");
  lines.push("Bitte melden Sie sich für ein Beratungsgespräch.");
  lines.push("");
  lines.push("Vielen Dank.");

  return lines.join("\n");
}

export function buildMailtoLink(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export interface CustomInquiryFields {
  companySize: string;
  situation: string;
  goal: string;
  systems: string;
  notes: string;
}

/** Freitext-Anfrage für custom/hybrid-Produkte (individuelle Anfrage). */
export function buildCustomInquiryText(
  productTitle: string,
  fields: CustomInquiryFields,
  isAddon = false
): string {
  const lines: string[] = [];
  lines.push("Guten Tag,");
  lines.push("");
  lines.push(
    isAddon
      ? `ich interessiere mich für „${productTitle}“ und möchte eine individuelle Ergänzung anfragen:`
      : `ich möchte eine individuelle Anfrage zu „${productTitle}“ stellen:`
  );
  lines.push("");
  lines.push(`Unternehmensgröße: ${fields.companySize || "—"}`);
  lines.push(`Ausgangssituation: ${fields.situation || "—"}`);
  lines.push(`Ziel / gewünschtes Ergebnis: ${fields.goal || "—"}`);
  lines.push(`Vorhandene Systeme / Datenquellen: ${fields.systems || "—"}`);
  lines.push(`Weitere Anforderungen: ${fields.notes || "—"}`);
  lines.push("");
  lines.push("Bitte melden Sie sich für ein Beratungsgespräch.");
  lines.push("");
  lines.push("Vielen Dank.");
  return lines.join("\n");
}
