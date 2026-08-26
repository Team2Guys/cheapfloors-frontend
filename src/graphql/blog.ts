import { gql } from '@apollo/client';

export const FETCH_ALL_BLOGS = gql`
  query Blogs {
    blogs {
      id
      title
      content
      category
      posterImageUrl
      Images_Alt_Text
      Meta_Title
      Meta_Description
      Canonical_Tag
      custom_url
      last_editedBy
      createdAt
      updatedAt
      status
    }
  }
`;

export const FIND_ONE_BLOG = gql`
  query Blog($customUrl: String!) {
    blog(customUrl: $customUrl) {
      id
      title
      content
      category
      posterImageUrl
      Images_Alt_Text
      Meta_Title
      Meta_Description
      Canonical_Tag
      custom_url
      last_editedBy
      createdAt
      updatedAt
      status
    }
  }
`;

export const CREATE_BLOG = gql`
  mutation CreateBlog($input: CreateBlogInput!) {
    createBlog(createBlogInput: $input) {
      id
      title
      custom_url
    }
  }
`;

export const UPDATE_BLOG = gql`
  mutation UpdateBlog($input: UpdateBlogInput!) {
    updateBlog(updateBlogInput: $input) {
      id
      title
      custom_url
    }
  }
`;

export const REMOVE_BLOG = gql`
  mutation RemoveBlog($id: Int!) {
    removeBlog(id: $id) {
      id
    }
  }
`;
