import { redirect, useLoaderData } from "@remix-run/react";
import axios from "axios";
import { getAuthToken } from "~/auth.server";
import { json, LoaderFunction } from "@remix-run/node";
import Navbar from "~/components/navbar";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  image: string;
  google_id: string | null;
}

export const loader: LoaderFunction = async ({ request }) => {
  const token = await getAuthToken(request);
  const res = await fetch(`http://localhost/api/user`, {///api/whoami
    credentials: "include",
    headers: {
      Cookie: request.headers.get("Cookie") || "",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== 200) {
    return redirect("/login");
  }

  const user = await res.json();
  if (!user) {
    return redirect("/login");
  }

  return json({ user, token });
};

const ProfileEdit: React.FC = () => {
  const data = useLoaderData<{
    user: {
      data: {
        id: number;
        name: string;
        email: string;
        image: string;
        google_id: string | null;
      }[];
    };
    token: string;
  }>();

  const initialUser = data.user.data[0];
  const token = data.token;

  const [user, setUser] = useState<User>({
    id: initialUser.id,
    name: initialUser.name,
    email: initialUser.email,
    password: "",
    image: initialUser.image,
    google_id: initialUser.google_id,
  });

  const [imagePreview, setImagePreview] = useState<string>(initialUser.image);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Append user fields
      Object.entries(user).forEach(([key, value]) => {
        if (key !== "image") {
          formData.append(key, value as string);
        }
      });

      // Append the file if selected
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const response = await axios.put(
        `http://localhost/api/admin/users/user/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Profile updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
    <Navbar />
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-purple-400 mb-4 text-center">
          Edita El teu perfil
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="space-y-2">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-300"
            >
              Profile Picture:
            </label>
            <div className="flex items-center space-x-4">
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-20 h-20 rounded-full border-2 border-gray-600"
              />
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-gray-400"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Leave empty to keep current password"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default ProfileEdit;
