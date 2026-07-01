import Image from 'next/image';
import Link from 'next/link';
import { FaRegBuilding, FaLandmark, FaGlobe, FaBoxOpen, FaWhatsapp } from 'react-icons/fa';

const bannerImage = '/assets/images/flooring/flooring-banner.webp';

const tags = [
    { icon: FaRegBuilding, label: 'Corporate Clients' },
    { icon: FaLandmark, label: 'Govt & Education' },
    { icon: FaGlobe, label: 'GCC Resellers' },
    { icon: FaBoxOpen, label: 'Bulk Orders' },
];

const whatsappLink = `https://wa.me/${process.env.NEXT_PUBLIC_PHONE_NUMBER?.replace('+', '').replace(/\s+/g, '')}`;

export const BannerFlooring = () => {
    return (
        <section className="relative w-full overflow-hidden font-inter">
            {/* Background image */}
            <Image
                src={bannerImage}
                alt="SPC & LVT flooring supply showroom"
                fill
                priority
                sizes="100vw"
                className="object-cover"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/65" />

            {/* Content */}
            <div className="relative z-10 mx-auto flex min-h-[560px] max-w-4xl flex-col items-center justify-center px-5 py-16 text-center md:min-h-[620px] md:py-24">
                {/* Badge */}
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-black/30 px-4 py-1.5 text-11 font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur-sm md:text-12">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    B2B Portal — Exclusive Access
                </span>

                {/* Heading */}
                <h1 className="mt-6 text-32 font-bold leading-[1.1] text-white xs:text-4xl md:text-6xl">
                    UAE&apos;s Trusted Partner for
                    <br />
                    <span className="text-primary">SPC &amp; LVT Flooring Supply</span>
                </h1>

                {/* Subtitle */}
                <p className="mt-5 max-w-xl text-15 leading-relaxed text-white/80 md:text-18">
                    Supplying corporate clients, government projects, and regional resellers with architectural-grade SPC and LVT flooring. Reliable stock, competitive pricing, and UAE-wide logistics.
                </p>

                {/* Tags */}
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    {tags.map(({ icon: Icon, label }) => (
                        <span
                            key={label}
                            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-13 text-white backdrop-blur-sm md:text-14"
                        >
                            <Icon className="text-15 text-primary" />
                            {label}
                        </span>
                    ))}
                </div>

                {/* CTAs */}
                <div className="mt-9 flex w-full max-w-md flex-col items-center justify-center gap-4 xsm:flex-row">
                    <Link
                        href="/request-quote"
                        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-8 py-3.5 text-16 font-bold text-secondary transition-colors duration-300 hover:bg-primary/90 xsm:w-auto"
                    >
                        Request Quote
                    </Link>
                    <Link
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 px-8 py-3.5 text-16 font-bold text-white transition-colors duration-300 hover:bg-white/10 xsm:w-auto"
                    >
                        <FaWhatsapp className="text-18" />
                        WhatsApp Us
                    </Link>
                </div>
            </div>
        </section>
    );
};
