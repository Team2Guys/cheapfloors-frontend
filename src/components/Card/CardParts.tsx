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

// Yellow price pill that fills the row up to the icons: "Was" (struck
// through) and "Now" in red. Below xl it wraps to two lines when the card is
// too narrow (phones/tablets); from xl up it stays on one line and the text
// scales with the pill's own width (cqi units) so it always fits.
// Shows just the price when there is no discount.
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
      className={`flex-1 min-w-0 bg-primary hover:bg-primary/90 transition rounded-full px-2 md:px-2.5 xl:px-1.5 2xl:px-3 py-1.5 xsm:py-2 md:py-2.5 flex flex-wrap xl:flex-nowrap xl:[container-type:inline-size] items-center justify-center gap-x-1 md:gap-x-1.5 xl:gap-x-1 leading-tight ${className}`}
    >
      {hasDiscount ? (
        <>
          <span className="text-[9px] xsm:text-[11px] xl:text-[clamp(9px,6cqi,14px)] text-black whitespace-nowrap">
            Was: <Currency />
            <span className="line-through">{price}/m²</span>
          </span>
          <span className="text-[10px] xsm:text-[13px] xl:text-[clamp(10px,7cqi,16px)] font-semibold text-red-600 whitespace-nowrap">
            Now: <Currency />
            {discountPrice}/m²
          </span>
        </>
      ) : (
        <span className="text-[11px] xsm:text-sm 2xl:text-base font-semibold text-black whitespace-nowrap">
          <Currency />
          {price}/m²
        </span>
      )}
    </Link>
  );
};
