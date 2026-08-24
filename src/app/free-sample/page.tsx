import Container from 'components/common/container/Container';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
import { fetchAccessories, fetchCategories, fetchProducts } from 'config/fetch';
import { ICategory } from 'types/type';
import FreeSampleProducts from './FreeSampleProducts';
export const metadata = createMetadata(pageMetadataData.free_sample);
const FreeSampleDetail = async () => {
  const [products, accessories, categories] = await Promise.all([
    fetchProducts(),
    fetchAccessories(),
    fetchCategories()
  ]);
  const publishedProducts = products.filter(
    (product: ICategory) => product.status === 'PUBLISHED'
  );
  const publishedAccessories = accessories.filter(
    (item: ICategory) => item.status === 'PUBLISHED'
  );
  const publishedCategories = categories
    .filter((cat: ICategory) => cat.status === 'PUBLISHED')
    .map((cat: ICategory) => ({
      ...cat,
      subcategories:
        cat.subcategories?.filter(
          (sub: ICategory) => sub.status === 'PUBLISHED'
        ) || [],
      recalledSubCats:
        cat.recalledSubCats?.filter((recall) => recall?.status === 'PUBLISHED') ||
        []
    }));
  return (
    <>
    <Container className="space-y-2 sm:space-y-4 my-10 font-inter">
      <h1 className="text-center text-24 sm:text-36 font-semibold mb-4 font-inter">
        Free Samples
      </h1>
      <p className="text-sm sm:text-20 sm:leading-[26px] text-justify">
        At www.cheapfloors.ae , we understand that judging the quality and colour
        of our flooring on your screen isn’t the easiest task in the world. So
        we’d like to help give you the confidence by sending out free samples.
        Yes, you can order up to 5 samples which will be delivered <span className="font-currency text-2xl font-normal"></span>15 of charge anywhere in the UAE. Add to your basket or drop us a call or
        message if you need some more help or advice. We’re on hand to help you
        get exactly what you’re looking for.
      </p>
      {/* <div className="w-full grid grid-cols-5 gap-2">
        {freeSampleImage.map((item, index) => (
          <div key={index}>
            <Image width={400} height={400} src={item.image} alt="freesample" />
          </div>
        ))}
      </div> */}
      <p className="text-sm sm:text-20 sm:leading-[26px] text-justify">
        We meticulously pack and ship your choices to guarantee they reach you
        in flawless condition. Additionally, there’s no pressure to buy
        afterwards — our focus is solely on helping you discover what you truly
        adore.
      </p>
      <p className="text-sm sm:text-20 sm:leading-[26px] text-justify">
        Find the essence of quality, texture, and colour firsthand, because the
        journey to the perfect choice begins with a premium experience.
      </p>
    </Container>
    <FreeSampleProducts
      products={publishedProducts}
      accessories={publishedAccessories}
      categories={publishedCategories}
    />
    </>
  );
};

export default FreeSampleDetail;
