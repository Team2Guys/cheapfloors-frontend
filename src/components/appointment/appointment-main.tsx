import React from 'react';
import dynamic from 'next/dynamic';
const Appointment = dynamic(() => import('./Appointment'));
import { Appointmentprops } from 'types/type';

const AppointmentMain = ({
  title,
  description,
  AppointsType
}: Appointmentprops) => {
  return (
    <div className="max-w-[95%] md:max-w-[75%] mx-auto space-y-4 mb-5 md:mb-10 font-inter">
      <h1 className="pt-10 text-18 md:text-28 font-semibold text-center">
        {title}
      </h1>
      <p
        className=" text-sm md:text-base text-justify leading-8"
        dangerouslySetInnerHTML={{ __html: description || '' }}
      />
      <Appointment AppointsType={AppointsType} />
    </div>
  );
};

export default AppointmentMain;
