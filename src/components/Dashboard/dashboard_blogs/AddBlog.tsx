'use client';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import Image from 'next/image';
import {
  confirmDeleteImage,
  confirmLeaveWithUnsavedChanges,
  handleImageAltText,
  ImageRemoveHandler,
  updateImageStates
} from 'utils/helperFunctions';
import {
  Formik,
  Form,
  FormikHelpers,
  ErrorMessage,
  Field,
  FormikProps
} from 'formik';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { blogInitialValues, blogValidationSchema } from 'data/data';
import { blogCategories } from 'data/blogs';
import Loader from 'components/Loader/Loader';
import revalidateTag from '../../ServerActons/ServerAction';
import ImageUploader from 'components/ImageUploader/ImageUploader';
import { ProductImage } from 'types/prod';
import { Blog, EDIT_BLOG } from 'types/blog';
import client from 'config/apolloClient';
import { CREATE_BLOG, UPDATE_BLOG, FETCH_ALL_BLOGS } from 'graphql/blog';
import Cookies from 'js-cookie';
import TinyMCEEditor from 'components/Dashboard/tinyMc/MyEditor';
import CropModal from 'components/common/CropModal';
import useImageCropper from 'hooks/useImageCropper';
import Input from 'components/ui/Input';
import { showAlert } from 'utils/Alert';

interface editBlogProps {
  setEditBlog: React.Dispatch<SetStateAction<Blog | undefined | null>>;
  editBlog: Blog | undefined | null;
  setMenuType: React.Dispatch<SetStateAction<string>>;
}

const blogCategoryOptions = blogCategories.filter(
  (category) => category.value !== 'all'
);

