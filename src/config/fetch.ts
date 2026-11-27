import {
  FETCH_ALL_APPOINTMENTS,
  FETCH_ALL_CATEGORIES,
  FETCH_ALL_ORDERS,
  FETCH_ALL_PRODUCTS,
  FETCH_ALL_SUB_CATEGORIES,
  FIND_B2B_QUOTE,
  FIND_ONE_CATEGORY,
  FIND_ONE_PRODUCT,
  FIND_ONE_SUB_CATEGORY,
  GET_ALL_ADMINS,
  GET_ALL_RECORDS,
  GET_ORDER_HISTORY
} from 'graphql/queries';
import client from './apolloClient';
import { ApolloError, DocumentNode } from '@apollo/client';
import { Category } from 'types/cat';
import { IProduct } from 'types/prod';
import { IB2BQuote } from 'types/b2bQuote';
import { ORDER_QUERY } from 'graphql/mutations';
import {
  FETCH_ALL_ACCESSORIES,
  FETCH_ALL_ACCESSORIES_LEGACY,
  FETCH_META_TITLE
} from 'graphql/accessorie';
import { FETCH_ALL_BLOGS, FIND_ONE_BLOG } from 'graphql/blog';
import { Blog } from 'types/blog';

// The backend answers a lookup for a slug that doesn't exist with a GraphQL
// error ("Cannot return null for non-nullable field Query.category"), not with
// null data. Only that answer means "no such page". A timeout, a 5xx or a
// database error inside a resolver means the backend couldn't answer, and
// turning those into a 404/410 tells search engines that live pages are gone.
const MISSING_RECORD = /^Cannot return null for non-nullable field Query\./;

export const isMissingRecordError = (error: unknown) =>
  error instanceof ApolloError &&
  !error.networkError &&
  error.graphQLErrors.length > 0 &&
  error.graphQLErrors.every((e) => MISSING_RECORD.test(e.message));

export const fetchProducts = async (CUSTOMIZE_QUERY?: DocumentNode) => {
  try {
    const { data } = await client.query({
      query: CUSTOMIZE_QUERY ? CUSTOMIZE_QUERY : FETCH_ALL_PRODUCTS,
      fetchPolicy: 'no-cache',
      context: {
        fetchOptions: {
          credentials: 'include',
          next: { tags: ['products'] }
        }
      }
    });

    return data?.products || [];
  } catch (error) {
    return [];
    throw error;
  }
};

const queryCategories = async (query: DocumentNode) => {
  const { data } = await client.query({
    query,
    fetchPolicy: 'no-cache',
    context: {
      fetchOptions: { next: { tags: ['categories'] } }
    }
  });
  return data?.categories || [];
};

/** All categories, or [] when the backend can't answer (menus, listings). */
export const fetchCategories = async (
  FETCH_HEADER_CATEGORIES?: DocumentNode
) => {
  try {
    return await queryCategories(
      FETCH_HEADER_CATEGORIES ?? FETCH_ALL_CATEGORIES
    );
  } catch {
    return [];
  }
};

/**
 * All categories, throwing when the backend can't answer. Use it wherever an
 * empty list would decide that a page doesn't exist (404/410).
 */
export const fetchCategoriesOrThrow = (query?: DocumentNode) =>
  queryCategories(query ?? FETCH_ALL_CATEGORIES);

const querySubCategories = async (query: DocumentNode) => {
  const { data } = await client.query({
    query,
    fetchPolicy: 'no-cache',
    context: {
      fetchOptions: { next: { tags: ['subcategories'] } }
    }
  });
  return data?.subCategories || [];
};

/** All subcategories, or [] when the backend can't answer. */
export const fetchSubCategories = async (FETCHSUBCAT?: DocumentNode) => {
  try {
    return await querySubCategories(FETCHSUBCAT ?? FETCH_ALL_SUB_CATEGORIES);
  } catch {
    return [];
  }
};

/** All subcategories, throwing when the backend can't answer (see fetchCategoriesOrThrow). */
export const fetchSubCategoriesOrThrow = (query?: DocumentNode) =>
  querySubCategories(query ?? FETCH_ALL_SUB_CATEGORIES);

