
import { faqspage } from 'data/data';
import FAQsList from 'components/FaqsPageComponent/Faqs';
import Breadcrumb from 'components/Reusable/breadcrumb';
import JsonLd from 'components/Seo/JsonLd';
import { pageSchemas } from 'data/page-schema';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
import Container from '@/components/common/container/Container';
export const metadata = createMetadata(pageMetadataData.faqs);
const FAQsPage = () => {
  return (
    <>
      <JsonLd schema={pageSchemas.faqs} />
      <Breadcrumb title="FAQs" />
      <section className="bg-white py-5 sm:py-7">
        <Container>
          <FAQsList faqspage={faqspage} />
        </Container>
      </section>
    </>
  );
};

export default FAQsPage;
