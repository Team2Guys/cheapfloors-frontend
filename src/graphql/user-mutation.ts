import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateAccount($createUser: CreateUserInput!) {
    createUser(createUser: $createUser) {
      id
      email
      name
      phone
    }
  }
`;

export const LOGIN_USER = gql`
  mutation UserLogin($userLogin: UserLogin!) {
    userLogin(userLogin: $userLogin) {
      id
      email
      name
      phone
      userImageUrl
      token
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($updateUser: UpdateUserInput!) {
    updateUser(updateUser: $updateUser) {
      id
      name
    }
  }
`;
