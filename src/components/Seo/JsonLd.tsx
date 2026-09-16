import { PageSchema } from 'data/page-schema';

// Renders a JSON-LD <script> for structured data. Safe to render anywhere in
// the page body - Google reads JSON-LD from <body> as well as <head>.
// Renders nothing when no schema is defined for the page, so callers can pass
// a lookup straight in without guarding first.
const JsonLd = ({ schema }: { schema?: PageSchema }) => {
  if (!schema) return null;

  // Escape "<" so a value containing "</script>" can never break out of the tag.
  const json = JSON.stringify(schema).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
};

export default JsonLd;
