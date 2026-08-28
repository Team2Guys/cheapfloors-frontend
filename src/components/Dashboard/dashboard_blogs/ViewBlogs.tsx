'use client';

import React, { SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { LiaEdit } from 'react-icons/lia';
import { AiOutlineEye } from 'react-icons/ai';
import Swal from 'sweetalert2';
import { Blog } from 'types/blog';
import { useMutation } from '@apollo/client';
import { REMOVE_BLOG } from 'graphql/blog';
import Table from 'components/ui/table';
import revalidateTag from 'components/ServerActons/ServerAction';
import { showAlert } from 'utils/Alert';

interface BlogsProps {
  setMenuType: React.Dispatch<SetStateAction<string>>;
  setEditBlog?: React.Dispatch<SetStateAction<Blog | undefined | null>>;
  blogs?: Blog[];
}

const ViewBlogs = ({ setMenuType, setEditBlog, blogs }: BlogsProps) => {
  const [blogList, setBlogList] = useState<Blog[] | undefined>(blogs);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [removeBlog] = useMutation(REMOVE_BLOG);

  useEffect(() => {
    setBlogList(blogs);
  }, [blogs]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredBlogs: Blog[] =
    (blogList &&
      blogList
        .filter(
          (blog) =>
            blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (blog.status &&
              blog.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (blog.category &&
              blog.category.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        })) ||
    [];

  const canDeleteBlog = true;
  const canAddBlog = true;
  const canEditBlog = true;

  const confirmDelete = (key: string | number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, the Blog cannot be recovered.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(key);
      }
    });
  };

  const handleDelete = async (key: number | string) => {
    try {
      await removeBlog({ variables: { id: Number(key) } });
      setBlogList((prev) =>
        prev ? prev.filter((item) => item.id !== key) : []
      );
      revalidateTag('blogs');
      showAlert({
        title: 'Blog Deleted: The blog has been successfully deleted.',
        icon: 'success'
      });
    } catch (err) {
      showAlert({
        title: 'Deletion Failed: There was an error deleting the blog.',
        icon: 'error'
      });
      throw err;
    }
  };

  const handleEdit = (record: Blog) => {
    if (setEditBlog) {
      setEditBlog(record);
      setMenuType('BlogForm');
    }
  };

  const columns = [
    {
      title: 'Image',
      key: 'posterImageUrl',
      render: (record: Blog) =>
        record.posterImageUrl ? (
          <Image
            src={record.posterImageUrl.imageUrl || ''}
            alt={`Image of ${record.title}`}
            loading="lazy"
            width={50}
            height={50}
          />
        ) : (
          <span>No Image</span>
        )
    },
    {
      title: 'Title',
      key: 'title'
    },
    {
      title: 'Category',
      key: 'category'
    },
    {
      title: 'Status',
      key: 'status'
    },
    {
      title: 'Created At',
      key: 'createdAt',
      render: (record: Blog) => {
        if (!record.createdAt) return <span>-</span>;
        const date = new Date(record.createdAt);
        return <span>{date.toISOString().split('T')[0]}</span>;
      }
    },
    {
      title: 'Updated At',
      key: 'updatedAt',
      render: (record: Blog) => {
        if (!record.updatedAt) return <span>-</span>;
        const date = new Date(record.updatedAt);
        return <span>{date.toISOString().split('T')[0]}</span>;
      }
    },
    {
      title: 'Edited By',
      key: 'last_editedBy'
    },
    {
      title: 'View',
      key: 'view',
      render: (record: Blog) =>
        record.status === 'PUBLISHED' ? (
          <a
            href={`/blogs/${record.custom_url}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View blog page"
          >
            <AiOutlineEye
              className="cursor-pointer text-black dark:text-white"
              size={20}
            />
          </a>
        ) : (
          <AiOutlineEye
            className="cursor-not-allowed text-slate-300 dark:text-slate-600"
            size={20}
            title="Draft blogs have no public page"
          />
        )
    },
    {
      title: 'Edit',
      key: 'edit',
      render: (record: Blog) => (
        <LiaEdit
          className={`cursor-pointer ${canEditBlog ? 'text-black dark:text-white' : 'cursor-not-allowed text-slate-200'}`}
          size={20}
          onClick={() => canEditBlog && handleEdit(record)}
        />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: Blog) => (
        <RiDeleteBin6Line
          className={`cursor-pointer ${
            canDeleteBlog
              ? 'text-red-500 dark:text-red-700'
              : 'cursor-not-allowed text-slate-300'
          }`}
          size={20}
          onClick={() => canDeleteBlog && confirmDelete(record.id)}
        />
      )
    }
  ];

  return (
    <div>
      <div className="flex_between mb-4 text-dark dark:text-white">
        <input
          className="dashboard_input"
          style={{ width: 'max-content' }}
          type="search"
          placeholder="Search Blog"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div>
          <p
            className={`${
              canAddBlog
                ? 'cursor-pointer bg-black text-white dark:bg-primary dark:border-0'
                : 'cursor-not-allowed bg-gray-400 text-white'
            } p-2 rounded-md flex justify-center`}
            onClick={() => {
              if (canAddBlog) {
                setEditBlog?.(undefined);
                setMenuType('Add Blog');
              }
            }}
          >
            Add Blog
          </p>
        </div>
      </div>

      {filteredBlogs && filteredBlogs.length > 0 ? (
        <Table<Blog> data={filteredBlogs} columns={columns} rowKey="id" />
      ) : (
        <p className="text-primary dark:text-white">No Blogs found</p>
      )}
    </div>
  );
};

export default ViewBlogs;
