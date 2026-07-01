import Image from 'next/image';
import Container from '../common/container/Container';

const trustImage = '/assets/images/flooring/trust.png';

const stats = [
  { value: '500+', label: 'Projects Completed' },
  { value: '15+', label: 'Years of Experience' },
  { value: '1.2M', label: 'SQM Flooring Supplied' },
];

export const FlooringTrust = () => {
  return (
    <section className="font-inter bg-white py-12 md:py-16">
      <Container className="grid grid-cols-1 items-center gap-10 px-5 lg:grid-cols-2 lg:gap-14">
        <div className='max-w-md'>
          <p className="uppercase text-primary">
            Proven Track Record
          </p>
          <h2 className="mt-3 text-2xl font-bold text-secondary md:text-5xl">
            Trusted by UAE Contractors &amp; <span className="text-primary">Developers</span>
          </h2>

          <div className="mt-8 space-y-5 md:mt-10">
            {stats.map((stat) => (
              <div key={stat.value} className="flex items-center gap-4">
                <span className="min-w-[90px] text-32 font-extrabold text-secondary md:text-40">
                  {stat.value}
                </span>
                <span className="max-w-[150px] text-11 font-semibold uppercase leading-tight tracking-wide text-[#9a9a9a] md:text-12">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- RIGHT ---------------- */}
        <div className="relative">
          <div className="relative h-[280px] md:h-auto md:aspect-[650/500] overflow-hidden rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
            <Image
              src={trustImage}
              alt="Modern UAE office interior with premium flooring"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 600px"
            />
          </div>

          {/* Testimonial card */}
          <div className="absolute bottom-4 left-4 right-4 z-10 bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] md:right-auto md:max-w-sm">
            <p className="text-13 italic leading-relaxed text-[#555]">
              &ldquo;Al-Sada Flooring has been our primary partner for three major residential
              developments in Dubai Hills. Their stock consistency and B2B pricing are
              unmatched.&rdquo;
            </p>
            <p className="mt-3 text-13 font-bold text-secondary">
              &mdash; Senior Architect, EMAAR Partner
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};
