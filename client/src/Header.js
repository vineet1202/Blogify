import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import logo from "./img3.png";

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include", //sending the credentials to the url
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  async function logout() {
    const response = await fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });
    console.log(response);
    setUserInfo(null);
  }

  const username = userInfo ? userInfo.username : null;

  return (
    <>
      <div className="header">
        <div className="header-div">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          <nav>
            {username && (
              <div className="header_box">
                <Link to="/create">
                  <button
                    className="post_btns"
                    style={{ marginRight: "0.5em" }}
                  >
                    Create new post
                  </button>
                </Link>
                <button className="post_btns" onClick={logout}>
                  Logout
                </button>
              </div>
            )}
            {!username && (
              <div className="header_box">
                <Link
                  to="/login"
                  style={{ marginRight: "30px", fontWeight: "300" }}
                >
                  Login
                </Link>
                <Link to="/register" style={{ fontWeight: "300" }}>
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
