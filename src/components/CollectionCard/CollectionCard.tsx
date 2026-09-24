import Image from 'next/image';
import Link from 'next/link';
import { ISUBCATEGORY } from 'types/cat';
import { IProduct } from 'types/prod';
import { FiEye } from 'react-icons/fi';
import Collapsearrow from 'components/svg/collapse-arrow';
import Leftright from 'components/svg/leftright';
import TwoArrow from 'components/svg/twoarrow';
import { DiscountBadge, PricePill } from 'components/Card/CardParts';

const CollectionCard = ({ subcategory }: { subcategory: ISUBCATEGORY }) => {
  const subcategoryUrl = subcategory.category
    ? `/${subcategory.category.RecallUrl}/${subcategory.custom_url}`
    : `/${subcategory.custom_url}`;

  // Extract dimensions, with fallback to subcategory products
  const feature = subcategory.sizes?.[0] || subcategory.products?.[0]?.sizes?.[0];
  const thickness = feature?.thickness || subcategory.products?.[0]?.thickness;
  const width = feature?.width || subcategory.products?.[0]?.plankWidth;
  const height = feature?.height || subcategory.products?.[0]?.sizes?.[0]?.height;

  // Highest discount among the collection's published products.
  const maxDiscount = Math.max(
    0,
    ...(subcategory.products || [])
      .filter((product) => !product.status || product.status === 'PUBLISHED')
      .map((product) => {
        const price = Number(product.price);
        const discountPrice = Number(product.discountPrice);
        return price > 0 && discountPrice > 0 && discountPrice < price
          ? Math.round(((price - discountPrice) / price) * 100)
          : 0;
      })
  );

  // Cheapest published product (by discounted price if set), shown on the
  // price pill as the collection's starting price.
  const cheapest = (subcategory.products || [])
    .filter(
      (product) =>
        (!product.status || product.status === 'PUBLISHED') &&
        Number(product.price) > 0
    )
    .reduce<IProduct | undefined>(
      (min, product) => {
        const effective = (p: IProduct) =>
          Number(p.discountPrice) > 0 ? Number(p.discountPrice) : Number(p.price);
        return !min || effective(product) < effective(min) ? product : min;
      },
      undefined
    );

  const formatDim = (val?: string) => {
    if (!val) return '';
    const trimmed = val.trim();
    if (trimmed.toLowerCase().endsWith('mm')) return trimmed;
    return `${trimmed}mm`;
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-1 xsm:p-3 flex flex-col justify-between font-inter h-full hover:shadow-md transition duration-300 group">
      <div>
        {/* Image section with Eye Icon button in top-right */}
        <div className="relative w-full aspect-[4/3] overflow-hidden mb-3">
          <Link href={subcategoryUrl} className="block w-full h-full relative">
            <Image
              src={subcategory.posterImageUrl?.imageUrl || '/default-image.jpg'}
              alt={subcategory.posterImageUrl?.altText || subcategory.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </Link>
          {maxDiscount > 0 && <DiscountBadge percentage={maxDiscount} />}
          <Link
            href={subcategoryUrl}
            className="absolute top-2 left-2 xsm:-left-40 xsm:group-hover:left-2 z-10 transition-all duration-300 size-6 xsm:size-9 bg-white rounded-md flex items-center justify-center border border-[#E5E7EB] shadow-sm hover:text-primary transition"
            aria-label="View collection details"
          >
            <FiEye className="text-black text-base xsm:text-xl" />
          </Link>
        </div>

        {/* Technical Specs Bar */}
        {(height || width || thickness) && (
          <div className="border-y border-[#E5E7EB] py-3.5 mb-4 flex items-center justify-around gap-2 text-gray-500">
            {height && (
              <div className="flex items-center gap-0.5">
                <Leftright />
                <span className="text-[#8A96A3] font-medium text-[8px] xs:text-[9px] xsm:text-xs sm:text-sm">
                  {formatDim(height)}
                </span>
              </div>
            )}
            {width && (
              <div className="flex items-center gap-0.5">
                <Collapsearrow />
                <span className="text-[#8A96A3] font-medium text-[8px] xs:text-[9px] xsm:text-xs sm:text-sm">
                  {formatDim(width)}
                </span>
              </div>
            )}
            {thickness && (
              <div className="flex items-center gap-0.5">
                <TwoArrow />
                <span className="text-[#8A96A3] font-medium text-[8px] xs:text-[9px] xsm:text-xs sm:text-sm">
                  {formatDim(thickness)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Title */}
        <Link
          href={subcategoryUrl}
          className="block font-semibold text-[#191C1F] text-sm xsm:text-base md:text-lg hover:text-primary transition line-clamp-2 mb-2 leading-tight"
        >
          {subcategory.name}
        </Link>

        {/* Item count */}
        <p className="text-sm xsm:text-base md:text-lg text-[#562506] mb-4">
          {subcategory.products?.length || 0}{' '}
          {subcategory.products?.length === 1 ? 'Item' : 'Items'}
        </p>
      </div>

      {/* Price + button */}
      {cheapest ? (
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <PricePill
            href={subcategoryUrl}
            label={`View ${subcategory.name}`}
            price={cheapest.price}
            discountPrice={cheapest.discountPrice}
          />
          <Link
            href={subcategoryUrl}
            className="shrink-0 px-2 xsm:px-3 md:px-5 py-1.5 xsm:py-2 md:py-2.5 rounded-full border border-[#FEB907] text-[#191C1F] font-semibold text-center hover:bg-[#FEB907] hover:text-white transition duration-300 w-fit text-[10px] xsm:text-xs md:text-base"
          >
            View All
          </Link>
        </div>
      ) : (
        <Link
          href={subcategoryUrl}
          className="w-full py-2 rounded-full border border-[#FEB907] text-[#191C1F] font-semibold text-center hover:bg-[#FEB907] hover:text-white transition duration-300 block text-sm md:text-base font-inter"
        >
          View All
        </Link>
      )}
    </div>
  );
};

export default CollectionCard;
