import Container from 'components/common/container/Container';
import Image from 'next/image';
import Link from 'next/link';

const UserInfo = () => {
  return (
    <Container className="lg:mt-20">
      {/* First Section */}
      <div className="my-10 lg:my-16 flex flex-col md:flex-row items-center gap-8 max-md:flex-col-reverse font-inter">
        <div className="flex-1 flex justify-center w-full">
          <div className="flex flex-col items-center space-y-6 max-w-[95%] md:max-w-[85%] 2xl:max-w-[75%] mx-auto">
            <h2 className="text-3xl md:text-4xl 2xl:text-[45px] font-bold uppercase leading-tight text-center">
              <span className="text-primary block mb-2">SMART SAVINGS</span>
              <span className="text-black flex items-center justify-center gap-3">
                <svg width="35" height="10" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6C6 6 8 1 13 1C18 1 20 11 25 11C30 11 33 6 39 6" stroke="#FEB907" strokeWidth="3" strokeLinecap="round" />
                </svg>
                ON FLOORING
              </span>
            </h2>
            <p className="text-sm lg:text-base 2xl:text-[18px] font-normal text-justify text-black leading-relaxed">
              Save smart on flooring in the UAE with durable, low-maintenance options like SPC and vinyl, perfect for heat, humidity, and high traffic. Enjoy water-resistant, long-lasting floors with easy installation and great value. Premium quality, made affordable with EasyFloors.
            </p>
            <Link href="/collections">
              <button className="mt-2 bg-primary text-black text-sm md:text-base font-semibold py-3 px-8 rounded-full hover:bg-black hover:text-white transition-colors duration-300">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
        <div className="flex-1 w-full">
          <Image
            width={848}
            height={501}
            src="/assets/images/Home/smartsaving.webp"
            loading="lazy"
            alt="Smart Savings On Flooring"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Second Section */}
      <div className="my-10 lg:my-16 flex flex-col md:flex-row items-center gap-8 font-inter">
        <div className="flex-1 w-full">
          <Image
            width={848}
            height={501}
            src="/assets/images/Home/EFFORTLESS-INSTALLATION.webp"
            loading="lazy"
            alt="Effortless Installation"
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="flex-1 flex justify-center w-full">
          <div className="flex flex-col items-center space-y-8 max-w-[95%] md:max-w-[85%] 2xl:max-w-[75%] mx-auto">
            <div className="flex flex-col items-center">
              <h2 className="text-3xl md:text-4xl 2xl:text-[45px] font-bold uppercase leading-tight text-center">
                <span className="text-primary block mb-2">EFFORTLESS</span>
                <span className="text-black flex items-center justify-center gap-3">
                  <svg width="35" height="10" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 6C6 6 8 1 13 1C18 1 20 11 25 11C30 11 33 6 39 6" stroke="#FEB907" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  INSTALLATION
                </span>
              </h2>

              <div className="flex flex-col items-center mt-6">
                <p className="text-lg lg:text-xl font-medium text-black">Upgrade your Floors</p>
                <div className="relative inline-block mt-1">
                  <p className="text-lg lg:text-xl font-medium text-black italic">Without Any hassle!</p>
                  <svg className="absolute -bottom-1 left-0 w-full" width="100%" height="8" viewBox="0 0 100 8" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M2 6.5C30 1.5 70 1.5 98 6.5" stroke="#FEB907" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>

            <ul className="space-y-4 w-full max-w-[420px]">
              {[
                "Click-lock system for fast, easy installation",
                "No glue or mess—clean, simple setup process",
                "Perfect fit with smooth, hassle-free finish"
              ].map((text, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="min-w-[24px] h-[24px] mt-0.5 rounded-full border-2 border-primary flex items-center justify-center">
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 5L4.5 7.5L10 2" stroke="#FEB907" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-sm lg:text-base 2xl:text-[18px] text-black font-normal leading-tight">{text}</span>
                </li>
              ))}
            </ul>

            <Link href="/collections">
              <button className="mt-2 bg-primary text-black text-sm md:text-base font-semibold py-3 px-8 rounded-full hover:bg-black hover:text-white transition-colors duration-300">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default UserInfo;
