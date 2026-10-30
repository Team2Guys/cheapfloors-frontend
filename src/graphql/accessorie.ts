import { gql } from '@apollo/client';

const ACCESSORY_FIELDS = `
      id
      name
      price
      discountPrice
      description
      stock
      posterImageUrl
      hoverImageUrl
      productImages
      createdAt
      updatedAt
      Canonical_Tag
      Meta_Description
      Meta_Title
      last_editedBy
      custom_url
      AdditionalInformation
      FAQS
      boxCoverage
      featureImages
      sizes
      lengthPrice
      status
      sku
      Schema_Json
      Description_Heading
      category {
        id
        name
        custom_url
        description
        status
        RecallUrl
      }
      products {
        id
        name
        colors
      }
`;

export const FETCH_ALL_ACCESSORIES = gql`
  query Accessories {
    accessories {
      ${ACCESSORY_FIELDS}
      matchingProducts {
        id
        name
        colors
      }
    }
  }
`;

// Same query without matchingProducts, for backends that predate that field.
export const FETCH_ALL_ACCESSORIES_LEGACY = gql`
  query AccessoriesLegacy {
    accessories {
      ${ACCESSORY_FIELDS}
    }
  }
`;

export const UPDATE_ACCESSORY_MUTATION = gql`
  mutation UpdateAccessory($input: UpdateAccessoryInput!) {
    updateAccessory(updateAccessoryInput: $input) {
      id
      name
    }
  }
`;

export const FETCH_META_TITLE = gql`
  query FetchMetaTitle($custom_url: String!, $category: String!) {
    fetchMetatTitle(custom_url: $custom_url, category: $category) {
      name
      Canonical_Tag
      Meta_Description
      Meta_Title
      posterImageUrl
    }
  }
`;
