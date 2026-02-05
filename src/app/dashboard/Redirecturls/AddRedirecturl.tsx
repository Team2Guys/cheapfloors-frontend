'use client';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { initialRedirectUrls, RedirectUrls } from 'types/general';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  FormikProps
} from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import { IoMdArrowRoundBack } from 'react-icons/io';
import revalidateTag from 'components/ServerActons/ServerAction';
import { ADD_REDIRECTURLS, UPDATE_REDIRECTURLS } from 'graphql/general';
import Loader from 'components/Loader/Loader';
import { confirmLeaveWithUnsavedChanges } from 'utils/helperFunctions';
import { showAlert } from 'utils/Alert';

interface IVIEWREDIRECTURLS {
  setRedirectUrls: React.Dispatch<SetStateAction<RedirectUrls | undefined>>;
  setselecteMenu: React.Dispatch<SetStateAction<string>>;
  RedirectUrls: RedirectUrls | undefined;
}

function AddRedirecturl({
  RedirectUrls,
  setRedirectUrls,
  setselecteMenu
}: IVIEWREDIRECTURLS) {
  const [AddredirectUrls, { loading }] = useMutation(ADD_REDIRECTURLS);

  const [updateReviewMutation, { loading: updateloading }] =
    useMutation(UPDATE_REDIRECTURLS);
  const [formDate, setformDate] = useState<initialRedirectUrls>({
    redirectedUrl: RedirectUrls?.redirectedUrl,
    url: RedirectUrls?.url,
    status: RedirectUrls?.status
  });
  const formikRef = useRef<FormikProps<initialRedirectUrls>>(null);
  useEffect(() => {
    setformDate({
      url: RedirectUrls?.url,
      redirectedUrl: RedirectUrls?.redirectedUrl,
      status: RedirectUrls?.status
    });
  }, [RedirectUrls]);

  const validationSchema = Yup.object({
    url: Yup.string().required('Url is required'),
    redirectedUrl: Yup.string().required('redirectedUrl is required')
  });

  const apiHandler = async (values: initialRedirectUrls) => {
    try {
      if (RedirectUrls?.redirectedUrl) {
        // UPDATE existing review
        await updateReviewMutation({
          variables: {
            UpdateRedirecturls: {
              id: RedirectUrls.id,
              ...values
            }
          }
        });
      } else {
        // ADD new review
        await AddredirectUrls({
          variables: {
            CreatedRedirecturls: values
          }
        });
      }

      setRedirectUrls(undefined);
      setselecteMenu('All Reviews');
      revalidateTag('RedirectUrls');
      // eslint-disable-next-line
    } catch (error: any) {
      const graphQLError = error?.graphQLErrors?.[0]?.message;
      showAlert({
        title: graphQLError || 'Internal server error',
        icon: 'error'
      });
    }
  };

  const handleSubmit = async (
    values: initialRedirectUrls,
    { resetForm }: FormikHelpers<initialRedirectUrls>
  ) => {
    await apiHandler(values);
    resetForm();
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (formikRef.current?.dirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <Formik
      innerRef={formikRef}
      enableReinitialize
      initialValues={formDate}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="space-y-4 max-w-2xl mx-auto">
          <div className="flex_between">
            <p
              className="text-lg font-black flex items-center gap-2 hover:bg-gray-200 w-fit p-2 cursor-pointer dark:text-white"
              onClick={async () => {
                if (formikRef.current?.dirty) {
                  const shouldLeave = await confirmLeaveWithUnsavedChanges();
                  if (!shouldLeave) return;
                }
                setselecteMenu('All RedirectUrls');
              }}
            >
              <IoMdArrowRoundBack /> Back
            </p>
            <div className="flex gap-6 items-center">
              <Field name="status">
                {({ field, form }: import('formik').FieldProps) => (
                  <div className="flex gap-4 items-center my-4">
                    <label className="font-semibold dark:text-white">
                      Redirect Status:
                    </label>

                    {['DRAFT', 'PUBLISHED'].map((status) => {
                      const isActive = field.value === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => form.setFieldValue('status', status)}
                          disabled={isActive}
                          className={`px-4 py-2 rounded-md text-sm border
                        ${
                          isActive
                            ? 'bg-black text-white border-black cursor-not-allowed'
                            : 'bg-white text-black border-gray-300 hover:bg-gray-100 cursor-pointer'
                        }`}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                )}
              </Field>
              <button
                type="submit"
                className=" px-8 py-2 bg-primary dark:bg-primary dark:border-0 text-white rounded w-fit"
                disabled={loading}
              >
                {loading ? <Loader color="#fff" /> : 'Submit'}
              </button>
            </div>
          </div>
          <div className="bg-white dark:bg-black p-4 rounded-lg shadow-md space-y-4 dark:text-white">
            <div className="space-y-2">
              <label htmlFor="name">Url Endpoint </label>
              <Field
                name="url"
                type="text"
                className="dashboard_input"
                placeholder="Url Endpoint"
              />
              <ErrorMessage
                name="url"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="redirectedUrl">Redirect Pages</label>
              <Field
                name="redirectedUrl"
                type="text"
                className="dashboard_input"
                placeholder="Redirect Pages"
              />
              <ErrorMessage
                name="redirectedUrl"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
          </div>
          <Field name="status">
            {({ field, form }: import('formik').FieldProps) => (
              <div className="flex gap-4 items-center my-4">
                <label className="font-semibold dark:text-white">
                  Redirect Status:
                </label>

                {['DRAFT', 'PUBLISHED'].map((status) => {
                  const isActive = field.value === status;

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => form.setFieldValue('status', status)}
                      disabled={isActive}
                      className={`px-4 py-2 rounded-md text-sm border
                        ${
                          isActive
                            ? 'bg-black text-white border-black cursor-not-allowed'
                            : 'bg-white text-black border-gray-300 hover:bg-gray-100 cursor-pointer'
                        }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            )}
          </Field>
          <button
            type="submit"
            className=" px-8 py-2 bg-primary dark:bg-primary dark:border-0 text-white rounded w-fit"
            disabled={loading || updateloading}
          >
            {loading || updateloading ? <Loader color="#fff" /> : 'Submit'}
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default AddRedirecturl;
