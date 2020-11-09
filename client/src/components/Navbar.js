import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

export default function Navbar() {
  let history = useHistory();
  let [search, setSearch] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/wrestler/${search}`);
    setSearch("");
  };
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/admin">Admin</Link>
        </li>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            name="search"
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </form>
      </ul>
    </nav>
  );
}
