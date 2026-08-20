import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const apiUrl = process.env.NEXTAUTH_API_URL || 'http://localhost:3001/v1';
const refreshMarginMs = 60_000;
const refreshSingleFlightTtlMs = 5_000;
const refreshRequests = new Map<string, Promise<JWT>>();

type AuthResponse = {
  accessToken?: unknown;
  refreshToken?: unknown;
};

function getAccessTokenExpires(accessToken: string): number | null {
  try {
    const encodedPayload = accessToken.split('.')[1];
    if (!encodedPayload) return null;

    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    ) as { exp?: unknown };

    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

function refreshError(token: JWT): JWT {
  return {
    ...token,
    accessToken: undefined,
    refreshToken: undefined,
    accessTokenExpires: 0,
    error: 'RefreshAccessTokenError',
  };
}

async function requestRefreshedToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) return refreshError(token);

  try {
    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    if (!response.ok) return refreshError(token);

    const payload = await response.json();
    const data = (payload.data || payload) as AuthResponse;

    if (typeof data.accessToken !== 'string' || typeof data.refreshToken !== 'string') {
      return refreshError(token);
    }

    const accessTokenExpires = getAccessTokenExpires(data.accessToken);
    if (accessTokenExpires === null) return refreshError(token);

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenExpires,
      error: undefined,
    };
  } catch {
    return refreshError(token);
  }
}

function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) return Promise.resolve(refreshError(token));

  const refreshToken = token.refreshToken;
  const inFlight = refreshRequests.get(refreshToken);
  if (inFlight) return inFlight;

  const request = requestRefreshedToken(token);
  refreshRequests.set(refreshToken, request);

  void request.then(() => {
    setTimeout(() => {
      if (refreshRequests.get(refreshToken) === request) {
        refreshRequests.delete(refreshToken);
      }
    }, refreshSingleFlightTtlMs);
  });

  return request;
}

const providers: NextAuthOptions['providers'] = [
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      try {
        const res = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) return null;

        const payload = await res.json();
        const data = payload.data || payload;

        return {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
      } catch {
        return null;
      }
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') return true;

      if (!user.email) return false;

      try {
        const res = await fetch(`${apiUrl}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-internal-auth-secret': process.env.INTERNAL_AUTH_SECRET || '',
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name || user.email,
          }),
        });

        if (!res.ok) return false;

        const payload = await res.json();
        const data = payload.data || payload;

        user.id = data.user.id;
        user.role = data.user.role;
        user.accessToken = data.accessToken;
        user.refreshToken = data.refreshToken;

        return true;
      } catch {
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        const accessTokenExpires = user.accessToken
          ? getAccessTokenExpires(user.accessToken)
          : null;

        if (!user.accessToken || !user.refreshToken || accessTokenExpires === null) {
          return refreshError(token);
        }

        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = accessTokenExpires;
        token.error = undefined;

        return token;
      }

      if (token.error === 'RefreshAccessTokenError') return token;

      if (
        token.accessToken &&
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires - refreshMarginMs
      ) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      session.user.role = token.role;
      session.error = token.error;

      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
};
