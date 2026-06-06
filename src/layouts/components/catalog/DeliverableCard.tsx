import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Separator } from "./ui/separator";
import { CheckCircle2, XCircle } from "lucide-react";
import type { Deliverable } from "../data/deliverables";
import type { Recommendation } from "../data/recommendations";
import { getMinimumPrice, formatPrice } from "../lib/pricing";
import { cn } from "../lib/utils";
import { getDeliverableIcon } from "../lib/iconMap";

interface DeliverableCardProps {
  deliverable: Deliverable;
  recommendation: Recommendation;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  onConfigure?: () => void;
  layout?: "grid" | "list";
}

/**
 * Kompakte Produktbaustein-Karte für die Produktdetailansicht.
 * Geschlossen: Titel, Kurzbeschreibung, Preis, Auswahl, CTA.
 * Aufgeklappt: Lieferumfang, Voraussetzungen, Details.
 */
export function DeliverableCard({
  deliverable,
  recommendation,
  isEnabled,
  onToggle,
  onConfigure,
  layout = "grid",
}: DeliverableCardProps) {
  const isActive = deliverable.active;
  const isDisabled = !isActive;

  const Icon = getDeliverableIcon(deliverable.id);
  const limitedOutputs = deliverable.deliverablesOutput.slice(0, 5);
  const limitedAssumptions = deliverable.assumptions.slice(0, 3);
  const limitedOutOfScope = deliverable.outOfScope.slice(0, 3);
  const minPrice = getMinimumPrice(deliverable);

  const detailsAccordion = (
    <Accordion type="single" collapsible>
      <AccordionItem value={`details-${deliverable.id}`} className="border-0">
        <AccordionTrigger
          className="py-1.5 text-xs text-text-light dark:text-darkmode-text-light hover:no-underline"
          aria-label={`Details zu ${deliverable.name} ein- oder ausklappen`}
        >
          Details anzeigen
        </AccordionTrigger>
        <AccordionContent className="pt-2 space-y-4">
          <p className="text-xs text-text-light dark:text-darkmode-text-light italic">
            <span className="font-medium text-text dark:text-darkmode-text not-italic">Warum empfohlen?</span>{" "}
            {recommendation.reason}
          </p>

          {deliverable.longDescription && (
            <div className="space-y-1">
              <h4 className="font-semibold text-xs text-text dark:text-darkmode-text">Beschreibung</h4>
              <p className="text-xs text-text-light dark:text-darkmode-text-light leading-relaxed">
                {deliverable.longDescription}
              </p>
            </div>
          )}

          {limitedOutputs.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="font-semibold text-xs text-text dark:text-darkmode-text">Lieferumfang</h4>
              <ul className="space-y-1">
                {limitedOutputs.map((output, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-xs text-text-light dark:text-darkmode-text-light">
                    <CheckCircle2 className="h-3 w-3 text-green-600/70 dark:text-green-400/70 mt-0.5 shrink-0" />
                    <span>{output}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(limitedAssumptions.length > 0 || limitedOutOfScope.length > 0) && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {limitedAssumptions.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="font-semibold text-xs text-text dark:text-darkmode-text">Voraussetzungen</h4>
                    <ul className="space-y-1">
                      {limitedAssumptions.map((assumption, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-text-light dark:text-darkmode-text-light">
                          <CheckCircle2 className="h-3 w-3 text-green-600/70 dark:text-green-400/70 mt-0.5 shrink-0" />
                          <span>{assumption}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {limitedOutOfScope.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="font-semibold text-xs text-text dark:text-darkmode-text">Nicht enthalten</h4>
                    <ul className="space-y-1">
                      {limitedOutOfScope.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-text-light dark:text-darkmode-text-light">
                          <XCircle className="h-3 w-3 text-red-500/80 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  if (layout === "list") {
    return (
      <li
        className={cn(
          "bg-light dark:bg-darkmode-light hover:bg-body dark:hover:bg-darkmode-body transition-colors",
          isEnabled && isActive && "bg-green-500/[0.03]",
          isDisabled && "opacity-60"
        )}
      >
        <div className="flex flex-col gap-2.5 px-4 py-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-start gap-2.5">
            <Icon
              className={cn(
                "h-4 w-4 mt-0.5 shrink-0",
                isEnabled && isActive
                  ? "text-green-600 dark:text-green-400"
                  : "text-text-light dark:text-darkmode-text-light"
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-text dark:text-darkmode-text truncate">
                  {deliverable.name}
                </h3>
                <span className="hidden md:inline text-xs text-text-light dark:text-darkmode-text-light shrink-0">
                  · {deliverable.family}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-text-light dark:text-darkmode-text-light line-clamp-1">
                {deliverable.shortDescription}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end shrink-0">
            {isActive && minPrice > 0 && (
              <span className="text-sm text-text-light dark:text-darkmode-text-light whitespace-nowrap">
                ab <span className="font-semibold text-text dark:text-darkmode-text">{formatPrice(minPrice)}</span>
              </span>
            )}
            {isActive && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-light dark:text-darkmode-text-light whitespace-nowrap hidden sm:inline">
                  {isEnabled ? "Ausgewählt" : "Auswählen"}
                </span>
                <Switch
                  checked={isEnabled}
                  onChange={(e) => onToggle(e.target.checked)}
                  disabled={isDisabled}
                />
              </div>
            )}
            {isActive && (
              <Button
                type="button"
                size="sm"
                variant="default"
                className="shrink-0 whitespace-nowrap"
                onClick={() => {
                  onToggle(true);
                  onConfigure?.();
                }}
              >
                Konfigurieren
              </Button>
            )}
          </div>
        </div>
        <div className="px-4 pb-2">{detailsAccordion}</div>
      </li>
    );
  }

  return (
    <Card
      className={cn(
        "transition-colors duration-200 rounded-xl border-border/80",
        isEnabled && isActive && "border-green-600/30 dark:border-green-400/20",
        isDisabled && "opacity-60"
      )}
    >
      <div className="px-4 py-3 space-y-2.5">
        <div className="flex items-start gap-2.5">
          <Icon
            className={cn(
              "h-4 w-4 mt-0.5 shrink-0",
              isEnabled && isActive
                ? "text-green-600 dark:text-green-400"
                : "text-text-light dark:text-darkmode-text-light"
            )}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-text dark:text-darkmode-text line-clamp-2 leading-snug">
              {deliverable.name}
            </h3>
            <p className="text-xs text-text-light dark:text-darkmode-text-light">{deliverable.family}</p>
          </div>
        </div>

        <p className="text-xs text-text-light dark:text-darkmode-text-light line-clamp-2 leading-relaxed">
          {deliverable.shortDescription}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border/80">
          {isActive && minPrice > 0 ? (
            <p className="font-semibold text-sm text-text dark:text-darkmode-text">
              ab {formatPrice(minPrice)}
            </p>
          ) : (
            <span />
          )}
          {isActive && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-light dark:text-darkmode-text-light whitespace-nowrap">
                {isEnabled ? "Ausgewählt" : "Auswählen"}
              </span>
              <Switch
                checked={isEnabled}
                onChange={(e) => onToggle(e.target.checked)}
                disabled={isDisabled}
              />
            </div>
          )}
        </div>

        {isActive && (
          <Button
            size="sm"
            variant="default"
            onClick={() => {
              onToggle(true);
              onConfigure?.();
            }}
            className="w-full"
          >
            Baustein konfigurieren
          </Button>
        )}

        {detailsAccordion}
      </div>
    </Card>
  );
}
