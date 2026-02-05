import { gql } from '@apollo/client';

export const FETCH_ALL_ACCESSORIES = gql`
  query Accessories {
    accessories {
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
