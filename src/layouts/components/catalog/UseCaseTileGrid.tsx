import type { UseCase } from "../data/useCases";
import { Button } from "./ui/button";
import { formatPrice } from "../lib/pricing";
import { cn } from "../lib/utils";

const intentLabels: Record<string, string> = {
  transparency: "Transparenz",
  automation: "Automatisierung",
  insights: "Insights",
  compliance: "Compliance",
  scale: "Skalierung",
};

interface UseCaseTileGridProps {
  useCases: UseCase[];
  onSelect: (useCaseId: string) => void;
  title?: string;
  subtitle?: string;
  /** Map: useCaseId -> günstigster Einstiegspreis ("ab"). */
  fromPriceById?: Record<string, number>;
  className?: string;
}

export function UseCaseTileGrid({
  useCases,
  onSelect,
  title,
  subtitle,
  fromPriceById,
  className,
}: UseCaseTileGridProps) {
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
    <div className={cn("space-y-8", className)}>
      {(title || subtitle) && (
        <div className="space-y-2">
          {title && (
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-text dark:text-darkmode-text">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-base text-text-light dark:text-darkmode-text-light max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
        {useCases.map((useCase) => {
          const tags = useCase.tags.intent
            .slice(0, 2)
            .map((intent) => intentLabels[intent] ?? intent);

          return (
            <article
              key={useCase.id}
              className="group flex flex-col rounded-2xl border border-border bg-light dark:bg-darkmode-light p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-semibold leading-snug text-text dark:text-darkmode-text line-clamp-2">
                  {useCase.title}
                </h3>
                <p className="text-sm text-text-light dark:text-darkmode-text-light leading-relaxed line-clamp-3">
                  {useCase.short}
                </p>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-text-light dark:text-darkmode-text-light"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {(fromPriceById?.[useCase.id] ?? 0) > 0 && (
                <p className="mt-4 text-sm text-text-light dark:text-darkmode-text-light">
                  Bausteine ab{" "}
                  <span className="font-semibold text-text dark:text-darkmode-text">
                    {formatPrice(fromPriceById![useCase.id])}
                  </span>
                </p>
              )}

              <Button
                type="button"
                variant="default"
                className="mt-4 w-full"
                onClick={() => onSelect(useCase.id)}
              >
                Produktbausteine ansehen
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
