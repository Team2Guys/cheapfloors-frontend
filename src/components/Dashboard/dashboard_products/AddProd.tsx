'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Formik,
  FieldArray,
  Form,
  FormikHelpers,
  Field,
  ErrorMessage,
  FieldInputProps,
  FormikProps
} from 'formik';
import { RxCross2 } from 'react-icons/rx';
import Image from 'next/image';
import {
  confirmDeleteImage,
  confirmLeaveWithUnsavedChanges,
  ImageRemoveHandler,
  updateImageStates
} from 'utils/helperFunctions';
import { IoMdArrowRoundBack } from 'react-icons/io';
import Loader from 'components/Loader/Loader';
import {
  AddproductsinitialValues,
  AddProductvalidationSchema,
  excludedKeys,
  IProductValues
} from 'data/data';
import revalidateTag from 'components/ServerActons/ServerAction';
import { AdditionalInformation, ProductImage } from 'types/prod';
import ImageUploader from 'components/ImageUploader/ImageUploader';
import { DASHBOARD_ADD_SUBCATEGORIES_PROPS_PRODUCTFORMPROPS } from 'types/PagesProps';
import { useMutation } from '@apollo/client';
import {
  CREATE_ACCESSORIES,
  CREATE_PRODUCT,
  UPDATE_PRODUCT
} from 'graphql/mutations';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import CropModal from 'components/common/CropModal';
import useImageCropper from 'hooks/useImageCropper';
import Input from 'components/ui/Input';
import { showAlert } from 'utils/Alert';
import { UPDATE_ACCESSORY_MUTATION } from 'graphql/accessorie';

const initialErrors = {
  categoryError: '',
  subCategoryError: '',
  posterImageError: '',
  prodImages: ''
};

