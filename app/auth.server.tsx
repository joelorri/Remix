import { createCookieSessionStorage } from '@remix-run/node';
import { redirect } from '@remix-run/react';
import axios, { AxiosError } from 'axios';
import { ProfileSearchResult } from '../types/interfaces';

const apiUrl = process.env.API_URL;

// TOKENS I COOKIES
const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: 'authToken',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    },
});

async function createUserSession(user_id: string, redirectPath: string) {
    const session = await sessionStorage.getSession();
    session.set('user_id', user_id);
    const cookieHeader = await sessionStorage.commitSession(session);
    return redirect(redirectPath, {
        headers: {
            'Set-Cookie': cookieHeader,
        },
    });
}

// LOGIN
export async function login({ email, password }: { email: string; password: string }) {
    try {
        const response = await axios.post(
            `${apiUrl}/api/login`,
            { email, password },
            {
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                withCredentials: true,
            }
        );

        if (response.status === 200 && response.data?.token) {
            const userId = response.data.user.id;
            return await createUserSession(userId, '/home');
        }
    } catch (error) {
        throw new Error('Error during login. Please verify your credentials.');
    }
}

// LOGOUT
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

// REGISTER
export async function register({
    name,
    email,
    password,
    password_confirmation,
}: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}) {
    try {
        const response = await axios.post(
            `${apiUrl}/api/register`,
            { name, email, password, password_confirmation },
            {
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                withCredentials: true,
            }
        );

        if (response.status === 200 && response.data?.token) {
            const userId = response.data.user.id;
            return await createUserSession(userId, '/home');
        }
    } catch (error) {
        throw new Error('Error during registration. Please verify your data.');
    }
}

const getCookieValue = (name: string): string => {
    const cookies = document.cookie.split(';');
    const cookie = cookies.find(cookie => cookie.trim().startsWith(`${name}=`));
    return cookie?.split('=')[1] || ''; // Retorna el valor o una cadena buida
  };
  
  // Funció per fer la cerca
  export const searchProfiles = async (query: string): Promise<ProfileSearchResult[]> => {
    const xsrfToken = getCookieValue('XSRF-TOKEN');
    const authToken = 'eyJ1c2VyX2lkIjoxfQ%3D%3D'; // Exemple d'autenticació
  
    try {
      const response = await axios.get(`http://localhost/api/profile/searchs?query=${query}`, {
        withCredentials: true,
        headers: {
          'X-XSRF-TOKEN': xsrfToken,
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      if (response.status === 200 && response.data.success) {
        return response.data.data;
      } else {
        throw new Error('No es van trobar resultats.');
      }
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response?.status === 401) {
        throw new Error('Error: No autoritzat. Per favor, inicia sessió.');
      } else if (err.response?.status === 403) {
        throw new Error('Error: Accés prohibit. Verifica els permisos.');
      } else {
        throw new Error('Error desconegut al fer la cerca.');
      }
    }
  };


  // Function to retrieve the XSRF token from cookies
  export const getXsrfToken = (): string => {
    return getCookieValue('XSRF-TOKEN');
  };
  

  export const getSelectedDj = (): ProfileSearchResult | null => {
    const djData = getCookieValue('selected_dj');
    return djData ? JSON.parse(djData) : null;
  };