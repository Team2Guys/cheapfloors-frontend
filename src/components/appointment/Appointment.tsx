'use client';
import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import Input from './Input';
import Select from './Select';
import {
  Appointmentlocation,
  FindUs,
  initialValues,
  validationSchema
} from 'data/data';
import Checkbox from './checkbox';
import { useMutation } from '@apollo/client';
import { CREATE_APPOINTMENT } from 'graphql/mutations';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import InputWithUnit from './InputWithSelect';
import { showAlert } from 'utils/Alert';

export default function Appointment({
  AppointsType
}: {
  AppointsType: string;
}) {
  const [createAppointment] = useMutation(CREATE_APPOINTMENT);

  return (
    <div className="pt-5 md:pt-10 font-inter">
      <div className="mx-auto p-2 sm:p-4 2xl:p-6 shadow-2xl rounded-2xl">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (
            values,
            { setSubmitting, resetForm, setFieldTouched }
          ) => {
            setSubmitting(true);
            try {
              await createAppointment({
                variables: {
                  input: {
                    ...values,
                    AppointsType: AppointsType
                  }
                }
              });

              showAlert({
                title: 'Appointment booked successfully!',
                icon: 'success'
              });
              resetForm();

              // Fix: Remove validation errors after form reset
              setTimeout(() => {
                setFieldTouched('preferredTime', false);
              }, 0);
            } catch (error) {
              showAlert({
                title: 'Failed to book appointment. Please try again.',
                icon: 'error'
              });

              return error;
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, isSubmitting, setFieldValue }) => (
            <Form className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-2 lg:gap-4 mb-3">
                <Input
                  type="text"
                  label="Name"
                  name="firstname"
                  placeholder="Enter Your Full Name"
                  required
                  value={values.firstname}
                  onChange={handleChange}
                />

                <div className="custom-input-phone-wrapper">
                  <label htmlFor="phoneNumber" className="text-14 font-medium">
                    Phone No <span className="text-red-500">*</span>
                  </label>
                  <Field name="phoneNumber">
                    {({ field, form }: FieldProps) => (
                      <PhoneInput
                        international
                        defaultCountry="AE"
                        label="Phone No"
                        name="phoneNumber"
                        required
                        placeholder="Type Your Phone No"
                        value={field.value}
                        onChange={(value) =>
                          form.setFieldValue('phoneNumber', value)
                        }
                        maxLength={20}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="custom-input-phone-wrapper">
                  <label
                    htmlFor="whatsappNumber"
                    className="text-14 font-medium"
                  >
                    WhatsApp No. If Different
                  </label>
                  <Field name="whatsappNumber">
                    {({ form }: FieldProps) => (
                      <PhoneInput
                        international
                        defaultCountry="AE"
                        label="WhatsApp No"
                        name="whatsappNumber"
                        // required
                        placeholder="Type Your WhatsApp No"
                        value={values.whatsappNumber}
                        onChange={(value) =>
                          form.setFieldValue('whatsappNumber', value)
                        }
                        maxLength={20}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="whatsappNumber"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <Input
                  type="email"
                  label="Email"
                  name="email"
                  placeholder="Enter Your Email"
                  required
                  value={values.email}
                  onChange={handleChange}
                />

                <Select
                  name="area"
                  label="Location"
                  placeholder="Select Location"
                  required
                  options={Appointmentlocation}
                />

                <InputWithUnit
                  label="Select Rooms"
                  name="selectRooms"
                  placeholder="How Many Rooms?"
                  required
                  value={values.selectRooms}
                  // Removed selectOptions prop
                  setFieldValue={setFieldValue}
                />

                <Input
                  type="date"
                  label="Preferred Date"
                  name="preferredDate"
                  required
                  value={values.preferredDate}
                  onChange={handleChange}
                  onFocus={(e) => e.target.showPicker()}
                  min={new Date().toISOString().split('T')[0]}
                />

                <Select
                  label="Preferred Time"
                  name="preferredTime"
                  placeholder="Am/Pm"
                  required
                  options={[
                    { value: 'am', label: 'Am' },
                    { value: 'pm', label: 'Pm' }
                  ]}
                />

                <Select
                  name="findUs"
                  label="How did you find us?"
                  placeholder="Select Platform"
                  options={FindUs}
                />
              </div>

              <div className="pb-2">
                <label className="text-13 font-medium">
                  How shall we contact you?
                </label>
                <div className="flex gap-4 items-center pt-2">
                  <Field
                    name="contactMethod.whatsapp"
                    component={Checkbox}
                    label="WhatsApp"
                  />
                  <Field
                    name="contactMethod.telephone"
                    component={Checkbox}
                    label="Telephone"
                  />
                  <Field
                    name="contactMethod.email"
                    component={Checkbox}
                    label="Email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-13 font-medium">
                  What is your query regarding?
                </label>
                <Field
                  as="textarea"
                  name="comment"
                  placeholder="Enter Your Query"
                  className="w-full pt-3 p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-xs placeholder:font-medium placeholder:text-[#0000003D] h-52 rounded-lg"
                />
              </div>

              <SubmitButton isSubmitting={isSubmitting} />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <div className="text-center">
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit  border border-primary p-2 lg:py-3 px-4 sm:px-10 text-15 rounded-md"
      >
        {isSubmitting ? 'Submitting...' : ' BOOK AN APPOINTMENT'}
      </button>
    </div>
  );
}
