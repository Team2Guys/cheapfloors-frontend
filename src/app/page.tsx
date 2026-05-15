import HeroMain from 'components/Reusable/hero';
import { faqs, heroItems, staticMenuItems } from 'data/data';
import { FETCH_ALL_WHAT_AM_I, FETCH_HEADER_CATEGORIES } from 'graphql/queries';
import { fetchCategories, fetchSubCategories } from 'config/fetch';
import { ICategory } from 'types/type';
import { whatAmISorting } from 'data/home-category';
import { ISUBCATEGORY } from 'types/cat';
import CompareSlider from 'components/image-compare/image-compare';
import Features from 'components/Reusable/features';
import CategorySlider from 'components/CategorySlider/category-slider';
import Layers from 'components/Layers/layers';
import FloorItems from 'components/FloorItems/FloorItems';
import AmCategory from 'components/Categories/AmCategory';
import SampleBanner from 'components/Reusable/SampleBanner';
import UserInfo from 'components/Reusable/user-info';
import Faqs from 'components/Faqs/Faqs';

export default async function Home() {
  const [categories, subCategories] = await Promise.all([
    fetchCategories(FETCH_HEADER_CATEGORIES),
    fetchSubCategories(FETCH_ALL_WHAT_AM_I)
  ]);
  const publishedCategories = categories
    .filter((cat: ICategory) => cat.status === 'PUBLISHED')
    .map((cat: ICategory) => ({
      ...cat,
      subcategories:
        cat.subcategories?.filter(
          (sub: ICategory) => sub.status === 'PUBLISHED'
        ) || [],
      recalledSubCats:
        cat.recalledSubCats?.filter(
          (recall: ISUBCATEGORY) => recall?.status === 'PUBLISHED'
        ) || []
    }));
  const publishedSubCategories = subCategories.filter(
    (subCat: ICategory) => subCat.status === 'PUBLISHED'
  );

  const sortedCategories = publishedCategories?.sort(
    (a: ICategory, b: ICategory) => {
      const indexA = staticMenuItems.findIndex(
        (item) => item.label.toLowerCase() === a.name.trim().toLowerCase()
      );
      const indexB = staticMenuItems.findIndex(
        (item) => item.label.toLowerCase() === b.name.trim().toLowerCase()
      );
      return (
        (indexA === -1 ? Infinity : indexA) -
        (indexB === -1 ? Infinity : indexB)
      );
    }
  );

  const sortedSubcategories = publishedSubCategories.sort(
    (a: ICategory, b: ICategory) =>
      whatAmISorting.indexOf(a.name) - whatAmISorting.indexOf(b.name)
  );


  console.log(sortedSubcategories,"sortedSubcategoriessortedSubcategories")
  return (
    <>
      <HeroMain items={heroItems} />
      <Features />
      {/* <Link href='/clearance' className='relative block w-full h-[100px] sm:h-[200px] lg:h-[300px] mb-7 sm:mb-10 xl:mb-16'>
        <Image src='/assets/images/clearance/Banner_1.webp' alt='sale bannar' fill />
      </Link> */}
      <CategorySlider categories={sortedCategories} />
      <Layers />
      <FloorItems />
      <AmCategory subCategories={sortedSubcategories} />
      <SampleBanner />
      <CompareSlider
        beforeSrc="https://res.cloudinary.com/dmmeqgdhv/image/upload/v1744190575/Before_fnh2q3.webp"
        afterSrc="https://res.cloudinary.com/dmmeqgdhv/image/upload/v1744179716/after_d38owr.webp"
        alt="Room Comparison"
      />
      <UserInfo />
      <Faqs data={faqs} />
    </>
  );
}
