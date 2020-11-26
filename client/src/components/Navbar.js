import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import WSLogo from "../images/WSLogo.png";

export default function Navbar(props) {
  let history = useHistory();
  let [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/wrestler/${search}`);
    setSearch("");
  };

  return (
    <nav>
      {/* <h1>
        <Link to="/" className="home-button">
          WrestleStocks
        </Link>
      </h1> */}
      <Link to="/" className="navLogoContainer">
        <img src={WSLogo} alt="WrestleStocks Logo" />
      </Link>
      <ul>
        <li>
          <Link to="/wrestlers">Wrestlers</Link>
        </li>
        {!props.username && (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
        {props.username && (
          <li>
            <Link to="/my-profile">{props.username}</Link>
          </li>
        )}
        <li>
          <Link to="/admin">Admin</Link>
        </li>
      </ul>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Find a Wrestler</label>
        <input
          name="search"
          type="text"
          id="searchName"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </form>
    </nav>
  );
}
