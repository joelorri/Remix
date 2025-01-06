import React, { useEffect, useState } from "react";
import { LoaderFunction, redirect, json } from "react-router-dom";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { getAuthToken } from "~/auth.server";
import axios from "axios";

export const loader: LoaderFunction = async ({ request }) => {
  const authToken = await getAuthToken(request);
  if (!authToken) {
    console.error("No s'ha trobat el token d'autenticació.");
    return redirect("/login");
  }

  const res = await fetch(`http://localhost/api/user`, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (res.status !== 200) {
    console.error("Error en obtenir l'usuari des de l'API:", res.status);
    return redirect("/login");
  }

  const user = await res.json();
  if (!user) {
    console.error("No s'ha pogut obtenir la informació de l'usuari.");
    return redirect("/login");
  }

  return json({ user, authToken });
};

const SubmitFormRoute: React.FC = () => {
  const { authToken } = useLoaderData<{ user: any; authToken: string }>(); // Obtenim el token del loader
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const submitRequest = async () => {
      const payload = JSON.parse(localStorage.getItem("formPayload") || "{}");

      try {
        // Obtenim el token CSRF del meta tag
        const csrfToken = document
          .querySelector('meta[name="csrf-token"]')
          ?.getAttribute("content");

        console.log("authToken:", authToken);
        console.log("payload:", payload);
        console.log("csrfToken:", csrfToken);

        // Fem la petició POST amb Axios
        const response = await axios.post(
          "http://localhost/api/requests/stored",
          payload,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-CSRF-TOKEN": csrfToken || "", // Token CSRF
            },
            withCredentials: true, // Necessari per enviar cookies
          }
        );

        console.log("Resultat:", response.data);
        navigate("/success");
      } catch (err: any) {
        if (err.response) {
          setError(
            `Error en enviar la petició: ${err.response.data?.message || "Error del servidor"}`
          );
        } else if (err.request) {
          setError("No s'ha rebut cap resposta del servidor.");
        } else {
          setError(err.message || "Hi ha hagut un error.");
        }
        console.error("Error en enviar la petició:", err);
      } finally {
        setIsSubmitting(false);
      }
    };

    submitRequest();
  }, [authToken, navigate]);

  if (isSubmitting) {
    return <p>Enviant les dades...</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SubmitFormRoute;
