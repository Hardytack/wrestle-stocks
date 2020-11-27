import React from "react";
import { Link } from "react-router-dom";

export default function WrestlerBox(props) {
  return (
    <div className="wrestlerBox">
      <h1>{props.promotion}</h1>
      <Link to={`/wrestler/${props.wrestler.name}`}>
        <img src={props.wrestler.picture} alt="Wrestlers" />
        <h2>{props.wrestler.name}</h2>
        <h3>{props.wrestler.points}</h3>
      </Link>
    </div>
  );
}
