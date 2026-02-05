import { DocumentNode } from 'graphql';
import client from './apolloClient';
import {
  FIND_ONE_REDIRECT_URL,
  GET_LAST_7_DAYS_STATS,
  GET_MONTHLY_STATS,
  GET_Redirecturls
} from 'graphql/general';

export const fetchRedirectUrls = async (
  FIND_QUICK_VIEW_PRODUCT?: DocumentNode
) => {
  try {
    const { data } = await client.query({
      query: FIND_QUICK_VIEW_PRODUCT
        ? FIND_QUICK_VIEW_PRODUCT
        : GET_Redirecturls,

      fetchPolicy: 'no-cache',
      context: {
        credentials: 'include',
        fetchOptions: { next: { tags: ['RedirectUrls'] } }
      }
    });

    return data?.findAllRedirecturls;
  } catch (error) {
    return null;
    throw error;
  }
};

export const findOneRedirectUrl = async (
  url: string,
  CUSTOM_MUTATION?: DocumentNode
) => {
  try {
    const { data } = await client.mutate({
      mutation: CUSTOM_MUTATION ? CUSTOM_MUTATION : FIND_ONE_REDIRECT_URL,
      variables: { url },
      context: {
        fetchOptions: {
          credentials: 'include',
          next: { tags: ['RedirectUrls'] }
        }
      }
    });

    return data?.findOneRedirecturls || null;
  } catch (err) {
    console.log(err);
    throw null;
  }
};

export const GET_MONTHLY_STATSHander = async (CUSTOM_QUERY?: DocumentNode) => {
  try {
    const { data } = await client.query({
      query: CUSTOM_QUERY ? CUSTOM_QUERY : GET_MONTHLY_STATS,
      context: {
        fetchOptions: {
          credentials: 'include',
          next: { tags: ['orders'] }
        }
      }
    });

    return data?.MONTHLYCHARTS || null;
  } catch (err) {
    console.error(err, 'error message');
    throw null;
  }
};

export const GET_LAST_7_DAYS_STATSHANDLER = async (
  CUSTOM_QUERY?: DocumentNode
) => {
  try {
    const { data } = await client.query({
      query: CUSTOM_QUERY ? CUSTOM_QUERY : GET_LAST_7_DAYS_STATS,
      context: {
        fetchOptions: {
          credentials: 'include',
          next: { tags: ['orders'] }
        }
      }
    });

    return data?.WEEKLYCHARTS || null;
  } catch (err) {
    console.log(err, 'err');
    throw null;
  }
};
