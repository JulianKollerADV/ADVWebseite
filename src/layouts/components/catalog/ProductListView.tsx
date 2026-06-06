import type { UseCase } from "../data/useCases";
import { getUiClusterForUseCase, uiClusterLabels } from "../data/useCases";
import { Button } from "./ui/button";
import { formatPrice } from "../lib/pricing";
import { cn } from "../lib/utils";

interface ProductListViewProps {
  useCases: UseCase[];
  onSelect: (useCaseId: string) => void;
  /** Map: useCaseId -> günstigster Einstiegspreis ("ab"). */
  fromPriceById?: Record<string, number>;
  className?: string;
}

/**
 * Kompakte Listenansicht: Name · Kurzbeschreibung · Domäne · ab-Preis · CTA.
 * Alternative zur Kachelansicht für schnelles Scannen/Vergleichen.
 */
export function ProductListView({
  useCases,
  onSelect,
  fromPriceById,
  className,
}: ProductListViewProps) {
  if (useCases.length === 0) {
    return (
      <div className={cn("py-16 text-center", className)}>
        <p className="text-text dark:text-darkmode-text font-medium mb-1">
          Keine Produkte gefunden
        </p>
        <p className="text-sm text-text-light dark:text-darkmode-text-light">
          Passen Sie Suche oder Domäne an.
        </p>
      </div>
    );
  }

  return (
    <ul className={cn("divide-y divide-border rounded-2xl border border-border overflow-hidden", className)}>
      {useCases.map((useCase) => {
        const domainLabel = uiClusterLabels[getUiClusterForUseCase(useCase)];
        const fromPrice = fromPriceById?.[useCase.id] ?? 0;

        return (
          <li
            key={useCase.id}
            className="group bg-light dark:bg-darkmode-light hover:bg-body dark:hover:bg-darkmode-body transition-colors"
          >
            <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-text dark:text-darkmode-text truncate">
                    {useCase.title}
                  </h3>
                  <span className="hidden md:inline text-xs text-text-light dark:text-darkmode-text-light shrink-0">
                    · {domainLabel}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-text-light dark:text-darkmode-text-light line-clamp-1">
                  {useCase.short}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end sm:w-auto">
                {fromPrice > 0 && (
                  <span className="text-sm text-text-light dark:text-darkmode-text-light whitespace-nowrap">
                    Bausteine ab <span className="font-semibold text-text dark:text-darkmode-text">{formatPrice(fromPrice)}</span>
                  </span>
                )}
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="shrink-0"
                  onClick={() => onSelect(useCase.id)}
                >
                  Produktbausteine ansehen
                </Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
