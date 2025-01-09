import axios from "axios";
import { ProfileSearchResult } from "types/interfaces";


// Funció per obtenir el valor d'una cookie
const getCookieValue = (name: string): string => {
  const cookies = document.cookie.split(';');
  const cookie = cookies.find(cookie => cookie.trim().startsWith(`${name}=`));
  return cookie?.split('=')[1] || ''; // Retorna el valor o una cadena buida
};



// Funció per obtenir el DJ seleccionat de les cookies
export const getSelectedDj = (): ProfileSearchResult | null => {
  const djData = getCookieValue('selected_dj');
  return djData ? JSON.parse(djData) : null;
};

interface RequestPayload {
  dj_id: number;
  songs: number[];
  comments: Record<number, string>;
  tracks: Record<string, string>;
}
export const listAllCookies = () => {
  const cookies = document.cookie.split(';');
  const cookieList = cookies.map((cookie) => {
    const [name, value] = cookie.split('=');
    return { name: name.trim(), value: decodeURIComponent(value.trim()) };
  });
  console.log('Cookies disponibles:', cookieList);
  return cookieList;
}


export async function getAuthToken(request: Request): Promise<string | null> {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) {
    console.error('No s\'ha trobat cap cookie al request');
    return null;
  }

  const session = await sessionStorage.getSession(cookieHeader)
  ;
  const authToken = session.get('authToken');

  console.log('Token d\'autenticació obtingut:', authToken);
  
  return authToken || null;
}

export async function submitRequest(request: Request, payload: RequestPayload) {
  // Espera el token d'autenticació
  const token = await getAuthToken(request);

  console.log('token', token);

  const response = await fetch('http://localhost/api/requests/stored', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload), // Envia el payload com a JSON
  });

  if (!response.ok) {
    throw new Error('Error en enviar la petició.');
  }

  return response.json();
}


// Funció per cercar perfils
export const searchProfiles = async (query: string) => {
  try {
    const response = await axios.get(`http://localhost/api/profile/searchs?query=${query}`, {
      withCredentials: true,  // Inclou cookies per les peticions CORS
    });
    return response.data;
  } catch (error) {
    console.error('Error durant la cerca:', error);
    throw error;
  }
};

// Funció per establir un DJ seleccionat
interface Profile {
  id: number;
  name: string;
  email: string;
  created_at: string;
  role: string;
  image: string;
}

export const selectDj = (profile: Profile) => {
  const djData = {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    created_at: profile.created_at,
    role: profile.role,
    image: profile.image,
  };
  setCookie('selected_dj', JSON.stringify(djData), 7);  // Guarda el DJ seleccionat a les cookies
};

export const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Estableix el temps de caducitat
  const expires = "expires=" + date.toUTCString(); // Format de caducitat en UTC
  document.cookie = `${name}=${value}; ${expires}; path=/`; // Estableix la cookie
};
