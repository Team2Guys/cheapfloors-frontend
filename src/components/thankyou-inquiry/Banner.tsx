import Image from 'next/image';

const bannerImage = '/assets/images/flooring/flooring-banner.webp';

export const Banner = () => {
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
            <div className="relative z-10 mx-auto flex min-h-[420px] max-w-4xl flex-col items-center justify-center px-5 py-16 text-center md:min-h-[480px] md:py-24">
                {/* Badge */}
                <span className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-11 font-semibold uppercase tracking-[0.18em] text-secondary md:text-12">
                    Inquiry Received
                </span>

                {/* Heading */}
                <h1 className="mt-6 text-32 font-bold leading-[1.1] text-white xs:text-4xl md:text-5xl">
                    Thank You For Your Inquiry!
                </h1>

                {/* Subtitle */}
                <p className="mt-4 max-w-xl text-15 leading-relaxed text-white/80 md:text-18">
                    Your flooring quotation request has been successfully received.
                </p>
            </div>
        </section>
    );
};
