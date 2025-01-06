import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SubmitForm: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const payload = JSON.parse(localStorage.getItem("formPayload") || "{}");
    if (!payload || !Object.keys(payload).length) {
      setError("No s'han trobat dades per enviar.");
      setTimeout(() => navigate("/formdj"), 3000);
      return;
    }

    const submitRequest = async () => {
      setIsSubmitting(true);
      try {
        const response = await fetch("http://localhost/api/requests/stored", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error en enviar la petició: ${errorData.message}`);
        }

        const result = await response.json();
        console.log("Resultat:", result);
        navigate("/success");
      } catch (err: any) {
        console.error("Error en enviar la petició:", err);
        setError(err.message || "Hi ha hagut un error.");
      } finally {
        setIsSubmitting(false);
      }
    };

    submitRequest();
  }, [navigate]);

  if (isSubmitting) {
    return <p>Enviant les dades...</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-900 dark:text-gray-100">
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SubmitForm;
