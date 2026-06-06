/**
 * Product-Zielmodell (Phase 2 – Vorbereitung, NICHT aktiv konsumiert)
 * ====================================================================
 *
 * Dieses Modell beschreibt die künftige, Strapi-fähige Form eines
 * Katalog-Eintrags. Es ersetzt `UseCase` (useCases.ts) NICHT, sondern
 * ergänzt es kompatibel. Die UI nutzt weiterhin `UseCase`.
 *
 * Migrationsstrategie:
 *   1. (jetzt)  Zielmodell + Adapter typisieren, lokal ableiten.
 *   2. (später) Komponenten schrittweise auf `Product` umstellen.
 *   3. (später) `UseCase` entfernen, sobald keine Komponente mehr darauf zugreift.
 *
 * Was NICHT hierher gehört (bleibt im Code):
 *   - Preislogik (pricing.ts)
 *   - Warenkorb/Store (configStore.ts)
 *   - Inquiry/Cart-Logik (lib/inquiry.ts)
 *   - technische Fallback-/Rule-Engine (recommendations.ts)
 */

import type {
  UseCase,
  UiClusterId,
  IntentTag,
  DataScopeTag,
} from "./useCases";
import {
  useCases,
  getUiClusterForUseCase,
  uiClusterLabels,
  uiClusterOrder,
} from "./useCases";

/** Publikationsstatus, analog zu Strapi Draft/Publish. */
export type ProductStatus = "draft" | "published";

/** SEO-Block (in Strapi als Component vorgesehen). */
export interface ProductSeo {
  /** Optionaler Meta-Title; Fallback = title. */
  metaTitle?: string;
  /** Optionale Meta-Description; Fallback = short. */
  metaDescription?: string;
}

/** Beschreibender Detail-Block (entspricht UseCase.details, ohne Legacy-Feld). */
export interface ProductDetails {
  problem: string;
  typicalResult: string;
  bestFor: string[];
}

/** Frei kombinierbare Tags / Facetten (Strapi: relationale Tag-Collection denkbar). */
export interface ProductTags {
  intent: IntentTag[];
  dataScope: DataScopeTag;
}

/**
 * Product = künftiger Katalog-Eintrag.
 * Bewusst schlanker als `UseCase`: enthält nur produktiv genutzte Felder.
 */
export interface Product {
  /** Stabiler Schlüssel (entspricht UseCase.id). */
  id: string;
  /** URL-Slug; Fallback = id. */
  slug: string;
  title: string;
  short: string;
  details?: ProductDetails;
  /** Primäres UI-Cluster (Navigation, Gruppierung). */
  primaryCluster: UiClusterId;
  tags: ProductTags;
  seo: ProductSeo;
  status: ProductStatus;
  /** Hebt Featured-/Fokus-Produkte hervor (aus UseCase.priority abgeleitet). */
  featured: boolean;
}

/** Taxonomie-Eintrag (Cluster/Domäne) – in Strapi eigene Collection. */
export interface TaxonomyCluster {
  id: UiClusterId;
  label: string;
  /** Reihenfolge in Navigation/Drawer. */
  sortOrder: number;
}

/**
 * Recommendation-Zielmodell (Product -> Deliverable).
 * Spiegelt `Recommendation` aus recommendations.ts, ergänzt um `sortOrder`.
 * Die Rule-Engine selbst bleibt im Code; Strapi liefert später nur die
 * kuratierten (Hard-Override-)Bundles.
 */
export interface ProductRecommendation {
  productId: string;
  deliverableId: string;
  reason: string;
  defaultEnabled: boolean;
  sortOrder: number;
}

/* ──────────────────────────────────────────────────────────────────────────
   Adapter: lokale UseCase-Daten -> Product-Zielmodell
   (rein ableitend, ohne Seiteneffekte; noch nicht in der UI verdrahtet)
   ────────────────────────────────────────────────────────────────────────── */

/** Wandelt einen einzelnen UseCase in das Product-Zielmodell. */
export function useCaseToProduct(useCase: UseCase): Product {
  return {
    id: useCase.id,
    slug: useCase.slug ?? useCase.id,
    title: useCase.title,
    short: useCase.short,
    details: useCase.details
      ? {
          problem: useCase.details.problem,
          typicalResult: useCase.details.typicalResult,
          bestFor: useCase.details.bestFor,
        }
      : undefined,
    primaryCluster: getUiClusterForUseCase(useCase),
    tags: {
      intent: useCase.tags.intent,
      dataScope: useCase.tags.data_scope,
    },
    seo: {
      metaTitle: useCase.title,
      metaDescription: useCase.short,
    },
    status: "published",
    featured: useCase.priority === "green",
  };
}

/** Alle lokalen UseCases als Product-Liste (Default-Quelle). */
export function getLocalProducts(): Product[] {
  return useCases.map(useCaseToProduct);
}

/** Cluster-Taxonomie aus der bestehenden UI-Cluster-Definition. */
export function getLocalTaxonomy(): TaxonomyCluster[] {
  return uiClusterOrder.map((id, index) => ({
    id,
    label: uiClusterLabels[id],
    sortOrder: index,
  }));
}
