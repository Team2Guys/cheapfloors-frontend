import Link from 'next/link';

// Dirham sign in the site's currency font.
const DIRHAM = '';

const Currency = () => (
  <span className="font-currency font-normal mr-0.5">{DIRHAM}</span>
);

// Yellow "51% OFF" badge in the image's top-right corner (Figma spec): a
// square with a large bottom-left radius so it curves into the image.
export const DiscountBadge = ({ percentage }: { percentage: number }) => (
  <div className="absolute top-0 right-0 z-10 w-16 h-16 sm:w-24 sm:h-24 bg-primary rounded-[30px_30px_30px_200px] flex flex-col items-end justify-center text-white font-bold leading-tight pr-2 pointer-events-none">
    <span className="text-lg sm:text-3xl mr-2">{percentage}%</span>
    <span className="text-sm sm:text-xl">OFF</span>
  </div>
);

// Yellow price pill: "Was" (struck through) above "Now" in red, or just the
// price when there is no discount.
export const PricePill = ({
  href,
  label,
  price,
  discountPrice,
  className = ''
}: {
  href: string;
  label: string;
  price?: number | string;
  discountPrice?: number | string;
  className?: string;
}) => {
  const hasDiscount = Number(discountPrice) > 0;
  return (
    <Link
      href={href}
      aria-label={label}
      className={`mr-auto min-w-0 w-fit bg-primary hover:bg-primary/90 transition rounded-[14px] xsm:rounded-[20px] md:rounded-[26px] px-2 xsm:px-3 md:px-4 py-1 xsm:py-1.5 md:py-2 flex flex-col items-start justify-center leading-tight ${className}`}
    >
      {hasDiscount ? (
        <>
          <span className="text-[9px] xsm:text-[11px] md:text-sm text-black whitespace-nowrap">
            Was: <Currency />
            <span className="line-through">{price}/m²</span>
          </span>
          <span className="text-[10px] xsm:text-xs md:text-base font-semibold text-red-600 whitespace-nowrap">
            Now: <Currency />
            {discountPrice}/m²
          </span>
        </>
      ) : (
        <span className="text-[11px] xsm:text-sm md:text-base font-semibold text-black whitespace-nowrap">
          <Currency />
          {price}/m²
        </span>
      )}
    </Link>
  );
};
