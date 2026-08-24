import Blogs from 'components/Blogs/Blogs';
import ProductQuery from 'components/ProductQuery/ProductQuery';

const Page = async ({
  searchParams
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) => {
  const { category, search } = await searchParams;
  return (
    <>
      <Blogs activeCategory={category} activeSearch={search} />
      <ProductQuery />
    </>
  );
};

export default Page;