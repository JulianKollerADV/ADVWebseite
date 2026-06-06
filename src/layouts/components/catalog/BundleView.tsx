import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Mail } from "lucide-react";
import { useConfigStore } from "../stores/configStore";
import { getUseCaseById } from "../data/useCases";
import { getDeliverableById } from "../data/deliverables";
import { getBundleForUseCase } from "../data/recommendations";
import { getRequestMode } from "../data/requestModes";
import { DeliverableCard } from "./DeliverableCard";
import { CustomRequestForm } from "./CustomRequestForm";
import { ViewToggle, type ViewLayout } from "./ViewToggle";
import { Separator } from "./ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { cn } from "../lib/utils";

interface BundleViewProps {
  useCaseId: string | null;
  onNext: () => void;
  onBack: () => void;
  viewLayout: ViewLayout;
  onViewLayoutChange: (layout: ViewLayout) => void;
}

function DeliverableSection({
  title,
  recommendations,
  selectedDeliverables,
  onToggle,
  onConfigure,
  layout,
}: {
  title: string;
  recommendations: ReturnType<typeof getBundleForUseCase>;
  selectedDeliverables: ReturnType<typeof useConfigStore.getState>["selectedDeliverables"];
  onToggle: (id: string, enabled: boolean) => void;
  onConfigure: () => void;
  layout: ViewLayout;
}) {
  const items = recommendations
    .map((recommendation) => {
      const deliverable = getDeliverableById(recommendation.deliverableId);
      if (!deliverable?.active) return null;
      return { recommendation, deliverable };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (items.length === 0) return null;

  const renderCard = (recommendation: (typeof items)[0]["recommendation"], deliverable: (typeof items)[0]["deliverable"]) => (
    <DeliverableCard
      key={deliverable.id}
      deliverable={deliverable}
      recommendation={recommendation}
      isEnabled={selectedDeliverables[deliverable.id]?.enabled || false}
      onToggle={(enabled) => onToggle(deliverable.id, enabled)}
      onConfigure={onConfigure}
      layout={layout}
    />
  );

  return (
    <section className="space-y-3">
      <h4 className="text-sm font-semibold text-text dark:text-darkmode-text">{title}</h4>
      {layout === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {items.map(({ recommendation, deliverable }) => renderCard(recommendation, deliverable))}
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border overflow-hidden">
          {items.map(({ recommendation, deliverable }) => renderCard(recommendation, deliverable))}
        </ul>
      )}
    </section>
  );
}

/**
 * Produktdetailansicht – Produktbausteine und individuelle Anfrage.
 */
export function BundleView({ useCaseId, onNext, onBack, viewLayout, onViewLayoutChange }: BundleViewProps) {
  const useCase = useCaseId ? getUseCaseById(useCaseId) : null;
  const selectedDeliverables = useConfigStore((state) => state.selectedDeliverables);
  const toggleDeliverable = useConfigStore((state) => state.toggleDeliverable);
  const setBundleFromUseCase = useConfigStore((state) => state.setBundleFromUseCase);

  if (!useCase) {
    return null;
  }

  const mode = getRequestMode(useCase.id);
  const recommendations = getBundleForUseCase(useCase.id);
  const activeCount = recommendations.filter((rec) => getDeliverableById(rec.deliverableId)?.active).length;

  const coreDeliverables = recommendations.filter((rec) => {
    if (!rec.defaultEnabled) return false;
    return Boolean(getDeliverableById(rec.deliverableId)?.active);
  });
  const optionalDeliverables = recommendations.filter((rec) => {
    if (rec.defaultEnabled) return false;
    return Boolean(getDeliverableById(rec.deliverableId)?.active);
  });

  const enabledCount = recommendations.filter((rec) => {
    const deliverable = getDeliverableById(rec.deliverableId);
    if (!deliverable) return false;
    return selectedDeliverables[deliverable.id]?.enabled || false;
  }).length;

  const handleToggle = (deliverableId: string, enabled: boolean) => {
    toggleDeliverable(deliverableId, enabled);
  };

  const handleResetBundle = () => {
    setBundleFromUseCase(useCase.id);
  };

  const defaultBestForByDomain: Record<string, string[]> = {
    general_mgmt: ["Geschäftsführung", "Bereichsleitungen"],
    finance: ["Finance", "Controlling"],
    sales_marketing: ["Sales", "Marketing"],
    it_data: ["IT", "Data-Teams"],
    procurement: ["Beschaffung", "Einkauf"],
    production: ["Produktion", "Operations"],
    logistics: ["Logistik", "Operations"],
    hr: ["HR", "People & Culture"],
    rnd: ["R&D", "Innovationsteams"],
    risk_compliance: ["Risk", "Compliance"],
  };
  const fallbackDetails = {
    problem: useCase.short,
    typicalResult: useCase.outputs[0] ?? "Klarer erster Umsetzungsschritt mit messbarem Nutzen.",
    bestFor: defaultBestForByDomain[useCase.domain] ?? ["Fachbereiche mit konkretem Entscheidungsbedarf"],
  };
  const details = useCase.details ?? fallbackDetails;

  const isCustomOrHybrid = mode === "custom" || mode === "hybrid";
  const hasModules = recommendations.length > 0 && mode !== "custom";

  return (
    <div className="space-y-6">
      {/* Produkt-Kontext */}
      <div className="rounded-xl border border-border bg-light dark:bg-darkmode-light px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium text-text-light dark:text-darkmode-text-light">Ausgewähltes Produkt</p>
              {isCustomOrHybrid && (
                <Badge variant="default" className="text-[11px] px-2 py-0">
                  Individuell geplant
                </Badge>
              )}
            </div>
            <h2 className="text-lg font-semibold text-text dark:text-darkmode-text line-clamp-2">{useCase.title}</h2>
            {isCustomOrHybrid && mode === "custom" && (
              <p className="text-sm text-text-light dark:text-darkmode-text-light">
                Dieses Produkt wird individuell auf Ihre Situation abgestimmt – ohne feste Produktbausteine.
              </p>
            )}
            {isCustomOrHybrid && mode === "hybrid" && (
              <p className="text-sm text-text-light dark:text-darkmode-text-light">
                Wählen Sie passende Produktbausteine oder ergänzen Sie individuelle Anforderungen.
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onBack} className="shrink-0">
            ← Zurück
          </Button>
        </div>
        <Accordion type="single" collapsible className="mt-1">
          <AccordionItem value="use-case-details" className="border-0">
            <AccordionTrigger className="py-1.5 text-xs text-text-light dark:text-darkmode-text-light hover:no-underline">
              Produkt-Details
            </AccordionTrigger>
            <AccordionContent className="pt-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-text-light dark:text-darkmode-text-light mb-1">Problem</p>
                  <p className="text-xs text-text-light dark:text-darkmode-text-light leading-relaxed">{details.problem}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-text-light dark:text-darkmode-text-light mb-1">Ergebnis</p>
                  <p className="text-xs text-text-light dark:text-darkmode-text-light leading-relaxed">{details.typicalResult}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-text-light dark:text-darkmode-text-light mb-1">Für wen geeignet</p>
                  <p className="text-xs text-text-light dark:text-darkmode-text-light leading-relaxed">{details.bestFor.slice(0, 3).join(", ")}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* custom: nur individuelle Anfrage */}
      {mode === "custom" ? (
        <CustomRequestForm productTitle={useCase.title} prominent />
      ) : recommendations.length === 0 ? (
        <CustomRequestForm productTitle={useCase.title} prominent />
      ) : (
        <div className="space-y-6">
          {/* Kopfzeile mit Ansichtsumschalter */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-text-light dark:text-darkmode-text-light">
              {activeCount} {activeCount === 1 ? "Produktbaustein" : "Produktbausteine"} verfügbar
            </p>
            <ViewToggle value={viewLayout} onChange={onViewLayoutChange} />
          </div>

          <DeliverableSection
            title="Empfohlene Produktbausteine"
            recommendations={coreDeliverables}
            selectedDeliverables={selectedDeliverables}
            onToggle={handleToggle}
            onConfigure={onNext}
            layout={viewLayout}
          />

          {optionalDeliverables.length > 0 && (
            <DeliverableSection
              title="Optionale Produktbausteine"
              recommendations={optionalDeliverables}
              selectedDeliverables={selectedDeliverables}
              onToggle={handleToggle}
              onConfigure={onNext}
              layout={viewLayout}
            />
          )}

          {mode === "hybrid" && (
            <section className={cn("pt-4", hasModules && "border-t border-border")}>
              <div className="rounded-xl border border-green-600/25 dark:border-green-400/20 bg-green-500/[0.06] dark:bg-green-500/10 px-4 py-4 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Mail className="h-4 w-4 text-green-700 dark:text-green-400 shrink-0" />
                  <h4 className="text-sm font-semibold text-text dark:text-darkmode-text">
                    Individuelle Anfrage möglich
                  </h4>
                  <Badge variant="default" className="text-[11px] px-2 py-0">
                    Individuell geplant
                  </Badge>
                </div>
                <p className="text-sm text-text-light dark:text-darkmode-text-light">
                  Wählen Sie passende Produktbausteine – oder beschreiben Sie zusätzliche Anforderungen individuell.
                </p>
                <p className="text-sm text-text dark:text-darkmode-text">
                  Nicht die passende Kombination gefunden? Gerne erstellen wir ein individuelles Angebot für Ihre Anforderungen.
                </p>
                <Accordion type="single" collapsible className="space-y-0">
                  <AccordionItem
                    value="custom-request"
                    className="rounded-lg border border-green-600/20 dark:border-green-400/15 bg-body dark:bg-darkmode-body overflow-hidden"
                  >
                    <AccordionTrigger className="py-3.5 px-4 hover:no-underline hover:bg-green-500/5">
                      <span className="flex items-center gap-2 text-sm font-semibold text-text dark:text-darkmode-text min-w-0">
                        <Mail className="h-4 w-4 text-green-700 dark:text-green-400 shrink-0" />
                        <span className="whitespace-nowrap">Individuelle Anfrage vorbereiten</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <CustomRequestForm productTitle={useCase.title} isAddon embedded />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </section>
          )}
        </div>
      )}

      {mode !== "custom" && recommendations.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <Button variant="outline" onClick={handleResetBundle} size="lg">
              Auswahl zurücksetzen
            </Button>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <p className="text-sm text-text-light dark:text-darkmode-text-light text-center sm:text-right">
                {enabledCount} von {activeCount} ausgewählt
              </p>
              <Button onClick={onNext} size="lg" variant="default" disabled={enabledCount === 0}>
                Weiter zur Konfiguration
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
