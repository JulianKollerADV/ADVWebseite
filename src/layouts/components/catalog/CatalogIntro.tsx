import { cn } from "../lib/utils";

interface CatalogIntroProps {
  className?: string;
}

/**
 * Kurzer Einstieg ohne Schritt-für-Schritt-Erklärung.
 */
export function CatalogIntro({ className }: CatalogIntroProps) {
  return (
    <div className={cn("space-y-3 pb-2", className)}>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-text dark:text-darkmode-text leading-tight">
        Passendes Produkt finden und konfigurieren
      </h1>
      <p className="text-base md:text-lg text-text-light dark:text-darkmode-text-light max-w-2xl leading-relaxed">
        Suchen Sie nach einem Produkt oder wählen Sie eine Domäne. Jedes Produkt besteht aus
        passenden, einzeln konfigurierbaren Produktbausteinen.
      </p>
    </div>
  );
}
