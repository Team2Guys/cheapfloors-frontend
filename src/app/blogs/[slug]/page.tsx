import { notFound } from 'next/navigation';
import BlogDetail from 'components/Blogs/BlogDetail';
import { blogsData } from 'data/blogs';

const BlogDetailPage = async ({
  params
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const blog = blogsData.find((item) => item.redirectionUrl === slug);

  if (!blog) return notFound();

  return <BlogDetail blog={blog} />;
};

export default BlogDetailPage;
