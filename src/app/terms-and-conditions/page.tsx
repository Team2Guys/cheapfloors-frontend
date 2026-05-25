import Container from 'components/common/container/Container';
import { termsConditionsData } from 'data/terms-condition';
import Link from 'next/link';
import React from 'react';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
export const metadata = createMetadata(pageMetadataData.terms_and_conditions);

const TermsAndConditions = () => {
  const renderLinkableText = (text: string) => {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    const phoneRegex = /(\+\d{10,15})/g;
    const urlRegex =
      /(www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/gi;
    const segments = text.split(
      /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+|\+\d{10,15}|www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/gi
    );
    return segments.map((segment, index) => {
      if (segment.match(emailRegex)) {
        return (
          <Link
            key={index}
            href={`mailto:${segment}`}
            target="_blank"
            className="text-primary"
          >
            {segment}
          </Link>
        );
      } else if (segment.match(phoneRegex)) {
        return (
          <Link
            key={index}
            href={`tel:${segment.replace(/\+/g, '')}`}
            className="text-primary"
          >
            {segment}
          </Link>
        );
      } else if (segment.match(urlRegex)) {
        const url = segment.startsWith('www.')
          ? `https://${segment}`
          : `https://www.${segment}`;
        return (
          <Link key={index} href={url} target="_blank" className="text-primary">
            {segment}
          </Link>
        );
      }
      return segment;
    });
  };

  return (
    <Container className="my-10 space-y-3 sm:text-lg font-inter">
      <h1 className="text-2xl sm:text-4xl font-bold text-center">
        Terms & Conditions
      </h1>
      <ol className="space-y-6">
        {termsConditionsData.map((item, index) => (
          <li key={index} className={item.title}>
            {item.title && (
              <h2 className="text-lg sm:text-2xl font-bold mb-2">
                {item.title}
              </h2>
            )}
            {item.heading?.map((title, hIndex) => (
              <h3
                key={`h-${hIndex}`}
                className="text-12 sm:text-lg font-semibold mt-3"
              >
                {renderLinkableText(title)}
              </h3>
            ))}
            {item.content?.map((paragraph, pIndex) => (
              <p
                key={`p-${pIndex}`}
                className="text-12 sm:text-lg font-normal mt-2"
              >
                {renderLinkableText(paragraph)}
              </p>
            ))}

            {item.Links?.map((link, lIndex) => (
              <p
                key={`l-${lIndex}`}
                className="text-12 sm:text-lg font-normal mt-2"
              >
                {renderLinkableText(link)}
              </p>
            ))}
            {item.subItems && (
              <ul className="pl-4 sm:pl-6 list-disc space-y-1 mt-2">
                {item.subItems.map((subItem, sIndex) => (
                  <li
                    key={`s-${sIndex}`}
                    className="text-12 sm:text-lg font-normal"
                  >
                    {renderLinkableText(subItem)}
                  </li>
                ))}
              </ul>
            )}

            {item.contentend?.map((paragraph, eIndex) => (
              <p
                key={`e-${eIndex}`}
                className="text-12 sm:text-lg font-normal mt-2"
              >
                {renderLinkableText(paragraph)}
              </p>
            ))}
          </li>
        ))}
      </ol>
    </Container>
  );
};

export default TermsAndConditions;
