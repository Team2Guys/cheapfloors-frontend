import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink
} from '@apollo/client';

// CMS rows still hold easyfloors.ae URLs (image srcs like
// https://easyfloors.ae/_next/image?url=..., stray hrefs in rich text).
// Rewriting every response here removes the site's runtime dependency on the
// old domain staying online, without waiting for the data cleanup. The bare
// www form maps to the apex; email addresses (cs@easyfloors.ae) carry neither
// protocol nor www, so they are never touched.
const rewriteOldDomain = (json: string) =>
  json
    .replace(/https?:\/\/(www\.)?easyfloors\.ae/gi, 'https://cheapfloors.ae')
    .replace(/www\.easyfloors\.ae/gi, 'cheapfloors.ae');

const oldDomainLink = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    if (!response.data) return response;
    const json = JSON.stringify(response.data);
    if (!/easyfloors\.ae/i.test(json)) return response;
    return { ...response, data: JSON.parse(rewriteOldDomain(json)) };
  })
);

const client = new ApolloClient({
  link: oldDomainLink.concat(
    new HttpLink({
      uri: process.env.NEXT_PUBLIC_BASE_URL, // Replace with your GraphQL API endpoint
      credentials: 'include'
    })
  ),
  cache: new InMemoryCache()
});

export default client;
