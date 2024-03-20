import React from "react";
import { Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";

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
        {/* <div className="post__img-box"> */}
        <Link to={`/post/${_id}`}>
          <img
            // src={"http://localhost:4000/" + cover}
            src={cover}
            alt="post-img"
            className="post__img"
          ></img>
        </Link>
        {/* </div> */}
        <div className="post__content-box">
          <h2 className="post__title">
            <Link to={`/post/${_id}`}>{title}</Link>
          </h2>
          <p className="post__info">
            <a className="post__author" href="*">
              {author}
            </a>
            <br />
            {/* <time>{formatISO9075(new Date(createdAt))}</time> */}
          </p>
          <p className="post__desc">{summary}</p>
        </div>
      </div>
    </>
  );
}