export const fetchAppointments = async (token: string | undefined) => {
  try {
    const { data } = await client.query({
      query: FETCH_ALL_APPOINTMENTS,
      fetchPolicy: 'no-cache',
      context: {
        headers: {
          Authorization: `Bearer ${token}`
        },
        fetchOptions: {
          next: { tags: ['appointments'] }
        }
      }
    });
    return data?.appointments || [];
  } catch (error) {
    return [];
    throw error;
  }
};

export const fetchOrders = async (
  token: string | undefined,
  FETCH_ORDERS?: DocumentNode
) => {
  try {
    const { data } = await client.query({
      query: FETCH_ORDERS ? FETCH_ORDERS : FETCH_ALL_ORDERS,
      fetchPolicy: 'no-cache',
      context: {
        headers: {
          Authorization: `Bearer ${token}`
        },
        fetchOptions: {
          next: { tags: ['orders'] }
        }
      }
    });
    return data?.AllOrders || [];
  } catch (error) {
    return []
    throw error;
  }
};

export const fetchOrdersHistory = async (
  token: string | undefined,
  email: string | null | undefined
) => {
  try {
    const { data } = await client.query({
      query: GET_ORDER_HISTORY,
      variables: { email },
      fetchPolicy: 'no-cache',
      context: {
        headers: {
          Authorization: `Bearer ${token}`
        },
        fetchOptions: {
          next: { tags: ['usersorders'] }
        }
      }
    });
    return data?.usersOrders || [];
  } catch (error) {
    return [];
    throw error;
  }
};

export const get_all_records = async (token: string) => {
  try {
    const { data } = await client.query({
      query: GET_ALL_RECORDS,
      fetchPolicy: 'no-cache',
      context: {
        headers: {
          Authorization: `Bearer ${token}`
        },
        fetchOptions: {
          next: { tags: ['states_records'] }
        }
      }
    });
    return data?.GET_ALL_RECORDS;
  } catch (error) {
    return [];
    throw error;
  }
};

export const get_allAdmins = async (token: string | undefined) => {
  try {
    const { data } = await client.query({
      query: GET_ALL_ADMINS,
      context: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });
    return data?.admins || [];
  } catch (error) {
    return error;
  }
};

const queryAccessories = async (query: DocumentNode) => {
  const { data } = await client.query({
    query,
    fetchPolicy: 'no-cache',
    context: {
      fetchOptions: {
        credentials: 'include',
        next: { tags: ['accessories'] }
      }
    }
  });
  return data?.accessories || [];
};

const loadAccessories = async (CUSTOMISE_ACCESSORIES?: DocumentNode) => {
  try {
    return await queryAccessories(
      CUSTOMISE_ACCESSORIES ?? FETCH_ALL_ACCESSORIES
    );
  } catch (error) {
    if (CUSTOMISE_ACCESSORIES) throw error;
    // Backend may not expose matchingProducts yet; retry without it.
    return queryAccessories(FETCH_ALL_ACCESSORIES_LEGACY);
  }
};

/** All accessories, or [] when the backend can't answer. */
export const fetchAccessories = async (
  CUSTOMISE_ACCESSORIES?: DocumentNode
) => {
  try {
    return await loadAccessories(CUSTOMISE_ACCESSORIES);
  } catch {
    return [];
  }
};

/** All accessories, throwing when the backend can't answer (see fetchCategoriesOrThrow). */
export const fetchAccessoriesOrThrow = () => loadAccessories();

export const fetchSingleCategory = async (
  customUrl: string,
  FIND_ONE_CUSTOM_QUERY?: DocumentNode,
  accessoryFlag?: boolean
): Promise<Category | null> => {
  try {
    const { data } = await client.query({
      query: FIND_ONE_CUSTOM_QUERY ? FIND_ONE_CUSTOM_QUERY : FIND_ONE_CATEGORY,
      variables: { customUrl, accessoryFlag },
      fetchPolicy: 'no-cache',
      context: {
        fetchOptions: { next: { tags: ['categories'] } }
      }
    });
    return data?.category;
  } catch (error) {
    if (isMissingRecordError(error)) return null;
    throw error;
  }
};

