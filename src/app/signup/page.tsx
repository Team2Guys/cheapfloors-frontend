import SignupForm from 'components/RegistrationForm/Signup';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
export const metadata = createMetadata(pageMetadataData.signup);
const SignUpPage = () => {
  return <SignupForm />;
};

export default SignUpPage;
