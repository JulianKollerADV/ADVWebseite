import { useState, useEffect } from 'react';
import { TopBar } from './TopBar';
import { FinderPanel } from './FinderPanel';
import { BundleView } from './BundleView';
import { ConfigView } from './ConfigView';
import { CartButton } from './CartButton';
import { CartSheet } from './CartSheet';
import { HeroEmptyState } from './HeroEmptyState';
import { Sheet, SheetContent } from './ui/sheet';
import { Button } from './ui/button';
import { useConfigStore } from '../stores/configStore';
import { getUseCaseById, getUseCasesForUiCluster, type UiClusterId } from '../data/useCases';
import { getBundleForUseCase } from '../data/recommendations';
import { ListFilter } from 'lucide-react';

/**
 * Demo Shop App - Moderner interaktiver Konfigurator
 * Layout: TopBar + 3 Spalten (Finder | Content | Cart Button)
 * Flow: Domain -> Use Case -> Bundle -> Konfiguration
 */
export default function DemoShopApp() {
  const [activeDomainId, setActiveDomainId] = useState<string | null>(null); // intern erhalten
  const [activeCluster, setActiveCluster] = useState<UiClusterId | null>(
    "orientation_prioritization"
  );
  const [activeUseCaseId, setActiveUseCaseId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'bundle' | 'configure'>('bundle');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [finderOpen, setFinderOpen] = useState(false);

  const setBundleFromUseCase = useConfigStore((state) => state.setBundleFromUseCase);
  const setActiveUseCase = useConfigStore((state) => state.setActiveUseCase);

  // Stable selector: derive cart count from plain state (not a method call)
  const cartCount = useConfigStore((state) =>
    Object.values(state.selectedDeliverables).filter(d => d.enabled).length
  );

  // Handle Cluster Selection
  const handleClusterChange = (cluster: UiClusterId | null) => {
    setActiveCluster(cluster);
    setActiveUseCaseId(null);
    setViewMode('bundle');
  };

  // Handle Use Case Selection
  const handleUseCaseSelect = (useCaseId: string) => {
    if (!useCaseId) return;
    setActiveUseCaseId(useCaseId);
    setActiveUseCase(useCaseId);
    setBundleFromUseCase(useCaseId);
    setViewMode('bundle');
    setFinderOpen(false); // close mobile finder
    const selected = getUseCaseById(useCaseId);
    setActiveDomainId(selected?.domain ?? null); // interne Domain-Logik bleibt nutzbar

    setTimeout(() => {
      const middlePanel = document.querySelector('[data-middle-panel]');
      if (middlePanel) middlePanel.scrollTop = 0;
    }, 100);
  };

  // Handle Bundle -> Configuration
  const handleNextToConfiguration = () => {
    setViewMode('configure');
    setTimeout(() => {
      const middlePanel = document.querySelector('[data-middle-panel]');
      if (middlePanel) middlePanel.scrollTop = 0;
    }, 100);
  };

  // Handle Back Navigation
  const handleBack = () => {
    if (viewMode === 'configure') {
      setViewMode('bundle');
    } else if (activeUseCaseId) {
      setActiveUseCaseId(null);
      setActiveUseCase(null);
    }
  };

  // Handle Cart -> Config (works even without use case)
  const handleGoToConfig = () => {
    setViewMode('configure');
    setCartOpen(false);
  };

  // Dev Sanity Checks
  useEffect(() => {
    if (activeUseCaseId && process.env.NODE_ENV === 'development') {
      const recommendations = getBundleForUseCase(activeUseCaseId);
      if (recommendations.length === 0) {
        console.warn(`[DemoShopApp] No recommendations found for useCaseId: ${activeUseCaseId}`);
      }
    }
  }, [activeUseCaseId]);

  const useCase = activeUseCaseId ? getUseCaseById(activeUseCaseId) : null;
  const hasMatchesForSelection = activeCluster ? getUseCasesForUiCluster(activeCluster).length > 0 : false;
  const isSelectionStep = !useCase;
  const isConfigurationStep = viewMode === 'configure' && (cartCount > 0 || Boolean(useCase));
  const isRecommendationStep = !isSelectionStep && !isConfigurationStep;
  const progressSteps = [
    { key: 'selection', label: 'Auswahl', active: isSelectionStep },
    { key: 'recommendation', label: 'Empfehlung', active: isRecommendationStep },
    { key: 'configuration', label: 'Konfiguration', active: isConfigurationStep },
  ];

  // Determine what to render in the content area
  const renderContent = () => {
    // Cart-driven config: always works if cart has items
    if (viewMode === 'configure' && cartCount > 0) {
      return <ConfigView useCaseId={activeUseCaseId} onBack={handleBack} />;
    }
    // No use case selected
    if (!useCase) {
      return <HeroEmptyState />;
    }
    // Bundle view
    if (viewMode === 'bundle') {
      return (
        <BundleView
          useCaseId={activeUseCaseId}
          onNext={handleNextToConfiguration}
          onBack={handleBack}
        />
      );
    }
    // Config view (with use case)
    return <ConfigView useCaseId={activeUseCaseId} onBack={handleBack} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-body dark:bg-darkmode-body text-text dark:text-darkmode-text">
      {/* TopBar with Domain Tabs */}
      <TopBar
        activeCluster={activeCluster}
        onClusterChange={handleClusterChange}
        hasMatchesForSelection={hasMatchesForSelection}
      />

      {/* Main Content */}
      <main className="flex-1 min-h-0">
        <div className="container mx-auto h-full px-4 py-6">
          <div className="grid grid-cols-12 gap-6 h-full min-h-0">

            {/* Left: Finder Panel (desktop only) */}
            <aside className="hidden lg:flex lg:col-span-3 min-h-0 flex-col">
              <FinderPanel
                activeCluster={activeCluster}
                activeUseCaseId={activeUseCaseId}
                onSelectUseCase={handleUseCaseSelect}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </aside>

            {/* Middle: Content Panel */}
            <section
              data-middle-panel
              className="col-span-12 lg:col-span-9 min-h-0 overflow-y-auto"
            >
              <div className="mb-4 rounded-lg border border-border bg-light/70 dark:bg-darkmode-light/70 px-3 py-2">
                <div className="flex flex-wrap items-center gap-2">
                  {progressSteps.map((step, idx) => (
                    <div key={step.key} className="flex items-center gap-2">
                      <span
                        className={[
                          'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                          step.active
                            ? 'bg-green-500/10 text-green-700 dark:text-green-400 ring-1 ring-green-600/20 dark:ring-green-400/20'
                            : 'bg-body/60 text-text-light dark:text-darkmode-text-light',
                        ].join(' ')}
                      >
                        {idx + 1}. {step.label}
                      </span>
                      {idx < progressSteps.length - 1 && (
                        <span className="text-xs text-text-light dark:text-darkmode-text-light">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {activeCluster && !useCase && (
                <div className="mb-4 rounded-lg border border-border bg-light/70 dark:bg-darkmode-light/70 px-4 py-3">
                  <p className="text-sm font-medium text-text dark:text-darkmode-text">
                    Wählen Sie danach einen konkreten Use Case aus.
                  </p>
                  <p className="text-xs text-text-light dark:text-darkmode-text-light mt-1">
                    Wir schlagen Ihnen daraufhin passende Leistungsbausteine vor.
                  </p>
                </div>
              )}

              {/* Mobile: Finder trigger (when domain selected but no use case) */}
              {!useCase && (
                <div className="lg:hidden mb-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => setFinderOpen(true)}
                  >
                    <ListFilter className="h-4 w-4" />
                    Use Cases durchsuchen
                  </Button>
                </div>
              )}

              {renderContent()}
            </section>
          </div>
        </div>
      </main>

      {/* Mobile: Finder Sheet */}
      <Sheet open={finderOpen} onOpenChange={setFinderOpen}>
        <SheetContent side="left" className="w-[85vw] sm:w-96 p-0">
          <div className="h-full overflow-hidden">
            <FinderPanel
              activeCluster={activeCluster}
              activeUseCaseId={activeUseCaseId}
              onSelectUseCase={handleUseCaseSelect}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Cart Button (Floating) */}
      <CartButton onClick={() => setCartOpen(true)} />

      {/* Cart Sheet */}
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
