import { useLoaderData } from '@remix-run/react';
import { LoaderFunction, json, redirect } from '@remix-run/node';
import SearchComponent from '../components/SearchComponent';
import Navbar from '~/components/navbar';
import { getAuthToken } from '~/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const auth = await getAuthToken(request);
  const res = await fetch(`http://localhost/api/user`, { //http://localhost/api/whoami
    credentials: 'include',
    headers: {
      Cookie: request.headers.get('Cookie') || '',
      Authorization: `Bearer ${auth}`,
      Accept: 'application/json',
    },
  });

  if (res.status !== 200) {
    return redirect('/login'); 
    
  }

  const user = await res.json();
  if (!user) {
    return redirect('/login');
  }

  return json({ user });
};

const Home: React.FC = () => {
 const data = useLoaderData<{
     user: {
       data: {
         created_at: string;
         email: string;
         email_verified_at: string | null;
         google_id: string | null;
         id: number;
         image: string;
         name: string;
         role: string;
         super: string;
         updated_at: string;
       }[];
       message: string;
       success: boolean;
     };
   }>();
   const user = data.user.data[0];

  return (
    <div>
      <Navbar />
      <h2 className="text-2xl font-bold text-center my-6">Buscador de Perfiles</h2>
      {user && (
        <div className="text-center my-4">
          <span className="text-gray-600 dark:text-gray-400">
            Benvingut, {user.name}
          </span>
        </div>
      )}
      <SearchComponent />
    </div>
  );
};

export default Home;
