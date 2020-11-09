import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function WrestlerList(props) {
  const [filteredList, setFilteredList] = useState([]);

  function filterNames(list, filter, order) {
    if (order === "Points") {
      list.sort((a, b) => {
        if (a.points > b.points) {
          return -1;
        } else {
          return 1;
        }
      });
    }
    if (filter !== "All") {
      list = list.filter((wrestler) => {
        return wrestler.promotions.includes(filter);
      });
    }
    const compiled = list.map((wrestler) => {
      return (
        <tr key={wrestler._id}>
          <td>
            <Link to={`/wrestler/${wrestler.name}`}>{wrestler.name}</Link>
          </td>
          <td>{wrestler.points}</td>
        </tr>
      );
    });
    return compiled;
  }

  const onFilterChange = (type) => {
    setFilteredList(filterNames(props.wrestlers, type));
  };

  useEffect(() => {
    if (!props.wrestlers) {
      return;
    }
    setFilteredList(filterNames(props.wrestlers, "All", "Points"));
  }, [props.wrestlers]);

  return (
    <div id="wrestlerList">
      <h3>
        <span className="filterLink" onClick={(e) => onFilterChange("All")}>
          {" "}
          All
        </span>{" "}
        |
        <span className="filterLink" onClick={(e) => onFilterChange("WWE")}>
          {" "}
          WWE
        </span>{" "}
        |
        <span className="filterLink" onClick={(e) => onFilterChange("AEW")}>
          {" "}
          AEW
        </span>{" "}
        |
        <span className="filterLink" onClick={(e) => onFilterChange("NJPW")}>
          {" "}
          NJPW
        </span>
      </h3>

      <table className="wrestlerList">
        <thead>
          <tr>
            <td>Name</td>
            <td>Value</td>
          </tr>
        </thead>
        <tbody>{filteredList}</tbody>
      </table>
    </div>
  );
}
