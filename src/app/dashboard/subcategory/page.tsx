import { fetchCategories, fetchSubCategories } from 'config/fetch';
import SubCategoryComponent from './SubCategory';

const AddSubCategory = async () => {
  const [cetagories, subCategories] = await Promise.all([
    fetchCategories(),
    fetchSubCategories()
  ]);
  return (
    <SubCategoryComponent
      subCategories={subCategories}
      cetagories={cetagories}
    />
  );
};

export default AddSubCategory;
