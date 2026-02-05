import Image from 'next/image';
import Link from 'next/link';
import { ISUBCATEGORY } from 'types/cat';

const CollectionCard = ({ subcategory }: { subcategory: ISUBCATEGORY }) => {
  return (
    <div className="md:px-2 hover:bg-[#FFF9F5] flex flex-col justify-between pb-2.5 font-inter">
      <Link
        href={`/${subcategory.category.RecallUrl}/${subcategory.custom_url}`}
      >
        <Image
          src={subcategory.posterImageUrl?.imageUrl || '/default-image.jpg'}
          alt={subcategory.posterImageUrl?.altText || subcategory.name}
          width={800}
          height={200}
          className="w-full h-24 sm:h-52 lg:h-80 object-cover overflow-hidden"
        />
      </Link>
      <div className="md:mb-3 md:p-4 font-light">
        <Link
          href={`/${subcategory.category.RecallUrl}/${subcategory.custom_url}`}
          className="lg:text-lg md:mt-0 mt-1 text-10 xs:text-[12px] text-left font-semibold text-[#594F55] block "
        >
          {subcategory.name}
        </Link>
        <p>
          Only <span className="font-currency font-normal text-20"></span>{' '}
          {subcategory.price}/m²
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center md:items-start lg:items-center justify-between md:py-2 py-1 gap-2 md:gap-4 w-full md:p-4 font-light">
        <p className="text-sm md:text-sm lg:text-base font-bold text-primary w-full md:w-full md:text-left">
          {subcategory.products?.length}{' '}
          {`${subcategory?.products && subcategory?.products?.length > 1 ? 'Items' : 'Item'}`}
        </p>
        <div className="w-full md:text-right">
          <Link
            href={`/${subcategory.category.RecallUrl}/${subcategory.custom_url}`}
            className="text-black px-3 lg:px-9 py-1.5 lg:py-3 text-[10px] md:text-[10px] lg:text-sm border-2 border-primary transition whitespace-nowrap hover:text-white hover:bg-primary font-semibold"
          >
            View All
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
