import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Copy, Check, Mail } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  buildCustomInquiryText,
  buildInquirySubject,
  buildMailtoLink,
  type CustomInquiryFields,
} from "../lib/inquiry";
import { cn } from "../lib/utils";
import { PRODUCT_CATALOG_INQUIRY_EMAIL } from "@/config/products";

interface CustomRequestFormProps {
  productTitle: string;
  /** true = "Individuelle Ergänzung" (hybrid), false = vollständige individuelle Anfrage (custom). */
  isAddon?: boolean;
  /** true = ohne eigene Card/Überschrift (z. B. innerhalb eines Accordions). */
  embedded?: boolean;
  /** true = hervorgehobene Darstellung für reine Custom-Produkte. */
  prominent?: boolean;
}

const emptyFields: CustomInquiryFields = {
  companySize: "",
  situation: "",
  goal: "",
  systems: "",
  notes: "",
};

export function CustomRequestForm({ productTitle, isAddon = false, embedded = false, prominent = false }: CustomRequestFormProps) {
  const [fields, setFields] = useState<CustomInquiryFields>(emptyFields);
  const [copied, setCopied] = useState(false);

  const set = (key: keyof CustomInquiryFields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const text = buildCustomInquiryText(productTitle, fields, isAddon);
  const subject = buildInquirySubject(productTitle);
  const mailto = buildMailtoLink(PRODUCT_CATALOG_INQUIRY_EMAIL, subject, text);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard nicht verfügbar – Mailto bleibt nutzbar */
    }
  };

  return (
    <div
      className={cn(
        "space-y-5",
        !embedded && "rounded-xl border bg-light dark:bg-darkmode-light p-5",
        !embedded && prominent && "border-green-600/25 dark:border-green-400/20",
        !embedded && !prominent && "border-border"
      )}
    >
      <div className="space-y-2">
        {!embedded && (
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="flex items-center gap-2 text-base font-semibold text-text dark:text-darkmode-text">
              <Mail className="h-4 w-4 text-green-700 dark:text-green-400" />
              Individuelle Anfrage
            </h4>
            {prominent && (
              <Badge variant="default" className="text-[11px] px-2 py-0">
                Individuell geplant
              </Badge>
            )}
          </div>
        )}
        <p className="text-sm text-text-light dark:text-darkmode-text-light">
          {isAddon
            ? "Beschreiben Sie kurz Ihren zusätzlichen Bedarf – wir melden uns mit einem passenden Vorschlag."
            : prominent
              ? "Dieses Produkt planen wir gemeinsam mit Ihnen. Ein paar Eckdaten genügen für die erste Anfrage."
              : "Dieses Produkt stimmen wir individuell auf Ihre Situation ab. Ein paar Eckdaten genügen."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="cr-size">Unternehmensgröße</Label>
          <Input id="cr-size" value={fields.companySize} onChange={set("companySize")} placeholder="z. B. 250 Mitarbeitende" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cr-systems">Vorhandene Systeme / Datenquellen</Label>
          <Input id="cr-systems" value={fields.systems} onChange={set("systems")} placeholder="z. B. SAP, Salesforce, Excel" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cr-situation">Ausgangssituation</Label>
        <Input id="cr-situation" value={fields.situation} onChange={set("situation")} placeholder="Wo stehen Sie heute?" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cr-goal">Ziel / gewünschtes Ergebnis</Label>
        <Input id="cr-goal" value={fields.goal} onChange={set("goal")} placeholder="Was möchten Sie erreichen?" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cr-notes">Weitere Anforderungen</Label>
        <textarea
          id="cr-notes"
          value={fields.notes}
          onChange={set("notes")}
          rows={3}
          placeholder="Optional: Rahmenbedingungen, Termine, Besonderheiten"
          className="w-full rounded-md border border-border bg-body dark:bg-darkmode-body px-3 py-2 text-sm text-text dark:text-darkmode-text placeholder:text-text-light/70 focus:outline-none focus:ring-2 focus:ring-green-600/40"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <Button asChild size="lg" className="w-full sm:w-auto sm:min-w-[17rem] shrink-0">
          <a href={mailto} className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
            <Mail className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">Individuelle Anfrage vorbereiten</span>
          </a>
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={handleCopy} className="whitespace-nowrap shrink-0">
          {copied ? <Check className="h-4 w-4 shrink-0" /> : <Copy className="h-4 w-4 shrink-0" />}
          {copied ? "Kopiert" : "Text kopieren"}
        </Button>
      </div>
    </div>
  );
}
