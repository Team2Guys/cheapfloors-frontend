import Blogs from 'components/Blogs/Blogs';
import ProductQuery from 'components/ProductQuery/ProductQuery';
import { fetchBlogs } from 'config/fetch';
import { Blog } from 'types/blog';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
export const metadata = createMetadata(pageMetadataData.blogs);

const Page = async ({
  searchParams
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) => {
  const { category, search } = await searchParams;
  const blogs = await fetchBlogs();
  const publishedBlogs = blogs.filter(
    (blog: Blog) => blog.status === 'PUBLISHED'
  );
  return (
    <>
      <Blogs
        blogs={publishedBlogs}
        activeCategory={category}
        activeSearch={search}
      />
      <ProductQuery />
    </>
  );
};

export default Page;
