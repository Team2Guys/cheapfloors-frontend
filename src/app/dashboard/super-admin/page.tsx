import { get_allAdmins } from 'config/fetch';
import Admins from './Admins';
import { cookies } from 'next/headers';

const SuperAdmin = async () => {
  const allCookies = await cookies();
  const token = allCookies.get('super_admin_access_token')?.value;
  const admins = await get_allAdmins(token);
  return <Admins admins={admins} />;
};

export default SuperAdmin;
