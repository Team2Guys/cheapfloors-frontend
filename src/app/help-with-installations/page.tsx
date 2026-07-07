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
      description="If you find installation a challenge, we’re here to help. We’ll assist in booking a suitable time and charges are a very reasonable ₱25/m² for straight planks and ₱35/m² for herringbone, applicable within Dubai; other Emirates may incur extra fees. Note this is based on the floor being 100% level."
    />
  );
};

export default Installation;
