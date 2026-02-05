import LoginForm from 'components/RegistrationForm/Login';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
export const metadata = createMetadata(pageMetadataData.login);
const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
