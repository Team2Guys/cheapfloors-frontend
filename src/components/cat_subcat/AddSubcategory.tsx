'use client';
import React, { useEffect, useRef, useState } from 'react';
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
  Field,
  ErrorMessage,
  FieldArray,
  FormikProps
} from 'formik';
import { IoMdArrowRoundBack } from 'react-icons/io';
import {
  subcategoryInitialValues,
  subcategoryValidationSchema
} from 'data/data';
import Loader from 'components/Loader/Loader';
import Cookies from 'js-cookie';
import { DASHBOARD_ADD_SUBCATEGORIES_PROPS } from 'types/PagesProps';
import { AdditionalInformation, ProductImage } from 'types/prod';
import { Category, ISUBCATEGORY_EDIT } from 'types/cat';
import ImageUploader from 'components/ImageUploader/ImageUploader';
import { useMutation } from '@apollo/client';
import { CREATE_SUBCATEGORY, UPDATE_SUBCATEGORY } from 'graphql/mutations';
import { FETCH_ALL_SUB_CATEGORIES } from 'graphql/queries';
import revalidateTag from 'components/ServerActons/ServerAction';
import TinyMCEEditor from 'components/Dashboard/tinyMc/MyEditor';
import useImageCropper from 'hooks/useImageCropper';
import CropModal from 'components/common/CropModal';
import Input from 'components/ui/Input';
import { showAlert } from 'utils/Alert';

