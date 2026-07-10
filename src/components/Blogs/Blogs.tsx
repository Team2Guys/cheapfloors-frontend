'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Container from 'components/common/container/Container';
import { blogCategories, blogsData } from 'data/blogs';
import { BlogsProps } from 'types/blog';
import BlogCard from './BlogCard';

const Blogs = ({
  title = 'All Blogs',
  heading = 'Tips, trends & ideas for upgrading your floors',
  description = 'Expert guides on SPC, LVT, herringbone, installation, and everything in between — for every room and every budget in the UAE.',
  bannerImage = '/assets/showroom.webp',
  categories = blogCategories,
  blogs = blogsData,
  initialCount = 6,
  activeCategory,
  activeSearch
}: BlogsProps) => {
  const isValidCategory = categories.some((c) => c.value === activeCategory);
  const [activeTab, setActiveTab] = useState(
    isValidCategory ? (activeCategory as string) : categories[0]?.value ?? 'all'
  );
  const [visibleCount, setVisibleCount] = useState(initialCount);

  // Keep the active tab in sync when arriving with a ?category= param
  // (e.g. from a blog detail page's category link).
  useEffect(() => {
    if (isValidCategory) {
      setActiveTab(activeCategory as string);
      setVisibleCount(initialCount);
    }
  }, [activeCategory, isValidCategory, initialCount]);

  const filteredBlogs = useMemo(() => {
    const byCategory =
      activeTab === 'all'
        ? blogs
        : blogs.filter((blog) => blog.category === activeTab);
    const query = activeSearch?.trim().toLowerCase();
    return query
      ? byCategory.filter((blog) => blog.title.toLowerCase().includes(query))
      : byCategory;
  }, [activeTab, blogs, activeSearch]);

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setVisibleCount(initialCount);
  };

  return (
    <section className="font-inter">
      {/* Hero banner */}
      <div className="relative h-[180px] xs:h-[220px] sm:h-[280px] md:h-[340px] w-full">
        <Image
          src={bannerImage}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <h1 className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          {title}
        </h1>
      </div>

      <Container className="py-8 md:py-12">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black">
            {heading}
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-600">
            {description}
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto sm:flex-wrap sm:justify-center sm:gap-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => {
            const isActive = activeTab === category.value;
            return (
              <button
                key={category.value}
                type="button"
                onClick={() => handleTabChange(category.value)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-primary bg-primary text-black'
                    : 'border-gray-300 bg-white text-black hover:border-primary'
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Blog grid */}
        {visibleBlogs.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {visibleBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-gray-500">
            No blogs found in this category.
          </p>
        )}

        {/* View more */}
        {visibleCount < filteredBlogs.length && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + initialCount)}
              className="rounded-full bg-primary px-8 py-2.5 text-sm font-semibold text-black transition hover:bg-secondary hover:text-white"
            >
              View more
            </button>
          </div>
        )}
      </Container>
    </section>
  );
};

export default Blogs;
