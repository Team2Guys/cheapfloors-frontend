'use client';

import React, { useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import { CONTACT_US_EMAIL_MUTATION } from 'graphql/mutations';
import { showAlert } from 'utils/Alert';
import ReCAPTCHA from 'react-google-recaptcha';

interface FormValues {
  firstName: string;
  LastName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  LastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9-]+$/, 'Phone number must contain only numbers and dashes')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
  message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be less than 500 characters')
    .required('Message is required')
});

const initialValues: FormValues = {
  firstName: '',
  LastName: '',
  email: '',
  phoneNumber: '',
  message: ''
};

const ContactForm: React.FC = () => {
  const [sendContactEmail, { loading, error }] = useMutation(
    CONTACT_US_EMAIL_MUTATION
  );
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState(false);

  const handleSubmit = async (
    values: FormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      await sendContactEmail({ variables: { contactUsEmail: values } });
      showAlert({
        title: 'Message sent successfully',
        icon: 'success'
      });
      resetForm();
    } catch (error) {
      throw error;
    }
  };

  async function handleCaptchaSubmission(token: string | null) {
    try {
      if (token) {
        await fetch('/api', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });
        setIsVerified(true);
      }
    } catch (e) {
      console.log(e);
      setIsVerified(false);
    }
  }

  const handleChange = (token: string | null) => {
    handleCaptchaSubmission(token);
  };

  function handleExpired() {
    setIsVerified(false);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="font-inter">
          <div className="sm:grid sm:grid-cols-2 gap-5 mt-4">
            <div>
              <label
                htmlFor="firstName"
                className="text-sm md:text-20 font-medium"
              >
                First Name{' '}
                <span className="text-red-500 text-sm align-super">*</span>
              </label>
              <Field
                type="text"
                name="firstName"
                className="contact_input"
                required
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="LastName"
                className="text-sm md:text-20 font-medium"
              >
                Last Name{' '}
                <span className="text-red-500 text-sm align-super">*</span>
              </label>
              <Field
                type="text"
                name="LastName*"
                className="contact_input"
                required
              />
              <ErrorMessage
                name="LastName"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm md:text-20 font-medium">
                Email{' '}
                <span className="text-red-500 text-sm align-super">*</span>
              </label>
              <Field
                type="email"
                name="email"
                className="contact_input"
                required
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="text-14 font-medium"
              >
                Phone Number{' '}
                <span className="text-red-500 text-sm align-super">*</span>
              </label>
              <Field
                type="tel"
                name="phoneNumber"
                className="contact_input"
                required
              />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="message"
                className="text-sm md:text-20 font-medium"
              >
                Message
              </label>
              <Field
                as="textarea"
                name="message"
                className="contact_input h-40 sm:h-60"
                required
                maxLength={500}
              />
              <ErrorMessage
                name="message"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-center text-sm mt-2">
              Error sending Message:{error.message}
            </div>
          )}

          {/* <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
        ref={recaptchaRef}
        onChange={handleChange}
        onExpired={handleExpired}
/> */}
          <div className="w-full text-end mt-5 flex flex-col items-end">
            <div className="mb-3">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                ref={recaptchaRef}
                onChange={handleChange}
                onExpired={handleExpired}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || loading || !isVerified}
              className="w-[200px] h-[50px] border border-primary text-black hover:text-white font-medium font-inter hover:bg-primary hover:bg-primary-dark duration-300 ease-in-out text-16 sm:text-20 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
            >
              {isSubmitting || loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ContactForm;
