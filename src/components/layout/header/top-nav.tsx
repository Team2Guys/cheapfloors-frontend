import Container from 'components/common/container/Container';
import Link from 'next/link';
import TopLink from './top-link';
import SocialIcon from 'components/Reusable/social-icon';
import UserIcon from './user-icon';
import { FiPhone } from 'react-icons/fi';
import { BsEnvelope } from 'react-icons/bs';

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
              className="flex items-center gap-2 text-white lg:text-black text-10 xl:text-sm 2xl:text-base font-inter font-normal"
            >
              <FiPhone className="text-xl text-white lg:text-black" />
              <p>{phoneNumber}</p>
            </Link>
            <Link
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-white lg:text-black text-10 xl:text-sm 2xl:text-base font-inter font-normal"
            >
              <BsEnvelope className="text-xl text-white lg:text-black" />
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
