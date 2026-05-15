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
import { categoryInitialValues, categoryValidationSchema } from 'data/data';
import Loader from 'components/Loader/Loader';
import revalidateTag from '../ServerActons/ServerAction';
import ImageUploader from 'components/ImageUploader/ImageUploader';
import { ProductImage } from 'types/prod';
import { Category, EDIT_CATEGORY } from 'types/cat';
import client from 'config/apolloClient';
import { CREATE_CATEGORY, UPDATE_CATEGORY } from 'graphql/mutations';
import { FETCH_ALL_CATEGORIES } from 'graphql/queries';
import Cookies from 'js-cookie';
import TinyMCEEditor from 'components/Dashboard/tinyMc/MyEditor';
import CropModal from 'components/common/CropModal';
import useImageCropper from 'hooks/useImageCropper';
import Input from 'components/ui/Input';
import { showAlert } from 'utils/Alert';

interface editCategoryProps {
  seteditCategory: React.Dispatch<SetStateAction<Category | undefined | null>>;
  editCategory: Category | undefined | null;
  setMenuType: React.Dispatch<SetStateAction<string>>;
}

const FormLayout = ({
  seteditCategory,
  editCategory,
  setMenuType
}: editCategoryProps) => {
  const CategoryName: EDIT_CATEGORY | null =
    editCategory && editCategory.name
      ? {
          name: editCategory.name || '',
          description: editCategory.description || '',
          Meta_Title: editCategory.Meta_Title || '',
          short_description: editCategory.short_description || '',
          Meta_Description: editCategory.Meta_Description || '',
          Canonical_Tag: editCategory.Canonical_Tag || '',
          custom_url: editCategory.custom_url || '',
          topHeading: editCategory.topHeading || '',
          RecallUrl: editCategory.RecallUrl || '',
          price: editCategory.price || '',
          status: editCategory?.status || 'DRAFT'
        }
      : null;
  const token = Cookies.get('admin_access_token');
  const superAdminToken = Cookies.get('super_admin_access_token');
  const finalToken = token ? token : superAdminToken;

  const [posterimageUrl, setposterimageUrl] = useState<
    ProductImage[] | undefined
  >(
    editCategory && editCategory.posterImageUrl
      ? [editCategory.posterImageUrl]
      : undefined
  );
  const [BannerImageUrl, setBannerImageUrl] = useState<
    ProductImage[] | undefined
  >(
    editCategory && editCategory?.whatAmiImageBanner
      ? [editCategory?.whatAmiImageBanner]
      : undefined
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [loading, setloading] = useState<boolean>(false);
  const [editCategoryName, setEditCategoryName] = useState<
    EDIT_CATEGORY | null | undefined
  >(CategoryName);
  const formikRef = useRef<FormikProps<EDIT_CATEGORY>>(null);

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
    values: EDIT_CATEGORY,
    { resetForm }: FormikHelpers<EDIT_CATEGORY>
  ) => {
    try {
      setloading(true);
      const posterImageUrl = posterimageUrl && posterimageUrl[0];
      const Banner = BannerImageUrl && BannerImageUrl[0];

      if (!posterImageUrl) throw new Error('Please select relevant Images');
      const newValue = {
        ...values,
        posterImageUrl,
        whatAmiImageBanner: Banner
      };
      //eslint-disable-next-line
      const { recalledSubCats, ...rest } = newValue;
      const updateFlag = editCategoryName ? true : false;

      if (updateFlag) {
        await client.mutate({
          mutation: UPDATE_CATEGORY,
          variables: {
            input: {
              id: Number(editCategory?.id),
              ...rest
            }
          },
          refetchQueries: [{ query: FETCH_ALL_CATEGORIES }]
        });
      } else {
        await client.mutate({
          mutation: CREATE_CATEGORY,
          variables: { input: rest },
          refetchQueries: [{ query: FETCH_ALL_CATEGORIES }]
        });
      }

      revalidateTag('categories');
      setloading(false);
      showAlert({
        title: updateFlag
          ? 'Category has been successfully updated!'
          : 'Category has been successfully created!',
        icon: 'success'
      });
      seteditCategory?.(undefined);
      setposterimageUrl(undefined);
      setMenuType('Categories');
      resetForm();
    } catch (err) {
      setloading(false);
      setposterimageUrl(undefined);
      throw err;
    }
  };
  useEffect(() => {
    setEditCategoryName(CategoryName);
  }, [editCategory]);

  useEffect(() => {
    if (
      posterimageUrl?.length ||
      BannerImageUrl?.length ||
      formikRef.current?.dirty
    ) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [posterimageUrl, BannerImageUrl, formikRef.current?.dirty]);

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
      initialValues={
        editCategoryName ? editCategoryName : categoryInitialValues
      }
      validationSchema={categoryValidationSchema}
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
                  setMenuType('Categories');
                  seteditCategory?.(() => undefined);
                }}
              >
                <IoMdArrowRoundBack /> Back
              </p>
              <div className="flex gap-6 items-center">
                <Field name="status">
                  {({ field, form }: import('formik').FieldProps) => (
                    <div className="flex gap-4 items-center my-4">
                      <label className="font-semibold text-black dark:text-white">
                        Category Status:
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

            <div className="grid grid-cols-2 gap-4 bg-white dark:bg-black dark:text-white  dark:border-white py-10 px-4 rounded-md shadow">
              <div className="space-y-4">
                <div className="rounded-sm border  bg-white    dark:bg-black">
                  <div className="border-b  py-4 px-2  dark:bg-black dark:text-white  dark:border-white">
                    <h3 className="font-medium text-black dark:text-white">
                      Add Category Images
                    </h3>
                  </div>
                  {posterimageUrl && posterimageUrl.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4  dark:border-white dark:bg-black">
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
                                alt={`productImage-${index}`}
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
                        [setposterimageUrl, setBannerImageUrl],
                        newImg,
                        originalSrc
                      );
                    })
                  }
                  onCancel={handleCropModalCancel}
                />
                <div className="rounded-sm border bg-white dark:bg-black">
                  <div className="border-b py-4 px-2 dark:bg-black dark:text-white dark:border-white">
                    <h3 className="font-medium text-black dark:text-white">
                      Add Banner Image
                    </h3>
                  </div>
                  {BannerImageUrl?.[0] && BannerImageUrl?.length > 0 ? (
                    <div className=" p-4  dark:bg-black dark:text-white dark:border-white">
                      {BannerImageUrl.map(
                        (item: ProductImage, index: number) => {
                          return (
                            <div
                              className="relative group rounded-lg w-fit overflow-hidden shadow-md bg-white dark:border-white dark:bg-black"
                              key={index}
                            >
                              <div className="absolute top-1 right-1 invisible group-hover:visible text-red bg-white dark:bg-black rounded-full ">
                                <RxCross2
                                  className="cursor-pointer border rounded text-red-500 dark:text-red-700"
                                  size={17}
                                  onClick={async () => {
                                    const confirmed =
                                      await confirmDeleteImage();
                                    if (confirmed) {
                                      ImageRemoveHandler(
                                        item.public_id,
                                        setBannerImageUrl,
                                        finalToken
                                      );
                                    }
                                  }}
                                />
                              </div>
                              <Image
                                onClick={() => handleCropClick(item.imageUrl)}
                                key={index}
                                className="w-full h-full dark:bg-black dark:shadow-lg cursor-crosshair"
                                width={200}
                                height={500}
                                loading="lazy"
                                src={item?.imageUrl || ''}
                                alt={`productImage-${index}`}
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
                                    setBannerImageUrl,
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
                    <ImageUploader setposterimageUrl={setBannerImageUrl} />
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Category Title"
                    name="name"
                    placeholder="Title"
                  />
                  <Input
                    label="Custom URL"
                    name="custom_url"
                    placeholder="Custom URL"
                  />
                  <Input
                    label="Starting Price"
                    type="number"
                    name="price"
                    placeholder="Starting Price"
                  />
                </div>
                <Input
                  label="RecallUrl(products & Categories)"
                  name="RecallUrl"
                  placeholder="RecallUrl(products & Categories)"
                />
                <Input
                  label="Category Top Heading"
                  name="topHeading"
                  placeholder="Category Top Heading"
                />
                <Input
                  label="Short Description"
                  name="short_description"
                  placeholder="Short Description"
                  textarea
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block mb-3 text-sm font-medium text-black dark:text-white">
                    Category Description
                  </label>
                  <TinyMCEEditor name="description" />
                  <ErrorMessage
                    name="description"
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
            <Field name="status">
              {({ field, form }: import('formik').FieldProps) => (
                <div className="flex gap-4 items-center my-4">
                  <label className="font-semibold text-black dark:text-white">
                    Category Status:
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

export default FormLayout;
