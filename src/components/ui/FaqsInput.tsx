'use client';
import { Field, FieldArray, useFormikContext } from 'formik';
import { RxCross2 } from 'react-icons/rx';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { CategoryFAQ } from 'types/cat';

// FAQ editor for the category / subcategory dashboard forms. Each row is one
// question + answer shown in the "FAQ'S" section of that page.
const FaqsInput = ({ name = 'FAQS' }: { name?: string }) => {
  const { values } = useFormikContext<Record<string, CategoryFAQ[]>>();
  const faqs = values[name] || [];

  return (
    <div className="rounded-sm border bg-white dark:bg-black">
      <div className="border-b py-4 px-2 dark:border-white">
        <h3 className="font-medium text-black dark:text-white">
          FAQs ({faqs.length})
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Shown in the FAQ section at the bottom of the page. Empty rows are
          ignored when you submit.
        </p>
      </div>
      <FieldArray name={name}>
        {({ push, remove, move }) => (
          <div className="flex flex-col gap-4 p-4">
            {faqs.map((_, index) => (
              <div
                key={index}
                className="flex gap-2 items-start border rounded-md p-3 dark:border-gray-700"
              >
                <span className="mt-2 text-sm font-semibold text-gray-500 w-6 shrink-0">
                  {index + 1}.
                </span>
                <div className="flex-1 flex flex-col gap-2">
                  <Field
                    name={`${name}[${index}].question`}
                    placeholder="Question"
                    className="dashboard_input"
                  />
                  <Field
                    as="textarea"
                    name={`${name}[${index}].answer`}
                    placeholder="Answer"
                    className="dashboard_input min-h-[90px] resize-y"
                  />
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button
                    type="button"
                    aria-label="Move up"
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                    className="p-1 disabled:opacity-30"
                  >
                    <IoChevronUp size={18} />
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    disabled={index === faqs.length - 1}
                    onClick={() => move(index, index + 1)}
                    className="p-1 disabled:opacity-30"
                  >
                    <IoChevronDown size={18} />
                  </button>
                  <button
                    type="button"
                    aria-label="Remove FAQ"
                    onClick={() => remove(index)}
                    className="p-1"
                  >
                    <RxCross2 className="text-red-500" size={20} />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => push({ question: '', answer: '' })}
              className="dashboard_primary_button w-fit"
            >
              Add FAQ
            </button>
          </div>
        )}
      </FieldArray>
    </div>
  );
};

// Drops empty rows and stray fields (e.g. an old `id`) before saving.
export const cleanFaqs = (faqs?: CategoryFAQ[]) =>
  (faqs || [])
    .map((faq) => ({
      question: (faq?.question || '').trim(),
      answer: (faq?.answer || '').trim()
    }))
    .filter((faq) => faq.question && faq.answer);

export default FaqsInput;