const AddProd: React.FC<DASHBOARD_ADD_SUBCATEGORIES_PROPS_PRODUCTFORMPROPS> = ({
  EditInitialValues,
  EditProductValue,
  setselecteMenu,
  setEditProduct,
  categoriesList,
  products,
  accessoryFlag
}) => {
  const [imagesUrl, setImagesUrl] = useState<ProductImage[] | undefined>(
    EditInitialValues ? EditInitialValues?.productImages : []
  );
  const [posterimageUrl, setposterimageUrl] = useState<
    ProductImage[] | undefined
  >(EditInitialValues ? [EditInitialValues?.posterImageUrl] : []);
  const [hoverImage, sethoverImage] = useState<ProductImage[] | undefined>(
    EditInitialValues?.hoverImageUrl
      ? [{ ...EditInitialValues.hoverImageUrl }]
      : []
  );
  const router = useRouter();
  const [featureImagesimagesUrl, setfeatureImagesImagesUrl] = useState<
    ProductImage[] | undefined
  >(EditInitialValues ? EditInitialValues?.featureImages : []);
  const [loading, setloading] = useState<boolean>(false);
  const [productInitialValue, setProductInitialValue] = useState<
    IProductValues | null | undefined
  >(EditProductValue);
  const [imgError, setError] = useState<string | null | undefined>();
  const [selectedCategory, setSelectedCategory] = useState(
    EditProductValue ? EditProductValue.category : ''
  );
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    EditProductValue ? EditProductValue?.subcategory : ''
  );
  const [categorySubCatError, setcategorySubCatError] = useState(initialErrors);
  const dragImage = useRef<number | null>(null);
  const dragFeatureImage = useRef<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const draggedOverImage = useRef<number | null>(null);
  const draggedOverfeatureImage = useRef<number | null>(null);
  const token = Cookies.get('2guysAdminToken');
  const superAdminToken = Cookies.get('superAdminToken');
  const finalToken = token ? token : superAdminToken;
  const formikRef = useRef<FormikProps<IProductValues>>(null);
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
    changedValue: IProductValues,
    { resetForm }: FormikHelpers<IProductValues>
  ) => {
    try {
      const values = removedValuesHandler(changedValue);
      setcategorySubCatError(initialErrors);
      if (!selectedCategory) {
        setcategorySubCatError((prev) => ({
          ...prev,
          categoryError: 'Category is Required'
        }));
        return;
      }

      if (subcategories.length > 0 && !selectedSubcategory && !accessoryFlag) {
        setcategorySubCatError((prev) => ({
          ...prev,
          subCategoryError: 'Subcategory is Required'
        }));
        return;
      }

      const posterImageUrl = posterimageUrl && posterimageUrl[0];
      const hoverImageUrl = hoverImage && hoverImage[0];

      if (!posterImageUrl) {
        setcategorySubCatError((prev) => ({
          ...prev,
          posterImageError: 'Poster Image is Required'
        }));
        return;
      }

      if (!imagesUrl || !(imagesUrl.length > 0)) {
        setcategorySubCatError((prev) => ({
          ...prev,
          prodImages: 'Please upload at least 1 product-relevant image'
        }));
        return;
      }

      const images = {
        subcategory: +selectedSubcategory
      };

      /* eslint-disable */
      const { products, lengthPrice, ...restValues } = values;
      let newValues = {
        ...(accessoryFlag ? values : restValues),
        posterImageUrl,
        hoverImageUrl,
        productImages: imagesUrl,
        category: +selectedCategory,
        featureImages: featureImagesimagesUrl,
        colorCode: values.colorCode === '' ? undefined : Number(values.colorCode),
        stock: Number(values.stock),
        price: Number(values.price),
        discountPrice: Number(values.discountPrice),
        colors: !values.colors ? [] : values.colors
      };

      if (!accessoryFlag) {
        Object.assign(newValues, images);
      }
      setloading(true);
      const updateFlag = EditProductValue && EditInitialValues ? true : false;
      if (updateFlag && EditInitialValues?.id) {
        newValues = { id: +EditInitialValues?.id, ...newValues };
      }
      const { data } = updateFlag
        ? await updateProduct({ variables: { input: newValues } })
        : await createProduct({ variables: { input: newValues } });
      if (!data) {
        throw new Error('Mutation failed. No data returned.');
      }
      if (!data) {
        throw new Error('Mutation failed. No data returned.');
      }
      revalidateTag('products');
      showAlert({
        title: updateFlag
          ? 'Product has been successfully updated!'
          : 'Product has been successfully added!',
        icon: 'success'
      });

      resetForm();
      setloading(false);
      sethoverImage(undefined);
      setposterimageUrl(undefined);
      setImagesUrl([]);
      setfeatureImagesImagesUrl([]);
      setselecteMenu('Add All Products');
      if (updateFlag) {
        setEditProduct?.(undefined);
      }
      /* eslint-disable */
    } catch (err: any) {
      if (err?.graphQLErrors?.length > 0) {
        if (err?.graphQLErrors[0].message === 'Authentication required') {
          router.push('/dashboard/Admin-login');
        }
        setError(err?.graphQLErrors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (
      posterimageUrl?.length ||
      featureImagesimagesUrl?.length ||
      imagesUrl?.length ||
      hoverImage?.length ||
      formikRef.current?.dirty
    ) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [
    posterimageUrl,
    featureImagesimagesUrl,
    imagesUrl,
    hoverImage,
    formikRef.current?.dirty
  ]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (formikRef.current?.dirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const [updateProduct] = useMutation(
    accessoryFlag ? UPDATE_ACCESSORY_MUTATION : UPDATE_PRODUCT,
    {
      context: {
        fetchOptions: {
          credentials: 'include'
        }
      }
    }
  );

  const [createProduct] = useMutation(
    accessoryFlag ? CREATE_ACCESSORIES : CREATE_PRODUCT,
    {
      context: {
        fetchOptions: {
          credentials: 'include'
        }
      }
    }
  );
  function handleSort() {
    if (dragImage.current === null || draggedOverImage.current === null) return;
    const imagesClone = imagesUrl && imagesUrl.length > 0 ? [...imagesUrl] : [];
    const temp = imagesClone[dragImage.current];
    imagesClone[dragImage.current] = imagesClone[draggedOverImage.current];
    imagesClone[draggedOverImage.current] = temp;

    setImagesUrl(imagesClone);
  }

  function handleFeatreSort() {
    if (
      dragFeatureImage.current === null ||
      draggedOverfeatureImage.current === null
    )
      return;
    const imagesClone =
      featureImagesimagesUrl && featureImagesimagesUrl.length > 0
        ? [...featureImagesimagesUrl]
        : [];
    const temp = imagesClone[dragFeatureImage.current];
    imagesClone[dragFeatureImage.current] =
      imagesClone[draggedOverfeatureImage.current];
    imagesClone[draggedOverfeatureImage.current] = temp;

    setfeatureImagesImagesUrl(imagesClone);
  }
  useEffect(() => {
    const CategoryHandler = async () => {
      try {
        if (!EditInitialValues) return;
        const selectedCat = categoriesList?.find(
          (cat) => cat.id === selectedCategory
        );
        setSubcategories(selectedCat?.subcategories || []);
        setImagesUrl(EditInitialValues ? EditProductValue?.productImages : []);
        sethoverImage(
          EditInitialValues?.hoverImageUrl
            ? [{ ...EditInitialValues.hoverImageUrl }]
            : []
        );
        setProductInitialValue?.(() => EditProductValue);
        setfeatureImagesImagesUrl(
          EditInitialValues ? EditProductValue?.featureImages : []
        );
      } catch (err) {
        throw err;
      }
    };
    CategoryHandler();
  }, [EditInitialValues]);

  const handleImageAltText = (
    index: number,
    newImageIndex: string,
    setImagesUrlhandler: React.Dispatch<
      React.SetStateAction<ProductImage[] | undefined>
    >,
    variantType: string
  ) => {
    setImagesUrlhandler((prev: ProductImage[] | undefined) => {
      if (!prev) return [];
      const updatedImagesUrl = prev?.map((item: ProductImage, i: number) =>
        i === index ? { ...item, [variantType]: newImageIndex } : item
      );
      return updatedImagesUrl;
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    const selectedCat = categoriesList?.find((cat) => cat.id === categoryId);
    setSubcategories(selectedCat?.subcategories || []);
    setSelectedSubcategory('');
    console.log(selectedCat,'selectedCat')
  };
  const removedValuesHandler = (ChangedValue: IProductValues) => {
    const modifiedProductValues = Object.fromEntries(
      Object.entries(ChangedValue).filter(
        ([key]) => !excludedKeys.includes(key)
      )
    ) as IProductValues;
    return accessoryFlag ? { ...modifiedProductValues } : ChangedValue;
  };

  return (
    <Formik
      innerRef={formikRef}
      enableReinitialize
      initialValues={
        productInitialValue ? productInitialValue : AddproductsinitialValues
      }
      validationSchema={AddProductvalidationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Form onSubmit={formik.handleSubmit}>
            <div className="flex_between flex-wrap mb-5 gap-2 ">
              <p
                className="dashboard_primary_button"
                onClick={async () => {
                  if (hasUnsavedChanges || formikRef.current?.dirty) {
                    const shouldLeave = await confirmLeaveWithUnsavedChanges();
                    if (!shouldLeave) return;
                  }
                  setselecteMenu('Add All Products');
                  setEditProduct?.(() => undefined);
                }}
              >
                <IoMdArrowRoundBack /> Back
              </p>
              <div className="flex justify-center gap-4">
                <Field name="status">
                  {({ field, form }: import('formik').FieldProps) => (
                    <div className="flex gap-4 items-center border-r-2 px-2">
                      {['DRAFT', 'PUBLISHED'].map((status) => {
                        const isActive = field.value === status;
                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() => form.setFieldValue('status', status)}
                            disabled={isActive}
                            className={`px-4 py-2 rounded-md text-sm
                                  ${
                                    isActive
                                      ? ' border text-opacity-1 cursor-not-allowed bg-white dark:bg-black dark:text-white'
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
                  className="dashboard_primary_button cursor-pointer"
                  disabled={loading}
                >
                  {loading ? 'loading..' : 'Submit'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 bg-white dark:bg-black py-10 px-4 rounded-md shadow">
              <div className="flex flex-col gap-9 ">
                <div className="rounded-sm border  bg-white dark:bg-black py-4 px-6">
                  <div className="rounded-sm border  bg-white dark:bg-black">
                    <div className="border-b  py-4 px-4 ">
                      <h3 className="font-medium text-black dark:text-white">
                        Add Poster Image
                      </h3>
                    </div>

                    {posterimageUrl && posterimageUrl?.length > 0 ? (
                      <div className="">
                        {posterimageUrl.map((item: ProductImage, index) => {
                          return (
                            <div key={index}>
                              <div className="relative group rounded-lg overflow-hidden shadow-md bg-white dark:bg-black transform transition-transform duration-300 hover:scale-105 w-fit">
                                <div className="absolute top-1 right-1 invisible group-hover:visible text-red bg-white dark:bg-black rounded-full">
                                  <RxCross2
                                    className="cursor-pointer border border-black  text-red-500 dark:text-red-700"
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
                                  className="object-cover cursor-crosshair w-44 h-44"
                                  width={300}
                                  height={400}
                                  loading="lazy"
                                  src={item?.imageUrl || ''}
                                  alt={`productImage-${index}`}
                                />
                              </div>

                              <input
                                className="dashboard_input "
                                placeholder="altText"
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
                        })}
                      </div>
                    ) : (
                      <ImageUploader setposterimageUrl={setposterimageUrl} />
                    )}
                  </div>
                  {categorySubCatError.posterImageError ? (
                    <p className="text-red-500">
                      {categorySubCatError.posterImageError}
                    </p>
                  ) : null}

                  <div className="flex flex-col mt-4 gap-4">
                    <Input
                      label="Product Title"
                      name="name"
                      placeholder="Product Title"
                    />
                    <Input
                      label="Custom Url"
                      name="custom_url"
                      placeholder="Custom Url"
                    />
                    <Input
                      label="Description"
                      name="description"
                      placeholder="Description"
                      textarea
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Price"
                        name="price"
                        type="number"
                        placeholder="Price"
                      />
                      <Input
                        label="Discount Price"
                        type="number"
                        name="discountPrice"
                        placeholder="Discount Price"
                      />
                      <Input
                        label={`${!accessoryFlag ? 'Stock (Boxes)' : 'Stock (Pieces)'}`}
                        name="stock"
                        type="number"
                        placeholder="Stock"
                      />
                      {!accessoryFlag && (
                        <div>
                          <label className="block mb-3 text-sm font-medium text-black dark:text-white">
                            Stock (SQM)
                          </label>
                          <div className="dashboard_input pointer-events-none bg-gray-100 focus:border-[#e5e7eb] active:border-[#e5e7eb]">
                            {Number(
                              (
                                formik.values?.stock *
                                Number(formik.values?.boxCoverage || 0)
                              ).toFixed(2)
                            )}
                          </div>
                        </div>
                      )}
                      <Input
                        label="Sku"
                        name="sku"
                        type="string"
                        placeholder="SKU"
                        className={`${!accessoryFlag ? 'col-span-2' : 'col-span-1'}`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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

                    <div className="flex gap-4 flex-col">
                      <div className="w-full">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Select Categories & Sub Categories
                        </label>

                        <select
                          name="category"
                          value={selectedCategory ? selectedCategory : ''}
                          onChange={handleCategoryChange}
                          className="dashboard_input"
                        >
                          <option value="" disabled>
                            Select Category
                          </option>
                          {categoriesList?.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>

                        {categorySubCatError.categoryError ? (
                          <p className="text-red-500">
                            {categorySubCatError.categoryError}
                          </p>
                        ) : null}

                        {!accessoryFlag && subcategories.length > 0 && (
                          <div className="mt-4">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                              Subcategories
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <select
                                name="subcategory"
                                value={selectedSubcategory}
                                onChange={(e) =>
                                  setSelectedSubcategory(e.target.value)
                                }
                                className="dashboard_input"
                              >
                                <option value="" disabled>
                                  Select Subcategory
                                </option>
                                {subcategories.map(
                                  (subCat: { id: string; name: string }) => (
                                    <option key={subCat.id} value={subCat.id}>
                                      {subCat.name}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </div>
                        )}

                        {categorySubCatError.subCategoryError ? (
                          <p className="text-red-500">
                            {categorySubCatError.subCategoryError}
                          </p>
                        ) : null}
                      </div>

                      {accessoryFlag ? (
                        <>
                          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Add Products
                          </label>
                          <FieldArray name="products">
                            {({ push, remove }) => (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-scroll">
                                {products?.map((product) => {
                                  const isChecked =
                                    formik.values.products?.includes(
                                      product.id.toString()
                                    );
                                  return (
                                    <label
                                      key={product.id}
                                      className="flex items-center space-x-2"
                                    >
                                      <Field
                                        type="checkbox"
                                        name="products"
                                        value={product.id.toString()}
                                        checked={isChecked}
                                        onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                          if (e.target.checked) {
                                            push(product.id.toString());
                                          } else {
                                            remove(
                                              formik.values.products.indexOf(
                                                product.id.toString()
                                              )
                                            );
                                          }
                                        }}
                                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                      />
                                      <span className="text-black dark:text-white">
                                        {product.name}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </FieldArray>
                        </>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="rounded-sm border  bg-white  dark:bg-black mt-3">
                    <div className="border-b  py-4 px-6 ">
                      <h3 className="font-medium text-black dark:text-white">
                        FAQS Details
                      </h3>
                    </div>
                    <div className="flex flex-col py-4 px-6">
                      <FieldArray name="FAQS">
                        {({ push, remove }) => (
                          <div className="flex flex-col gap-2">
                            {formik.values.FAQS &&
                              formik.values.FAQS.map(
                                (
                                  model: AdditionalInformation,
                                  index: number
                                ) => (
                                  <div
                                    key={index}
                                    className="flex gap-2 items-center"
                                  >
                                    <Input
                                      name={`FAQS[${index}].name`}
                                      placeholder="Model Name"
                                    />
                                    <Input
                                      name={`FAQS[${index}].detail`}
                                      placeholder="Model Detail"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="ml-2 text-red-500 "
                                    >
                                      <RxCross2
                                        className="text-red-500 dark:text-white"
                                        size={25}
                                      />
                                    </button>
                                  </div>
                                )
                              )}
                            <button
                              type="button"
                              onClick={() => push({ name: '', detail: '' })}
                              className="px-4 py-2 bg-black text-white dark:bg-primary dark:border-0  rounded-md shadow-md w-fit"
                            >
                              FAQ Details
                            </button>
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  </div>

                  <div className="rounded-sm border  bg-white  dark:bg-black mt-3">
                    <div className="border-b  py-4 px-6 ">
                      <h3 className="font-medium text-black dark:text-white">
                        Additional information
                      </h3>
                    </div>
                    <div className="flex flex-col py-4 px-6">
                      <FieldArray name="AdditionalInformation">
                        {({ push, remove }) => (
                          <div className="flex flex-col gap-2">
                            {formik.values.AdditionalInformation &&
                              formik.values.AdditionalInformation.map(
                                (
                                  model: AdditionalInformation,
                                  index: number
                                ) => (
                                  <div
                                    key={index}
                                    className="flex gap-2 items-center"
                                  >
                                    <Input
                                      name={`AdditionalInformation[${index}].name`}
                                      placeholder="Additional Information Name"
                                    />
                                    <Input
                                      name={`AdditionalInformation[${index}].detail`}
                                      placeholder="Additional Information Name"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="ml-2 text-red-500 "
                                    >
                                      <RxCross2
                                        className="text-red-500 dark:text-white"
                                        size={25}
                                      />
                                    </button>
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
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="rounded-sm border  bg-white  dark:bg-black">
                  <div className="border-b  py-4 px-6 ">
                    <h3 className="font-medium text-black dark:text-white">
                      Add Dimentions
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
                <div className="mb-4 bg-white dark:bg-black text-black dark:text-white">
                  <label className="block text-sm font-medium mb-2 dark:text-white">
                    Waterproof
                  </label>
                  <div className="flex items-center gap-2">
                    <Field name="waterproof">
                      {({
                        field,
                        form
                      }: {
                        field: FieldInputProps<boolean>;
                        form: FormikProps<{ waterproof: boolean }>;
                      }) => (
                        <input
                          type="checkbox"
                          name={field.name}
                          checked={Boolean(field.value)}
                          onChange={() =>
                            form.setFieldValue(field.name, !field.value)
                          }
                          className="h-5 w-5 rounded  bg-transparent text-primary focus:ring-primary  "
                        />
                      )}
                    </Field>
                    <span className="text-black dark:text-white">
                      Is this waterproof?
                    </span>
                  </div>

                  <ErrorMessage
                    name="waterproof"
                    component="div"
                    className="text-red-500 dark:text-red-700 text-sm"
                  />
                </div>

                <div className="py-4 px-6 rounded-sm border ">
                  <div className="rounded-sm border  bg-white mb-4 dark:bg-black">
                    <div className="border-b  py-4 px-6 ">
                      <h3 className="font-medium text-black dark:text-white">
                        Add Colours
                      </h3>
                    </div>
                    <div className="flex flex-col py-4 px-6">
                      <FieldArray name="colors">
                        {({ push, remove }) => (
                          <div className="flex flex-col gap-2">
                            {formik.values.colors &&
                              formik.values.colors.map(
                                (
                                  model: AdditionalInformation,
                                  index: number
                                ) => (
                                  <div
                                    key={index}
                                    className="flex gap-2 items-center"
                                  >
                                    <Input
                                      name={`colors[${index}].name`}
                                      placeholder="color Name"
                                    />
                                    <Input
                                      name={`colors[${index}].detail`}
                                      placeholder="color Detail"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="ml-2 text-red-500 "
                                    >
                                      <RxCross2
                                        className="text-red-500 dark:text-white"
                                        size={25}
                                      />
                                    </button>
                                  </div>
                                )
                              )}
                            <button
                              type="button"
                              onClick={() => push({ name: '', detail: '' })}
                              className="px-4 py-2 bg-black text-white dark:bg-primary dark:border-0  rounded-md shadow-md w-fit"
                            >
                              Add color
                            </button>
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Add Color Code"
                      name="colorCode"
                      placeholder="Add Color Code"
                    />
                    <Input
                      label="Add Residential Warranty"
                      name="ResidentialWarranty"
                      placeholder="Add Residential Warranty"
                    />
                    <Input
                      label="Add Commercial Warranty"
                      name="CommmericallWarranty"
                      placeholder="Add Commercial Warranty"
                    />
                    <Input
                      label="Add Plank Width"
                      name="plankWidth"
                      placeholder="Add Plank Width"
                    />
                    <Input
                      label="Add Thickness"
                      name="thickness"
                      placeholder="Add Thickness"
                    />
                    <Input
                      label="SQM Per Carton"
                      name="boxCoverage"
                      placeholder="SQM Per Carton"
                    />
                    {accessoryFlag && (
                      <Input
                        label="length Per Meter Price"
                        type="number"
                        name="lengthPrice"
                        placeholder="length Per Meter Price"
                      />
                    )}
                  </div>
                </div>
                <div className="rounded-sm border  bg-white  dark:bg-black">
                  <div className="border-b  py-4 px-4 ">
                    <h3 className="font-medium text-black dark:text-white">
                      Add Hover Image
                    </h3>
                  </div>

                  {hoverImage && hoverImage.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                      {hoverImage.map((item: ProductImage, index) => {
                        return (
                          <div key={index}>
                            <div className="relative group rounded-lg overflow-hidden shadow-md bg-white transform transition-transform duration-300 hover:scale-105">
                              <div className="absolute top-1 right-1 invisible group-hover:visible text-red bg-white rounded-full">
                                <RxCross2
                                  className="cursor-pointer text-red-500 dark:text-red-700"
                                  size={17}
                                  onClick={async () => {
                                    const confirmed =
                                      await confirmDeleteImage();
                                    if (confirmed) {
                                      ImageRemoveHandler(
                                        item.public_id,
                                        sethoverImage,
                                        finalToken
                                      );
                                    }
                                  }}
                                />
                              </div>
                              <Image
                                onClick={() => handleCropClick(item.imageUrl)}
                                key={index}
                                className="object-cover w-full h-full md:h-32 dark:bg-black dark:shadow-lg cursor-crosshair"
                                width={100}
                                height={100}
                                loading="lazy"
                                src={item?.imageUrl ? item?.imageUrl : ''}
                                alt={`productImage-${index}`}
                              />
                            </div>
                            <input
                              className="dashboard_input"
                              placeholder="altText"
                              type="text"
                              name="altText"
                              value={item?.altText || ''}
                              onChange={(e) =>
                                handleImageAltText(
                                  index,
                                  String(e.target.value),
                                  sethoverImage,
                                  'altText'
                                )
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <ImageUploader sethoverImage={sethoverImage} />
                  )}
                </div>

                <div className="rounded-sm border  bg-white  dark:bg-black">
                  <div className="border-b  py-4 px-4 ">
                    <h3 className="font-medium text-black dark:text-white">
                      Add Product Images
                    </h3>
                  </div>

                  <ImageUploader setImagesUrl={setImagesUrl} />

                  {imagesUrl && imagesUrl.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 max-h-[400px] overflow-y-scroll">
                      {imagesUrl.map((item: ProductImage, index) => {
                        return (
                          <div
                            key={index}
                            draggable
                            onDragStart={() => (dragImage.current = index)}
                            onDragEnter={() =>
                              (draggedOverImage.current = index)
                            }
                            onDragEnd={handleSort}
                            onDragOver={(e) => e.preventDefault()}
                          >
                            <div className="relative group rounded-lg overflow-hidden shadow-md bg-white transform transition-transform duration-300 hover:scale-105">
                              <div
                                className="absolute top-1 right-1 invisible group-hover:visible text-red bg-white rounded-full"
                                draggable
                              >
                                <RxCross2
                                  className="cursor-pointer text-red-500 dark:text-red-700"
                                  size={17}
                                  onClick={async () => {
                                    const confirmed =
                                      await confirmDeleteImage();
                                    if (confirmed) {
                                      ImageRemoveHandler(
                                        item.public_id,
                                        setImagesUrl,
                                        finalToken
                                      );
                                    }
                                  }}
                                />
                              </div>
                              <Image
                                onClick={() => handleCropClick(item.imageUrl)}
                                key={index}
                                className="object-cover w-full h-full md:h-32 dark:bg-black dark:shadow-lg cursor-crosshair"
                                width={300}
                                height={200}
                                loading="lazy"
                                src={item?.imageUrl || ''}
                                alt={`productImage-${index}` || ''}
                              />
                            </div>

                            <input
                              className="dashboard_input"
                              placeholder="altText"
                              type="text"
                              name="altText"
                              value={item?.altText || ''}
                              onChange={(e) =>
                                handleImageAltText(
                                  index,
                                  String(e.target.value),
                                  setImagesUrl,
                                  'altText'
                                )
                              }
                            />
                            <input
                              className="dashboard_input"
                              placeholder="Plank Width"
                              type="text"
                              name="plankWidth"
                              value={item?.plankWidth || ''}
                              onChange={(e) =>
                                handleImageAltText(
                                  index,
                                  String(e.target.value),
                                  setImagesUrl,
                                  'plankWidth'
                                )
                              }
                            />
                            <input
                              className="dashboard_input"
                              placeholder="Plank Height"
                              type="text"
                              name="plankHeight"
                              value={item?.plankHeight || ''}
                              onChange={(e) =>
                                handleImageAltText(
                                  index,
                                  String(e.target.value),
                                  setImagesUrl,
                                  'plankHeight'
                                )
                              }
                            />
                            <input
                              className="dashboard_input"
                              placeholder="colorCode"
                              type="text"
                              name="colorCode"
                              value={item?.colorCode || ''}
                              onChange={(e) =>
                                handleImageAltText(
                                  index,
                                  String(e.target.value),
                                  setImagesUrl,
                                  'colorCode'
                                )
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
                {categorySubCatError.prodImages ? (
                  <p className="text-red-500">
                    {categorySubCatError.prodImages}
                  </p>
                ) : null}

                <div className="rounded-sm border  bg-white  dark:bg-black">
                  <div className="border-b  py-4 px-4 ">
                    <h3 className="font-medium text-black dark:text-white">
                      Add Feature Images
                    </h3>
                  </div>
                  <ImageUploader setImagesUrl={setfeatureImagesImagesUrl} />

                  {featureImagesimagesUrl &&
                  featureImagesimagesUrl.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 max-h-[400px] overflow-y-scroll">
                      {featureImagesimagesUrl.map(
                        (item: ProductImage, index) => {
                          return (
                            <div
                              key={index}
                              draggable
                              onDragStart={() =>
                                (dragFeatureImage.current = index)
                              }
                              onDragEnter={() =>
                                (draggedOverfeatureImage.current = index)
                              }
                              onDragEnd={handleFeatreSort}
                              onDragOver={(e) => e.preventDefault()}
                            >
                              <div className="relative group rounded-lg overflow-hidden shadow-md bg-white transform transition-transform duration-300 hover:scale-105">
                                <div
                                  className="absolute top-1 right-1 invisible group-hover:visible text-red bg-white rounded-full"
                                  draggable
                                >
                                  <RxCross2
                                    className="cursor-pointer text-red-500 dark:text-red-700"
                                    size={17}
                                    onClick={async () => {
                                      const confirmed =
                                        await confirmDeleteImage();
                                      if (confirmed) {
                                        ImageRemoveHandler(
                                          item.public_id,
                                          setfeatureImagesImagesUrl,
                                          finalToken
                                        );
                                      }
                                    }}
                                  />
                                </div>
                                <Image
                                  onClick={() => handleCropClick(item.imageUrl)}
                                  key={index}
                                  className="object-cover w-full h-full md:h-32 dark:bg-black dark:shadow-lg cursor-crosshair"
                                  width={300}
                                  height={200}
                                  loading="lazy"
                                  src={item?.imageUrl || ''}
                                  alt={`productImage-${index}` || ''}
                                />
                              </div>

                              <input
                                className="dashboard_input"
                                placeholder="altText"
                                type="text"
                                name="altText"
                                value={item?.altText || ''}
                                onChange={(e) =>
                                  handleImageAltText(
                                    index,
                                    String(e.target.value),
                                    setfeatureImagesImagesUrl,
                                    'altText'
                                  )
                                }
                              />

                              {accessoryFlag && (
                                <>
                                  <input
                                    className="dashboard_input"
                                    placeholder="color"
                                    type="text"
                                    name="color"
                                    value={item?.color || ''}
                                    onChange={(e) =>
                                      handleImageAltText(
                                        index,
                                        String(e.target.value),
                                        setfeatureImagesImagesUrl,
                                        'color'
                                      )
                                    }
                                  />
                                  <input
                                    className="dashboard_input"
                                    placeholder="colorName"
                                    type="text"
                                    name="colorName"
                                    value={item?.colorName}
                                    onChange={(e) =>
                                      handleImageAltText(
                                        index,
                                        String(e.target.value),
                                        setfeatureImagesImagesUrl,
                                        'colorName'
                                      )
                                    }
                                  />
                                </>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {imgError ? (
              <div className="flex justify-center">
                <div className="text-red-500 pt-2 pb-2">{imgError}</div>
              </div>
            ) : null}
            <Field name="status">
              {({ field, form }: import('formik').FieldProps) => (
                <div className="flex gap-4 items-center mt-5">
                  <label className="font-semibold text-black dark:text-white">
                    {' '}
                    {accessoryFlag ? 'Accessory' : 'Product'} Status:
                  </label>
                  {['DRAFT', 'PUBLISHED'].map((status) => {
                    const isActive = field.value === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => form.setFieldValue('status', status)}
                        disabled={isActive}
                        className={`px-4 py-2 rounded-md text-sm
                                  ${
                                    isActive
                                      ? ' border text-opacity-1 cursor-not-allowed'
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
              className="dashboard_primary_button mt-2 mx-auto"
              disabled={loading}
            >
              {loading ? <Loader color="white" /> : 'Submit'}
            </button>
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
                      sethoverImage,
                      setImagesUrl,
                      setfeatureImagesImagesUrl
                    ],
                    newImg,
                    originalSrc
                  );
                })
              }
              onCancel={handleCropModalCancel}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddProd;
