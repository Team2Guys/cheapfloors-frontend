import { fetchBlogs } from 'config/fetch';
import Blogs from './Blogs';

// The GraphQL fetch is a POST, so it never lands in the Data Cache and
// revalidateTag('blogs') can't refresh this route — without this the page is
// prerendered at build time and stays frozen on that data in production.
export const dynamic = 'force-dynamic';

const BlogsDashboard = async () => {
  const blogs = await fetchBlogs();
  return <Blogs blogs={blogs} />;
};

export default BlogsDashboard;
