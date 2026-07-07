import { Banner } from '@/components/thankyou-inquiry/Banner';
import { InquirySummary } from '@/components/thankyou-inquiry/InquirySummary';
import { NextSteps } from '@/components/thankyou-inquiry/NextSteps';
import { AssistanceFooter } from '@/components/thankyou-inquiry/AssistanceFooter';
import { fetchSingleB2bQuote } from 'config/fetch';

interface ThanksProps {
    searchParams: Promise<{ id?: string }>;
}

const Thanks = async ({ searchParams }: ThanksProps) => {
    const { id } = await searchParams;
    const quote =  await fetchSingleB2bQuote(Number(id));
    return (
        <>
            <Banner />
            <InquirySummary quote={quote} />
            <NextSteps />
            <AssistanceFooter />
        </>
    );
};

export default Thanks;
