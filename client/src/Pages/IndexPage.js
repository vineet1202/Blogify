import React, { useState, useEffect, useContext } from "react";
import Post from "../Post";
import { UserContext } from "../UserContext";
import BASE_URL from "../config";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch(`${BASE_URL}/post`).then((response) =>
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
