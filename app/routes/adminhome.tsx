import { LoaderFunction, redirect, json } from '@remix-run/node';
import { Link } from "@remix-run/react";
import { getAuthToken } from "~/auth.server";
import Navbar from "~/components/navbar";

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

const AdminDashboard = () => {
  return (
    <>
    <Navbar />
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-gray-900 text-white overflow-hidden shadow-xl sm:rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            Dashboard de Administració
          </h1>

          <div className="mt-4 flex flex-col space-y-4">
            {/* Botó per gestionar usuaris */}
            <Link
              to="/admin/users"
              className="w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-200"
            >
              Gestionar Usuaris
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;
