import { gql } from '@apollo/client';

export const ADD_REDIRECTURLS = gql`
  mutation CreateRedirectURL($CreatedRedirecturls: CreatedRedirecturls!) {
    createRedirecturls(CreatedRedirecturls: $CreatedRedirecturls) {
      id
    }
  }
`;

export const UPDATE_REDIRECTURLS = gql`
  mutation UpdateRedirectURL($UpdateRedirecturls: UpdateRedirecturls!) {
    updateRedirecturls(UpdateRedirecturls: $UpdateRedirecturls) {
      id
    }
  }
`;

export const REMOVE_REVIEW = gql`
  mutation Delete_Review($id: Int!) {
    Delete_Review(id: $id) {
      name
    }
  }
`;

export const GET_Redirecturls = gql`
  query findAllRedirecturls {
    findAllRedirecturls {
      id
      url
      redirectedUrl
      status
      createdAt
      updatedAt
    }
  }
`;

export const FIND_ONE_REDIRECT_URL = gql`
  mutation findOneRedirecturls($url: String!) {
    findOneRedirecturls(url: $url) {
      url
      redirectedUrl
      status
    }
  }
`;

export const GET_LAST_7_DAYS_STATS = gql`
  query GetLast7DaysStats {
    WEEKLYCHARTS {
      date
      day
      orders
    }
  }
`;

export const GET_MONTHLY_STATS = gql`
  query GetMonthlyStats {
    MONTHLYCHARTS {
      completeMonthlyData {
        month
        Orders
      }
    }
  }
`;
