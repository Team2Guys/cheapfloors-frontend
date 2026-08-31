import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import Cookies from 'js-cookie';

// CMS rows still hold easyfloors.ae URLs (image srcs like
// https://easyfloors.ae/_next/image?url=..., stray hrefs in rich text) plus
// bare-domain brand mentions in prose ("at Easyfloors.ae, we don't charge").
// Rewriting every response here removes the site's runtime dependency on the
// old domain staying online, without waiting for the data cleanup. The bare
// form keeps the first letter's case so prose stays natural; emails migrate
// too (cs@easyfloors.ae -> cs@cheapfloors.ae), which matches the new inbox.
const rewriteOldDomain = (json: string) =>
  json
    .replace(/https?:\/\/(www\.)?easyfloors\.ae/gi, 'https://cheapfloors.ae')
    .replace(/https?:\/\/easyfloors-frontend\.vercel\.app/gi, 'https://cheapfloors.ae')
    .replace(/www\.easyfloors\.ae/gi, 'cheapfloors.ae')
    .replace(/easyfloors\.ae/gi, (hit) =>
      hit[0] === 'E' ? 'Cheapfloors.ae' : 'cheapfloors.ae'
    );

const oldDomainLink = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    if (!response.data) return response;
    const json = JSON.stringify(response.data);
    if (!/easyfloors/i.test(json)) return response;
    return { ...response, data: JSON.parse(rewriteOldDomain(json)) };
  })
);

// An expired/invalid admin token only surfaces as an UNAUTHENTICATED error on
// the next API call — when that happens inside the dashboard, end the session
// instead of leaving the UI half-broken behind a stale login.
const authErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (typeof window === 'undefined') return;
  const path = window.location.pathname;
  if (!path.startsWith('/dashboard') || path === '/dashboard/Admin-login')
    return;

  const unauthenticated =
    graphQLErrors?.some((e) => e.extensions?.code === 'UNAUTHENTICATED') ||
    (networkError &&
      'statusCode' in networkError &&
      networkError.statusCode === 401);

  if (unauthenticated) {
    Cookies.remove('admin_access_token');
    Cookies.remove('super_admin_access_token');
    Cookies.remove('admin_data');
    window.location.href = '/dashboard/Admin-login';
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([
    authErrorLink,
    oldDomainLink,
    new HttpLink({
      uri: process.env.NEXT_PUBLIC_BASE_URL, // Replace with your GraphQL API endpoint
      credentials: 'include'
    })
  ]),
  cache: new InMemoryCache()
});

export default client;
