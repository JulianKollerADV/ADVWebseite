import { deliverables } from "../data/deliverables";
import { getMinimumPrice, formatPrice } from "../lib/pricing";
import { getDeliverableIcon } from "../lib/iconMap";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface DeliverableListViewProps {
  /** Baustein aktivieren und zur Konfiguration springen. */
  onConfigure: (deliverableId: string) => void;
  layout?: "list" | "grid";
  className?: string;
}

/**
 * Übersicht ALLER Produktbausteine (kauf-/konfigurierbare Leistungen).
 * Bewusst getrennt von Produkten (= fachlicher Einstieg).
 */
export function DeliverableListView({ onConfigure, layout = "list", className }: DeliverableListViewProps) {
  const items = deliverables.filter((d) => d.active);

  if (layout === "grid") {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6", className)}>
        {items.map((deliverable) => {
          const Icon = getDeliverableIcon(deliverable.id);
          const price = getMinimumPrice(deliverable);
          return (
            <article
              key={deliverable.id}
              className="group flex flex-col rounded-xl border border-border bg-light dark:bg-darkmode-light p-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-text-light dark:text-darkmode-text-light" />
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold leading-snug text-text dark:text-darkmode-text line-clamp-2">
                      {deliverable.name}
                    </h3>
                    <p className="text-xs text-text-light dark:text-darkmode-text-light">{deliverable.family}</p>
                  </div>
                </div>
                <p className="text-sm text-text-light dark:text-darkmode-text-light leading-relaxed line-clamp-3">
                  {deliverable.shortDescription}
                </p>
              </div>
              {price > 0 && (
                <p className="mt-4 text-sm text-text-light dark:text-darkmode-text-light">
                  ab <span className="font-semibold text-text dark:text-darkmode-text">{formatPrice(price)}</span>
                </p>
              )}
              <Button type="button" variant="default" className="mt-4 w-full" onClick={() => onConfigure(deliverable.id)}>
                Baustein konfigurieren
              </Button>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <ul className={cn("divide-y divide-border rounded-2xl border border-border overflow-hidden", className)}>
      {items.map((deliverable) => {
        const Icon = getDeliverableIcon(deliverable.id);
        const price = getMinimumPrice(deliverable);

        return (
          <li
            key={deliverable.id}
            className="group bg-light dark:bg-darkmode-light hover:bg-body dark:hover:bg-darkmode-body transition-colors"
          >
            <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-text-light dark:text-darkmode-text-light" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-text dark:text-darkmode-text truncate">
                      {deliverable.name}
                    </h3>
                    <span className="hidden md:inline text-xs text-text-light dark:text-darkmode-text-light shrink-0">
                      · {deliverable.family}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-text-light dark:text-darkmode-text-light line-clamp-1">
                    {deliverable.shortDescription}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                {price > 0 && (
                  <span className="text-sm text-text-light dark:text-darkmode-text-light whitespace-nowrap">
                    ab <span className="font-semibold text-text dark:text-darkmode-text">{formatPrice(price)}</span>
                  </span>
                )}
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="shrink-0"
                  onClick={() => onConfigure(deliverable.id)}
                >
                  Baustein konfigurieren
                </Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
