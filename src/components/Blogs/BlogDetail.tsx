import Image from 'next/image';
import Link from 'next/link';
import { blogCategories } from 'data/blogs';
import { Blog, BlogCategory } from 'types/blog';
import BlogSearch from './BlogSearch';
import RelatedPosts from './RelatedPosts';

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

interface BlogDetailProps {
  blog: Blog;
  blogs: Blog[];
  categories?: BlogCategory[];
  bannerImage?: string;
  latestCount?: number;
}

const BlogDetail = ({
  blog,
  blogs,
  categories = blogCategories,
  bannerImage = '/assets/showroom.webp',
  latestCount = 5
}: BlogDetailProps) => {
  // Sidebar categories exclude the "all" pseudo-category.
  const sidebarCategories = categories.filter((c) => c.value !== 'all');
  const latestPosts = blogs.slice(0, latestCount);
  const relatedPosts = blogs.filter((b) => b.id !== blog.id);

  return (
    <section className="font-inter">
      {/* Hero banner */}
      <div className="relative h-[180px] xs:h-[220px] sm:h-[280px] md:h-[340px] w-full">
        <Image
          src={bannerImage}
          alt={blog.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <h1 className="absolute inset-0 flex items-center justify-center px-4 text-center text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          {blog.title}
        </h1>
      </div>

      <div className="mx-auto max-w-7xl px-2 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Article */}
          <article className="lg:col-span-2 bg-[#FEB90714] p-4 sm:p-6 md:p-8">
            <h2 className="text-center text-2xl md:text-3xl font-bold text-black">
              {blog.title}
            </h2>
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
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </div>

            <div
              className="mt-6 text-sm md:text-base leading-relaxed text-black [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:md:text-xl [&_h2]:font-bold [&_h2]:text-black [&_h3]:mt-4 [&_h3]:mb-1 [&_h3]:font-semibold [&_h3]:text-black [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-primary [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 h-fit">
            {/* Search */}
            {/* <div className="pb-6">
              <BlogSearch />
            </div> */}

            {/* Categories */}
            <div className="pt-5 border border-b-0 border-[#0000001F] bg-[#FEB90714]">
              <h3 className="px-4 text-xl md:text-2xl font-bold text-black">
                Categories
              </h3>
              <ul className="mt-4 border-t border-[#0000001F]">
                {sidebarCategories.map((category) => (
                  <li key={category.value}>
                    <Link
                      href={`/blogs?category=${encodeURIComponent(category.value)}`}
                      className="block border-b border-[#0000001F] px-4 py-3 text-sm text-black transition-colors hover:bg-[#FEB90714] hover:text-primary"
                    >
                      {category.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Latest Posts */}
            <div className="pt-6 border border-t-0 border-[#0000001F] bg-[#FEB90714]">
              <h3 className="px-4 text-xl md:text-2xl font-bold text-black">
                Latest Posts
              </h3>
              <ul className="mt-4 border-t border-[#0000001F]">
                {latestPosts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blogs/${post.custom_url}`}
                      className="group block border-b border-[#0000001F] px-4 py-3 transition-colors hover:bg-[#FEB90714]"
                    >
                      <p className="text-sm font-medium text-black group-hover:text-primary line-clamp-2">
                        {post.title}
                      </p>
                      <p className="mt-1 text-[11px] text-gray-500">
                        {formatDate(post.createdAt)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <RelatedPosts blogs={relatedPosts} />
    </section>
  );
};

export default BlogDetail;
