import { LayoutGrid, List } from "lucide-react";
import { cn } from "../lib/utils";

export type ViewLayout = "grid" | "list";

interface ViewToggleProps {
  value: ViewLayout;
  onChange: (value: ViewLayout) => void;
}

/** Umschalter Kacheln/Liste – wiederverwendbar für Produkte und Produktbausteine. */
export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div
      className="inline-flex rounded-lg border border-border p-0.5 bg-light dark:bg-darkmode-light shrink-0"
      role="group"
      aria-label="Ansicht wählen"
    >
      <button
        type="button"
        aria-pressed={value === "list"}
        onClick={() => onChange("list")}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          value === "list"
            ? "bg-body dark:bg-darkmode-body text-text dark:text-darkmode-text shadow-sm"
            : "text-text-light dark:text-darkmode-text-light"
        )}
      >
        <List className="h-4 w-4" /> Liste
      </button>
      <button
        type="button"
        aria-pressed={value === "grid"}
        onClick={() => onChange("grid")}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          value === "grid"
            ? "bg-body dark:bg-darkmode-body text-text dark:text-darkmode-text shadow-sm"
            : "text-text-light dark:text-darkmode-text-light"
        )}
      >
        <LayoutGrid className="h-4 w-4" /> Kacheln
      </button>
    </div>
  );
}