const FormLayout = ({
  seteditCategory,
  editCategory,
  setMenuType,
  categoriesList
}: DASHBOARD_ADD_SUBCATEGORIES_PROPS) => {
  const CategoryName =
    editCategory && editCategory.name
      ? ({
          name: editCategory.name,
          description: editCategory.description || '',
          category: editCategory?.category.id || 0,
          Meta_Title: editCategory.Meta_Title || '',
          short_description: editCategory.short_description || '',
          Meta_Description: editCategory.Meta_Description || '',
          Canonical_Tag: editCategory.Canonical_Tag || '',
          custom_url: editCategory.custom_url || '',
          whatamIdetails: editCategory?.whatamIdetails || [],
          whatAmiTopHeading: editCategory?.whatAmiTopHeading || '',
          Heading: editCategory?.Heading || '',
          recalledByCategories:
            editCategory?.recalledByCategories?.map(
              (value: Category) => value.id
            ) || [],
          price: editCategory.price || '',
          sizes: editCategory.sizes || [],
          whatIamEndpoint: editCategory.whatIamEndpoint || '',
          whatAmiCanonical_Tag: editCategory.whatAmiCanonical_Tag || '',
          whatAmiMeta_Description: editCategory.whatAmiMeta_Description || '',
          whatAmiMeta_Title: editCategory.whatAmiMeta_Title || '',
          status: editCategory?.status || 'DRAFT'
        } as ISUBCATEGORY_EDIT)
      : undefined;

  const [posterimageUrl, setposterimageUrl] = useState<
    ProductImage[] | undefined
  >(
    editCategory && editCategory?.posterImageUrl
      ? [editCategory?.posterImageUrl]
      : undefined
  );
  const [BannerImageUrl, setBannerImageUrl] = useState<
    ProductImage[] | undefined
  >(
    editCategory && editCategory?.whatAmiImageBanner
      ? [editCategory?.whatAmiImageBanner]
      : undefined
  );
  const [WhatamIImageUrl, setWhatamIImageUrl] = useState<
    ProductImage[] | undefined
  >(
    editCategory && editCategory?.whatAmiImage
      ? editCategory?.whatAmiImage
      : undefined
  );
  const [homePagemageUrl, sethomePagemageUrl] = useState<
    ProductImage[] | undefined
  >(
    editCategory && editCategory?.homePageImage
      ? [editCategory?.homePageImage]
      : undefined
  );
  const [bannerImage, setBannerImage] = useState<ProductImage[] | undefined>(
    editCategory && editCategory?.BannerImage
      ? [editCategory?.BannerImage]
      : undefined
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [loading, setloading] = useState<boolean>(false);

  const [editCategoryName, setEditCategoryName] = useState<
    ISUBCATEGORY_EDIT | undefined
  >(CategoryName);
  const token = Cookies.get('admin_access_token');
  const superAdminToken = Cookies.get('super_admin_access_token');
  const finalToken = token ? token : superAdminToken;

  const [createSubCategory] = useMutation(CREATE_SUBCATEGORY);
  const [updateSubCategory] = useMutation(UPDATE_SUBCATEGORY);
  const formikRef = useRef<FormikProps<ISUBCATEGORY_EDIT>>(null);

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
    values: ISUBCATEGORY_EDIT,
    { resetForm }: FormikHelpers<ISUBCATEGORY_EDIT>
  ) => {
    if (!values.category) {
      return showAlert({
        title: 'Select parent category!!',
        icon: 'warning'
      });
    }
    try {
      setloading(true);
      const posterImageUrl = posterimageUrl && posterimageUrl[0];
      const Banner = BannerImageUrl && BannerImageUrl[0];
      const whatIamIImage = WhatamIImageUrl && WhatamIImageUrl;
      const homePageImage = homePagemageUrl && homePagemageUrl[0];
      const NewbannerImage = bannerImage && bannerImage[0];
      const updateValues = {
        ...values,
        posterImageUrl,
        BannerImage: NewbannerImage,
        whatAmiImageBanner: Banner,
        whatAmiImage: whatIamIImage,
        homePageImage
      };
      //eslint-disable-next-line
      const { recalledSubCats, ...newValue } = updateValues;
      const updateFlag = editCategoryName ? true : false;

      if (updateFlag) {
        // Update Existing SubCategory
        await updateSubCategory({
          variables: {
            input: {
              id: Number(editCategory?.id),
              ...newValue
            }
          },
          refetchQueries: [{ query: FETCH_ALL_SUB_CATEGORIES }],
          context: {
            headers: {
              Authorization: `Bearer ${finalToken}`
            }
          }
        });
        showAlert({
          title: 'Sub Category has been successfully updated!',
          icon: 'success'
        });
      } else {
        // Create New SubCategory
        await createSubCategory({
          variables: {
            input: newValue
          },
          refetchQueries: [{ query: FETCH_ALL_SUB_CATEGORIES }]
        });
        showAlert({
          title: 'Sub Category has been successfully created!',
          icon: 'success'
        });
      }
      revalidateTag('subcategories');

      setloading(false);
      seteditCategory?.(undefined);
      setposterimageUrl(undefined);
      setBannerImageUrl(undefined);
      setWhatamIImageUrl([]);
      sethomePagemageUrl(undefined);
      setBannerImage(undefined);
      resetForm();
      setMenuType('Sub Categories');
    } catch (err) {
      setloading(false);
      showAlert({
        title: 'Something went wrong!',
        icon: 'error'
      });
      throw err;
    }
  };
  useEffect(() => {
    setposterimageUrl(
      editCategory && editCategory?.posterImageUrl
        ? [editCategory?.posterImageUrl]
        : undefined
    );
    setBannerImageUrl(
      editCategory && editCategory?.whatAmiImageBanner
        ? [editCategory?.whatAmiImageBanner]
        : undefined
    );
    setWhatamIImageUrl(
      editCategory && editCategory?.whatAmiImage
        ? editCategory?.whatAmiImage
        : []
    );
    sethomePagemageUrl(
      editCategory && editCategory?.homePageImage
        ? [editCategory?.homePageImage]
        : undefined
    );
    setBannerImage(
      editCategory && editCategory?.BannerImage
        ? [editCategory?.BannerImage]
        : undefined
    );

    setEditCategoryName(CategoryName);
  }, [editCategory]);

  useEffect(() => {
    if (
      posterimageUrl?.length ||
      BannerImageUrl?.length ||
      WhatamIImageUrl?.length ||
      homePagemageUrl?.length ||
      bannerImage?.length ||
      formikRef.current?.dirty
    ) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [
    posterimageUrl,
    BannerImageUrl,
    WhatamIImageUrl,
    homePagemageUrl,
    bannerImage,
    formikRef.current?.dirty
  ]);

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
        editCategoryName ? editCategoryName : subcategoryInitialValues
      }
      validationSchema={subcategoryValidationSchema}
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
                  setMenuType('Sub Categories');
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
                        Sub Category Status:
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
            <CropModal
              visible={isCropModalVisible}
              imageSrc={imageSrc}
              crop={crop ?? { unit: '%', x: 0, y: 0, width: 100, height: 100 }}
              setCrop={setCrop}
              onCropComplete={onCropComplete}
              imgRef={imgRef}
              onImageLoad={onImageLoad}
              onOk={() =>
                handleCropModalOk((newImg, originalSrc) => {
                  updateImageStates(
                    [
                      setposterimageUrl,
                      setBannerImageUrl,
                      setWhatamIImageUrl,
                      sethomePagemageUrl,
                      setBannerImage
                    ],
                    newImg,
                    originalSrc
                  );
                })
              }
              onCancel={handleCropModalCancel}
            />
            <div className="grid grid-cols-2 gap-4 mt-4 mb-4 bg-white dark:bg-black dark:text-white dark:border-white py-10 px-4 rounded-md shadow">
              <div className="space-y-4">
                <div className="rounded-sm border  bg-white dark:bg-black">
                  <div className="border-b  py-4 px-2 dark:bg-black dark:text-white dark:border-white">
                    <h3 className="font-medium text-black dark:text-white">
                      Add Sub Category Images
                    </h3>
                  </div>
                  {posterimageUrl?.[0] && posterimageUrl.length > 0 ? (
                    <div className="p-4 dark:bg-black dark:text-white  dark:border-white">
                      {posterimageUrl.map(
                        (item: ProductImage, index: number) => {
                          return (
                            <div
                              className="relative group rounded-lg w-fit overflow-hidden shadow-md bg-white dark:bg-black transform transition-transform duration-300 hover:scale-105"
                              key={index}
                            >
                              <div className="absolute top-1 right-1 invisible group-hover:visible text-red  rounded-full ">
                                <RxCross2
                                  className="cursor-pointer border rounded text-red-500 dark:text-red-700"
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
                                className="w-full h-full dark:bg-black dark:shadow-lg cursor-crosshair"
                                width={200}
                                height={500}
                                loading="lazy"
                                src={item?.imageUrl || ''}
                                alt={`productImage-${index}`}
                              />
                              <input
                                className="dashboard_input "
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

                <div className="rounded-sm border bg-white dark:bg-black">
                  <div className="border-b py-4 px-2 dark:text-white dark:bg-black dark:border-white">
                    <h3 className="font-medium text-black dark:text-white">
                      Add Banner Image (What Am I )
                    </h3>
                  </div>
                  {BannerImageUrl?.[0] && BannerImageUrl?.length > 0 ? (
                    <div className=" p-4 dark:text-white dark:bg-black dark:border-white">
                      {BannerImageUrl.map(
                        (item: ProductImage, index: number) => {
                          return (
                            <div
                              className="relative group rounded-lg w-fit  overflow-hidden shadow-md bg-white transform transition-transform duration-300 hover:scale-105"
                              key={index}
                            >
                              <div className="absolute top-1 right-1 invisible group-hover:visible text-red bg-white rounded-full ">
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

                <div className="rounded-sm border  bg-white  dark:bg-black">
                  <div className="border-b  py-4 px-2  dark:text-white dark:bg-black dark:border-white">
                    <h3 className="font-medium text-black dark:text-white">
                      what Am I Image
                    </h3>
                    <ImageUploader setImagesUrl={setWhatamIImageUrl} />
                  </div>
                  {WhatamIImageUrl && WhatamIImageUrl?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 h-auto relative">
                      {WhatamIImageUrl.map(
                        (item: ProductImage, index: number) => {
                          return (
                            <div
                              className="relative group rounded-lg shadow-md bg-white transform transition-transform duration-300 hover:scale-105"
                              key={index}
                            >
                              <div className="absolute top-1 right-1 invisible group-hover:visible text-red bg-white rounded-full ">
                                <RxCross2
                                  className="cursor-pointer border rounded text-red-500 dark:text-red-700"
                                  size={17}
                                  onClick={async () => {
                                    const confirmed =
                                      await confirmDeleteImage();
                                    if (confirmed) {
                                      ImageRemoveHandler(
                                        item.public_id,
                                        setWhatamIImageUrl,
                                        finalToken
                                      );
                                    }
                                  }}
                                />
                              </div>
                              <Image
                                onClick={() => handleCropClick(item.imageUrl)}
                                key={index}
                                className="w-full h-[180px] lg:h-[110px] dark:bg-black dark:shadow-lg cursor-crosshair"
                                width={200}
                                height={500}
                                loading="lazy"
                                src={item?.imageUrl || ''}
                                alt={`productImage-${index}`}
                              />
                              <input
                                className="dashboard_input  "
                                placeholder="Alt Text"
                                type="text"
                                name="altText"
                                value={item?.altText || ''}
                                onChange={(e) =>
                                  handleImageAltText(
                                    index,
                                    String(e.target.value),
                                    setWhatamIImageUrl,
                                    'altText'
                                  )
                                }
                              />
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="rounded-sm border  bg-white   dark:bg-black mt-5">
                  <div className="border-b  py-4 px-2 dark:text-white dark:bg-black dark:border-white">
                    <h3 className="font-medium text-black dark:text-white">
                      Banner Image
                    </h3>
                  </div>
                  {bannerImage?.[0] && bannerImage?.length > 0 ? (
                    <div className=" p-4 dark:text-white dark:bg-black dark:border-white">
                      {bannerImage.map((item: ProductImage, index: number) => {
                        return (
                          <div
                            className="relative group rounded-lg w-fit  overflow-hidden shadow-md bg-white transform transition-transform duration-300 hover:scale-105"
                            key={index}
                          >
                            <div className="absolute top-1 right-1 invisible group-hover:visible text-red bg-white rounded-full ">
                              <RxCross2
                                className="cursor-pointer border rounded text-red-500 dark:text-red-700"
                                size={17}
                                onClick={async () => {
                                  const confirmed = await confirmDeleteImage();
                                  if (confirmed) {
                                    ImageRemoveHandler(
                                      item.public_id,
                                      setBannerImage,
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
                              className="dashboard_input "
                              placeholder="Alt Text"
                              type="text"
                              name="altText"
                              value={item?.altText || ''}
                              onChange={(e) =>
                                handleImageAltText(
                                  index,
                                  String(e.target.value),
                                  setBannerImage,
                                  'altText'
                                )
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <ImageUploader setposterimageUrl={setBannerImage} />
                  )}
                </div>

                <div className="rounded-sm border  bg-white   dark:bg-black">
                  <div className="border-b  py-4 px-2  dark:text-white dark:bg-black dark:border-white">
                    <h3 className="font-medium text-black dark:text-white">
                      What am I (home Page)
                    </h3>
                  </div>
                  {homePagemageUrl?.[0] && homePagemageUrl?.length > 0 ? (
                    <div className=" p-4 dark:text-white dark:bg-black dark:border-white">
                      {homePagemageUrl.map(
                        (item: ProductImage, index: number) => {
                          return (
                            <div
                              className="relative group rounded-lg w-fit  overflow-hidden shadow-md bg-white transform transition-transform duration-300 hover:scale-105"
                              key={index}
                            >
                              <div className="absolute top-1 right-1 invisible group-hover:visible text-red bg-white rounded-full ">
                                <RxCross2
                                  className="cursor-pointer border rounded text-red-500 dark:text-red-700"
                                  size={17}
                                  onClick={async () => {
                                    const confirmed =
                                      await confirmDeleteImage();
                                    if (confirmed) {
                                      ImageRemoveHandler(
                                        item.public_id,
                                        sethomePagemageUrl,
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
                                className="dashboard_input "
                                placeholder="Alt Text"
                                type="text"
                                name="altText"
                                value={item?.altText || ''}
                                onChange={(e) =>
                                  handleImageAltText(
                                    index,
                                    String(e.target.value),
                                    sethomePagemageUrl,
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
                    <ImageUploader setposterimageUrl={sethomePagemageUrl} />
                  )}
                </div>
                <Input
                  label="What Am I heading"
                  name="whatAmiTopHeading"
                  placeholder="What Am I heading"
                />
                <Input label="Name" name="name" placeholder="name" />
                <Input
                  label="Custom Url"
                  name="custom_url"
                  placeholder="custom_url"
                />

                <div className="rounded-sm border  bg-white  dark:bg-black">
                  <div className="border-b  py-4 px-6 ">
                    <h3 className="font-medium text-black dark:text-white">
                      What AM I Details
                    </h3>
                  </div>
                  <div className="flex flex-col py-4 px-6">
                    <FieldArray name="whatamIdetails">
                      {({ push, remove }) => (
                        <div className="flex flex-col gap-2">
                          {formik.values.whatamIdetails &&
                            formik.values.whatamIdetails.map(
                              (model: AdditionalInformation, index: number) => (
                                <div
                                  key={index}
                                  className="w-full flex flex-col gap-4"
                                >
                                  <Input
                                    name={`whatamIdetails[${index}].name`}
                                    placeholder="Model Name"
                                  />
                                  <div className="flex w-full gap-2">
                                    <Input
                                      name={`whatamIdetails[${index}].detail`}
                                      placeholder="Model Detail"
                                      textarea
                                    />

                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="ml-2 text-red-500 "
                                    >
                                      <RxCross2
                                        className="text-red-500 dark:text-white"
                                        size={40}
                                      />
                                    </button>
                                  </div>
                                </div>
                              )
                            )}
                          <button
                            type="button"
                            onClick={() => push({ name: '', detail: '' })}
                            className="px-4 py-2 bg-black text-white dark:bg-primary dark:border-0  rounded-md shadow-md w-fit"
                          >
                            Add Model
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                </div>
                <div className="rounded-sm border  bg-white  dark:bg-black mt-2">
                  <div className="border-b  py-4 px-6 ">
                    <h3 className="font-medium text-black dark:text-white">
                      Add Sizes
                    </h3>
                  </div>
                  <div className="py-4 px-6 space-y-2">
                    <Input
                      label="Width"
                      name="sizes[0].width"
                      placeholder="Width"
                    />
                    <Input
                      label="Height"
                      name="sizes[0].height"
                      placeholder="Height"
                    />
                    <Input
                      label="Thickness"
                      name="sizes[0].thickness"
                      placeholder="Thickness"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-col">
                  <div>
                    <label className="mb-3 block py-4 px-2 text-sm font-medium text-black dark:text-white">
                      Category Description
                    </label>
                    <TinyMCEEditor name="description" />
                    {formik.touched.description &&
                      formik.errors.description && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.description}
                        </div>
                      )}
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
                    textarea
                  />

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Input
                      label="What Am i Meta Title"
                      name="whatAmiMeta_Title"
                      placeholder="What Am i Meta Title"
                    />
                    <Input
                      label="What Am i Canonical Tag"
                      name="whatAmiCanonical_Tag"
                      placeholder="What Am i Canonical Tag"
                    />
                  </div>
                  <Input
                    label="What Am i Meta Description"
                    name="whatAmiMeta_Description"
                    placeholder="What Am i Meta Description"
                    textarea
                  />
                  <Input
                    label="Short Description"
                    name="short_description"
                    placeholder="Short Description"
                  />
                </div>
                <div>
                  <label className="mb-3 block py-4 px-2 text-sm font-medium text-black dark:text-white">
                    Select Parent Category (atleat one)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      as="select"
                      name="category"
                      className="dashboard_input"
                    >
                      <option value="" disabled>
                        Select Category
                      </option>

                      {categoriesList.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-red-500 "
                  />
                </div>

                <div>
                  <label className="mb-3 mt-3 block text-sm font-medium text-black dark:text-white">
                    Add Re Category
                  </label>
                  <FieldArray name="recalledByCategories">
                    {({ push, remove }) => (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {categoriesList?.map((cat: Category) => {
                          const isChecked =
                            formik.values.recalledByCategories?.includes(
                              cat.id.toString()
                            );
                          return (
                            <label
                              key={cat.id}
                              className="flex items-center space-x-2"
                            >
                              <Field
                                type="checkbox"
                                name="recalledByCategories"
                                value={cat.id.toString()}
                                checked={isChecked}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  if (e.target.checked) {
                                    push(cat.id.toString());
                                  } else {
                                    remove(
                                      formik?.values?.recalledByCategories?.indexOf(
                                        cat.id.toString()
                                      )
                                    );
                                  }
                                }}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                              />
                              <span className="text-black dark:text-white">
                                {cat.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>
            </div>
            <Field name="status">
              {({ field, form }: import('formik').FieldProps) => (
                <div className="flex gap-4 items-center my-4">
                  <label className="font-semibold text-black dark:text-white">
                    Sub Category Status:
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