const AddBlog = ({ setEditBlog, editBlog, setMenuType }: editBlogProps) => {
  const BlogValues: EDIT_BLOG | null =
    editBlog && editBlog.title
      ? {
          title: editBlog.title || '',
          content: editBlog.content || '',
          category: editBlog.category || '',
          Images_Alt_Text: editBlog.Images_Alt_Text || '',
          Meta_Title: editBlog.Meta_Title || '',
          Meta_Description: editBlog.Meta_Description || '',
          Canonical_Tag: editBlog.Canonical_Tag || '',
          custom_url: editBlog.custom_url || '',
          status: editBlog?.status || 'DRAFT'
        }
      : null;
  const token = Cookies.get('admin_access_token');
  const superAdminToken = Cookies.get('super_admin_access_token');
  const finalToken = token ? token : superAdminToken;

  const [posterimageUrl, setposterimageUrl] = useState<
    ProductImage[] | undefined
  >(
    editBlog && editBlog.posterImageUrl
      ? [editBlog.posterImageUrl]
      : undefined
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [loading, setloading] = useState<boolean>(false);
  const [editBlogValues, setEditBlogValues] = useState<
    EDIT_BLOG | null | undefined
  >(BlogValues);
  const formikRef = useRef<FormikProps<EDIT_BLOG>>(null);

  const {
    isCropModalVisible,
    imageSrc,
    crop,
    imgRef,
    handleCropClick,
    onImageLoad,
    onCropComplete,
    handleCropModalOk,
    handleCropModalCancel,
    setCrop
  } = useImageCropper();

  const onSubmit = async (
    values: EDIT_BLOG,
    { resetForm }: FormikHelpers<EDIT_BLOG>
  ) => {
    try {
      setloading(true);
      const posterImageUrl = posterimageUrl && posterimageUrl[0];

      if (!posterImageUrl) throw new Error('Please select relevant Images');
      const newValue = {
        ...values,
        posterImageUrl
      };
      const updateFlag = editBlogValues ? true : false;

      if (updateFlag) {
        await client.mutate({
          mutation: UPDATE_BLOG,
          variables: {
            input: {
              id: Number(editBlog?.id),
              ...newValue
            }
          },
          refetchQueries: [{ query: FETCH_ALL_BLOGS }]
        });
      } else {
        await client.mutate({
          mutation: CREATE_BLOG,
          variables: { input: newValue },
          refetchQueries: [{ query: FETCH_ALL_BLOGS }]
        });
      }

      revalidateTag('blogs');
      setloading(false);
      showAlert({
        title: updateFlag
          ? 'Blog has been successfully updated!'
          : 'Blog has been successfully created!',
        icon: 'success'
      });
      setEditBlog?.(undefined);
      setposterimageUrl(undefined);
      setMenuType('Blogs');
      resetForm();
    } catch (err) {
      setloading(false);
      throw err;
    }
  };

  useEffect(() => {
    setEditBlogValues(BlogValues);
  }, [editBlog]);

  useEffect(() => {
    if (posterimageUrl?.length || formikRef.current?.dirty) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [posterimageUrl, formikRef.current?.dirty]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (formikRef.current?.dirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={editBlogValues ? editBlogValues : blogInitialValues}
      validationSchema={blogValidationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Form onSubmit={formik.handleSubmit}>
            <div className="flex_between">
              <p
                className="dashboard_primary_button"
                onClick={async () => {
                  if (hasUnsavedChanges || formikRef.current?.dirty) {
                    const shouldLeave = await confirmLeaveWithUnsavedChanges();
                    if (!shouldLeave) return;
                  }
                  setMenuType('Blogs');
                  setEditBlog?.(() => undefined);
                }}
              >
                <IoMdArrowRoundBack /> Back
              </p>
              <div className="flex gap-6 items-center">
                <Field name="status">
                  {({ field, form }: import('formik').FieldProps) => (
                    <div className="flex gap-4 items-center my-4">
                      <label className="font-semibold text-black dark:text-white">
                        Blog Status:
                      </label>

                      {['DRAFT', 'PUBLISHED'].map((status) => {
                        const isActive = field.value === status;

                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() => form.setFieldValue('status', status)}
                            disabled={isActive}
                            className={`px-4 py-2 rounded-md text-sm border
                        ${
                          isActive
                            ? 'border text-opacity-1 cursor-not-allowed bg-white dark:bg-black dark:text-white'
                            : 'dashboard_primary_button'
                        }`}
                          >
                            {status}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </Field>
                <button
                  type="submit"
                  className="dashboard_primary_button"
                  disabled={loading}
                >
                  {loading ? <Loader color="#fff" /> : 'Submit'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-white dark:bg-black dark:text-white dark:border-white py-10 px-4 rounded-md shadow">
              <div className="space-y-4">
                <div className="rounded-sm border bg-white dark:bg-black">
                  <div className="border-b py-4 px-2 dark:bg-black dark:text-white dark:border-white">
                    <h3 className="font-medium text-black dark:text-white">
                      Add Blog Image
                    </h3>
                  </div>
                  {posterimageUrl && posterimageUrl.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 dark:border-white dark:bg-black">
                      {posterimageUrl.map(
                        (item: ProductImage, index: number) => {
                          return (
                            <div
                              className="relative group rounded-lg overflow-hidden shadow-md bg-white transform transition-transform duration-300 hover:scale-105"
                              key={index}
                            >
                              <div className="absolute top-1 right-1 invisible group-hover:visible text-red bg-white rounded-full ">
                                <RxCross2
                                  className="cursor-pointer text-red-500 dark:text-red-700"
                                  size={17}
                                  onClick={async () => {
                                    const confirmed =
                                      await confirmDeleteImage();
                                    if (confirmed) {
                                      ImageRemoveHandler(
                                        item.public_id,
                                        setposterimageUrl,
                                        finalToken
                                      );
                                    }
                                  }}
                                />
                              </div>

                              <Image
                                onClick={() => handleCropClick(item.imageUrl)}
                                key={index}
                                className="object-cover w-full h-full dark:bg-black dark:shadow-lg cursor-crosshair"
                                width={300}
                                height={200}
                                src={item.imageUrl}
                                loading="lazy"
                                alt={`blogImage-${index}`}
                              />

                              <input
                                className="dashboard_input"
                                placeholder="Alt Text"
                                type="text"
                                name="altText"
                                value={item?.altText || ''}
                                onChange={(e) =>
                                  handleImageAltText(
                                    index,
                                    String(e.target.value),
                                    setposterimageUrl,
                                    'altText'
                                  )
                                }
                              />
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <ImageUploader setposterimageUrl={setposterimageUrl} />
                  )}
                </div>
                <CropModal
                  visible={isCropModalVisible}
                  imageSrc={imageSrc}
                  crop={
                    crop ?? { unit: '%', x: 0, y: 0, width: 100, height: 100 }
                  }
                  setCrop={setCrop}
                  onCropComplete={onCropComplete}
                  imgRef={imgRef}
                  onImageLoad={onImageLoad}
                  onOk={() =>
                    handleCropModalOk((newImg, originalSrc) => {
                      updateImageStates(
                        [setposterimageUrl],
                        newImg,
                        originalSrc
                      );
                    })
                  }
                  onCancel={handleCropModalCancel}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Blog Title" name="title" placeholder="Title" />
                  <Input
                    label="Custom URL"
                    name="custom_url"
                    placeholder="Custom URL"
                  />
                </div>
                <div>
                  <label className="block mb-3 text-sm font-medium text-black dark:text-white">
                    Blog Category
                  </label>
                  <Field as="select" name="category" className="dashboard_input">
                    <option value="">Select Category</option>
                    {blogCategoryOptions.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <Input
                  label="Image Alt Text"
                  name="Images_Alt_Text"
                  placeholder="Image Alt Text"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block mb-3 text-sm font-medium text-black dark:text-white">
                    Blog Content
                  </label>
                  <TinyMCEEditor name="content" />
                  <ErrorMessage
                    name="content"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Meta Title"
                    name="Meta_Title"
                    placeholder="Meta Title"
                  />
                  <Input
                    label="Canonical Tag"
                    name="Canonical_Tag"
                    placeholder="Canonical Tag"
                  />
                </div>
                <Input
                  label="Meta Description"
                  name="Meta_Description"
                  placeholder="Meta Description"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="dashboard_primary_button mt-2"
                disabled={loading}
              >
                {loading ? <Loader color="#fff" /> : 'Submit'}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddBlog;
