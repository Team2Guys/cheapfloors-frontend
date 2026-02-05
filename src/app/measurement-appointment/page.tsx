import AppointmentMain from 'components/appointment/appointment-main';
import React from 'react';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
export const metadata = createMetadata(
  pageMetadataData.measurement_appointment
);
const MeasureAppointment = () => {
  return (
    <AppointmentMain
      AppointsType="APPOINTMENTS"
      title="Measurement Appointment"
      description=" 
  <div class='text-center'>Measurement appointment will be charged at <strong><span class='font-currency font-normal text-18 md:text-20'></span> 150</strong> for Dubai and other emirates <strong><span class='font-currency font-normal text-18 md:text-20'></span> 250</strong>, which is fully <strong>REFUNDABLE</strong> if you place an order with us.</div>"
    />
  );
};

export default MeasureAppointment;
