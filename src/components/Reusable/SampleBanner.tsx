import Container from 'components/common/container/Container';
import Image from 'next/image';
const bannerImage = '/assets/images/Home/free_sample_image.webp';
const truckImage = '/assets/images/Home/truckLogo.webp';

const SampleBanner = () => {
  return (
    <Container>
      <div className="border-t-[#00000033] border-t-[1px] sm:hidden"></div>
      <div className="h-auto w-full mt-7 xl:mt-14">
        <div
          className="w-full h-auto mx-auto max-w-[200px] max-h-[189px]
             lg:max-w-[500px] lg:max-h-[472px]
             xl:max-w-[610px] xl:max-h-[576px]
             2xl:max-w-[676px] 2xl:max-h-[638px]"
        >
          <Image
            src={bannerImage}
            alt="Free Sample"
            loading="lazy"
            fill
            quality={85}
            className="!relative"
            sizes="(max-width: 768px) 200px, 600px"
          />
        </div>
        <div className="flex border-b-[#00000033] border-b-[1px] justify-between w-full items-end mt-5 sm:border-b-2 relative">
          <div className="w-6/12 xs:w-7/12 lg:w-2/3 overflow-hidden md:w-8/12 2xl:w-9/12">
            <div className="h-5 w-10 sm:h-[64px] sm:w-24 xl:h-[138px] xl:w-[150px]">
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
          <div className="bg-white">
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
