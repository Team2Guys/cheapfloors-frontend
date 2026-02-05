import { fetchAppointments } from 'config/fetch';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import React from 'react';
import { IAppointment } from 'types/types';
const Measurement = dynamic(
  () => import('../measurement-appointment/Measurement')
);

const Page = async () => {
  const allCookies = await cookies();
  const token =
    allCookies.get('super_admin_access_token')?.value ||
    allCookies.get('admin_access_token')?.value;

  const appointments = await fetchAppointments(token);
  const installAppointments = appointments.filter(
    (item: IAppointment) => item.AppointsType === 'INSTALLATIONS'
  );

  return (
    <Measurement
      appointments={installAppointments}
      title="Installation Appointments"
    />
  );
};

export default Page;