export const fetchSingeSubCategory = async (
  customUrl: string,
  category: string
): Promise<Category | null> => {
  try {
    const { data } = await client.query({
      query: FIND_ONE_SUB_CATEGORY,
      variables: { customUrl, category },
      fetchPolicy: 'no-cache',
      context: {
        fetchOptions: { next: { tags: ['categories'] } }
      }
    });
    return data?.subCategory;
  } catch (error) {
    if (isMissingRecordError(error)) return null;
    throw error;
  }
};

export const fetchSingeProduct = async (
  customUrl: string,
  category: string,
  subCategory: string,
  acessories?: boolean,
  FIND_QUICK_VIEW_PRODUCT?: DocumentNode
): Promise<IProduct | null> => {
  try {
    const { data } = await client.query({
      query: FIND_QUICK_VIEW_PRODUCT
        ? FIND_QUICK_VIEW_PRODUCT
        : FIND_ONE_PRODUCT,
      variables: { custom_url: customUrl, category, subCategory, acessories },
      fetchPolicy: 'no-cache',
      context: {
        fetchOptions: { next: { tags: ['products'] } }
      }
    });
    return data?.product;
  } catch (error) {
    if (isMissingRecordError(error)) return null;
    throw error;
  }
};

export const fetchSingleOrder = async (orderId: string) => {
  try {
    const { data } = await client.query({
      query: ORDER_QUERY,
      variables: { orderId },
      fetchPolicy: 'no-cache',
      context: {
        fetchOptions: { next: { tags: ['orders'] } }
      }
    });

    return data?.Order || null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

export const fetchSingleB2bQuote = async (
  id: number
): Promise<IB2BQuote | null> => {
  try {
    const { data } = await client.query({
      query: FIND_B2B_QUOTE,
      variables: { id },
      fetchPolicy: 'no-cache'
    });
    return data?.b2bQuote || null;
  } catch (error) {
    console.error('Error fetching B2B quote:', error);
    return null;
  }
};

export const getMetaTitleData = async (
  custom_url: string,
  category: string
) => {
  try {
    const { data } = await client.query({
      query: FETCH_META_TITLE,
      variables: {
        custom_url,
        category
      },
      fetchPolicy: 'no-cache',
      context: {
        fetchOptions: {
          credentials: 'include',
          next: { tags: ['accessories'] }
        }
      }
    });
    return data?.fetchMetatTitle;
    //eslint-disable-next-line
  } catch (error: any) {
    // Log complete error structure

    // Extract useful error details
    if (error?.graphQLErrors?.length) {
      console.error('GraphQL Error:', error.graphQLErrors[0].message);
    } else if (error?.networkError?.result?.errors?.length) {
      console.error(
        'Network Error:',
        error.networkError.result.errors[0].message
      );
    } else {
      console.error('Unknown Apollo error:', error.message);
    }

    // A missing record comes back as null data, so an error here means the
    // backend couldn't answer; don't let the page turn it into a 404.
    if (isMissingRecordError(error)) return null;
    throw error;
  }
};

export const fetchBlogs = async (): Promise<Blog[]> => {
  try {
    const { data } = await client.query({
      query: FETCH_ALL_BLOGS,
      fetchPolicy: 'no-cache',
      context: {
        fetchOptions: { next: { tags: ['blogs'] } }
      }
    });

    return data?.blogs || [];
  } catch (error) {
    return [];
    throw error;
  }
};

export const fetchSingleBlog = async (
  customUrl: string
): Promise<Blog | null> => {
  try {
    const { data } = await client.query({
      query: FIND_ONE_BLOG,
      variables: { customUrl },
      fetchPolicy: 'no-cache',
      context: {
        fetchOptions: { next: { tags: ['blogs'] } }
      }
    });
    return data?.blog || null;
  } catch (error) {
    // A missing blog comes back as { blog: null }, so an error is a failure.
    if (isMissingRecordError(error)) return null;
    throw error;
  }
};
