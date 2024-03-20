import React from "react";
import { Link } from "react-router-dom";

export default function Post({
  _id,
  title,
  summary,
  content,
  cover,
  author,
  createdAt,
}) {
  return (
    <>
      <div className="post">
        <Link to={`/post/${_id}`}>
          <img src={cover} alt="post-img" className="post__img"></img>
        </Link>
        <div className="post__content-box">
          <h2 className="post__title">
            <Link to={`/post/${_id}`}>{title}</Link>
          </h2>
          <p className="post__info">
            <a className="post__author" href="*">
              {author}
            </a>
            <br />
          </p>
          <p className="post__desc">{summary}</p>
        </div>
      </div>
    </>
  );
}
