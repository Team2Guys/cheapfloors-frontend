import AboutUsInfo from 'components/AboutUsInfo/AboutUsInfo';
import Container from 'components/common/container/Container';
import Breadcrumb from 'components/Reusable/breadcrumb';
import SampleGrid from 'components/SampleGrid/SampleGrid';
import VideoComponent from 'components/VideoComponent/AboutCompany';
import { alternatingData, sampleGridData } from 'data/data';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
export const metadata = createMetadata(pageMetadataData.aboutUs);

const AboutUs = () => {
  return (
    <>
      <Breadcrumb
        title="About Us"
        useHeadingTag
        showTitle
        image="/assets/images/aboutus/banner.webp"
      />
      <Container>
        <div className="py-12">
          <AboutUsInfo sections={alternatingData} />
        </div>
        <div>
          <VideoComponent videoUrl="https://bncmain.s3.eu-north-1.amazonaws.com/1747803062851-s3" />
          <SampleGrid sections={sampleGridData} />
        </div>
      </Container>
    </>
  );
};

export default AboutUs;
