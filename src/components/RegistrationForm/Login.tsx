'use client';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import Link from 'next/link';
import { BiArrowBack } from 'react-icons/bi';
import { loginData } from 'data/data';
import { Field, Form, Formik } from 'formik';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useState, useEffect } from 'react';

const LoginForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to profile
  useEffect(() => {
    if (session?.user) {
      router.replace('/profile');
    }
  }, [session, router]);

  const formValues = {
    email: '',
    password: ''
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
            className="sm:text-4xl text-2xl text-center text-primary font-bold font-inter sm:mt-20 mt-10"
            dangerouslySetInnerHTML={{ __html: loginData.title }}
          />
          <h1 className="sm:text-4xl text-2xl text-center font-bold font-inter sm:mt-20 mt-10">
            {loginData.subtitle}
          </h1>

          <Formik
            initialValues={formValues}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setError(''); // Clear previous errors
                const response = await signIn('credentials', {
                  email: values.email,
                  password: values.password,
                  redirect: false,
                  callbackUrl: '/login'
                });                
                if (response?.ok) {
                  router.replace('/profile');
                } else {
                  // If no ok status or error exists, show error message
                  const errorCode = response?.error || 'CredentialsSignin';
                  
                  switch (errorCode) {
                    case 'CredentialsSignin':
                      setError('Invalid email or password.');
                      break;
                    case 'AccessDenied':
                      setError('Access denied. Please contact support.');
                      break;
                    case 'OAuthAccountNotLinked':
                      setError('Email is already associated with another account.');
                      break;
                    default:
                      setError('Invalid email or password.');
                  }
                }
              } catch (error) {
                console.error('Login error:', error); // Debug log
                setError('An error occurred while signing in. Please try again.');
              }
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mt-12">
                <div className="flex border-b items-center mb-4">
                  <FaEnvelope className="text-primary" />
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="p-3 shadow-none w-full focus:outline-none focus:ring-0 pl-4"
                    required
                  />
                </div>

                <div className="border-b flex_between relative">
                  <div className="flex w-full items-center">
                    <FaLock className="text-primary" />
                    <Field
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password"
                      className="p-3 shadow-none w-full focus:outline-none focus:ring-0 pl-4"
                      required
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
                <p className="text-sm mt-2">
                  <Link
                    href="/forgot-password"
                    className="text-black hover:underline"
                  >
                    {loginData.forgotPasswordText}
                  </Link>
                </p>
                {error && (
                  <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mt-4">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  className={`p-3 text-white w-full mt-5 ${isSubmitting ? 'bg-primary opacity-70 cursor-not-allowed' : 'bg-primary'}`}
                  disabled={
                    isSubmitting
                  }
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>
              </Form>
            )}
          </Formik>

          <p className="text-center mt-4">
            {loginData.footerText}{' '}
            <Link
              href="/signup"
              className="text-primary font-semibold hover:underline"
            >
              {loginData.footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
