import {
  fetchAccessories,
  fetchCategories,
  fetchSingeSubCategory,
  getMetaTitleData
} from 'config/fetch';
import { Category as ICategory } from 'types/cat';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { staticMenuItems } from 'data/data';
import Category from '../Cetagory';
import AccessoriesDetail from 'app/(route)/[slug]/[subcategory]/AccessoriesDetail';
import { IProduct } from 'types/prod';

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string; subcategory: string }>;
}): Promise<Metadata> {
  const { slug, subcategory } = await params;
  let subCategory;
  if (slug === 'accessories') {
    subCategory = await getMetaTitleData(subcategory.trim(), slug);
  } else {
    subCategory = await fetchSingeSubCategory(subcategory.trim(), slug);
  }
  if (!subCategory) return notFound();
  const headersList = await headers();
  const domain =
    headersList.get('x-forwarded-host') || headersList.get('host') || '';
  const protoHeader = headersList.get('x-forwarded-proto');
  const protocol =
    protoHeader && protoHeader.startsWith('https') ? 'https' : 'https';
  const pathname = headersList.get('x-invoke-path') || '/';

  const fullUrl = `${protocol}://${domain}${pathname}`;
  const ImageUrl = subCategory?.posterImageUrl.imageUrl || 'Cheap Floors';
  const alt = subCategory?.posterImageUrl.altText || 'Cheap Floors';

  const NewImage = [
    {
      url: ImageUrl,
      alt: alt
    }
  ];
  const title = subCategory?.Meta_Title || 'Cheap Floors';
  const description = subCategory?.Meta_Description || 'Welcome to Cheap Floors';
  const url = `${fullUrl}${slug}/${subcategory}`;
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: url,
      images: NewImage,
      type: 'website'
    },
    alternates: {
      canonical: subCategory?.Canonical_Tag || url
    }
  };
}

const SubCategoryPage = async ({
  params
}: {
  params: Promise<{ slug: string; subcategory: string }>;
}) => {
  const { slug, subcategory } = await params;
  if (slug === 'accessories') {
    const ProductInfo = await fetchAccessories();
    const PublishAccessory = ProductInfo.filter(
      (acc: IProduct) =>
        acc.status === 'PUBLISHED' && acc.category?.status === 'PUBLISHED'
    );
    const productData = PublishAccessory.find(
      (product: IProduct) =>
        product?.custom_url?.trim() == subcategory?.trim() &&
        product?.category?.custom_url?.trim() === 'accessories'
    );
    if (!productData) return notFound();
    return (
      <AccessoriesDetail
        ProductName={subcategory}
        ProductInfo={PublishAccessory}
        productData={productData}
      />
    );
  } else {
    const categories = await fetchCategories();
    const findCategory = categories.find(
      (cat: ICategory) =>
        cat?.RecallUrl === slug.trim() && cat.status === 'PUBLISHED'
    );
    if (!findCategory) {
      return notFound();
    }

    const filteredCategories =
      categories
        .filter((value: ICategory) => value?.name?.trim() !== 'ACCESSORIES')
        .sort((a: ICategory, b: ICategory) => {
          const indexA = staticMenuItems.findIndex(
            (item) => item.label.toLowerCase() === a.name.trim().toLowerCase()
          );
          const indexB = staticMenuItems.findIndex(
            (item) => item.label.toLowerCase() === b.name.trim().toLowerCase()
          );
          return (
            (indexA === -1 ? Infinity : indexA) -
            (indexB === -1 ? Infinity : indexB)
          );
        }) || [];

    const getMatchingSubCategory = (
      subcategories: ICategory[],
      subCategoryUrl: string
    ) => {
      return (
        subcategories.filter(
          (sub) =>
            sub.custom_url === subCategoryUrl && sub.status === 'PUBLISHED'
        ) || []
      );
    };
    const matchingSubCategory = getMatchingSubCategory(
      findCategory.subcategories,
      subcategory
    );

    if (matchingSubCategory.length === 0) return notFound();
    return (
      <Category
        catgories={filteredCategories}
        categoryData={findCategory}
        slug={slug}
        subcategory={subcategory}
        subdescription={matchingSubCategory}
        isSubCategory
      />
    );
  }
};
export default SubCategoryPage;
