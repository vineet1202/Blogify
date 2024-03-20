import React, { useState, useEffect, useContext } from "react";
import Post from "../Post";
import { UserContext } from "../UserContext";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:4000/post").then((response) =>
      response.json().then((posts) => setPosts(posts))
    );
  }, []);
  return (
    <>
      <div className="posts-page">
        {userInfo !== null && userInfo.username ? (
          <p className="user">Welcome, {userInfo.username}</p>
        ) : null}
        <p className="line"></p>
        <p className="bottom">TODAY'S PICKS</p>
        {posts.length > 0 &&
          posts.map((post) => <Post {...post} key={post._id} />)}
      </div>
    </>
  );
}
