import Container from "../common/container/Container";

const steps = [
  {
    num: '01',
    title: 'Submit Inquiry',
    desc: 'Tell us your project scope, product type, and volume.',
  },
  {
    num: '02',
    title: 'We Review',
    desc: 'Our team checks stock availability and technical fit.',
  },
  {
    num: '03',
    title: 'Receive Quote',
    desc: 'You get a detailed B2B invoice with pricing and lead times.',
  },
  {
    num: '04',
    title: 'Supply & Delivery',
    desc: 'Direct site delivery with professional loading support.',
  },
];

export const FlooringWorkflow = () => {
  return (
    <section className="font-inter py-12 md:py-16">
      <Container className="px-5">
        {/* Heading */}
        <p className="text-center text-12 font-bold uppercase tracking-[0.18em] text-primary">
          WORKFLOW EFFICIENCY
        </p>
        <h2 className="mt-2 text-center text-30 font-bold text-secondary md:text-40">
          What Happens <span className="text-primary">Next?</span>
        </h2>

        {/* Steps */}
        <div className="relative mt-10 md:mt-14">
          {/* Horizontal connector line (desktop) */}
          <div className="absolute left-0 right-0 top-[30px] hidden md:block">
            <div className="mx-[12.5%] border-t border-[#E0E0E0]" />
          </div>

          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center">
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#EDEDED] text-18 font-bold text-secondary">
                  {step.num}
                </div>
                <h3 className="mt-4 text-16 font-bold text-secondary md:text-18">{step.title}</h3>
                <p className="mt-2 max-w-[280px] leading-relaxed text-[#6B6B6B] text-sm">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
