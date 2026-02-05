import { socialLinks } from 'data/data';
import Link from 'next/link';
import React from 'react';
import { BiLogoFacebook } from 'react-icons/bi';
import { FaInstagram, FaPinterestP } from 'react-icons/fa';

interface SocialProps {
  className?: string;
}

const SocialIcon = ({ className }: SocialProps) => {
  return (
    <div
      className={`space-x-1 xs:space-x-2 2xl:space-x-5 flex items-center ${className}`}
    >
      {socialLinks.map((link, index) => (
        <Link
          key={index}
          className="bg-white w-[18px] h-[18px] sm:w-[24px] sm:h-[24px] flex_center border "
          target={link.target}
          href={link.href}
          aria-label={`Visit our ${link.alt} page`}
        >
          {link.alt === 'facebook' && (
            <BiLogoFacebook className={link.className} />
          )}
          {link.alt === 'instagram' && (
            <FaInstagram className={link.className} />
          )}
          {link.alt === 'pinterest' && (
            <FaPinterestP className={link.className} />
          )}
        </Link>
      ))}
    </div>
  );
};

export default SocialIcon;
