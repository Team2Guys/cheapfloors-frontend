import React from 'react';
import { faqspage } from 'data/data';
import FAQsList from 'components/FaqsPageComponent/Faqs';
import Breadcrumb from 'components/Reusable/breadcrumb';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
export const metadata = createMetadata(pageMetadataData.faqs);
const FAQsPage = () => {
  return (
    <>
      <Breadcrumb title="FAQs" />
      <section className="bg-white py-5 sm:py-7">
        <div className="container mx-auto px-6">
          <h1 className="text-[15px] sm:text-lg font-bold text-[#35332F] lg:text-4xl text-center md:mb-16 font-inter">
            Frequently Asked Questions
          </h1>
          <FAQsList faqspage={faqspage} />
        </div>
      </section>
    </>
  );
};

export default FAQsPage;
