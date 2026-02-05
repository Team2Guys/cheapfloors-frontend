import Container from 'components/common/container/Container';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import TopLink from './top-link';
import SocialIcon from 'components/Reusable/social-icon';
import UserIcon from './user-icon';

const TopNav = () => {
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER;
  const email = process.env.NEXT_PUBLIC_EMAIL;
  return (
    <div className="bg-primary py-2 relative">
      <Container className="flex_between">
        <div>
          <SocialIcon className=" lg:hidden" />
          <div className="lg:flex items-center gap-7 hidden">
            <Link
              href={`tel:${phoneNumber}`}
              target="_blank"
              className="flex items-center gap-2 text-white text-10 xl:text-sm 2xl:text-base font-inter font-normal"
            >
              <Image
                width={20}
                height={20}
                src="/assets/images/icon/telephone.png"
                alt="email"
                loading="lazy"
              />
              <p>{phoneNumber}</p>
            </Link>
            <Link
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-white text-10 xl:text-sm 2xl:text-base font-inter font-normal"
            >
              <Image
                width={20}
                height={14}
                src="/assets/images/icon/email.png"
                loading="lazy"
                alt="email"
              />
              <p>{email}</p>
            </Link>
          </div>
        </div>
        <div className="block lg:hidden">
          <TopLink />
        </div>
        <div className="flex items-center gap-5">
          <TopLink className="hidden lg:flex" />
          <UserIcon className="flex lg:hidden" />
          <SocialIcon className="hidden lg:flex" />
        </div>
      </Container>
    </div>
  );
};

export default TopNav;
