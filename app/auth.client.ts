import axios from "axios";
import { ProfileSearchResult } from "types/interfaces";

const getCookieValue = (name: string): string => {
  const cookies = document.cookie.split(';');
  const cookie = cookies.find(cookie => cookie.trim().startsWith(`${name}=`));
  return cookie?.split('=')[1] || ''; // Retorna el valor o una cadena buida
};

// Function to retrieve the XSRF token from cookies
export const getXsrfToken = (): string => {
  return getCookieValue('XSRF-TOKEN');
};

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

export async function submitRequest(payload: RequestPayload) {
  try {

    const response = await fetch("http://localhost/api/requests/stored", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify({ payload }),
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Error en enviar la petició.");
    }


  } catch (error) {
    console.error('Error enviant la petició:', error);
    throw new Error('No s\'ha pogut enviar la petició. Intenta-ho de nou més tard.');
  }
}

export const searchProfiles = async (query: string) => {
  try {
    const response = await axios.get(`http://localhost/api/profile/searchs?query=${query}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error durant la cerca:', error);
    throw error;
  }
};

// Establir un DJ seleccionat
export const selectDj = (profile: Record<string, any>) => {
  const djData = {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    created_at: profile.created_at,
    role: profile.role,
    image: profile.image,
  };
  setCookie('selected_dj', JSON.stringify(djData), 7);
};


export const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value}; ${expires}; path=/;`;
};
