import Image from 'next/image';

const brands = [
  { name: 'Richmond Flooring', logo: '/assets/images/flooring/richmond.png' },
  { name: 'Polar Floors', logo: '/assets/images/flooring/polar.png' },
  { name: 'FloorSmart', logo: '/assets/images/flooring/floorsmart.png' },
];

export const FlooringBrands = () => {
  return (
    <section className="font-inter bg-[#F5F5F5] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5">
        {/* Heading */}
        <h2 className="text-center text-26 font-bold text-secondary md:text-32">
          Brands We Supply
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-13 leading-relaxed text-[#6B6B6B] md:text-15">
          Partnering with global leaders in architectural flooring.
        </p>

        {/* Brand cards */}
        <div className="mt-8 grid grid-cols-3 gap-3 md:mt-10 md:gap-6">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl p-4 md:p-8"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                sizes="100vw"
                quality={100}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
