import { fetchCategories, fetchSingleCategory } from 'config/fetch';
import { Category as ICategory, ISUBCATEGORY } from 'types/cat';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { IProduct } from 'types/prod';
import { staticMenuItems } from 'data/data';
import Category from './Cetagory';
import { defaultOrder } from 'data/accessory';
import { FIND_ONE_Accessory } from 'graphql/queries';
import Breadcrumb from 'components/Reusable/breadcrumb';
import AccessoriesComp from 'components/Accessories/Accessories';
import CategoryFaqs from '@/components/Faqs/CategoryFaqs';

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const Category = await fetchSingleCategory(slug);
  if (!Category) return notFound();
  const headersList = await headers();
  const domain =
    headersList.get('x-forwarded-host') || headersList.get('host') || '';
  const protoHeader = headersList.get('x-forwarded-proto');
  const protocol =
    protoHeader && protoHeader.startsWith('https') ? 'https' : 'https';
  const pathname = headersList.get('x-invoke-path') || '/';

  const fullUrl = `${protocol}://${domain}${pathname}`;

  const ImageUrl = Category?.posterImageUrl.imageUrl || 'Easy Floor';
  const alt = Category?.posterImageUrl.altText || 'Easy Floor';

  const NewImage = [
    {
      url: ImageUrl,
      alt: alt
    }
  ];
  const title = Category?.Meta_Title || 'Easy Floor';
  const description = Category?.Meta_Description || 'Welcome to Easy Floor';
  const url = `${fullUrl}${slug}`;
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
      canonical: Category?.Canonical_Tag || url
    }
  };
}

const CategoryPage = async ({
  params
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  if (slug === 'accessories') {
    const category = await fetchSingleCategory(
      'accessories',
      FIND_ONE_Accessory,
      true
    );
    if (!category || category.status !== 'PUBLISHED') {
      return notFound();
    }
    const defaultOrderMap = new Map(
      defaultOrder.map((name, index) => [name, index])
    );
    const sortedAccessories = (category.accessories || [])
      .filter((acc) => acc.status === 'PUBLISHED')
      .sort((a, b) => {
        const indexA = defaultOrderMap.get(a.name) ?? Number.MAX_SAFE_INTEGER;
        const indexB = defaultOrderMap.get(b.name) ?? Number.MAX_SAFE_INTEGER;
        return indexA - indexB;
      });

    return (
      <>
        <Breadcrumb
          image={category.whatAmiImageBanner?.imageUrl}
          altText={category.whatAmiImageBanner?.altText || 'Accessories'}
          slug="ACCESSORIES"
          isImagetext
        />
        <AccessoriesComp
          product={sortedAccessories || []}
          category={category}
        />
        <CategoryFaqs />
      </>
    );
  } else {
    const categories = await fetchCategories();
    const findCategory = categories.find(
      (cat: ICategory) =>
        (cat.custom_url?.trim() ?? '') === slug.trim() &&
        cat.status === 'PUBLISHED'
    );
    if (!findCategory) {
      return notFound();
    }

    console.log(findCategory, "findCategoryfindCategory")

   const isFloorSmart =
  findCategory?.name?.trim().toLowerCase() === 'floor smart';

const reCallFlag =
  findCategory?.recalledSubCats &&
  findCategory?.recalledSubCats.length > 0;

// 👉 Apply recall logic ONLY if NOT Floor Smart
if (reCallFlag && !isFloorSmart) {
  let products: IProduct[] = [];

  categories.forEach((cat: ICategory) => {
    const filteredProd =
      cat.products?.filter(
        (prod: IProduct) =>
          findCategory?.recalledSubCats?.some(
            (subCat: ISUBCATEGORY) =>
              subCat.custom_url === prod.subcategory?.custom_url
          ) && prod.status === 'PUBLISHED'
      ) || [];

    products = [...products, ...filteredProd];
  });

  findCategory.products = products;
} else {
  // 👉 Default behavior (including FLOOR SMART)
  findCategory.products =
    findCategory?.products?.filter(
      (prod: IProduct) => prod.status === 'PUBLISHED'
    ) || [];
}

    const filteredCategories =
      categories
        .filter((value: ICategory) => value?.name?.trim() !== 'ACCESSORIES' )
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

    const smartFloorCategory = filteredCategories.find(
      (cat: ICategory) =>
        cat.name === 'FLOOR SMART'
    );

    console.log('smartFloorCategorysmartFloorCategory', smartFloorCategory);

    console.log(slug,"slugslug")
    return (
      <Category
        catgories={filteredCategories}
        categoryData={findCategory}
        isSubCategory={false}
        slug={slug}
      />
    );
  }
};

export default CategoryPage;
