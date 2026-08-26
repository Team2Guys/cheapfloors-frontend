'use client';

import Breadcrumb from 'components/Dashboard/Breadcrumbs/Breadcrumb';
import DefaultLayout from 'components/Dashboard/DefaultLayout';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const AddBlog = dynamic(
  () => import('components/Dashboard/dashboard_blogs/AddBlog')
);
const ViewBlogs = dynamic(
  () => import('components/Dashboard/dashboard_blogs/ViewBlogs')
);
import { Blog } from 'types/blog';

const BLOGS = ({ blogs }: { blogs: Blog[] }) => {
  const [menuType, setMenuType] = useState<string>('Blogs');
  const [editBlog, setEditBlog] = useState<Blog | undefined | null>();
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    setAllBlogs(blogs);
  }, [blogs]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName={menuType} />
      {menuType === 'Blogs' ? (
        <div className="flex flex-col gap-10">
          <ViewBlogs
            setMenuType={setMenuType}
            setEditBlog={setEditBlog}
            blogs={allBlogs || []}
          />
        </div>
      ) : (
        <AddBlog
          setMenuType={setMenuType}
          setEditBlog={setEditBlog}
          editBlog={editBlog}
        />
      )}
    </DefaultLayout>
  );
};

export default BLOGS;
