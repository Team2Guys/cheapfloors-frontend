import Container from 'components/common/container/Container';
import { policySections } from 'data/data';
import React from 'react';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
export const metadata = createMetadata(
  pageMetadataData.return_and_refund_policy
);
const ReturnRefundPolicy = () => {
  return (
    <Container className="pt-10 md:pt-20 font-inter">
      <h1 className="text-center text-24 sm:text-36 font-semibold mb-4">
        Return and Refund Policy
      </h1>
      {policySections.map((section, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-20 sm:text-24 font-semibold mb-2">
            {section.title}
          </h2>
          {section.content.map((paragraph, i) => (
            <p
              key={i}
              className="text-sm sm:text-20 sm:leading-[26px] text-justify mb-2"
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          ))}
        </div>
      ))}
    </Container>
  );
};

export default ReturnRefundPolicy;
