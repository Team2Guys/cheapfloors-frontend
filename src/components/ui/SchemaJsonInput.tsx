'use client';
import { Field, ErrorMessage } from 'formik';

// JSON-LD textarea for the dashboard forms. Validation lives in the form's
// Yup schema (see schemaJsonValidation in data/data.ts).
const SchemaJsonInput = ({ name = 'Schema_Json' }: { name?: string }) => {
  return (
    <div className="w-full">
      <label className="block mb-3 text-sm font-medium text-black dark:text-white">
        Schema JSON
      </label>
      <Field
        as="textarea"
        name={name}
        spellCheck={false}
        placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Product"\n}'}
        className="dashboard_input min-h-[220px] resize-y font-mono text-sm"
      />
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Paste the JSON-LD only, without the &lt;script&gt; tag.
      </p>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
};

export default SchemaJsonInput;
