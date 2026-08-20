import type { DefaultSession } from 'next-auth';

type RefreshAccessTokenError = 'RefreshAccessTokenError';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    error?: RefreshAccessTokenError;
    user: DefaultSession['user'] & {
      id?: string;
      role?: string;
    };
  }

  interface User {
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: RefreshAccessTokenError;
  }
}
