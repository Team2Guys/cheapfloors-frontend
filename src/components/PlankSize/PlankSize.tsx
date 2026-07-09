import Image from 'next/image';
import Container from 'components/common/container/Container';

const plankSizes = [
  { label: 'AVERAGE HUMAN', value: '1,700 mm' },
  { label: 'PRIME / LUXURY', value: '1,525 × 228 mm' },
  { label: 'Eco/Comfort', value: '1,220 × 183 mm' },
  { label: 'Herringbone', value: '640 × 128 mm' }
];

const PlankSize = () => {
  return (
    <Container className="mt-10 md:mt-16 mb-10 font-inter">
      <div className="border border-[#F3E7C4] overflow-hidden bg-white">
        {/* Header */}
        <div className="bg-primary text-center px-4 py-5 md:py-6">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold uppercase tracking-wide text-black">
            Plank Size Guide
          </h2>
          <p className="mt-1 text-xs sm:text-sm md:text-base text-black/80">
            Clear comparison with average human height
          </p>
        </div>

        {/* Infographic */}
        <div className="px-3 sm:px-6 md:px-10 pt-6 md:pt-10">
          <Image
            src="/assets/images/Home/plank-size-guide.webp"
            alt="Plank size comparison showing plank widths and lengths next to a 1,700 mm tall person"
            width={1679}
            height={879}
            loading="lazy"
            fetchPriority="low"
            className="w-full h-auto object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 92vw, 1679px"
          />
        </div>

        {/* Size cards */}
        <div className="px-3 sm:px-6 md:px-10 pb-6 md:pb-10 pt-4 md:pt-6">
          <div className="grid grid-cols-4 gap-1 xsm:gap-2 sm:gap-3 md:gap-4">
            {plankSizes.map((plank) => (
              <div
                key={plank.label}
                className="rounded-lg bg-[#FCF6E7] text-center px-1.5 sm:px-4 md:px-8 py-3 md:py-4 w-fit mx-auto"
              >
                <p className="text-[6px] xs:text-[7px] xsm:text-[11px] sm:text-sm md:text-base font-medium text-secondary whitespace-nowrap">
                  {plank.label}
                </p>
                <p
                  className='mt-1 text-[6px] xs:text-[7px] xsm:text-[11px] sm:text-sm md:text-base text-black whitespace-nowrap font-normal'
                >
                  {plank.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PlankSize;
