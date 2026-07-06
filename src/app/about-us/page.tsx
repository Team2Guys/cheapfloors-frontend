import AboutUsInfo from 'components/AboutUsInfo/AboutUsInfo';
import Container from 'components/common/container/Container';
import Breadcrumb from 'components/Reusable/breadcrumb';
import { alternatingData } from 'data/data';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
import SampleBanner from '@/components/Reusable/SampleBanner';
import DiscoverFloor from '@/components/AboutUsInfo/DiscoverFloor';
export const metadata = createMetadata(pageMetadataData.aboutUs);

const AboutUs = () => {
  return (
    <>
      <Breadcrumb
        title="About Us"
        useHeadingTag
        showTitle
        image="/assets/images/aboutus/About-Us.webp"
      />
      <Container>
        <div className="py-12">
          <AboutUsInfo sections={alternatingData} />
        </div>
      
          {/* <VideoComponent videoUrl="https://bncmain.s3.eu-north-1.amazonaws.com/1747803062851-s3" /> */}
          <SampleBanner />
          {/* <SampleGrid sections={sampleGridData} /> */}
          <DiscoverFloor />
        
      </Container>
    </>
  );
};

export default AboutUs;
