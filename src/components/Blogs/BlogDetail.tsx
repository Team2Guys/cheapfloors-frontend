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

const formatDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// The CMS emits raw <table> markup with cramped inline styles. Wrap each table
// so globals.css (.blog-content) can restyle it: multi-cell tables become
// scrollable data grids, single-cell tables become callout boxes.
const wrapTables = (html: string) =>
  html.replace(/<table\b([^>]*)>([\s\S]*?)<\/table>/gi, (_m, attrs, inner) => {
    const cellCount = (inner.match(/<t[dh]\b/gi) || []).length;
    const isCallout = cellCount <= 1;
    const wrapClass = isCallout ? 'blog-callout-wrap' : 'blog-table-wrap';
    const tableClass = isCallout ? 'blog-callout' : 'blog-data-table';
    const cleanAttrs = attrs.replace(/\sclass=("[^"]*"|'[^']*')/i, '');
    return `<div class="${wrapClass}"><table class="${tableClass}"${cleanAttrs}>${inner}</table></div>`;
  });

interface BlogDetailProps {
  blog: Blog;
  blogs: Blog[];
}

const BlogDetail = ({ blog, blogs }: BlogDetailProps) => {
  const relatedPosts = blogs.filter((b) => b.id !== blog.id);
  const content = wrapTables(blog.content || '');

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
          <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-black leading-tight">
            {blog.title}
          </h1>
          {blog.createdAt && (
            <p className="mt-3 text-center text-xs md:text-sm text-gray-500">
              {formatDate(blog.createdAt)}
            </p>
          )}

          <div className="relative mt-6 md:mt-8 aspect-[16/10] w-full overflow-hidden rounded-md">
            <Image
              src={blog.posterImageUrl?.imageUrl || ''}
              alt={blog.Images_Alt_Text || blog.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>

          <div className="mt-6 md:mt-8 px-1 blog-content-wrapper">
            <div
              className="blog-content text-left md:text-justify"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </article>
      </div>

      <RelatedPosts blogs={relatedPosts} />
    </section>
  );
};

export default BlogDetail;
