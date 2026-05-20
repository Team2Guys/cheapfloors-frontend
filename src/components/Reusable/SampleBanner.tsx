import Container from 'components/common/container/Container';
import Image from 'next/image';
import Link from 'next/link';
const bannerImage = '/assets/images/Home/free_sample.webp';
const truckImage = '/assets/images/Home/truckLogo.webp';

const SampleBanner = () => {
  return (
    <Container>
      <div className="border-t-[#00000033] border-t-[1px] sm:hidden"></div>
      <div className="h-auto w-full mt-7 xl:mt-14">
        <Link href="/collections"
          className="w-full h-full relative"
        >
          <Image
            src={bannerImage}
            alt="Free Sample"
            loading="lazy"
            fill
            quality={100}
            className="!relative"
            sizes='100vw'
          />
        </Link>
        <div className="flex bg-[#FEC538] items-center border-b-[#00000033] border-b-[1px] justify-between w-full sm:border-b-2 relative py-6">
          <div className="w-6/12 xs:w-7/12 lg:w-2/3 overflow-hidden md:w-8/12 2xl:w-9/12">
            <div className="h-5 w-10 sm:h-[64px] sm:w-24 xl:h-[120px] xl:w-[150px]">
              <Image
                src={truckImage}
                fill
                alt="image"
                loading="lazy"
                className="animate-moveTruck !relative"
                sizes="(max-width: 768px) 100px, 200px"
              />
            </div>
          </div>
          <div className="bg-[#FEC538]">
            <h2 className="text-sm text-end text-nowrap font-inter 2xl:text-4xl font-medium lg:text-2xl md:pr-7 md:text-lg pr-2 sm:text-base xl:text-3xl">
              Free Samples UAE Wide
            </h2>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SampleBanner;
