import AppointmentMain from 'components/appointment/appointment-main';
import React from 'react';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
export const metadata = createMetadata(
  pageMetadataData.help_with_installations
);
const Installation = () => {
  return (
    <AppointmentMain
      AppointsType="INSTALLATIONS"
      title="Installation Appointment"
      description="If you still feel overwhelmed about installation, you can book an appointment with us, and once the booking is made, we will contact you to confirm the location, preferred date, and time for the service. Our professional team will then visit the site to complete the installation. The installation charges are <span class='font-currency font-normal text-18 md:text-22'></span> 25 per square metre for straight planks and <span class='font-currency font-normal text-18 md:text-22'></span> 35 per square metre for herringbone patterns. Please note that these rates are applicable within Dubai. If you are located in other areas of the Emirates, additional charges may apply. Please feel free to contact us via call or email for more detailed information."
    />
  );
};

export default Installation;
