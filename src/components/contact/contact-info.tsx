import Link from 'next/link';
import React from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { IoMailSharp } from 'react-icons/io5';
import { PiPhoneCallFill } from 'react-icons/pi';

const ContactInfo = () => {
  return (
    <div className="p-2 sm:p-6">
      <h1 className="text-24 sm:text-28 font-inter font-semibold leading-8 text-white">
        Contact Information
      </h1>
      <div className="mt-5 sm:mt-8 lg:mt-10 space-y-3 lg:space-y-6">
        <div className="flex gap-6 items-center text-white">
          <PiPhoneCallFill size={20} />
          <Link target="_blank" href="tel:+971 50 597 4385">
            +971 50 597 4385
          </Link>
        </div>
        <div className="flex gap-6 items-center text-white">
          <IoMailSharp size={20} />
          <Link href="mailto:Info@easyfloors.ae">Info@easyfloors.ae</Link>
        </div>
        <div className="flex gap-4 md:gap-6 text-white">
          <FaLocationDot size={22} />
          <Link
            target="_blank"
            className="pl-3 sm:pl-0"
            href="https://maps.app.goo.gl/t4dm6MhpgeraVkBH8"
          >
            22nd 15B St - Al Quoz - Al Quoz Industrial{' '}
            <br className="hidden sm:block" />
            Area 4 - Dubai - UAE
          </Link>
        </div>
      </div>
      <div className="mt-5 md:mt-20">
        <iframe
          className="w-full h-[200px] lg:h-[280px] rounded-lg shadow-lg border border-gray-200"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4073.5032841777415!2d55.2357386!3d25.1177844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f69fca32528d3%3A0x63e4dd6474477d84!2sEasy%20Floors%20-%20Floorings!5e1!3m2!1sen!2s!4v1752045484880!5m2!1sen!2s"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          title="Easy Floors Location in Jebel Ali"
        >
        </iframe>
      </div>
    </div>
  );
};

export default ContactInfo;
