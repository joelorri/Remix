import { createCookieSessionStorage, redirect, LoaderFunction, json } from '@remix-run/node';
import axios, { AxiosError } from 'axios';
import { SignupInput, ShowErrors, ProfileSearchResult } from 'types/interfaces';

const apiUrl = process.env.API_URL;

// Create session storage for cookies (without httpOnly flag)
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'authToken',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    // Removed the httpOnly flag to make the cookie accessible to JavaScript
  },
});

// Login function
export async function login({ email, password }: SignupInput) {
  try {
    const response = await axios.post(
      `${apiUrl}/api/login`,
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        withCredentials: true,
      }
    );

    if (response.status === 200 && response.data?.token) {
      const userId = response.data.user.id;
      const authToken = response.data.token;
      return await createUserSession(userId, authToken, '/home');
    } else {
      throw new Error('Invalid login credentials');
    }
  } catch (error) {
    throw new ShowErrors({ title: 'Invalid login credentials', code: '401' });
  }
}

// Helper function to create a session
async function createUserSession(userId: string, authToken: string, redirectPath: string) {
  const session = await sessionStorage.getSession();

  session.set('user_id', userId);
  session.set('authToken', authToken);

  return redirect(redirectPath, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
}

// Sign-up function
export async function signup(name: string, username: string, email: string, password: string, password_confirmation: string) {
  try {
    const response = await axios.post(
      `${apiUrl}/api/register`,
      { name, username, email, password, password_confirmation },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      const userId = response.data.user.id;
      const authToken = response.data.token;
      return createUserSession(userId, authToken, '/home');
    } else {
      throw new Error('Invalid signup credentials');
    }
  } catch (error) {
    throw new ShowErrors({ title: 'Invalid signup credentials', code: '401' });
  }
}

// Fetch user data from API
export async function fetchUserData(request: Request) {
  const authToken = await getAuthToken(request);
  if (!authToken) {
    throw new Error('No authentication token found.');
  }

  const response = await axios.get(`${apiUrl}/api/user`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: 'application/json',
    },
  });

  return response.data;
}

// Get auth token from request headers
export async function getAuthToken(request: Request): Promise<string | null> {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;

  const session = await sessionStorage.getSession(cookieHeader);
  const authToken = session.get('authToken');
  return authToken || null;
}

// Get logged-in user ID
export async function getLoggedUserId(request: Request): Promise<string | null> {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;

  const session = await sessionStorage.getSession(cookieHeader);
  const userId = session.get('user_id');
  return userId || null;
}

// Logout function
export async function logout() {
  try {
    await axios.post(`${apiUrl}/logout`, {}, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      withCredentials: true,
    });

    return redirect('/login', {
      headers: { 'Set-Cookie': 'authToken=; Max-Age=0; Path=/' },
    });
  } catch (error) {
    throw new Error('Error during logout.');
  }
}

// Cookie helper to set a cookie (for server-side usage)
export const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Set expiration time
  const expires = `expires=${date.toUTCString()}`; // UTC expiration format
  return `${name}=${value}; ${expires}; path=/`; // Set the cookie in response
};

// Fetch the value of a cookie (for server-side usage)
const getCookieValue = (name: string): string => {
  const cookies = document.cookie.split(';');
  const cookie = cookies.find(cookie => cookie.trim().startsWith(`${name}=`));
  return cookie?.split('=')[1] || ''; // Return value or empty string
};

// Loader function for handling user sessions on initial page load
export const loader: LoaderFunction = async ({ request }) => {
  const res = await fetch(`${apiUrl}/api/user`, {
    credentials: 'include',
    headers: {
      Cookie: request.headers.get('Cookie') || '',
    },
  });

  if (res.status !== 200) {
    return redirect('/login'); // Redirect to login if not authenticated
  }

  const user = await res.json();
  if (!user) {
    return redirect('/login');
  }

  return json({ user });
};
