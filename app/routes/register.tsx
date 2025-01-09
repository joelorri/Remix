import { Form, useActionData } from "@remix-run/react";
import { ActionFunction, json, redirect } from "@remix-run/node";
import { register } from "~/auth.server"; // Ajusta la ruta según tu lógica de backend


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const password_confirmation = formData.get("password_confirmation") as string;

  try {
    await register({ name, email, password, password_confirmation });
    return redirect("/login");
  } catch (error) {
    console.error("Register Error:", error);
    return json({ error: "Registration failed. Please try again." }, { status: 400 });
  }
};

export default function Register() {
  const actionData = useActionData<{ error?: string }>();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-purple-400 text-center mb-6">Register</h2>

        {actionData?.error && (
          <p className="text-red-500 text-center mb-4">{actionData.error}</p>
        )}

        <Form method="post" className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 bg-gray-700 text-gray-100 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-gray-700 text-gray-100 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 bg-gray-700 text-gray-100 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              required
              className="w-full px-4 py-3 bg-gray-700 text-gray-100 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between mt-4">
            <a
              href="/login"
              className="text-sm text-gray-400 hover:text-gray-300"
            >
              Already have an account? Login
            </a>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-indigo-500"
            >
              Register
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
