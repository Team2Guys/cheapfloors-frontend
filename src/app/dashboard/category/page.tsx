import { fetchCategories } from 'config/fetch';
import Category from './Category';

const AddCategory = async () => {
  const cetagories = await fetchCategories();
  return <Category cetagories={cetagories} />;
};

export default AddCategory;
