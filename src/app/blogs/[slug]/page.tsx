import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import BlogDetail from 'components/Blogs/BlogDetail';
import { fetchBlogs, fetchSingleBlog } from 'config/fetch';
import { Blog } from 'types/blog';

const BASE_URL = 'https://cheapfloors.ae';

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchSingleBlog(slug.trim());
  if (!blog || blog.status !== 'PUBLISHED') return notFound();

  const url = `${BASE_URL}/blogs/${blog.custom_url}`;
  const title = blog.Meta_Title || blog.title;
  const description = blog.Meta_Description || '';
  const NewImage = [
    {
      url: blog.posterImageUrl?.imageUrl || `${BASE_URL}/assets/images/logo.png`,
      alt: blog.Images_Alt_Text || blog.title
    }
  ];

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: url,
      images: NewImage,
      type: 'website'
    },
    alternates: {
      canonical: blog.Canonical_Tag || url
    }
  };
}

const BlogDetailPage = async ({
  params
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const [blog, blogs] = await Promise.all([
    fetchSingleBlog(slug.trim()),
    fetchBlogs()
  ]);

  if (!blog || blog.status !== 'PUBLISHED') return notFound();

  const publishedBlogs = blogs.filter(
    (item: Blog) => item.status === 'PUBLISHED'
  );

  return <BlogDetail blog={blog} blogs={publishedBlogs} />;
};

export default BlogDetailPage;
