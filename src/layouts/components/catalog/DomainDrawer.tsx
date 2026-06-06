import { useState } from "react";
import { ChevronDown, LayoutGrid, Boxes } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import {
  getUseCasesForUiCluster,
  uiClusterLabels,
  uiClusterOrder,
  type UiClusterId,
} from "../data/useCases";
import { cn } from "../lib/utils";

interface DomainDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeCluster: UiClusterId | null;
  showAll: boolean;
  showDeliverables: boolean;
  onSelectCluster: (cluster: UiClusterId) => void;
  onSelectProduct: (useCaseId: string) => void;
  onShowAll: () => void;
  onShowDeliverables: () => void;
}

export function DomainDrawer({
  open,
  onOpenChange,
  activeCluster,
  showAll,
  showDeliverables,
  onSelectCluster,
  onSelectProduct,
  onShowAll,
  onShowDeliverables,
}: DomainDrawerProps) {
  const [expanded, setExpanded] = useState<UiClusterId | null>(activeCluster);

  const clusters = uiClusterOrder.filter(
    (id) => getUseCasesForUiCluster(id).length > 0
  );

  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="catalog-sheet flex flex-col h-full w-[min(100vw,23rem)] p-0">
        <SheetHeader className="px-5 pt-6 pb-4 border-b border-border text-left">
          <SheetTitle className="text-lg font-semibold">Domänen & Bereiche</SheetTitle>
          <p className="text-sm text-text-light dark:text-darkmode-text-light font-normal">
            Bereich aufklappen und direkt zum Produkt springen.
          </p>
        </SheetHeader>

        <nav className="overflow-y-auto flex-1 py-2" aria-label="Domänen">
          {/* Globale Einstiege */}
          <button
            type="button"
            onClick={() => {
              onShowAll();
              close();
            }}
            className={cn(
              "w-full flex items-center gap-2.5 px-5 py-3 text-left text-sm font-semibold",
              "border-l-2 transition-colors",
              "hover:bg-light/80 dark:hover:bg-darkmode-light/80 active:bg-green-500/10",
              showAll && !activeCluster && !showDeliverables
                ? "border-l-green-600 dark:border-l-green-400 bg-green-500/5 text-text dark:text-darkmode-text"
                : "border-l-transparent text-text dark:text-darkmode-text"
            )}
          >
            <LayoutGrid className="h-4 w-4 text-green-700 dark:text-green-400" />
            Alle Produkte
          </button>
          <button
            type="button"
            onClick={() => {
              onShowDeliverables();
              close();
            }}
            className={cn(
              "w-full flex items-center gap-2.5 px-5 py-3 text-left text-sm font-medium",
              "border-l-2 transition-colors",
              "hover:bg-light/80 dark:hover:bg-darkmode-light/80 active:bg-green-500/10",
              showDeliverables && !activeCluster && !showAll
                ? "border-l-green-600 dark:border-l-green-400 bg-green-500/5 text-text dark:text-darkmode-text"
                : "border-l-transparent text-text dark:text-darkmode-text"
            )}
          >
            <Boxes className={cn(
              "h-4 w-4",
              showDeliverables && !activeCluster && !showAll
                ? "text-green-700 dark:text-green-400"
                : "text-text-light dark:text-darkmode-text-light"
            )} />
            Alle Produktbausteine
          </button>

          <div className="my-1 border-t border-border" />
          <p className="px-5 pt-2 pb-1 text-xs font-medium uppercase tracking-wide text-text-light dark:text-darkmode-text-light">
            Nach Domäne
          </p>

          {clusters.map((clusterId) => {
            const products = getUseCasesForUiCluster(clusterId);
            const count = products.length;
            const isActive = activeCluster === clusterId;
            const isOpen = expanded === clusterId;

            return (
              <div key={clusterId}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setExpanded(isOpen ? null : clusterId)}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-5 py-3 text-left",
                    "border-l-2 transition-colors",
                    "hover:bg-light/80 dark:hover:bg-darkmode-light/80 active:bg-green-500/10",
                    isActive
                      ? "border-l-green-600 dark:border-l-green-400 bg-green-500/5"
                      : "border-l-transparent"
                  )}
                >
                  <span className="text-sm font-medium leading-snug text-text dark:text-darkmode-text">
                    {uiClusterLabels[clusterId]}{" "}
                    <span className="text-text-light dark:text-darkmode-text-light font-normal">
                      ({count})
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-text-light dark:text-darkmode-text-light transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="pb-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCluster(clusterId);
                        close();
                      }}
                      className={cn(
                        "w-full truncate text-left pl-10 pr-5 py-2 text-sm font-medium",
                        "text-green-700 dark:text-green-400",
                        "hover:bg-green-500/5 active:bg-green-500/10 transition-colors"
                      )}
                    >
                      Alle {count} Produkte anzeigen →
                    </button>
                    <ul>
                      {products.map((product) => (
                        <li key={product.id}>
                          <button
                            type="button"
                            onClick={() => {
                              onSelectProduct(product.id);
                              close();
                            }}
                            className={cn(
                              "w-full text-left pl-10 pr-5 py-2 text-sm",
                              "text-text-light dark:text-darkmode-text-light",
                              "hover:text-text dark:hover:text-darkmode-text",
                              "hover:bg-light/80 dark:hover:bg-darkmode-light/80 active:bg-green-500/10",
                              "transition-colors"
                            )}
                          >
                            {product.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
