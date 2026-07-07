import React from 'react';
import Link from 'next/link';
import Container from 'components/common/container/Container';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
export const metadata = createMetadata(pageMetadataData.shipping_policy);

const Shipping = () => {
  return (
    <Container className="pt-5 md:pt-20 pb-20 space-y-4 font-inter">
      <h1 className="text-center text-24 sm:text-36 font-semibold mb-4">
        Shipping Policy
      </h1>
      <p className="text-sm sm:text-20 sm:leading-[26px] text-justify">
        Our goal is to guarantee that your order is delivered to all mainland
        locations in the UAE within 2 to 3 working days, which ensures a smooth
        and hassle-free buying experience. You can contact us any time at{' '}
        <Link
          href="mailto:cs@easyfloors.ae"
          className="font-normal text-primary"
          target='_blank'
        >
          cs@easyfloors.ae
        </Link>{' '}
        for further information or any clarification regarding our delivery
        process. Your satisfaction is our priority.
      </p>

      <h2 className="text-sm sm:text-20 sm:leading-[26px] font-semibold">
        Shipping Fee:
      </h2>
      <h2 className=" text-20 sm:text-24 font-semibold">
        Express Service (Dubai Only)
      </h2>
      <ul className="list-disc px-6 text-sm sm:text-20 sm:leading-[26px]">
        <li>Delivery: Next working day (cut-off time 1pm)</li>
        <li>
          Delivery Cost:{' '}
          <span className="font-currency font-normal sm:text-25"></span> 150
        </li>
      </ul>
      <h2 className=" text-20 sm:text-24 font-semibold">
        Standard Service (Dubai)
      </h2>
      <ul className="list-disc px-6 text-sm sm:text-20 sm:leading-[26px]">
        <li>Delivery: 2 working days</li>
        <li>Delivery Cost: Free</li>
      </ul>
      <h2 className=" text-20 sm:text-24 font-semibold">
        Standard Service (All Other Emirates)
      </h2>
      <ul className="list-disc px-6 text-sm sm:text-20 sm:leading-[26px]">
        <li>Delivery: 2-3 working days</li>
        <li>
          Delivery Cost: Free for orders above{' '}
          <span className="font-currency font-normal sm:text-25"></span> 2,000.{' '}
          <span className="font-currency font-normal sm:text-25"></span> 200
          delivery charge applies for orders below{' '}
          <span className="font-currency font-normal sm:text-25"></span> 1,999.
        </li>
      </ul>

      <h2 className=" text-20 sm:text-24 font-semibold">Self-Collect</h2>
      <ul className="list-disc px-6 text-sm sm:text-20 sm:leading-[26px]">
        <li>Monday to Saturday, 9am – 6pm</li>
        <li>
          Location:{' '}
          <Link
            href="https://maps.app.goo.gl/BBJjwVKgTK4PPTWR8"
            className="font-normal text-primary"
            target='_blank'
          >
            24, 22nd street - Al Quoz Industrial Area 4 - Dubai - UAE
          </Link>
        </li>
      </ul>

      <div className="overflow-hidden rounded-lg">
        <iframe
          title="Easy Floors Showroom Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3269.1510190571935!2d55.2357386!3d25.1177844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f69fca32528d3%3A0x63e4dd6474477d84!2sEasyFloors%20-%20Affordable%20Flooring!5e1!3m2!1sen!2s!4v1782991951523!5m2!1sen!2s"
          className="w-full h-[300px] sm:h-[450px] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      
    </Container>
  );
};

export default Shipping;
