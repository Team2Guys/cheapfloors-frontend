import { Category, ISUBCATEGORY } from 'types/cat';
import { IProduct, ProductImage } from 'types/prod';

/**
 * Server-side projections for the product listing pages.
 *
 * The category, clearance and free-sample pages hand their data to client
 * components, so every field they pass is serialised into the page HTML. The
 * full GraphQL records carry descriptions, FAQs, schema JSON, every gallery
 * image and, per product, a copy of every matching accessory with its own
 * images. The cards and the filter sidebar read none of that; the quick view
 * and the product page fetch the full record themselves. These helpers keep
 * only what the listing UI uses.
 */

type Dict = Record<string, unknown>;

// Omits undefined/null values so they are not serialised at all.
const compact = <T extends Dict>(obj: T): T => {
  const out: Dict = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) out[key] = value;
  }
  return out as T;
};

const slimImage = (image?: ProductImage | null): ProductImage | undefined =>
  image
    ? (compact({
        imageUrl: image.imageUrl,
        public_id: image.public_id ?? '',
        altText: image.altText,
        color: image.color,
        colorName: image.colorName,
        colorCode: image.colorCode
      }) as ProductImage)
    : undefined;

const slimImages = (images?: ProductImage[] | null) =>
  images?.map(slimImage).filter((image): image is ProductImage => !!image);

const isAccessory = (product: IProduct) =>
  product.__typename === 'Accessory' ||
  product.__typename === 'Accessories' ||
  product.category?.custom_url?.trim().toLowerCase() === 'accessories' ||
  product.category?.name?.trim().toLowerCase() === 'accessories';

/** Fields the product card, filters, sorting and add-to-cart read. */
export const toListProduct = (product: IProduct): IProduct => {
  const accessory = isAccessory(product);
  return compact({
    id: product.id,
    __typename: product.__typename,
    name: product.name,
    price: product.price,
    discountPrice: product.discountPrice,
    stock: product.stock,
    status: product.status,
    custom_url: product.custom_url,
    posterImageUrl: slimImage(product.posterImageUrl),
    // Flooring cards only use the first gallery image (cart thumbnail);
    // accessory cards pick images by colour, so they keep the whole set.
    productImages: slimImages(
      accessory ? product.productImages : product.productImages?.slice(0, 1)
    ),
    featureImages: accessory ? slimImages(product.featureImages) : undefined,
    waterproof: product.waterproof,
    thickness: product.thickness,
    plankWidth: product.plankWidth,
    ResidentialWarranty: product.ResidentialWarranty,
    CommmericallWarranty: product.CommmericallWarranty,
    colors: product.colors
      ?.filter((color) => !!color?.name)
      .map((color) => ({ name: color.name })),
    sizes: product.sizes,
    boxCoverage: product.boxCoverage,
    lengthPrice: product.lengthPrice,
    bundle: product.bundle,
    bundlePrice: product.bundlePrice,
    bundleDisPrice: product.bundleDisPrice,
    category: product.category
      ? compact({
          id: product.category.id,
          name: product.category.name,
          RecallUrl: product.category.RecallUrl,
          custom_url: product.category.custom_url,
          status: product.category.status
        })
      : undefined,
    subcategory: product.subcategory
      ? compact({
          id: product.subcategory.id,
          name: product.subcategory.name,
          custom_url: product.subcategory.custom_url,
          status: product.subcategory.status
        })
      : undefined
  }) as unknown as IProduct;
};

const slimSubcategory = (sub: Partial<ISUBCATEGORY>) =>
  compact({
    id: sub.id,
    name: sub.name,
    custom_url: sub.custom_url,
    status: sub.status,
    price: sub.price,
    sizes: sub.sizes,
    category: sub.category?.RecallUrl
      ? { RecallUrl: sub.category.RecallUrl }
      : undefined
  });

/** What the filter sidebar reads from the list of all categories. */
export const toFilterCategory = (category: Category): Category =>
  compact({
    id: category.id,
    name: category.name,
    custom_url: category.custom_url,
    RecallUrl: category.RecallUrl,
    status: category.status,
    subcategories: category.subcategories?.map(slimSubcategory),
    recalledSubCats: category.recalledSubCats?.map(slimSubcategory)
  }) as unknown as Category;

/** The category a listing page shows: filter fields plus what the page renders. */
export const toCategoryPageData = (category: Category): Category =>
  compact({
    ...toFilterCategory(category),
    Heading: category.Heading,
    topHeading: category.topHeading,
    description: category.description,
    FAQS: category.FAQS,
    posterImageUrl: slimImage(category.posterImageUrl),
    whatAmiImageBanner: slimImage(category.whatAmiImageBanner),
    BannerImage: slimImage(category.BannerImage),
    products: category.products?.map(toListProduct)
  }) as unknown as Category;

/** The subcategory rows a subcategory page renders (heading, intro, banner, FAQs). */
export const toSubcategoryPageData = (
  sub: Partial<ISUBCATEGORY>
): ISUBCATEGORY =>
  compact({
    ...slimSubcategory(sub),
    description: sub.description,
    FAQS: sub.FAQS,
    posterImageUrl: slimImage(sub.posterImageUrl),
    BannerImage: slimImage(sub.BannerImage)
  }) as unknown as ISUBCATEGORY;
