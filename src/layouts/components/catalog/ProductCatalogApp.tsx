import { useState, useEffect, useMemo } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { CatalogToolbar } from './CatalogToolbar';
import { DomainDrawer } from './DomainDrawer';
import { CatalogIntro } from './CatalogIntro';
import { UseCaseTileGrid } from './UseCaseTileGrid';
import { ProductListView } from './ProductListView';
import { DeliverableListView } from './DeliverableListView';
import { ViewToggle } from './ViewToggle';
import { BundleView } from './BundleView';
import { ConfigView } from './ConfigView';
import { CartButton } from './CartButton';
import { CartSheet } from './CartSheet';
import { Button } from './ui/button';
import { Boxes } from 'lucide-react';
import { useConfigStore } from '../stores/configStore';
import {
  getUseCaseById,
  getUseCasesForUiCluster,
  useCases,
  uiClusterLabels,
  type UiClusterId,
} from '../data/useCases';
import { getBundleForUseCase } from '../data/recommendations';
import { getDeliverableById, getMinimumPrice } from '../lib/pricing';

type ViewLayout = 'grid' | 'list';

// Kuratierte, vertriebsnahe Einstiege (nicht alphabetisch). Fallback: green-Priorität.
const FEATURED_IDS = [
  'management-dashboard',
  'sales-dashboard',
  'controlling-via-bi',
  'data-catalog',
  'dwh',
  'datenstrategie',
  'data-ai-leadership',
  'automatisierte-rechnungsverarbeitung',
  'ai-helpdeskassistent',
];

