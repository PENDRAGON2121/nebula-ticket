import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // Logic to hydrate session in Middleware (Edge compatible)
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? '';
        token.permissions = user.permissions ?? [];
        token.id = user.id as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.permissions = token.permissions;
        session.user.id = token.id;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      // Protect everything except login and api
      const isPublic = isOnLogin || nextUrl.pathname.startsWith('/api');

      if (!isPublic) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/', nextUrl));
        }
      }
      return true;
    },
  },
  providers: [], // configured in auth.ts
} satisfies NextAuthConfig;
