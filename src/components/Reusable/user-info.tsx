import Container from 'components/common/container/Container';
import { HomeUserInfo } from 'data/data';
import Image from 'next/image';

const UserInfo = () => {
  return (
    <Container className="lg:mt-20">
      {HomeUserInfo.map((section, index) => (
        <div
          key={index}
          className={`my-10 flex flex-col md:flex-row items-center gap-8 max-md:flex-col-reverse font-inter ${section.reverse ? 'md:flex-row-reverse' : ''}`}
        >
          <div className="text-center flex-1">
            <div className="flex flex-col items-center space-y-2 lg:space-y-3 max-w-[80%] md:max-w-[90%] 2xl:max-w-[77%] mx-auto">
              <Image
                width={100}
                height={100}
                className="w-[24px] h-[24px] md:w-[57px] md:h-[57px]"
                loading="lazy"
                src={section.icon}
                alt={section.title}
              />
              <h2 className="md:text-26 2xl:text-[34px] font-semibold">
                {section.title}
              </h2>
              <p className="mt-2 text-sm lg:text-base 2xl:text-20 font-light text-justify">
                {section.description}
              </p>
            </div>
          </div>
          <div className="flex-1">
            <Image
              width={848}
              height={501}
              src={section.image}
              loading="lazy"
              alt={section.title}
            />
          </div>
        </div>
      ))}
    </Container>
  );
};

export default UserInfo;