export default function ProductCatalogApp() {
  const [activeCluster, setActiveCluster] = useState<UiClusterId | null>(null);
  const [activeUseCaseId, setActiveUseCaseId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'bundle' | 'configure'>('bundle');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [domainDrawerOpen, setDomainDrawerOpen] = useState(false);
  const [viewLayout, setViewLayout] = useState<ViewLayout>('grid');
  const [showAll, setShowAll] = useState(false);
  const [showDeliverables, setShowDeliverables] = useState(false);

  const setBundleFromUseCase = useConfigStore((state) => state.setBundleFromUseCase);
  const setActiveUseCase = useConfigStore((state) => state.setActiveUseCase);
  const toggleDeliverable = useConfigStore((state) => state.toggleDeliverable);

  const cartCount = useConfigStore((state) =>
    Object.values(state.selectedDeliverables).filter((d) => d.enabled).length
  );

  const handleClusterSelect = (cluster: UiClusterId) => {
    setActiveCluster(cluster);
    setShowAll(false);
    setShowDeliverables(false);
    setActiveUseCaseId(null);
    setViewMode('bundle');
  };

  const handleShowAll = () => {
    setActiveCluster(null);
    setShowAll(true);
    setShowDeliverables(false);
    setActiveUseCaseId(null);
    setViewMode('bundle');
    setViewLayout('list'); // „Alle Produkte“ startet in Listenansicht
  };

  const handleShowDeliverables = () => {
    setActiveCluster(null);
    setShowAll(false);
    setShowDeliverables(true);
    setActiveUseCaseId(null);
    setViewMode('bundle');
    setViewLayout('list'); // „Alle Produktbausteine“ startet in Listenansicht
  };

  const handleConfigureDeliverable = (deliverableId: string) => {
    toggleDeliverable(deliverableId, true);
    setActiveUseCaseId(null);
    setViewMode('configure');
    setTimeout(() => {
      const panel = document.querySelector('[data-catalog-main]');
      if (panel) panel.scrollTop = 0;
    }, 100);
  };

  const handleUseCaseSelect = (useCaseId: string) => {
    if (!useCaseId) return;
    setShowDeliverables(false);
    setActiveUseCaseId(useCaseId);
    setActiveUseCase(useCaseId);
    setBundleFromUseCase(useCaseId);
    setViewMode('bundle');

    setTimeout(() => {
      const panel = document.querySelector('[data-catalog-main]');
      if (panel) panel.scrollTop = 0;
    }, 100);
  };

  const handleNextToConfiguration = () => {
    setViewMode('configure');
    setTimeout(() => {
      const panel = document.querySelector('[data-catalog-main]');
      if (panel) panel.scrollTop = 0;
    }, 100);
  };

  const handleBack = () => {
    if (viewMode === 'configure') {
      setViewMode('bundle');
      // Konfiguration aus „Alle Produktbausteine“: zurück zur Bausteinliste
      if (!activeUseCaseId && !showDeliverables) {
        setShowDeliverables(true);
      }
    } else if (activeUseCaseId) {
      setActiveUseCaseId(null);
      setActiveUseCase(null);
    }
  };

  const handleGoToConfig = () => {
    setViewMode('configure');
    setCartOpen(false);
  };

  useEffect(() => {
    if (activeUseCaseId && process.env.NODE_ENV === 'development') {
      const recommendations = getBundleForUseCase(activeUseCaseId);
      if (recommendations.length === 0) {
        console.warn(`[ProductCatalog] No product modules found for productId: ${activeUseCaseId}`);
      }
    }
  }, [activeUseCaseId]);

  const useCase = activeUseCaseId ? getUseCaseById(activeUseCaseId) : null;

  const filteredUseCases = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let pool = activeCluster
      ? getUseCasesForUiCluster(activeCluster)
      : useCases.filter((uc) => uc.priority === 'green');

    if (query) {
      pool = (activeCluster ? getUseCasesForUiCluster(activeCluster) : useCases).filter((uc) =>
        uc.title.toLowerCase().includes(query) ||
        uc.short.toLowerCase().includes(query) ||
        uc.tags.intent.some((intent) => intent.toLowerCase().includes(query))
      );
    }

    // Startansicht (ohne Domäne/Suche/„Alle Produkte“): kuratierte, vertriebsnahe Einstiege.
    if (!activeCluster && !query && !showAll) {
      const featured = FEATURED_IDS
        .map((id) => useCases.find((uc) => uc.id === id))
        .filter((uc): uc is NonNullable<typeof uc> => Boolean(uc));
      // Fallback, falls IDs fehlen: mit green-Priorität auffüllen.
      if (featured.length >= 6) return featured;
      const fallback = useCases.filter((uc) => uc.priority === 'green');
      return [...featured, ...fallback.filter((uc) => !FEATURED_IDS.includes(uc.id))].slice(0, 9);
    }

    return [...pool].sort((a, b) => {
      const aPriority = a.priority === 'green' ? 1 : 0;
      const bPriority = b.priority === 'green' ? 1 : 0;
      if (aPriority !== bPriority) return bPriority - aPriority;
      return a.title.localeCompare(b.title, 'de');
    });
  }, [activeCluster, searchQuery, showAll]);

  // "ab"-Preis je Produkt = günstigster Baustein im empfohlenen Set.
  const fromPriceById = useMemo(() => {
    const map: Record<string, number> = {};
    for (const uc of filteredUseCases) {
      const prices = getBundleForUseCase(uc.id)
        .map((rec) => {
          const deliverable = getDeliverableById(rec.deliverableId);
          return deliverable ? getMinimumPrice(deliverable) : 0;
        })
        .filter((p) => p > 0);
      if (prices.length > 0) map[uc.id] = Math.min(...prices);
    }
    return map;
  }, [filteredUseCases]);

  const tileTitle = useMemo(() => {
    if (searchQuery.trim()) return 'Suchergebnisse';
    if (activeCluster) return uiClusterLabels[activeCluster];
    if (showAll) return 'Alle Produkte';
    return 'Beliebte Einstiege';
  }, [activeCluster, searchQuery, showAll]);

  const tileSubtitle = useMemo(() => {
    if (searchQuery.trim()) {
      return `Treffer für „${searchQuery.trim()}“`;
    }
    if (activeCluster) {
      return `${filteredUseCases.length} ${filteredUseCases.length === 1 ? 'Produkt' : 'Produkte'} in diesem Bereich`;
    }
    if (showAll) {
      return `${filteredUseCases.length} Produkte insgesamt`;
    }
    return 'Wählen Sie „Alle Domänen“ oder „Alle Produkte“, um den Katalog zu durchsuchen.';
  }, [activeCluster, searchQuery, showAll, filteredUseCases.length]);

  const renderContent = () => {
    if (viewMode === 'configure' && cartCount > 0) {
      return <ConfigView useCaseId={activeUseCaseId} onBack={handleBack} onOpenCart={() => setCartOpen(true)} />;
    }

    if (!useCase && showDeliverables) {
      return (
        <div className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-text dark:text-darkmode-text">
                Alle Produktbausteine
              </h2>
              <p className="text-base text-text-light dark:text-darkmode-text-light max-w-2xl leading-relaxed">
                Kauf- und konfigurierbare Leistungen. Direkt konfigurieren und zur Anfrage hinzufügen.
              </p>
            </div>
            <ViewToggle value={viewLayout} onChange={setViewLayout} />
          </div>
          <DeliverableListView layout={viewLayout} onConfigure={handleConfigureDeliverable} />
        </div>
      );
    }

    if (!useCase) {
      const showIntro = !activeCluster && !searchQuery.trim() && !showAll;
      return (
        <div className="space-y-8">
          {showIntro && <CatalogIntro />}

          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-text dark:text-darkmode-text">
                  {tileTitle}
                </h2>
                <p className="text-base text-text-light dark:text-darkmode-text-light max-w-2xl leading-relaxed">
                  {tileSubtitle}
                </p>
              </div>

              <ViewToggle value={viewLayout} onChange={setViewLayout} />
            </div>

            {viewLayout === 'grid' ? (
              <UseCaseTileGrid
                useCases={filteredUseCases}
                onSelect={handleUseCaseSelect}
                fromPriceById={fromPriceById}
              />
            ) : (
              <ProductListView
                useCases={filteredUseCases}
                onSelect={handleUseCaseSelect}
                fromPriceById={fromPriceById}
              />
            )}

            {showIntro && (
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="default" size="lg" onClick={handleShowAll}>
                  Alle Produkte ansehen
                </Button>
                <Button variant="outline" size="lg" onClick={handleShowDeliverables}>
                  <Boxes className="h-4 w-4" />
                  Alle Produktbausteine ansehen
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (viewMode === 'bundle') {
      return (
        <BundleView
          useCaseId={activeUseCaseId}
          onNext={handleNextToConfiguration}
          onBack={handleBack}
          viewLayout={viewLayout}
          onViewLayoutChange={setViewLayout}
        />
      );
    }

    return <ConfigView useCaseId={activeUseCaseId} onBack={handleBack} onOpenCart={() => setCartOpen(true)} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-body dark:bg-darkmode-body text-text dark:text-darkmode-text">
      <CatalogToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCluster={activeCluster}
        onOpenDomains={() => setDomainDrawerOpen(true)}
      />

      <main className="flex-1 min-h-0" data-catalog-main>
        <div className="container mx-auto px-4 py-8 md:py-10 max-w-6xl">
          {renderContent()}
        </div>
      </main>

      <DomainDrawer
        open={domainDrawerOpen}
        onOpenChange={setDomainDrawerOpen}
        activeCluster={activeCluster}
        showAll={showAll}
        showDeliverables={showDeliverables}
        onSelectCluster={handleClusterSelect}
        onSelectProduct={handleUseCaseSelect}
        onShowAll={handleShowAll}
        onShowDeliverables={handleShowDeliverables}
      />

      <CartButton onClick={() => setCartOpen(true)} />

      {cartOpen && (
        <CartSheet
          open={cartOpen}
          onOpenChange={setCartOpen}
          onGoToConfig={cartCount > 0 ? handleGoToConfig : undefined}
        />
      )}
    </div>
  );
}
