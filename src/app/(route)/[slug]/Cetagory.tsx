import Breadcrumb from 'components/Reusable/breadcrumb';
import {
  Category as ICategory,
  ISUBCATEGORY,
  SUBNCATEGORIES_PAGES_PROPS
} from 'types/cat';
import CategoryClient from './categoryclient';
const Category = ({
  catgories,
  categoryData,
  isSubCategory,
  slug,
  subcategory,
  subdescription
}: SUBNCATEGORIES_PAGES_PROPS) => {
  const Data: ISUBCATEGORY | ICategory = categoryData;
  console.log(subcategory, "subcategory")
   console.log(categoryData, "categoryData")
  return (
    <>
      <Breadcrumb
        image={
          isSubCategory
            ? subdescription?.[0]?.BannerImage?.imageUrl
            : Data.whatAmiImageBanner?.imageUrl
              ? Data.whatAmiImageBanner?.imageUrl
              : Data.BannerImage?.imageUrl
                ? Data.BannerImage?.imageUrl
                : '/assets/images/category/category-breadcrumb.webp'
        }
        altText={Data.whatAmiImageBanner?.altText || Data.BannerImage?.altText}
        slug={slug}
        subcategory={subcategory}
        isImagetext
      />

      <CategoryClient
        categoryData={Data}
        subcategory={subcategory}
        slug={slug}
        catgories={catgories}
        subdescription={subdescription}
        isSubCategory={isSubCategory}
      />
    </>
  );
};

export default Category;
