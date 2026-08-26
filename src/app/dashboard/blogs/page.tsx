import { fetchBlogs } from 'config/fetch';
import Blogs from './Blogs';

const BlogsDashboard = async () => {
  const blogs = await fetchBlogs();
  return <Blogs blogs={blogs} />;
};

export default BlogsDashboard;
