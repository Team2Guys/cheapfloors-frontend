'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaCloudUploadAlt,
  FaLock,
  FaChevronDown,
} from 'react-icons/fa';
import Container from '../common/container/Container';
import { FaRegCircleCheck } from 'react-icons/fa6';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { CREATE_B2B_QUOTE } from 'graphql/mutations';
import { uploadPhotosToBackend } from 'utils/helperFunctions';
import { showAlert } from 'utils/Alert';

const whatsappLink = `https://wa.me/${process.env.NEXT_PUBLIC_PHONE_NUMBER?.replace('+', '').replace(/\s+/g, '')}`;

const benefits = [
  { title: 'Volume Discounts', desc: 'Tiered pricing scaled to your project size.' },
  { title: 'Dedicated Manager', desc: 'One point of contact from quote to delivery.' },
  { title: 'VAT Compliant', desc: 'Fully registered for UAE TRN invoicing.' },
  { title: 'GCC Export', desc: 'Cross-border logistics handled end-to-end. ' },
];

const roleOptions = [
  'Procurement Manager',
  'Architect',
  'Contractor',
  'Interior Designer',
  'Reseller / Distributor',
  'Other',
];
const quantityOptions = [
  'Less than 100 sqm',
  '100 - 500 sqm',
  '500 - 1,000 sqm',
  '1,000 - 5,000 sqm',
  '5,000+ sqm',
];
const productOptions = ['SPC Flooring', 'LVT Flooring', 'Engineered Wood', 'Accessories'];
const projectStatusOptions = ['Planning', 'Tender Stage', 'In Progress', 'Completed'];
const budgetOptions = [
  'Less than 5,000',
  '5,000 - 10,000',
  '10,000 - 50,000',
  '50,000 - 100,000',
  '100,000+',
];

const getInputClass = (error?: boolean) =>
  `w-full rounded-lg border ${error ? 'border-red-500 bg-red-50' : 'border-transparent bg-[#F0F0F0]'} px-4 py-3 text-14 text-secondary placeholder:text-[#9a9a9a] outline-none transition focus:border-primary focus:bg-white`;

const labelClass = 'mb-1.5 block text-12 font-semibold uppercase tracking-wide text-[#333]';

const Req = () => <span className="text-red-500"> *</span>;

type SelectFieldProps = {
  label: string;
  name: string;
  options: string[];
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  error?: string;
  touched?: boolean;
};

