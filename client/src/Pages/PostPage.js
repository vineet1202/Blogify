import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import BASE_URL from "../../config";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${BASE_URL}/post/${id}`);
        const postInfo = await response.json();
        setPostInfo(postInfo);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, []);
  if (!postInfo) return "";

  return (
    <div className="post__page">
      <h1>{postInfo.title}</h1>
      <div>
        <div className="author">{postInfo.author}</div>
        <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      </div>
      {userInfo !== null && userInfo.username === postInfo.author && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            Edit this post
          </Link>
          <br></br>
          <Link to={`/delete/${postInfo._id}`}>Delete this post</Link>
        </div>
      )}
      <div className="postpage__image">
        <img src={postInfo.cover} alt="" />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
}
