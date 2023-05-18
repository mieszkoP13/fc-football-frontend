import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import useLocalStorageStatus from "../hooks/useLocalStorageStatus";

const NavBar = (props) => {
  const [isActive, setActive] = useState(false);
  let isLoggedIn = useLocalStorageStatus("token");

  useEffect(() => {
    window.matchMedia("(min-width: 768px)").addEventListener("change", (e) => {
      if (e.matches && isActive) setActive(false);
    });
  });

  useEffect(() => {}, [isLoggedIn]);
  
  const toggleBurger = () => setActive(!isActive);
  const hideBurger = () => setActive(false);

  return (
    <div className="wrapper">
      <button className="burger" onClick={toggleBurger}>
        <i className={`fas ${isActive ? "fa-times" : "fa-bars"}`}></i>
      </button>
      <nav>
        <ul className={isActive ? "active" : null}>
          <li>
            <Link onClick={hideBurger} to="/">Home</Link>
          </li>
          <li>
            <Link onClick={hideBurger} to="/Leagues">Leagues</Link>
          </li>
          <li>
            <Link onClick={hideBurger} to="/FavouriteLeagues">Favourite Leagues</Link>
          </li>
          {isLoggedIn ? (
            <li>
              <Link onClick={hideBurger} to="/users/profile">Profile</Link>
            </li>
          ) : (
            <>
              <li>
                <Link onClick={hideBurger} to="/SignUp">Sign up</Link>
              </li>
              <li>
                <Link onClick={hideBurger} to="/SignIn">Sign in</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;