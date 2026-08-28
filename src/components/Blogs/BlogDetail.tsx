import Image from 'next/image';
import Link from 'next/link';
import Container from 'components/common/container/Container';
import { Blog } from 'types/blog';
import RelatedPosts from './RelatedPosts';

const BreadcrumbChevron = () => (
  <svg
    viewBox="0 0 7 12"
    className="text-black fill-black w-[5px] sm:w-[7px] shrink-0"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6.51562 6.53125L2.26562 10.7812C1.95312 11.0938 1.48438 11.0938 1.20312 10.7812L0.484375 10.0938C0.203125 9.78125 0.203125 9.3125 0.484375 9.03125L3.51562 6.03125L0.484375 3C0.203125 2.71875 0.203125 2.25 0.484375 1.9375L1.20312 1.21875C1.48438 0.9375 1.95312 0.9375 2.26562 1.21875L6.51562 5.46875C6.79688 5.78125 6.79688 6.25 6.51562 6.53125Z" />
  </svg>
);

interface BlogDetailProps {
  blog: Blog;
  blogs: Blog[];
}

const BlogDetail = ({ blog, blogs }: BlogDetailProps) => {
  const relatedPosts = blogs.filter((b) => b.id !== blog.id);

  return (
    <section className="font-inter">
      {/* Breadcrumb */}
      <div className="w-full pt-3">
        <div className="z-30 w-full py-3 bg-[#F9FAFB]">
          <Container className="text-lg flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="hover:underline text-[9px] xs:text-11 sm:text-12 md:text-sm text-[#9F9F9F] capitalize font-medium"
            >
              Home
            </Link>
            <BreadcrumbChevron />
            <Link
              href="/blogs"
              className="hover:underline text-[9px] xs:text-11 sm:text-12 md:text-sm text-[#9F9F9F] capitalize font-medium"
            >
              Blogs
            </Link>
            <BreadcrumbChevron />
            <span className="text-black text-[9px] xs:text-11 sm:text-12 md:text-sm font-bold line-clamp-1">
              {blog.title}
            </span>
          </Container>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-2 py-8 md:py-12">
        {/* Article */}
        <article className="mx-auto max-w-4xl p-4 sm:p-6 md:p-8">
          <h1 className="text-center text-2xl md:text-3xl font-bold text-black">
            {blog.title}
          </h1>
          {blog.Meta_Description && (
            <p className="mt-3 text-center text-xs md:text-sm text-black">
              {blog.Meta_Description}
            </p>
          )}

          <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-md">
            <Image
              src={blog.posterImageUrl?.imageUrl || ''}
              alt={blog.Images_Alt_Text || blog.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>

          <div
            className="mt-6 text-sm md:text-base leading-relaxed text-black [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:md:text-xl [&_h2]:font-bold [&_h2]:text-black [&_h3]:mt-4 [&_h3]:mb-1 [&_h3]:font-semibold [&_h3]:text-black [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-primary [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </div>

      <RelatedPosts blogs={relatedPosts} />
    </section>
  );
};

export default BlogDetail;
