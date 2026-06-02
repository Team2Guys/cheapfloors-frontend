import * as Yup from 'yup';

export const freeSampleCheckoutValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  country: Yup.string().required('Country is required'),
  emirate: Yup.string().required('Emirate is required'),
  city: Yup.string().required('Area is required'),
  address: Yup.string().required('Address is required')
});
