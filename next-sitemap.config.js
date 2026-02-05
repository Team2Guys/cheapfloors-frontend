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
module.exports = {
  siteUrl: 'https://easyfloors.ae/',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 5000,
  outDir: './public', // Will be generated after build
  exclude: excludePages, // optional

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
 const [products, categories, subcategories, accessories] = await Promise.all([
      fetchProductsForSitemap(),
      fetchcategoryForSitemap(),
      fetchsubcategoryForSitemap(),
      fetchAccessoriesForSitemap()
    ])


const staticPages = [
    {
      loc: '/thank-you',
      lastmod: new Date().toISOString(),
    },
  ]

       const categoryPaths = categories.map((category) => ({
      loc: `/${category.custom_url}`,
      lastmod: new Date().toISOString(),
    }));
    
    const subcategoryPaths = subcategories.map((subcategory) => ({
      loc: `/${subcategory.category?.RecallUrl}/${subcategory.custom_url}`,
      lastmod: new Date().toISOString(),
    }));

   const productPaths = products.map((product) => ({
      loc: `/${product.category?.RecallUrl}/${product.subcategory?.custom_url}/${product.custom_url}`,
      lastmod: new Date().toISOString(),
    })); 
   const accessoriesPaths = accessories.map((product) => ({
      loc: `/${product.category?.RecallUrl}/${product.custom_url}`,
      lastmod: new Date().toISOString(),
    })); 

        return [...staticPages ,...categoryPaths, ...subcategoryPaths, ...productPaths,...accessoriesPaths];

  },
};
