import { FaTruck, FaBoxOpen, FaMoneyBillWave } from 'react-icons/fa';

const steps = [
    {
        no: '01',
        title: 'Inquiry Received',
        desc: 'Our team logs your requirements into our project management system.',
    },
    {
        no: '02',
        title: 'Expert Review',
        desc: 'A flooring specialist reviews stock availability and technical fit for your project.',
    },
    {
        no: '03',
        title: 'Custom Quote',
        desc: 'We send a comprehensive B2B quotation with logistics and timeline details.',
    },
    {
        no: '04',
        title: 'Supply & Delivery',
        desc: 'Upon approval, goods are dispatched with site loading support across the UAE.',
    },
];

const reasons = [
    {
        icon: FaTruck,
        title: 'Fast UAE Delivery',
        desc: 'Next-day dispatch for stock items across all Emirates.',
    },
    {
        icon: FaBoxOpen,
        title: 'Live Inventory Tracking',
        desc: 'Real-time stock reservation for large scale flooring projects.',
    },
    {
        icon: FaMoneyBillWave,
        title: 'Wholesale B2B Pricing',
        desc: 'Aggressive pricing structures tailored for trade volumes.',
    },
];

export const NextSteps = () => {
    return (
        <section className="max-w-6xl mx-auto px-2 font-inter">
            {/* What Happens Next */}
            <div className="mx-auto max-w-2xl py-12 md:py-16">
                <h2 className="text-center text-18 font-bold uppercase tracking-[0.12em] text-secondary md:text-20">
                    What Happens Next?
                </h2>

                <div className="mt-8 flex flex-col gap-6">
                    {steps.map((step) => (
                        <div key={step.no} className="flex items-start gap-4">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-13 font-bold text-secondary">
                                {step.no}
                            </span>
                            <div>
                                <h3 className="text-16 font-semibold text-secondary">
                                    {step.title}
                                </h3>
                                <p className="mt-1 text-14 leading-relaxed text-gray-600">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why B2B Partners Choose Us */}
            <div className="mx-auto max-w-2xl pb-12 md:pb-16">
                <h2 className="text-center text-18 font-bold text-secondary md:text-22">
                    Why B2B Partners Choose Us
                </h2>

                <div className="mt-8 flex flex-col gap-4">
                    {reasons.map(({ icon: Icon, title, desc }) => (
                        <div
                            key={title}
                            className="flex items-center gap-4 rounded-xl bg-[#F3F3F3] p-3"
                        >
                            <Icon className="mt-0.5 shrink-0 text-22 text-primary" />
                            <div>
                                <h3 className="text-secondary">{title}</h3>
                                <p className="mt-1 text-smd text-gray-600">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
