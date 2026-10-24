import { IProduct } from 'types/prod';

// A subcategory or category is "mostly out of stock" when more than half of
// its products have no stock left; such entries are listed last in the
// header menu and the home page category sliders.
export type StockCount = { total: number; outOfStock: number };

export const isMostlyOutOfStock = (count?: StockCount) =>
  !!count && count.total > 0 && count.outOfStock / count.total > 0.5;

export const isOutOfStock = (product: IProduct) => !(Number(product.stock) > 0);

// Keyed by "<category RecallUrl>/<subcategory custom_url>", since subcategory
// urls like "spc-eco" repeat across brands.
export const subcategoryKey = (recallUrl?: string, subUrl?: string) =>
  `${recallUrl}/${subUrl}`;

export const countStockBySubcategory = (products: IProduct[] = []) => {
  const counts = new Map<string, StockCount>();
  products.forEach((product) => {
    const key = subcategoryKey(
      product.category?.RecallUrl,
      product.subcategory?.custom_url
    );
    const count = counts.get(key) ?? { total: 0, outOfStock: 0 };
    count.total += 1;
    if (isOutOfStock(product)) count.outOfStock += 1;
    counts.set(key, count);
  });
  return counts;
};

export const sumStockCounts = (counts: (StockCount | undefined)[]) =>
  counts.reduce<StockCount>(
    (sum, count) => ({
      total: sum.total + (count?.total ?? 0),
      outOfStock: sum.outOfStock + (count?.outOfStock ?? 0)
    }),
    { total: 0, outOfStock: 0 }
  );
