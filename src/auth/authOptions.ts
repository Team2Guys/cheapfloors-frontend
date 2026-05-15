import { SessionStrategy, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import client from 'config/apolloClient';
import { LOGIN_USER } from 'graphql/user-mutation';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import { FIND_ONE_USER } from 'graphql/queries';
import Cookies from 'js-cookie';


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const { data } = await client.mutate({
            mutation: LOGIN_USER,
            variables: {
              userLogin: {
                email: credentials?.email,
                password: credentials?.password
              }
            }
          });

          const user = data?.userLogin;

          // ✅ Validate properly
          if (!user || !user.token) {
            return null;
          }

          // ✅ Set cookie ONLY if valid
          Cookies.set('user_token', user.token, {
            expires: 1 // 1 day (correct format)
          });

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.userImageUrl || null
          };
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.email) {
        try {
          const { data } = await client.query({
            query: FIND_ONE_USER,
            variables: { email: token.email },
            fetchPolicy: 'network-only' // Ensure fresh data
          });
          if (data?.find_one) {
            session.user = {
              ...session.user,
              name: data.find_one.name,
              email: data.find_one.email,
              image: data.find_one.userImageUrl || undefined
            };
            // Update token with latest data
            token.email = data.find_one.email;
            token.name = data.find_one.name;
            token.picture = data.find_one.userImageUrl || null;
          }
          return session;
        } catch (error) {
          console.log(error, 'errr');
        }
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: 5 * 60
  },
  secret: process.env.NEXTAUTH_SECRET || 'secret',
  pages: {
    signIn: '/login'
  }
};
