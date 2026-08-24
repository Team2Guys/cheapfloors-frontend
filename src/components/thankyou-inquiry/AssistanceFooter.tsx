import Image from 'next/image';
import Link from 'next/link';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';

const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || '+971 50 597 4385';
const whatsappLink = `https://wa.me/${phoneNumber.replace('+', '').replace(/\s+/g, '')}`;

const stats = [
    { value: '500+', label: 'Projects Done' },
    { value: '15+', label: 'Years Exp.' },
    { value: '1.2M', label: 'SQM Supplied' },
];

const footerLinks = [
    { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Office Location', href: '/contact-us' },
];

export const AssistanceFooter = () => {
    return (
        <section className="max-w-6xl mx-auto  pb-12 font-inter">
            <div className="mx-auto max-w-2xl">
                {/* Need Immediate Assistance */}
                <div className="bg-black px-6 py-10 text-center">
                    <h2 className="text-20 font-bold text-white md:text-22">
                        Need Immediate Assistance?
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-14 leading-relaxed text-white/70 md:text-15">
                        Our consultants are available for site visits or technical consultations.
                    </p>

                    <div className="mx-auto mt-6 flex max-w-xs flex-col gap-3">
                        <Link
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-15 font-semibold text-white transition-colors duration-300 hover:bg-[#20bd5a]"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 12H12V10H4V12ZM4 9H16V7H4V9ZM4 6H16V4H4V6ZM0 20V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H4L0 20ZM3.15 14H18V2H2V15.125L3.15 14ZM2 14V2V14Z" fill="white" />
                            </svg>

                            WhatsApp Us
                        </Link>
                        <Link
                            href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-15 font-semibold text-secondary transition-colors duration-300 hover:bg-primary/90"
                        >
                            <FaPhoneAlt className="text-15" />
                            {phoneNumber}
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-3 divide-x divide-gray-200 rounded-xl bg-white py-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="px-2 text-center">
                            <p className="text-24 font-bold text-secondary md:text-28">{stat.value}</p>
                            <p className="mt-1 text-11 font-semibold uppercase tracking-[0.1em] text-gray-500">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <footer className="mt-8 rounded-2xl bg-gray-100 px-6 py-10 text-center">
                    <Image
                        src="/assets/images/logo.webp"
                        alt="Cheap Floors"
                        width={120}
                        height={40}
                        className="mx-auto h-auto w-28 object-contain"
                    />

                    <div className="mt-5 space-y-1 text-13 text-gray-600">
                        <p>Agsons, J1 Warehouses, Jebel Ali Industrial &ndash; Dubai</p>
                        <p>TRN: 100xxxxxxxxx | sales@cheapfloors.ae</p>
                        <p>www.cheapfloors.ae</p>
                    </div>

                    <nav className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-12 font-semibold uppercase tracking-[0.08em] text-secondary transition-colors hover:text-primary"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <p className="mt-8 border-t border-gray-200 pt-6 text-12 text-gray-500">
                        &copy; {new Date().getFullYear()} Cheap Floors UAE. All Rights Reserved.
                    </p>
                </footer>
            </div>
        </section>
    );
};