const SelectField = ({ label, name, options, placeholder, required, value, onChange, onBlur, error, touched }: SelectFieldProps) => (
  <div>
    <label className={labelClass}>
      {label}
      {required && <Req />}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`${getInputClass(!!(error && touched))} appearance-none pr-10`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-12 text-[#888]" />
    </div>
    {error && touched && <p className="mt-1 text-10 text-red-500">{error}</p>}
  </div>
);

export const FlooringQuoteForm = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const router = useRouter();
  const [createB2bQuote] = useMutation(CREATE_B2B_QUOTE);

  const formik = useFormik({
    initialValues: {
      fullName: '',
      phone: '',
      email: '',
      company: '',
      role: '',
      quantity: '',
      product: '',
      projectStatus: '',
      budget: '',
      additionalInfo: '',
      tradeLicense: null,
      trn: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Full Name is required'),
      phone: Yup.string().required('Phone number is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      company: Yup.string().required('Company name is required'),
      role: Yup.string(),
      quantity: Yup.string().required('Quantity is required'),
      product: Yup.string(),
      projectStatus: Yup.string(),
      budget: Yup.string(),
      additionalInfo: Yup.string(),
      tradeLicense: Yup.mixed()
        .required('Trade license is required')
        .test('fileSize', 'File must be smaller than 50 MB', (file) =>
          file ? (file as File).size <= 50 * 1024 * 1024 : true,
        ),
      trn: Yup.string()
        .required('TRN Number is required')
        .matches(/^[0-9]+$/, 'TRN must only contain numbers')
        .length(15, 'TRN must be exactly 15 digits'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // Upload the trade license file first, store the returned upload object.
        let tradeLicense: { imageUrl: string; public_id: string } | null = null;
        if (values.tradeLicense) {
          const uploaded = await uploadPhotosToBackend([
            values.tradeLicense as unknown as File,
          ]);
          tradeLicense = uploaded?.[0] || null;
        }

        const { data } = await createB2bQuote({
          variables: {
            createB2bQuoteInput: {
              fullName: values.fullName,
              phone: values.phone,
              email: values.email,
              companyName: values.company,
              role: values.role,
              quantity: values.quantity,
              productRequired: values.product ? [values.product] : [],
              projectStatus: values.projectStatus,
              budgetRange: values.budget,
              additionalInfo: values.additionalInfo,
              tradeLicense,
              trnNumber: values.trn,
            },
          },
        });

        resetForm();
        setFileName(null);

        const quoteId = data?.Created_b2bQuote?.id;
        router.push(`/thankyou${quoteId ? `?id=${quoteId}` : ''}`);
      } catch (error) {
        console.error('Failed to submit B2B quote:', error);
        showAlert({
          title: 'Failed to submit your request. Please try again.',
          icon: 'error',
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <section className="font-inter bg-[#F9F9F9] pt-12 md:pt-16">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 sm:gap-5 lg:gap-20">
          {/* ---------------- LEFT COLUMN ---------------- */}
          <div>
            <p className="text-12 font-bold uppercase tracking-[0.18em] text-primary">B2B Solutions</p>
            <h2 className="mt-2 text-30 font-bold text-secondary md:text-36">
              Who We <span className="text-primary">Serve</span>
            </h2>
            <p className="mt-4 text-15 leading-relaxed text-[#6B6B6B] md:text-16">
              Easy Floors supplies high-performance SPC, LVT, and engineered wood to contractors, fit-out companies, developers, and government projects across the UAE and GCC.
            </p>

            {/* Why Choose card */}
            <div className="mt-7 rounded-2xl bg-[#EBEBEB] p-6 md:p-7">
              <h3 className="text-20 font-bold text-secondary md:text-22">Why Choose Easy Floors?</h3>
              <ul className="mt-5 space-y-4">
                {benefits.map((b) => (
                  <li key={b.title} className="flex gap-3">
                    <FaRegCircleCheck className="mt-0.5 shrink-0 text-18 text-primary" />
                    <p className="text-14 leading-relaxed text-[#4A4A4A] md:text-15">
                      <span className="font-bold text-secondary">{b.title}:</span> {b.desc}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Need Quick Assistance card */}
            <div className="mt-6 rounded-2xl bg-black p-6 text-white md:p-7 bg-[url('/assets/images/flooring/icon.png')] bg-no-repeat bg-right-bottom">
              <h3 className="text-20 font-bold md:text-22">Need Quick Assistance?</h3>
              <p className="mt-3 text-14 leading-relaxed text-white/65 md:text-15">
                Our B2B team is available Sunday to Friday for technical consultations.
              </p>
              <div className="mt-5 flex flex-col gap-5 sm:flex-row">
                <Link
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 text-15 font-semibold text-white transition hover:bg-[#1ebe5b]"
                >
                  <FaWhatsapp className="text-18" />
                  WhatsApp
                </Link>
                <Link
                  href="tel:+971505974385"
                  className="flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-15 font-semibold text-white transition hover:bg-white/10"
                >
                  <FaPhoneAlt className="text-14" />
                  +971 50 597 4385
                </Link>
              </div>
            </div>
          </div>

          {/* ---------------- RIGHT COLUMN (FORM) ---------------- */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
            {/* Dark header */}
            <div className="bg-[#1A1A1A] p-6 text-white md:p-8">
              <span className="inline-block rounded-full bg-primary px-3 py-1 text-11 font-bold uppercase tracking-wider text-secondary">
                B2B INQUIRY FORM
              </span>
              <h2 className="mt-4 text-26 font-bold md:text-30">Request a Flooring Quote</h2>
              <p className="mt-3 text-13 leading-relaxed text-white/65 md:text-14">
                Please complete the form below to receive a custom B2B quote within 4 business hours. Once approved, you&apos;ll benefit from preferential trade rates and be assigned a dedicated relationship manager to assist with quotations, technical specs, and delivery lead times. A Trade License and a TRN Certificate are required to confirm B2B eligibility.
              </p>
            </div>

            {/* Form body */}
            <form onSubmit={formik.handleSubmit} className="p-6 md:p-8">
              <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Full Name
                    <Req />
                  </label>
                  <input
                    type="text"
                    placeholder="John Smith"
                    className={getInputClass(!!(formik.errors.fullName && formik.touched.fullName))}
                    {...formik.getFieldProps('fullName')}
                  />
                  {formik.errors.fullName && formik.touched.fullName && (
                    <p className="mt-1 text-10 text-red-500">{formik.errors.fullName as string}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>
                    Phone / WhatsApp
                    <Req />
                  </label>
                  <input
                    type="tel"
                    placeholder="+971 5X XXX XXXX"
                    className={getInputClass(!!(formik.errors.phone && formik.touched.phone))}
                    {...formik.getFieldProps('phone')}
                  />
                  {formik.errors.phone && formik.touched.phone && (
                    <p className="mt-1 text-10 text-red-500">{formik.errors.phone as string}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>
                    Email Address
                    <Req />
                  </label>
                  <input
                    type="email"
                    placeholder="john@company.ae"
                    className={getInputClass(!!(formik.errors.email && formik.touched.email))}
                    {...formik.getFieldProps('email')}
                  />
                  {formik.errors.email && formik.touched.email && (
                    <p className="mt-1 text-10 text-red-500">{formik.errors.email as string}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>
                    Company Name
                    <Req />
                  </label>
                  <input
                    type="text"
                    placeholder="Design Studio LLC"
                    className={getInputClass(!!(formik.errors.company && formik.touched.company))}
                    {...formik.getFieldProps('company')}
                  />
                  {formik.errors.company && formik.touched.company && (
                    <p className="mt-1 text-10 text-red-500">{formik.errors.company as string}</p>
                  )}
                </div>

                <SelectField
                  label="Your Role"
                  options={roleOptions}
                  placeholder="Procurement Manager"
                  {...formik.getFieldProps('role')}
                  error={formik.errors.role as string}
                  touched={formik.touched.role as boolean}
                />
                <SelectField
                  label="Quantity (SQM)"
                  options={quantityOptions}
                  placeholder="100 - 500 sqm"
                  required
                  {...formik.getFieldProps('quantity')}
                  error={formik.errors.quantity as string}
                  touched={formik.touched.quantity as boolean}
                />
                <SelectField
                  label="Product Required"
                  options={productOptions}
                  placeholder="Select all that apply"
                  {...formik.getFieldProps('product')}
                  error={formik.errors.product as string}
                  touched={formik.touched.product as boolean}
                />
                <SelectField
                  label="Project Status"
                  options={projectStatusOptions}
                  placeholder="Select status"
                  {...formik.getFieldProps('projectStatus')}
                  error={formik.errors.projectStatus as string}
                  touched={formik.touched.projectStatus as boolean}
                />
                <SelectField
                  label="Budget Range (AED)"
                  options={budgetOptions}
                  placeholder="5,000 - 10,000"
                  {...formik.getFieldProps('budget')}
                  error={formik.errors.budget as string}
                  touched={formik.touched.budget as boolean}
                />

                {/* Additional information */}
                <div className="md:col-span-2">
                  <label className={labelClass}>Additional Information</label>
                  <textarea
                    rows={4}
                    placeholder="Mention project deadline, subfloor condition, color codes (if any), or specific logistics requirements..."
                    className={`${getInputClass(!!(formik.errors.additionalInfo && formik.touched.additionalInfo))} resize-none`}
                    {...formik.getFieldProps('additionalInfo')}
                  />
                  {formik.errors.additionalInfo && formik.touched.additionalInfo && (
                    <p className="mt-1 text-10 text-red-500">{formik.errors.additionalInfo as string}</p>
                  )}
                </div>

                {/* Verification box */}
                <div className={`rounded-xl border-2 p-5 md:col-span-2 ${formik.errors.tradeLicense && formik.touched.tradeLicense ? 'border-red-500' : 'border-primary'}`}>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        Trade License Upload
                        <Req />
                      </label>
                      <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-[#D0D0D0] bg-[#FAFAFA] px-4 py-6 text-center transition hover:border-primary">
                        <input
                          type="file"
                          name="tradeLicense"
                          accept=".pdf,.jpg,.jpeg"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            setFileName(file?.name ?? null);
                            formik.setFieldValue('tradeLicense', file || null);
                          }}
                        />
                        <FaCloudUploadAlt className="text-3xl text-[#555]" />
                        <span className="text-13 font-medium text-secondary">
                          {fileName ?? 'Click to upload'}
                        </span>
                        <span className="text-11 text-[#9a9a9a]">Pdf, Jpg, Jpeg (Max 50 Mb)</span>
                      </label>
                      {formik.errors.tradeLicense && formik.touched.tradeLicense && (
                        <p className="mt-1.5 text-center text-10 text-red-500">{formik.errors.tradeLicense as string}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>
                        TRN Number
                        <Req />
                      </label>
                      <input
                        type="text"
                        placeholder="Enter TRN Number"
                        className={getInputClass(!!(formik.errors.trn && formik.touched.trn))}
                        {...formik.getFieldProps('trn')}
                      />
                      {formik.errors.trn && formik.touched.trn ? (
                        <p className="mt-1.5 text-10 text-red-500">{formik.errors.trn as string}</p>
                      ) : (
                        <p className="mt-1.5 text-11 text-[#9a9a9a]">Enter your 15-digit TRN number</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-16 font-bold text-secondary transition hover:bg-primary/90 md:col-span-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {formik.isSubmitting ? 'Submitting...' : 'Get Flooring Quote'}
                  <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 16V0L19 8L0 16ZM2 13L13.85 8L2 3V6.5L8 8L2 9.5V13ZM2 13V8V3V6.5V9.5V13Z" fill="#271900" />
                  </svg>

                </button>

                <p className="flex items-center justify-center gap-1.5 text-center text-11 text-[#9a9a9a] md:col-span-2">
                  <FaLock className="text-10" />
                  Your data is encrypted. We respect your privacy according to UAE B2B data laws.
                </p>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
};

