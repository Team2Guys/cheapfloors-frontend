import { Banner } from '@/components/thankyou-inquiry/Banner';
import { InquirySummary } from '@/components/thankyou-inquiry/InquirySummary';
import { NextSteps } from '@/components/thankyou-inquiry/NextSteps';
import { AssistanceFooter } from '@/components/thankyou-inquiry/AssistanceFooter';

const Thanks = () => {
    return (
        <>
            <Banner />
            <InquirySummary />
            <NextSteps />
            <AssistanceFooter />
        </>
    );
};

export default Thanks;
