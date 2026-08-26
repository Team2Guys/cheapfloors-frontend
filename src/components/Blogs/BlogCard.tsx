import Image from 'next/image';
import Link from 'next/link';
import { Blog } from 'types/blog';

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

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

const BlogCard = ({
  blog,
  showExcerpt = true
}: {
  blog: Blog;
  showExcerpt?: boolean;
}) => {
  return (
    <article className="flex flex-col bg-white">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={blog.posterImageUrl?.imageUrl || ''}
          alt={blog.Images_Alt_Text || blog.title}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-3 md:p-4">
        <p className="text-[11px] md:text-xs text-gray-500">
          {formatDate(blog.createdAt)}
        </p>
        <h3 className="mt-1 text-sm md:text-base font-bold text-black line-clamp-1">
          {blog.title}
        </h3>
        {showExcerpt && (
          <p className="mt-2 text-xs md:text-[13px] leading-relaxed text-gray-600 line-clamp-4">
            {stripHtml(blog.content)}
          </p>
        )}
        <Link
          href={`/blogs/${blog.custom_url}`}
          className="mt-3 inline-block text-xs md:text-sm font-semibold text-primary hover:underline"
        >
          Read Article
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
