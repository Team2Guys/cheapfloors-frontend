import Breadcrumb from 'components/Reusable/breadcrumb';
import Features from 'components/Reusable/features';
import RoomMeasurement from 'components/RoomMeasurement/RoomMeasurement';
import React from 'react';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
export const metadata = createMetadata(
  pageMetadataData.how_to_measure_your_room
);
const MeasureRoom = () => {
  return (
    <>
      <Breadcrumb
        imageClass="h-[180px]"
        title=""
        image="/assets/images/how-to-measure-your-room/how-to-measure.webp"
      />
      <RoomMeasurement />
      <Features />
    </>
  );
};

export default MeasureRoom;
