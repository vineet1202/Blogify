import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

export default function DeletePost() {
  const { id } = useParams();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    async function deletePost() {
      const response = await fetch(`http://localhost:4000/delete/${id}`, {
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
