import Container from 'components/common/container/Container';
import { ISUBCATEGORY } from 'types/cat';
import CustomSwiper from './Swiper';
import Popup from './Popup';

export default async function AmCategory({
  subCategories
}: {
  subCategories: ISUBCATEGORY[];
}) {
  return (
    // Reduced mt-4 for mobile and adjusted desktop margin to match image layout
    <Container className="font-inter mt-6 md:mt-16 category_slider">
      <Popup />
      {/* The Swiper now contains its own arrows at the top right */}
      <CustomSwiper subCategories={subCategories} />
    </Container>
  );
}