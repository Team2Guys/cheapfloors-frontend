import { PageSchema } from 'data/page-schema';

// Schema JSON is the JSON-LD admins paste into the dashboard forms. It must be
// a JSON object or an array of objects - the backend applies the same rule.

const isPlainObject = (value: unknown): value is PageSchema =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isSchema = (value: unknown): value is PageSchema | PageSchema[] =>
  isPlainObject(value) ||
  (Array.isArray(value) && value.length > 0 && value.every(isPlainObject));

// Returns a message describing why the value is not valid Schema JSON, or
// undefined when it is valid. Blank values are valid (the field is optional).
export const getSchemaJsonError = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  if (trimmed.startsWith('<')) {
    return 'Paste only the JSON, without the <script> tag';
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (error) {
    return `Invalid JSON: ${(error as Error).message}`;
  }

  return isSchema(parsed)
    ? undefined
    : 'Schema must be a JSON object or an array of objects';
};

// Parses stored Schema JSON for rendering with <JsonLd />. Returns undefined
// for blank or invalid values so a bad record can never break the page.
export const parseSchemaJson = (value?: string | null) => {
  if (!value?.trim()) return undefined;
  try {
    const parsed: unknown = JSON.parse(value);
    return isSchema(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};
