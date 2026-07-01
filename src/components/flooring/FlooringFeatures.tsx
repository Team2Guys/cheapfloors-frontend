import Link from 'next/link';
import {
  FaMoneyBillWave,
  FaTruck,
  FaArchive,
  FaDraftingCompass,
  FaExclamationTriangle,
} from 'react-icons/fa';
import Container from '../common/container/Container';

const features = [
  {
    icon: FaMoneyBillWave,
    title: 'Wholesale Pricing',
    desc: 'Trade-exclusive rates for bulk volume orders.',
  },
  {
    icon: FaTruck,
    title: 'Fast UAE Delivery',
    desc: 'Next-day dispatch to any Emirate from local stock.',
  },
  {
    icon: FaArchive,
    title: 'Live Inventory',
    desc: 'Real-time stock availability across SPC & LVT ranges.',
  },
  {
    icon: FaDraftingCompass,
    title: 'Sample Kits',
    desc: 'Free material samples are sent for project sign-off.',
  },
];

export const FlooringFeatures = () => {
  return (
    <section>
      {/* Feature cards */}
      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
            >
              <Icon className="text-3xl text-primary" />
              <h3 className="mt-4 text-18 font-bold text-secondary md:text-20">{title}</h3>
              <p className="mt-2 text-14 leading-relaxed text-[#6B6B6B] md:text-15">{desc}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* Retail notice bar */}
      <div className="px-4 md:px-0">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-lg bg-primary px-5 py-3 text-center text-13 font-medium text-secondary md:max-w-none md:rounded-none md:text-14">
          <FaExclamationTriangle className="text-14" />
          <span>
            <span className="font-semibold">Note for Retail Customers:</span> This page is for{' '}
            <span className="font-bold underline">Bulk Inquiries Only</span>. For residential
            flooring, please visit our{' '}
            <Link href="https://maps.app.goo.gl/t4dm6MhpgeraVkBH8" target='_blank' className="font-bold underline hover:opacity-80">
              Retail Showroom
            </Link>
            .
          </span>
        </div>
      </div>
    </section>
  );
};
