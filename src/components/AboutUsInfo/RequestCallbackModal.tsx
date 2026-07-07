'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import { IoClose } from 'react-icons/io5';
import { CREATE_REQUEST_CALLBACK } from 'graphql/mutations';
import { showAlert } from 'utils/Alert';

const inputClass = (error?: boolean) =>
  `w-full rounded-lg border ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'} px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary`;

const RequestCallbackModal = ({ onClose }: { onClose: () => void }) => {
  const [createRequestCallback] = useMutation(CREATE_REQUEST_CALLBACK);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      whatsapp: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phone: Yup.string().required('Phone number is required'),
      whatsapp: Yup.string()
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await createRequestCallback({
          variables: {
            createRequestCallbackInput: {
              name: values.name,
              email: values.email,
              phone: values.phone,
              // Only send WhatsApp when it differs from the phone number.
              whatsapp:
                values.whatsapp && values.whatsapp.trim() !== values.phone.trim()
                  ? values.whatsapp
                  : undefined
            }
          }
        });
        showAlert({
          title: 'Thank you! We will call you back shortly.',
          icon: 'success'
        });
        resetForm();
        onClose();
      } catch (error) {
        console.error('Failed to submit callback request:', error);
        showAlert({
          title: 'Something went wrong. Please try again.',
          icon: 'error'
        });
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4 font-inter"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-gray-500 transition hover:text-black"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-xl font-bold text-black sm:text-2xl">
          Request a callback
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Leave your details and one of our flooring experts will call you back.
        </p>

        <form onSubmit={formik.handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-black">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Your name"
              className={inputClass(!!(formik.touched.name && formik.errors.name))}
              {...formik.getFieldProps('name')}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-black">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass(
                !!(formik.touched.email && formik.errors.email)
              )}
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-black">
              Phone number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="+971 5X XXX XXXX"
              className={inputClass(
                !!(formik.touched.phone && formik.errors.phone)
              )}
              {...formik.getFieldProps('phone')}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.phone}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-black">
              WhatsApp number{' '}
              <span className="font-normal text-gray-400">
                (if different from phone)
              </span>
            </label>
            <input
              type="tel"
              placeholder="+971 5X XXX XXXX"
              className={inputClass(false)}
              {...formik.getFieldProps('whatsapp')}
            />
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="mt-2 w-full rounded-lg bg-primary py-3 text-base font-bold text-black transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {formik.isSubmitting ? 'Submitting...' : 'Request a callback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestCallbackModal;
