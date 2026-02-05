'use client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import { BiArrowBack } from 'react-icons/bi';
import client from 'config/apolloClient';
import { CREATE_USER } from 'graphql/user-mutation';
import { FaEnvelope, FaLock, FaPhoneAlt, FaUser } from 'react-icons/fa';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginData } from 'data/data';
import { validationSchema } from 'utils/SignUplValidation';
import { showAlert } from 'utils/Alert';

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const formValues = {
    name: '',
    email: '',
    password: '',
    retypePassword: '',
    phone: ''
  };

  return (
    <div className="flex flex-col h-screen w-full md:flex-row">
      <div
        className="bg-center bg-cover hidden md:block md:w-1/2"
        style={{ backgroundImage: "url('/assets/images/login.webp')" }}
      />

      <div className="flex justify-center p-6 w-full items-start md:p-12 md:w-1/2">
        <div className="w-full max-w-xl">
          <Link href="/" className="flex text-lg w-fit gap-3 items-center">
            <span className="bg-primary p-3 text-white">
              <BiArrowBack />
            </span>
            Back to home
          </Link>
          <h2
            className="sm:text-4xl text-2xl text-center text-primary font-bold font-inter mt-8"
            dangerouslySetInnerHTML={{ __html: loginData.title }}
          />

          <h1 className="sm:text-4xl text-2xl text-center font-bold font-inter mt-8">
            Sign Up
          </h1>

          <Formik
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const { retypePassword, phone, ...newValues } = values;
                console.log(retypePassword);
                if (values.password !== values.retypePassword) {
                  showAlert({
                    title: "Passwords don't match",
                    icon: 'error'
                  });
                  return;
                }

                const { data } = await client.mutate({
                  mutation: CREATE_USER,
                  variables: {
                    createUser: { ...newValues, phone: phone.toString() }
                  }
                });

                if (data?.createUser) {
                  showAlert({
                    title: 'Account created successfully!',
                    icon: 'success'
                  });
                  router.push('/login');
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (error: any) {
                showAlert({
                  title: error?.message || 'An error occurred',
                  icon: 'error'
                });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="mt-10">
                <div className="flex flex-col mb-4">
                  <div className="flex border-b items-center">
                    <FaUser className="text-primary" />
                    <Field
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      className={`p-3 shadow-none w-full focus:outline-none focus:ring-0 pl-4 ${
                        errors.name && touched.name ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="flex flex-col mb-4">
                  <div className="flex border-b items-center">
                    <FaEnvelope className="text-primary" />
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email"
                      className={`p-3 shadow-none w-full focus:outline-none focus:ring-0 pl-4 ${
                        errors.email && touched.email ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="flex flex-col mb-4">
                  <div className="flex border-b items-center">
                    <FaPhoneAlt className="text-primary" />
                    <Field
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      className={`p-3 shadow-none w-full focus:outline-none focus:ring-0 pl-4 ${
                        errors.phone && touched.phone ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="flex flex-col mb-4">
                  <div className="flex_between border-b relative">
                    <div className="flex w-full items-center">
                      <FaLock className="text-primary" />
                      <Field
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        className={`p-3 shadow-none w-full focus:outline-none focus:ring-0 pl-4 ${
                          errors.password && touched.password
                            ? 'border-red-500'
                            : ''
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-primary -translate-y-1/2 absolute focus:outline-none right-3 top-1/2 transform"
                    >
                      {showPassword ? <BsEyeSlash /> : <BsEye />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="flex flex-col mb-4">
                  <div className="flex_between border-b relative">
                    <div className="flex w-full items-center">
                      <FaLock className="text-primary" />
                      <Field
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="retypePassword"
                        placeholder="Confirm Password"
                        className={`p-3 shadow-none w-full focus:outline-none focus:ring-0 pl-4 ${
                          errors.retypePassword && touched.retypePassword
                            ? 'border-red-500'
                            : ''
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-primary -translate-y-1/2 absolute focus:outline-none right-3 top-1/2 transform"
                    >
                      {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="retypePassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="pt-7">
                  <button
                    type="submit"
                    className="bg-primary p-3 text-white w-full hover:bg-primary-dark transition-colors disabled:bg-gray-400"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <p className="text-center mt-4">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
