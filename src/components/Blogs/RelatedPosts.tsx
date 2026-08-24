'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Container from 'components/common/container/Container';
import { Blog } from 'types/blog';
import BlogCard from './BlogCard';

interface RelatedPostsProps {
  blogs: Blog[];
  title?: string;
}

const RelatedPosts = ({ blogs, title = 'Related posts' }: RelatedPostsProps) => {
  if (!blogs?.length) return null;

  return (
    <Container className="py-8 md:py-12 font-inter">
      <h2 className="mb-6 md:mb-10 text-center text-2xl md:text-3xl font-bold text-black">
        {title}
      </h2>

      <Swiper
        slidesPerView={1}
        spaceBetween={16}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 }
        }}
        className="w-full"
      >
        {blogs.map((blog) => (
          <SwiperSlide key={blog.id} className="!h-auto">
            <BlogCard blog={blog} showExcerpt={false} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default RelatedPosts;
