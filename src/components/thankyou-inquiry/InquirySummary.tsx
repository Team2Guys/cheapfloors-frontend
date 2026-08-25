import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaUserTie,
    FaBuilding,
    FaLayerGroup,
    FaRulerCombined,
    FaMoneyBillWave,
    FaAlignLeft,
    FaFileContract,
} from 'react-icons/fa';
import { IB2BQuote } from 'types/b2bQuote';

type SummaryItem = {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    fullWidth?: boolean;
};

const Field = ({ icon: Icon, label, value }: SummaryItem) => (
    <div className="flex items-start gap-3">
        <Icon className="mt-0.5 shrink-0 text-16 text-primary" />
        <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] ">
                {label}
            </p>
            <p className="mt-1">{value}</p>
        </div>
    </div>
);

export const InquirySummary = ({ quote }: { quote?: IB2BQuote | null }) => {
    if (!quote) {
        return (
            <section className="max-w-6xl mx-auto px-2 py-12 md:py-16 font-inter">
                <p className="mx-auto max-w-xl text-center text-15 leading-relaxed text-gray-600 md:text-16">
                    We couldn&apos;t find your inquiry details. Our B2B flooring
                    specialists will still be in touch within 24 business hours.
                </p>
            </section>
        );
    }

    const dash = (value?: string | null) => (value && value.trim() ? value : '—');
    const productPreference = quote.productRequired?.length
        ? quote.productRequired.join(', ')
        : '—';

    const summaryItems: SummaryItem[] = [
        { icon: FaUser, label: 'Full Name', value: dash(quote.fullName) },
        { icon: FaEnvelope, label: 'Email Address', value: dash(quote.email) },
        { icon: FaPhone, label: 'Phone / WhatsApp', value: dash(quote.phone) },
        { icon: FaUserTie, label: 'Your Role', value: dash(quote.role) },
        { icon: FaBuilding, label: 'Company Name', value: dash(quote.companyName) },
        { icon: FaLayerGroup, label: 'Product Preference', value: productPreference },
    ];

    const metrics: SummaryItem[] = [
        { icon: FaRulerCombined, label: 'Quantity', value: dash(quote.quantity) },
        { icon: FaMoneyBillWave, label: 'Budget', value: dash(quote.budgetRange) },
    ];

    const compliance: SummaryItem[] = [
        {
            icon: FaFileContract,
            label: 'Trade License',
            value: quote.tradeLicense?.imageUrl ? 'Uploaded' : 'Not provided',
        },
        { icon: FaFileContract, label: 'TRN Number', value: dash(quote.trnNumber) },
    ];

    return (
        <section className="max-w-6xl mx-auto px-2 py-12 md:py-16 font-inter">
            {/* Intro */}
            <p className="mx-auto max-w-xl text-center text-15 leading-relaxed text-gray-600 md:text-16">
                Our B2B flooring specialists are reviewing your requirements and will
                contact you within 24 business hours.
            </p>

            {/* Card */}
            <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between bg-primary px-6 py-4">
                    <span className="text-xs font-bold uppercase text-secondary">
                        Inquiry Summary
                    </span>
                    <span className="text-xs font-semibold text-secondary/80">
                        Ref: #CF-{quote.id}
                    </span>
                </div>

                {/* Body */}
                <div className="px-6 py-6">
                    {/* Single-column stacked fields */}
                    <div className="flex flex-col divide-y divide-gray-200">
                        {summaryItems.map((item) => (
                            <div key={item.label} className="py-4 first:pt-0">
                                <Field {...item} />
                            </div>
                        ))}
                    </div>

                    {/* Two-column metrics */}
                    <div className="mt-2 grid gap-2 border-t border-gray-200 pt-6 grid-cols-2">
                        {metrics.map((item) => (
                            <Field key={item.label} {...item} />
                        ))}
                    </div>

                    {/* Requirements */}
                    {quote.additionalInfo && (
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <div className="flex items-start gap-3">
                                <FaAlignLeft className="mt-0.5 shrink-0 text-16 text-primary" />
                                <div>
                                    <p className="text-11 font-semibold uppercase tracking-[0.12em] ">
                                        Requirements
                                    </p>
                                    <p className="mt-1 text-sm">
                                        &quot;{quote.additionalInfo}&quot;
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Compliance */}
                    <div className="mt-6 grid gap-2 border-t border-gray-200 pt-6 grid-cols-2">
                        {compliance.map((item) => (
                            <Field key={item.label} {...item} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
