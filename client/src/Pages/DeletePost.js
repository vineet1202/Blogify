import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import BASE_URL from "../config";

export default function DeletePost() {
  const { id } = useParams();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    async function deletePost() {
      const response = await fetch(`${BASE_URL}/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setRedirect(true);
      }
    }

    deletePost();
  }, [id]);

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="deletion">
      <p>Deleting post...</p>
      <button onClick={() => setRedirect(true)}>Cancel</button>
    </div>
  );
}
