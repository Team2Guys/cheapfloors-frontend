/** @type {import('next-sitemap').IConfig} */
//eslint-disable-next-line
const { fetchProductsForSitemap ,fetchcategoryForSitemap, fetchsubcategoryForSitemap, fetchAccessoriesForSitemap} = require('./src/config/sitemap-data');
const excludePages =  [
          '/dashboard*',
          '/cart',
          '/login',
          '/forgot-password',
          '/Wishlist',
          '/thank-you',
          '/search/{search_term_string}',
          "/easy-payment",
          "/forgot-password",
          "/cart",
          "/checkout",
          "/signup",
          "/wishlist",
          "/freesample",
          "/thank-you",
          "/thank-you",
          "/freesample-checkout"
        ]
// A published route is one whose own status AND every ancestor's status is
// 'PUBLISHED' — mirrors the notFound() logic in the app's route pages, so the
// sitemap only ever lists routes that actually render (not DRAFT/dead ones).
const PUBLISHED = 'PUBLISHED';
const isLive = (status) => status === PUBLISHED;

// Build a valid W3C <lastmod> from the item's own content dates. Falls back to
// createdAt, then (only if the CMS has no date at all) to build time.
const buildTime = new Date().toISOString();
const toLastmod = (item) => {
  const raw = item && (item.updatedAt || item.createdAt);
  if (!raw) return buildTime;
  // Handle ISO strings as well as epoch-millis stored as numeric strings.
  const value =
    typeof raw === 'string' && /^\d+$/.test(raw) ? Number(raw) : raw;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? buildTime : date.toISOString();
};

module.exports = {
  siteUrl: 'https://easyfloors.ae/',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 5000,
  outDir: './public', // Will be generated after build
  exclude: excludePages, // optional
  // Don't stamp a build-time <lastmod> on statically-discovered pages: a
  // timestamp that changes every deploy is a freshness signal search engines
  // learn to distrust. See `transform` below.
  autoLastmod: false,

  // Statically-discovered app routes (about-us, faqs, ...) have no per-page
  // content date, so we emit only <loc> — dropping the blanket
  // `changefreq: daily` / `priority: 0.7` rather than sending a uniform, and
  // therefore meaningless, freshness signal on every URL. CMS-driven pages get
  // their real per-page <lastmod> via additionalPaths below.
  transform: async (config, path) => ({ loc: path }),

   robotsTxtOptions: {
    policies: [
    {
      userAgent: 'Googlebot',
      allow: '/',
    },
    {
      userAgent: 'Googlebot-Image',
      allow: '/',
    },
    {
      userAgent: '*',
      disallow: excludePages,
    },
  ],
    additionalSitemaps: ['https://easyfloors.ae/sitemap.xml']},


    additionalPaths: async () => {
      const [products, categories, subcategories, accessories] =
        await Promise.all([
          fetchProductsForSitemap(),
          fetchcategoryForSitemap(),
          fetchsubcategoryForSitemap(),
          fetchAccessoriesForSitemap(),
        ]);

      const staticPages = [
        {
          loc: '/thank-you',
          lastmod: buildTime,
        },
      ];

      // Category landing page: /{custom_url}
      const categoryPaths = categories
        .filter((category) => isLive(category.status) && category.custom_url)
        .map((category) => ({
          loc: `/${category.custom_url}`,
          lastmod: toLastmod(category),
        }));

      // Subcategory page: /{category.RecallUrl}/{custom_url}
      // Live only when both the subcategory and its parent category are published.
      const subcategoryPaths = subcategories
        .filter(
          (subcategory) =>
            isLive(subcategory.status) &&
            isLive(subcategory.category?.status) &&
            subcategory.category?.RecallUrl &&
            subcategory.custom_url
        )
        .map((subcategory) => ({
          loc: `/${subcategory.category.RecallUrl}/${subcategory.custom_url}`,
          lastmod: toLastmod(subcategory),
        }));

      // Product page: /{category.RecallUrl}/{subcategory.custom_url}/{custom_url}
      // Live only when the product, its subcategory and its category are all published.
      const productPaths = products
        .filter(
          (product) =>
            isLive(product.status) &&
            isLive(product.subcategory?.status) &&
            isLive(product.category?.status) &&
            product.category?.RecallUrl &&
            product.subcategory?.custom_url &&
            product.custom_url
        )
        .map((product) => ({
          loc: `/${product.category.RecallUrl}/${product.subcategory.custom_url}/${product.custom_url}`,
          lastmod: toLastmod(product),
        }));

      // Accessory page: /{category.RecallUrl}/{custom_url}
      const accessoriesPaths = accessories
        .filter(
          (accessory) =>
            isLive(accessory.status) &&
            isLive(accessory.category?.status) &&
            accessory.category?.RecallUrl &&
            accessory.custom_url
        )
        .map((accessory) => ({
          loc: `/${accessory.category.RecallUrl}/${accessory.custom_url}`,
          lastmod: toLastmod(accessory),
        }));

      return [
        ...staticPages,
        ...categoryPaths,
        ...subcategoryPaths,
        ...productPaths,
        ...accessoriesPaths,
      ];
    },
};
